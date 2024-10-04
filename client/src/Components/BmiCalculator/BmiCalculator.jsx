import React, { useState } from "react";
import "./BmiCalculator.css";

const BmiCalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState("");
  const [planner, setPlanner] = useState(null); // New state for the planner

  const calculateBMI = () => {
    if (weight && height && age) {
      const heightInMeters = height / 100; // Convert cm to meters
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(bmiValue);
      determineMessageAndPlanner(bmiValue);
    }
  };

  const determineMessageAndPlanner = (bmiValue) => {
    let plannerDetails = {};
    if (bmiValue < 18.5) {
      setMessage(
        `You are underweight. Aim to gain ${getWeightAdjustment(
          bmiValue,
          "gain"
        )} kg.`
      );
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      setMessage("You are within the normal range.");
      setPlanner(null); // No planner needed for normal range
    } else if (bmiValue >= 25) {
      setMessage(
        `You are overweight. Aim to lose ${getWeightAdjustment(
          bmiValue,
          "lose"
        )} kg.`
      );
      plannerDetails = generatePlanner("lose");
    }
    setPlanner(plannerDetails);
  };

  const getWeightAdjustment = (bmiValue, action) => {
    const normalBmi = 22; // Midpoint of the normal BMI range (18.5 - 24.9)
    const heightInMeters = height / 100;
    const idealWeight = normalBmi * heightInMeters * heightInMeters;
    return Math.abs((weight - idealWeight).toFixed(2));
  };

  const generatePlanner = (action) => {
    if (action === "gain") {
      return {
        diet: [
          "Increase protein intake: Include eggs, lean meats, and legumes.",
          "Add healthy fats: Use nuts, seeds, and avocados.",
          "Consume high-calorie snacks: Opt for peanut butter and smoothies.",
        ],
        exercise: [
          "Strength training: Focus on compound exercises like squats and deadlifts.",
          "Weight lifting: Aim for 3-4 sessions per week.",
          "Rest and recovery: Allow your body enough time to recover between workouts.",
        ],
      };
    } else if (action === "lose") {
      return {
        diet: [
          "Reduce calorie intake: Cut down on sugary and fatty foods.",
          "Increase fiber intake: Eat more vegetables and whole grains.",
          "Opt for low-carb meals: Include lean protein and avoid processed carbs.",
        ],
        exercise: [
          "Cardio: Do at least 30 minutes of brisk walking or cycling daily.",
          "High-intensity interval training (HIIT): 3 times a week.",
          "Strength training: Build muscle mass to burn more calories at rest.",
        ],
      };
    }
    return {};
  };

  return (
    <div>
      <div className="background-circle-orange"></div>
      <div className="background-circle-red"></div>
      <div className="bmi-calculator-container">
        <h1>BMI Calculator</h1>
        <div className="input-section">
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <button onClick={calculateBMI}>Calculate BMI</button>
        </div>

        {bmi && (
          <div className="result-section">
            <h2>Your BMI is: {bmi}</h2>
            <h3>{message}</h3>

            {planner && (
              <div className="planner-section">
                <h3>
                  Recommended{" "}
                  {message.includes("gain") ? "Weight Gain" : "Weight Loss"}{" "}
                  Plan:
                </h3>
                <div>
                  <h4>Diet Plan:</h4>
                  <ul>
                    {planner.diet.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Exercise Plan:</h4>
                  <ul>
                    {planner.exercise.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BmiCalculator;
