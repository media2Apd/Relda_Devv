// import React from 'react';
// import SummaryApi from '../common';

// const AuthorizedDealer = () => {

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);

//     try {
//       const response = await fetch(SummaryApi.authorisedDealer.url, {
//         method: SummaryApi.authorisedDealer.method,
//         credentials: "include",
//         body: formData,
//       });

//       const data = await response.json();

//       console.log('Success:', data);
//       alert(data.message);
//       event.target.reset(); 
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Error submitting application');
//     }

//     console.log(Object.fromEntries(formData.entries())); // For debugging
//   };

//   return (
//     <div className="p-10 max-w-4xl mx-auto bg-gray-900 text-brand-textMuted text-center">
//       <h1 className="text-center text-2xl font-semibold mb-4 text-white">APPLY FOR AUTHORIZED DEALER</h1>
//       <hr className="border-gray-200 mb-4" />
//       <p>Give me your details below we will connect shortly</p>
//       <br />
//       <h2 className="text-white">Apply Now</h2>
//       <form id="registration-form" onSubmit={handleSubmit} className="flex flex-col items-center mt-8">
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           required
//           className="w-full my-2 p-2 border-none rounded text-gray-900"
//         />
//         <input
//           type="tel"
//           name="phone"
//           placeholder="Phone*"
//           required
//           className="w-full my-2 p-2 border-none rounded text-gray-900"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email*"
//           required
//           className="w-full my-2 p-2 border-none rounded text-gray-900"
//         />
//         <input
//           type="text"
//           name="aadharNumber"
//           placeholder="Aadhar Number*"
//           required
//           className="w-full my-2 p-2 border-none rounded text-gray-900"
//         />
//         <input
//           type="text"
//           name="GSTNumber"
//           placeholder="GST Number*"
//           required
//           className="w-full my-2 p-2 border-none rounded text-gray-900"
//         />
//         <input
//           type="text"
//           name="PanNumber"
//           placeholder="PAN Number*"
//           required
//           className="w-full my-2 p-2 border-none rounded text-gray-900"
//         />
//         <label htmlFor="fileUpload" className="flex items-center justify-center p-2 mt-2 border-none rounded cursor-pointer">
//           ATTACH YOUR PROFILE GST DOCUMENTATION IN SINGLE FILE
//         </label>
//         <input
//         type="file"
//         id="fileUpload"
//         name="fileUpload"
//         accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
//         required
//         className="w-full my-2 p-2 border border-brand-textMuted rounded text-brand-textMuted"
//         />

//         <button type="submit" className="bg-brand-primary text-white py-2 px-4 mt-8 rounded cursor-pointer hover:bg-brand-textMuted">
//           Submit Application
//         </button>     
//       </form>
//     </div>
//   );
// };

// export default AuthorizedDealer;

import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const AuthorizedDealer = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (data) => {
    const e = {};

    if (!data.firstName?.trim()) e.firstName = "First name is required";
    if (!data.lastName?.trim()) e.lastName = "Last name is required";

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

    if (!data.GSTNumber) e.GSTNumber = "GST number is required";

    if (!data.PanNumber) {
      e.PanNumber = "PAN number is required";
    } else if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(data.PanNumber)) {
      e.PanNumber = "Invalid PAN number";
    }

    if (!data.fileUpload) e.fileUpload = "Document is required";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      const response = await fetch(SummaryApi.authorisedDealer.url, {
        method: SummaryApi.authorisedDealer.method,
        credentials: "include",
        body: formData,
      });

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
  "w-full px-2 py-2 border-b border-brand-productCardBorder outline-none bg-transparent text-sm placeholder-[#666666] transition-colors duration-200";

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold mb-2">
            Apply for Authorized Dealer
          </h1>
          <p className="text-sm text-[#99A1AF]">
            Give me your details below, we will connect shortly
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md px-6 md:px-16 py-4"
        >
          {/* First + Last */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                name="firstName"
                placeholder="John"
                 className={`${inputClass} ${errors.firstName ? "border-brand-primary" : ""}`}
              />
              {errors.firstName && (
                <p className="text-xs text-brand-primary mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input
                name="lastName"
                placeholder="Doe"
                className={`${inputClass} ${errors.lastName ? "border-brand-primary" : ""}`}
              />
              {errors.lastName && (
                <p className="text-xs text-brand-primary mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div>
              <label className="text-sm font-medium">Mail Id</label>
              <input
                name="email"
                placeholder="johndoe123@gmail.com"
                 className={`${inputClass} ${errors.email ? "border-brand-primary" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-brand-primary mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                name="phone"
                placeholder="+91 2345678901"
                 className={`${inputClass} ${errors.phone ? "border-brand-primary" : ""}`}
              />
              {errors.phone && (
                <p className="text-xs text-brand-primary mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Aadhaar */}
          <div className="mb-10">
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

          {/* GST */}
          <div className="mb-10">
            <label className="text-sm font-medium">GST Number</label>
            <input
              name="GSTNumber"
              placeholder="Enter GST Number"
               className={`${inputClass} ${errors.GSTNumber ? "border-brand-primary" : ""}`}
            />
            {errors.GSTNumber && (
              <p className="text-xs text-brand-primary mt-1">{errors.GSTNumber}</p>
            )}
          </div>

          {/* PAN */}
          <div className="mb-10">
            <label className="text-sm font-medium">Pan Number</label>
            <input
              name="PanNumber"
              placeholder="Enter PAN Number"
               className={`${inputClass} ${errors.PanNumber ? "border-brand-primary" : ""}`}
            />
            {errors.PanNumber && (
              <p className="text-xs text-brand-primary mt-1">{errors.PanNumber}</p>
            )}
          </div>

          {/* File */}
          <div className="mb-12">
            <p className="text-sm font-medium text-[#99A1AF] mb-2">
              Attach all GST profile documents in one file.
            </p>
            <input
              type="file"
              name="fileUpload"
              className={`w-full border border-brand-productCardBorder rounded-md text-sm px-1 py-1 outline-none bg-transparent
                ${errors.fileUpload ? "border-brand-primary" : "border-brand-productCardBorder"}
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

          {/* BUTTON */}
          <div className="flex justify-center md:justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-10 py-2 rounded-md text-white text-sm font-medium
                ${loading ? "bg-brand-primaryHover" : "bg-brand-primary hover:bg-brand-primaryHover"}
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

export default AuthorizedDealer;
