import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

import { auth, provider } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const Login = () => {
  const [newUser, setNewUser] = useState(true); // Changed to camelCase
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const submit = (e) => {
    e.preventDefault();
    setError(false);

    if (newUser) {
      // Create user
      createUserWithEmailAndPassword(auth, email, password)
        .then((userDetails) => {
          console.log(userDetails);
          localStorage.setItem("username", username);
          navigate("/personalinfopage"); // Redirect to personal info page after successful sign-up
        })
        .catch((error) => {
          setError(true);
          setErrorMsg(error.message);
        });
    } else {
      // Sign in user
      signInWithEmailAndPassword(auth, email, password)
        .then((userDetails) => {
          console.log(userDetails);
          // Redirect to personal info page or dashboard if needed
          navigate("/personalinfopage"); // Redirect after successful login
        })
        .catch((error) => {
          setError(true);
          setErrorMsg(error.message);
        });
    }
  };

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        console.log(data);
        localStorage.setItem("email", data.user.email);
        navigate("/personalinfopage"); // Redirect after Google Sign-In
      })
      .catch((error) => {
        setError(true);
        setErrorMsg(error.message);
      });
  };

  return (
    <div className="login-container">
      <div className="overlay-login"></div>
      <div className="login-page">
        <header>
          <span>
            from <i>APS</i>
          </span>
        </header>

        <form onSubmit={submit}>
          {newUser && (
            <div className="username">
              <input
                className="input-login"
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                required
              />
              <label htmlFor="username">Username</label>
            </div>
          )}

          <div className="email">
            <input
              className="input-login"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="password">
            <input
              className="input-login"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          {error && <span className="error">{errorMsg}</span>}

          <button type="submit">{newUser ? "Sign Up" : "Log In"}</button>

          <button type="button" onClick={handleClick}>
            Sign In With Google
          </button>

          {newUser ? (
            <span className="user-stat">
              Already have an account?{" "}
              <b
                onClick={() => {
                  setNewUser(false);
                  setError(false);
                }}
              >
                Log In
              </b>
            </span>
          ) : (
            <span className="user-stat">
              Don't have an account?{" "}
              <b
                onClick={() => {
                  setNewUser(true);
                  setError(false);
                }}
              >
                Sign Up
              </b>
            </span>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
