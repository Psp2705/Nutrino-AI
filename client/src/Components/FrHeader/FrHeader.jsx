import React, { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import "./FrHeader.css";
import Bars from "../../assets/bars.png";

const FrHeader = () => {
  const mobile = window.innerWidth <= 738;
  const [menuOpened, setMenuOpened] = useState(false);

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit'
  };

  return (
    <div className="header">
      <div className="header-title">
        <h1>NutriAI</h1>
      </div>
      {menuOpened === false && mobile === true ? (
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "gray",
            borderRadius: "5px",
          }}
          onClick={() => setMenuOpened(true)}
        >
          <img
            src={Bars}
            alt=""
            style={{
              width: "1.5rem",
              height: "1.5rem",
            }}
          />
        </div>
      ) : (
        <ul className="header-menu">
          <li>
            <ScrollLink
              activeClass="active"
              to="home"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => setMenuOpened(false)}
              style={linkStyle}
            >
              Home
            </ScrollLink>
          </li>
          <li>
            <ScrollLink
              activeClass="active"
              to="programs"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => setMenuOpened(false)}
              style={linkStyle}
            >
              Programs
            </ScrollLink>
          </li>
          <li>
            <RouterLink
              to="/about"
              onClick={() => setMenuOpened(false)}
              style={linkStyle}
            >
              About Us
            </RouterLink>
          </li>
          <li>
            <ScrollLink
              activeClass="active"
              to="plans"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => setMenuOpened(false)}
              style={linkStyle}
            >
              Plans
            </ScrollLink>
          </li>
        </ul>
      )}
    </div>
  );
};

export default FrHeader;
