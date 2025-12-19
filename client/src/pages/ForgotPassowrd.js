import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';


const ForgotPassword = () => {
   const [email, setEmail] = useState('');

   const handleSubmit = async (e) => {
       e.preventDefault();
       try {
           const response = await fetch(SummaryApi.forgotPassword.url, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email }),
           });

           const data = await response.json();
           if (data.success) {
               toast.success(data.message);
           } else {
               toast.error(data.message);
           }
       } catch (error) {
           toast.error("An error occurred. Please try again.");
       }
   };

   return (
       <div className="flex justify-center items-center min-h-screen bg-gray-100">
           <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
               <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
               <form onSubmit={handleSubmit}>
                   <div className="mb-4">
                       <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                           Email Address
                       </label>
                       <input
                           type="email"
                           id="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                       />
                   </div>
                   <button
                       type="submit"
                       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                   >
                       Send Reset Link
                   </button>
               </form>
           </div>
       </div>
   );
};

export default ForgotPassword;
