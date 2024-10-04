import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FrHero.css";
import FrHeader from "../FrHeader/FrHeader";
import Heart from "../../assets/heart.png";
import hero_image_back from "../../assets/hero_image_back.png";
import hero_image from "../../assets/hero_image.png";
import FrPrograms from "../FrPrograms/FrPrograms";
// import Plans from "../Plans/Plans";
import Join from "../Join/Join";
import Footer from "../Footer/Footer";
import { motion } from "framer-motion";

const FrHero = () => {
  const transition = { type: "spring", duration: 2 };
  const mobile = window.innerWidth <= 768;
  const navigate = useNavigate();
  const location = useLocation();
  const [showChatbot, setShowChatbot] = useState(false);

  const handlePersonalInfoPage = () => {
    navigate("/login");
  };
  const handlechatbot = () => {
    navigate("/chatbot");
  };
  useEffect(() => {
    // Check if the current page is /frhero
    const isFrHeroPage = location.pathname === "/frhero";
    setShowChatbot(isFrHeroPage);

    if (isFrHeroPage) {
      // Add Chatbase script dynamically
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.async = true;
      script.defer = true;
      script.setAttribute("chatbotId", "l8ylqNiy8GkNDD3nez-z8");
      script.setAttribute("domain", "www.chatbase.co");
      document.body.appendChild(script);

      // Cleanup function to remove script and chatbot DOM elements
      return () => {
        // Remove Chatbase script when component unmounts or path changes
        document.body.removeChild(script);

        // Clear Chatbase chat container content
        const chatbotContainer = document.getElementById("chatbase-chat");
        if (chatbotContainer) {
          chatbotContainer.innerHTML = "";
        }
      };
    }
  }, [location.pathname]); // Re-run the effect when the location changes

  return (
    <div id="home">
      <div className="blur hero-blur"></div>
      <div className="hero">
        <div className="blur hero-blur-1"></div>
        <div className="blur hero-blur-2"></div>
        {/* <div className="background-circle-orange"></div>
        <div className="background-circle-red"></div>
        <div className="background-circle-orange2"></div>
        <div className="background-circle-red2"></div> */}
        <div className="left-h">
          <FrHeader />
          <div className="the-best-ad">
            <motion.div
              initial={{ left: mobile ? "165px" : "238px" }}
              whileInView={{ left: "8px" }}
              transition={{ ...transition, type: "tween" }}
            />
            <span>The Elite Nutrition Companion</span>
          </div>

          <div className="fr-hero-text">
            <div>
              <span className="stroke-text">Shape </span>
              <span>Your</span>
            </div>
            <div>
              <span>Ideal Body</span>
            </div>
            <div>
              <span>
                In here we will help you to shape and build your ideal body and
                live up to your life to fullest
              </span>
            </div>
          </div>

          <div className="hero-buttons">
            <button className="btn" onClick={handlechatbot}>Get Started</button>
            <button className="btn">Learn More</button>
          </div>
        </div>
        <div className="right-h">
          <button className="btn-join" onClick={handlePersonalInfoPage}>
            Join Now
          </button>
          <motion.div
            initial={{ right: "-1rem" }}
            whileInView={{ right: "4rem" }}
            transition={transition}
            className="heart-rate"
          >
            <img src={Heart} alt="Heart" />
            <span>Heart Rate</span>
            <span>116 bpm</span>
          </motion.div>

          <img src={hero_image} alt="Hero" className="hero-image" />
          <motion.img
            initial={{ right: "11rem" }}
            whileInView={{ right: "20rem" }}
            transition={transition}
            src={hero_image_back}
            alt="Hero Background"
            className="hero-image-back"
          />
        </div>
      </div>
      <FrPrograms />
      {/* <Plans /> */}
      <Join />
      <Footer />

      {/* Chatbase Chatbot Container */}
      {showChatbot && (
        <div className="chatbot-content" id="chatbase-chat"></div>
      )}
    </div>
  );
};

export default FrHero;
