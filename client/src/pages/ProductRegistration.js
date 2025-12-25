// import { React, useState } from 'react';
// import SummaryApi from '../common';

// const ProductRegistration = () => {
//   const [isFocused, setIsFocused] = useState(false);
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
  
//     try {
//       const response = await fetch(SummaryApi.ProductRegistration.url, {
//         method: SummaryApi.ProductRegistration.method,
//         credentials: "include",
//         body: formData,  // Send formData directly without JSON.stringify
//       });
  
//       if (response.ok) {
//         alert('Registration successful');
// 	event.target.reset(); 
//       } else {
//         const errorData = await response.json();
//         console.error('Error response:', errorData);
//         alert(`Registration failed: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred');
//     }
//   };
  

//   return (
//     <div className="p-10 max-w-4xl mx-auto bg-gray-900 text-gray-400 text-center">
//       <h1 className="text-center text-2xl font-semibold mb-4 text-white">PRODUCT REGISTRATION</h1>
//       <hr className="border-gray-300 mb-4" />
//       <p className="text-gray-400">IT'S A RECORD FOR YOUR INSTALLATION SERVICE</p>
//       <br />
//       <h2 className="text-white">FILL THE BELOW DETAILS</h2>
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
//           name="orderNumber"
//           placeholder="Order Number*"
//           required
//           className="w-full my-2 p-2 border-none rounded text-gray-900"
//         />
//         <input
//           type="text"
//           name="serialNumber"
//           placeholder="Serial Number*"
//           required
//           className="w-full my-2 p-2 border-none rounded text-gray-900"
//         />
//         <input
//       type={isFocused ? "date" : "text"}
//       name="installationDate"
//       placeholder={isFocused ? "" : "Delivery Date*"}
//       required
//       className="w-full my-2 p-2 border-none rounded text-gray-900"
//       onFocus={() => setIsFocused(true)}
//       onBlur={() => setIsFocused(false)}
//     />
//         <label htmlFor="fileUpload" className="flex items-center justify-center p-2 mt-2 border-none rounded cursor-pointer">
//           SERIAL NO PHOTO
//         </label>
//         <input
//           type="file"
//           id="fileUpload"
//           name="fileUpload"
//           accept=".pdf, .doc, .docx"
//           required
//           className="w-full my-2 p-2 border border-gray-400 rounded text-gray-400"
//         />
//         <button type="submit" className="bg-red-700 text-white py-2 px-4 mt-8 rounded cursor-pointer hover:bg-gray-500">
//           Submit Details
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProductRegistration;
import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const ProductRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDateFocused, setIsDateFocused] = useState(false);

  const validate = (data) => {
    const e = {};

    if (!data.firstName?.trim()) e.firstName = "First name is required";
    if (!data.lastName?.trim()) e.lastName = "Last name is required";

    if (!data.phone) {
      e.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, ""))) {
      e.phone = "Enter valid 10 digit phone";
    }

    if (!data.email) {
      e.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      e.email = "Enter valid email";
    }

    if (!data.orderNumber?.trim()) e.orderNumber = "Order number is required";
    if (!data.serialNumber?.trim()) e.serialNumber = "Serial number is required";
    if (!data.installationDate) e.installationDate = "Delivery date is required";
    if (!data.fileUpload) e.fileUpload = "Serial number photo is required";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Combine first + last name (backend unchanged)
    formData.set(
      "name",
      `${formData.get("firstName")} ${formData.get("lastName")}`
    );

    const values = Object.fromEntries(formData.entries());
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      const response = await fetch(SummaryApi.ProductRegistration.url, {
        method: SummaryApi.ProductRegistration.method,
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        toast.success("Product registered successfully");
        form.reset();
        setErrors({});
      } else {
        const err = await response.json();
        toast.error(err.message || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong");
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
            Product Registration
          </h1>
          <p className="text-sm text-[#99A1AF]">
            It's a record for your installation service
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md px-6 md:px-16 py-6"
        >

          {/* First + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                name="firstName"
                placeholder="John"
                className={`${inputClass} ${
                  errors.firstName ? "border-brand-primary" : ""
                }`}
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
                className={`${inputClass} ${
                  errors.lastName ? "border-brand-primary" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-brand-primary mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                name="phone"
                placeholder="+91 9876543210"
                className={`${inputClass} ${
                  errors.phone ? "border-brand-primary" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-brand-primary mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                placeholder="example@gmail.com"
                className={`${inputClass} ${
                  errors.email ? "border-brand-primary" : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-brand-primary mt-1">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Order + Serial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
            <div>
              <label className="text-sm font-medium">Order ID</label>
              <input
                name="orderNumber"
                placeholder="order_123"
                className={`${inputClass} ${
                  errors.orderNumber ? "border-brand-primary" : ""
                }`}
              />
              {errors.orderNumber && (
                <p className="text-xs text-brand-primary mt-1">
                  {errors.orderNumber}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Serial Number</label>
              <input
                name="serialNumber"
                placeholder="Enter serial number"
                className={`${inputClass} ${
                  errors.serialNumber ? "border-brand-primary" : ""
                }`}
              />
              {errors.serialNumber && (
                <p className="text-xs text-brand-primary mt-1">
                  {errors.serialNumber}
                </p>
              )}
            </div>
          </div>

          {/* Delivery Date */}
          <div className="mb-8">
            <label className="text-sm font-medium">Delivery Date</label>
            <input
              type={isDateFocused ? "date" : "text"}
              name="installationDate"
              placeholder={isDateFocused ? "" : "Select delivery date"}
              onFocus={() => setIsDateFocused(true)}
              onBlur={() => setIsDateFocused(false)}
              className={`${inputClass} ${
                errors.installationDate ? "border-brand-primary" : ""
              }`}
            />
            {errors.installationDate && (
              <p className="text-xs text-brand-primary mt-1">
                {errors.installationDate}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div className="mb-12">
            <p className="text-sm font-medium text-[#99A1AF] mb-2">
              Upload serial number photo
            </p>
            <input
              type="file"
              name="fileUpload"
              accept=".pdf,.doc,.docx,image/*"
              className={`w-full border border-brand-productCardBorder rounded-md text-sm px-2 py-1 outline-none bg-transparent
                ${errors.fileUpload ? "border-brand-primary" : ""}
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
                ${
                  loading
                    ? "bg-brand-primaryHover"
                    : "bg-brand-primary hover:bg-brand-primaryHover"
                }
              `}
            >
              {loading ? "Submitting..." : "Submit Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductRegistration;
