import React from 'react';
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5";
import { BsTwitterX, BsYoutube } from "react-icons/bs";
import { FaRegCopyright } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-200">
      <div className="container mx-auto p-4">
        <p className="text-center font-bold" title="Relda-India">
          Copyrights    <FaRegCopyright className="inline mb-1" /> 2024 RELDA India{' '}
          <span className="block sm:inline">- All Rights Reserved.</span>
          <br />
          Marketed by RELDA
          <br />
          Registered Office: Plot No 17A, Majestic Avenue, Krishna Nagar, Madhavaram Milk Colony, Chennai, Tamilnadu
          600051.
          <br />
          RELDA India logo and its design are trademarks owned by LaMART Group.
        </p>
        <div className="mt-4 text-center">
          <a href="/PrivacyPolicy"  target="_blank" rel="noopener noreferrer"  className="text-black-600 font-semibold hover:underline mx-2">
            Privacy Policy
          </a>
          <a href="/TermsAndConditions" target="_blank" rel="noopener noreferrer"   className="text-black-600 font-semibold hover:underline mx-2">
            Terms and Conditions
          </a>
          <a href="/RefundPolicy" target="_blank" rel="noopener noreferrer"   className="text-black-600 font-semibold hover:underline mx-2">
            Return & Refund Policy
          </a>
          <a href="/ShippingPolicy" target="_blank" rel="noopener noreferrer"   className="text-black-600 font-semibold hover:underline mx-2">
            Shipping Policy
          </a>
         <a href="/PricingPolicy" target="_blank" rel="noopener noreferrer"   className="text-black-600 font-semibold hover:underline mx-2">
            Pricing Policy
          </a>	

        </div>
        <div className="mt-4 text-center flex justify-center space-x-4">
        <a href="https://www.facebook.com/reldaindia" target="_blank" rel="noopener noreferrer"  className="text-2xl text-g-400 hover:text-blue-600"><IoLogoFacebook /></a>
          <a href="https://www.instagram.com/reldaindia/?hl=en" target="_blank" rel="noopener noreferrer" className="text-2xl text-black-400 hover:text-pink-500"><IoLogoInstagram /></a>
          {/* <a href="https://x.com/i/flow/login?redirect_after_login=%2FElectronicsElda" target="_blank" rel="noopener noreferrer" className="text-2xl text-black-400 hover:text-white"><BsTwitterX /></a> */}
          <a href="https://www.youtube.com/channel/UClkiHCA4tVLtbtIc2fjhCgQ" target="_blank" rel="noopener noreferrer" className="text-2xl text-black-400 hover:text-red-500"><BsYoutube /> </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
