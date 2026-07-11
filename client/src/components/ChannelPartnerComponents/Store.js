import React from "react";
import { motion } from "framer-motion";
import StoreImage from "../../assest/ChannelPartner/store.webp";
import ReldaIcon from "../../assest/ChannelPartner/reldaIcon.png";

const Store = () => {
  return (
    <section className="bg-white pb-16 overflow-hidden">
      {/* Same container as Header */}
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-10 xl:gap-20 items-center"
        >
          {/* Left Image */}
          <div className="relative order-2 lg:order-1">
            <img
              src={StoreImage}
              alt="My Store"
              className="
                w-full
                rounded-[24px]
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
                -top-6
                right-5
                sm:right-6
                lg:right-8
                w-12
                sm:w-14
                md:w-16
                lg:w-[72px]
                xl:w-[80px]
              "
            />
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2 lg:pl-8 xl:pl-12">
            <h2
              className="
                text-[#000000]
                font-semibold
                leading-tight
                text-2xl
                sm:text-2xl
                md:text-3xl
                lg:text-4xl
              "
            >
              My Store
            </h2>

            <div className="mt-8 sm:mt-10 space-y-8 sm:space-y-10">
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
                  7 to 10 Lakhs
                </h3>

                <p className="mt-2 text-[#86868B] text-base sm:text-lg lg:text-xl">
                  Investment
                </p>
              </div>

              {/* Space Required */}
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
                  100 to 150 sq ft
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
        </motion.div>
      </div>
    </section>
  );
};

export default Store;