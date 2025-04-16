const fs = require('fs');
const {HttpProxyAgent} = require('http-proxy-agent');

const targetFile = "gbif_taxa.json"
const nameFile = "plants/scientific_names_1"

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

async function getSpecies(scientificName, proxyUrl = '') {
    const url = `https://api.gbif.org/v1/species/search?rank=SPECIES&nameType=SCIENTIFIC&q=${scientificName}`
    return retryFetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }, 3, 3000, proxyUrl);
}

async function main() {
    const names = fs.readFileSync(nameFile, "utf8").split("\n")
    const existed = JSON.parse(fs.readFileSync(targetFile, "utf8")).map(plant => plant.scientific_name)
    for (const name of names) {
        if (existed.includes(name)) {
            console.log(`Already have data for ${name}`)
            continue
        }
        console.log(`Getting data for ${name}`)
        try {
            const plantResp = await getSpecies(name)
            if (plantResp.results.length === 0) {
                console.error(`No data found for ${name}`)
                fs.writeFileSync("gbif_taxa_not_found", name + "\n", {flag: 'a'})
                continue
            }
            const nubKey = plantResp.results.filter(plant => plant.nubKey !== undefined).map(plant => plant.nubKey).at(0)
            console.log(nubKey)

            const arr = JSON.parse(fs.readFileSync(targetFile, "utf8"))
            arr.push({
                scientific_name: name,
                nub_key: nubKey
            })
            fs.writeFileSync(targetFile, JSON.stringify(arr))
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (e) {
            console.error(`Error fetching data for ${name}: ${e}`)
            break
        }
    }

}

main()
    .then(() => {
        console.log("Done!")

        const arr = JSON.parse(fs.readFileSync(targetFile, "utf8"))
        console.log(`Total plants: ${arr.length}`)
    })
    .catch(console.error)
