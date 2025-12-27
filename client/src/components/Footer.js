// import React from 'react';
// import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5";
// import { BsTwitterX, BsYoutube } from "react-icons/bs";
// import { FaRegCopyright } from 'react-icons/fa';

// const Footer = () => {
//   return (
//     <footer className="bg-slate-200">
//       <div className="container mx-auto p-4">
//         <p className="text-center font-bold" title="Relda-India">
//           Copyrights    <FaRegCopyright className="inline mb-1" /> 2024 RELDA India{' '}
//           <span className="block sm:inline">- All Rights Reserved.</span>
//           <br />
//           Marketed by RELDA
//           <br />
//           Registered Office: Plot No 17A, Majestic Avenue, Krishna Nagar, Madhavaram Milk Colony, Chennai, Tamilnadu
//           600051.
//           <br />
//           RELDA India logo and its design are trademarks owned by LaMART Group.
//         </p>
//         <div className="mt-4 text-center">
//           <a href="/PrivacyPolicy"  target="_blank" rel="noopener noreferrer"  className="text-black-600 font-semibold hover:underline mx-2">
//             Privacy Policy
//           </a>
//           <a href="/TermsAndConditions" target="_blank" rel="noopener noreferrer"   className="text-black-600 font-semibold hover:underline mx-2">
//             Terms and Conditions
//           </a>
//           <a href="/RefundPolicy" target="_blank" rel="noopener noreferrer"   className="text-black-600 font-semibold hover:underline mx-2">
//             Return & Refund Policy
//           </a>
//           <a href="/ShippingPolicy" target="_blank" rel="noopener noreferrer"   className="text-black-600 font-semibold hover:underline mx-2">
//             Shipping Policy
//           </a>
//          <a href="/PricingPolicy" target="_blank" rel="noopener noreferrer"   className="text-black-600 font-semibold hover:underline mx-2">
//             Pricing Policy
//           </a>	

//         </div>
//         <div className="mt-4 text-center flex justify-center space-x-4">
//         <a href="https://www.facebook.com/reldaindia" target="_blank" rel="noopener noreferrer"  className="text-2xl text-g-400 hover:text-blue-600"><IoLogoFacebook /></a>
//           <a href="https://www.instagram.com/reldaindia/?hl=en" target="_blank" rel="noopener noreferrer" className="text-2xl text-black-400 hover:text-pink-500"><IoLogoInstagram /></a>
//           <a href="https://x.com/ReldaIndia" target="_blank" rel="noopener noreferrer" className="text-2xl text-black-400 hover:text-white"><BsTwitterX /></a>
//           <a href="https://www.youtube.com/channel/UClkiHCA4tVLtbtIc2fjhCgQ" target="_blank" rel="noopener noreferrer" className="text-2xl text-black-400 hover:text-red-500"><BsYoutube /> </a>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React, { useCallback, useEffect, useState } from 'react';
import { 
  IoLogoFacebook, 
} from "react-icons/io5";
import { FaSquareXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import {  BsYoutube } from "react-icons/bs";
import { RiLinkedinFill } from "react-icons/ri";
import { 
  FiMapPin, 
  FiPhoneCall, 
  FiMail, 
  FiClock,
} from "react-icons/fi";
import Logo from "../assest/LogoWhite.svg";
import { FaRegCopyright } from 'react-icons/fa';
import SummaryApi from '../common';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const FooterSkeleton = ({ lines = 6 }) => {
    return (
      <ul className="flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, index) => (
          <li key={index}>
            <div className="h-4 w-32 rounded-md bg-slate-700/60 animate-pulse"></div>
          </li>
        ))}
      </ul>
    );
  };

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getActiveParentCategories.url);
      const data = await response.json();
      
      // Validate if data contains categories and is an array
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories); // Directly set categories without filtering
      } else {
        console.error("Error: Invalid category data structure");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    // 'style' is used to set the background color of the footer and remove any background images
    <footer 
      className="text-[#99A1AF] pt-16 pb-8 border-t border-slate-800"
      style={{ 
        backgroundColor: '#0F172A', 
        backgroundImage: 'none', 
        backgroundAttachment: 'scroll',
        position: 'relative',
        // zIndex: 50
      }}
    >
      <div className="px-4 lg:px-12 mx-auto">
        
        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand Section */}
          <div className="flex flex-col gap-6">
            {/* Logo */}
               <div className="flex-shrink-0">
                <img
                  // onClick={() => navigate("/")}
                  src={Logo}
                  alt="Relda Logo"
                  className="cursor-pointer h-10 md:h-12 w-auto"
                />
              </div>
            <p className="text-sm leading-relaxed">
              Shop premium home and kitchen appliances in Tamil Nadu with Relda India. 
              Smart, stylish, and energy-efficient solutions for every home.
            </p>
            <div className="mt-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">FOLLOW US ON</h4>
              <div className="flex items-center gap-3">
  {/* <a href="https://facebook.com/reldaindia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0F172A] hover:bg-brand-primaryHover hover:text-white transition-all">
    <IoLogoFacebook size={20} />
  </a>
  <a href="https://instagram.com/reldaindia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0F172A] hover:bg-brand-primaryHover hover:text-white transition-all">
    <IoLogoInstagram size={20} />
  </a>
  <a href="https://www.linkedin.com/company/elda-electronics/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0F172A] hover:bg-brand-primaryHover hover:text-white transition-all">
    <IoLogoLinkedin size={20} />
  </a>
  <a href="https://x.com/ReldaIndia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0F172A] hover:bg-brand-primaryHover hover:text-white transition-all">
    <BsTwitterX size={20} />
  </a>*/}
  {/* <a href="https://www.youtube.com/@Relda_India" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0F172A] hover:bg-brand-primaryHover hover:text-white transition-all">
    <IoLogoYoutube size={20} />
  </a>  */}
  <a 
                    href="https://www.facebook.com/reldaindia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center transition-colors text-white hover:text-brand-primaryHover"
                  >
                    <IoLogoFacebook className="w-10 h-10" />
                  </a>
                  <a 
                    href="https://www.instagram.com/reldaindia/?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-white hover:text-brand-primaryHover transition-colors"
                  >
                    <RiInstagramFill className="w-10 h-10" />
                  </a>
                    <a href="https://www.linkedin.com/company/elda-electronics/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#0F172A] hover:bg-brand-primaryHover hover:text-white transition-all">
    <RiLinkedinFill size={22} />
  </a>
                 
                  <a 
                    href="https://www.youtube.com/channel/UClkiHCA4tVLtbtIc2fjhCgQ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-white hover:text-brand-primaryHover transition-colors"
                  >
                    <BsYoutube className="w-10 h-10" />
                  </a>
                   <a 
                    href="https://www.linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-white hover:text-brand-primaryHover transition-colors"
                  >
                    <FaSquareXTwitter className="w-10 h-10" />
                  </a>
