const fs = require('fs');
const readline = require('readline');

async function calculateTotalTokens(jsonlFilePath) {
    const fileStream = fs.createReadStream(jsonlFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let totalTokens = 0;

    for await (const line of rl) {
        if (line.trim()) {
            const data = JSON.parse(line);
            console.log(data)
            // if (data.response && data.response.usage && data.usage.total_tokens) {
                totalTokens += data.response.body.usage.total_tokens;
            // }
        }
    }

    console.log(`Total tokens: ${totalTokens}`);
}

calculateTotalTokens('raw_data.jsonl');