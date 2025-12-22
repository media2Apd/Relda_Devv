// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import SummaryApi from '../common';


// const ForgotPassword = () => {
//    const [email, setEmail] = useState('');

//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            const response = await fetch(SummaryApi.forgotPassword.url, {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify({ email }),
//            });

//            const data = await response.json();
//            if (data.success) {
//                toast.success(data.message);
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
//                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
//                <form onSubmit={handleSubmit}>
//                    <div className="mb-4">
//                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//                            Email Address
//                        </label>
//                        <input
//                            type="email"
//                            id="email"
//                            value={email}
//                            onChange={(e) => setEmail(e.target.value)}
//                            required
//                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                        />
//                    </div>
//                    <button
//                        type="submit"
//                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//                    >
//                        Send Reset Link
//                    </button>
//                </form>
//            </div>
//        </div>
//    );
// };

// export default ForgotPassword;



import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import SummaryApi from '../common';

const ForgotPassword = () => {
   const [email, setEmail] = useState('');
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       try {
           const response = await fetch(SummaryApi.forgotPassword.url, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email }),
           });

           const data = await response.json();
           if (data.success) {
               toast.success(data.message || "Reset link sent successfully!");
           } else {
               toast.error(data.message || "Failed to send reset link.");
           }
       } catch (error) {
           toast.error("An error occurred. Please try again.");
       } finally {
           setLoading(false);
       }
   };

   return (
       <section className="min-h-screen -mt-24 bg-gray-100 flex items-center justify-center p-4">
           <div className="bg-white p-8 md:p-12 w-full max-w-[500px] rounded-2xl shadow-xl">
               
               {/* Header Section */}
               <div className="text-center mb-8">
                   <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                   <p className="text-gray-500 text-sm">
                       No worries, we'll send you instructions to reset your password.
                   </p>
               </div>

               <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                   {/* Email Input */}
                   <div className="flex flex-col gap-1">
                       <label htmlFor="email" className="text-sm font-bold text-gray-700">
                           Email Address
                       </label>
                       <input
                           type="email"
                           id="email"
                           placeholder="Enter your registered email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#E60000] transition-all placeholder:text-gray-300"
                       />
                   </div>

                   {/* Submit Button */}
                   <button
                       type="submit"
                       disabled={loading}
                       className={`bg-[#E60000] hover:bg-[#CC0000] text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-red-100 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                   >
                       {loading ? "Sending..." : "Send Reset Link"}
                   </button>

                   {/* Footer Link */}
                   <div className="text-center">
                       <p className="text-sm text-gray-600">
                           Remember your password?{' '}
                           <Link to="/login" className="text-[#E60000] font-bold hover:underline">
                               Back to Login
                           </Link>
                       </p>
                   </div>
               </form>
           </div>
       </section>
   );
};

export default ForgotPassword;