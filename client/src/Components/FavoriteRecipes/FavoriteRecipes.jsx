// FavoriteRecipes.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FavoriteRecipes.css';

const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteRecipes();
  }, []);

  const fetchFavoriteRecipes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('firebaseToken');
    
      if (!token) {
        setError('Please login to view your favorite recipes');
        navigate('/login');
        return;
      }
      // Get user recommendations which includes rated recipes
      const response = await axios.post('http://localhost:8081/api/v1/recommendation', {
        action: "get_user_recommendations",
        limit: 10
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data); // Debug log

    if (response.data?.status === 'success' && response.data?.data?.recommendations) {
      console.log('First recipe data:', response.data.data.recommendations[0]); // Debug log for first recipe
      setFavoriteRecipes(response.data.data.recommendations);
      setError(null);
    } else {
      setError('No recipes found');
      setFavoriteRecipes([]);
    }
  } catch (err) {
    console.error('Error:', err);
    setError('Failed to fetch favorite recipes');
    setFavoriteRecipes([]);
  } finally {
    setLoading(false);
  }
};

  const handleBackToUser = () => {
    navigate('/user');
  };

  if (loading) {
    return (
      <div className="favorite-recipes-container">
        <h1>Loading your favorite recipes...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorite-recipes-container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={handleBackToUser}>Back to Profile</button>
      </div>
    );
  }

  return (
    <div className="favorite-recipes-container">
      <div className="favorite-recipes-header">
        <h1>Your Favorite Recipes</h1>
        <button onClick={handleBackToUser}>Back to Profile</button>
      </div>
      
      <div className="recipes-list">
        {favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((recipe) => (
            <div key={recipe.recipe_id} className="recipe-card">
              <img src={recipe.image || 'https://via.placeholder.com/300x200'} alt={recipe.title} />
              <div className="recipe-info">
                <h3>{recipe.title}</h3>
                <div className="rating">
                  Recommendation Score: {(recipe.recommendation_score * 100).toFixed(1)}%
                </div>
                <div className="calories">
                  Calories: {recipe.nutrition?.calories || 'N/A'}
                </div>
                <p>{recipe.reason}</p>
                <div className="ingredients">
                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.ingredients?.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div className="tags">
                  <h4>Tags:</h4>
                  <ul>
                    {recipe.tags?.map((tag, index) => (
                      <li key={index}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-recipes">
            <p>No favorite recipes found. Start generating and rating recipes!</p>
            <button onClick={handleBackToUser}>Back to Profile</button>
          </div>
        )}
      </div>
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
