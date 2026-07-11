import React from "react";
import { motion } from "framer-motion";

const ChannelPartnerHero = () => {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
     <div className="mx-auto max-w-[1500px] pl-4 pr-4 sm:pl-6 sm:pr-6 md:pl-8 md:pr-8 lg:pl-10 lg:pr-10 xl:pl-12 xl:pr-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="
              max-w-[1020px]
              text-left
              font-extrabold
              text-black
              leading-[1.08]
              tracking-[-0.02em]
              text-[38px]
              sm:text-[48px]
              md:text-[58px]
              lg:text-[72px]
            "
          >
            Start your business{" "}
            entrepreneurial journey with a{" "}
            <span className="text-[#E60000]">
              RELDA Brand Shop and My Store.
            </span>
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="
              mt-8
              ml-8
              max-w-[760px]
              text-left
              font-light
              text-[#9A9A9A]
              leading-[1.4]
              text-[18px]
              sm:text-[22px]
              md:text-[26px]
              lg:text-[34px]

            "
          >
            
            A proven model with a strong brand, in-demand{" "}
            products, and full marketing support.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <button
              className="
                rounded-md
                bg-[#E60000]
                px-10
                py-3
                text-lg
                font-medium
                text-white
                transition-all
                duration-300
                hover:bg-[#c40000]
              "
            >
              Apply now
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChannelPartnerHero;