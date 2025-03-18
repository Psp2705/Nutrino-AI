import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FavoriteRecipes.css';

const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    setFavoriteRecipes(storedRecipes);
  }, []);

  const handleRemove = (recipeId) => {
    const updatedRecipes = favoriteRecipes.filter(recipe => recipe.recipe_id !== recipeId);
    setFavoriteRecipes(updatedRecipes);
    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedRecipes));
  };

  return (
    <div className="favorite-recipes">
      <div className="favblur-circle orange"></div>
      <div className="favblur-circle red"></div>
      <h2>Your Favorite Recipes</h2>
      {favoriteRecipes.length > 0 ? (
        <div className="favorite-recipes-grid">
          {favoriteRecipes.map((recipe) => (
            <div key={recipe.recipe_id || recipe.name} className="favorite-recipe-card">
              <h3>{recipe.name}</h3>
              
              {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                <div className="recipe-section">
                  <strong>Ingredients:</strong>
                  <ul>
                    {recipe.ingredients.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
                <div className="recipe-section">
                  <strong>Steps:</strong>
                  <ul>
                    {recipe.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
                <div className="recipe-section">
                  <strong>Nutrition:</strong>
                  <ul>
                    {recipe.nutrition.calories && <li>Calories: {recipe.nutrition.calories} kcal</li>}
                    {recipe.nutrition.protein && <li>Protein: {recipe.nutrition.protein}g</li>}
                    {recipe.nutrition.carbs && <li>Carbs: {recipe.nutrition.carbs}g</li>}
                    {recipe.nutrition.fat && <li>Fat: {recipe.nutrition.fat}g</li>}
                  </ul>
                </div>
              )}

              {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
                <div className="recipe-section">
                  <strong>Tags:</strong>
                  <div className="recipe-tags">
                    {recipe.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {recipe.recommendation_score !== undefined && (
                <div className="recipe-section">
                  <p className="recommendation-score">
                    <strong>Match Score:</strong> {(recipe.recommendation_score * 100).toFixed(0)}%
                  </p>
                </div>
              )}

              <button 
                className="remove-button" 
                onClick={() => handleRemove(recipe.recipe_id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-favorites">
          <p>No favorite recipes yet. Go to Recipe Reels and like some recipes!</p>
          <button className="discover-button" onClick={() => navigate('/recipe-reels')}>
            Discover Recipes
          </button>
        </div>
      )}
      
      <button className="back-button" onClick={() => navigate('/user')}>
        Back to Profile
      </button>
    </div>
  );
};

export default FavoriteRecipes;