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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173'
      }
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        console.log('Admin user already exists. You can use these credentials:');
        console.log('Email:', email);
        console.log('Password:', password);
        return;
      }
      throw error;
    }

    if (data.user) {
      console.log('Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('\nIMPORTANT: Please check your email to confirm your account!');
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();