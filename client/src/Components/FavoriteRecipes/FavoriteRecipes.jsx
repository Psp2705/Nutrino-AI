import { useEffect, useState } from 'react';
import './FavoriteRecipes.css';

const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    setFavoriteRecipes(storedRecipes);
  }, []);

  return (
    <div className="favorite-recipes">
      <div className="favblur-circle orange"></div>
      <div className="favblur-circle red"></div>
      <h2>Your Favorite Recipes</h2>
      {favoriteRecipes.length > 0 ? (
        favoriteRecipes.map((recipe, index) => (
          <div key={index} className="favorite-recipe-card">
            <h3>{recipe.name}</h3>
            <div>
              <strong>Ingredients:</strong>
              <ul>
                {recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
            <div>
              <strong>Steps:</strong>
              <ul>
                {recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p>No favorite recipes yet. Go to Recipe Reels and like some recipes!</p>
      )}
    </div>
  );
};

export default FavoriteRecipes;


// import React from 'react'

// const FavoriteRecipes = () => {
//   return (
//     <div>FavoriteRecipes</div>
//   )
// }

// export default FavoriteRecipes




// import React, { useState, useEffect } from 'react';
// import './FavoriteRecipes.css';

// const FavoriteRecipes = () => {
//   const [favoriteRecipes, setFavoriteRecipes] = useState([]);

//   useEffect(() => {
//     const storedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');

//     // Parsing each recipe to ensure they are correctly read as objects
//     const parsedFavorites = storedFavorites.map((recipe) =>
//       typeof recipe === 'string' ? JSON.parse(recipe) : recipe
//     );

//     setFavoriteRecipes(parsedFavorites);
//   }, []);

//   return (
//     <div className="favorite-recipes-container">
//       <h1>Your Favorite Recipes</h1>
//       <div className="recipes-list">
//         {favoriteRecipes.length > 0 ? (
//           favoriteRecipes.map((recipe, index) => (
//             <div className="recipe-card" key={index}>
//               <h2>{recipe.name}</h2>
//               <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
//               <p><strong>Steps:</strong> {recipe.steps}</p>
//               <p><strong>Directions:</strong> {recipe.directions}</p>
//             </div>
//           ))
//         ) : (
//           <p>No favorite recipes found. Start generating and saving recipes!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FavoriteRecipes;
