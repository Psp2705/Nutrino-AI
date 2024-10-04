import React from "react";
import Background from "./Background/Background";
import Navbar from "./Navbar/Navbar"

const MainLayout = ({ heroCount, children }) => {
  return (
    <div>
      <Background heroCount={heroCount} />
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
