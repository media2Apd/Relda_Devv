import React from "react";
import { motion } from "framer-motion";

const supportItems = [
  {
    number: "01",
    title: "Store Setup & Branding",
    description: "Signage, store design, and visual merchandising",
  },
  {
    number: "02",
    title: "Marketing Assistance",
    description: "Campaigns, promotions, and exchange offers.",
  },
  {
    number: "03",
    title: "On-Ground Guidance",
    description: "Dedicated field team and periodic sales training.",
  },
  {
    number: "04",
    title: "Operational Support",
    description: "Day to Day support",
  },
];

const Support = () => {
  return (
    <section className="bg-white px-4 lg:py-16 sm:pb-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-[34px] font-regular leading-tight tracking-[-0.05em] text-black text-2xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl">
            <span className="text-[#E60000] font-medium">Support</span> at Every
            Step
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-[16px] font-normal leading-snug text-[#86868B] sm:mt-6 sm:text-[18px] lg:text-[20px]">
            At RELDA India, we ensure our Channel Partners have the tools and
            guidance to succeed. Our support includes:
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:gap-5">
          {supportItems.map((item, index) => (
            <motion.article
              key={item.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="rounded-xl border border-gray-100 bg-white px-6 py-7 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:px-8 sm:py-8"
            >
              <div className="text-[34px] font-light leading-none tracking-[-0.06em] text-[#E60000] sm:text-[40px]">
                {item.number}
              </div>

              <h3 className="mt-4 text-[20px] font-medium leading-snug text-[#1B1B1B] sm:text-[22px]">
                {item.title}
              </h3>

              <p className="mt-3 max-w-xs text-[14px] font-normal leading-snug text-[#86868B] sm:text-[15px]">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-5xl text-center sm:mt-16">
          <p className="leading-snug tracking-normal sm:text-xl lg:text-2xl">
            <span className="font-light text-[#9d9d9d]">
              With RELDA, You&apos;re Never Alone -{" "}
            </span>
            <span
              className="font-light capitalize text-black"
              style={{
                fontFamily:
                  "SF Pro, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 274,
              }}
            >
              We Partner With You At Every
              <br /> Step{" "}
            </span>
            <span className="font-light text-[#9d9d9d]">
              To Grow Your Business And Serve Your Community.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Support;
