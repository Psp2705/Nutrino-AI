import React from 'react';
import './User.css';

const User = () => {
  return (
    <div className="portfolio-container">
      <nav className="navbar">
        <button>Home</button>
        <button>Work</button>
        <button>About</button>
      </nav>

      <div className="main-content">
        <div className="card intro-card">
          <h1>Hi, this is Alisa</h1>
          <p>A visual designer from Boston, with a focus on interaction design. I'm interested in coding, product design, as well as music.</p>
        </div>
        
        <div className="card-grid">
          {/* <div className="card"> */}
            {/* <div className='card availcard'>
                <h2>Available for work</h2>
                <p>Reach me directly, let's talk!</p>
                <button>CONNECT</button>
            </div> */}
          {/* </div> */}
          <div className="card image-card">
            <div className="image-placeholder"></div>
          </div>
          <div className="card skills-card">
            <h2>Design skills</h2>
            <div className="skills">
              Dora / HTML & CSS / Figma / Prototyping / Wireframing / p5.js / Adobe XD / InDesign
            </div>
          </div>
        </div>

        <div className="card-grid">
          <div className="card work-card">
            <div className="icon-placeholder"></div>
            <h2>My works</h2>
            <p>EXPLORE</p>
          </div>
          <div className="card about-card">
            <div className="icon-placeholder"></div>
            <h2>About me</h2>
            <p>EXPLORE</p>
          </div>
        </div>
      </div>

      <div className="social-icons">
        <button>Behance</button>
        <button>LinkedIn</button>
        <button>Instagram</button>
        <button>Facebook</button>
      </div>

      <div className="get-template-button">
        <button>Get Template</button>
      </div>
    </div>
  );
};

export default User;
