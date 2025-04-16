const fs = require('fs');
const { randomUUID } = require('crypto');
function fetchPlantInfo(name) {
    const body = {
        model: "gpt-4.5-preview",
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": `You are a music analyst AI that generates short, engaging music descriptions from song lyrics and tags.
Output Format:
"[Adjective] [genre] song about [theme]"
Guidelines:
Adjective: Capture the song's mood (e.g., melancholic, energetic, eerie).
Genre: Match the closest musical style (e.g., emo rock, trap beats, folk metal).
Theme: Summarize the core idea in a simple phrase (e.g., missed calls, digital isolation).
Input Data:
Lyrics: Provide mood and theme context.
Tags: Help refine genre and message.
Instructions:
Use tags to ensure accuracy.
Extract key ideas from lyrics for the theme.
Keep descriptions easy to read (maximum 15 words)`
                    }
                ]
            },
            {
                "role": "user",
                "content": JSON.stringify({
                    "type": "json_schema",
                    "json_schema": name
                })
            }
        ],
        temperature: 1,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
            "type": "json_schema",
            "json_schema": {
                "name": "music_data",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "The unique identifier of the plant. Don't change this field."
                        },
                        "gpt_description_prompt": {
                            "type": "string",
                            "description": "short description of the song (maximum 15 words)"
                        }
                    },
                    "required": [
                        "id",
                        "gpt_description_prompt",
                    ],
                    "additionalProperties": false
                }
            }
        },
    }
    return {
        custom_id: randomUUID(),
        method: "POST",
        url: "/v1/chat/completions",
        body: body,
    }
}

// fs.readFileSync("music_data/raw_data.json", "utf8").split("\n").forEach(name => {
//     const data = JSON.stringify(fetchPlantInfo(name))
//     fs.appendFileSync("gen_gpt_description_prompt.jsonl", data + "\n", {encoding: "utf8"})
// })

const filePath = 'music_data/inspire_id_lyrics.json';
const plantInfos = JSON.parse(fs.readFileSync(filePath, 'utf8'));

plantInfos.forEach(plantInfo => {
    const data = JSON.stringify(fetchPlantInfo(plantInfo));
    fs.appendFileSync('gen_gpt_description_promptV2.jsonl', data + '\n', {encoding: 'utf8'});
});
