import React from "react";
import { motion } from "framer-motion";
import whyReldaImage from "../../assest/ChannelPartner/why-relda-india.webp";

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
     <div className="mx-auto w-full max-w-[1500px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-black">
            Why <span className="font-normal text-[#E60000]">RELDA India?</span>
          </h2>
        </motion.div>

        {/* Content */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-14">
          {/* Left Side */}
          <div className="space-y-8 sm:space-y-10">
            {whyItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                {/* Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E60000] text-lg text-white">
                  *
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm sm:text-base leading-7 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="w-full"
          >
            <img
              src={whyReldaImage}
              alt="Why RELDA India"
              className="w-full rounded-lg object-cover h-[220px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyRelda;