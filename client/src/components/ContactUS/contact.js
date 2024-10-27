// import React from 'react'
// import './contact.css'

// const contact=()=>{
//     const [email,setEmail]=useState('')
//     const [question,setQuestion]=useState('')
//     const [submitted,setSubmitted]=useState('')
// }
// const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitted(true);

//     setEmail("");
//     setQuestion("");

//     console.log({ email, question });
//   };
  
// return(
//     <div className='contact-container'>
//         <h1 className='contact-heading'> Get in Touch</h1>

//         <div className="contact-boxes">
//         {/* Talk to Sales Box */}
//         <div className="contact-box sales-box">
//           <h2>Talk to Sales</h2>
//           <p>
//             Interested to know more about our packaging services? Pick up your
//             phone and contact us on:
//           </p>
//           <p className="phone-number">+1 (234) 567-8901</p>
//         </div>

//     </div>


// {/* Contact Customer Support Box */}

// <div className="contact-box support-box">
// <h2>Contact Customer Support</h2>
// <p>
//   Sometimes our rep can be busy assisting other customers, but you
//   need not worry, we are still with you.
// </p>
// <form onSubmit={handleSubmit} className="support-form">
//   <div className="input-group">
//     <label>Email</label>
//     <input
//       type="email"
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       required
//     />
//   </div>
//   <div className="input-group">
//     <label>Question</label>
//     <textarea
//       value={question}
//       onChange={(e) => setQuestion(e.target.value)}
//       rows="4"
//       required
//     ></textarea>
//   </div>
//   <button type="submit" className="submit-button">
//     Submit
//   </button>
// </form>

// {/* Confirmation message */}
// {submitted && (
//   <div className="confirmation-message">
//     Your message has been received and we shall get back to you in 24
//     to 48 hours.
//   </div>
// )}
// </div>
// </div>

// </div>

// );
// };

// export default Contact;

import React, { useState } from "react";
import "./contact.css";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Clear form inputs after submission
    setEmail("");
    setQuestion("");

    // Simulate saving to database (you would add a real API/database call here)
    console.log({ email, question });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-heading">Get in Touch</h1>

      <div className="contact-boxes">
        {/* Talk to Sales Box */}
        <div className="contact-box sales-box">
          <h2>Talk to Sales</h2>
          <p>
            Interested to know more about our packaging services? Pick up your
            phone and contact us on:
          </p>
          <p className="phone-number">+1 (234) 567-8901</p>
        </div>

        {/* Contact Customer Support Box */}
        <div className="contact-box support-box">
          <h2>Contact Customer Support</h2>
          <p>
            Sometimes our rep can be busy assisting other customers, but you
            need not worry, we are still with you.
          </p>
          <form onSubmit={handleSubmit} className="support-form">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>

          {/* Confirmation message */}
          {submitted && (
            <div className="confirmation-message">
              Your message has been received and we shall get back to you in 24
              to 48 hours.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;


