import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipeGeneration.css';

const RecipeGeneration = () => {
  const navigate = useNavigate();
  // Assuming recipes will come from the backend model
  const recipes = []; // Placeholder for backend integration

  return (
    <div className="recipes-container">
      <h1>Generated Recipes</h1>
      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <div className="recipe-card" key={index}>
            <h3>{/* Recipe Name - to be filled by backend */}</h3>
            <div className="recipe-content">
              <h4>Ingredients:</h4>
              <ul>{/* Ingredients list - to be filled by backend */}</ul>
              <h4>Steps:</h4>
              <ol>{/* Steps list - to be filled by backend */}</ol>
              <h4>Directions:</h4>
              <p>{/* Directions - to be filled by backend */}</p>
            </div>
            <button className="favorite-btn">
              {/* Add favorite icon here */}
              Favorite
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/user')}>Back to Profile</button>
    </div>
  );
};

export default RecipeGeneration;


// import React, { useState } from 'react';
// import { AiFillHeart } from 'react-icons/ai';
// import './RecipeGeneration.css';

// const RecipeGeneration = () => {
//   const [generatedRecipes, setGeneratedRecipes] = useState([]);

//   const handleGenerateRecipes = () => {
//     // Placeholder data - Replace this with backend integration
//     const newRecipes = [
//       {
//         name: 'Grilled Chicken Salad',
//         ingredients: 'Chicken, Lettuce, Tomato, Olive Oil',
//         steps: 'Grill the chicken, prepare the salad, mix and serve.',
//         directions: 'Grill the chicken until golden, mix with fresh vegetables and olive oil.'
//       },
//       {
//         name: 'Smoothie Bowl',
//         ingredients: 'Banana, Berries, Yogurt, Honey',
//         steps: 'Blend all ingredients and serve with toppings.',
//         directions: 'Blend fruits and yogurt, serve with honey and berries on top.'
//       }
//     ];
//     setGeneratedRecipes(newRecipes);
//   };

//   const handleFavorite = (recipe) => {
//     const storedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
//     storedFavorites.push(recipe);
//     localStorage.setItem('favoriteRecipes', JSON.stringify(storedFavorites));
//     alert(`${recipe.name} has been added to your favorites!`);
//   };

//   return (
//     <div className="generate-recipes-container">
//       <h1>Generate Recipes</h1>
//       <button onClick={handleGenerateRecipes}>Generate Recipes</button>

//       <div className="recipes-list">
//         {generatedRecipes.map((recipe, index) => (
//           <div className="recipe-card" key={index}>
//             <h2>{recipe.name}</h2>
//             <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
//             <p><strong>Steps:</strong> {recipe.steps}</p>
//             <p><strong>Directions:</strong> {recipe.directions}</p>
//             <AiFillHeart size={25} className="favorite-icon" onClick={() => handleFavorite(recipe)} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RecipeGeneration;
