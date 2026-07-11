// import React from "react";
// import { motion } from "framer-motion";
// import Product1 from "../../assest/ChannelPartner/product1.Webp";
// import Product2 from "../../assest/ChannelPartner/product2.Webp";
// import Product3 from "../../assest/ChannelPartner/product3.Webp";
// import Product4 from "../../assest/ChannelPartner/product4.Webp";
// import Product5 from "../../assest/ChannelPartner/product5.Webp";

// const topProducts = [
//   { name: "Chimneys", image: Product1, layout: "labelTop" },
//   { name: "Hobs", image: Product2, layout: "imageTop" },
//   { name: "Mixer Grinders", image: Product3, layout: "labelTop" },
// ];

// const bottomProducts = [
//   { name: "Commercial Mixers", image: Product4, layout: "imageTop" },
//   { name: "LED TVs", image: Product5, layout: "imageTop" },
// ];

// const Product = () => {
//   return (
//     <section className="bg-white">
//       <div className="bg-[#E60000] px-4 pb-24 pt-10 sm:px-6 sm:pb-28 sm:pt-14 lg:px-12 lg:pb-32 lg:pt-16">
//         <div className="mx-auto max-w-7xl">
//           <motion.div
//             initial={{ opacity: 0, y: 24 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.25 }}
//             transition={{ duration: 0.65, ease: "easeOut" }}
//             className="mx-auto max-w-[1180px] text-center"
//           >
//             <h2 className="text-[32px] font-light leading-[1.18] tracking-[-0.04em] text-white sm:text-[44px] lg:text-[58px]">
//               A <span className="font-normal text-[#111111]">Product</span> for Every Home,
//               <br className="hidden sm:block" />
//               Institutions, Commercial Projects.
//             </h2>
//           </motion.div>
//         </div>
//       </div>

//       <div className="relative -mt-12 px-4 pb-12 sm:-mt-16 sm:px-6 sm:pb-16 lg:-mt-20 lg:px-12 lg:pb-20">
//         <div className="mx-auto max-w-7xl">
//           <div className="mx-auto max-w-[1180px]">
//             <div className="grid gap-3 md:grid-cols-3">
//               {topProducts.map((item, index) => (
//                 <ProductCard
//                   key={item.name}
//                   name={item.name}
//                   image={item.image}
//                   layout={item.layout}
//                   topRow
//                   compact={index === 1}
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="mt-4 flex justify-center sm:mt-5">
//             <div className="grid w-full max-w-[780px] gap-3 md:grid-cols-2">
//               {bottomProducts.map((item) => (
//                 <ProductCard
//                   key={item.name}
//                   name={item.name}
//                   image={item.image}
//                   layout={item.layout}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const ProductCard = ({ name, image, layout, compact = false, topRow = false }) => {
//   const imageHeight = topRow
//     ? compact
//       ? "h-[150px] sm:h-[170px] lg:h-[185px]"
//       : "h-[170px] sm:h-[190px] lg:h-[210px]"
//     : "h-[180px] sm:h-[200px] lg:h-[220px]";

//   return (
//     <motion.article
//       whileHover={{ y: -4 }}
//       transition={{ duration: 0.2 }}
//       className="overflow-hidden rounded-md bg-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
//     >
//       {layout === "labelTop" ? (
//         <>
//           <div className="flex items-center gap-3 px-3 py-3 sm:px-4">
//             <div className="h-px flex-1 bg-[#8b8b8b]" />
//             <p className="whitespace-nowrap text-[12px] font-medium text-[#161616] sm:text-sm">
//               {name}
//             </p>
//             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E60000] text-sm font-semibold text-white sm:h-9 sm:w-9">
//               &#8599;
//             </div>
//           </div>
//           <div className={`${imageHeight} border-[6px] border-black bg-white`}>
//             <img src={image} alt={name} className="h-full w-full object-contain object-center p-2" />
//           </div>
//         </>
//       ) : (
//         <>
//           <div className={`${imageHeight} border-[6px] border-black bg-white`}>
//             <img src={image} alt={name} className="h-full w-full object-contain object-center p-2" />
//           </div>
//           <div className="flex items-center gap-3 px-3 py-3 sm:px-4">
//             <div className="h-px flex-1 bg-[#8b8b8b]" />
//             <p className="whitespace-nowrap text-[12px] font-medium text-[#161616] sm:text-sm">
//               {name}
//             </p>
//             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E60000] text-sm font-semibold text-white sm:h-9 sm:w-9">
//               &#8599;
//             </div>
//           </div>
//         </>
//       )}
//     </motion.article>
//   );
// };

