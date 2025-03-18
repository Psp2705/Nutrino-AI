import { useState, useEffect } from 'react';
import './RecipeReels.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeReels = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('firebaseToken');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          setError('Please log in to view recipes');
          setLoading(false);
          return;
        }

        const response = await axios.post('http://localhost:8081/api/v1/recommendation',
          {
            action: 'get_user_recommendations',
            user_id: userId,
            limit: 10
          },
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        setRecipes(response.data.data.recommendations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to load recipes. Please try again later.');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleLike = (recipe) => {
    const savedRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    savedRecipes.push(recipe);
    localStorage.setItem("favoriteRecipes", JSON.stringify(savedRecipes));
    alert(`${recipe.title} added to favorites!`);
  };

  if (loading) {
    return (
      <div className="recipe-reels">
        <div className="recipeblur-circle orange"></div>
        <div className="recipeblur-circle red"></div>
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-reels">
        <div className="recipeblur-circle orange"></div>
        <div className="recipeblur-circle red"></div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="recipe-reels">
      <div className="recipeblur-circle orange"></div>
      <div className="recipeblur-circle red"></div>
      {recipes.map(recipe => (
        <div key={recipe.recipe_id} className="recipe-card">
          <h3>{recipe.title}</h3>
          <div>
            <strong>Ingredients:</strong>
            <ul>
              {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <strong>Instructions:</strong>
            <ul>
              {recipe.instructions.map((step, index) => <li key={index}>{step}</li>)}
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
