// 1. CONFIGURATION (Ise aap .env file mein bhi rkh skte ho)
const OLLAMA_URL = "http://localhost:11434/api/embeddings";
const MODEL_NAME = "nomic-embed-text";

export const generateEmbedding = async (text) => {   //input m text le rha hai or vector vps m dalne ke liye usko number array m convert kr rha hai 
    // 2. REQUEST BODY (Jo Ollama ko chahiye)
    const requestData = {
        model: MODEL_NAME,  ///Kaunsa brain use karna hai? (llama3)
        prompt: text,  //Kis cheez ka vector banana hai? (text)
    };

    try {
        // 3. POST REQUEST (AI se baat karna)
        const response = await fetch(OLLAMA_URL, {
            method: "POST",  //method: "POST": Kyunki hum data bhej rahe hain.
            headers: {
                "Content-Type": "application/json", //header: {"Content-Type": "application/json"}: AI ko batana ki hum JSON bhej rahe hain.
            },
            body: JSON.stringify(requestData), //body: JSON.stringify(requestData): Data ko OLAMA ke samajh aane wale format (JSON) mein badalna.
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`); // Agar koi error aaya toh yahan pakda jayega.
        }

        const result = await response.json();

        // 4. RESPONSE (Numbers ki array nikalna)
        // Llama 3 humein result.embedding mein array deta hai
        return result.embedding; 

    } catch (error) {
        console.error("AI Service Error:", error.message);
        throw error;
    }
};