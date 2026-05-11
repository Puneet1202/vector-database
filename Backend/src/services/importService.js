// src/services/importService.js
import fs from 'fs';
import { dbWrapper } from './dbWrapper.js';

export const processImport = async (filePath, collectionName) => {
    const fileExtension = filePath.split('.').pop().toLowerCase();
    const rawData = fs.readFileSync(filePath, 'utf-8');
    let parsedData = JSON.parse(rawData);

    // FIX: Agar data DummyJSON jaisa hai (object ke andar list), toh use nikaal lo
    // Ye check karega ki agar 'products' ya 'recipes' ki key hai, toh wahi data use kare
    if (!Array.isArray(parsedData)) {
        if (parsedData.products) parsedData = parsedData.products;
        else if (parsedData.recipes) parsedData = parsedData.recipes;
        else if (parsedData.users) parsedData = parsedData.users;
        else {
            // Agar koi aur unknown format hai toh error na aaye
            throw new Error("❌ Data format not recognized. It should be an array or contain products/recipes.");
        }
    }

    const finalRows = parsedData.map(item => ({
        // DummyJSON ke products mein 'description' hota hai aur recipes mein 'name'
        content: item.description || item.name || item.content || JSON.stringify(item), 
        is_processed: false,
        metadata: { 
            ...item, // Sara extra data (price, rating, etc.) metadata mein dal do
            source: filePath, 
            collection: collectionName, 
            imported_at: new Date() 
        }
    }));

    console.log(`⏳ Importing ${finalRows.length} items into [${collectionName}]...`);
    await dbWrapper.insertMany('notes', finalRows);
};