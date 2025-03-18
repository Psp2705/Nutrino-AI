import { useEffect, useState } from 'react';
import './FavoriteRecipes.css';

const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    setFavoriteRecipes(storedRecipes);
  }, []);

  const removeFromFavorites = (index) => {
    const updatedFavorites = [...favoriteRecipes];
    updatedFavorites.splice(index, 1);
    setFavoriteRecipes(updatedFavorites);
    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="favorite-recipes">
      <div className="favblur-circle orange"></div>
      <div className="favblur-circle red"></div>
      <h2>Your Favorite Recipes</h2>
      {favoriteRecipes.length > 0 ? (
        favoriteRecipes.map((recipe, index) => (
          <div key={index} className="favorite-recipe-card">
            <h3>{recipe.title || 'Unnamed Recipe'}</h3>

            {recipe.ingredients?.length ? (
              <div>
                <strong>Ingredients:</strong>
                <ul>
                  {recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            ) : <p>No ingredients available</p>}

            {recipe.steps?.length ? (
              <div>
                <strong>Steps:</strong>
                <ul>
                  {recipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                </ul>
              </div>
            ) : <p>No steps provided</p>}

            <button className="remove-btn" onClick={() => removeFromFavorites(index)}>
              Remove from Favorites
            </button>
          </div>
        ))
      ) : (
        <p>No favorite recipes yet. Go to Recipe Reels and like some recipes!</p>
      )}
    </div>
  );
};

export default FavoriteRecipes;
