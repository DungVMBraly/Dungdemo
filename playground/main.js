const fs = require('fs');

const seekJson = JSON.parse(fs.readFileSync("seek.json", "utf8"))

const map = new Map()
for (const data of seekJson) {
    map.set(data.taxon_id, data)
}

const plants = []
for (const data of seekJson) {
    if (data.parent_taxon_id === null) continue;

    let parent = map.get(data.parent_taxon_id);
    while (parent && parent.parent_taxon_id !== null) {
        parent = map.get(parent.parent_taxon_id);
    }

    if (parent.taxon_id !== "47126" && parent.taxon_id !== "47170") continue;
    plants.push(data)
}

console.log(plants.length)
fs.writeFileSync("plants.json", JSON.stringify(plants, null, 2))
