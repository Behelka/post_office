import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <hr className="header-line" />
      </div>
      <div className="about-content">
        <p className="intro-paragraph">
          Welcome to the Post Office Service! We are dedicated to providing
          fast, reliable, and secure mailing and shipping services to meet your
          personal and business needs. Whether you're sending letters, packages,
          or important documents, our platform ensures timely deliveries and
          easy tracking of your items.
        </p>

        <p className="mission-paragraph">
          Our commitment to quality service stems from decades of experience in
          logistics and communication. We strive to bring cutting-edge
          technology and traditional postal values together, allowing customers
          to enjoy a seamless experience in all their postal interactions.
        </p>

        <p className="values-paragraph">
          At the Post Office Service, we value trust, efficiency, and customer
          satisfaction. With our broad network of local and international
          shipping partners, you can send parcels to any part of the world with
          confidence.
        </p>

        <h2>Why Choose Us?</h2>
        <ul className="features-list">
          <li>Secure and reliable delivery service</li>
          <li>
            User friendly tracking and management tools for all deliveries
          </li>
          <li>Dedicated Customer Support and fast resolution of issues</li>
          <li>Timely and efficient domestic shipping</li>
        </ul>

        <div className="thank-you-section">
          <p>Thank you for choosing Cougar</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
