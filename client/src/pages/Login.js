// import React, { useContext, useState } from "react";
// import ReactPhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import OTPInput from "otp-input-react";
// import loginIcons from "../assest/signin.gif";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import SummaryApi from "../common";
// import { toast } from "react-toastify";
// import Context from "../context";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginMethod, setLoginMethod] = useState("emailPassword"); // 'phonePassword', 'phoneOtp', 'emailPassword'
//   const [data, setData] = useState({
//     login: "",
//     otp: [], // Array to hold 6 OTP digits
//     password: "",
//   });

//   const navigate = useNavigate();
//   const location = useLocation();

//   const redirectPath = location.state?.from || "/";

//   const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

//   // Handle input changes
//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle OTP digit change
//   // const handleOtpChange = (value, index) => {
//   //   const newOtp = [...data.otp];
//   //   newOtp[index] = value;
//   //   setData((prev) => ({ ...prev, otp: newOtp }));

//   //   // Move to the next input if the current one is filled
//   //   if (value && index < 5) {
//   //     document.getElementById(`otp-${index + 1}`).focus();
//   //   }
//   // };

//   // Function to send OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const otpResponse = await fetch(SummaryApi.sendOtp.url, {
//         method: SummaryApi.sendOtp.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mobile: data.login }),
//       });
//       const otpResult = await otpResponse.json();
//       console.log(otpResult);
      
//       if (otpResult.success) {
//         toast.success("OTP sent successfully!");
//       } else {
//         toast.error("Failed to send OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       toast.error("An error occurred. Please try again.");
//     }
//   };

//   // Function to verify OTP
//   const handleOtpVerify = async (e) => {
//     e.preventDefault();
//     const otp = data?.otp; // Combine OTP digits into a single string
//     try {
//       const otpVerifyResponse = await fetch(SummaryApi.verifyOtp.url, {
//         method: SummaryApi.verifyOtp.method,
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mobile: data.login, otp }),
//       });
//       const otpVerifyResult = await otpVerifyResponse.json();
//       if (otpVerifyResult.success) {
//         toast.success("Login successful!");
//         await fetchUserDetails();
//         await fetchUserAddToCart();
//         // navigate("/");
//         navigate(redirectPath, { replace: true });
//       } else {
//         toast.error("Incorrect OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       toast.error("An error occurred. Please try again.");
//     }
//   };

//   const handlePhoneAndEmailWithPassword = async (e) => {
//     e.preventDefault();

//     try {
//       const dataResponse = await fetch(SummaryApi.signIn.url, {
//         method: SummaryApi.signIn.method,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       const dataApi = await dataResponse.json();

//       if (dataApi.success) {
//         toast.success(dataApi.message);
//         await fetchUserDetails(); // Fetch user details after login
//         await fetchUserAddToCart(); // Fetch cart data after login
//         // await handlePayment();
//         // navigate("/"); // Redirect to cart page after login
//         navigate(redirectPath, { replace: true });
//       } else {
//         toast.error(dataApi.message);
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       toast.error("An error occurred. Please try again.");
//     }
//   };

//   const handleLoginMethodChange = (method) => {
//     setLoginMethod(method);
//     setData({
//       login: "",
//       otp: [], // Array to hold 6 OTP digits
//       password: "",
//     });
//   };

//   return (
//     <section id="login">
//       <div className="mx-auto container p-4">
//         <div className="bg-white p-5 w-full max-w-sm mx-auto rounded-lg shadow-md">
//           <div className="w-20 h-20 mx-auto">
//             <img src={loginIcons} alt="login icons" />
//           </div>

//           {loginMethod === "phonePassword" && (
//             <form
//               className="pt-6 flex flex-col gap-4"
//               onSubmit={handlePhoneAndEmailWithPassword}
//             >
//         <div>
//             <label className="block text-sm font-medium mb-1">Phone Number:</label>
//             <div className="flex items-center border rounded px-3 py-2 bg-slate-100 focus-within:border-red-600">
//                 <ReactPhoneInput
//                     country="in"
//                     value={data.login}
//                     onChange={(phone) => handleOnChange({ target: { name: 'login', value: phone } })}
//                     inputClass="flex-1 outline-none bg-transparent border-none"
//                     buttonClass="bg-transparent border-none"
//                     containerClass="flex w-full items-center"
//                     dropdownClass="bg-white"
//                     autoComplete='mobile'
//                 />
//             </div>
//         </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Password:</label>
//                 <div className="bg-slate-100 p-2 flex border rounded focus-within:border-red-600">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter password"
//                     value={data.password}
//                     name="password"
//                     onChange={handleOnChange}
//                     className="w-full h-full outline-none bg-transparent"
//                     autoComplete='current-password'
//                   />
//                   <div
//                     className="cursor-pointer text-xl"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </div>
//                 </div>
//                 <Link
//                   to="/forgot-password"
//                   className="block w-fit ml-auto hover:underline hover:text-red-600"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <button
//                 type="onsubmit"
//                 className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
//               >
//                 Login
//               </button>

