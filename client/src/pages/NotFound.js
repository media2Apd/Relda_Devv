
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Oops! Page not found.
      </h2>
      <p className="text-gray-500 mb-8 text-center pl-4 pr-4">
        It looks like the page you're looking for doesn't exist or has been
        moved. Try searching for something else or go back to the homepage.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFound;