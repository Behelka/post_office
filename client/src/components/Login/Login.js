// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Login.css";

// import { SERVER_URL } from "../../App";

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loginError, setLoginError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const { email, password } = formData;

//     if (!email) newErrors.email = "Email is required";
//     if (!password) newErrors.password = "Password is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const response = await fetch(`${SERVER_URL}/api/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     const result = await response.json();

//     if (response.ok) {
//       if(result["Customer_Email_Address"]) {
//         localStorage.setItem("Customer_ID", result.Customer_ID);
//         localStorage.setItem(
//           "Customer_Email_Address",
//           result.Customer_Email_Address
//         );
//         navigate("/CustomerProfile");
//       } else if( result["Email"]) {
//         localStorage.setItem("Employee_ID", result.Employee_ID);
//         localStorage.setItem("Employee_Email", result.Email);
//         navigate("/EmployeeProfile");
//       }
//     } else {
//       setLoginError(result.message || "Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-container-box">
//         <form onSubmit={handleSubmit}>
//           <h2>Login</h2>
//           <label>
//             Email <span className="required">*</span>
//           </label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//           {errors.email && <p className="error">{errors.email}</p>}

//           <label>
//             Password <span className="required">*</span>
//           </label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//           />
//           {errors.password && <p className="error">{errors.password}</p>}

//           <button type="submit" className="create">
//             Login
//           </button>

//           <p className="toggle-text">
//             Don't have an account? <Link to="/signup">Sign up here</Link>
//           </p>
//         </form>

//         {loginError && <p className="error">{loginError}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import { SERVER_URL } from "../../App";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response = await fetch(`${SERVER_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      if (result["Customer_Email_Address"]) {
        localStorage.setItem("Customer_ID", result.Customer_ID);
        localStorage.setItem(
          "Customer_Email_Address",
          result.Customer_Email_Address
        );
        navigate("/CustomerProfile");
      } else if (result["Role"] === "manager" && result["Department_ID"]) {
        localStorage.setItem("Employee_ID", result.Employee_ID);
        localStorage.setItem("Employee_Email", result.Email);
        localStorage.setItem("Manager_Department_ID", result.Employee_Department_ID);
        navigate("/ManagerPortal");
      } else if (result["Email"]) {
        localStorage.setItem("Employee_ID", result.Employee_ID);
        localStorage.setItem("Employee_Email", result.Email);
        navigate("/EmployeeProfile");
      }
    } else {
      setLoginError(result.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-container-box">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label>
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label>
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit" className="create">
            Login
          </button>

          <p className="toggle-text">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </form>

        {loginError && <p className="error">{loginError}</p>}
      </div>
    </div>
  );
};

export default Login;