const fs = require('fs');
const json = require('big-json');

const plantJson = JSON.parse(fs.readFileSync("plants_details.json", "utf8"))

const plants = []
for (const data of plantJson) {
    if (plants.find(plant => plant.id === data.id)) {
        console.log("Duplicate found: ", data.id)
        continue;
    }
    plants.push(data)
}

json.createStringifyStream({body: plants}).on('data', function(str) {
    fs.appendFile("plants_details_filtered.json", str, function (err) {
        if (err) throw err;
    })
})
console.log(`Done. Old ${plantJson.length} New: ${plants.length}`)
