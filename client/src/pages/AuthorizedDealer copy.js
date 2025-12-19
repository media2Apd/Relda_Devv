import React from 'react';
import SummaryApi from '../common';

const AuthorizedDealer = () => {

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await fetch(SummaryApi.ProductRegistration.url, {
        method: SummaryApi.ProductRegistration.method,
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      console.log('Success:', data);
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting application');
    }

    console.log(Object.fromEntries(formData.entries())); // For debugging
  };

  return (
    <div className="p-10 max-w-4xl mx-auto bg-gray-900 text-gray-400 text-center">
      <h1 className="text-center text-2xl font-semibold mb-4 text-white">APPLY FOR AUTHORIZED DEALER</h1>
      <hr className="border-gray-300 mb-4" />
      <p>Give me your details below we will connect shortly</p>
      <br />
      <h2 className="text-white">Apply Now</h2>
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
          name="aadharNumber"
          placeholder="Aadhar Number*"
          required
          className="w-full my-2 p-2 border-none rounded text-gray-900"
        />
        <input
          type="text"
          name="GSTNumber"
          placeholder="GST Number*"
          required
          className="w-full my-2 p-2 border-none rounded text-gray-900"
        />
        <input
          type="text"
          name="PanNumber"
          placeholder="PAN Number*"
          required
          className="w-full my-2 p-2 border-none rounded text-gray-900"
        />
        <label htmlFor="fileUpload" className="flex items-center justify-center p-2 mt-2 border-none rounded cursor-pointer">
          INSTALLATION & SERIAL NO PHOTO
        </label>
        <input
          type="file"
          id="fileUpload"
          name="fileUpload"
          accept="image/*"
          required
          className="w-full my-2 p-2 border border-gray-400 rounded text-gray-400"
        />
        <button type="submit" className="bg-red-700 text-white py-2 px-4 mt-8 rounded cursor-pointer hover:bg-gray-500">
          Submit Application
        </button>     
      </form>
    </div>
  );
};

export default AuthorizedDealer;
