import React from "react";
import "./Home.css";
import cougarlogo from "../../assets/cougarlogo.jpg"

function Home() {
    return(
      <div className="container">
        <div className="color-bar"/>
        <div className="image-container">
          <img src={cougarlogo} alt="logo"/>
        </div>
      </div>
    );
  }

  export default Home;