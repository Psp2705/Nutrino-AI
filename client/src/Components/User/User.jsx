import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './User.css';
import { useNavigate } from 'react-router-dom';

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
      if (userName && userEmail) {
        try {
          const trimmedUserName = userName.trim();
          const trimmedUserEmail = userEmail.trim();
          console.log('Fetching data for user:', trimmedUserName, 'with email:', trimmedUserEmail);

          const userHistoryRef = collection(db, 'userHistory');
          const q = query(
            userHistoryRef,
            where('name', '==', trimmedUserName),
            where('email', '==', trimmedUserEmail)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log('Fetched User Data:', userData);
            const preferenceMessage = `I am ${userData.name}, a ${userData.age}-year-old interested in ${userData.foodPreferences}. I have a history of ${userData.healthHistory} and allergies to ${userData.allergies}.`;
            setUserPreference(preferenceMessage);
          } else {
            console.log('No matching user data found.');
            setUserPreference('No preferences found.');
          }
        } catch (error) {
          console.error('Error fetching user preferences:', error);
          setUserPreference('Failed to fetch preferences. Please try again later.');
        }
        setLoading(false);
      }
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
      <nav className="navbar">
        <button>Home</button>
        <button>Work</button>
        <button>About</button>
      </nav>

      <div className="main-content">
        <div className="card intro-card">
          <h1>Hi, this is {userName || 'User'}</h1>
          <p>{loading ? "Loading your preferences..." : userPreference}</p>
        </div>

        <div className="card-grid">
          <div className="card image-card">
            <div className="image-placeholder"></div>
          </div>
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
            {/* <div className="skills">
              <h4>Design skills</h4>
              Dora / HTML & CSS / Figma / Prototyping / Wireframing / p5.js / Adobe XD / InDesign
            </div> */}
          </div>
        </div>

        <div className="card-grid">
          <div className="card work-card">
            <div className="icon-placeholder"></div>
            <h2>My Recipes</h2>
            <button onClick={handleGenerateRecipes}>Generate Recipes</button>
          </div>
          <div className="card about-card">
            <div className="icon-placeholder"></div>
            <h2>Favorite Recipes</h2>
            <p onClick={handleFavoriteRecipes}>VIEW FAVORITES</p>
          </div>
        </div>
      </div>

      <div className="social-icons">
        <button>Behance</button>
        <button>LinkedIn</button>
        <button>Instagram</button>
        <button>Facebook</button>
      </div>

      <div className="get-template-button">
        <button>Get Template</button>
      </div>
    </div>
  );
};

export default User;