// export default Product;





import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Product1 from "../../assest/ChannelPartner/product1.webp";
import Product2 from "../../assest/ChannelPartner/product2.webp";
import Product3 from "../../assest/ChannelPartner/product3.webp";
import Product4 from "../../assest/ChannelPartner/product4.webp";
import Product5 from "../../assest/ChannelPartner/product5.webp";

const products = [
  {
    title: "Chimneys",
    image: Product1,
    imageFirst: false,
  },
  {
    title: "Hobs",
    image: Product2,
    imageFirst: true,
  },
  {
    title: "Mixer Grinders",
    image: Product3,
    imageFirst: false,
  },
  {
    title: "Commercial Mixers",
    image: Product4,
    imageFirst: false,
  },
  {
    title: "LED TVs",
    image: Product5,
    imageFirst: false,
  },
];

const CardHeader = ({ title }) => (
  <div className="px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
    {/* Line + Title row */}
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <span className="h-px bg-black flex-1" />
      <p className="text-xs xs:text-sm lg:text-base text-black whitespace-nowrap">
        {title}
      </p>
    </div>

    {/* Arrow row - below, right aligned */}
    <div className="mt-2 sm:mt-3 flex justify-end">
      <button
        type="button"
        aria-label={`View ${title}`}
        className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-[#E60000] flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:bg-black cursor-pointer"
      >
        <ArrowUpRight size={16} className="text-white sm:hidden" />
        <ArrowUpRight size={18} className="text-white hidden sm:block" />
      </button>
    </div>
  </div>
);

/* Square aspect-ratio box instead of a fixed short height - this
   lets portrait-oriented product photos use much more of the card's
   width instead of shrinking down and leaving side gaps. */
const CardImage = ({ image, title }) => (
  <div className="w-full px-2 pb-2 sm:px-4 sm:pb-4 md:px-5 md:pb-5">
    <div className="w-full aspect-square sm:aspect-[4/3] flex items-center justify-center overflow-hidden bg-white">
      <img
        src={image}
        alt={title}
        className="max-w-full max-h-full w-auto h-auto object-contain"
      />
    </div>
  </div>
);

const ProductCard = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg shadow-md overflow-hidden w-full"
    >
      {item.imageFirst ? (
        <>
          <CardImage image={item.image} title={item.title} />
          <CardHeader title={item.title} />
        </>
      ) : (
        <>
          <CardHeader title={item.title} />
          <CardImage image={item.image} title={item.title} />
        </>
      )}
    </motion.div>
  );
};

const Product = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Red background - top half only */}
      <div className="absolute top-0 left-0 w-full h-[280px] xs:h-[320px] sm:h-[360px] md:h-[400px] lg:h-[440px] bg-[#E60000] z-0" />

      <div className="relative z-10 max-w-[1536px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 pt-14 pb-10 sm:pt-16 sm:pb-14 md:pt-[72px] md:pb-16 lg:pt-20 lg:pb-20">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-white font-light leading-tight
          text-[22px]
          xs:text-[26px]
          sm:text-[34px]
          md:text-[44px]
          lg:text-[56px]
          xl:text-[68px]"
        >
          A <span className="font-bold text-black">Product</span> for Every Home,
          <br className="hidden sm:block" />
          Institutions, Commercial Projects.
        </motion.h2>

        {/* First Row */}
        <div className="mt-6 sm:mt-8 md:mt-9 lg:mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          <ProductCard item={products[0]} />
          <ProductCard item={products[1]} />
          <ProductCard item={products[2]} />
        </div>

        {/* Second Row - centered */}
        <div className="mt-4 sm:mt-5 lg:mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 sm:max-w-[calc(66.666%+20px)] sm:mx-auto lg:max-w-[calc(66.666%+24px)] lg:gap-6">
          <ProductCard item={products[3]} />
          <ProductCard item={products[4]} />
        </div>
      </div>
    </section>
  );
};

export default Product;