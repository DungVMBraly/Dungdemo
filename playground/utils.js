const fs = require('fs');

const folderPath = './batch_results/new_plants_ES/';
const files = fs.readdirSync(folderPath);
console.log(files.length)

