// Plans.jsx
import React from "react";
import "./Plans.css";
import { plansData } from "../../data/plansData";
import whiteTick from "../../assets/whiteTick.png";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "../../firebase"; 
import { db } from "../../firebase"; // Import Firestore

// Function to call the Cloud Function and join a plan
const joinPlan = async (planId, price) => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to join a plan.");
    return;
  }

  // Function to process PayPal payment
  const handlePayPalPayment = async () => {
    const response = await fetch(
      "http://localhost:5000/create-paypal-transaction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: price }), // Amount to be paid
      }
    );
    const data = await response.json();
    return data;
  };

  try {
    const payment = await handlePayPalPayment();
    if (payment.id) {
      // Redirect to PayPal for approval
      window.location.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${payment.id}`;

      // After successful payment, save payment history
      await savePaymentHistory(user.uid, planId, price);
    } else {
      alert("Payment initialization failed.");
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    alert("Payment failed. Please try again.");
  }
};

// Function to save payment history in Firestore
const savePaymentHistory = async (userId, planId, amount) => {
  const paymentRef = db.collection("paymentHistory");
  await paymentRef.add({
    userId,
    planId,
    amount,
    timestamp: new Date(),
  });
};

const Plans = () => {
  return (
    <div className="plans-container" id="plans">
      <div className="plans-1"></div>
      <div className="plans-2"></div>
      <div className="programs-header" style={{ gap: "2rem" }}>
        <span className="stroke-text" style={{ marginTop: "-3.5rem" }}>
          READY TO START
        </span>
        <span style={{ marginTop: "-3.5rem" }}>YOUR JOURNEY</span>
        <span className="stroke-text" style={{ marginTop: "-3.5rem" }}>
          NOW WITH US
        </span>
      </div>

      <div className="plans">
        {plansData.map((plan, i) => (
          <div className="plan" key={i}>
            {plan.icon}
            <span>{plan.name}</span>
            <span>Rs.{plan.price}</span>
            <div className="features">
              {plan.features.map((feature, j) => (
                <div className="feature" key={j}>
                  <img src={whiteTick} alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div>
              <span>See more benefits</span>
            </div>
            <button
              className="btn"
              style={{ backgroundColor: "white" }}
              onClick={() => joinPlan(plan.id, plan.price)} 
            >
              Join now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
