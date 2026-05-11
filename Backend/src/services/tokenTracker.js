// src/services/tokenTracker.js
// Pehle terminal mein ye install kar lena: npm install tiktoken
import { get_encoding } from "tiktoken";

const enc = get_encoding("cl100k_base");

export const countTokens = (text) => {
    if (!text || typeof text !== 'string') return 0;
    return enc.encode(text).length;
};

export const logUsage = (action, inputTokens, outputTokens, userId = "Puneet_Kumar") => {
    const total = inputTokens + outputTokens;
    // console.log(`\n--- 📊 TOKEN USAGE REPORT ---`);
    // console.log(`🔹 Action: ${action}`);
    // console.log(`📥 Input Tokens: ${inputTokens}`);
    // console.log(`📤 Output Tokens: ${outputTokens}`);
    // console.log(`💰 Total: ${total} Tokens`);
    // console.log(`-----------------------------\n`);
};