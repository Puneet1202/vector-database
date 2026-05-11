import 'dotenv/config';

// 1. Pehle variables define karo
export const SEARCH_THRESHOLD = 0.7;
export const SEARCH_COUNT = 5;

// 2. Phir config object banao
export const config = {
  port: process.env.PORT || 8000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  // Agar aap chaho toh inhen yahan bhi add kar sakte ho bina 'export' keyword ke
  searchThreshold: SEARCH_THRESHOLD,
  searchCount: SEARCH_COUNT
};

console.log(`Server is running on port ${config.port}`);

// --- Sir wala Simple Validation Logic ---
Object.entries(config).forEach(([key, value]) => {
  if (!value && value !== 0) { // Check for 0 too because threshold could be 0
    console.error(`❌ Error: ${key} is missing in .env file!`);
    process.exit(1);
  }
});