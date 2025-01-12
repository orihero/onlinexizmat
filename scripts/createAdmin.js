import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  const email = 'aka.orihero@gmail.com';
  const password = 'admin123456';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        // If login fails, try to create the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'http://localhost:5173'
          }
        });

        if (signUpError) throw signUpError;

        console.log('Admin user created successfully!');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('\nIMPORTANT: Please check your email to confirm your account!');
        return;
      }
      throw error;
    }

    console.log('Admin user already exists and credentials are valid.');
    console.log('Email:', email);
    console.log('Password:', password);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();