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
        // Get auth data and log for debugging
        const token = localStorage.getItem('firebaseToken');
        let userId = localStorage.getItem('userId');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Try to get userId from user object if not directly stored
        if (!userId && user) {
          userId = user.uid || user.id || user.userId;
          if (userId) {
            localStorage.setItem('userId', userId);
          }
        }

        console.log('Auth Debug:', { 
          hasToken: !!token, 
          hasUserId: !!userId,
          token: token,
          userId: userId,
          user: user
        });
        
        if (!token || !userId) {
          console.log('Missing auth credentials. Token:', token, 'UserId:', userId);
          setError('Please log in to continue. Redirecting...');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }

        setLoading(true);
        setError(null);

        // Fetch recipes directly without auth test
        const recipesResponse = await axios.post('${import.meta.env.VITE_API_URL}/api/v1/recommendation',
          {
            action: 'get_user_recommendations',
            user_id: userId,
            limit: 10
          },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
          }
        );

        // Log the entire response for debugging
        console.log('Raw API Response:', recipesResponse);
        console.log('Response Status:', recipesResponse.status);
        console.log('Response Data:', recipesResponse.data);
        
        // Check if we have any data at all
        if (!recipesResponse.data) {
          setError('No data received from server');
          setLoading(false);
          return;
        }

        // Try to find recipes in the response
        let recipeData = null;
        
        if (Array.isArray(recipesResponse.data)) {
          // If the response is directly an array of recipes
          recipeData = recipesResponse.data;
        } else if (recipesResponse.data.recommendations) {
          // If recipes are in a recommendations field
          recipeData = recipesResponse.data.recommendations;
        } else if (recipesResponse.data.data?.recommendations) {
          // If recipes are nested in data.recommendations
          recipeData = recipesResponse.data.data.recommendations;
        } else if (typeof recipesResponse.data === 'object') {
          // Log all available keys in the response
          console.log('Available keys in response:', Object.keys(recipesResponse.data));
          
          // Try to find an array that looks like recipes
          const arrayFields = Object.entries(recipesResponse.data)
            .filter(([, value]) => Array.isArray(value));
          
          console.log('Array fields found:', arrayFields.map(([key]) => key));
          
          if (arrayFields.length > 0) {
            // Use the first array found that has recipe-like objects
            recipeData = arrayFields.find(([, value]) => 
              value.length > 0 && (
                value[0].recipe_id || 
                value[0].title ||
                value[0].ingredients
              )
            )?.[1];
          }
        }

        if (recipeData && Array.isArray(recipeData)) {
          console.log('Found recipe data:', recipeData);
          setRecipes(recipeData);
          setLoading(false);
        } else {
          console.error('Could not find recipe data in response. Full response:', recipesResponse.data);
          setError('Unexpected response format from server');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in recipe fetch:', error);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('firebaseToken');
          localStorage.removeItem('userId');
          setError('Session expired. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (error.response?.status === 503 || error.message?.includes('timeout')) {
          setError('The recipe service is temporarily unavailable. This might be due to high demand. Please try again in a few minutes.');
        } else if (error.message?.includes('failed to connect')) {
          setError('Unable to connect to the recipe service. Please check your internet connection and try again.');
        } else {
          setError(
            error.response?.data?.detail || 
            'Failed to load recipes. Please try again later.'
          );
        }
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [navigate]);

  const handleLike = (recipe) => {
    const savedRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    // Check if recipe already exists in favorites
    const isAlreadyFavorite = savedRecipes.some(saved => saved.recipe_id === recipe.recipe_id);
    
    if (!isAlreadyFavorite) {
      // Format recipe data for storage, ensuring all required fields exist
      const recipeToSave = {
        recipe_id: recipe.recipe_id || `recipe-${Date.now()}`,
        name: recipe.title || 'Untitled Recipe',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        steps: Array.isArray(recipe.instructions) ? recipe.instructions : [],
        nutrition: recipe.nutrition || {},
        tags: Array.isArray(recipe.tags) ? recipe.tags : [],
        reason: recipe.reason || '',
        recommendation_score: recipe.recommendation_score || 0,
        timestamp: new Date().toISOString()
      };
      
      savedRecipes.push(recipeToSave);
      localStorage.setItem("favoriteRecipes", JSON.stringify(savedRecipes));
      alert(`${recipe.title} added to favorites!`);
    } else {
      alert(`${recipe.title} is already in your favorites!`);
    }
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
      {recipes && recipes.map(recipe => (
        <div key={recipe.recipe_id} className="recipe-card">
          <h3>{recipe.title}</h3>
          <div>
            <strong>Ingredients:</strong>
            <ul>
              {Array.isArray(recipe.ingredients) ? 
                recipe.ingredients.map((item, index) => <li key={index}>{item}</li>) :
                <li>No ingredients available</li>
              }
            </ul>
          </div>
          <div>
            <strong>Why Recommended:</strong>
            <p>{recipe.reason || 'No reason provided'}</p>
            <p className="recommendation-score">
              <strong>Match Score:</strong> {(recipe.recommendation_score * 100).toFixed(0)}%
            </p>
          </div>
          <div>
            <strong>Nutrition:</strong>
            {recipe.nutrition && (
              <ul>
                <li>Calories: {recipe.nutrition.calories} kcal</li>
                <li>Protein: {recipe.nutrition.protein}g</li>
                <li>Carbs: {recipe.nutrition.carbs}g</li>
                <li>Fat: {recipe.nutrition.fat}g</li>
              </ul>
            )}
          </div>
          <div>
            <strong>Tags:</strong>
            <div className="recipe-tags">
              {Array.isArray(recipe.tags) && recipe.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="like-icon" onClick={() => handleLike(recipe)}>❤️</div>
        </div>
      ))}
      <button onClick={() => navigate('/favorite-recipes')}>View Favorites</button>
    </div>
  );
};

export default RecipeReels;
