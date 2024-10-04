import React from "react";
import "./Hero.css";
import rightarrow from "../../assets/rightarrow.png";
import { useNavigate } from "react-router-dom";
import Background from "../Background/Background"; // Import Background component
import Navbar from "../Navbar/Navbar";

const Hero = ({ heroData, setHeroCount, heroCount }) => {
  const navigate = useNavigate();

  const handleArrowClick = () => {
    console.log("btn clicked");
    navigate("/about");
  };

  return (
    <div className="hero">
      <Background heroCount={heroCount} /> {/* Render Background component */}
      <Navbar />
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      <div className="hero-explore">
        <p>Explore the features</p>
        <img
          className="arrowimg"
          src={rightarrow}
          alt=""
          onClick={handleArrowClick}
        />
      </div>
      <div className="hero-dot-play">
        <ul className="hero-dots">
          <li
            onClick={() => setHeroCount(0)}
            className={heroCount === 0 ? "hero-dot orange" : "hero-dot"}
          ></li>
          <li
            onClick={() => setHeroCount(1)}
            className={heroCount === 1 ? "hero-dot orange" : "hero-dot"}
          ></li>
          <li
            onClick={() => setHeroCount(2)}
            className={heroCount === 2 ? "hero-dot orange" : "hero-dot"}
          ></li>
        </ul>
      </div>
    </div>
  );
};

export default Hero;
