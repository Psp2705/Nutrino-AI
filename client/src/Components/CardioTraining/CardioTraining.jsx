import React, { useEffect, useState } from "react";
import "./CardioTraining.css"; // Import the CSS file

const CardioTraining = () => {
  const [videos, setVideos] = useState([]);
  // const [distance, setDistance] = useState("");
  // const [time, setTime] = useState("");
  // const [calories, setCalories] = useState("");
  // const [goal, setGoal] = useState("");
  const [cardioPlan, setCardioPlan] = useState("");
  const [showPlan, setShowPlan] = useState(false);

  const nutritionDiets = [
    "Grilled chicken with quinoa and vegetables",
    "Greek yogurt with berries and honey",
    "Oatmeal with almond butter and banana",
    "Smoothie with spinach, apple, and protein powder",
    "Whole grain toast with avocado and egg",
    "Salmon with sweet potato and broccoli",
    "Chia seed pudding with almond milk and fruit",
    "Turkey wrap with lettuce and hummus",
    "Mixed nuts and an apple",
    "Cottage cheese with pineapple",
  ];

  const cardioChallenges = [
    "Run 5 km in under 30 minutes",
    "Complete a 20-minute HIIT workout",
    "Perform 100 burpees in one session",
    "Run 10 km in one week",
    "Achieve a personal best in a 1-mile run",
  ];

  const [randomNutrition, setRandomNutrition] = useState("");
  const [randomChallenge, setRandomChallenge] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      const API_KEY = "AIzaSyCNsOFGB0fQCnIev7SYLizUQKB0V03p35c"; // Insert your YouTube API key here
      const searchQuery = "cardio training";
      const maxResults = 12; // Number of videos to fetch

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchQuery
          )}&type=video&maxResults=${maxResults}&key=${API_KEY}`
        );
        const data = await response.json();
        const fetchedVideos = data.items.map((item) => ({
          title: item.snippet.title,
          videoId: item.id.videoId,
          thumbnail: item.snippet.thumbnails.high.url, // Using high-quality thumbnails
        }));
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
      }
    };

    fetchVideos();

    // Set random nutrition and challenge
    setRandomNutrition(
      nutritionDiets[Math.floor(Math.random() * nutritionDiets.length)]
    );
    setRandomChallenge(
      cardioChallenges[Math.floor(Math.random() * cardioChallenges.length)]
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle workout log submission logic here
    setDistance("");
    setTime("");
    setCalories("");
  };

  const handleGeneratePlan = () => {
    // Generate a simple cardio plan; you can customize this further
    setCardioPlan(
      "30 minutes of moderate cardio every day. Include interval training twice a week."
    );
    setShowPlan(true);
  };

  const motivationalQuotes = [
    "Push yourself because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Believe it. Build it.",
    "You are stronger than you think.",
  ];

  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="cardio-training">
      <div className="blur-circle circle1"></div>
      <div className="blur-circle circle2"></div>
      <div className="blur-circle circle3"></div>
      <div className="blur-circle circle4"></div>
      <h1>Cardio Training</h1>

      <section className="cardio-videos">
        <h2>Cardio Training Videos</h2>
        <div className="video-list">
          {videos.map((video, index) => (
            <div key={video.videoId} className="video-card">
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-video-link"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <h3 className="video-title">{video.title}</h3>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="personalized-plans">
        <h2>Personalized Cardio Plans</h2>
        <p>
          Create a custom cardio plan based on your fitness level and goals.
        </p>
        <button className="btn" onClick={handleGeneratePlan}>
          Generate Plan
        </button>
        {showPlan && <p>{cardioPlan}</p>}
      </section>

      {/* <section className="workout-logger">
        <h2>Log Your Workout</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Distance (km):
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </label>
          <label>
            Time (min):
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>
          <label>
            Calories Burned:
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </label>
          <button type="submit">Log Workout</button>
        </form>
      </section> */}

      <section className="cardio-challenges">
        <h2>Cardio Challenges</h2>
        <p>{randomChallenge}</p>
      </section>

      <section className="nutrition-guide">
        <h2>Cardio Nutrition Guide</h2>
        <p>{randomNutrition}</p>
      </section>

      <section className="motivational-quote">
        <h2>Motivational Quote</h2>
        <p>{randomQuote}</p>
      </section>
    </div>
  );
};

export default CardioTraining;
