import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import img from "../../assest/DistributorImages/Luxury.webp";

const Luxury = () => {
  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#000000] leading-tight mb-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Affordable Luxury for Everyone
            </motion.h2>

            <motion.p
              className="text-brand-textMuted text-base md:text-lg mb-6 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              RELDA was born from a simple vision: why should high-end
              engineering and premium design be limited to the ultra-wealthy?
              We are on a mission to democratize luxury home appliances
              through industrial efficiency and engineering innovation.
            </motion.p>

            <motion.div
              className="flex items-start gap-4 bg-gray-100 rounded-xl p-5 max-w-xl mx-auto lg:mx-0 text-left"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                className="w-10 h-10 flex-shrink-0 rounded-full bg-brand-primary/10 flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(212,175,55,0.2)",
                  transition: { duration: 0.3 }
                }}
              >
                <Users className="w-5 h-5 text-brand-primary" strokeWidth={2} />
              </motion.div>
              <motion.p 
                className="text-sm md:text-base text-gray-700 italic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                "Our distributors are more than just business partners; they
                are the pillars of our mission to improve Indian households."
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 40px rgba(212,175,55,0.1)",
              transition: { duration: 0.4 }
            }}
          >
            <motion.img
              src={img}
              alt="Family enjoying a meal in modern kitchen"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Luxury;