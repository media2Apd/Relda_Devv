import React from "react";
import { motion } from "framer-motion";
import Product1 from "../../assest/ChannelPartner/Product1.png";
import Product2 from "../../assest/ChannelPartner/Product2.png";
import Product3 from "../../assest/ChannelPartner/Product3.png";
import Product4 from "../../assest/ChannelPartner/Product4.png";
import Product5 from "../../assest/ChannelPartner/Product5.png";

const topProducts = [
  { name: "Chimneys", image: Product1, layout: "labelTop" },
  { name: "Hobs", image: Product2, layout: "imageTop" },
  { name: "Mixer Grinders", image: Product3, layout: "labelTop" },
];

const bottomProducts = [
  { name: "Commercial Mixers", image: Product4, layout: "imageTop" },
  { name: "LED TVs", image: Product5, layout: "imageTop" },
];

const Product = () => {
  return (
    <section className="bg-white">
      <div className="bg-[#E60000] px-4 pb-24 pt-10 sm:px-6 sm:pb-28 sm:pt-14 lg:px-12 lg:pb-32 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mx-auto max-w-[1180px] text-center"
          >
            <h2 className="text-[32px] font-light leading-[1.18] tracking-[-0.04em] text-white sm:text-[44px] lg:text-[58px]">
              A <span className="font-normal text-[#111111]">Product</span> for Every Home,
              <br className="hidden sm:block" />
              Institutions, Commercial Projects.
            </h2>
          </motion.div>
        </div>
      </div>

      <div className="relative -mt-12 px-4 pb-12 sm:-mt-16 sm:px-6 sm:pb-16 lg:-mt-20 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-3 md:grid-cols-3">
              {topProducts.map((item, index) => (
                <ProductCard
                  key={item.name}
                  name={item.name}
                  image={item.image}
                  layout={item.layout}
                  topRow
                  compact={index === 1}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-center sm:mt-5">
            <div className="grid w-full max-w-[780px] gap-3 md:grid-cols-2">
              {bottomProducts.map((item) => (
                <ProductCard
                  key={item.name}
                  name={item.name}
                  image={item.image}
                  layout={item.layout}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ name, image, layout, compact = false, topRow = false }) => {
  const imageHeight = topRow
    ? compact
      ? "h-[150px] sm:h-[170px] lg:h-[185px]"
      : "h-[170px] sm:h-[190px] lg:h-[210px]"
    : "h-[180px] sm:h-[200px] lg:h-[220px]";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-md bg-white shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
    >
      {layout === "labelTop" ? (
        <>
          <div className="flex items-center gap-3 px-3 py-3 sm:px-4">
            <div className="h-px flex-1 bg-[#8b8b8b]" />
            <p className="whitespace-nowrap text-[12px] font-medium text-[#161616] sm:text-sm">
              {name}
            </p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E60000] text-sm font-semibold text-white sm:h-9 sm:w-9">
              &#8599;
            </div>
          </div>
          <div className={`${imageHeight} border-[6px] border-black bg-white`}>
            <img src={image} alt={name} className="h-full w-full object-contain object-center p-2" />
          </div>
        </>
      ) : (
        <>
          <div className={`${imageHeight} border-[6px] border-black bg-white`}>
            <img src={image} alt={name} className="h-full w-full object-contain object-center p-2" />
          </div>
          <div className="flex items-center gap-3 px-3 py-3 sm:px-4">
            <div className="h-px flex-1 bg-[#8b8b8b]" />
            <p className="whitespace-nowrap text-[12px] font-medium text-[#161616] sm:text-sm">
              {name}
            </p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E60000] text-sm font-semibold text-white sm:h-9 sm:w-9">
              &#8599;
            </div>
          </div>
        </>
      )}
    </motion.article>
  );
};

export default Product;
