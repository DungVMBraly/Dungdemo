const fs = require('fs');

function translatePlantInfo(plantInfo, targetLanguage, shortcutLang) {
    const body = {
        model: "gpt-4o",
        messages: [
            {
                "role": "system",
                "content": `
                    You are a plant localization expert with proficiency in both English 'en' and ${targetLanguage} '${shortcutLang}'. 
                    I will provide you with JSON-formatted plant data in English. 
                    Your task is to translate the values into ${targetLanguage} '${shortcutLang}', ensuring that scientific terms are accurately translated and easily understandable for local communities. 
                    Maintain the JSON format in your output, focusing on clarity and precision for non-expert readers.
                `
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
                "name": "plant_info_response",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "number",
                            "description": "The unique identifier of the plant. Don't translate this field."
                        },
                        "scientific_name": {
                            "type": "array",
                            "description": "The scientific name of the plant. Don't translate this field.",
                            "items": {"type": "string"},
                        },
                        "common_name": {
                            "type": "string",
                            "description": "The common name of the plant",
                        },
                        "attracts": {
                            "type": "array",
                            "description": "The name of animal or pollinators that the plant attracts.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "care_level": {
                            "type": "string",
                            "description": "How difficult to care for the plant?",
                        },
                        "description": {"type": "string"},
                        "family": {"type": "string"},
                        "flower_color": {"type": "string"},
                        "flowering_season": {"type": "string"},
                        "fruit_color": {"type": "array", "items": {"type": "string"}},
                        "growth_rate": {
                            "type": "string",
                            "description": "How fast would the plant grow if taken care of?",
                        },
                        "harvest_season": {"type": "string"},
                        "leaf_color": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "maintenance": {
                            "type": "string",
                            "description": "How frequent does the plant need watering or pruning?",
                        },
                        "origin": {
                            "type": "array",
                            "description": "Which countries did this plant originate from?",
                            "items": {"type": "string"}
                        },
                        "other_name": {"type": "array", "items": {"type": "string"}},
                        "pest_susceptibility": {
                            "type": "array",
                            "description": "Which pest can cause disease to this plant?",
                            "items": {"type": "string"}
                        },
                        "propagation": {
                            "type": "array",
                            "description": "List of propagation method for this plant.",
                            "items": {"type": "string"}
                        },
                        "pruning_month": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "soil": {
                            "type": "array",
                            "description": "What type of soil can this plant be planted?",
                            "items": {"type": "string"}
                        },
                        "watering_period": {
                            "type": "string",
                            "description": "When should the plant be watered?",
                        },
                        "care_guides_details": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "number",
                                        "description": "Don't translate this field."
                                    },
                                    "type": {
                                        "type": "string",
                                        "description": "Don't translate this field."
                                    },
                                    "description": {"type": "string"}
                                },
                                "required": [
                                    "id",
                                    "type",
                                    "description"
                                ],
                                "additionalProperties": false
                            }
                        }
                    },
                    "required": [
                        "id",
                        "scientific_name",
                        "common_name",
                        "attracts",
                        "care_level",
                        "description",
                        "family",
                        "flower_color",
                        "flowering_season",
                        "fruit_color",
                        "growth_rate",
                        "harvest_season",
                        "leaf_color",
                        "maintenance",
                        "origin",
                        "other_name",
                        "pest_susceptibility",
                        "propagation",
                        "pruning_month",
                        "soil",
                        "watering_period",
                        "care_guides_details"
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

const filePath = './tmp/filtered_missing_dataPT.json';
const plantInfos = JSON.parse(fs.readFileSync(filePath, 'utf8'));

plantInfos.forEach(plantInfo => {
    const data = JSON.stringify(translatePlantInfo(plantInfo, 'Portuguese', 'pt'));
    fs.appendFileSync('filtered_missing_dataPT.jsonl', data + '\n', {encoding: 'utf8'});
});

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