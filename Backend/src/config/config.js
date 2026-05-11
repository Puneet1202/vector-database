import 'dotenv/config';

// 1. Dynamic Threshold Mapping (Data ke nature ke hisaab se)
export const THRESHOLD_CONFIG = {
  'corporate_staff_v1': 0.5,    // Employees ke liye
  'office_policies': 0.6,      // HR Rules/Policies ke liye
  'product_v1': 0.45,          // Product details ke liye (Moderate Strict)
  'movies': 0.35,              // Entertainment ke liye (Flexible)
  'default': 0.4               // Back-up threshold`
  
  
};

export const SEARCH_COUNT = 5;

// 2. Main Config Object
export const config = {
  port: process.env.PORT || 8000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  // Ab hum pure mapping object ko yahan rakh rahe hain
  thresholds: THRESHOLD_CONFIG,
  searchCount: SEARCH_COUNT
};

// --- Sir wala Simple Validation Logic ---
// Isse sirf zaroori credentials check honge
const requiredKeys = ['supabaseUrl', 'supabaseKey'];
requiredKeys.forEach(key => {
  if (!config[key]) {
    console.error(`❌ Error: ${key} is missing in .env file!`);
    process.exit(1);
  }
});

console.log(`✅ Server Config Loaded. Running on port ${config.port}`);