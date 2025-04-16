const fs = require('fs');

const plantJson = JSON.parse(fs.readFileSync("plants.json", "utf8"))

const plants = []
for (const data of plantJson) {
    if (data.rank_level !== "10") continue;
    plants.push(data)
}

console.log(plants.length)
fs.writeFileSync("plants_3.json", JSON.stringify(plants, null, 2))
