import React from "react";
import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

const ChannelPartnerHero = () => {
  // const Navigate = useNavigate();
  return (
    <section className="bg-[#f5f5f5] py-16">
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
              mx-auto
              text-center
              font-bold
              text-[#000000]
              !leading-[1.2]  {/* Changed from 1.08 to 1.3 for more space */}
              tracking-[-0.02em]
              text-3xl
              sm:text-3xl
              md:text-4xl
              lg:text-6xl
            "
          >
            Start your business <br />
            entrepreneurial journey with a <br className="hidden md:block"/>
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
              max-w-[800px]
              mx-auto
              text-center
              font-light
              text-[#86868B]
              leading-[1.4]
              text-[18px]
              sm:text-[22px]


            "
          >
            A proven model with a strong brand, in-demand products, and full
            marketing support.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={() => {
                document.getElementById("form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="rounded-md bg-[#E60000] px-10 py-3 text-lg font-regular text-white transition-all duration-300 hover:bg-[#c40000]"
            >
              Apply Now
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChannelPartnerHero;
