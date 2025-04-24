import { useState, useEffect } from 'react';
import './RecipeReels.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 10000; // 10 seconds

const RecipeReels = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchWithRetry = async (url, options, retryCount = 0) => {
    try {
      const response = await axios(url, options);
      setRetryCount(0); // Reset retry count on success
      return response;
    } catch (error) {
      if (retryCount < MAX_RETRIES && 
          (error.code === 'ECONNABORTED' || error.response?.status === 503)) {
        setRetryCount(retryCount + 1); // Update retry count
        console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, {
          ...options,
          timeout: options.timeout * 1.5 // Increase timeout with each retry
        }, retryCount + 1);
      }
      throw error;
    }
  };

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

        // First try health check
        try {
          await fetchWithRetry('http://localhost:8081/health', {
            method: 'GET',
            timeout: 5000
          });
        } catch (error) {
          console.error('Health check failed:', error);
          setError('The server appears to be down. Please try again later.');
          setLoading(false);
          return;
        }

        // Fetch recipes with retry logic
        const recipesResponse = await fetchWithRetry(
          'http://localhost:8081/api/v1/recommendation',
          {
            method: 'POST',
            data: {
              action: 'get_user_recommendations',
              user_id: userId,
              limit: 10
            },
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: INITIAL_TIMEOUT
          }
        );

        // Log the entire response for debugging
        console.log('Raw API Response:', recipesResponse);
        
        // Check if we have any data at all
        if (!recipesResponse.data) {
          setError('No data received from server');
          setLoading(false);
          return;
        }

        // Try to find recipes in the response
        let recipeData = null;
        
        if (Array.isArray(recipesResponse.data)) {
          recipeData = recipesResponse.data;
        } else if (recipesResponse.data.recommendations) {
          recipeData = recipesResponse.data.recommendations;
        } else if (recipesResponse.data.data?.recommendations) {
          recipeData = recipesResponse.data.data.recommendations;
        } else if (typeof recipesResponse.data === 'object') {
          // Try to find an array that looks like recipes
          const arrayFields = Object.entries(recipesResponse.data)
            .filter(([, value]) => Array.isArray(value));
          
          if (arrayFields.length > 0) {
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
          console.error('Could not find recipe data in response:', recipesResponse.data);
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
        } else if (error.response?.status === 503 || error.code === 'ECONNABORTED') {
          setError('The recipe service is temporarily unavailable. This might be due to high demand. Please try again in a few minutes.');
        } else if (error.message?.includes('Network Error')) {
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
    try {
      const savedRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
      // Check if recipe already exists in favorites
      const isAlreadyFavorite = savedRecipes.some(saved => saved.recipe_id === recipe.recipe_id);
      
      if (!isAlreadyFavorite) {
        // Format recipe data for storage
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
    } catch (err) {
      console.error('Error saving recipe to favorites:', err);
      alert('Failed to save recipe to favorites. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="recipe-reels">
        <div className="recipeblur-circle orange"></div>
        <div className="recipeblur-circle red"></div>
        <div className="loading-container">
          <p>Loading recipes...</p>
          {retryCount > 0 && (
            <p className="retry-message">
              Retry attempt {retryCount} of {MAX_RETRIES}...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-reels">
        <div className="recipeblur-circle orange"></div>
        <div className="recipeblur-circle red"></div>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-reels">
      <div className="recipeblur-circle orange"></div>
      <div className="recipeblur-circle red"></div>
      {recipes && recipes.length > 0 ? (
        recipes.map(recipe => (
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
        ))
      ) : (
        <div className="no-recipes">
          <p>No recipes found. Try refreshing the page or check back later.</p>
          <button onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      )}
      <button className="view-favorites" onClick={() => navigate('/favorite-recipes')}>
        View Favorites
      </button>
    </div>
  );
};

export default RecipeReels; 