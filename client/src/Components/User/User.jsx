import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import PropTypes from 'prop-types';
import axios from 'axios';
import './User.css';
import { useNavigate } from 'react-router-dom';
import recipe1 from "../../assets/recipe1.webp"
import recipe2 from "../../assets/recipe2.jpg"
import recipe3 from "../../assets/recipe3.jpg"

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

        console.log('Making health data request with:', {
          userId,
          tokenExists: !!token,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Fetch BMI
        const bmiResponse = await axios.post('http://localhost:8081/api/v1/recommendation', 
          { 
            action: 'calculate_bmi',
            user_id: userId
          },
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        console.log('BMI Response:', bmiResponse.data);
        
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
      <div className="blur-circle orange"></div>
      <div className="blur-circle red"></div>
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

      <div className="similar-users-section">
        <h2>Similar Users</h2>
        <div className="similar-users-grid">
          <SimilarUsers />
        </div>
      </div>

      <div className="get-template-button">
        <button onClick={() => navigate("/frhero")}>Home</button>
      </div>
    </div>
  );
};

// Similar Users Component
const SimilarUsers = () => {
  const [similarUsers, setSimilarUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarUsers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('firebaseToken');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          setError('Please log in to view similar users');
          setIsLoading(false);
          return;
        }

        console.log('Making similar users request with:', {
          userId,
          tokenExists: !!token
        });

        const response = await axios.post('http://localhost:8081/api/v1/recommendation', 
          {
            action: 'get_similar_users',
            user_id: userId,
            limit: 4
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Similar Users Response:', response.data);

        if (response.data?.data?.similar_users) {
          setSimilarUsers(response.data.data.similar_users);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Invalid response format from server');
        }
      } catch (error) {
        console.error('Error fetching similar users. Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          error: error.message
        });
        
        // If we have detailed error information from the server, display it
        const errorMessage = error.response?.data?.message || error.response?.data || error.message;
        setError(`Server Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarUsers();
  }, []);

  if (isLoading) {
    return <p className="loading-message">Loading similar users...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return similarUsers.length === 0 ? (
    <p className="no-users-message">No similar users found</p>
  ) : (
    <div className="similar-users-grid">
      {similarUsers.map((user, index) => (
        <div key={index} className="similar-user-card">
          <div className="user-avatar">
            {user[0] ? user[0][0].toUpperCase() : '?'}
          </div>
          <div className="user-info">
            <h3>{user[0] || 'Anonymous User'}</h3>
            <div className="similarity-score">
              <span>Similarity Score: {(user[1] * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

User.propTypes = {
  userName: PropTypes.string,
  userEmail: PropTypes.string
};

export default User;