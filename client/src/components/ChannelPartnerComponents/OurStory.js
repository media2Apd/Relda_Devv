import React from "react";
import { motion } from "framer-motion";
import ReldaIcon from "../../assest/ChannelPartner/reldaIcon.png";

const OurStory = () => {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-0 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative mx-auto max-w-5xl pb-20 text-center sm:pb-24 lg:pb-28"
        >
          <div className="pointer-events-none absolute left-1/2 top-[56%] z-0 -translate-x-1/2 -translate-y-1/2 opacity-10 sm:top-[54%]">
            <img
              src={ReldaIcon}
              alt=""
              aria-hidden="true"
              className="h-[260px] w-[260px] object-contain sm:h-[340px] sm:w-[340px] lg:h-[420px] lg:w-[420px]"
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-[38px] font-light leading-none tracking-[-0.05em] text-black sm:text-[54px] lg:text-[68px]">
              Our <span className="text-[#E60000]">Story</span>
            </h2>

            <div className="mx-auto mt-8 max-w-4xl space-y-6 sm:mt-10 sm:space-y-7 lg:mt-12">
              <p className="text-[16px] font-normal leading-snug text-[#7f7f7f] sm:text-[18px] lg:text-[20px]">
                India is a land of aspirations, yet millions of families struggle to access modern, reliable home solutions.
                RELDA India was born to change this.
              </p>

              <p className="text-[16px] font-normal leading-snug text-[#7f7f7f] sm:text-[18px] lg:text-[20px]">
                We saw first-time buyers forced to compromise quality was expensive, affordability was unreliable, and modern products
                rarely reached beyond cities. Guided by <span className="font-semibold text-black">Affordable for Everyone</span> and Proudly Made in India,
                we create products that are reliable, accessible, and designed for real Indian homes.
              </p>

              <p className="text-[16px] font-normal leading-snug text-[#7f7f7f] sm:text-[18px] lg:text-[20px]">
                Today, RELDA India is growing with partners who share our vision - Channel Partners bringing modern living to communities
                across India.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* <div className="h-5 w-full bg-[#E60000] sm:h-6" /> */}
    </section>
  );
};

export default OurStory;
