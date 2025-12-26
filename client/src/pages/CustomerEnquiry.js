// import React, { useState } from "react";
// import { IoLogoFacebook } from "react-icons/io5";
// import { RiInstagramFill } from "react-icons/ri";
// import { BsTwitterX, BsYoutube } from "react-icons/bs";
// import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
// import SummaryApi from "../common";
// import { toast } from "react-toastify";

// const CustomerEnquiry = () => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     message: "",
//   });

//   const validate = () => {
//     const e = {};
//     if (!formData.name) e.name = "Name is required";
//     if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Valid email required";
//     if (!/^\d{10}$/.test(formData.phone)) e.phone = "10 digit phone required";
//     if (!formData.address) e.address = "Address required";
//     if (!/^\d{6}$/.test(formData.pincode)) e.pincode = "Valid pincode required";
//     if (!formData.message) e.message = "Message required";

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       setLoading(true);
//       const res = await fetch(SummaryApi.customerSupport.url, {
//         method: SummaryApi.customerSupport.method,
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         toast.success("Enquiry sent successfully");
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           address: "",
//           pincode: "",
//           message: "",
//         });
//         setErrors({});
//       } else {
//         toast.error("Failed to send enquiry");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputBase =
//     "w-full py-2 border-b outline-none bg-transparent transition-colors duration-200";
//   const inputNormal = "border-brand-productCardBorder";
//   const inputError = "border-brand-primary";

//   return (
//     <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
//       {/* HEADER */}
//       <div className="max-w-7xl mx-auto text-center mb-12">
//         <h1 className="text-3xl font-bold mb-3">Customer Enquiry</h1>
//         <p className="text-[#99A1AF]">
//           Give us your details below, we will connect shortly
//         </p>
//       </div>

//       {/* MAIN CARD */}
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-2">
//         <div className="grid grid-cols-1 lg:grid-cols-5">

//           {/* LEFT – CONTACT INFO (SAME AS CONTACT US) */}
//           <div className="order-2 lg:order-1 lg:col-span-2 bg-[#0F172A] text-white px-6 lg:px-10 py-6 lg:py-12 rounded-xl">
//             <h2 className="text-2xl font-semibold mb-3">
//               Contact Information
//             </h2>
//             <p className="text-[#99A1AF] text-sm mb-10">
//               Our team will get back to you within 24 hours
//             </p>

//             <div className="space-y-8 mb-16">
//               <div className="flex gap-4">
//                 <FiPhone className="w-5 h-5 mt-1" />
//                 <p className="text-[#99A1AF]">+91 98848 90934</p>
//               </div>

//               <div className="flex gap-4">
//                 <FiMail className="w-5 h-5 mt-1" />
//                 <p className="text-[#99A1AF]">support@relda.india.com</p>
//               </div>

//               <div className="flex gap-4">
//                 <FiMapPin className="w-5 h-5 mt-1" />
//                 <p className="text-[#99A1AF] leading-relaxed">
//                   Plot No 17A<br />
//                   Majestic Avenue, Krishna Nagar,<br />
//                   Madhavaram Milk Colony,<br />
//                   Chennai, Tamilnadu 600051.
//                 </p>
//               </div>

//               <div className="flex gap-4">
//                 <FiClock className="w-5 h-5 mt-1" />
//                 <p className="text-[#99A1AF]">
//                   Mon - Sat<br />
//                   09:00 am - 05:00 pm
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-6">
//               <IoLogoFacebook className="w-6 h-6 hover:text-brand-primaryHover" />
//               <RiInstagramFill className="w-6 h-6 hover:text-brand-primaryHover" />
//               <BsTwitterX className="w-5 h-5 hover:text-brand-primaryHover" />
//               <BsYoutube className="w-6 h-6 hover:text-brand-primaryHover" />
//             </div>
//           </div>

//           {/* RIGHT – FORM (MATCH CONTACT US) */}
//           <div className="order-1 lg:order-2 lg:col-span-3 bg-white p-8 sm:p-10 lg:p-12 lg:mt-8">
//             <form onSubmit={handleSubmit} className="space-y-6">

//               {[
//                 { name: "name", label: "Name" },
//                 { name: "email", label: "Email" },
//                 { name: "phone", label: "Phone" },
//                 { name: "address", label: "Address" },
//                 { name: "pincode", label: "Pincode" },
//               ].map((field) => (
//                 <div key={field.name}>
//                   <label className="text-sm font-medium">
//                     {field.label}
//                   </label>
//                   <input
//                     name={field.name}
//                     value={formData[field.name]}
//                     onChange={(e) =>
//                       setFormData({ ...formData, [field.name]: e.target.value })
//                     }
//                     className={`${inputBase} ${
//                       errors[field.name] ? inputError : inputNormal
//                     }`}
//                   />
//                   <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
//                     {errors[field.name] || ""}
//                   </p>
//                 </div>
//               ))}

