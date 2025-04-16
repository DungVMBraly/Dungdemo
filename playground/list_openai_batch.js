const fs = require('fs');
const OpenAI = require('openai');
const readline = require("readline");

const openai = new OpenAI({
    apiKey: "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",
});

// async function main() {
//     const list = await openai.batches.list();
//     let count = 0;
//     for await (const batch of list) {
//         // console.log(batch);
//         if (batch.status === "in_progress") {
//             // console.log(batch.id);
//             const cancelBatch = await openai.batches.cancel(batch.id);
//             // const batchRes = await openai.batches.cancel(batch.id);
//             //
//             // console.log(batchRes);
//         }
//     }
//     console.log(count);
// }
//
// main();

async function main() {
    // batch_6736c7403cbc8190903f76532fe1275c
    const batch = await openai.batches.cancel("batch_674ee0edeb8881908833e95b1d556863");

    console.log(batch);
}

main();
// batchIDsFile = './batch_ids/new_plants_NL/batch_ids.txt'
// const rl = readline.createInterface({
//     input: fs.createReadStream(batchIDsFile),
//     output: process.stdout,
//     terminal: false
// });
//
// rl.on('line', (batch_id) => {
//     const batch =  openai.batches.cancel('batch_6749412b35f081908a9b777060c4ba10');
//     console.log(batch);
// })