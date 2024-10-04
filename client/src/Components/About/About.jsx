import React from "react";
import "./About.css";
import aboutImg1 from "../../assets/aboutImg1.jpg";
import doublerightarrow from "../../assets/doublerightarrow.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from framer-motion

const About = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/frhero");
  };

  // Define the animation variants
  const dropInVariants = {
    hidden: {
      y: "-100vh", // Start above the viewport
      opacity: 0, // Start with invisible
    },
    visible: {
      y: 0, // Drop to the original position
      opacity: 1, // Fade in to visible
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
      },
    },
  };

  return (
    <div className="aboutpage">
      <div className="navlogo">NutriAI</div>
      <div className="get-started" onClick={handleGetStartedClick}>
        <p>Get Started</p>
        <img className="getarrowimg" src={doublerightarrow} alt="" />
      </div>
      {/* Use the motion component for the image */}
      <motion.img
        src={aboutImg1}
        alt=""
        className="aboutImg"
        variants={dropInVariants} // Apply the variants
        initial="hidden" // Initial state of animation
        animate="visible" // End state of animation
      />
      <div className="aboutText">
        <div className="what">
          <h1>What is NutriAI?</h1>
          <p>
            NutriAI is an innovative platform designed to revolutionize the way
            we approach nutrition and wellness. By leveraging advanced
            artificial intelligence, NutriAI offers personalized dietary
            recommendations that align with individual health goals and
            preferences.
          </p>
        </div>
        <div className="why">
          <h1>Why does NutriAI matter?</h1>
          <p>
            In today's fast-paced world, maintaining a balanced diet can be
            challenging. With an abundance of conflicting nutritional
            information and busy lifestyles, many people struggle to make
            informed dietary choices. NutriAI addresses this problem by
            providing tailored guidance that helps users make healthier
            decisions effortlessly. This personalized approach ensures that
            everyone, from fitness enthusiasts to those managing chronic
            conditions, can achieve their health objectives effectively.
          </p>
        </div>
        <div className="how">
          <h1>How does NutriAI work?</h1>
          <p>
            NutriAI operates on a sophisticated AI engine that analyzes various
            factors such as age, gender, health status, dietary preferences, and
            fitness goals. Users input their personal data, and the AI processes
            this information to generate customized meal plans and nutritional
            advice. NutriAI continuously learns and adapts to users' changing
            needs, offering real-time updates and suggestions. This dynamic
            interaction ensures that users receive the most accurate and
            relevant nutritional guidance, empowering them to lead healthier
            lives.
          </p>
        </div>
      </div>
      <div className="aboutFooter">
        <div className="footerText">
          <h2>Contact Us</h2>
          <p>Email: asp@nutriAI.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default About;
