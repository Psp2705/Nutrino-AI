import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './User.css';
import { useNavigate } from 'react-router-dom';
import recipe1 from "../../assets/recipe1.webp"
import recipe2 from "../../assets/recipe2.jpg"
import recipe3 from "../../assets/recipe3.jpg"

const User = ({ userName, userEmail }) => {
  const [userPreference, setUserPreference] = useState('');
  const [loading, setLoading] = useState(true);
  const [bmiData, setBmiData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch BMI data from local storage
    const storedBmiData = localStorage.getItem("bmiData");
    if (storedBmiData) {
      setBmiData(JSON.parse(storedBmiData));
    }
    
    const fetchUserPreference = async () => {
      const storedUserPreferences = localStorage.getItem("userPreferences");

      if (storedUserPreferences) {
        const userData = JSON.parse(storedUserPreferences);
        const preferenceMessage = `I am ${userData.name}, a ${userData.age}-year-old interested in ${userData.foodPreferences}. I have a history of ${userData.healthHistory} and allergies to ${userData.allergies}.`;
        setUserPreference(preferenceMessage);
      } else {
        console.log('No user preferences found in localStorage.');
        setUserPreference('No preferences found.');
      }

      setLoading(false);
    };

    fetchUserPreference();
  }, [userName, userEmail]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleGenerateRecipes = () => {
    navigate('/recipes'); // Navigate to recipes page
  };

  const handleFavoriteRecipes = () => {
    navigate('/favorite-recipes'); // Navigate to favorite recipes page
  };

  return (
    <div className="portfolio-container">
      <div className="blur-circle orange"></div>
      <div className="blur-circle red"></div>

      <div className="main-content">
        {/* First Card - Intro Card */}
        <div className="card intro-card">
          <h1>Hi, this is {userName || 'User'}</h1>
          <p>{loading ? "Loading your preferences..." : userPreference}</p>
        </div>

        {/* Recipe Reels Card */}
        <div className="card-grid">
          <div className="card image-card" onClick={() => navigate("/recipe-reels")} >
            <p>Scroll & Click to Explore Recipes</p>
            <div className="image-placeholder">
              <div className='image-scroll'>
                <img src={recipe1} alt="Recipe 1" />
                <img src={recipe2} alt="Recipe 2" />
                <img src={recipe3} alt="Recipe 3" />
              </div>
            </div>
          </div>
          
          {/* Health Profile Card */}
          <div className="card skills-card">
            <h2>Health Profile</h2>
            {bmiData ? (
              <div className="bmi-info">
                <h3>BMI: {bmiData.bmi} ({formatDate(bmiData.calculatedAt)})</h3>
                <p>{bmiData.message}</p>
                
                {bmiData.planner && bmiData.planner.recipes && (
                  <div className="health-plan">
                    <h4>Recommended Diet</h4>
                    <ul className="diet-list">
                      {bmiData.planner.recipes.map((recipe, index) => (
                        <li key={index}>{recipe}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>No BMI data available. Please visit the BMI calculator to generate your health profile.</p>
            )}
          </div>
        </div>

        {/* Generate & View Recipes Section */}
        <div className="card-grid">
          <div className="card work-card">
            <h2>My Recipes</h2>
            <p>Explore a world of flavors tailored just for you! Click to generate delicious recipes that match your preferences and health needs.</p>
            <button onClick={handleGenerateRecipes}>Generate Recipes</button>
          </div>
          <div className="card about-card">
            <h2>Favorite Recipes</h2>
            <p>Discover and save your favorite recipes here!</p>
            <button onClick={handleFavoriteRecipes}>VIEW FAVORITES</button>
          </div>
        </div>
      </div>

      <div className="social-icons">
        <button>User1</button>
        <button>User2</button>
        <button>User3</button>
        <button>User4</button>
      </div>

      <div className="get-template-button">
        <button onClick={() => navigate("/frhero")}>Home</button>
      </div>
    </div>
  );
};

export default User;
