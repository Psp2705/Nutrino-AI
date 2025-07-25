import { useState } from "react";
import { db } from "../../firebase"; 
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

  const handleMainPageNavigation = () => {
    navigate("/user");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      await addDoc(collection(db, "userHistory"), formData);

      // Save user data to local storage
      localStorage.setItem("userPreferences", JSON.stringify(formData));
      
      alert("Data submitted successfully!");
      setFormData({
        name: "",
        email: "",
        age: "",
        healthHistory: "",
        foodPreferences: "",
        allergies: "",
      });
      handleMainPageNavigation();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="form-container">
      <form className="personal-info-form" onSubmit={handleSubmit}>
        <div className="form-left">
          <h2>Personal Information</h2>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
          <textarea name="healthHistory" placeholder="Health History" value={formData.healthHistory} onChange={handleChange} required></textarea>
          <textarea name="foodPreferences" placeholder="Food Preferences" value={formData.foodPreferences} onChange={handleChange} required></textarea>
          <textarea name="allergies" placeholder="Allergies" value={formData.allergies} onChange={handleChange} required></textarea>
          <button type="submit">Submit</button>
        </div>
        <div className="form-right">
          <img src={img5} alt="Decorative" />
        </div>
      </form>
    </div>
  );
};

export default PersonalinfoPage;
