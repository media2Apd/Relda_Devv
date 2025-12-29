// import React, { useState } from 'react';
// import ReactPhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import loginIcons from '../assest/signin.gif';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { Link, useNavigate } from 'react-router-dom';
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [data, setData] = useState({
//     email: "",
//     password: "",
//     name: "",
//     confirmPassword: "",
//     mobile: "",
//   });

//   const [errors, setErrors] = useState({});
  
//   const navigate = useNavigate();

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//     const handleSubmit = async(e) =>{
//       e.preventDefault()

//       try{

//       // if(data.password === data.confirmPassword){

//         const dataResponse = await fetch(SummaryApi.signUP.url,{
//             method : SummaryApi.signUP.method,
//             headers : {
//                 "content-type" : "application/json"
//             },
//             body : JSON.stringify(data)
//           })
    
//           const result = await dataResponse.json()

//       //     if(dataApi.success){
//       //       toast.success(dataApi.message)
//       //       navigate("/login")
//       //     }

//       //     if(dataApi.error){
//       //       toast.error(dataApi.message)
//       //     }
    
//       // }else{
//       //   toast.error("Please check password and confirm password")
//       // }

//             if (result.success) {
//               toast.success(result.message);
//               navigate('/login');
//             } else {
//               if (result.details) {
//                 const fieldErrors = {};
//                 result.details.forEach((detail) => {
//                   fieldErrors[detail.field] = detail.message;
//                 });
//                 setErrors(fieldErrors);
//               } else {
//                 toast.error(result.message);
//               }
//             }
//           } catch (error) {
//             toast.error('Something went wrong!');
//           }
//         }
 

//   return (
//     <section id='signup'>
//       <div className='mx-auto container p-4'>
//         <div className='bg-white p-5 w-full max-w-sm mx-auto'>
//           <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
//             <img src={data.profilePic || loginIcons} alt='login icons' />
//           </div>

//           <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
//             <div className='grid'>
//               <label className='block text-sm font-medium mb-1'>Name:</label>
//               <div className='bg-slate-100 border rounded p-2 focus-within:border-red-600'>
//                 <input
//                   type='text'
//                   placeholder='Enter your name'
//                   name='name'
//                   value={data.name}
//                   onChange={handleOnChange}
//                   className='w-full h-full outline-none bg-transparent'
//                   autoComplete='username'
//                 />
//               </div>
//               {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

//             </div>
//             <div className='grid'>
//               <label className='block text-sm font-medium mb-1'>Email:</label>
//               <div className='bg-slate-100 border rounded p-2 focus-within:border-red-600'>
//                 <input
//                   type='email'
//                   placeholder='Enter email'
//                   name='email'
//                   value={data.email}
//                   onChange={handleOnChange}
//                   className='w-full h-full outline-none bg-transparent'
//                 />

//               </div>
//               {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

//             </div>
//             <div>
//             <label className="block text-sm font-medium mb-1">Mobile:</label>

//             <div className="flex items-center border rounded px-3 py-2 bg-slate-100 focus-within:border-red-600">
//                 <ReactPhoneInput
//                     country="in"
//                     value={data.mobile}
//                     onChange={(phone) => handleOnChange({ target: { name: 'mobile', value: phone } })}
//                     inputClass="flex-1 outline-none bg-transparent border-none"
//                     buttonClass="bg-transparent border-none"
//                     containerClass="flex w-full items-center"
//                     dropdownClass="bg-white"
//                 />

//             </div>
//             {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}

//             </div>

//             <div>
//               <label className='block text-sm font-medium mb-1'>Password:</label>
//               <div className='bg-slate-100 border rounded p-2 flex focus-within:border-red-600'>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder='Enter password'
//                   value={data.password}
//                   name='password'
//                   onChange={handleOnChange}
//                   className='w-full h-full outline-none bg-transparent'
//                   autoComplete='password'
//                 />
//                 <div
//                   className='cursor-pointer text-xl'
//                   onClick={() => setShowPassword((prev) => !prev)}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </div>
//               </div>
//               {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

//             </div>

//             <div>
//               <label className='block text-sm font-medium mb-1'>Confirm Password:</label>
//               <div className='bg-slate-100 border rounded p-2 flex focus-within:border-red-600'>
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder='Enter confirm password'
//                   value={data.confirmPassword}
//                   name='confirmPassword'
//                   onChange={handleOnChange}
//                   className='w-full h-full outline-none bg-transparent'
//                   autoComplete='confirm-password'
//                 />
//                 <div
//                   className='cursor-pointer text-xl'
//                   onClick={() => setShowConfirmPassword((prev) => !prev)}
//                 >
//                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                 </div>
//               </div>
//               {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}

//             </div>

//             <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>
//               Sign Up
//             </button>
//           </form>

//           <p className='my-5'>
//             Already have an account?{" "}
//             <Link to={"/login"} className='text-red-600 hover:text-red-700 hover:underline'>
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SignUp;


// import React, { useState } from 'react';
// import ReactPhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { Link, useNavigate } from 'react-router-dom';
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [data, setData] = useState({
//     email: "",
//     password: "",
//     name: "",
//     confirmPassword: "",
//     mobile: "",
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({}); // Clear errors before submission

//     try {
//       const dataResponse = await fetch(SummaryApi.signUP.url, {
//         method: SummaryApi.signUP.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify(data)
//       });

//       const result = await dataResponse.json();

//       if (result.success) {
//         toast.success(result.message);
//         navigate('/login');
//       } else {
//         if (result.details) {
//           const fieldErrors = {};
//           result.details.forEach((detail) => {
//             fieldErrors[detail.field] = detail.message;
//           });
//           setErrors(fieldErrors);
//         } else {
//           toast.error(result.message);
//         }
//       }
//     } catch (error) {
//       toast.error('Something went wrong!');
//     }
//   };

//   return (
//     <section className="min-h-screen -mt-24 bg-gray-100 flex items-center justify-center p-4 py-32">
//       <div className="bg-white p-8 md:p-12 w-full max-w-[500px] rounded-2xl shadow-xl">
        
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
//           <p className="text-gray-500 text-sm">Join Relda today by filling in your details.</p>
//         </div>

//         <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
//           {/* Name Field */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Full Name</label>
//             <input
//               type="text"
//               placeholder="Enter your name"
//               name="name"
//               value={data.name}
//               onChange={handleOnChange}
//               className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all placeholder:text-gray-300`}
//               autoComplete="name"
//             />
//             {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
//           </div>

//           {/* Email Field */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Email Address</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               name="email"
//               value={data.email}
//               onChange={handleOnChange}
//               className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all placeholder:text-gray-300`}
//             />
//             {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
//           </div>

//           {/* Mobile Field */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Mobile Number</label>
//             <div className="phone-input-container">
//                 <ReactPhoneInput
//                     country="in"
//                     value={data.mobile}
//                     onChange={(phone) => handleOnChange({ target: { name: 'mobile', value: phone } })}
//                     containerClass="!w-full"
//                     inputClass={`!w-full !h-[50px] !border ${errors.mobile ? '!border-red-500' : '!border-gray-200'} !rounded-lg !text-base focus:!border-red-500`}
//                     buttonClass="!border-gray-200 !rounded-l-lg !bg-white"
//                 />
//             </div>
//             {errors.mobile && <p className="text-red-500 text-xs mt-1 font-medium">{errors.mobile}</p>}
//           </div>

//           {/* Password Field */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Password</label>
//             <div className={`relative border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg flex items-center focus-within:border-red-500 transition-all`}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Create a password"
//                 value={data.password}
//                 name="password"
//                 onChange={handleOnChange}
//                 className="w-full px-4 py-3 bg-transparent outline-none placeholder:text-gray-300"
//                 autoComplete="new-password"
//               />
//               <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>
//             {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
//           </div>

//           {/* Confirm Password Field */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Confirm Password</label>
//             <div className={`relative border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg flex items-center focus-within:border-red-500 transition-all`}>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm your password"
//                 value={data.confirmPassword}
//                 name="confirmPassword"
//                 onChange={handleOnChange}
//                 className="w-full px-4 py-3 bg-transparent outline-none placeholder:text-gray-300"
//                 autoComplete="new-password"
//               />
//               <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>
//             {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
//           </div>

//           <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4 transition-all active:scale-95 shadow-lg shadow-red-200">
//             Sign Up
//           </button>

//           <div className="text-center mt-2">
//             <p className="text-sm text-gray-600">
//               Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Login</Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default SignUp;

// import React, { useState } from 'react';
// import ReactPhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { Link, useNavigate } from 'react-router-dom';
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [data, setData] = useState({
//     email: "",
//     password: "",
//     name: "",
//     confirmPassword: "",
//     mobile: "",
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validate = () => {
//     let tempErrors = {};
//     if (!data.name) tempErrors.name = "Full Name is required";
//     if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) tempErrors.email = "Valid Email is required";
//     if (!data.mobile || data.mobile.length < 10) tempErrors.mobile = "Valid Mobile number is required";
//     if (data.password.length < 8) tempErrors.password = "Password must be at least 8 characters";
//     if (data.password !== data.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
//     if (!agreeTerms) tempErrors.terms = "You must agree to the Terms & Conditions";
    
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const dataResponse = await fetch(SummaryApi.signUP.url, {
//         method: SummaryApi.signUP.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify(data)
//       });
//       const result = await dataResponse.json();

//       if (result.success) {
//         toast.success(result.message);
//         navigate('/login');
//       } else {
//         toast.error(result.message);
//       }
//     } catch (error) {
//       toast.error('Something went wrong!');
//     }
//   };

//   return (
//     <section className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-20">
//       <div className="bg-white p-8 md:p-12 w-full max-w-[500px] rounded-2xl shadow-xl">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Relda</h1>
//           <p className="text-gray-500 text-sm">Please sign up in using the form below.</p>
//         </div>

//         <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
//           {/* Name */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Full Name</label>
//             <input
//               type="text" placeholder="Enter your name" name="name"
//               value={data.name} onChange={handleOnChange}
//               className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#E60000]"
//             />
//             {errors.name && <p className="text-[#008000] text-xs font-bold">{errors.name}</p>}
//           </div>

//           {/* Email */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Email</label>
//             <input
//               type="email" placeholder="pixelshipon@gmail.com" name="email"
//               value={data.email} onChange={handleOnChange}
//               className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#E60000]"
//             />
//             {errors.email && <p className="text-[#008000] text-xs font-bold">{errors.email}</p>}
//           </div>

//           {/* Mobile */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Mobile Number</label>
//             <ReactPhoneInput
//               country="in" value={data.mobile}
//               onChange={(phone) => setData(p => ({...p, mobile: phone}))}
//               inputClass="!w-full !h-[50px] !border-gray-200 !rounded-lg"
//             />
//             {errors.mobile && <p className="text-[#008000] text-xs font-bold">{errors.mobile}</p>}
//           </div>

//           {/* Password */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Password</label>
//             <div className="relative border border-gray-200 rounded-lg flex items-center focus-within:border-[#E60000]">
//               <input
//                 type={showPassword ? "text" : "password"} placeholder="**********"
//                 value={data.password} name="password" onChange={handleOnChange}
//                 className="w-full px-4 py-3 bg-transparent outline-none"
//               />
//               <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>
//             {/* Green instruction text as per image */}
//             <p className="text-[#008000] text-xs font-bold mt-1">Password Minimum of 8 characters</p>
//             {errors.password && <p className="text-[#008000] text-xs font-bold">{errors.password}</p>}
//           </div>

//           {/* Confirm Password */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Confirm Password</label>
//             <div className="relative border border-gray-200 rounded-lg flex items-center focus-within:border-[#E60000]">
//               <input
//                 type={showConfirmPassword ? "text" : "password"} placeholder="Enter your password"
//                 value={data.confirmPassword} name="confirmPassword" onChange={handleOnChange}
//                 className="w-full px-4 py-3 bg-transparent outline-none"
//               />
//               <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>
//             {errors.confirmPassword && <p className="text-[#008000] text-xs font-bold">{errors.confirmPassword}</p>}
//           </div>

//           {/* T&C Checkbox */}
//           <div className="flex flex-col gap-1">
//             <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
//                 <input 
//                     type="checkbox" 
//                     checked={agreeTerms} 
//                     onChange={() => {}} // Controlled via parent div click for better UX
//                     className="accent-[#E60000] w-4 h-4 cursor-pointer"
//                 />
//                 <span className="text-xs font-bold text-gray-700">
//                     Agree with <Link to="/terms" className="text-[#E60000] underline">Terms & Condition</Link>
//                 </span>
//             </div>
//             {errors.terms && <p className="text-[#008000] text-xs font-bold">{errors.terms}</p>}
//           </div>

//           <button className="bg-[#E60000] hover:bg-[#CC0000] text-white font-bold py-3 rounded-lg mt-4 transition-all">
//             Signup
//           </button>

//           <div className="text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account? <Link to="/login" className="text-[#E60000] font-bold hover:underline">Login</Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default SignUp;

// import React, { useState } from 'react';
// import ReactPhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { Link, useNavigate } from 'react-router-dom';
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';

// const SignUp = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [data, setData] = useState({
//     email: "",
//     password: "",
//     name: "",
//     confirmPassword: "",
//     mobile: "",
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validate = () => {
//     let tempErrors = {};
//     if (!data.name) tempErrors.name = "Name is required";
//     if (!data.email) {
//         tempErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(data.email)) {
//         tempErrors.email = "Email is invalid";
//     }
//     if (!data.mobile) tempErrors.mobile = "Mobile number is required";
//     if (data.password.length < 8) tempErrors.password = "Minimum 8 characters required";
//     if (data.password !== data.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
//     if (!agreeTerms) tempErrors.terms = "You must agree to the Terms & Conditions";

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validate()) {
//         if (!agreeTerms) toast.error("Please agree to the Terms & Conditions");
//         return;
//     }

//     try {
//       const dataResponse = await fetch(SummaryApi.signUP.url, {
//         method: SummaryApi.signUP.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify(data)
//       });

//       const result = await dataResponse.json();

//       if (result.success) {
//         toast.success(result.message);
//         navigate('/login');
//       } else {
//         if (result.details) {
//           const fieldErrors = {};
//           result.details.forEach((detail) => {
//             fieldErrors[detail.field] = detail.message;
//           });
//           setErrors(fieldErrors);
//         } else {
//           toast.error(result.message);
//         }
//       }
//     } catch (error) {
//       toast.error('Something went wrong!');
//     }
//   };

//   return (
//     <section className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-20">
//       <div className="bg-white p-8 md:p-12 w-full max-w-[500px] rounded-2xl shadow-xl">
        
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Relda</h1>
//           <p className="text-gray-500 text-sm">Please sign up in using the form below.</p>
//         </div>

//         <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Full Name</label>
//             <input
//               type="text"
//               placeholder="Enter your name"
//               name="name"
//               value={data.name}
//               onChange={handleOnChange}
//               className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 outline-none focus:border-[#E60000] transition-all placeholder:text-gray-300`}
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Email Address</label>
//             <input
//               type="email"
//               placeholder="pixelshipon@gmail.com"
//               name="email"
//               value={data.email}
//               onChange={handleOnChange}
//               className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 outline-none focus:border-[#E60000] transition-all placeholder:text-gray-300`}
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Mobile Number</label>
//             <ReactPhoneInput
//                 country="in"
//                 value={data.mobile}
//                 onChange={(phone) => handleOnChange({ target: { name: 'mobile', value: phone } })}
//                 containerClass="!w-full"
//                 inputClass={`!w-full !h-[50px] !border ${errors.mobile ? '!border-red-500' : '!border-gray-200'} !rounded-lg !text-base focus:!border-[#E60000]`}
//                 buttonClass="!border-gray-200 !rounded-l-lg !bg-transparent"
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Password</label>
//             <div className={`relative border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-lg flex items-center focus-within:border-[#E60000] transition-all`}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="********"
//                 value={data.password}
//                 name="password"
//                 onChange={handleOnChange}
//                 className="w-full border-l-0 border-gray-200 rounded-l-lg px-4 py-3 outline-none focus:border-[#E60000] transition-all placeholder:text-gray-300"

//               />
//               <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>
//             {/* Error message color is Green based on given image */}
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="text-sm font-bold text-gray-700">Confirm Password</label>
//             <div className={`relative border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-lg flex items-center focus-within:border-[#E60000] transition-all`}>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={data.confirmPassword}
//                 name="confirmPassword"
//                 onChange={handleOnChange}
//                 className="w-full px-4 py-3 bg-transparent outline-none placeholder:text-gray-300"
//               />
//               <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <input 
//               type="checkbox" 
//               id="terms"
//               checked={agreeTerms}
//               onChange={(e) => setAgreeTerms(e.target.checked)}
//               className="accent-[#E60000] cursor-pointer w-4 h-4" 
//             />
//             <label htmlFor="terms" className="text-xs font-semibold text-gray-700 cursor-pointer">
//                 Agree with <Link to="/terms" className="text-[#E60000] underline">Terms & Condition</Link>
//             </label>
//           </div>

//           <button 
//             type="submit"
//             className="bg-[#E60000] hover:bg-[#CC0000] text-white font-bold py-3 rounded-lg mt-2 transition-all active:scale-95 shadow-lg shadow-red-100"
//           >
//             Signup
//           </button>

//           <div className="text-center mt-2">
//             <p className="text-sm text-gray-600">
//               Already have an account? <Link to="/login" className="text-[#E60000] font-bold hover:underline">Login</Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default SignUp;


import React, { useState } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    
    // Name validation
    if (!data.name.trim()) tempErrors.name = "Name is required";
    
    // Email validation
    if (!data.email) {
        tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        tempErrors.email = "Please enter a valid email address";
    }
    
    // Mobile validation
    if (!data.mobile || data.mobile.length < 10) tempErrors.mobile = "Valid mobile number is required";
    
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (data.password.length < 8) {
        tempErrors.password = "Password must be at least 8 characters";
    } else if (!passwordRegex.test(data.password)) {
        tempErrors.password = "Use uppercase, lowercase, numbers & symbols";
    }

    // Confirm Password validation
    if (data.password !== data.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!agreeTerms) {
        tempErrors.terms = "Please accept the Terms & Conditions to continue";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field when user starts typing
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);

    try {
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await dataResponse.json();

      if (result.success) {
        toast.success(result.message);
        navigate('/login');
      } else {
        if (result.details) {
          const fieldErrors = {};
          result.details.forEach((detail) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 py-20">
      <div className="bg-white p-8 md:p-12 w-full max-w-[500px] rounded-2xl shadow-xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Relda</h1>
          <p className="text-gray-500 text-sm">Please sign up in using the form below.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              className={`w-full border ${errors.name ? 'border-[#E60000]' : 'border-gray-200'} rounded-lg px-4 py-3 outline-none focus:border-[#E60000] transition-all placeholder:text-gray-300`}
            />
            {errors.name && <p className="text-[#E60000] text-xs font-medium ml-1">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="pixelshipon@gmail.com"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              className={`w-full border ${errors.email ? 'border-[#E60000]' : 'border-gray-200'} rounded-lg px-4 py-3 outline-none focus:border-[#E60000] transition-all placeholder:text-gray-300`}
            />
            {errors.email && <p className="text-[#E60000] text-xs font-medium ml-1">{errors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">Mobile Number</label>
            <ReactPhoneInput
                country="in"
                value={data.mobile}
                onChange={(phone) => handleOnChange({ target: { name: 'mobile', value: phone } })}
                containerClass="!w-full"
                inputClass={`!w-full !h-[50px] !border ${errors.mobile ? '!border-[#E60000]' : '!border-gray-200'} !rounded-lg !text-base focus:!border-[#E60000]`}
                buttonClass="!border-gray-200 !rounded-l-lg !bg-transparent"
            />
            {errors.mobile && <p className="text-[#E60000] text-xs font-medium ml-1">{errors.mobile}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">Password</label>
            <div className={`relative border ${errors.password ? 'border-[#E60000]' : 'border-gray-200'} rounded-lg flex items-center focus-within:border-[#E60000] transition-all`}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={data.password}
                name="password"
                onChange={handleOnChange}
                                  className="w-full border-l-0 border-gray-200 rounded-l-lg px-4 py-3 outline-none focus:border-[#E60000] transition-all placeholder:text-gray-300"

              />
              <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {errors.password ? (
                <p className="text-[#E60000] text-xs font-medium ml-1">{errors.password}</p>
            ) : (
                <p className="text-green-600 text-[10px] md:text-xs font-semibold mt-1">Min 8 chars: Uppercase, Lowercase, Number & Symbol</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">Confirm Password</label>
            <div className={`relative border ${errors.confirmPassword ? 'border-[#E60000]' : 'border-gray-200'} rounded-lg flex items-center focus-within:border-[#E60000] transition-all`}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={data.confirmPassword}
                name="confirmPassword"
                onChange={handleOnChange}
                className="w-full px-4 py-3 bg-transparent outline-none placeholder:text-gray-300"
              />
              <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {errors.confirmPassword && <p className="text-[#E60000] text-xs font-medium ml-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms and Conditions */}
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-2">
                <input 
                type="checkbox" 
                id="terms"
                checked={agreeTerms}
                onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if(e.target.checked) setErrors(prev => ({...prev, terms: ""}));
                }}
                className="accent-[#E60000] cursor-pointer w-4 h-4" 
                />
                <label htmlFor="terms" className="text-xs font-semibold text-gray-700 cursor-pointer">
                    Agree with <a href="/TermsAndConditions" target="_blank" className="text-[#E60000] underline">Terms & Condition</a>
                </label>
            </div>
            {errors.terms && <p className="text-[#E60000] text-[10px] font-medium ml-6">{errors.terms}</p>}
          </div>

          <button 
              type="submit"
              disabled={loading}
              className="bg-[#E60000] hover:bg-[#CC0000] text-white font-bold py-3 rounded-lg mt-2 transition-all active:scale-95 shadow-md shadow-red-100 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Signup'}
          </button>

          <div className="text-center mt-2">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-[#E60000] font-bold hover:underline">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUp;