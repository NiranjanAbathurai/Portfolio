// Common Supabase configuration for Netlify Functions
// Centralized config to avoid duplication across functions

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mskobghlcvvvlljfkbpr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za29iZ2hsY3Z2dmxsamZrYnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTQ0NTQsImV4cCI6MjEwMDg5MDQ1NH0.W6lUU5Pm7ErdSDf8_4nML5gzCscLgpBhsmmgaFhGlxM';
// Service Role Key should be set in Netlify Environment Variables for admin operations
const SUPABASE_SERVICE_SECRET_KEY = process.env.SUPABASE_SERVICE_SECRET_KEY || SUPABASE_ANON_KEY;

module.exports = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_SECRET_KEY,
};
