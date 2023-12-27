// import React, { useState } from "react";
// import '../styles/style.css'
// import axios from 'axios';
// import { getServerSideProps } from "@/components/mainVariable";
// import '../styles/popup.css';
// import { useRouter } from 'next/router';
// import { message } from 'antd';

// const Login = ({ base_url }) => {
//   const [email, setEmail] = useState('');
//   const[forgotEmail,setforgotEmail]=useState('')
//   const [password, setPassword] = useState('');
//   const [isEmployee, setIsEmployee] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
//   const [forgotPasswordErrors, setForgotPasswordErrors] = useState({});

//   const router = useRouter();

//   const validateForm = () => {
//     const errors = {};

//     if (!email) {
//       errors.email = 'Please enter your email address';
//     }
//     // if (!forgotEmail) {
//     //   errors.forgotEmail = 'Please enter your email address';
//     // }

//     if (!password) {
//       errors.password = 'Please enter your password';
//     }

//     setErrors(errors);

//     return Object.keys(errors).length === 0;
//   };

//   const validateForgotPasswordForm = () => {
//     const errors = {};

//     if (!forgotEmail) {
//       errors.forgotEmail = 'Please enter your email address';
//     }

//     setForgotPasswordErrors(errors);

//     return Object.keys(errors).length === 0;
//   };


//   const handleForgotPassword = () => {

//     // Open the forgot password popup
//     setShowForgotPasswordPopup(true);
//   };

//   const handlePopupClose = () => {
//     // Close the forgot password popup
//     setShowForgotPasswordPopup(false);
//   };

//   const handleSendEmail = async () => {
//     axios.post(`${base_url}/api/accounts/forget-password`,
//       {
//         email: email,
//       }
//     )
//       .then((response) => {
//         console.log(response, 'yyyyyyyyyyyyyyyyyyyyy');
//       })
//       .catch((error) => {
//         console.log(error, 'jjjjjjjjjjjjjjjjjjjjj');
//       })
//     // Add logic to send the email using the entered email address
//     // You can use axios or any other method to send the email
//     if (validateForgotPasswordForm()) {
//       handlePopupClose();
//     } else {
//       console.log('Forgot Password form validation failed');
//     }
    
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();


//     if (validateForm()) {
//       const values = {
//         email: email,
//         password: password,
//         forgotEmail:forgotEmail,
//       }
//       // (`${Business_Url}/add-customer/`, addValues)

//       try {

//         const response = await axios.post(`${base_url}/api/accounts/login`, values
//         );
//         console.log(response, 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
//         // Assuming your API returns a success status
//         if (response.status === 200) {
//           localStorage.setItem('access_token', response.data.access_token)
//           localStorage.setItem('refresh_token', response.data.refresh_token)
//           router.push('/dashboard');
//           message.success('Login successful');
//           // Handle successful login
//           console.log('Login successful');
//         } else {
//           // Handle login failure
//           console.log('Login failed');
//         }
//       } catch (error) {
//         console.error('Error during login:', error);
//         // Handle error as needed
//       }
//     } else {
//       console.log('Form validation failed');
//     }
//   };

//   return (
//     <>
//       <section className="dashboard-wrap">
//         <div className="container">
//           <div className="login-board">
//             <div className="logowrap">
//               <img src="./images/logo.png" alt="" />
//               <h4 className="admin">Admin Login</h4>
//               <form action="#" onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-md-12">
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Email Address"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                     // type="email"
//                     // name=""
//                     // id=""
//                     // placeholder="Email Address"
//                     />
//                     {errors.email && <span className="error">{errors.email}</span>}
//                   </div>
//                 </div>
//                 <div className="col-md-12">
//                   <input
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   //  type="password" name="" id="" placeholder="Password" 
//                   />
//                   {errors.password && <span className="error">{errors.password}</span>}
//                 </div>
//                 <div className="col-md-12 chekbox-wrap">

//                   <label className="label-div mb-2">
//                     <span>Employee</span>
//                     <input
//                       type="checkbox"
//                       name="isEmployee"
//                       checked={isEmployee}
//                       onChange={(e) => setIsEmployee(e.target.checked)}
//                     // type="checkbox" name="" id="" placeholder="" 
//                     />
//                     <span class="checkmark"></span>
//                   </label>

//                   <div ><a href="javascript:void(0)"><span onClick={handleForgotPassword}>Forgot Password?</span></a></div>

//                   {showForgotPasswordPopup && (
//                     <div className="forgot-password-popup">
//                       <div className="popup-content">
//                         <span className="close-popup" onClick={handlePopupClose}>
//                           &times;
//                         </span>
//                         <h2>Forgot Password</h2>
//                         <input
//                           type="email"
//                           name="forgotEmail"
//                           placeholder="Enter your email"
//                           value={forgotEmail}
//                           onChange={(e) => setforgotEmail(e.target.value)}
//                         />
//                         {forgotPasswordErrors.forgotEmail && (
//     <span className="error">{forgotPasswordErrors.forgotEmail}</span>
//   )}
//                         <button onClick={handleSendEmail}>Send Email</button>
//                       </div>
//                     </div>
//                   )}

//                 </div>
//                 <div className="col-md-12">
//                   <button type="submit" className="submit-btn">Login</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }
// export { getServerSideProps };
// export default Login