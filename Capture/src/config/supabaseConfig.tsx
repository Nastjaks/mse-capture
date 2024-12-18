import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://ecvojbzizwqiemboachu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdm9qYnppendxaWVtYm9hY2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjI0NDQsImV4cCI6MjA1MDAzODQ0NH0.3uGw1iL-ekmp3j0WqtKI2EK5bl7CMRj1F9FqoqL6IFs'; // Dein Anon Key

export const supabase = createClient(supabaseUrl, supabaseKey);
