import { createClient } from "@supabase/supabase-js"

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a simple Supabase client with minimal configuration
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
})

// Test connection
console.log("Supabase client initialized with URL:", supabaseUrl)

export default supabase

