const fs = require('fs');

function translatePlantInfo(plantInfo, targetLanguage, shortcutLang) {
    const body = {
        model: "gpt-4o",
        messages: [
            {
                "role": "system",
                "content": `You are a plant diseases localization expert with proficiency in both English 'en' and ${targetLanguage} '${shortcutLang}'. I will provide you with JSON-formatted plant diseases data in English. Your task is to translate the values into ${targetLanguage} '${shortcutLang}', ensuring that scientific terms are accurately translated and easily understandable for local communities. If the value of the fields is null or empty, keep that value without translating. Maintain the JSON format in your output, focusing on clarity and precision for non-expert readers.`

            },
            {
                "role": "user",
                "content": JSON.stringify({
                    "type": "json_schema",
                    "json_schema": plantInfo
                })
            }
        ],
        temperature: 1,
        // max_tokens: 512 * 4,
        max_completion_tokens: null,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
            "type": "json_schema",
            "json_schema": {
                "name": "diseases_response",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "number",
                            "description": "The unique identifier of the plant. Don't translate this field."
                        },
                        "common_name": {
                            "type": "string",
                            "description": "The common name of the plant",
                        },
                        "solution": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "subtitle": {
                                        "type": "string"
                                    },
                                    "description": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "subtitle",
                                    "description",
                                ],
                                "additionalProperties": false
                            }
                        },
                        "host": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "family": {"type": "string"},
                        "other_name": {"type": "array", "items": {"type": "string"}},
                        "description": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "subtitle": {
                                        "type": "string"
                                    },
                                    "description": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "subtitle",
                                    "description",
                                ],
                                "additionalProperties": false
                            }
                        },
                    },
                    "required": [
                        "id",
                        "common_name",
                        "solution",
                        "host",
                        "family",
                        "other_name",
                        "description"
                    ],
                    "additionalProperties": false
                },
            }
        }
    };
    return {
        custom_id: `${plantInfo.id}`,
        method: "POST",
        url: "/v1/chat/completions",
        body: body,
    }
}

// const filePath = 'matching_plants.json';
// const plantInfos = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//
// plantInfos.forEach(plantInfo => {
//     const data = JSON.stringify(translatePlantInfo(plantInfo, 'Vietnamese', 'vi'));
//     fs.appendFileSync('matching_plants.jsonl', data + '\n', {encoding: 'utf8'});
// });

// - **fr**: Tiếng Pháp, chủ yếu được nói ở Pháp và nhiều quốc gia khác nhau trên thế giới.
// - **es**: Tiếng Tây Ban Nha, chủ yếu được nói ở Tây Ban Nha và nhiều quốc gia ở châu Mỹ Latinh.
// - **pt**: Tiếng Bồ Đào Nha, chủ yếu được nói ở Bồ Đào Nha và Brazil.
// - **it**: Tiếng Ý, chủ yếu được nói ở Ý.
// - **nl**: Tiếng Hà Lan, chủ yếu được nói ở Hà Lan và Bỉ.
// - **de**: Tiếng Đức, chủ yếu được nói ở Đức, Áo, và Thụy Sĩ.
targetLanguages = [
    "French",
    "Spanish",
    "Portuguese",
    "Italian",
    "Dutch",
    "German"
]

shortcutLangs = [
    "fr",
    "es",
    "pt",
    "it",
    "nl",
    "de"
]

const filePath = './tmp/filtered_diseases.json';
const plantInfos = JSON.parse(fs.readFileSync(filePath, 'utf8'));
// let index = 0
for (let index = 0; index <= 5; index++) {
    plantInfos.forEach(plantInfo => {
        const data = JSON.stringify(translatePlantInfo(plantInfo, targetLanguages[index], shortcutLangs[index]));
        fs.appendFileSync('filtered_diseases_' + shortcutLangs[index] + '.jsonl', data + '\n', {encoding: 'utf8'});
    });
}


// const folderPath = './tmp/plants/';
// const files = fs.readdirSync(folderPath);
//
// files.forEach(file => {
//     const filePath = `${folderPath}${file}`;
//     const plantInfos = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//     for (let index =0; index <= 5; index++) {
//         const targetLang = targetLanguages[index];
//         const shortcutLang = shortcutLangs[index];
//
//         plantInfos.forEach(plantInfo => {
//             const data = JSON.stringify(translatePlantInfo(plantInfo, targetLang, shortcutLang));
//             fs.appendFileSync(`./batches/new_plants_${shortcutLang.toUpperCase()}/translate-${file.replace(".json", "")}.jsonl`, data + '\n', {encoding: 'utf8'});
//         });
//     }
// });