// Netlify Scheduled Function: expiry-notification.js
//
// This function runs on a schedule (e.g., daily) to check for expired products
// and send email notifications to users.

// To use Supabase and EmailJS, you'll need to install them in your project:
// npm install @supabase/supabase-js @emailjs/nodejs

// Load .env when running locally (must be before importing config that reads process.env)
try { require('dotenv').config(); } catch (e) {}

const { createClient } = require('@supabase/supabase-js');
const emailjs = require('@emailjs/nodejs');
const { SUPABASE_URL, SUPABASE_SERVICE_SECRET_KEY } = require('./supabase-config');

// EmailJS config
const EMAILJS_SERVICE_ID = 'service_jzegqtm';
const EMAILJS_TEMPLATE_ID = 'template_35vnbvu'; // A specific template for expiry notifications
const EMAILJS_PUBLIC_KEY = 'rPoWSI2KJiDg4uFaI';
const EMAILJS_PRIVATE_KEY = 'bT2hT100y3cLHH83zsT7v';

exports.handler = async (event, context) => {
  console.log('Running daily expiry check...');

  // 1. Validate environment variables
  if (!SUPABASE_URL || !SUPABASE_SERVICE_SECRET_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    const errorMessage = 'Missing required environment variables for Supabase or EmailJS.';
    console.error(errorMessage);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }

  // Initialize Supabase client with service role key to bypass RLS
  // The service role key bypasses Row Level Security, allowing the cron job
  // to read all users' products without an authenticated session.
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_SECRET_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    // 2. Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    console.log(`Checking for products expired before: ${today}`);

    // 3. Fetch all expired products from Supabase
    // This query assumes:
    // - A 'products' table with 'expiry_date', 'product' (name), and 'home_id'.
    // - A 'homes' table with 'id', 'name', and 'user_id'.
    // - The 'user_id' in 'homes' is a foreign key to Supabase's 'auth.users' table's 'id'.
    const { data: expiredProducts, error } = await supabase
      .from('products')
      .select(`
        product,
        expiry_date,
        homes (
          name,
          user_id
        )
      `)
      .not('expiry_date', 'is', null) // Exclude products without expiry date
      .lt('expiry_date', today) // Use 'less than' to match UI logic (expired = before today)
      .eq('availability', 'Yes'); // Only check available products

    console.log(`Query result: ${expiredProducts ? expiredProducts.length : 0} products found, error: ${error ? error.message : 'none'}`);

    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    if (!expiredProducts || expiredProducts.length === 0) {
      console.log('No expired products found.');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No expired products found.' }),
      };
    }

    console.log(`Found ${expiredProducts.length} expired products. Processing notifications...`);

    // 4. Group expired products by user
    const userNotifications = {};

    for (const p of expiredProducts) {
      if (p.homes && p.homes.user_id) {
        const userId = p.homes.user_id;
        if (!userNotifications[userId]) {
          // Fetch the user's email using the admin client
          const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);

          if (userError || !user) {
            console.error(`Could not fetch user for ID ${userId}:`, userError?.message);
            continue; // Skip to next product
          }
          
          userNotifications[userId] = {
            email: user.email,
            username: user.user_metadata?.username || user.email, // Get username, fallback to email
            products: [],
          };
        }
        userNotifications[userId].products.push({
          productName: p.product,
          homeName: p.homes.name,
          expiryDate: p.expiry_date,
        });
      }
    }

    // 5. Send one email per user with all their expired items
    for (const userId in userNotifications) {
      const notification = userNotifications[userId];
      const { email, username, products } = notification;

      // Format the list of products for the email body
      const productListHtml = products.map(p => 
        `<li><b>${p.productName}</b> in home '<em>${p.homeName}</em>' expired on ${p.expiryDate}.</li>`
      ).join('');

      const templateParams = {
        to_email: email,
        username: username, // Add username to template parameters
        // Assuming your EmailJS template has variables like {{product_list_html}} and {{item_count}}
        product_list_html: `<ul>${productListHtml}</ul>`,
        item_count: products.length,
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
          publicKey: EMAILJS_PUBLIC_KEY,
          privateKey: EMAILJS_PRIVATE_KEY,
        });
        console.log(`Successfully sent expiry notification to ${email}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${email}:`, emailError);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Processed ${Object.keys(userNotifications).length} user notifications.` }),
    };

  } catch (error) {
    console.error('An error occurred during the expiry check:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};