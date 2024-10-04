import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./Components/MainLayout"; // Import your MainLayout component
import Hero from "./Components/Hero/Hero";
import About from "./Components/About/About"; // Import your About component
import FrHero from "./Components/FrHero/FrHero";
import PersonalinfoPage from "./Components/PersonalinfoPage/PersonalinfoPage";
import Login from "./Components/Login/Login";
import RecipeStream from "./Components/RecipeStream/RecipeStream";
import Strengthvids from "./Components/Strengthvids/Strengthvids";
import CardioTraining from "./Components/CardioTraining/CardioTraining";
// import WaterReminder from "./Components/WaterReminder/WaterReminder";
import BmiCalculator from "./Components/BmiCalculator/BmiCalculator";
import Chatbot from "./Components/Chatbot/chatbot";
import "./App.css";

const App = () => {
  let heroData = [
    { text1: "Nourish Your Body,", text2: "Balance Your Mind." },
    { text1: "Eat Right,", text2: "Live Bright." },
    { text1: "Fuel Your Day,", text2: "the Right Way." },
  ];
  const [heroCount, setHeroCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount((count) => (count === 2 ? 0 : count + 1));
    }, 3000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <Router>
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
              {/* <WaterReminder /> */}
            </MainLayout>
          }
        />
        {/* Original about page made bt me */}
        <Route path="/about" element={<About />} />

        {/* dashboard page made using framer */}
        <Route path="/frhero" element={<FrHero />} />
        <Route path="/personalinfopage" element={<PersonalinfoPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<RecipeStream />} />
        <Route path="/strengthvids" element={<Strengthvids />} />
        <Route path="/cardiotraining" element={<CardioTraining />} />
        <Route path="/bmicalculator" element={<BmiCalculator />} />
        <Route path="/chatbot" element={<Chatbot />} />
        {/* Programs page from dashboard */}
        {/* <Route path="/frprograms" element={<FrPrograms />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
