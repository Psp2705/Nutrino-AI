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
      {/* <nav className="navbar">
        <button>Home</button>
        <button>Work</button>
        <button>About</button>
      </nav> */}

      <div className="main-content">
        <div className="card intro-card">
          <h1>Hi, this is {userName || 'User'}</h1>
          <p>{loading ? "Loading your preferences..." : userPreference}</p>
        </div>

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
            {/* <div className="icon-placeholder"></div> */}
            <h2>My Recipes</h2>
            <p>Explore a world of flavors tailored just for you! With a click, generate delicious recipes that match your preferences and health needs. Find your favorite recipes here and create meals you'll love, every time.</p>
            <button onClick={handleGenerateRecipes}>Generate Recipes</button>
          </div>
          <div className="card about-card">
            {/* <div className="icon-placeholder"></div> */}
            <h2>Favorite Recipes</h2>
            <p>Discover and save your favorite recipes here!</p>
            <button onClick={handleFavoriteRecipes}>VIEW FAVORITES</button>
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