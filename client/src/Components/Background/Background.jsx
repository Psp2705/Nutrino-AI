import React from "react";
import "./Background.css";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpg";

const Background = ({ heroCount }) => {
  let imgSrc;

  if (heroCount === 0) {
    imgSrc = img2;
  } else if (heroCount === 1) {
    imgSrc = img3;
  } else if (heroCount === 2) {
    imgSrc = img4;
  }

  return (
    <>
      <img src={imgSrc} className="background" alt="" />
      <div className="overlay"></div>
    </>
  );
};

export default Background;
