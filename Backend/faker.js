// import { supabase } from './src/utils/supabase.js';
// import { generateEmbedding } from './src/services/aiService.js';

// const dummyNotes = [
//     "I love eating spicy street food in the evening.",
//     "JavaScript is the backbone of modern web development.",
//     "The sunset at the beach was absolutely breathtaking.",
//     "React's useEffect hook can be tricky for beginners.",
//     "Homemade pizza with extra cheese is my comfort food.",
//     "Learning system design is crucial for software engineers.",
//     "A walk in the forest helps clear my mind.",
//     "Node.js allows you to run JavaScript on the server.",
//     "Traditional Indian spices make every dish better.",
//     "Exploring new cities is my favorite way to spend holidays.",
//     "Database indexing significantly speeds up your queries.",
//     "Healthy breakfast starts with fresh fruits and oats.",
//     "Cloudflare Workers are great for serverless computing.",
//     "The smell of rain on dry earth is wonderful.",
//     "SQL vs NoSQL: choosing the right database for your project.",
//     "Hiking in the Himalayas is a life-changing experience.",
//     "Baking chocolate cake is a therapeutic activity.",
//     "Docker containers make deployment so much easier.",
//     "Street photography captures the essence of daily life.",
//     "Understanding BSON format is important for MongoDB users.",
//     "I prefer cold coffee over hot tea in summers.",
//     "Git branches help in managing complex features.",
//     "The history of ancient Rome is full of surprises.",
//     "Full-stack development requires learning many skills.",
//     "Yoga and meditation improve focus and mental health.",
//     "Writing clean code is a sign of a professional developer.",
//     "The Great Wall of China is an architectural marvel.",
//     "Vegetarian sushi can be surprisingly delicious.",
//     "Microservices architecture vs Monolith: the big debate.",
//     "Reading books under a tree is very peaceful.",
//     "PostgreSQL is a powerful relational database.",
//     "Traveling solo teaches you a lot about yourself.",
//     "The taste of Alphonso mangoes is unmatched.",
//     "Debugging code late at night is a common dev life.",
//     "Space exploration is the next frontier for humanity.",
//     "Drinking enough water is essential for glowing skin.",
//     "Learning Rust language for better performance.",
//     "Grandma's handmade pickles are the best.",
//     "Cybersecurity is more important than ever today.",
//     "Scuba diving allows you to see a whole new world.",
//     "React Native is great for cross-platform mobile apps.",
//     "A cup of green tea in the morning is refreshing.",
//     "Artificial Intelligence is changing the way we work.",
//     "Watching the stars on a clear night is magical.",
//     "Tailwind CSS makes UI design very fast.",
//     "Learning to play the guitar is my new hobby.",
//     "Vector databases are the future of AI search.",
//     "The architecture of modern skyscrapers is amazing.",
//     "Breakfast in Paris: croissants and coffee.",
//     "Optimizing API performance for low latency.",
//     "Playing football with friends on weekends.",
//     "Learning about account aggregator frameworks in India.",
//     "The color of autumn leaves is so vibrant.",
//     "Building a personal finance tracker using React.",
//     "The sound of ocean waves is very relaxing.",
//     "Using Redis for high-performance caching.",
//     "A bowl of hot ramen is perfect for rainy days.",
//     "Mastering the command line saves a lot of time.",
//     "The Northern Lights are a natural wonder.",
//     "Implementing OCR in mobile applications.",
//     "Sweet lassi is the perfect drink for North Indian summers.",
//     "The joy of solving a difficult bug is immense.",
//     "Visiting the pyramids of Giza was my dream.",
//     "A well-designed UI improves user experience.",
//     "Learning about serverless architecture and its benefits.",
//     "The crisp air of the mountains is so fresh.",
//     "Trying out different types of Italian pasta.",
//     "Using TypeScript for type-safe JavaScript code.",
//     "The vibrant culture of Rajasthan is inspiring.",
//     "Learning how to deploy apps on AWS.",
//     "Organic gardening in the backyard is fun.",
//     "Understanding the logic of live bank tracking APIs.",
//     "The beauty of cherry blossoms in Japan.",
//     "Building a real-time chat app with Socket.io.",
//     "A healthy diet leads to a productive day.",
//     "The thrill of driving on a coastal road.",
//     "Learning about vector similarity search techniques.",
//     "The art of making perfect espresso at home.",
//     "Working from a quiet cafe is very productive.",
//     "How to manage sessions in a React application.",
//     "The historical significance of the Taj Mahal.",
//     "Developing a local RAG module using Ollama.",
//     "Soft music in the background while working.",
//     "The spicy flavor of Hyderabadi Biryani.",
//     "Using MongoDB for flexible data modeling.",
//     "The experience of skydiving was terrifying but fun.",
//     "Learning about different design patterns in software.",
//     "Fresh coconut water is very hydrating.",
//     "Exploring the old streets of Varanasi.",
//     "Building a weather app with live API data.",
//     "The smell of freshly baked bread in the morning.",
//     "Using GraphQL for efficient data fetching.",
//     "The calm atmosphere of a library.",
//     "Learning how to secure your REST APIs.",
//     "A plate of hot momos with spicy chutney.",
//     "The importance of peer reviews in coding.",
//     "Watching a sunrise from the top of a hill.",
//     "Implementing dark mode in your web applications.",
//     "The distinct taste of filter coffee from South India.",
//     "Building a portfolio website to showcase my work."
// ];
// async function seedNotes() {
//     console.log("🚀 Starting Seeding with Nomic Model...");
    
