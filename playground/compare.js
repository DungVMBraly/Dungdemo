const fs = require('fs');

const seekJson = JSON.parse(fs.readFileSync("plants.json", "utf8"))
const perenualJson = JSON.parse(fs.readFileSync("perenual.json", "utf8"))

const map = new Map()
for (const data of perenualJson) {
    map.set(data.scientific_name, true)
}

const plants = []
for (const data of seekJson) {
    const sname = map.get(data.name)
    if (sname) continue;

    plants.push(data.name)
}

console.log(plants.length)
fs.writeFileSync("plants_2.json", JSON.stringify(plants, null, 2))
