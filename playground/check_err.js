const fs = require('fs');

// Read the JSON file
const filePath = 'result_en_vi_v2.json';
const jsonData = fs.readFileSync(filePath, 'utf8');

// Parse the JSON content
const jsonArray = JSON.parse(jsonData);

// Extract the 'id' fields
const ids = jsonArray.map(item => item.id);

// Output the list of 'id' fields

for (let i = 1; i <= 500; i++) {
    if (!ids.includes(i.toString())) {
        console.log(i);
    }
}
// console.log(ids);