//               <div>
//                 <label className="text-sm font-medium">Message</label>
//                 <textarea
//                   rows={4}
//                   name="message"
//                   value={formData.message}
//                   onChange={(e) =>
//                     setFormData({ ...formData, message: e.target.value })
//                   }
//                   className={`${inputBase} ${
//                     errors.message ? inputError : inputNormal
//                   }`}
//                 />
//                 <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
//                   {errors.message || ""}
//                 </p>
//               </div>

//               <div className="flex justify-end lg:pt-20">
//                 <button
//                   disabled={loading}
//                   className={`px-10 py-2 rounded-md font-medium text-white text-sm
//                   ${
//                     loading
//                       ? "bg-brand-primaryHover"
//                       : "bg-brand-primary hover:bg-brand-primaryHover"
//                   }`}
//                 >
//                   {loading ? "Submitting..." : "Send Enquiry"}
//                 </button>
//               </div>

//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerEnquiry;

import React, { useState } from "react";
import { IoLogoFacebook } from "react-icons/io5";
import { RiInstagramFill } from "react-icons/ri";
import { BsTwitterX, BsYoutube } from "react-icons/bs";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const CustomerEnquiry = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    message: "",
  });

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};

    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";

    if (!formData.email) {
      e.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      e.email = "Enter valid email";
    }

    if (!formData.phone) {
      e.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      e.phone = "Enter valid 10-digit phone number";
    }

    if (!formData.address.trim()) e.address = "Address is required";

    if (!/^\d{6}$/.test(formData.pincode)) {
      e.pincode = "Enter valid 6-digit pincode";
    }

    if (!formData.message.trim()) e.message = "Message is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch(SummaryApi.customerSupport.url, {
        method: SummaryApi.customerSupport.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
          message: formData.message,
        }),
      });

      if (res.ok) {
        toast.success("Enquiry sent successfully");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          pincode: "",
          message: "",
        });
        setErrors({});
      } else {
        toast.error("Failed to send enquiry");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STYLES ---------------- */
  const inputBase =
    "w-full px-2 py-2 border-b outline-none bg-transparent transition-colors duration-200";
  const inputNormal = "border-brand-productCardBorder";
  const inputError = "border-brand-primary";

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Customer Enquiry</h1>
        <p className="text-[#99A1AF]">
          Give us your details below, we will connect shortly
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
              Our team will get back to you within 24 hours
            </p>

            <div className="space-y-8 mb-16">
              <div className="flex gap-4">
                <FiPhone className="w-5 h-5 mt-1" />
                <a href="tel:+919884890934" className="text-[#99A1AF]">+91 98848 90934</a>
              </div>

              <div className="flex gap-4">
                <FiMail className="w-5 h-5 mt-1" />
                <a href="mailto:support@relda.india.com" className="text-[#99A1AF]">support@relda.india.com</a>
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
              <RiInstagramFill className="w-6 h-6 hover:text-brand-primaryHover" />
              <BsTwitterX className="w-5 h-5 hover:text-brand-primaryHover" />
              <BsYoutube className="w-6 h-6 hover:text-brand-primaryHover" />
            </div>
          </div>

          {/* RIGHT – FORM */}
          <div className="order-1 lg:order-2 lg:col-span-3 bg-white p-8 sm:p-10 lg:p-12 lg:mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* FIRST + LAST NAME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    placeholder="John"
                    onChange={handleChange}
                    className={`${inputBase} ${
                      errors.firstName ? inputError : inputNormal
                    }`}
                  />
                  <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                    {errors.firstName || ""}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`${inputBase} ${
                      errors.lastName ? inputError : inputNormal
                    }`}
                  />
                  <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                    {errors.lastName || ""}
                  </p>
                </div>
              </div>

              {/* EMAIL + PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="johndoe@gmail.com"
                    className={`${inputBase} ${
                      errors.email ? inputError : inputNormal
                    }`}
                  />
                  <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                    {errors.email || ""}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 2345678901"
                    className={`${inputBase} ${
                      errors.phone ? inputError : inputNormal
                    }`}
                  />
                  <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                    {errors.phone || ""}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

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

              {/* PINCODE */}
              <div>
                <label className="text-sm font-medium">Pincode</label>
                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter your pincode"
                  className={`${inputBase} ${
                    errors.pincode ? inputError : inputNormal
                  }`}
                />
                <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                  {errors.pincode || ""}
                </p>
              </div>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write us a message"
                  className={`${inputBase} ${
                    errors.message ? inputError : inputNormal
                  }`}
                />
                <p className="text-brand-primary text-xs mt-1 min-h-[16px]">
                  {errors.message || ""}
                </p>
              </div>

              {/* BUTTON */}
              <div className="flex justify-end lg:pt-20">
                <button
                  disabled={loading}
                  className={`px-10 py-2 rounded-md font-medium text-white text-sm
                  ${
                    loading
                      ? "bg-brand-primaryHover"
                      : "bg-brand-primary hover:bg-brand-primaryHover"
                  }`}
                >
                  {loading ? "Submitting..." : "Send Enquiry"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerEnquiry;
