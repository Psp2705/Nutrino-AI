import React, { useState } from 'react';
import axios from 'axios';
import './RecipeStream.css'; // Ensure this file is updated with the new CSS

const RecipeStream = () => {
    const [preferredIngredients, setPreferredIngredients] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');

    const fetchRecipes = async () => {
        try {
            const token = localStorage.getItem('firebaseToken');
            if (!token) {
                setError('Please log in to continue');
                return;
            }

            const response = await axios.post('http://localhost:8081/api/v1/recommendation', {
                action: 'recommend',
                ingredients: preferredIngredients.split(',').map(ing => ing.trim()),
                height_cm: parseFloat(height),
                weight_kg: parseFloat(weight),
                activity_level: parseFloat(activityLevel),
                limit: 10
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setRecipes(response.data.data.recipes);
            setError('');
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError(error.response?.data?.detail || 'Failed to fetch recipes');
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
                        type="number" 
                        placeholder="Enter Height (cm)" 
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="searchh-input" 
                    />
                    <input 
                        type="number" 
                        placeholder="Enter Weight (kg)" 
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="searchh-input" 
                    />
                    <input 
                        type="number" 
                        placeholder="Enter Activity level (1-5)" 
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        min="1"
                        max="5"
                        className="searchh-input" 
                    />
                    <button onClick={fetchRecipes} className="search-button">Search</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
            <div className="right-side">
                <div className="recipe-list">
                    {recipes.map((recipe, index) => (
                        <div key={index} className="recipe-card">
                            <h3>{recipe.title}</h3>
                            <p className="recipe-id">Recipe ID: {recipe.recipe_id}</p>
                            
                            <div className="recipe-section">
                                <h4>Ingredients:</h4>
                                <ul>
                                    {Array.isArray(recipe.ingredients) ? 
                                        recipe.ingredients.map((ingredient, i) => (
                                            <li key={i}>{ingredient}</li>
                                        )) : 
                                        <li>No ingredients available</li>
                                    }
                                </ul>
                            </div>

                            <div className="recipe-section">
                                <h4>Instructions:</h4>
                                <ol>
                                    {Array.isArray(recipe.instructions) ? 
                                        recipe.instructions.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        )) : 
                                        <li>No instructions available</li>
                                    }
                                </ol>
                            </div>

                            <div className="recipe-section">
                                <h4>Nutrition Information:</h4>
                                {recipe.nutrition ? (
                                    <ul className="nutrition-list">
                                        <li>Calories: {recipe.nutrition.calories || 'N/A'} kcal</li>
                                        <li>Protein: {recipe.nutrition.protein || 'N/A'} g</li>
                                        <li>Carbs: {recipe.nutrition.carbs || 'N/A'} g</li>
                                        <li>Fat: {recipe.nutrition.fat || 'N/A'} g</li>
                                    </ul>
                                ) : (
                                    <p>No nutrition information available</p>
                                )}
                            </div>

                            <div className="recipe-section">
                                <h4>Tags:</h4>
                                <div className="recipe-tags">
                                    {Array.isArray(recipe.tags) && recipe.tags.length > 0 ? 
                                        recipe.tags.map((tag, i) => (
                                            <span key={i} className="tag">{tag}</span>
                                        )) : 
                                        <p>No tags available</p>
                                    }
                                </div>
                            </div>

                            {/* {recipe.reason && (
                                <p className="recommendation-reason">
                                    <strong>Why Recommended:</strong> {recipe.reason}
                                </p>
                            )} */}
                            {/* {recipe.recommendation_score && (
                                <p className="recommendation-score">
                                    <strong>Match Score:</strong> {(recipe.recommendation_score * 100).toFixed(0)}%
                                </p>
                            )} */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeStream;
