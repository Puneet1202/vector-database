import 'dotenv/config';

export const config = {
  port: process.env.PORT || 8000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  // Kal ko yahan AI_KEY aayegi toh wo bhi check ho jayegi
};

console.log(`Server is running on port ${config.port}`);
// --- Sir wala Simple Validation Logic ---
Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    console.error(`❌ Error: ${key} is missing in .env file!`);
    process.exit(1);
  }
});