//     let totalStartTime = performance.now();
//     let totalMemoryBefore = process.memoryUsage().heapUsed / 1024 / 1024; // MB mein

//     for (let i = 0; i < dummyNotes.length; i++) {
//         const text = dummyNotes[i];
        
//         // Per-embedding timer start
//         const startTime = performance.now();
        
//         try {
//             // 1. Embedding generate karo
//             const embedding = await generateEmbedding(text);
//             const endTime = performance.now();
            
//             // 2. Supabase mein insert karo
//             const { error } = await supabase
//                 .from('notes')
//                 .insert([{ content: text, embedding }]);

//             if (error) throw error;

//             // Stats Calculate Karo
//             const timeTaken = (endTime - startTime).toFixed(2); // milliseconds
//             const vectorSizeMB = (embedding.length * 8) / (1024 * 1024); // Approximation of vector size in MB
//             const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;

//             console.log(`✅ [${i + 1}/100]`);
//             console.log(`   ⏱️ Time: ${timeTaken}ms`);
//             console.log(`   📏 Vector Size: ${vectorSizeMB.toFixed(6)} MB`);
//             console.log(`   🧠 RAM Usage: ${currentMemory.toFixed(2)} MB`);
//             console.log(`-----------------------------------------`);

//         } catch (err) {
//             console.error(`❌ Error at index ${i}:`, err.message);
//         }
//     }

//     let totalEndTime = performance.now();
//     let totalTimeSec = ((totalEndTime - totalStartTime) / 1000).toFixed(2);
    
//     console.log(`✨ Seeding Completed!`);
//     console.log(`📊 Total Time Taken: ${totalTimeSec} seconds`);
//     console.log(`🏁 Average Speed: ${(totalTimeSec / dummyNotes.length).toFixed(2)} sec/note`);
// }

// seedNotes();

import { supabase } from './src/utils/supabase.js';
import { generateEmbedding } from './src/services/aiService.js';
import pidusage from 'pidusage';
import { faker } from '@faker-js/faker';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function seedWithFullSystemMetrics(totalCount = 1000) {
    console.log(`\n🚀 MISSION: INGESTING ${totalCount} SYNTHETIC REAL-LOOKING ARTICLES`);
    console.log(`📊 MONITORING: CPU, RAM, LATENCY, & OLLAMA LOAD\n`);

    const missionStart = performance.now();

    for (let i = 0; i < totalCount; i++) {
        try {
            // 1. Faker se Data Generate karo
            const title = faker.hacker.phrase(); // Hacker style title
            const body = faker.lorem.sentences(2); // 2 bade sentences
            const text = `${title}: ${body}`;

            // 2. AI Embedding (The Load-Heavy Part)
            const aiStart = performance.now();
            const embedding = await generateEmbedding(text);
            const aiEnd = performance.now();

            // 3. Database Sync
            const dbStart = performance.now();
            const { error } = await supabase.from('notes').insert([{ content: text, embedding }]);
            const dbEnd = performance.now();
            if (error) throw error;

            // 4. System Metrics Capture
            const stats = await pidusage(process.pid);

            // --- THE DASHBOARD LOG ---
            console.log(`✅ [${i + 1}/${totalCount}] Generated: "${title.substring(0, 30)}..."`);
            console.log(`   ⚡ AI Speed: ${(aiEnd - aiStart).toFixed(2)}ms | DB: ${(dbEnd - dbStart).toFixed(2)}ms`);
            console.log(`   🖥️  System: CPU ${stats.cpu.toFixed(1)}% | RAM ${(stats.memory / 1024 / 1024).toFixed(2)} MB`);
            
            const aiLatency = aiEnd - aiStart;
            let loadStatus = aiLatency < 150 ? "🟢 Cool (GPU)" : aiLatency < 500 ? "🟡 Warm (Mixed)" : "🔴 Heavy (CPU)";
            console.log(`   🤖 Ollama Pressure: ${loadStatus}`);
            console.log(`--------------------------------------------------`);

            await delay(50); // Speed badhane ke liye delay kam kar diya

        } catch (err) {
            console.error(`❌ ERROR at [${i}]:`, err.message);
            await delay(2000); 
        }
    }

    const missionEnd = performance.now();
    const totalMin = ((missionEnd - missionStart) / 1000 / 60).toFixed(2);
    console.log(`\n✨ MISSION COMPLETE!`);
    console.log(`⏱️ Total Time: ${totalMin} minutes`);
    pidusage.clear(); 
}

seedWithFullSystemMetrics(1000);