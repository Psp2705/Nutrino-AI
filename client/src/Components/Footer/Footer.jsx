import React from "react";
import "./Footer.css";
import Github from "../../assets/github.png";
import Instagram from "../../assets/instagram.png";
import LinkedIn from "../../assets/linkedin.png";

const Footer = () => {
  return (
    <div className="Footer-container">
      <div className="foot-blur-1"></div>
      <div className="foot-blur-2"></div>
      <hr />
      <div className="footer">
        <div className="social-links">
          <img src={Github} alt="" />
          <img src={Instagram} alt="" />
          <img src={LinkedIn} alt="" />
        </div>
      </div>

      {/* <div className='blur-f-1'></div>
      <div className='blur-f-2'></div> */}
    </div>
  );
};

export default Footer;
