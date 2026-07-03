import React from "react";
import { motion } from "framer-motion";

const whyItems = [
  {
    title: "Rapidly Growing Market",
    description:
      "The home and kitchen appliance industry in India is expanding at 25% CAGR, making it the perfect time to invest.",
  },
  {
    title: "Trusted Indian Brand",
    description:
      "RELDA India is proudly made in India, combining quality, reliability, and affordability for every household.",
  },
  {
    title: "Innovative & Versatile Products",
    description:
      "From Chimneys, Hobs, Mixers, to LED TVs and more, we offer a wide range of products designed for modern Indian homes.",
  },
];

const WhyRelda = () => {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-5xl text-center"
        >
          <h2 className="text-[34px] font-light leading-none tracking-[-0.05em] text-black sm:text-[48px] lg:text-[60px]">
            Why <span className="font-normal text-[#E60000]">RELDA India?</span>
          </h2>
        </motion.div>

        <div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.9fr)] lg:gap-12">
          <div className="space-y-8 sm:space-y-10 lg:pl-2 lg:pr-8 xl:pl-4">
            {whyItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="flex items-start gap-4 sm:gap-5"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E60000] text-[18px] leading-none text-white sm:h-9 sm:w-9">
                  *
                </div>

                <div>
                  <h3 className="text-[20px] font-medium leading-tight text-black sm:text-[24px]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[15px] font-normal leading-snug text-[#8e8e8e] sm:text-[16px]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="hidden justify-self-end rounded-sm bg-[#d9d9d9] lg:block lg:h-[374px] lg:w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyRelda;
