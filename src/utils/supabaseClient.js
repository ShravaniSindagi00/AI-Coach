import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tuacpojziszdfvrreivb.supabase.co'; // your project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YWNwb2p6aXN6ZGZ2cnJlaXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjI2MDIsImV4cCI6MjA2NjMzODYwMn0.6qxPAWuruJ0dfD_Mh4apjUlvJOc6-DSEGqaZkiR0vMo'; // your anon/public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