//               <p className="my-2">
//                 Don't have an account?{" "}
//                 <Link
//                   to="/sign-up"
//                   className="text-red-600 hover:text-red-700 hover:underline"
//                 >
//                   Sign up
//                 </Link>
//               </p>

//               <p className="text-center mt-5">
//                 <span
//                   className="text-red-600 hover:underline cursor-pointer"
//                   onClick={() => handleLoginMethodChange("emailPassword")}
//                 >
//                   Login with email?
//                 </span>
//               </p>
//             </form>
//           )}

//           {loginMethod === "phoneOtp" && (
//             <form
//               className="pt-6 flex flex-col gap-4"
//               onSubmit={handleOtpVerify}
//             >
//               <div>
//                 <label className="block text-sm font-medium mb-1">Phone Number:</label>
//                 <div className="flex items-center border rounded px-3 py-2 bg-slate-100 focus-within:border-red-600">
//                   <ReactPhoneInput
//                       country="in"
//                       value={data.login}
//                       onChange={(phone) => handleOnChange({ target: { name: 'login', value: phone } })}
//                       inputClass="flex-1 outline-none bg-transparent border-none"
//                       buttonClass="bg-transparent border-none"
//                       containerClass="flex w-full items-center"
//                       dropdownClass="bg-white"
//                       autoComplete='mobile'
//                   />
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleSendOtp}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-300 transform hover:scale-105"
//               >
//                 Send OTP
//               </button>

//               {/* OTP Input Using otp-input-react */}
//               <div className="mt-4">
//                 <label className="block text-sm font-medium mb-1">OTP:</label>
//                 <div className="flex items-center justify-center ml-4">
//                 <OTPInput
//                   value={data.otp}
//                   onChange={(otp) => handleOnChange({ target: { name: "otp", value: otp } })}
//                   OTPLength={6} // Change to the required length of your OTP
//                   otpType="number"
//                   disabled={false}
//                   autoFocus
//                   className="flex justify-center "
//                   inputClassName="w-8 h-8 xl:w-12 xl:h-12 text-center border rounded focus:outline-none focus:border-red-600"
//                 />
//                 </div>
//               </div>

//               <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-300 transform hover:scale-105 mt-4">
//                 Verify OTP
//               </button>

//               <p className="my-2">
//                 Don't have an account?{" "}
//                 <Link
//                   to="/sign-up"
//                   className="text-red-600 hover:text-red-700 hover:underline"
//                 >
//                   Sign up
//                 </Link>
//               </p>

//               <p className="text-center mt-5">
//                 <span
//                   className="text-red-600 hover:underline cursor-pointer"
//                   onClick={() => handleLoginMethodChange("phonePassword")}
//                 >
//                   Login with password?
//                 </span>
//               </p>
//             </form>
//           )}

//           {loginMethod === "emailPassword" && (
//             <form
//               className="pt-6 flex flex-col gap-2"
//               onSubmit={handlePhoneAndEmailWithPassword}
//             >
//               <div className="grid">
//                 <label className="block text-sm font-medium mb-1">Email:</label>
//                 <div className="bg-slate-100 border rounded p-2 focus-within:border-red-600">
//                   <input
//                     type="email"
//                     placeholder="Enter email"
//                     name="login"
//                     value={data.login}
//                     onChange={handleOnChange}
//                     className="w-full h-full outline-none bg-transparent"
//                     autoComplete='email'
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Password:</label>
//                 <div className="bg-slate-100 border rounded p-2 flex focus-within:border-red-600">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter password"
//                     value={data.password}
//                     name="password"
//                     onChange={handleOnChange}
//                     className="w-full h-full outline-none bg-transparent "
//                     autoComplete='current-password'
//                   />
//                   <div
//                     className="cursor-pointer text-xl"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </div>
//                 </div>
//                 <Link
//                   to="/forgot-password"
//                   className="block w-fit ml-auto hover:underline hover:text-red-600"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
//                 Login
//               </button>

//               <p className="my-2">
//                 Don't have an account?{" "}
//                 <Link
//                   to="/sign-up"
//                   className="text-red-600 hover:text-red-700 hover:underline"
//                 >
//                   Sign up
//                 </Link>
//               </p>

//               <p className="text-center mt-5">
//                 <span
//                   className="text-red-600 hover:underline cursor-pointer"
//                   onClick={() => handleLoginMethodChange("phonePassword")}
//                 >
//                   Login with phone number?
//                 </span>
//               </p>
//             </form>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Login;



