const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: "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",
});

async function uploadFile(filePath) {
    return openai.files.create({
        file: fs.createReadStream(filePath),
        purpose: "batch",
    });
}

async function createBatch(fileId) {
    return openai.batches.create({
        input_file_id: fileId,
        endpoint: "/v1/chat/completions",
        completion_window: "24h"
    });
}

// const folderPath = './batches/new_plants_PT';
// const files = fs.readdirSync(folderPath);

// newFiles.forEach(file => {
//     console.log(file);
// })
// console.log(newFiles[1]);
// files.forEach(file => {
    uploadFile('gen_gpt_description_promptV2.jsonl').then(file => {
        if (!file.id) {
            console.log("Error uploading file");
            return;
        }
        return createBatch(file.id).then(batch => {
            console.log("Batch created with ID: " + batch.id);
            // fs.appendFileSync('./batch_ids/new_plants_PT/batch_ids.txt', batch.id + '\n');
        });
    });
// });
