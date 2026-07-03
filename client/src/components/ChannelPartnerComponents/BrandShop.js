import React from "react";
import { motion } from "framer-motion";
import BrandShopImage from "../../assest/ChannelPartner/brandShop.png.png";
import ReldaIcon from "../../assest/ChannelPartner/reldaIcon.png";

const BrandShop = () => {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14"
        >
          <div className="order-1 lg:order-1 lg:pl-10 xl:pl-14">
            <h2 className="text-[22px] font-semibold text-black sm:text-[26px]">
              Brand Shop
            </h2>

            <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
              <div>
                <p className="text-[30px] font-semibold leading-none text-[#E60000] sm:text-[40px] lg:text-[46px]">
                  15 to 20 Lakhs
                </p>
                <p className="mt-1 text-sm text-[#9d9d9d] sm:text-base">Investment</p>
              </div>

              <div>
                <p className="text-[30px] font-semibold leading-none text-[#E60000] sm:text-[40px] lg:text-[46px]">
                  150 to 250 sq ft
                </p>
                <p className="mt-1 text-sm text-[#9d9d9d] sm:text-base">Space Required</p>
              </div>

              <div>
                <p className="text-[30px] font-semibold leading-none text-[#E60000] sm:text-[40px] lg:text-[46px]">
                  24% Per Annum
                </p>
                <p className="mt-1 text-sm text-[#9d9d9d] sm:text-base">ROI</p>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-2">
            <div className="relative">
              <motion.img
                src={BrandShopImage}
                alt="Brand Shop"
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-[270px] w-full rounded-[22px] object-cover object-center grayscale sm:h-[340px] lg:h-[360px]"
              />

              <div className="absolute -top-4 right-4 sm:-top-5 sm:right-5">
                <img
                  src={ReldaIcon}
                  alt="Relda icon"
                  className="h-14 w-14 object-contain sm:h-16 sm:w-16 lg:h-[74px] lg:w-[74px]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandShop;
