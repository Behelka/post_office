import React, { useState } from "react";
import "./Home.css";
import cougarlogo from "../../assets/cougarlogo.jpg";
import { useNavigate } from "react-router-dom";

// ServiceCard Component
const ServiceCard = ({ icon, title, description }) => (
  <div className="service-card">
    <div className="service-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    <button className="service-button">Get Started</button>
  </div>
);


// FeatureCard Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

function Home() {

  const [trackingID,setTrackingID]=useState("");
  const navigate=useNavigate();
  const handleButtonClick=()=>{
    if(trackingID){
      navigate(`/TrackingHistory?trackingId=${trackingID}`);
    } else {
      navigate("/TrackingHistory");
    }
  };
  
  const services = [
    {
      icon: "📦",
      title: "Send Package",
      description: "Ship packages domestically or internationally",
    },
    {
      icon: "🔍",
      title: "Track Shipment",
      description: "Track your package location in real-time",
    },
    {
      icon: "📍",
      title: "Find Location",
      description: "Locate nearest post office branches",
    },
  ];

  const features = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Express shipping options available for urgent deliveries",
    },
    {
      icon: "🌍",
      title: "Global Reach",
      description: "International shipping to over 200 countries",
    },
    {
      icon: "⏰",
      title: "24/7 Support",
      description: "Round-the-clock customer service support",
    },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <img src={cougarlogo} alt="Cougar Logo" className="hero-logo" />
          <h1>Welcome to Post Office Services</h1>
          <p>Your trusted partner for reliable shipping and postal services</p>
          <div className="hero-cta">
            <button className="primary-button" onClick={handleButtonClick}>Track Package</button>
            <button className="secondary-button">Ship Now</button>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section className="quick-services">
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Tracking Section */}
      <section className="tracking-section">
        <div className="tracking-container">
          <h2>Track Your Package</h2>
          <div className="tracking-form">
            <input 
              type="text" 
              placeholder="Enter your tracking number"
              className="tracking-input"
              aria-label="Tracking number input"
              onChange={(e)=>setTrackingID(e.target.value)}
              value={trackingID}
            />
            <button className="tracking-button" onClick={handleButtonClick}>Track</button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Ship?</h2>
          <p>Experience fast, reliable, and secure shipping services</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>
    </div>
  );
}

export default Home;
