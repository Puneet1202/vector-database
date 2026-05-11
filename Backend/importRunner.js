import { processImport } from './src/services/importService.js';

// 1. Apni file ka path yahan dalo
const fileToImport = './big_company_data.json'; 

// 2. Collection ka ek hi sahi naam rakho (Corporate data hai toh wahi naam do)
const collectionName = 'corporate_staff_v1'; 

console.log(`🚀 Starting Import: ${fileToImport} into Collection: ${collectionName}...`);

processImport(fileToImport, collectionName)
    .then(() => {
        console.log("✅ Data successfully pushed to Database!");
        console.log("💡 Check your Worker terminal, AI should be starting the embedding process now.");
    })
    .catch(err => {
        console.error("❌ Error during import process:");
        console.error(err.message);
    });