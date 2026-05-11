// src/services/importService.js
import fs from 'fs';
import { dbWrapper } from './dbWrapper.js';

export const processImport = async (filePath, collectionName) => {
    const fileExtension = filePath.split('.').pop().toLowerCase();
    const rawData = fs.readFileSync(filePath, 'utf-8');
    let parsedData = [];

    if (fileExtension === 'json') {
        parsedData = JSON.parse(rawData);
    } 

    const finalRows = parsedData.map(item => ({
        content: item.content || item.text || JSON.stringify(item), 
        is_processed: false,
        // YE HAI MAGIC LINE: Har data ke saath uska 'Folder' ya 'Source' name jayega
        metadata: { 
            source: filePath, 
            collection: collectionName, 
            imported_at: new Date() 
        }
    }));

    console.log(`⏳ Importing to [${collectionName}]...`);
    await dbWrapper.insertMany('notes', finalRows);
};