
# 🥗 Nutrino AI – A Hybrid Nutrition Recommendation System

**Nutrino AI** is a smart, AI-powered nutrition recommendation system that offers personalized meal plans and fitness advice using a hybrid of content-based and collaborative filtering approaches. It also features a BMI calculator, chatbot, and integrated APIs to provide tailored suggestions for users based on their dietary habits, health conditions, and lifestyle preferences.

---

## 📌 Features

-  **Hybrid Recommendation Engine**  
  Combines content-based and user-based filtering for precise and personalized suggestions.

-  **AI Chatbot**  
  Provides real-time responses to nutrition-related queries using AI.

-  **BMI Calculator**  
  Calculates and categorizes BMI (Underweight, Normal, Overweight, Obese) and offers personalized advice accordingly.

-  **Diet & Recipe Suggestions**  
  Recommends meals based on allergies, preferences, and health goals using Edamam API.

-  **Fitness Programs**  
  Offers video-based fitness guidance (Strength & Cardio) using YouTube API.

-  **Nutritional Analytics**  
  Breaks down recommended meals by calories, macronutrients, and micronutrients.

---

## 🏗️ Tech Stack

| Component       | Technology                |
|----------------|---------------------------|
| **Frontend**    | React.js, Bootstrap, Material UI |
| **Backend**     | Node.js, Express.js       |
| **AI/ML**       | Python, TensorFlow / PyTorch |
| **Database**    | Firebase (Authentication, Storage) |
| **APIs Used**   | Edamam API, YouTube API, OpenAI API |
| **Dev Tools**   | VS Code, GitHub, Postman  |
| **Others**      | BMI logic, Custom JSON for chatbot |

---

## 📂 Folder Structure

```
.
├── client/               # React frontend (UI)
├── server/               # Node.js backend
├── Models/               # ML Models (if applicable)
├── nutri-ai-server/      # Python-based recommendation logic
├── src/                  # Source files / shared utils
├── node_modules/         # Node dependencies
├── .env                  # Environment variables
├── requirements.txt      # Python dependencies
├── package.json          # Node.js dependencies
├── README.md             # Project overview
```

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nutrino-ai.git
cd nutrino-ai
```

### 2. Setup Backend

```bash
cd server
npm install
npm run start
```

### 3. Setup Frontend

```bash
cd client
npm install
npm start
```

### 4. Setup Python ML Recommendation Server (optional)

```bash
cd nutri-ai-server
pip install -r requirements.txt
python app.py
```

---

## 🔐 Create a `.env` File

Inside the `client/` directory, create a `.env` file and add the following keys:

```env
REACT_APP_EDAMAM_API_KEY=your_edamam_api_key
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
OPENAI_API_KEY=your_openai_api_key
```

> ⚠️ Keep your API keys secure and do not share them publicly.

---

## 🌱 Future Enhancements

-  Mobile App Version using React Native
-  AI-Powered Meal Generator with GPT-based customization
-  Goal-Based Recommendation Engine (weight loss, muscle gain, etc.)
-  Multilingual Chatbot Support
-  Daily/Weekly Diet Planner with email reminders
-  PDF Export & Print Option for meal plans
-  Advanced Analytics Dashboard
-  OAuth + Google Login Integration
-  Real-Time Calorie Tracking with fitness tracker integrations

---

## 🧪 Experimental Setup

- **Hardware**: 8GB+ RAM, SSD, Intel i5/Ryzen 5
- **Software**: Node.js, React.js, Python 3.x, Firebase
- **Deployment**: Render (backend), Vercel (frontend)

---

## 👨‍💻 Authors
   
- Prachiti Parab  
- Aafreen Khan
- Sneha Gupta   
- Tulsi Dubey 
