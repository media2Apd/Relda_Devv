
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const NotFound = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="h-[80vh] flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
//       <h2 className="text-2xl font-semibold text-gray-700 mb-6">
//         Oops! Page not found.
//       </h2>
//       <p className="text-gray-500 mb-8 text-center pl-4 pr-4">
//         It looks like the page you're looking for doesn't exist or has been
//         moved. Try searching for something else or go back to the homepage.
//       </p>
//       <button
//         onClick={() => navigate("/")}
//         className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
//       >
//         Go to Homepage
//       </button>
//     </div>
//   );
// };

// export default NotFound;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { ShoppingBag, Home, Search, ArrowLeft } from "lucide-react";

// const NotFound = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 pt-12">
//       <div className="max-w-2xl w-full text-center">
//         {/* Animated Shopping Bag Icon */}
//         <div className="relative inline-block mb-8">
//           <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
//           <ShoppingBag 
//             className="relative text-blue-600 mx-auto animate-bounce" 
//             size={120} 
//             strokeWidth={1.5}
//           />
//         </div>

//         {/* 404 Text */}
//         <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-brand-primary mb-4">
//           404
//         </h1>

//         {/* Heading */}
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
//           Oops! Product Not Found
//         </h2>

//         {/* Description */}
//         <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
//           The page you're looking for seems to have wandered off. 
//           Don't worry, let's get you back to shopping!
//         </p>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           <button
//             onClick={() => navigate("/")}
//             className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
//           >
//             <Home size={20} />
//             Go to Homepage
//           </button>

//           <button
//             onClick={() => navigate(-1)}
//             className="group flex items-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
//           >
//             <ArrowLeft size={20} />
//             Go Back
//           </button>
//         </div>

//         {/* Popular Links */}
//         <div className="mt-12 pt-8 border-t border-gray-200">
//           <p className="text-sm text-gray-500 mb-4 font-medium">
//             Quick Links
//           </p>
//           <div className="flex flex-wrap gap-3 justify-center">
//             <button
//               onClick={() => navigate("/products")}
//               className="text-sm text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
//             >
//               All Products
//             </button>
//             <button
//               onClick={() => navigate("/categories")}
//               className="text-sm text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
//             >
//               Categories
//             </button>
//             <button
//               onClick={() => navigate("/deals")}
//               className="text-sm text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
//             >
//               Hot Deals
//             </button>
//             <button
//               onClick={() => navigate("/contact")}
//               className="text-sm text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
//             >
//               Contact Us
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotFound;

import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Home, ArrowLeft, Package, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-red-50 px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Illustration Container */}
        <div className="relative inline-block mb-8">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-pink-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          
          {/* Main Icon with Background Circle */}
          <div className="relative bg-gradient-to-br from-red-50 to-pink-50 rounded-full p-8 shadow-2xl">
            <div className="absolute -top-3 -right-3 bg-brand-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg animate-bounce">
              ?
            </div>
            <ShoppingBag 
              className="text-brand-primary mx-auto drop-shadow-lg animate-swing" 
              size={100} 
              strokeWidth={1.5}
            />
            {/* Small Floating Elements */}
            <Package 
              className="absolute -bottom-2 -left-2 text-brand-primary animate-float" 
              size={30} 
            />
            <Search 
              className="absolute -top-2 -left-4 text-brand-primary animate-float-delayed" 
              size={28} 
            />
          </div>
        </div>

        {/* 404 Text with Shadow */}
        <h1 className="text-9xl md:text-[180px] font-black text-transparent bg-clip-text bg-brand-primary mb-2 drop-shadow-2xl leading-none">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 tracking-tight">
          Oops! Page Not Found
        </h2>

        {/* Subtitle with Icon */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-red-300 to-red-500"></div>
          <span className="text-brand-primary font-semibold text-sm uppercase tracking-wider">
            Lost in Shopping
          </span>
          <div className="w-12 h-0.5 bg-brand-primary to-transparent"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 bg-brand-primary text-white px-4 py-2 rounded-md hover:shadow-2xl hover:scale-105 transform transition-all duration-300 font-semibold text-lg relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-brand-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            <Home size={22} className="relative z-10" />
            <span className="relative z-10">Back to Home</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 bg-white text-gray-700 px-4 py-2 rounded-md border-2 border-gray-300 hover:border-red-500 hover:text-brand-primaryHover hover:bg-red-50 transform hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-lg"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
        </div>


        {/* Quick Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-5 font-semibold uppercase tracking-wider">
            Quick Navigation
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { path: "/product-category", label: "All Products", icon: "" },
              { path: "/search", label: "Categories", icon: "" },
              // { path: "/deals", label: "Hot Deals", icon: "🔥" },
              // { path: "/new-arrivals", label: "New Arrivals", icon: "" },
              { path: "/ContactUsPage", label: "Help Center", icon: "" },
            ].map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="group flex items-center gap-2 text-sm text-brand-textMuted hover:text-brand-primaryHover px-5 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200 font-medium shadow-sm hover:shadow-md"
              >
                {/* <span className="group-hover:scale-110 transition-transform">
                  {link.icon}
                </span> */}
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
