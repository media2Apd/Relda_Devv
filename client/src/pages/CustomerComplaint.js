// import React, { useState } from "react";
// import SummaryApi from "../common";
// import { toast } from "react-toastify";

// const CustomerComplaint = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const formData = new FormData(form);

//     if (!formData.get("customerName")) {
//       setErrors({ customerName: "Customer name required" });
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch(SummaryApi.complaintSupport.url, {
//         method: SummaryApi.complaintSupport.method,
//         credentials: "include",
//         body: formData,
//       });

//       const data = await res.json();
//       toast.success(data.message);
//       form.reset();
//       setErrors({});
//     } catch {
//       toast.error("Complaint submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white py-10 px-4">
//       <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl px-6 md:px-16 py-8">
//         <h1 className="text-2xl font-semibold mb-6 text-center">
//           Customer Complaint
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <input
//             name="customerName"
//             placeholder="Customer Name"
//             className="w-full py-2 border-b outline-none bg-transparent"
//           />
//           {errors.customerName && (
//             <p className="text-xs text-brand-primary mt-1">
//               {errors.customerName}
//             </p>
//           )}

//           <textarea
//             name="complaintText"
//             placeholder="Describe your issue"
//             className="w-full py-2 border-b outline-none bg-transparent"
//           />

//           <input
//             type="file"
//             name="fileUpload"
//             className="
//               w-full rounded-md text-sm
//               border border-brand-productCardBorder
//               file:border-0 file:bg-[#E5E5E5]
//               file:text-[#040404] file:px-4 file:py-1.5
//             "
//           />

//           <div className="flex justify-end">
//             <button
//               disabled={loading}
//               className={`px-10 py-2 rounded-md text-white text-sm
//                 ${
//                   loading
//                     ? "bg-brand-primaryHover"
//                     : "bg-brand-primary hover:bg-brand-primaryHover"
//                 }`}
//             >
//               {loading ? "Submitting..." : "Submit Complaint"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CustomerComplaint;

import React, { useState } from "react";
import {
  IoLogoFacebook,
  IoLogoInstagram,
} from "react-icons/io5";
import { BsTwitterX, BsYoutube } from "react-icons/bs";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const CustomerComplaint = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    customerName: "",
    orderID: "",
    mobileNumber: "",
    email: "",
    address: "",
    purchaseDate: "",
    deliveryDate: "",
    complaintText: "",
    fileUpload: null,
  });

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};

    if (!formData.customerName) e.customerName = "Customer name is required";
    if (!formData.orderID) e.orderID = "Order ID is required";

    if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ""))) {
      e.mobileNumber = "Enter valid 10-digit mobile number";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      e.email = "Enter valid email";
    }

    if (!formData.address) e.address = "Address is required";
    if (!formData.purchaseDate) e.purchaseDate = "Purchase date required";
    if (!formData.deliveryDate) e.deliveryDate = "Delivery date required";
    if (!formData.complaintText)
      e.complaintText = "Complaint description required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    Object.keys(formData).forEach((key) =>
      payload.append(key, formData[key])
    );

    try {
      setLoading(true);
      const res = await fetch(SummaryApi.complaintSupport.url, {
        method: SummaryApi.complaintSupport.method,
        credentials: "include",
        body: payload,
      });

      if (res.ok) {
        toast.success("Complaint submitted successfully");
        setFormData({
          customerName: "",
          orderID: "",
          mobileNumber: "",
          email: "",
          address: "",
          purchaseDate: "",
          deliveryDate: "",
          complaintText: "",
          fileUpload: null,
        });
        setErrors({});
      } else {
        toast.error("Failed to submit complaint");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STYLES ---------------- */
  const inputBase =
    "w-full px-2 py-2 border-b outline-none bg-transparent transition-colors placeholder:text-[#99A1AF] duration-200";
  const inputNormal = "border-brand-productCardBorder";
  const inputError = "border-brand-primary";

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Customer Complaint</h1>
        <p className="text-[#99A1AF]">
          Please provide complete details to help us resolve your issue
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-2">
        <div className="grid grid-cols-1 lg:grid-cols-5">

          {/* LEFT – CONTACT INFO */}
          <div className="order-2 lg:order-1 lg:col-span-2 bg-[#0F172A] text-white px-6 lg:px-10 py-6 lg:py-12 rounded-xl">
            <h2 className="text-2xl font-semibold mb-3">
              Contact Information
            </h2>
            <p className="text-[#99A1AF] text-sm mb-10">
              Our support team will respond within 24 hours
            </p>

            <div className="space-y-8 mb-16">
              <div className="flex gap-4">
                <FiPhone className="w-5 h-5 mt-1" />
                <a href="tel:9884890934" className="text-[#99A1AF]">+91 98848 90934</a>
              </div>

              <div className="flex gap-4">
                <FiMail className="w-5 h-5 mt-1" />
                <a href="mailto:support@reldaindia.com" className="text-[#99A1AF]">support@reldaindia.com</a>
              </div>

              <div className="flex gap-4">
                <FiMapPin className="w-5 h-5 mt-1" />
                <p className="text-[#99A1AF] leading-relaxed">
                  Plot No 17A<br />
                  Majestic Avenue, Krishna Nagar,<br />
                  Madhavaram Milk Colony,<br />
                  Chennai, Tamil Nadu 600051.
                </p>
              </div>

              <div className="flex gap-4">
                <FiClock className="w-5 h-5 mt-1" />
                <p className="text-[#99A1AF]">
                  Mon - Sat<br />
                  09:00 am - 05:00 pm
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <IoLogoFacebook className="w-6 h-6 hover:text-brand-primaryHover" />
              <IoLogoInstagram className="w-6 h-6 hover:text-brand-primaryHover" />
              <BsTwitterX className="w-5 h-5 hover:text-brand-primaryHover" />
              <BsYoutube className="w-6 h-6 hover:text-brand-primaryHover" />
            </div>
          </div>

          {/* RIGHT – FORM */}
          <div className="order-1 lg:order-2 lg:col-span-3 bg-white p-8 sm:p-10 lg:p-12 lg:mt-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* CUSTOMER + ORDER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: "customerName", label: "Customer Name", placeholder: "John Doe" },
                  { name: "orderID", label: "Order ID", placeholder: "order_" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm font-medium">{f.label}</label>
                    <input
                      name={f.name}
                      placeholder={f.placeholder}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors[f.name] ? inputError : inputNormal
                      }`}
                    />
                    <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                      {errors[f.name] || ""}
                    </p>
                  </div>
                ))}
              </div>

              {/* PHONE + EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: "mobileNumber", label: "Mobile Number", placeholder: "+91 2345678901" },
                  { name: "email", label: "Email", placeholder: "johndoe@gmail.com" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm font-medium">{f.label}</label>
                    <input
                      name={f.name}
                      placeholder={f.placeholder}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors[f.name] ? inputError : inputNormal
                      }`}
                    />
                    <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                      {errors[f.name] || ""}
                    </p>
                  </div>
                ))}
              </div>

              {/* ADDRESS */}
              <div>
                <label className="text-sm font-medium">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className={`${inputBase} ${
                    errors.address ? inputError : inputNormal
                  }`}
                />
                <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                  {errors.address || ""}
                </p>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: "purchaseDate", label: "Purchase Date" },
                  { name: "deliveryDate", label: "Delivery Date" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm font-medium">{f.label}</label>
                    <input
                      type="date"
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        errors[f.name] ? inputError : inputNormal
                      }`}
                    />
                    <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                      {errors[f.name] || ""}
                    </p>
                  </div>
                ))}
              </div>

              {/* COMPLAINT */}
              <div>
                <label className="text-sm font-medium">Complaint</label>
                <textarea
                  rows={3}
                  name="complaintText"
                  value={formData.complaintText}
                  onChange={handleChange}
                  placeholder="Enter your complaint"
                  className={`${inputBase} ${
                    errors.complaintText ? inputError : inputNormal
                  }`}
                />
                <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                  {errors.complaintText || ""}
                </p>
              </div>

              {/* FILE */}
              <div>
                <label className="text-sm font-medium text-[#99A1AF]">
                  Attach Supporting Document.
                </label>
                <input
                type="file"
                onChange={handleChange}
                name="fileUpload"
                className={`mt-2 w-full border border-brand-productCardBorder rounded-md text-sm px-2 py-1 outline-none bg-transparent
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
              </div>

              {/* BUTTON */}
              <div className="flex justify-center md:justify-end lg:pt-8">
                <button
                  disabled={loading}
                  className={`w-full md:w-auto px-10 py-2 rounded-md font-medium text-white text-sm
                  ${
                    loading
                      ? "bg-brand-primaryHover"
                      : "bg-brand-primary hover:bg-brand-primaryHover"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerComplaint;
