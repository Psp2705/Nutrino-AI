
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import PropTypes from 'prop-types';
import axios from 'axios';
import './User.css';
import { useNavigate } from 'react-router-dom';

const User = ({ userName, userEmail }) => {
  const [userPreference, setUserPreference] = useState('');
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState({
    bmi: null,
    healthStatus: null,
    healthTags: [],
    dailyCalories: null,
    perMealCalories: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const token = localStorage.getItem('firebaseToken');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          console.error('No authentication token or user ID found');
          return;
        }

        // Fetch BMI
        const bmiResponse = await axios.post('http://localhost:8081/api/v1/recommendation', 
          { 
            action: 'calculate_bmi',
            user_id: userId
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        // Fetch Health Profile
        const healthProfileResponse = await axios.post('http://localhost:8081/api/v1/recommendation',
          { 
            action: 'get_health_profile',
            user_id: userId
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        // Fetch Calorie Needs
        const caloriesResponse = await axios.post('http://localhost:8081/api/v1/recommendation',
          { 
            action: 'estimate_calories',
            user_id: userId
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        setHealthData({
          bmi: bmiResponse.data.data.bmi,
          healthStatus: healthProfileResponse.data.data.health_status,
          healthTags: healthProfileResponse.data.data.health_tags,
          dailyCalories: caloriesResponse.data.data.daily_calories,
          perMealCalories: caloriesResponse.data.data.per_meal_calories
        });
      } catch (error) {
        console.error('Error fetching health data:', error);
        // Add user-friendly error message
        setHealthData({
          bmi: null,
          healthStatus: 'Error loading health data',
          healthTags: [],
          dailyCalories: null,
          perMealCalories: null
        });
      }
    };

    fetchHealthData();
  }, []);

  useEffect(() => {
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

  const getBmiMessage = (bmi) => {
    if (bmi < 18.5) return "You are underweight. Consider increasing your caloric intake.";
    if (bmi < 25) return "You have a healthy weight. Keep maintaining your lifestyle!";
    if (bmi < 30) return "You are overweight. Consider reducing caloric intake and increasing physical activity.";
    return "You are obese. Please consult a healthcare provider for personalized advice.";
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
            {healthData.bmi ? (
              <div className="bmi-info">
                <h3>BMI: {healthData.bmi.toFixed(1)}</h3>
                <p>{getBmiMessage(healthData.bmi)}</p>
                
                <div className="health-details">
                  <h4>Health Status: {healthData.healthStatus}</h4>
                  <div className="health-tags">
                    <h4>Recommended Health Tags:</h4>
                    <ul>
                      {healthData.healthTags.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="calorie-info">
                    <h4>Daily Calorie Needs: {Math.round(healthData.dailyCalories)} kcal</h4>
                    <p>Per meal: {Math.round(healthData.perMealCalories)} kcal</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading health profile data...</p>
            )}
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

User.propTypes = {
  userName: PropTypes.string,
  userEmail: PropTypes.string
};

export default User;