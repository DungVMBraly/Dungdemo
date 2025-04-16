const fs = require('fs');
const {HttpProxyAgent} = require('http-proxy-agent');

async function retryFetch(url, options, retries = 3, delay = 3000, proxyUrl = '') {
    const fetch = (await import('node-fetch')).default;

    if (proxyUrl) {
        options.agent = new HttpProxyAgent(proxyUrl);
    }

    for (let i = 0; i < retries; i++) {
        try {
            const fetchUrl = proxyUrl ? `${proxyUrl}/${url}` : url;
            const response = await fetch(fetchUrl, options);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.buffer(); // Return binary data
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

async function getBaseMap(z, x, y, style, proxyUrl = '') {
    const url = `https://tile.gbif.org/4326/omt/${z}/${x}/${y}@2x.png?style=${style}`;
    return retryFetch(url, {
        method: 'GET'
    }, 3, 3000, proxyUrl);
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
    const style = "osm-bright-en"

    for (const x of allX) {
        for (const y of allY) {
            try {
                // const data = await getBaseMap(z, x, y, style);
                // fs.writeFileSync(`./maps/basemap/basemap_${z}_${x}_${y}.png`, data);

                const data = await getPlantMap(z, x, y, "EPSG%3A4326", "green.poly", "2986175");

                console.log(`Saved basemap_${z}_${x}_${y}.png`);
            } catch (e) {
                console.error(`Error fetching data for z=${z}, x=${x}, y=${y}: ${e}`);
            }
        }
    }
}

main()
    .then(() => {
        console.log("Done!");
    })
    .catch(console.error);
