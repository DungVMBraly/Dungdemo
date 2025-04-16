const fs = require('fs');

async function retryFetch(url, options, retries = 30, delay = 5000) {
    const fetch = (await import('node-fetch-with-proxy')).default;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            if (i < retries - 1) {
                console.error(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}

async function getObservations(taxonId) {
    return retryFetch(`https://api.inaturalist.org/v1/observations?photos=true&rank=species&taxon_id=${taxonId}&iconic_taxa=Plantae&per_page=50&order=desc&order_by=created_at`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }, 3, 3000);
}

async function main() {
    const plantJson = JSON.parse(fs.readFileSync("./tmp/plants.json", "utf8"))
    const arr = JSON.parse(fs.readFileSync("./tmp/plant_images.json", "utf8"))

    for (const data of plantJson) {
        if (arr.find(x => x.id == data.taxon_id)) {
            console.log(`Skipping ${data.name} (${data.taxon_id})`)
            continue
        }
        console.log(`Getting data for ${data.name} (${data.taxon_id})`)
        try {
            const plantResp = await getObservations(data.taxon_id)
            if (plantResp.total_results < 1) {
                console.log(`No results for ${data.taxon_id}`)
                continue
            }
            const photos = plantResp.results
                .filter(p => p.observation_photos.length > 0)
                .flatMap(p => p.observation_photos)
                .map(p => {
                    return {
                        id: data.taxon_id,
                        name: data.name,
                        url: p.photo.url,
                        license: p.photo.license_code,
                        attribution: p.photo.attribution
                    }
                })
                .filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i)
            const photoData = {
                id: data.taxon_id,
                name: data.name,
                photos: photos
            }
            const arr = JSON.parse(fs.readFileSync("./tmp/plant_images.json", "utf8"))
            arr.push(photoData)
            fs.writeFileSync("./tmp/plant_images.json", JSON.stringify(arr))
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
            console.error(`Error fetching data for ${data.taxon_id}: ${e}`)
            break
        }
    }

}

main()
    .then(() => {
        console.log("Done!")

        const arr = JSON.parse(fs.readFileSync("./tmp/plant_images.json", "utf8"))
        console.log(`Total plants: ${arr.length}`)
    })
    .catch(console.error)
