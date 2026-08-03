import { supabase } from './supabase-database';

// Helper to get the current user, reduces repetition
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not logged in");
  return user;
}

/* ============ HOMES ============ */

// GET all homes of the logged-in user with their products
export async function getHomesWithProducts() {
  const { data: { user } } = await supabase.auth.getUser(); // Keep this check for non-throwing behavior
  if (!user) {
    console.log("No user logged in, returning empty array.");
    return [];
  };

  const { data, error } = await supabase
    .from('homes')
    .select('*, products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// ADD a home
export async function addHome(name) {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('homes')
    .insert({ user_id: user.id, name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// UPDATE a home's name
export async function updateHomeName(homeId, newName) {
  const { data, error } = await supabase
    .from('homes')
    .update({ name: newName })
    .eq('id', homeId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// REMOVE a home (its products should auto-delete via cascade in DB setup)
export async function removeHome(homeId) {
  const { error } = await supabase
    .from('homes')
    .delete()
    .eq('id', homeId);
  if (error) throw error;
  return true;
}

/* ============ PRODUCTS ============ */

// ADD a product to a home
export async function addProduct(homeId, productData) {
  // Map frontend camelCase to database snake_case
  const productToInsert = {
    home_id: homeId,
    stock_type: productData.stockType,
    product: productData.product,
    quantity: productData.quantity,
    expiry_date: productData.expiryDate || null, // Convert empty string to null for date type
    availability: productData.availability,
  };
  const { data, error } = await supabase
    .from('products')
    .insert(productToInsert)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// UPDATE a product
export async function updateProduct(productId, fields) {
  // Map frontend camelCase to database snake_case
  const fieldsToUpdate = {
    ...(fields.stockType !== undefined && { stock_type: fields.stockType }),
    ...(fields.product !== undefined && { product: fields.product }),
    ...(fields.quantity !== undefined && { quantity: fields.quantity }),
    ...(fields.expiryDate !== undefined && { expiry_date: fields.expiryDate || null }),
    ...(fields.availability !== undefined && { availability: fields.availability }),
  };
  const { data, error } = await supabase
    .from('products')
    .update(fieldsToUpdate)
    .eq('id', productId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// REMOVE a product
export async function removeProduct(productId) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  if (error) throw error;
  return true;
}