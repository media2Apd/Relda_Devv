import React from "react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Growing Network",
    description:
      "Join the RELDA India channel partner network and expand modern home solutions in your community.",
  },
  {
    title: "Fast Returns",
    description: "24% ROI per annum",
  },
  {
    title: "Market Potential",
    description:
      "India has a 63.3% rural geographical area and RELDA India is a market fit Product.",
  },
];

const WhyJoin = () => {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14"
        >
          <div className="lg:pl-12 xl:pl-16">
            <h2 className="max-w-none text-[34px] font-light leading-[1.02] tracking-[-0.05em] text-black sm:text-[46px] lg:text-[60px]">
              <span className="text-[#E60000]">Why Join</span> the
              <br />
              RELDA India
              <br />
              Family?
            </h2>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto h-[220px] w-full max-w-[440px] rounded-sm bg-[#d9d9d9]" />
          </div>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:mt-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-12 lg:px-12 xl:px-16">
          {benefits.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="max-w-sm"
            >
              <h3 className="text-[22px] font-medium leading-tight text-black sm:text-[24px]">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] font-normal leading-snug text-[#9a9a9a] sm:text-[16px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoin;
