// import React, { useEffect, useState } from "react";
// import useBannerImages from "../hooks/useBannerImages";

// const BannerProduct = ({ type = "home" }) => {
//   const { banners, loading } = useBannerImages(type);
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     if (!banners.length) return;

//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % banners.length);
//     }, 4000);

//     return () => clearInterval(timer);
//   }, [banners]);

//   if (loading) {
//     return (
//       <div className="w-full h-[300px] animate-pulse" />
//     );
//   }

//   return (
//     <div className="relative w-full overflow-hidden">

//       {/* Slider */}
//       <div
//         className="flex transition-transform duration-700 ease-in-out"
//         style={{ transform: `translateX(-${current * 100}%)` }}
//       >
//         {banners.map((item, index) => (
//           <div key={item.id || index} className="w-full flex-shrink-0">
//             <img
//               src={item.imageUrl}
//               alt="banner"
//               className="
//                 w-full
//                 max-h-[520px]
//                 mx-auto
//               "
//             />
//             {/* <img
//               src={item.imageUrl}
//               alt="banner"
//               className="
//                 w-full
//                 h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px]
//                 object-cover md:object-contain
//                 mx-auto
//               "
//             /> */}
//           </div>
//         ))}
//       </div>

//       {/* Indicator line (inside image) */}
//       {/* {banners.length > 1 && (
//         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
//           {banners.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrent(index)}
//               className={`
//                 h-[3px] transition-all duration-500
//                 ${current === index ? "w-10 bg-[#e60000]" : "w-10 bg-white"}
//               `}
//             />
//           ))}
//         </div>
//       )} */}
//       {banners.length > 1 && (
//         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
//           {banners.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrent(index)}
//               className="relative w-10 h-[3px] bg-white overflow-hidden cursor-pointer"
//             >
//               {current === index && (
//                 <div
//                   key={current} // animation reset when slide changes
//                   className="
//                     absolute left-0 top-0
//                     h-full w-full
//                     bg-brand-primary
//                     origin-left
//                     animate-progress
//                   "
//                 />
//               )}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BannerProduct;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBannerImages from "../hooks/useBannerImages";

const BannerProduct = ({ type = "home-top" }) => {
  const { banners, loading } = useBannerImages(type);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [banners]);

  if (loading) {
    return <div className="w-full h-[300px] animate-pulse" />;
  }

  if (!banners.length) return null;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slider */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((item, index) => (
          <div
            key={item._id || index}
            className="w-full flex-shrink-0 cursor-pointer"
            onClick={() => item.link && navigate(item.link)}
          >
            <picture>
              {/* Mobile only - small screens */}
              <source
                media="(max-width: 640px)"
                srcSet={item.mobileImage}
              />
              {/* All other screens (tablet, desktop, large screens) */}
              <source
                media="(min-width: 641px)"
                srcSet={item.desktopImage}
              />
              <img
                src={item.desktopImage} // fallback
                alt={item.title || "banner"}
                className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[430px] xl:h-[580px] 2xl:h-[740px] object-cover"
                loading="lazy"
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="relative w-6 sm:w-7 md:w-8 h-[3px] bg-white/50 hover:bg-white/70 transition-colors overflow-hidden"
            >
              {current === index && (
                <div className="absolute left-0 top-0 h-full w-full bg-brand-primary animate-progress" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerProduct;
// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import useBannerImages from "../hooks/useBannerImages";
// import openingImg from "../assest/offer/Offer1.jpg";

// // 🔥 OPENING DATE
// const OPENING_DATE = new Date("2026-01-01T00:00:00");

// const BannerProduct = ({ type = "home-top" }) => {
//   const { banners, loading } = useBannerImages(type);
//   const [current, setCurrent] = useState(0);
//   const navigate = useNavigate();

//   // 🔥 CHECK OPENING DATE
//   const showOpeningBanner = new Date() < OPENING_DATE;

//   // 🔥 OPENING BANNER OBJECT
//   const openingBanner = {
//     _id: "opening-banner",
//     type: "opening",
//     desktopImage: openingImg,
//     mobileImage: openingImg,
//     openingDate: OPENING_DATE,
//   };

//   // 🔥 FINAL BANNERS ARRAY
//   const finalBanners = useMemo(() => {
//     if (showOpeningBanner) {
//       return [openingBanner, ...(banners || [])];
//     }
//     return banners || [];
//   }, [banners, showOpeningBanner]);

//   // 🔥 AUTO SLIDE
//   useEffect(() => {
//     if (!finalBanners.length) return;

//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % finalBanners.length);
//     }, 4000);

//     return () => clearInterval(timer);
//   }, [finalBanners.length]);

//   // 🔥 COUNTDOWN FUNCTION
//   const getTimeLeft = (date) => {
//     const diff = date - new Date();
//     if (diff <= 0) return null;

//     return {
//       days: Math.floor(diff / (1000 * 60 * 60 * 24)),
//       hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
//       minutes: Math.floor((diff / (1000 * 60)) % 60),
//       seconds: Math.floor((diff / 1000) % 60),
//     };
//   };

//   // 🔴 LOADING
//   if (loading) {
//     return <div className="w-full h-[300px] animate-pulse" />;
//   }

//   if (!finalBanners.length) return null;

//   return (
//     <div className="relative w-full overflow-hidden">
//       {/* SLIDER */}
//       <div
//         className="flex transition-transform duration-700 ease-in-out"
//         style={{ transform: `translateX(-${current * 100}%)` }}
//       >
//         {finalBanners.map((item, index) => {
//           const timeLeft =
//             item.type === "opening"
//               ? getTimeLeft(item.openingDate)
//               : null;

//           // 🔴 OPENING TIME OVER → REMOVE BANNER
//           if (item.type === "opening" && !timeLeft) return null;

//           return (
//             <div
//               key={item._id || index}
//               className="relative w-full flex-shrink-0 cursor-pointer"
//               onClick={() => item.link && navigate(item.link)}
//             >
//               <picture>
//                 <source
//                   media="(max-width: 768px)"
//                   srcSet={item.mobileImage}
//                 />
//                 <img
//                   src={item.desktopImage}
//                   alt={item.title || "banner"}
//                   className="w-full h-[200px] md:h-[350px] lg:h-[400px] xl:h-[550px] 2xl:h-[650px] object-fill"
//                 />
//               </picture>

//               {/* 🔥 COUNTDOWN OVERLAY (ONLY OPENING BANNER) */}
//               {item.type === "opening" && timeLeft && (
//                 <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
//                   <h2 className="text-2xl md:text-4xl font-bold mb-4">
//                     Opening In
//                   </h2>

//                   <div className="flex gap-3">
//                     {Object.entries(timeLeft).map(([label, value]) => (
//                       <div
//                         key={label}
//                         className="bg-black/70 px-4 py-3 rounded-lg text-center min-w-[70px]"
//                       >
//                         <div className="text-2xl font-bold">{value}</div>
//                         <div className="text-xs uppercase">{label}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* INDICATORS */}
//       {finalBanners.length > 1 && (
//         <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
//           {finalBanners.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrent(index)}
//               className="relative w-6 md:w-8 lg:w-10 h-[3px] bg-white overflow-hidden"
//             >
//               {current === index && (
//                 <div className="absolute inset-0 bg-brand-primary animate-progress" />
//               )}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BannerProduct;
