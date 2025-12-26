// // AuthorizedServiceCenter.js
// import React from 'react';
// import SummaryApi from '../common';

// const AuthorizedServiceCenter = () => {

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);

//     fetch(SummaryApi.authourisedServiceCentre.url, {
//       method: SummaryApi.authourisedServiceCentre.method,
//       credentials: "include",
//       body: formData,
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Success:', data);
//       alert(data.message);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       alert('Error submitting application');
//     });

//     console.log(Object.fromEntries(formData.entries())); // For debugging
//   };

//   return (
//     <div className="p-20 max-w-4xl mx-auto bg-gray-900 text-brand-textMuted text-center">
//       <h1 className="text-center text-2xl font-semibold mb-4 text-white">APPLY FOR AUTHORIZED SERVICE CENTER</h1>
//       <hr className="border-gray-200 mb-4" />
//       <p className="text-center mb-4">Give me your details below we will connect shortly</p>
//       <h2 className="text-center text-xl font-medium mb-6 text-white">Apply Now</h2>
//       <form id="registration-form" onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input type="text" name="name" placeholder="Name" required className="w-full p-3 border rounded-md text-gray-900" />
//           <input type="email" name="email" placeholder="Email*" required className="w-full p-3 border rounded-md text-gray-900" />
//           <input type="text" name="aadharNumber" placeholder="Aadhar Number*" required className="w-full p-3 border rounded-md text-gray-900" />
//           <input type="text" name="gstNumber" placeholder="GST Number*" required className="w-full p-3 border rounded-md text-gray-900" />
//           <input type="text" name="panNumber" placeholder="PAN Number*" required className="w-full p-3 border rounded-md text-gray-900" />
//           <input type="tel" name="phone" placeholder="Phone*" required className="w-full p-3 border rounded-md text-gray-900" />
        
//         <textarea id="text" name="address" placeholder="Service Center Address*" required className="w-full p-3 border rounded-md h-30 text-gray-900"></textarea>
//         </div>
//         <label htmlFor="fileUpload" className="flex items-center justify-center p-2 mt-2 border-none rounded cursor-pointer">Attach soft copy of * Doc's</label>
//         <input type="file" id="fileUpload" name="fileUpload" accept="application/pdf,doc,docx" required className="w-full my-2 p-2 border border-brand-textMuted rounded text-brand-textMuted" />
        
//         <button type="submit" className="bg-brand-primary text-white py-2 px-4 mt-8 rounded cursor-pointer hover:bg-brand-textMuted">Submit Application</button>
//       </form>
//     </div>
//   );
// };

// export default AuthorizedServiceCenter;
// AuthorizedServiceCenter.js
import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AuthorizedServiceCenter = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (data, file) => {
    const e = {};

    if (!data.name?.trim()) e.name = "Name is required";

    if (!data.email) {
      e.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      e.email = "Enter valid email";
    }

    if (!data.phone) {
      e.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ""))) {
      e.phone = "Enter valid 10 digit phone";
    }

    if (!data.aadharNumber) {
      e.aadharNumber = "Aadhaar is required";
    } else if (!/^\d{12}$/.test(data.aadharNumber)) {
      e.aadharNumber = "Aadhaar must be 12 digits";
    }

    if (!data.gstNumber) e.gstNumber = "GST number is required";

    if (!data.panNumber) {
      e.panNumber = "PAN number is required";
    } else if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(data.panNumber)) {
      e.panNumber = "Invalid PAN number";
    }

    if (!data.address?.trim()) e.address = "Address is required";

    if (!file || file.size === 0) e.fileUpload = "Document is required";

    return e;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const file = formData.get("fileUpload");

    const validationErrors = validate(values, file);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      const response = await fetch(
        SummaryApi.authourisedServiceCentre.url,
        {
          method: SummaryApi.authourisedServiceCentre.method,
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();
      toast.success(data.message);
      form.reset();
      setErrors({});
    } catch (err) {
      toast.error("Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full py-2 border-b border-brand-productCardBorder outline-none bg-transparent text-sm placeholder-[#666666] transition-colors duration-200";

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold mb-2">
            Apply for Authorized Service Center
          </h1>
          <p className="text-sm text-[#99A1AF]">
            Give me your details below, we will connect shortly
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md px-6 md:px-16 py-8"
        >
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                placeholder="John Doe"
                className={`${inputClass} ${errors.name ? "border-brand-primary" : ""}`}
              />
              {errors.name && (
                <p className="text-xs text-brand-primary mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                placeholder="johndoe@gmail.com"
                className={`${inputClass} ${errors.email ? "border-brand-primary" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-brand-primary mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Aadhaar + GST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <label className="text-sm font-medium">Aadhar Number</label>
              <input
                name="aadharNumber"
                placeholder="Enter Aadhar Number"
                className={`${inputClass} ${errors.aadharNumber ? "border-brand-primary" : ""}`}
              />
              {errors.aadharNumber && (
                <p className="text-xs text-brand-primary mt-1">
                  {errors.aadharNumber}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">GST Number</label>
              <input
                name="gstNumber"
                placeholder="Enter GST Number"
                className={`${inputClass} ${errors.gstNumber ? "border-brand-primary" : ""}`}
              />
              {errors.gstNumber && (
                <p className="text-xs text-brand-primary mt-1">{errors.gstNumber}</p>
              )}
            </div>
          </div>

          {/* PAN + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <label className="text-sm font-medium">PAN Number</label>
              <input
                name="panNumber"
                placeholder="Enter PAN Number"
                className={`${inputClass} ${errors.panNumber ? "border-brand-primary" : ""}`}
              />
              {errors.panNumber && (
                <p className="text-xs text-brand-primary mt-1">{errors.panNumber}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                name="phone"
                placeholder="+91 9876543210"
                className={`${inputClass} ${errors.phone ? "border-brand-primary" : ""}`}
              />
              {errors.phone && (
                <p className="text-xs text-brand-primary mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mb-10">
            <label className="text-sm font-medium">
              Service Center Address
            </label>
            <textarea
              name="address"
              placeholder="Enter Service Center Address"
              rows="3"
              className={`w-full py-2 border-b outline-none bg-transparent text-sm resize-none
                ${errors.address ? "border-brand-primary" : "border-brand-productCardBorder"}`}
            />
            {errors.address && (
              <p className="text-xs text-brand-primary mt-1">{errors.address}</p>
            )}
          </div>

          {/* File */}
          <div className="mb-12">
            <p className="text-sm font-medium text-[#99A1AF] mb-2">
              Attach soft copy of required documents
            </p>
            <input
              type="file"
              name="fileUpload"
              accept="application/pdf,doc,docx"
              className={`w-full rounded-md text-sm px-2 py-1 outline-none
                ${errors.fileUpload ? "border border-brand-primary" : "border border-brand-productCardBorder"}
                file:border-0
                file:bg-[#E5E5E5]
                file:text-[#040404]
                file:px-4
                file:py-1.5
                file:rounded-md
                file:cursor-pointer
              `}
            />
            {errors.fileUpload && (
              <p className="text-xs text-brand-primary mt-1">
                {errors.fileUpload}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-2 rounded-md text-white text-sm font-medium
                ${loading
                  ? "bg-brand-primaryHover cursor-not-allowed"
                  : "bg-brand-primary hover:bg-brand-primaryHover"}
              `}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorizedServiceCenter;
