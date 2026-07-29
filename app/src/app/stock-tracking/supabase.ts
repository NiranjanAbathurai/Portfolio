import { createClient } from '@supabase/supabase-js';

// These credentials were found in the supabase-database.js file.
// For better security, it's highly recommended to move these to environment variables.
const supabaseUrl = 'https://mskobghlcvvvlljfkbpr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za29iZ2hsY3Z2dmxsamZrYnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTQ0NTQsImV4cCI6MjEwMDg5MDQ1NH0.W6lUU5Pm7ErdSDf8_4nML5gzCscLgpBhsmmgaFhGlxM';

export const supabase = createClient(supabaseUrl, supabaseKey);