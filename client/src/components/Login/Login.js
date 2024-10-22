// import {useState} from 'react';

// const Login = () => {
//     const [isLogIn, setLogin] = useState(true);
//     const [error, setError] = useState(null);

//     const viewLogin = (status) => {
//         setError(null);
//         setLogin(status);
//     };

//     return (
//         <div className="login-container">
//             <div className="login-container-box">
//                 <form>
//                     <h2>{isLogIn ? 'Please log in' : 'Please sign up!'}</h2>
//                     <input type="email" placeholder="email" />
//                     <input type="password" placeholder="password" />
//                     {!isLogIn && <input type="password" placeholder="confirm password" />}
//                     <input type="submit" className="create" />
//                     {error && <p>{error}</p>}
//                 </form>
//                 <div className="login-options">
//                     <button 
//                         onClick={() => viewLogin(false)} 
//                         style={{ backgroundColor: !isLogIn ? 'rgb(255,255,255)' : 'rgb(188,188,188)' }}
//                     >
//                         Sign up
//                     </button>
//                     <button 
//                         onClick={() => viewLogin(true)} 
//                         style={{ backgroundColor: isLogIn ? 'rgb(255,255,255)' : 'rgb(188,188,188)' }}
//                     >
//                         Login
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

// Part 2

// import { useState } from 'react';

// const Login = () => {
//     const [isLogIn, setLogin] = useState(true);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState(null);

//     const viewLogin = (status) => {
//         setError(null);  // Reset the error state when toggling
//         setLogin(status);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError(null);  // Clear error before validation
        
//         if (!email || !password) {
//             setError('Email and password are required');
//             return;
//         }

//         if (!isLogIn && password !== confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }

//         // Proceed with form submission (e.g., send data to the server)
//         if (isLogIn) {
//             console.log('Logging in with', { email, password });
//         } else {
//             console.log('Signing up with', { email, password, confirmPassword });
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-container-box">
//                 <form onSubmit={handleSubmit}>
//                     <h2>{isLogIn ? 'Please log in' : 'Please sign up!'}</h2>
//                     <input 
//                         type="email" 
//                         placeholder="email" 
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                     <input 
//                         type="password" 
//                         placeholder="password" 
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     {!isLogIn && (
//                         <input 
//                             type="password" 
//                             placeholder="confirm password" 
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                         />
//                     )}
//                     <input type="submit" className="create" value={isLogIn ? "Log In" : "Sign Up"} />
//                     {error && <p>{error}</p>}
//                 </form>
//                 <div className="login-options">
//                     <button 
//                         onClick={() => viewLogin(false)} 
//                         style={{ backgroundColor: !isLogIn ? 'rgb(255,255,255)' : 'rgb(188,188,188)' }}
//                     >
//                         Sign up
//                     </button>
//                     <button 
//                         onClick={() => viewLogin(true)} 
//                         style={{ backgroundColor: isLogIn ? 'rgb(255,255,255)' : 'rgb(188,188,188)' }}
//                     >
//                         Login
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

// import { useState } from 'react';
// // import './c/login.css'; // Import your CSS file

// const Login = () => {
//     const [isLogIn, setLogin] = useState(true);
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         phone: '',
//         email: '',
//         dob: '',
//         password: '',
//         confirmPassword: ''
//     });
//     const [error, setError] = useState(null);

//     const viewLogin = (status) => {
//         setError(null);
//         setLogin(status);
//     };

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setError(null);

//         const { firstName, lastName, phone, email, dob, password, confirmPassword } = formData;

//         if (!email || !password || (!isLogIn && (!firstName || !lastName || !phone || !dob || !confirmPassword))) {
//             setError('All fields are required');
//             return;
//         }

//         if (!isLogIn && password !== confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }

//         // Proceed with login or sign-up logic
//         if (isLogIn) {
//             console.log('Logging in with', { email, password });
//         } else {
//             console.log('Signing up with', { firstName, lastName, phone, dob, email, password });
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-container-box">
//                 <form onSubmit={handleSubmit}>
//                     <h2>{isLogIn ? 'Please Log In' : 'Create an Account'}</h2>

//                     {!isLogIn && (
//                         <>
//                             <input 
//                                 type="text" 
//                                 placeholder="First Name" 
//                                 name="firstName"
//                                 value={formData.firstName} 
//                                 onChange={handleChange} 
//                             />
//                             <input 
//                                 type="text" 
//                                 placeholder="Last Name" 
//                                 name="lastName"
//                                 value={formData.lastName} 
//                                 onChange={handleChange} 
//                             />
//                             <input 
//                                 type="tel" 
//                                 placeholder="Phone Number" 
//                                 name="phone"
//                                 value={formData.phone} 
//                                 onChange={handleChange} 
//                             />
//                             <input 
//                                 type="date" 
//                                 placeholder="Date of Birth" 
//                                 name="dob"
//                                 value={formData.dob} 
//                                 onChange={handleChange} 
//                             />
//                         </>
//                     )}
                    
//                     <input 
//                         type="email" 
//                         placeholder="Email" 
//                         name="email"
//                         value={formData.email} 
//                         onChange={handleChange} 
//                     />
//                     <input 
//                         type="password" 
//                         placeholder="Password" 
//                         name="password"
//                         value={formData.password} 
//                         onChange={handleChange} 
//                     />
//                     {!isLogIn && (
//                         <input 
//                             type="password" 
//                             placeholder="Confirm Password" 
//                             name="confirmPassword"
//                             value={formData.confirmPassword} 
//                             onChange={handleChange} 
//                         />
//                     )}

//                     <input type="submit" className="create" value={isLogIn ? "Log In" : "Sign Up"} />
//                     {error && <p className="error-message">{error}</p>}
//                 </form>

//                 <div className="login-options">
//                     <button 
//                         onClick={() => viewLogin(false)} 
//                         style={{ backgroundColor: !isLogIn ? '#3498db' : '#ecf0f1' }}
//                     >
//                         Sign Up
//                     </button>
//                     <button 
//                         onClick={() => viewLogin(true)} 
//                         style={{ backgroundColor: isLogIn ? '#3498db' : '#ecf0f1' }}
//                     >
//                         Log In
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;

// import React, { useState } from 'react';
// // import './components/Login/Login.css'; // Assuming the styles are in the login.css file

// const Login = () => {
//   const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     dob: '',
//     email: '',
//     phoneNumber: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   // Function to validate form
//   const validateForm = () => {
//     const newErrors = {};
//     const { firstName, lastName, dob, email, password, confirmPassword } = formData;

//     // Required field validation
//     if (!firstName) newErrors.firstName = 'First name is required';
//     if (!lastName) newErrors.lastName = 'Last name is required';
//     if (!dob) newErrors.dob = 'Date of birth is required';
//     if (!email) newErrors.email = 'Email is required';
//     if (!password) newErrors.password = 'Password is required';
//     if (password !== confirmPassword && !isLogin) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     // Date of Birth validation (age >= 13)
//     const today = new Date();
//     const dobDate = new Date(dob);
//     const age = today.getFullYear() - dobDate.getFullYear();
//     const ageCheck = today.getMonth() - dobDate.getMonth() || today.getDate() - dobDate.getDate();
//     if (age < 13 || (age === 13 && ageCheck < 0)) {
//       newErrors.dob = 'You must be at least 13 years old';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Returns true if no errors
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     if (isLogin) {
//       // Call API for login
//       console.log('Logging in with', formData);
//       // Add your login API logic here
//     } else {
//       // Call API for signup
//       console.log('Signing up with', formData);
//       // Add your signup API logic here
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-container-box">
//         <form onSubmit={handleSubmit}>
//           <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

//           {!isLogin && (
//             <>
//               {/* First Name */}
//               <label>
//                 First Name <span className="required">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//               />
//               {errors.firstName && <p className="error">{errors.firstName}</p>}

//               {/* Last Name */}
//               <label>
//                 Last Name <span className="required">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//               />
//               {errors.lastName && <p className="error">{errors.lastName}</p>}

//               {/* Date of Birth */}
//               <label>
//                 Date of Birth <span className="required">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//               />
//               {errors.dob && <p className="error">{errors.dob}</p>}

//               {/* Phone Number */}
//               <label>Phone Number (Optional)</label>
//               <input
//                 type="text"
//                 name="phoneNumber"
//                 placeholder="Phone Number"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//               />
//             </>
//           )}

//           {/* Email */}
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

//           {/* Password */}
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

//           {/* Confirm Password (for Sign Up) */}
//           {!isLogin && (
//             <>
//               <label>
//                 Confirm Password <span className="required">*</span>
//               </label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//               {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
//             </>
//           )}

//           <button type="submit" className="create">
//             {isLogin ? 'Login' : 'Sign Up'}
//           </button>
//         </form>

//         <div className="login-options">
//           <button
//             onClick={() => setIsLogin(false)}
//             style={{ backgroundColor: !isLogin ? '#FFF' : '#BBB' }}
//           >
//             Sign Up
//           </button>
//           <button
//             onClick={() => setIsLogin(true)}
//             style={{ backgroundColor: isLogin ? '#FFF' : '#BBB' }}
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'customer' // Default role
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, dob, email, password, confirmPassword } = formData;

    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!dob) newErrors.dob = 'Date of birth is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword && !isLogin) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const today = new Date();
    const dobDate = new Date(dob);
    const age = today.getFullYear() - dobDate.getFullYear();
    const ageCheck = today.getMonth() - dobDate.getMonth() || today.getDate() - dobDate.getDate();
    if (age < 13 || (age === 13 && ageCheck < 0)) {
      newErrors.dob = 'You must be at least 13 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const url = isLogin ? '/api/login' : '/api/signup';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (response.ok) {
      // Store the JWT token in localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.role); // Save the user's role
      console.log('Login successful');
    } else {
      setLoginError(result.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-container-box">
        <form onSubmit={handleSubmit}>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

          {!isLogin && (
            <>
              <label>
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}

              <label>
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}

              <label>
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              {errors.dob && <p className="error">{errors.dob}</p>}

              <label>Phone Number (Optional)</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />

              {/* Role Select */}
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}

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

          {!isLogin && (
            <>
              <label>
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </>
          )}

          <button type="submit" className="create">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          {/* Link to toggle between Login and Sign Up */}
          {isLogin ? (
            <p className="toggle-text">
              Don't have an account?{" "}
              <span className="toggle-link" onClick={() => setIsLogin(false)}>
                Sign up
              </span>
            </p>
          ) : (
            <p className="toggle-text">
              Already have an account?{" "}
              <span className="toggle-link" onClick={() => setIsLogin(true)}>
                Login
              </span>
            </p>
          )}

        </form>

        {loginError && <p className="error">{loginError}</p>}
      </div>
    </div>
  );
};

export default Login;



