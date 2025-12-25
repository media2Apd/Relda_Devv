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
              <source
                media="(max-width: 768px)"
                srcSet={item.mobileImage}
              />
              <img
                src={item.desktopImage}
                alt={item.title || "banner"}
                className="w-full max-h-[520px] mx-auto"
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="relative w-10 h-[3px] bg-white overflow-hidden cursor-pointer"
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
