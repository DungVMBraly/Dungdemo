const fs = require('fs');

function fetchPlantInfo(name) {
    const body = {
        model: "gpt-4o-2024-08-06",
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": "I will give you scientific name of a plant, and you will give me information about how to care for that plant."
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `${name}`
                    }
                ]
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
                "name": "plant_info_response",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "attracts": {
                            "type": "array",
                            "description": "The name of animal or pollinators that the plant attracts. Can be empty.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "care_level": {
                            "type": "string",
                            "description": "How difficult to care for the plant?",
                            "enum": [
                                "Easy",
                                "Medium",
                                "High",
                                "Extreme"
                            ]
                        },
                        "cycle": {
                            "type": "string",
                            "enum": [
                                "Annual",
                                "Biennial",
                                "Herbaceous",
                                "Perennial"
                            ]
                        },
                        "cones": {
                            "type": "string",
                            "description": "Does this plant have cones?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "cuisine": {
                            "type": "string",
                            "description": "Does this plant belongs to any cuisine recipe?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "drought_tolerant": {
                            "type": "string",
                            "description": "Can this plant survive during drought?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "edible_fruit": {
                            "type": "string",
                            "description": "Does this plant have edible fruit?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "edible_leaf": {
                            "type": "string",
                            "description": "Does this plant have edible leaf?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "flowers": {
                            "type": "string",
                            "description": "Does this plant have flowers?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "flower_color": {
                            "type": "string",
                            "description": "If this plant have flowers, what color is the flowers usually appear? Can be blank."
                        },
                        "flowering_season": {
                            "type": "string",
                            "description": "If this plant have flowers, what season would the flowers usually bloom? Can be blank.",
                            "enum": [
                                "",
                                "Spring",
                                "Summer",
                                "Autumn",
                                "Winter"
                            ]
                        },
                        "fruits": {
                            "type": "string",
                            "description": "Does this plant have fruits?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "fruit_color": {
                            "type": "string",
                            "description": "If this plant have fruits, what color is the fruits usually appear? Can be blank."
                        },
                        "growth_rate": {
                            "type": "string",
                            "description": "How fast would the plant grow if taken care of?",
                            "enum": [
                                "Low",
                                "Moderate",
                                "High"
                            ]
                        },
                        "hardiness_min": {
                            "type": "string",
                            "description": "What is the minimum hardiness zone the plant can strive?",
                            "enum": [
                                "0",
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                                "10",
                                "11",
                                "12",
                                "13"
                            ]
                        },
                        "hardiness_max": {
                            "type": "string",
                            "description": "What is the maximum hardiness zone the plant can strive?",
                            "enum": [
                                "0",
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6",
                                "7",
                                "8",
                                "9",
                                "10",
                                "11",
                                "12",
                                "13"
                            ]
                        },
                        "harvest_season": {
                            "type": "string",
                            "description": "Does this plant have harvest season? If so, which one? Can be blank.",
                            "enum": [
                                "",
                                "Spring",
                                "Summer",
                                "Autumn",
                                "Winter"
                            ]
                        },
                        "indoor": {
                            "type": "string",
                            "description": "Can this plant be grow indoor?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "invasive": {
                            "type": "string",
                            "description": "Invasive plants are harmful non-native trees, shrubs, and herbaceous plants that are spread by global trade, human and animal transport, and gardening. They invade forests and prevent native plants from growing, which can have negative impacts on how ecosystems function, on native vegetation, and native wildlife. Is this plant invasive?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "leaf": {
                            "type": "string",
                            "description": "Does this plant have leaf?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "leaf_color": {
                            "type": "string",
                            "description": "If this plant have leaf, what is the color? Can be blank."
                        },
                        "maintenance": {
                            "type": "string",
                            "description": "How frequent does the plant need watering or pruning?",
                            "enum": [
                                "Low",
                                "Moderate",
                                "High"
                            ]
                        },
                        "medicinal": {
                            "type": "string",
                            "description": "Can this plant be used for medical purpose?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "origin": {
                            "type": "array",
                            "description": "Which countries did this plant originate from?",
                            "items": {
                                "type": "string"
                            }
                        },
                        "pest_susceptibility": {
                            "type": "array",
                            "description": "Which pest can cause disease to this plant? For example: Fungal leaf spot, Heart rot, Mildew, Anthracnose, Canker, Sap rot, Stem borer insects,... Can be empty.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "poisonous_to_humans": {
                            "type": "string",
                            "description": "Is this plant poisonous to humans? 0 is False, 1 is True",
                            "enum": [
                                "0",
                                "1"
                            ]
                        },
                        "poisonous_to_pets": {
                            "type": "string",
                            "description": "Is this plant poisonous to pets? 0 is False, 1 is True",
                            "enum": [
                                "0",
                                "1"
                            ]
                        },
                        "propagation": {
                            "type": "array",
                            "description": "What is the propagation for this plant? For example: Cutting, Grafting Propagation, Layering Propagation, Seed Propagation, Air Layering Propagation, Tissue Culture,... Can be empty.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "pruning_month": {
                            "type": "string",
                            "enum": [
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December"
                            ]
                        },
                        "salt_tolerant": {
                            "type": "string",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "seeds": {
                            "type": "string",
                            "description": "Does this plant have seeds? 0 is False, 1 is True",
                            "enum": [
                                "0",
                                "1"
                            ]
                        },
                        "soil": {
                            "type": "array",
                            "description": "What type of soil can this plant be planted? For example: Acidic, Rocky, Gravelly, Dry, Well-drained, Loamy Rocky,... Can be empty.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "sunlight": {
                            "type": "array",
                            "description": "How much sunlight does this plant required? For example: Full sun, Part shade, Filtered shade,... Can be empty.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "thorny": {
                            "type": "string",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "tropical": {
                            "type": "string",
                            "description": "Is this a tropical plant?",
                            "enum": [
                                "TRUE",
                                "FALSE"
                            ]
                        },
                        "type": {
                            "type": "string",
                            "description": "What type of plant does this plant belongs to?",
                            "enum": [
                                "Annual",
                                "Aquatic",
                                "Aster",
                                "Astilbe",
                                "Bamboo",
                                "Begonia",
                                "Bergenia",
                                "Biennial",
                                "Broadleaf evergreen",
                                "Bulb",
                                "Bush",
                                "Cactus",
                                "Carnation",
                                "Carnivorous",
                                "Cattails",
                                "Chrysanthemum",
                                "Climber",
                                "Coleus",
                                "Coneflower",
                                "Conifer",
                                "Creeper",
                                "CreepingZinnia",
                                "Dahlia",
                                "Daisy",
                                "Daylily",
                                "Deciduous shrub",
                                "Delphinium",
                                "Dianthus",
                                "Epiphyte",
                                "Euphorbia",
                                "Fern",
                                "Flower",
                                "Foliage House plants",
                                "Forb",
                                "Fruit",
                                "Geranium",
                                "Gladiolus",
                                "Grain",
                                "Graminoid",
                                "Grass",
                                "Ground Cover",
                                "Ground cover",
                                "Herb",
                                "Herbaceous perennial",
                                "Hosta",
                                "Iridaceae",
                                "Iris",
                                "Lobelia",
                                "Moss",
                                "Needled evergreen",
                                "Nelumbo",
                                "Orchid",
                                "Ornamental grass",
                                "Palm or Cycad",
                                "Peony",
                                "Petunia",
                                "Philodendron",
                                "Phlox",
                                "Poales",
                                "Poppy",
                                "Primrose",
                                "Primula",
                                "Pteridophyte",
                                "Reed",
                                "Reeds",
                                "Rush or Sedge",
                                "Sedge",
                                "Semi-evergreen",
                                "ShastaDaisy",
                                "Shrub",
                                "Succulent",
                                "Sunflower",
                                "Thistle",
                                "Thrift",
                                "Tree",
                                "Turfgrass",
                                "Vegetable",
                                "Verbena",
                                "Veronica",
                                "Vine",
                                "Vine or climber",
                                "Violet",
                                "Waterlily",
                                "Waterpoppy",
                                "Weed",
                                "Wildflower",
                                "Woody plants"
                            ]
                        },
                        "watering": {
                            "type": "string",
                            "description": "How frequent should the plant be watered?",
                            "enum": [
                                "Average",
                                "Minimum",
                                "Frequent"
                            ]
                        },
                        "watering_period": {
                            "type": "string",
                            "description": "When should the plant be watered?",
                            "enum": [
                                "Morning",
                                "Afternoon",
                                "Evening"
                            ]
                        }
                    },
                    "required": [
                        "attracts",
                        "care_level",
                        "cycle",
                        "cones",
                        "cuisine",
                        "drought_tolerant",
                        "edible_fruit",
                        "edible_leaf",
                        "flowers",
                        "flower_color",
                        "flowering_season",
                        "fruits",
                        "fruit_color",
                        "growth_rate",
                        "hardiness_min",
                        "hardiness_max",
                        "harvest_season",
                        "indoor",
                        "invasive",
                        "leaf",
                        "leaf_color",
                        "maintenance",
                        "medicinal",
                        "origin",
                        "pest_susceptibility",
                        "poisonous_to_humans",
                        "poisonous_to_pets",
                        "propagation",
                        "pruning_month",
                        "salt_tolerant",
                        "seeds",
                        "soil",
                        "sunlight",
                        "thorny",
                        "tropical",
                        "type",
                        "watering",
                        "watering_period"
                    ],
                    "additionalProperties": false
                }
            }
        },
    }
    return {
        custom_id: `${name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().replaceAll(" ", "_")}`,
        method: "POST",
        url: "/v1/chat/completions",
        body: body,
    }
}

fs.readFileSync("seek_plant_names.txt", "utf8").split("\n").forEach(name => {
    const data = JSON.stringify(fetchPlantInfo(name))
    fs.appendFileSync("seek_plant_info.jsonl", data + "\n", {encoding: "utf8"})
})
