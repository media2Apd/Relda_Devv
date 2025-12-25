// import React, { useEffect } from 'react';
// import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5";
// import { BsTwitterX, BsYoutube } from "react-icons/bs";
// import SummaryApi from '../common';

// const ContactUsPage = () => {
//   useEffect(() => {
//     const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//     const today = new Date().getDay();
//     document.getElementById(days[today]).classList.add('text-white');
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const name = event.target.name.value;
//     const email = event.target.email.value;
//     const phone = event.target.phone.value;
//     const message = event.target.message.value;

//     try {
//       const response = await fetch(SummaryApi.contactUs.url, {
//         method: SummaryApi.contactUs.method,
//         credintials : 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ name, email, phone, message })
//       });

//       if (response.ok) {
//         alert('Message sent successfully');
// 	event.target.reset(); 
//       } else {
//         alert('Failed to send message');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred while sending the message');
//     }
//    };

//   return (
//     <div className="p-5 max-w-3xl mx-auto bg-gray-900 text-gray-400">
//       <section id="contact-us">
//         <h1 className="text-center text-2xl font-semibold mb-4 text-white">CONTACT US</h1>
//         <hr className="border-gray-300 mb-4" />
//         <div className="p-5 rounded-md">
//           <h3 className="text-center p-5">Write us!</h3>
//           <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
//             <input type="text" id="name" name="name" placeholder="Name*" required className="w-full p-3 text-black rounded-md" />
//             <input type="email" id="email" name="email" placeholder="Email*" required className="w-full p-3 text-black rounded-md" />
//             <input type="tel" name="phone" placeholder="Mobile Number*" required className="w-full p-3 text-black rounded-md" />
//             <textarea id="message" name="message" placeholder="Message" required className="w-full p-3 text-black rounded-md"></textarea>
//             <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-md hover:bg-gray-500">Send</button>
//           </form>
//         </div>
//       </section>

//       <section id="visit-us">
//         <h2 className="text-f9f9f9 text-xl text-center">Better yet, see us in person!</h2>
//         <p className="text-center">We love our customers, so feel free to visit during normal business hours.</p>
//         <a href="https://wa.me/919884890934" target="_blank" rel="noopener noreferrer">
//           <button className="bg-green-500 text-white py-2 px-4 mt-6 rounded-md hover:bg-green-600 block mx-auto">Message us on WhatsApp</button>
//         </a>
//         <div className="flex flex-wrap justify-around mt-8 space-y-4 md:space-y-0">
//           <div className="w-full md:w-1/2 p-2 text-center md:text-center">
//             <h4 className="text-f9f9f9">RELDA INDIA</h4>
//             <p>Registered Office: Plot No 17A</p>
//             <p>Majestic Avenue, Krishna Nagar,</p>
//             <p>Madhavaram Milk Colony, Chennai, Tamilnadu 600051.</p><br></br>
//             <p>09884890934</p>
//             <p><a href="mailto:support@reldaindia.com" className="hover:text-white">support@reldaindia.com</a></p>
//           </div>
//           <div className="w-full md:w-1/2 p-2 text-center md:text-center">
//             <h4 className="text-f9f9f9">Working Hours</h4>
//             <p id="monday">Mon 09:00 am - 05:00 pm</p>
//             <p id="tuesday">Tue 09:00 am - 05:00 pm</p>
//             <p id="wednesday">Wed 09:00 am - 05:00 pm</p>
//             <p id="thursday">Thu 09:00 am - 05:00 pm</p>
//             <p id="friday">Fri 09:00 am - 05:00 pm</p>
//             <p id="saturday">Sat 09:00 am - 05:00 pm</p>
//             <p id="sunday">Sun Closed</p>
//           </div>
//         </div>
//       </section>

//       <section id="social-links" className="text-center py-5">
//         <h2 className="text-white">CONNECT WITH US</h2>
//         <hr className="border-white my-5" />
//         <div className="flex justify-center space-x-5">
//           <a href="https://www.facebook.com/reldaindia" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-white"><IoLogoFacebook /></a>
//           <a href="https://www.instagram.com/reldaindia/?hl=en" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-white"><IoLogoInstagram /></a>
//           {/* <a href="https://x.com/i/flow/login?redirect_after_login=%2FElectronicsElda" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-white"><BsTwitterX /></a> */}
//           <a href="https://www.youtube.com/channel/UClkiHCA4tVLtbtIc2fjhCgQ" target="_blank" rel="noopener noreferrer" className="text-2xl text-black-400 hover:text-white"><BsYoutube /> </a>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ContactUsPage;

import React, { useState } from "react";
import { IoLogoFacebook } from "react-icons/io5";
import { RiInstagramFill } from "react-icons/ri";
import { BsTwitterX, BsYoutube } from "react-icons/bs";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import SummaryApi from "../common";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";

