// import React from "react";

// const NewsletterCTA = () => {
//   return (
//     <section className="w-full px-4 md:px-8 py-12">
//       <div
//         className="relative container mx-auto overflow-hidden rounded-2xl 
//                    bg-[#E60000] 
//                    px-6 py-14 md:py-20 md:px-16"
//       >
//         {/* ================= TOP LEFT WAVES (FIGMA STYLE) ================= */}
//         <svg
//           className="absolute -top-4 -left-6 w-[420px] md:w-[520px] opacity-25"
//           viewBox="0 0 600 260"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           {[...Array(14)].map((_, i) => (
//             <path
//               key={i}
//               d={`
//                 M0 ${20 + i * 14}
//                 C 120 ${10 + i * 14},
//                   240 ${30 + i * 14},
//                   360 ${20 + i * 14},
//                   480 ${30 + i * 14},
//                   600 ${20 + i * 14}
//               `}
//               stroke="white"
//               strokeWidth="1"
//               fill="none"
//             />
//           ))}
//         </svg>

//         {/* ================= BOTTOM RIGHT WAVES (FIGMA STYLE) ================= */}
//         <svg
//           className="absolute -bottom-6 -right-8 w-[420px] md:w-[520px] opacity-25"
//           viewBox="0 0 600 260"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           {[...Array(14)].map((_, i) => (
//             <path
//               key={i}
//               d={`
//                 M0 ${20 + i * 14}
//                 C 120 ${30 + i * 14},
//                   240 ${10 + i * 14},
//                   360 ${30 + i * 14},
//                   480 ${20 + i * 14},
//                   600 ${30 + i * 14}
//               `}
//               stroke="white"
//               strokeWidth="1"
//               fill="none"
//             />
//           ))}
//         </svg>

//         {/* ================= CONTENT ================= */}
//         <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
//           <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-6">
//             Get Expert Appliance Tips
//             <br />
//             Delivered Weekly
//           </h2>

//           {/* FORM */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
//             <input
//               type="email"
//               placeholder="Your Email"
//               className="w-full sm:w-[280px] md:w-[340px] 
//                          h-10 px-4 rounded-lg 
//                          text-base text-[#5A7184] 
//                          focus:outline-none"
//             />
//             <button
//               className="h-10 px-7 rounded-lg 
//                          border border-white 
//                          text-white text-sm font-semibold 
//                          hover:bg-white hover:text-[#E60000] 
//                          transition"
//             >
//               Get started
//             </button>
//           </div>

//           <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-xl mx-auto">
//             Well-researched articles, buying guides, and appliance care tips—
//             written by industry experts to help you make smarter decisions.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsletterCTA;


// import React from "react";
// import waves from "../../assest/waves.png";

// const NewsletterCTA = () => {
//   return (
//     <section className="w-full px-4 md:px-8 py-12">
//       <div
//         className="relative max-w-7xl mx-auto overflow-hidden rounded-2xl 
//                    bg-[#E60000] 
//                    px-6 py-14 md:py-20 md:px-16"
//       >
//         {/* ================= TOP LEFT WAVES (CROPPED) ================= */}
//         <img
//           src={waves}
//           alt=""
//           className="
//             absolute 
//             -top-24 -left-32
//             w-[700px] md:w-[900px]
//             opacity-30
//             pointer-events-none
//           "
//         />

//         {/* ================= BOTTOM RIGHT WAVES (CROPPED + FLIPPED) ================= */}
//         <img
//           src={waves}
//           alt=""
//           className="
//             absolute 
//             -bottom-32 -right-40
//             w-[700px] md:w-[900px]
//             opacity-30
//             rotate-180
//             pointer-events-none
//           "
//         />

//         {/* ================= CONTENT ================= */}
//         <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
//           <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-6">
//             Get Expert Appliance Tips
//             <br />
//             Delivered Weekly
//           </h2>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
//             <input
//               type="email"
//               placeholder="Your Email"
//               className="
//                 w-full sm:w-[280px] md:w-[340px] 
//                 h-10 px-4 rounded-lg 
//                 text-base text-[#5A7184] 
//                 focus:outline-none
//               "
//             />
//             <button
//               className="
//                 h-10 px-7 rounded-lg 
//                 border border-white 
//                 text-white text-sm font-semibold 
//                 hover:bg-white hover:text-[#E60000] 
//                 transition
//               "
//             >
//               Get started
//             </button>
//           </div>

//           <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-xl mx-auto">
//             Well-researched articles, buying guides, and appliance care tips—
//             written by industry experts to help you make smarter decisions.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsletterCTA;


// import React from "react";
// import WaveSVG from "./WaveSVG";

// const NewsletterCTA = () => {
//   return (
//     <section className="w-full px-4 md:px-8 py-12">
//       <div
//         className="relative max-w-7xl mx-auto overflow-hidden rounded-2xl 
//                    bg-[#E60000] 
//                    px-6 py-14 md:py-20 md:px-16"
//       >
//         {/* ================= TOP LEFT WAVES ================= */}
//         <WaveSVG
//           className="
//             absolute 
//             -top-20 -left-48 
//             w-[700px] 
//             opacity-30
//             pointer-events-none
//           "
//         />

//         {/* ================= BOTTOM RIGHT WAVES (FLIPPED) ================= */}
//         <WaveSVG
//           className="
//             absolute 
//             -bottom-20 -right-56 
//             w-[700px]
//             opacity-30
//             rotate-180
//             pointer-events-none
//           "
//         />

//         {/* ================= CONTENT ================= */}
//         <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
//           <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-6">
//             Get Expert Appliance Tips
//             <br />
//             Delivered Weekly
//           </h2>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
//             <input
//               type="email"
//               placeholder="Your Email"
//               className="
//                 w-full sm:w-[280px] md:w-[340px] 
//                 h-10 px-4 rounded-lg 
//                 text-base text-[#5A7184] 
//                 focus:outline-none
//               "
//             />
//             <button
//               className="
//                 h-10 px-7 rounded-lg 
//                 border border-white 
//                 text-white text-sm font-semibold 
//                 hover:bg-white hover:text-[#E60000] 
//                 transition
//               "
//             >
//               Get started
//             </button>
//           </div>

//           <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-xl mx-auto">
//             Well-researched articles, buying guides, and appliance care tips—
//             written by industry experts to help you make smarter decisions.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewsletterCTA;

import waveImg from "../../assest/wave.png";

const NewsletterCTA = () => {
  return (
    <section className="w-full px-4 md:px-8 py-12">
      <div
        className="
          relative max-w-7xl mx-auto overflow-hidden rounded-2xl
          bg-[#E60000]
          px-6 py-14 md:py-20 md:px-16
        "
      >
        {/* 🔴 TOP LEFT WAVE */}
        <img
          src={waveImg}
          alt=""
          className="
            absolute
           -top-28 md:-top-24 lg:-top-16 -left-36 md:-left-28 lg:left-0
            w-[300px] md:w-[360px]
            pointer-events-none
          "
        />

        {/* 🔴 BOTTOM RIGHT WAVE (FLIPPED) */}
        <img
          src={waveImg}
          alt=""
          className="
            absolute
           -bottom-32 md:-bottom-24 lg:-bottom-16 -right-52 md:-right-32 lg:right-0
            w-[360px]
            pointer-events-none
            scale-x-[-1]
          "
        />

        {/* CONTENT */}
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-6">
            Get Expert Appliance Tips
            <br />
            Delivered Weekly
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <input
              type="email"
              placeholder="Your Email"
              className="
                w-full sm:w-[280px] md:w-[340px]
                h-10 px-4 rounded-lg
                text-base text-[#5A7184]
                focus:outline-none
              "
            />
            <button
              className="
                h-10 px-7 rounded-lg
                border border-white
                text-white text-sm font-semibold
                hover:bg-white hover:text-[#E60000]
                transition
              "
            >
              Get started
            </button>
          </div>

          <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-xl mx-auto">
            Well-researched articles, buying guides, and appliance care tips—
            written by industry experts to help you make smarter decisions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;