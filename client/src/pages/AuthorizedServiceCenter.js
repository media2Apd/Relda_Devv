// AuthorizedServiceCenter.js
import React from 'react';
import SummaryApi from '../common';

const AuthorizedServiceCenter = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch(SummaryApi.authourisedServiceCentre.url, {
      method: SummaryApi.authourisedServiceCentre.method,
      credentials: "include",
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert(data.message);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error submitting application');
    });

    console.log(Object.fromEntries(formData.entries())); // For debugging
  };

  return (
    <div className="p-20 max-w-4xl mx-auto bg-gray-900 text-gray-400 text-center">
      <h1 className="text-center text-2xl font-semibold mb-4 text-white">APPLY FOR AUTHORIZED SERVICE CENTER</h1>
      <hr className="border-gray-300 mb-4" />
      <p className="text-center mb-4">Give me your details below we will connect shortly</p>
      <h2 className="text-center text-xl font-medium mb-6 text-white">Apply Now</h2>
      <form id="registration-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" required className="w-full p-3 border rounded-md text-gray-900" />
          <input type="email" name="email" placeholder="Email*" required className="w-full p-3 border rounded-md text-gray-900" />
          <input type="text" name="aadharNumber" placeholder="Aadhar Number*" required className="w-full p-3 border rounded-md text-gray-900" />
          <input type="text" name="gstNumber" placeholder="GST Number*" required className="w-full p-3 border rounded-md text-gray-900" />
          <input type="text" name="panNumber" placeholder="PAN Number*" required className="w-full p-3 border rounded-md text-gray-900" />
          <input type="tel" name="phone" placeholder="Phone*" required className="w-full p-3 border rounded-md text-gray-900" />
        
        <textarea id="text" name="address" placeholder="Service Center Address*" required className="w-full p-3 border rounded-md h-30 text-gray-900"></textarea>
        </div>
        <label htmlFor="fileUpload" className="flex items-center justify-center p-2 mt-2 border-none rounded cursor-pointer">Attach soft copy of * Doc's</label>
        <input type="file" id="fileUpload" name="fileUpload" accept="application/pdf,doc,docx" required className="w-full my-2 p-2 border border-gray-400 rounded text-gray-400" />
        
        <button type="submit" className="bg-red-700 text-white py-2 px-4 mt-8 rounded cursor-pointer hover:bg-gray-500">Submit Application</button>
      </form>
    </div>
  );
};

export default AuthorizedServiceCenter;