const ContactUsPage = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const validateForm = () => {
  const newErrors = {};

  if (!formData.firstName.trim()) {
    newErrors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    newErrors.lastName = "Last name is required";
  }

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    newErrors.email = "Enter a valid email";
  }

  if (!formData.phone) {
    newErrors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }

  if (!formData.message.trim()) {
    newErrors.message = "Message is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setLoading(true);

    const response = await fetch(SummaryApi.contactUs.url, {
      method: SummaryApi.contactUs.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }),
    });

    if (response.ok) {
      toast.success("Message sent successfully");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});
    } else {
      toast.error("Failed to send message");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
      setLoading(false);
 }
};

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">
          Contact Us
        </h1>
        <p className="text-[#99A1AF]">
          Any question or remarks? Just write us a message!
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-2">
        <div className="grid grid-cols-1 lg:grid-cols-5">

          {/* LEFT – CONTACT INFO */}
          <div className="order-2 lg:order-1 lg:col-span-2 bg-[#0F172A] text-white px-6 lg:px-10 py-6 lg:py-12 rounded-xl relative">
            <h2 className="text-2xl font-semibold mb-3">
              Contact Information
            </h2>
            <p className="text-[#99A1AF] text-sm mb-10">
              Fill up the form and our Team will get back to you within 24 hours
            </p>

            <div className="space-y-8 mb-16">
              <div className="flex gap-4">
                <FiPhone className="w-5 h-5 mt-1" />
                <p className="text-[#99A1AF]">+91 98848 90934</p>
              </div>

              <div className="flex gap-4">
                <FiMail className="w-5 h-5 mt-1" />
                <p className="text-[#99A1AF]">support@relda.india.com</p>
              </div>

              <div className="flex gap-4">
                <FiMapPin className="w-5 h-5 mt-1" />
                <p className="text-[#99A1AF] leading-relaxed">
                  Plot No 17A<br />
                  Majestic Avenue, Krishna Nagar,<br />
                  Madhavaram Milk Colony,<br />
                  Chennai, Tamilnadu 600051.
                </p>
              </div>

              <div className="flex gap-4">
                <FiClock className="w-5 h-5 mt-1" />
                <p className="text-[#99A1AF]">
                 Working Hours: Mon - Sat<br />
                  09:00 am - 05:00 pm
                </p>
              </div>
            </div>

             <div className="flex gap-6">
                <a 
                  href="https://www.facebook.com/reldaindia" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center transition-colors hover:text-brand-primaryHover"
                >
                  <IoLogoFacebook className="w-5 h-5 md:w-8 md:h-8 " />
                </a>
                <a 
                  href="https://www.instagram.com/reldaindia/?hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center hover:text-brand-primaryHover transition-colors"
                >
                  <RiInstagramFill className="w-5 h-5 md:w-8 md:h-8 " />
                </a>
                <a 
                  href="https://www.linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center hover:text-brand-primaryHover transition-colors"
                >
                  <BsTwitterX className="w-4 h-4 md:w-7 md:h-7" />
                </a>
                <a 
                  href="https://www.youtube.com/channel/UClkiHCA4tVLtbtIc2fjhCgQ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center hover:text-brand-primaryHover transition-colors"
                >
                  <BsYoutube className="w-5 h-5 md:w-8 md:h-8" />
                </a>
             </div>
          </div>

          {/* RIGHT – FORM */}
          <div className="order-1 lg:order-2 lg:col-span-3 bg-white p-8 sm:p-10 lg:p-12 lg:mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={`w-full py-2 border-b outline-none bg-transparent
                    ${errors.firstName ? "border-brand-primary" : "border-brand-productCardBorder"}`}
                  />
                  {errors.firstName && (
                    <p className="text-brand-primary text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`w-full py-2 border-b outline-none bg-transparent
                    ${errors.lastName ? "border-brand-primary" : "border-brand-productCardBorder"}`}
                  />
                  {errors.lastName && (
                    <p className="text-brand-primary text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Mail Id</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="johndoe@gmail.com"
                    className={`w-full py-2 border-b outline-none bg-transparent
                    ${errors.email ? "border-brand-primary" : "border-brand-productCardBorder"}`}
                  />
                  {errors.email && (
                    <p className="text-brand-primary text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 2345678901"
                    className={`w-full py-2 border-b outline-none bg-transparent
                    ${errors.phone ? "border-brand-primary" : "border-brand-productCardBorder"}`}
                  />
                  {errors.phone && (
                    <p className="text-brand-primary text-xs mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write us a message"
                    className={`w-full py-2 border-b outline-none bg-transparent
                    ${errors.message ? "border-brand-primary" : "border-brand-productCardBorder"}`}
                  />
                  {errors.message && (
                    <p className="text-brand-primary text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 lg:pt-20">
                <a
                  href="https://wa.me/919884890934"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                <button
                  type="button"
                  className="w-full px-6 py-2 flex items-center justify-center gap-2
                            border border-[#99A1AF] text-[#99A1AF]
                            rounded-md font-medium"
                >
                  <FaWhatsapp className="text-lg" />

                  {/* Desktop */}
                  <span className="hidden md:inline text-sm">
                    Message us on WhatsApp
                  </span>

                  {/* Mobile */}
                  <span className="md:hidden text-sm">
                    WhatsApp
                  </span>
                </button>

                </a>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-10 py-2 rounded-md font-medium text-white text-sm
                  ${loading ? "bg-brand-primaryHover" : "bg-brand-primary hover:bg-brand-primaryHover"}
                  `}
                >
                  {loading ? "Submitting..." : "Send Message"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;

