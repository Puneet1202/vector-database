import { processImport } from './src/services/importService.js';

// 1. Apni file ka path yahan dalo
const fileToImport = './my_data.json'; 

// 2. Is data ko kya naam dena chahte ho? (e.g., 'Bank_Data', 'Personal_Notes', 'Office_Project')
// Isse database mein "Folders" jaisa kaam hoga
const collectionName = 'New_Import_May_2026';

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