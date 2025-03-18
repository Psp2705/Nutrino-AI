import React, { useState } from 'react';
import './RecipeReels.css';
import { useNavigate } from 'react-router-dom';

const recipes = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    ingredients: ["Chicken Breast", "Lettuce", "Avocado", "Olive Oil", "Lemon"],
    steps: ["Grill the chicken.", "Chop lettuce and avocado.", "Mix with olive oil and lemon."],
  },
  {
    id: 2,
    name: "Fruit Smoothie",
    ingredients: ["Banana", "Milk", "Honey", "Berries"],
    steps: ["Blend all ingredients until smooth."],
  },
  {
    id: 3,
    name: "Vegetable Stir Fry",
    ingredients: ["Bell Peppers", "Broccoli", "Soy Sauce", "Tofu"],
    steps: ["Stir fry vegetables.", "Add tofu and soy sauce.", "Serve hot."],
  },
];

const RecipeReels = () => {
  const navigate = useNavigate();

  const handleLike = (recipe) => {
    const savedRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    savedRecipes.push(recipe);
    localStorage.setItem("favoriteRecipes", JSON.stringify(savedRecipes));
    alert(`${recipe.name} added to favorites!`);
  };

  return (
    <div className="recipe-reels">
      {recipes.map(recipe => (
        <div key={recipe.id} className="recipe-card">
          <h3>{recipe.name}</h3>
          <div>
            <strong>Ingredients:</strong>
            <ul>
              {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <strong>Steps:</strong>
            <ul>
              {recipe.steps.map((step, index) => <li key={index}>{step}</li>)}
            </ul>
          </div>
          <div className="like-icon" onClick={() => handleLike(recipe)}>❤️</div>
        </div>
      ))}
      <button onClick={() => navigate('/favorite-recipes')}>View Favorites</button>
    </div>
  );
};

export default RecipeReels;
