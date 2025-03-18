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