import React from "react";
import "./FrPrograms.css";
import cardio from "../../assets/cardio.png";
import fitnesstrack from "../../assets/fitnesstrack.png";
import gym from "../../assets/gym.png";
import recipe from "../../assets/recipe.png";
import rightarrow from "../../assets/rightarrow.png";
import { useNavigate } from "react-router-dom";

const ProgramCard = ({ image, heading, details, onJoin }) => {
  return (
    <div className="program-card" id="programs">
      <div className="card-image">{image}</div>
      <div className="card-content">
        <h3>{heading}</h3>
        <p>{details}</p>
        <div className="btn-join" onClick={onJoin}>
          Join Now
          <img src={rightarrow} alt="" className="btn-icon" />
        </div>
      </div>
    </div>
  );
};

const FrPrograms = () => {
  const navigate = useNavigate();

  const handleJoinClick = (programId) => {
    if (programId === 1) {
      navigate("/strengthvids");
    } else if (programId === 2) {
      navigate("/cardiotraining");
    } else if (programId === 3) {
      navigate("/bmicalculator"); // Navigate to BMI Calculator page
    } else if (programId === 4) {
      navigate("/recipes");
    }
  };

  const programsData = [
    {
      id: 1,
      image: <img src={gym} alt="Strength Training" />,
      heading: "Strength Training",
      details: "In this program, you are trained to improve your strength through many exercises.",
      onJoin: () => handleJoinClick(1),
    },
    {
      id: 2,
      image: <img src={cardio} alt="Cardio Training" />,
      heading: "Cardio Training",
      details: "In this program, you are trained to do sequential moves in range of 20 until 30 minutes.",
      onJoin: () => handleJoinClick(2),
    },
    {
      id: 3,
      image: <img src={fitnesstrack} alt="Fitness Tracker" />,
      heading: "BMI Insight",
      details: "Quickly assess your body mass index and get personalized health insights.",
      onJoin: () => handleJoinClick(3), // Join for Fitness Tracker (BMI Calculator)
    },
    {
      id: 4,
      image: <img src={recipe} alt="Diet Recipes" />,
      heading: "Diet Recipes",
      details: "This program offers nutritious and delicious recipes to support a healthy diet and lifestyle.",
      onJoin: () => handleJoinClick(4),
    },
  ];

  return (
    <div className="Programs" id="programs">
      <div className="programs-header">
        <span className="stroke-text">Explore our</span>
        <span>Programs</span>
        <span className="stroke-text">to shape you</span>
      </div>

      <div className="program-categories">
        {programsData.map((program) => (
          <ProgramCard
            key={program.id}
            image={program.image}
            heading={program.heading}
            details={program.details}
            onJoin={program.onJoin}
          />
        ))}
      </div>
    </div>
  );
};

export default FrPrograms;
