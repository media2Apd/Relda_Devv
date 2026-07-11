import React from "react";
import { motion } from "framer-motion";
import { Asterisk } from "lucide-react";

const supportItems = [
  "Marketing support to build strong brand visibility.",
  "Online and offline marketing for a wider reach.",
  "Sales team support to drive better conversions.",
  "Complete shop branding. (min 3 years)",
];

const BussinessJourney = () => {
  return (
    <section className="bg-white py-10 lg:py-16">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[430px_620px] justify-between items-center gap-10"
        >
          {/* Left */}
          <div>
            <h2
              className="
                text-center
                lg:text-left
                font-light
                leading-[0.9]
                text-black
                text-[48px]
                sm:text-[58px]
                md:text-[64px]
                lg:text-[72px]
                xl:text-[76px]
              "
            >
              Supporting
              <br />
              Your
              <br />
              <span className="font-medium text-[#E60000]">
                Business
              </span>
              <br />
              Journey
            </h2>
          </div>

          {/* Right */}
          <div>
            <ul className="space-y-7">
              {supportItems.map((item, index) => (
                <li key={index} className="flex items-center gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E60000]">
                    <Asterisk
                      size={16}
                      strokeWidth={2.5}
                      className="text-white"
                    />
                  </div>

                  <p
                    className="
                      text-[#222]
                      font-normal
                      leading-[1.45]
                      text-[18px]
                      lg:text-[20px]
                      xl:text-[22px]
                    "
                  >
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