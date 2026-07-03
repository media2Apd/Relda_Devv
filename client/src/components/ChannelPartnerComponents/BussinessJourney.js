import React from "react";
import { motion } from "framer-motion";

const supportItems = [
  "Marketing support to build strong brand visibility.",
  "Online and offline marketing for a wider reach.",
  "Sales team support to drive better conversions.",
  "Complete shop branding. (min 3years)",
];

const BussinessJourney = () => {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16"
        >
          <div className="lg:pl-10 xl:pl-14">
            <h2 className="max-w-[260px] text-[34px] font-light leading-[1.02] tracking-[-0.06em] text-black sm:text-[46px] lg:text-[60px]">
              Supporting
              <br />
              Your
              <br />
              <span className="font-normal text-[#E60000]">Business</span>
              <br />
              Journey
            </h2>
          </div>

          <div className="pt-2 sm:pt-4">
            <ul className="space-y-4 sm:space-y-5 lg:pt-2">
              {supportItems.map((item) => (
                <li key={item} className="flex items-start gap-3 sm:gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E60000] text-[18px] leading-none text-white sm:h-8 sm:w-8">
                    *
                  </span>
                  <p className="text-[16px] font-normal leading-snug text-[#2b2b2b] sm:text-[18px] lg:text-[19px]">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BussinessJourney;
