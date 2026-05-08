// Search function ke andar ka logic
const query = "React is great";
const vector = await generateEmbedding(query);

// Hum 'EXPLAIN ANALYZE' prefix add kar rahe hain technical report ke liye
const { data, error } = await supabase.rpc('get_search_report', {
    query_embedding: vector,
    match_threshold: 0.5,
    match_count: 5
});

// Terminal par report print karne ke liye
console.log("\n📊 --- DATABASE SEARCH REPORT ---");
data.forEach(row => {
    console.log(row.query_plan); // Ye poora execution path dikhayega
});
console.log("----------------------------------\n");