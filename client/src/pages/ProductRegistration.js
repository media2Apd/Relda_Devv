import { React, useState } from 'react';
import SummaryApi from '../common';

const ProductRegistration = () => {
  const [isFocused, setIsFocused] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
  
    try {
      const response = await fetch(SummaryApi.ProductRegistration.url, {
        method: SummaryApi.ProductRegistration.method,
        credentials: "include",
        body: formData,  // Send formData directly without JSON.stringify
      });
  
      if (response.ok) {
        alert('Registration successful');
	event.target.reset(); 
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };
  

  return (
    <div className="p-10 max-w-4xl mx-auto bg-gray-900 text-gray-400 text-center">
      <h1 className="text-center text-2xl font-semibold mb-4 text-white">PRODUCT REGISTRATION</h1>
      <hr className="border-gray-300 mb-4" />
      <p className="text-gray-400">IT'S A RECORD FOR YOUR INSTALLATION SERVICE</p>
      <br />
      <h2 className="text-white">FILL THE BELOW DETAILS</h2>
      <form id="registration-form" onSubmit={handleSubmit} className="flex flex-col items-center mt-8">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-full my-2 p-2 border-none rounded text-gray-900"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone*"
          required
          className="w-full my-2 p-2 border-none rounded text-gray-900"
        />
        <input
          type="email"
          name="email"
          placeholder="Email*"
          required
          className="w-full my-2 p-2 border-none rounded text-gray-900"
        />
        <input
          type="text"
          name="orderNumber"
          placeholder="Order Number*"
          required
          className="w-full my-2 p-2 border-none rounded text-gray-900"
        />
        <input
          type="text"
          name="serialNumber"
          placeholder="Serial Number*"
          required
          className="w-full my-2 p-2 border-none rounded text-gray-900"
        />
        <input
      type={isFocused ? "date" : "text"}
      name="installationDate"
      placeholder={isFocused ? "" : "Delivery Date*"}
      required
      className="w-full my-2 p-2 border-none rounded text-gray-900"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
        <label htmlFor="fileUpload" className="flex items-center justify-center p-2 mt-2 border-none rounded cursor-pointer">
          SERIAL NO PHOTO
        </label>
        <input
          type="file"
          id="fileUpload"
          name="fileUpload"
          accept=".pdf, .doc, .docx"
          required
          className="w-full my-2 p-2 border border-gray-400 rounded text-gray-400"
        />
        <button type="submit" className="bg-red-700 text-white py-2 px-4 mt-8 rounded cursor-pointer hover:bg-gray-500">
          Submit Details
        </button>
      </form>
    </div>
  );
};

export default ProductRegistration;
