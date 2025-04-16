const fs = require('fs');
const json = require("big-json");
const json2csv = require('json2csv').parse;

const plants = JSON.parse(fs.readFileSync("plants_details.json", "utf8")).map(plant => {
    return {
        id: plant.id,
        name: plant.name,
        default_photo: {
            license_code: plant?.default_photo?.license_code,
            attribution: plant?.default_photo?.attribution,
            url: plant?.default_photo?.url,
            square_url: plant?.default_photo?.square_url,
            medium_url: plant?.default_photo?.medium_url,
        },
        taxon_photos: plant.taxon_photos.map(photo => {
            return {
                license_code: photo?.photo?.license_code,
                attribution: photo?.photo?.attribution,
                url: photo?.photo?.url,
                square_url: photo?.photo?.square_url,
                medium_url: photo?.photo?.medium_url,
            }
        }),
        atlas_id: plant.atlas_id,
        wikipedia_url: plant.wikipedia_url,
        preferred_common_name: plant.preferred_common_name,
        wikipedia_summary: plant.wikipedia_summary,
    }
})
fs.writeFileSync("plant_details.csv", json2csv(plants));
console.log(`Done`)
