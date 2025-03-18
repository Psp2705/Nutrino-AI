import React, { useState } from "react";
import { db } from "../../firebase"; // Ensure the correct path
import { collection, addDoc } from "firebase/firestore";
import "./PersonalinfoPage.css";
import img5 from "../../assets/img5.jpg";
import { useNavigate } from "react-router-dom";

const PersonalinfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    healthHistory: "",
    foodPreferences: "",
    allergies: "",
  });

  // Navigate to the main page after form submission
  const handleMainPageNavigation = () => {
    navigate("/user");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await addDoc(collection(db, "userHistory"), formData);
      alert("Data submitted successfully!");
      setFormData({
        name: "",
        email: "",
        age: "",
        healthHistory: "",
        foodPreferences: "",
        allergies: "",
      });
      handleMainPageNavigation(); // Navigate after successful submission
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="form-container">
      <form className="personal-info-form" onSubmit={handleSubmit}>
        {/* Form Left Side */}
        <div className="form-left">
          <h2>Personal Information</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <textarea
            name="healthHistory"
            placeholder="Health History"
            value={formData.healthHistory}
            onChange={handleChange}
            required
          ></textarea>
          <textarea
            name="foodPreferences"
            placeholder="Food Preferences"
            value={formData.foodPreferences}
            onChange={handleChange}
            required
          ></textarea>
          <textarea
            name="allergies"
            placeholder="Allergies"
            value={formData.allergies}
            onChange={handleChange}
            required
          ></textarea>
          
          {/* Submit Button */}
          <button type="submit">
            Submit
          </button>
        </div>

        {/* Form Right Side */}
        <div className="form-right">
          <img src={img5} alt="Decorative" />
        </div>
      </form>
    </div>
  );
};

export default PersonalinfoPage;
