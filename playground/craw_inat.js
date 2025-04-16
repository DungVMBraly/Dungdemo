const fs = require('fs');
const { HttpProxyAgent } = require('http-proxy-agent');

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

async function getTaxa(taxonId, proxyUrl = '') {
    return retryFetch(`https://api.inaturalist.org/v1/taxa/${taxonId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }, 3, 3000, proxyUrl);
}

async function main() {
    const plantJson = JSON.parse(fs.readFileSync("plants.json", "utf8"))
    const arr = JSON.parse(fs.readFileSync("plants_details.json", "utf8"))

    for (const data of plantJson) {
        if (arr.find(x => x.id == data.taxon_id)) {
            console.log(`Skipping ${data.name} (${data.taxon_id})`)
            continue
        }
        console.log(`Getting data for ${data.name} (${data.taxon_id})`)
        try {
            const plantResp = await getTaxa(data.taxon_id)
            if (plantResp.total_results < 1) {
                console.log(`No results for ${data.taxon_id}`)
                continue
            }

            const arr = JSON.parse(fs.readFileSync("plants_details.json", "utf8"))
            arr.push(plantResp.results[0])
            fs.writeFileSync("plants_details.json", JSON.stringify(arr))
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

        const arr = JSON.parse(fs.readFileSync("plants_details.json", "utf8"))
        console.log(`Total plants: ${arr.length}`)
    })
    .catch(console.error)
