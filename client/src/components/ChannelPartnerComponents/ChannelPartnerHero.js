import React from "react";
import { motion } from "framer-motion";

const ChannelPartnerHero = () => {
  return (
    <section className="relative overflow-hidden bg-[#efefef] px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full px-2 py-4 sm:px-6 sm:py-10 md:px-10 lg:px-16"
        >
          <div className="mx-auto max-w-5xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              // Adjusted text sizes: smaller on mobile to prevent overflow
              className="mx-auto max-w-5xl text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-black sm:text-[46px] md:text-[56px] lg:text-[64px]"
            >
              Start your business entrepreneurial journey with a
              <br className="hidden sm:block" />
              <span className="mt-2 block text-[#E60000] sm:mt-0 sm:inline">
                RELDA Brand Shop and My Store.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              // Adjusted text sizes and leading for better mobile readability
              className="mx-auto mt-4 max-w-3xl text-[16px] font-normal leading-relaxed text-[#9b9b9b] sm:mt-6 sm:text-[24px] md:text-[28px] lg:text-[32px]"
            >
              A proven model with a strong brand, in-demand products, and full marketing support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-8 flex justify-center sm:mt-10"
            >
              <button
                type="button"
                className="rounded-md bg-[#E60000] px-8 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#cc0000] focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:ring-offset-2 sm:px-10 sm:py-4 sm:text-lg"
              >
                Apply now
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChannelPartnerHero;