// import { useNavigate } from "react-router-dom";
// import howToShop from "../assest/topSell/HowToShop.png";

// const HowToShopBanner = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="container mx-auto px-4 pb-6 my-12">
//       <div
//         className="
//           flex flex-col md:flex-row
//           items-center
//           gap-6 md:gap-10
//           bg-white
//           rounded-2xl
//         "
//       >
//         {/* LEFT IMAGE SECTION */}
//         <div
//           className="
//             w-full md:w-1/2
//             bg-red-600
//             rounded-xl
//             overflow-hidden
//             flex justify-center items-center
//           "
//         >
//           <img
//             src={howToShop}   // 👈 replace with your image path
//             alt="How to shop on RELDA India"
//             className="
//               w-full
//               h-[220px]  md:h-full
//               object-cover
//             "
//           />
//         </div>

//         {/* RIGHT CONTENT SECTION */}
//         <div className="w-full md:w-1/2">
//           <h2 className="text-xl sm:text-2xl font-semibold text-black mb-3">
//             HOW TO SHOP ON RELDAINDIA.COM?
//           </h2>

//           <p className="text-sm sm:text-base text-gray-600 mb-5 leading-relaxed">
//             Click the button below to get step-by-step guidance for shopping on
//             RELDAINDIA.COM, making your experience smooth, simple and quick.
//           </p>

//           <button
//             onClick={() => navigate("/how-to-shop")}
//             className="
//               bg-red-600
//               hover:bg-red-700
//               text-white
//               px-6 py-2.5
//               rounded-md
//               text-sm font-medium
//             "
//           >
//             Watch Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HowToShopBanner;

import { useRef, useState } from "react";
import howToShopVideo from "../assest/Howtoshop.mp4";
import howToShopPoster from "../assest/HowToShop.jpg";

const HowToShopBanner = () => {
  const videoRef = useRef(null);

  const [videoError, setVideoError] = useState(false);

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.setAttribute("controls", true);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-8 pb-4 md:pb-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">

                {/* LEFT : VIDEO */}
        <div className="w-full md:w-1/2 bg-brand-primary rounded-xl overflow-hidden">
          
          {!videoError ? (
          <video
            src={howToShopVideo}
            poster={howToShopPoster}
            // autoPlay
            // muted
            loop
            playsInline
            // controls={false}
            className="w-full h-[220px] sm:h-[260px] md:h-[300px] xl:h-[400px] object-fill"
            onError={() => setVideoError(true)}
          />
          ) : (
                    <img
          src={howToShopPoster}     // fallback image
          alt="How to Shop on ReldIndia"
          className="w-full h-[220px] sm:h-[260px] md:h-[300px] xl:h-[400px] object-fill"
          loading="lazy"
        />
      )}
        </div>

        {/* RIGHT : CONTENT */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            HOW TO SHOP ON RELDAINDIA.COM?
          </h2>

          <p className="text-sm sm:text-base text-brand-textMuted mb-5 leading-relaxed">
            Click the button below to get step-by-step guidance for shopping on
            RELDAINDIA.COM, making your experience smooth, simple and quick.
          </p>

          <button
            onClick={playVideo}
            className="bg-brand-primary hover:bg-brand-primaryHover text-white px-6 py-2.5 rounded-md text-sm font-medium"
          >
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToShopBanner;