import React, { useContext, useState } from "react";
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OTPInput from "otp-input-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("emailPassword"); // 'phonePassword', 'phoneOtp', 'emailPassword'
  const [data, setData] = useState({
    login: "",
    otp: "", 
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/";
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const otpResponse = await fetch(SummaryApi.sendOtp.url, {
        method: SummaryApi.sendOtp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: data.login }),
      });
      const otpResult = await otpResponse.json();
      if (otpResult.success) {
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const otpVerifyResponse = await fetch(SummaryApi.verifyOtp.url, {
        method: SummaryApi.verifyOtp.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: data.login, otp: data.otp }),
      });
      const otpVerifyResult = await otpVerifyResponse.json();
      if (otpVerifyResult.success) {
        toast.success("Login successful!");
        await fetchUserDetails();
        await fetchUserAddToCart();
        navigate(redirectPath, { replace: true });
      } else {
        toast.error("Incorrect OTP.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const handlePhoneAndEmailWithPassword = async (e) => {
    e.preventDefault();
    try {
      const dataResponse = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const dataApi = await dataResponse.json();
      if (dataApi.success) {
        toast.success(dataApi.message);
        await fetchUserDetails();
        await fetchUserAddToCart();
        navigate(redirectPath, { replace: true });
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleLoginMethodChange = (method) => {
    setLoginMethod(method);
    setData({ login: "", otp: "", password: "" });
  };

  return (
    <section className="min-h-screen -mt-24 bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 w-full max-w-[500px] rounded-2xl shadow-xl">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Relda</h1>
          <p className="text-gray-500 text-sm">Please log in using the form below.</p>
        </div>

        {/* Email/Password Form */}
        {loginMethod === "emailPassword" && (
          <form className="flex flex-col gap-5" onSubmit={handlePhoneAndEmailWithPassword}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="login"
                value={data.login}
                onChange={handleOnChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all placeholder:text-gray-300"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-red-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative border border-gray-200 rounded-lg flex items-center focus-within:border-red-500 transition-all">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 bg-transparent outline-none placeholder:text-gray-300"
                  autoComplete="current-password"
                  required
                />
                <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-2 transition-all active:scale-95">
              Login
            </button>

            <div className="text-center mt-4">
               <p className="text-sm text-gray-600">
                Don't have an account? <Link to="/sign-up" className="text-red-600 font-bold hover:underline">Signup</Link>
              </p>
              <button 
                type="button"
                onClick={() => handleLoginMethodChange("phonePassword")}
                className="text-sm font-bold text-red-600 hover:underline mt-3"
              >
                Login with phone number?
              </button>
            </div>
          </form>
        )}

        {/* Phone Password Form */}
        {loginMethod === "phonePassword" && (
          <form className="flex flex-col gap-5" onSubmit={handlePhoneAndEmailWithPassword}>
             <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">Phone Number</label>
              <div className="phone-input-container">
                <ReactPhoneInput
                    country="in"
                    value={data.login}
                    onChange={(phone) => handleOnChange({ target: { name: 'login', value: phone } })}
                    containerClass="!w-full"
                    inputClass="!w-full !h-[50px] !border-gray-200 !rounded-lg !text-base"
                    buttonClass="!border-gray-200 !rounded-l-lg !bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-red-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative border border-gray-200 rounded-lg flex items-center focus-within:border-red-500 transition-all">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 bg-transparent outline-none placeholder:text-gray-300"
                  required
                />
                <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-2 transition-all">
              Login
            </button>
            <div className="text-center mt-4">
               <p className="text-sm text-gray-600">
                Don't have an account? <Link to="/sign-up" className="text-red-600 font-bold hover:underline">Signup</Link>
              </p>
              <div className="text-center flex flex-col gap-3 mt-3">
                {/* <button type="button" onClick={() => handleLoginMethodChange("phoneOtp")} className="text-sm font-bold text-red-600 hover:underline">Login with OTP?</button> */}
                <button type="button" onClick={() => handleLoginMethodChange("emailPassword")} className="text-sm font-bold text-red-600 hover:underline">Login with email?</button>
              </div>
            </div>
          </form>
        )}

        {/* OTP Form */}
        {loginMethod === "phoneOtp" && (
          <form className="flex flex-col gap-5" onSubmit={handleOtpVerify}>
             <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">Phone Number</label>
              <div className="flex gap-2">
                <div className="flex-1">
                    <ReactPhoneInput
                        country="in"
                        value={data.login}
                        onChange={(phone) => handleOnChange({ target: { name: 'login', value: phone } })}
                        inputClass="!w-full !h-[50px] !border-gray-200 !rounded-lg"
                    />
                </div>
                <button type="button" onClick={handleSendOtp} className="bg-gray-100 px-4 rounded-lg text-sm font-bold hover:bg-gray-200">Send</button>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-center">
              <label className="text-sm font-bold text-gray-700 self-start">OTP</label>
              <OTPInput
                value={data.otp}
                onChange={(otp) => handleOnChange({ target: { name: "otp", value: otp } })}
                OTPLength={6}
                otpType="number"
                disabled={false}
                autoFocus
                inputClassName="!w-10 !h-10 md:!w-12 md:!h-12 !border !border-gray-200 !rounded-lg focus:!border-red-600 !outline-none"
              />
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-2 transition-all">
              Verify & Login
            </button>

            <button type="button" onClick={() => handleLoginMethodChange("phonePassword")} className="text-center text-sm font-bold text-red-600 hover:underline mt-4">
                Back to Password Login
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Login;