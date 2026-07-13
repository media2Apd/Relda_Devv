import React from "react";
import { motion } from "framer-motion";
import BrandShopImage from "../../assest/ChannelPartner/brandShop.webp";
import ReldaIcon from "../../assest/ChannelPartner/reldaIcon.png";

const BrandShop = () => {
  return (
    <section className="bg-white py-16 overflow-hidden">
      {/* Same container as Header */}
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] xl:grid-cols-[470px_minmax(0,1fr)] gap-10 xl:gap-20 items-center"
        >
          {/* Left Content */}
          <div>
            <h2
              className="
                text-[#000000]
                font-bold
                leading-tight
                text-left
                text-2xl
                sm:text-2xl
                md:text-3xl
                lg:text-4xl
              "
            >
              Brand Shop
            </h2>

            <div className="mt-8 sm:mt-10 space-y-8 ">
              {/* Investment */}
              <div>
                <h3
                  className="
                    text-[#E60000]
                    font-bold
                    leading-none
                    text-3xl
                    sm:text-3xl
                    md:text-4xl
                    lg:text-5xl
                  "
                >
                  15 to 20 Lakhs
                </h3>

                <p className="mt-2 text-[#86868B] text-base sm:text-lg lg:text-xl">
                  Investment
                </p>
              </div>

              {/* Space */}
              <div>
                <h3
                  className="
                    text-[#E60000]
                    font-bold
                    leading-none
                    text-3xl
                    sm:text-3xl
                    md:text-4xl
                    lg:text-5xl
                  "
                >
                  150 to 250 sq ft
                </h3>

                <p className="mt-2 text-[#86868B] text-base sm:text-lg lg:text-xl">
                  Space Required
                </p>
              </div>

              {/* ROI */}
              <div>
                <h3
                  className="
                    text-[#E60000]
                    font-bold
                    leading-none
                    text-3xl
                    sm:text-3xl
                    md:text-4xl
                    lg:text-5xl
                  "
                >
                  24% Per Annum
                </h3>

                <p className="mt-2 text-[#86868B] text-base sm:text-lg lg:text-xl">
                  ROI
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img
              src={BrandShopImage}
              alt="Brand Shop"
              className="
                w-full
                rounded-2xl
                object-cover
                h-[250px]
                sm:h-[330px]
                md:h-[390px]
                lg:h-[440px]
                xl:h-[490px]
              "
            />

            {/* Relda Logo */}
            <img
              src={ReldaIcon}
              alt="Relda"
              className="
                absolute
                -top-8
                right-4
                w-12
                sm:w-14
                md:w-16
                lg:w-[72px]
                xl:w-[80px]
              "
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandShop;