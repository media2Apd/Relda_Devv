// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import SummaryApi from '../common';

// const ResetPassword = () => {
//    const [password, setPassword] = useState('');
//    const { token } = useParams();
//    const navigate = useNavigate();

//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            const response = await fetch(SummaryApi.resetPassword(token).url, {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify({ password }),
//            });

//            const data = await response.json();
//            if (data.success) {
//                toast.success(data.message);
//                navigate('/login');
//            } else {
//                toast.error(data.message);
//            }
//        } catch (error) {
//            toast.error("An error occurred. Please try again.");
//        }
//    };

//    return (
//        <div className="flex justify-center items-center min-h-screen bg-gray-100">
//            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
//                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
//                <form onSubmit={handleSubmit}>
//                    <div className="mb-4">
//                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//                            New Password
//                        </label>
//                        <input
//                            type="password"
//                            id="password"
//                            value={password}
//                            onChange={(e) => setPassword(e.target.value)}
//                            required
//                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                        />
//                    </div>
//                    <button
//                        type="submit"
//                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//                    >
//                        Reset Password
//                    </button>
//                </form>
//            </div>
//        </div>
//    );
// };

// export default ResetPassword;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SummaryApi from '../common';

const ResetPassword = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [data, setData] = useState({
       password: '',
       confirmPassword: ''
   });
   const [errors, setErrors] = useState({});
   const { token } = useParams();
   const navigate = useNavigate();

   const handleOnChange = (e) => {
       const { name, value } = e.target;
       setData(prev => ({ ...prev, [name]: value }));
       if (errors[name]) {
           setErrors(prev => ({ ...prev, [name]: "" }));
       }
   };

   const validate = () => {
       let tempErrors = {};
       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

       if (data.password.length < 8) {
           tempErrors.password = "Password must be at least 8 characters";
       } else if (!passwordRegex.test(data.password)) {
           tempErrors.password = "Use uppercase, lowercase, numbers & symbols";
       }

       if (data.password !== data.confirmPassword) {
           tempErrors.confirmPassword = "Passwords do not match";
       }

       setErrors(tempErrors);
       return Object.keys(tempErrors).length === 0;
   };

   const handleSubmit = async (e) => {
       e.preventDefault();
       
       if (!validate()) return;

       try {
           const response = await fetch(SummaryApi.resetPassword(token).url, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ password: data.password }),
           });

           const result = await response.json();
           if (result.success) {
               toast.success(result.message || "Password reset successful!");
               navigate('/login');
           } else {
               toast.error(result.message || "Failed to reset password.");
           }
       } catch (error) {
           toast.error("An error occurred. Please try again.");
       }
   };

   return (
       <section className="min-h-screen -mt-24 bg-gray-100 flex items-center justify-center p-4 py-20">
           <div className="bg-white p-8 md:p-12 w-full max-w-[500px] rounded-2xl shadow-xl">
               
               {/* Header Section */}
               <div className="text-center mb-8">
                   <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                   <p className="text-gray-500 text-sm">
                       Please enter and confirm your new strong password.
                   </p>
               </div>

               <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                   
                   {/* New Password */}
                   <div className="flex flex-col gap-1">
                       <label className="text-sm font-bold text-gray-700">New Password</label>
                       <div className={`relative border ${errors.password ? 'border-[#E60000]' : 'border-gray-200'} rounded-lg flex items-center focus-within:border-[#E60000] transition-all`}>
                           <input
                               type={showPassword ? "text" : "password"}
                               placeholder="********"
                               name="password"
                               value={data.password}
                               onChange={handleOnChange}
                               className="w-full px-4 py-3 bg-transparent outline-none placeholder:text-gray-300"
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

                   {/* Confirm New Password */}
                   <div className="flex flex-col gap-1">
                       <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                       <div className={`relative border ${errors.confirmPassword ? 'border-[#E60000]' : 'border-gray-200'} rounded-lg flex items-center focus-within:border-[#E60000] transition-all`}>
                           <input
                               type={showConfirmPassword ? "text" : "password"}
                               placeholder="Re-enter your password"
                               name="confirmPassword"
                               value={data.confirmPassword}
                               onChange={handleOnChange}
                               className="w-full px-4 py-3 bg-transparent outline-none placeholder:text-gray-300"
                           />
                           <div className="pr-4 cursor-pointer text-gray-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                               {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                           </div>
                       </div>
                       {errors.confirmPassword && (
                           <p className="text-[#E60000] text-xs font-medium ml-1">{errors.confirmPassword}</p>
                       )}
                   </div>

                   {/* Submit Button */}
                   <button
                       type="submit"
                       className="bg-[#E60000] hover:bg-[#CC0000] text-white font-bold py-3 rounded-lg mt-4 transition-all active:scale-95 shadow-lg shadow-red-100"
                   >
                       Reset Password
                   </button>
               </form>
           </div>
       </section>
   );
};

export default ResetPassword;