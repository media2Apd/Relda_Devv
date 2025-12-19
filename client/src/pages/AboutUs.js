import React from 'react';
import aboutUs_1 from '../assest/banner/about-us-1.webp'
import aboutUs_2 from '../assest/banner/about-us-2.webp'
import aboutUs_3 from '../assest/banner/about-us-3.webp'
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5"; 
import { BsTwitterX,BsYoutube } from "react-icons/bs";


const AboutUs = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <header className="text-center py-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">ABOUT US</h1>
      </header>
      
      <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 md:px-10">
        <div className="flex justify-center items-center">
          <img src={aboutUs_1} alt="Icon 1" className="w-30 h-30" />
        </div>
        <div className="flex justify-center items-center text-center">
          <h2 className="text-sm sm:text-base md:text-lg">
            Our products are specifically designed to give you a simple and cost-effective solution. We want to remove the barriers that prevent you from trying new things and becoming a part of our community. Our people are passionate about what they do, and we strive to make your experience with us better every day.
          </h2>
        </div>
      </section>

      <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-10">
        <div className="flex justify-center items-center text-center">
          <h3 className="text-sm sm:text-base md:text-lg">
            Relda India is a company that develops, manufactures, and sells high-quality electronics products. Our team has been working together for years to give the best electronics products at affordable prices.
          </h3>
        </div>
        <div className="flex justify-center items-center">
          <img src={aboutUs_2} alt="Icon 2" className="w-30 h-30" />
        </div>
      </section>

      <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-10">
        <div className="flex justify-center items-center">
          <img src={aboutUs_3} alt="Icon 3" className="w-30 h-30" />
        </div>
        <div className="flex justify-center items-center text-center">
          <h4 className="text-sm sm:text-base md:text-lg">
            We make it possible for everyone to have a high-quality product at their home.
          </h4>
        </div>
      </section>

      <section className="text-center py-6">
        
        <p className="text-center py-6">Connect with us:</p>
        <div className="flex justify-center space-x-4 mt-4 space-x-8">
        <a href="https://www.facebook.com/reldaindia" target="_blank" rel="noopener noreferrer" className="text-4xl sm:text-5xl text-gray-400 hover:text-white"><IoLogoFacebook /></a>
          <a href="https://www.instagram.com/reldaindia/?hl=en" target="_blank" rel="noopener noreferrer" className="text-4xl sm:text-5xl text-gray-400 hover:text-white"><IoLogoInstagram /></a>
          {/* <a href="https://x.com/i/flow/login?redirect_after_login=%2FElectronicsElda" target="_blank" rel="noopener noreferrer" className="text-4xl sm:text-5xl text-gray-400 hover:text-white"><BsTwitterX /></a> */}
          <a href="https://www.youtube.com/channel/UClkiHCA4tVLtbtIc2fjhCgQ" target="_blank" rel="noopener noreferrer" className="text-5xl sm:text-6xl text-gray-400 hover:text-white"><BsYoutube /> </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
