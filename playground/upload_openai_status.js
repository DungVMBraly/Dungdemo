const fs = require('fs');
const readline = require('readline');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: "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",
});

// batchIDsFile = './batch_ids/new_plants_PT/batch_ids.txt'
// const rl = readline.createInterface({
//     input: fs.createReadStream(batchIDsFile),
//     output: process.stdout,
//     terminal: false
// });
//
// rl.on('line', (batch_id) => {
//     count = 0;
//     openai.batches.retrieve(batch_id.trim()).then(batch => {
//         // if (batch.errors) {
//         //     console.log(batch.errors.data);
//         // } else {
//         //     console.log(batch);
//         // }
//         if (batch.status !== "completed") {
//             return;
//         } else {
//             console.log(count++);
//         }
//         return openai.files.content(batch.output_file_id).then(fileResponse => {
//             return fileResponse.text().then(fileContents => {
//                 const jsonArray = [];
//                 const lines = fileContents.split('\n');
//                 lines.forEach(line => {
//                     if (line.trim()) {
//                         try {
//                             const data = JSON.parse(line);
//                             // console.log(data);
//                             // let usageToken = data.response.body.usage.total_tokens
//                             // totalToken += usageToken;
//                             // console.log(usageToken);
//                             const result = {
//                                 custom_id: data.custom_id,
//                                 body: JSON.parse(data.response.body.choices[0].message.content),
//                             }
//                             jsonArray.push(result.body);
//                         } catch (error) {
//                             console.error("Error parsing JSON:", error);
//                         }
//                     }
//                 });
//                 fs.writeFileSync(`./batch_results/new_plants_PT/${batch_id}.json`, JSON.stringify(jsonArray, null, 2));
//             });
//         });
//     });
// });

// batch_67501228f9d88191be146fb7fb0b0415 de
// batch_67501258baec81918b74c62eb3446c1f es
// batch_6750127135fc819196e86df585e1b7d8 fr
// batch_675020c4de908191ac102affba7b814e it
// batch_675020df53c08191bc4dc24759bc46c9 nl
// batch_675020f7ad948191b11f05abf2871468 pt

openai.batches.retrieve("batch_67e6589cb2788190bdc5b50587491287").then(batch => {
    console.log(batch)
    // console.log(batch.errors.data)
    if (batch.status !== "completed") {
        return;
    }
    return openai.files.content(batch.output_file_id).then(fileResponse => {
        return fileResponse.text().then(fileContents => {
            // console.log(fileContents);
            const jsonArray = [];
            const lines = fileContents.split('\n');
            let totalTokens = 0;
            lines.forEach(line => {
                if (line.trim()) {
                    try {
                        const data = JSON.parse(line);
                        const result = {
                            custom_id: data.custom_id,
                            body: JSON.parse(data.response.body.choices[0].message.content),
                        }
                        jsonArray.push(result.body);
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                }
            });
            fs.writeFileSync('music_dataV3.json', JSON.stringify(jsonArray, null, 2));
        });
    });
});

