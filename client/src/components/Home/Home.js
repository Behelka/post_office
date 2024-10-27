import React from "react";
import "./Home.css";
import cougarlogo from "../../assets/cougarlogo.jpg"

function Home() {
    return(
      <div className="Home-container">
        <div className="Home-color-bar"/>
        <div className="Home-image-container">
          <img src={cougarlogo} alt="logo"/>
        </div>
      </div>
    );
  }

  export default Home;