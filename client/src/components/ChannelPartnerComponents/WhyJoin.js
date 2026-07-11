import React from "react";
import { motion } from "framer-motion";
import whyReldaImage from "../../assest/ChannelPartner/why-join-relda.webp";

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
    <section className="bg-white pb-16">
      <div className="mx-auto w-full max-w-[1500px]  px-4 sm:px-6 lg:px-8">
        {/* Heading & Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-16"
        >
          {/* Left */}
          <div>
            <h2
              className="
                font-light
                leading-[1.05]
                tracking-tight
                text-black
                text-[42px]
                sm:text-[52px]
                md:text-[56px]
                lg:text-[68px]
              "
            >
              <span className="text-[#E60000]">Why Join</span>
              <br />
              the RELDA India
              <br />
              Family?
            </h2>
          </div>

          {/* Right */}
          <div className="flex justify-center md:justify-end">
            <img
              src={whyReldaImage}
              alt="Why Join RELDA"
              className="
                w-full
                max-w-[320px]
                sm:max-w-[430px]
                md:max-w-[500px]
                lg:max-w-[540px]
                xl:max-w-[600px]
                h-auto
                rounded-lg
                object-cover
              "
            />
          </div>
        </motion.div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-12">
          {benefits.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <h3 className="text-xl font-semibold text-black sm:text-2xl">
                {item.title}
              </h3>

              <p className="mt-3 text-base leading-7 text-[#666666]">
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