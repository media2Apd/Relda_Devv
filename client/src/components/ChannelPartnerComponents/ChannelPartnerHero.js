import React from "react";
import { motion } from "framer-motion";

const ChannelPartnerHero = () => {
  return (
    <section className="bg-[#efefef] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-14">
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
              max-w-[1050px]
              text-center lg:text-left
              font-bold
              leading-[1.08]
              tracking-[-0.04em]
              text-black
              text-[36px]
              sm:text-[52px]
              md:text-[62px]
              lg:text-[72px]
            "
          >
            Start your business
            <br />
            entrepreneurial journey with a
            <br />
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
              mx-auto
              lg:mx-0
              mt-10
              max-w-[930px]
              text-center
              text-[#8F8F8F]
              font-light
              leading-[1.18]
              text-[22px]
              sm:text-[30px]
              md:text-[38px]
              lg:text-[42px]
            "
          >
            A proven model with a strong brand, in-demand
            <br />
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