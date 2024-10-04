import React, { useState } from 'react';
import axios from 'axios';
import './chatbot.css';  // Assuming you are using the same style file

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('http://127.0.0.1:5000/chatbot', {
        message: userInput,
      });

      const botMessage = { sender: "bot", text: response.data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error communicating with the chatbot API:", error);
    }

    setUserInput(""); // Clear the input field
  };

  return (
    
    <div className="chatbotPage">
    <div className="background-circle-orange"></div>
    <div className="background-circle-red"></div>
    <div className="chatbot">
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            {msg.sender === "user" ? "You: " : "Bot: "} {msg.text}
          </div>
        ))}
      </div>
      <div className="input-section">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;
