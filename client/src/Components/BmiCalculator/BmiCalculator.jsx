import { useState, useEffect } from "react";
import "./BMICalculator.css";

const BmiCalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState("");
  const [planner, setPlanner] = useState(null);

  // Load stored BMI data on component mount
  useEffect(() => {
    const storedBmiData = localStorage.getItem("bmiData");
    if (storedBmiData) {
      const parsedData = JSON.parse(storedBmiData);
      setBmi(parsedData.bmi);
      setMessage(parsedData.message);
      setPlanner(parsedData.planner);
      setWeight(parsedData.weight);
      setHeight(parsedData.height);
      setAge(parsedData.age);
    }
  }, []);

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
    let messageText = "";
    
    if (bmiValue < 18.5) {
      messageText = `You are underweight. Aim to gain ${getWeightAdjustment(
        bmiValue,
        "gain"
      )} kg.`;
      setMessage(messageText);
      plannerDetails = generatePlanner("gain");
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      messageText = "You are within the normal range.";
      setMessage(messageText);
      setPlanner(null); // No planner needed for normal range
      return; // Exit early as no planner is needed
    } else if (bmiValue >= 25) {
      messageText = `You are overweight. Aim to lose ${getWeightAdjustment(
        bmiValue,
        "lose"
      )} kg.`;
      setMessage(messageText);
      plannerDetails = generatePlanner("lose");
    }
    
    setPlanner(plannerDetails);
    
    // Store BMI data in local storage
    const bmiData = {
      bmi: bmiValue,
      message: messageText,
      planner: plannerDetails,
      weight,
      height,
      age,
      calculatedAt: new Date().toISOString()
    };
    
    localStorage.setItem("bmiData", JSON.stringify(bmiData));
  };

  const getWeightAdjustment = () => {
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
        recipes: [
          "Protein-rich smoothie: 1 banana, 2 tbsp peanut butter, 1 cup milk, 1 scoop protein powder",
          "Avocado toast: 2 slices whole grain bread, 1 avocado, 2 eggs, salt and pepper",
          "Greek yogurt parfait: 1 cup Greek yogurt, 1/4 cup granola, mixed berries, honey"
        ]
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
        recipes: [
          "Veggie stir-fry: Mixed vegetables, tofu, ginger, garlic, low-sodium soy sauce",
          "Grilled chicken salad: Leafy greens, grilled chicken breast, tomatoes, cucumber, light vinaigrette",
          "Baked salmon with steamed vegetables: Salmon fillet, broccoli, carrots, lemon juice, herbs"
        ]
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
                {planner.recipes && (
                  <div>
                    <h4>Recommended Recipes:</h4>
                    <ul>
                      {planner.recipes.map((recipe, index) => (
                        <li key={index}>{recipe}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BmiCalculator;