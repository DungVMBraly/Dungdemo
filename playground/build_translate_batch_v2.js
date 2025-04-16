const fs = require('fs');

function translatePlantInfo(plantInfo) {
    const body = {
        model: "gpt-4o",
        messages: [
            {
                "role": "system",
                // "content": `
                //     You are an expert in the field of plants.
                //     I will give you information about plants in English, and you will translate that plant information into Vietnamese.
                //     The input will be in JSON format, the input will include information about a plant represented as key-value pairs.
                //     The output will be in JSON format, but the values of the fields will be translated into Vietnamese.
                //     The goal is to localize plant information, suitable for the target language.
                //     Ensure accurate translation of scientific terms but also adjust so that local people can easily understand the terms
                //   `

                "content": `
                    You are a plant localization expert with proficiency in both English and Vietnamese. 
                    I will provide you with JSON-formatted plant data in English. 
                    Your task is to translate the values into Vietnamese, ensuring that scientific terms are accurately translated and easily understandable for local communities. 
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
                            "type": "string",
                            "description": "The unique identifier of the plant. Don't translate this field."
                        },
                        "scientific_name": {
                            "type": "string",
                            "description": "The scientific name of the plant. Don't translate this field."
                        },
                        "common_name": {
                            "type": "string",
                            "description": "The common name of the plant. If the meaning cannot be translated accurately, please keep the original value."
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
                        // "cycle": {
                        //     "type": "string",
                        //     // "enum": [
                        //     //     "lâu năm",
                        //     //     "hằng năm",
                        //     //     "2 năm"
                        //     // ]
                        // },
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
                        "leaf_color": {"type": "string"},
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
                            "description": "What is the propagation for this plant?",
                            "items": {"type": "string"}
                        },
                        "pruning_month": {"type": "string"},
                        "soil": {
                            "type": "array",
                            "description": "What type of soil can this plant be planted?",
                            "items": {"type": "string"}
                        },
                        // "sunlight": {
                        //     "type": "array",
                        //     "description": "How much sunlight does this plant required?",
                        //     "items": {"type": "string"},
                        // },
                        // "type": {
                        //     "type": "string",
                        //     "description": "What type of plant does this plant belongs to?",
                        //     // "enum": [
                        //     //     "Hoa",
                        //     //     "Trái cây",
                        //     //     "Rau",
                        //     //     "Cây leo",
                        //     //     "Cây",
                        //     //     "Rong",
                        //     //     "Cây bụi",
                        //     //     "Thảo mộc",
                        //     //     "Cây xương rồng",
                        //     //     "Cây mọng nước",
                        //     //     "Cây có độc"
                        //     // ]
                        // },
                        // "watering": {
                        //     "type": "string",
                        //     "description": "How frequent should the plant be watered?",
                        // },
                        "watering_period": {
                            "type": "string",
                            "description": "When should the plant be watered?",
                        },
                        "care_guides_details": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "string"},
                                    "type": {"type": "string"},
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
                        // "cycle",
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
                        // "sunlight",
                        // "type",
                        // "watering",
                        "watering_period",
                        "care_guides_details"
                    ],
                    "additionalProperties": false
                },
            }
        }
    };
    return {
        custom_id: `${plantInfo.scientific_name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().replaceAll(" ", "_")} + ${plantInfo.id}`,
        method: "POST",
        url: "/v1/chat/completions",
        body: body,
    }
}

// const filePath = './tmp/current_plants.json';
// const plantInfos = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//
// plantInfos.forEach(plantInfo => {
//     const data = JSON.stringify(translatePlantInfo(plantInfo));
//     fs.appendFileSync('translate_plants_en_vi_v6.jsonl', data + '\n', {encoding: 'utf8'});
// });

const folderPath = './tmp/current_plants/';
const files = fs.readdirSync(folderPath);

files.forEach(file => {
    const filePath = `${folderPath}${file}`;
    const plantInfos = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    plantInfos.forEach(plantInfo => {
        const data = JSON.stringify(translatePlantInfo(plantInfo));
        fs.appendFileSync(`batches/current_plants/translate-${file}.jsonl`, data + '\n', { encoding: 'utf8' });
    });
});