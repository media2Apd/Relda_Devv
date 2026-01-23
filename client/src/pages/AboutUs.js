// import React from 'react';
// import aboutUs_1 from '../assest/banner/about-us-1.webp'
// import aboutUs_2 from '../assest/banner/about-us-2.webp'
// import aboutUs_3 from '../assest/banner/AboutUs3.png'
// import { IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "react-icons/io5"; 
// import { BsTwitterX } from "react-icons/bs";

// const AboutUs = () => {
//   return (
//     <div className="bg-black text-white min-h-screen">
//       <header className="text-center py-6">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">ABOUT US</h1>
//       </header>
      
//       <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 md:px-10">
//         <div className="flex justify-center items-center">
//           <img src={aboutUs_1} alt="Icon 1" className="w-30 h-30" />
//         </div>
//         <div className="flex justify-center items-center text-center">
//           <h2 className="text-sm sm:text-base md:text-lg">
//             Our products are specifically designed to give you a simple and cost-effective solution. We want to remove the barriers that prevent you from trying new things and becoming a part of our community. Our people are passionate about what they do, and we strive to make your experience with us better every day.
//           </h2>
//         </div>
//       </section>

//       <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-10">
//         <div className="flex justify-center items-center text-center">
//           <h3 className="text-sm sm:text-base md:text-lg">
//             Relda India is a company that develops, manufactures, and sells high-quality electronics products. Our team has been working together for years to give the best electronics products at affordable prices.
//           </h3>
//         </div>
//         <div className="flex justify-center items-center">
//           <img src={aboutUs_2} alt="Icon 2" className="w-30 h-30" />
//         </div>
//       </section>

//       <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-10">
//         <div className="flex justify-center items-center">
//           <img src={aboutUs_3} alt="Icon 3" className="w-30 h-30" />
//         </div>
//         <div className="flex justify-center items-center text-center">
//           <h4 className="text-sm sm:text-base md:text-lg">
//             We make it possible for everyone to have a high-quality product at their home.
//           </h4>
//         </div>
//       </section>

//       <section className="text-center py-6">
        
//         <p className="text-center py-6">Connect with us:</p>
//         <div className="flex justify-center space-x-4 mt-2">
//           <a href="https://facebook.com/reldaindia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primaryHover hover:text-white transition-all">
//             <IoLogoFacebook size={20} />
//           </a>
//           <a href="https://instagram.com/reldaindia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primaryHover hover:text-white transition-all">
//             <IoLogoInstagram size={20} />
//           </a>
//           <a href="https://x.com/ReldaIndia" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primaryHover hover:text-white transition-all">
//             <BsTwitterX size={20} />
//           </a>
//           <a href="https://www.youtube.com/@Relda_India" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary hover:bg-brand-primaryHover hover:text-white transition-all">
//             <IoLogoYoutube size={20} />
//           </a>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AboutUs;
import React from "react";
import aboutUs1 from "../assest/AboutUs.png";
import aboutUsMobile from "../assest/AboutUsMobile.png";
import aboutUs2 from "../assest/AboutUs2.png";

const AboutUs = () => {
  return (
    <div className="w-full bg-white">

      {/* ================= HERO SECTION ================= */}
      <section className="mx-auto px-4 lg:px-12 pt-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="md:pr-10">
            <span className="inline-block text-xs font-medium text-brand-primary border border-brand-primary rounded-xl px-3 py-1 mb-4">
              About Relda India
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              <span className="text-brand-primary">Relda India</span> - Affordable
              <br />
              Appliances for Every Home
            </h1>

            <p className="text-gray-600 mt-4 max-w-md">
              “Affordable, high-quality, and proudly made in India."
            </p>
          </div>

          {/* RIGHT IMAGE (FIXED SIZE LIKE DESIGN) */}
          <div className="w-full">
            <div className="hidden lg:inline-flex w-full h-[170px] lg:h-[200px] xl:h-[260px] 2xl:h-[330px] bg-gray-200 rounded-xl overflow-hidden">
              <img
                src={aboutUs1}
                alt="Home Appliances"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="block lg:hidden w-full h-full bg-gray-200 rounded-xl overflow-hidden">
              <img
                src={aboutUsMobile}
                alt="Home Appliances"
                className="w-full  h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= STORY SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 lg:px-12 py-12">
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.04)] px-6 lg:px-16 py-12 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT TEXT */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-4">
              A Land of Dreams and Determination
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              India is a land of dreams and determination, where over 63% of the
              population lives in rural towns and villages, building their lives
              with hope and hard work.
              <br /><br />
              Yet, for millions of families, accessing modern home solutions like
              appliances, lighting, or everyday household tools often feels out
              of reach due to high prices and limited availability.
            </p>
          </div>

          {/* RIGHT IMAGE (MATCH CARD HEIGHT) */}
          <div className="w-full">
            <div className="w-full h-[250px] md:h-[320px] bg-gray-200 rounded-xl overflow-hidden">
              <img
                src={aboutUs2}
                alt="Indian Family Home"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= STATEMENT ================= */}
      <section className="py-10 text-center">
        <h3 className="font-semibold text-base md:text-lg">
          RELDA India was born to change this reality
        </h3>
      </section>
      <div className="border-y border-color-productCardBorder">

      {/* ================= CHALLENGES ================= */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-14 mt-6">
        <p className="text-center text-sm mb-8">
          We recognized the challenges faced by first-time buyers in rural India:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Quality products were too expensive",
            "Affordable options were unreliable",
            "Modern solutions rarely reached beyond the cities",
          ].map((text, index) => (
            <div
              key={index}
              className="bg-white border-l-2 border-brand-primary rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.04)] p-6 flex items-start gap-4"
            >
              <span className="w-[3px] h-full rounded-xl"></span>
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>
   </div>

      {/* ================= MISSION ================= */}
<section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
  <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.04)] p-8 md:p-10 text-center">
    <h2 className="text-lg md:text-xl font-medium mb-4">
      Our mission is simple
    </h2>

    <p className="text-sm leading-relaxed">
      To make reliable, modern, and affordable home and kitchen products accessible to every household in India. Proudly home-grown, we stand for quality, trust, and inclusivity—helping every family upgrade their homes without compromise.
    </p>
  </div>
</section>


    </div>
  );
};

export default AboutUs;
