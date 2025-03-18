import React, { useState } from 'react';
import axios from 'axios';
import './RecipeStream.css'; // Ensure this file is updated with the new CSS

const RecipeStream = () => {
    const [preferredIngredients, setPreferredIngredients] = useState('');
    const [allergies, setAllergies] = useState('');
    const [recipes, setRecipes] = useState([]);

    const fetchRecipes = async () => {
        try {
            const response = await axios.post('https://nutri-ai-server.iamaan1410.workers.dev', {
                preferredIngredients: preferredIngredients.split(',').map(ing => ing.trim()),
                allergies: allergies.split(',').map(all => all.trim())
            });
            setRecipes(response.data.recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    return (
        <div className="container">
            <div className="left-side">
                <div className="info-card">
                    <h1>Why Follow Diet Recipes?</h1>
                    <p>Diet recipes help you maintain a balanced lifestyle, improve health, and achieve fitness goals. Choose recipes that fit your dietary preferences and avoid allergens.</p>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Enter preferred ingredients (comma-separated)..."
                        value={preferredIngredients}
                        onChange={(e) => setPreferredIngredients(e.target.value)}
                        className="search-input"
                    />
                    <input
                        type="text"
                        placeholder="Enter allergies (comma-separated)..."
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="search-input"
                    />
                    <input type='text' placeholder='Enter Height' classname="search-input" />
                    <input type='text' placeholder='Enter Weight' classname="search-input" />
                    <input type='text' placeholder='Enter Activity level' classname="search-input" />
                    <button onClick={fetchRecipes} className="search-button">Search</button>
                </div>
            </div>
            <div className="right-side">
                <div className="recipe-list">
                    {recipes.map((recipe, index) => (

                        
                        <div key={index} className="recipe-card">
                            <h3>{recipe.title}</h3>
                            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                            <h4>Ingredients:</h4>
                            <ul>
                                {recipe.ingredients.map((ingredient, i) => (
                                    <li key={i}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeStream;
