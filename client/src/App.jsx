// Updated App.jsx with Navigation
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import Hero from "./Components/Hero/Hero";
import About from "./Components/About/About";
import FrHero from "./Components/FrHero/FrHero";
import PersonalinfoPage from "./Components/PersonalinfoPage/PersonalinfoPage";
import Login from "./Components/Login/Login";
import RecipeStream from "./Components/RecipeStream/RecipeStream";
import Strengthvids from "./Components/Strengthvids/Strengthvids";
import CardioTraining from "./Components/CardioTraining/CardioTraining";
import BmiCalculator from "./Components/BmiCalculator/BmiCalculator";
import Chatbot from "./Components/Chatbot/chatbot";
import User from "./Components/User/User";
// import RecipeReels from "./Components/RecipeReels/RecipeReels";
// import FavoriteRecipes from "./Components/FavoriteRecipes/FavoriteRecipes";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './App.css';

const App = () => {
  let heroData = [
    { text1: "Nourish Your Body,", text2: "Balance Your Mind." },
    { text1: "Eat Right,", text2: "Live Bright." },
    { text1: "Fuel Your Day,", text2: "the Right Way." }
  ];
  const [heroCount, setHeroCount] = useState(1);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((count) => (count === 2 ? 0 : count + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
      }
    });
  }, []);

  return (
    <Router>
      <div className="p-4 bg-gray-100 min-h-screen">
        {/* <nav className="mb-6">
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/user" className="mr-4">User</Link>
          <Link to="/bmicalculator" className="mr-4">BMI Calculator</Link>
          <Link to="/recipes" className="mr-4">Recipe Stream</Link>
          <Link to="/recipereels" className="mr-4">Recipe Reels</Link>
          <Link to="/favorites" className="mr-4">Favorite Recipes</Link>
        </nav> */}
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout heroCount={heroCount}>
                <Hero
                  heroData={heroData[heroCount]}
                  heroCount={heroCount}
                  setHeroCount={setHeroCount}
                />
              </MainLayout>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/frhero" element={<FrHero />} />
          <Route path="/personalinfopage" element={<PersonalinfoPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recipes" element={<RecipeStream />} />
          {/* <Route path="/recipereels" element={<RecipeReels />} /> */}
          <Route path="/strengthvids" element={<Strengthvids />} />
          <Route path="/cardiotraining" element={<CardioTraining />} />
          <Route path="/bmicalculator" element={<BmiCalculator />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/user" element={<User userName={userName} />} />
          {/* <Route path="/favorites" element={<FavoriteRecipes />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
