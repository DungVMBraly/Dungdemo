const fs = require('fs');

async function retryFetch(url, options, retries = 3, delay = 3000, proxyUrl = '') {
    const fetch = (await import('node-fetch-with-proxy')).default;
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.status === 200) {
                return await response.buffer(); // Return binary data
            } else if (response.status === 204) {
                // console.log('No content available (HTTP 204)');
                return null;
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            if (i < retries - 1) {
                console.error(`Error: ${error}. Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}

async function getPlantMap(z, x, y, style1, style2, taxonKey, proxyUrl = '') {
    const url = `https://api.gbif.org/v2/map/occurrence/density/${z}/${x}/${y}@2x.png?srs=${style1}&bin=hex&hexPerTile=51&style=${style2}&taxonKey=${taxonKey}`;
    return retryFetch(url, {
        method: 'GET'
    }, 3, 3000, proxyUrl);
}

async function main() {
    const z = 2
    const allX = [0, 1, 2, 3, 4, 5, 6, 7]
    const allY = [0, 1, 2, 3]
    const style1 = "EPSG%3A4326"
    const style2 = "green.poly"
    const taxonKeys = JSON.parse(fs.readFileSync("gbif_taxa.json", "utf8"))

    for (const taxon of taxonKeys) {
        const name = taxon.scientific_name;
        const key = taxon.nub_key;

        console.log(`Fetching data for name=${name} key=${key}`);
        for (const x of allX) {
            for (const y of allY) {
                const path = `./maps/plants/${key}_${z}_${x}_${y}.png`
                if (fs.existsSync(path)) {
                    console.log(`File ${key}_${z}_${x}_${y}.png already exists`);
                    continue
                }

                try {
                    const data = await getPlantMap(z, x, y, style1, style2, key);
                    if (!data) {
                        continue;
                    }
                    fs.writeFileSync(path, path);
                    console.log(`Saved ${key}_${z}_${x}_${y}.png`);
                } catch (e) {
                    console.error(`Error fetching data for name=${name} key=${key} z=${z}, x=${x}, y=${y}: ${e}`);
                }

                await new Promise((resolve) => setTimeout(resolve, 10));
            }
        }
    }
}

main()
    .then(() => {
        console.log("Done!");
    })
    .catch(console.error);
