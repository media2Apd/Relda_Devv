import React from "react";
import { motion } from "framer-motion";
import StoreImage from "../../assest/ChannelPartner/store.webp";
import ReldaIcon from "../../assest/ChannelPartner/reldaIcon.png";

const Store = () => {
  return (
    <section className="bg-white px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-10"
        >
          {/* Left Image */}
          <div className="order-1 lg:order-1">
            <motion.img
              src={StoreImage}
              alt="My Store"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-[260px] w-full rounded-[18px] object-cover object-center  sm:h-[340px] lg:h-[360px]"
            />
          </div>

          {/* Right Content */}
          <div className="order-2 lg:order-2">
            <h2 className="text-[24px] font-semibold text-black sm:text-[28px]">
              My Store
            </h2>

            <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
              <div>
                <p className="text-[30px] font-semibold leading-none text-[#E60000] sm:text-[40px] lg:text-[48px]">
                  7 to 10 Lakhs
                </p>
                <p className="mt-1 text-sm text-[#9d9d9d] sm:text-base">
                  Investment
                </p>
              </div>

              <div>
                <p className="text-[30px] font-semibold leading-none text-[#E60000] sm:text-[40px] lg:text-[48px]">
                  100 to 150 sq ft
                </p>
                <p className="mt-1 text-sm text-[#9d9d9d] sm:text-base">
                  Space Required
                </p>
              </div>

              <div>
                <p className="text-[30px] font-semibold leading-none text-[#E60000] sm:text-[40px] lg:text-[48px]">
                  24% Per Annum
                </p>
                <p className="mt-1 text-sm text-[#9d9d9d] sm:text-base">
                  ROI
                </p>
              </div>
            </div>
          </div>

          {/* RELDA Icon */}
          <div
            className="
              pointer-events-none absolute z-20

              right-3 top-3

              sm:left-[62%]
              sm:right-auto
              sm:top-0
              sm:-translate-x-1/2
              sm:-translate-y-1/2

              md:left-auto
              md:right-10
              md:top-8
              md:translate-x-0
              md:translate-y-0

              lg:left-[44%]
              lg:right-auto
              lg:top-0
              lg:-translate-x-1/2
              lg:-translate-y-1/2
            "
          >
            <img
              src={ReldaIcon}
              alt="Relda Icon"
              className="h-14 w-14 object-contain sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Store;
