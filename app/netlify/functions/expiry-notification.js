// Netlify Scheduled Function: expiry-notification.js
//
// Previously sent email notifications for expired products.
// Email notifications have been disabled — only in-app notifications are used now.
// This function is kept as a placeholder to prevent Netlify schedule errors.

exports.handler = async (event, context) => {
  console.log('Expiry notification function called — email notifications disabled.');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Email notifications disabled. Using in-app notifications only.' }),
  };
};
