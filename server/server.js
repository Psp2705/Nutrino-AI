const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON bodies

const API_URL = 'https://api.edamam.com/search';
const APP_ID = process.env.EDAMAM_APP_ID;
const API_KEY = process.env.EDAMAM_API_KEY;

// Placeholder for an image processing service
const IMAGE_PROCESSING_SERVICE_URL = 'https://example.com/process-image'; 

const enhanceImage = async (imageUrl) => {
    try {
        const response = await axios.post(IMAGE_PROCESSING_SERVICE_URL, {
            imageUrl: imageUrl
        });
        return response.data.enhancedImageUrl; // Adjust based on the response from the image processing service
    } catch (error) {
        console.error('Image processing error:', error.response ? error.response.data : error.message);
        return imageUrl; // Return original URL if enhancement fails
    }
};

app.post('/recipes', async (req, res) => {
    try {
        const { preferredIngredients, allergies } = req.body;
        const excludedIngredients = allergies.join(',');
        const ingredients = preferredIngredients.join(',');

        const response = await axios.get(API_URL, {
            params: {
                app_id: APP_ID,
                app_key: API_KEY,
                q: ingredients, // Search query
                exclude: excludedIngredients, // Exclude allergic ingredients
                random: true, // Request random recipes
                from: 0,
                to: 10 // Adjust as needed
            }
        });

        const recipes = await Promise.all(response.data.hits.map(async (hit) => {
            const originalImageUrl = hit.recipe.image;
            const enhancedImageUrl = await enhanceImage(originalImageUrl);

            return {
                title: hit.recipe.label,
                ingredients: hit.recipe.ingredientLines,
                image: enhancedImageUrl
            };
        }));

        res.json({ recipes });
    } catch (error) {
        console.error('API error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
