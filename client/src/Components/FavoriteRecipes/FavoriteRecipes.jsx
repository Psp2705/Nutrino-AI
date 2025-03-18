import React from 'react'

const FavoriteRecipes = () => {
  return (
    <div>FavoriteRecipes</div>
  )
}

export default FavoriteRecipes




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
