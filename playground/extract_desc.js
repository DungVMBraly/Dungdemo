const fs = require('fs');
const readline = require('readline');
const json2csv = require('json2csv').parse;

const fileStream = fs.createReadStream('./openai_batch_output/care_desc.jsonl');
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

const processedData = [];

rl.on('line', (line) => {
    try {
        const jsonData = JSON.parse(JSON.parse(line).response.body.choices[0].message.content);
        const data = []
        if (jsonData.watering_guide_description) {
            data.push({
                type: "watering",
                description: jsonData.watering_guide_description,
            });
        }
        if (jsonData.sunlight_guide_description) {
            data.push({
                type: "sunlight",
                description: jsonData.sunlight_guide_description,
            });
        }
        if (jsonData.pruning_guide_description) {
            data.push({
                type: "pruning",
                description: jsonData.pruning_guide_description,
            });
        }
        processedData.push([data]);
    } catch (error) {
        console.error(`Error parsing line: ${line}`, error);
    }
});

rl.on('close', () => {
    try {
        const csv = json2csv(processedData);
        console.log(processedData)
        fs.writeFileSync('processed_care_desc.csv', csv);
        console.log('File reading and processing completed.');
    } catch (error) {
        console.error('Error writing CSV file', error);
    }
});