</div>
            </div>
          </div>

          {/* 2. Products Section */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 flex items-center">
              <span className="block w-1 h-5 bg-brand-primary mr-2 rounded-md"></span>
              PRODUCTS
            </h3>
            {loading ? (
              <FooterSkeleton lines={6} />
            ) : (
              <ul className="flex flex-col gap-3 text-sm">
                {categories.slice(0, 6).map((category) => (
                  <li key={category?._id}>
                    <a
                      href={`/product-category?parentCategory=${category.name}`}
                      className="hover:text-white transition-colors"
                    >
                      {category?.name}
                    </a>
                  </li>
                ))}
              </ul>

            )}
          </div>

          {/* 3. Support Section */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 flex items-center">
              <span className="block w-1 h-5 bg-brand-primary mr-2 rounded-md"></span>
              SUPPORT
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="/ProductRegistration" className="hover:text-white transition-colors">Product Registration</a></li>
              <li><a href="/AuthorizedDealer" className="hover:text-white transition-colors">Authorized Dealers</a></li>
              <li><a href="/customer-enquiry" className="hover:text-white transition-colors">Enquiry</a></li>
              <li><a href="/AboutUs" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/ContactUsPage" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* 4. Contact Section */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 flex items-center">
              <span className="block w-1 h-5 bg-brand-primary mr-2 rounded-md"></span>
              CONTACT
            </h3>
            <div className="flex flex-col gap-5 text-sm">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-white mt-1 shrink-0" size={18} />
                <p>Plot No 17A, Majestic Avenue, Krishna Nagar,<br />Madhavaram Milk Colony, Chennai, Tamil Nadu 600051.</p>
              </div>
              <div className="flex items-center gap-3">
                <FiPhoneCall className="text-white shrink-0" size={18} />
                <a href="tel:+919884890934" className="hover:text-white transition-colors">+91 98848 90934</a>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-white shrink-0" size={18} />
                <a href="mailto:support@relda.india.com" className="hover:text-white transition-colors">support@reldaindia.com</a>
              </div>
              <div className="flex items-start gap-3">
                <FiClock className="text-white mt-1 shrink-0" size={18} />
                <p>Working Hours: Mon - Sat<br />09:00 am - 05:00 pm</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] tracking-wide">
          <p><FaRegCopyright className="inline mb-1" /> {currentYear} RELDA India - All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 uppercase">
            <a href="/PrivacyPolicy" target='_blank' className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-slate-700 hidden md:inline">|</span>
            <a href="/TermsAndConditions" target='_blank' className="hover:text-white transition-colors">Terms & Conditions</a>
            <span className="text-slate-700 hidden md:inline">|</span>
            <a href="/ShippingPolicy" target='_blank' className="hover:text-white transition-colors">Shipping Policy</a>
            <span className="text-slate-700 hidden md:inline">|</span>
            <a href="/PricingPolicy" target='_blank' className="hover:text-white transition-colors">Pricing Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
