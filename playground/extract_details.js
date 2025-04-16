const fs = require('fs');
const json2csv = require('json2csv').parse;

const plants = JSON.parse(fs.readFileSync("./openai_batch_output/care_info.jsonl", "utf8")).map(plant => {
    const data = JSON.parse(plant.response.body.choices[0].message.content);
    data.id = plant.custom_id;
    return data;
})
fs.writeFileSync("care_info.csv", json2csv(plants));
console.log(`Done`)
