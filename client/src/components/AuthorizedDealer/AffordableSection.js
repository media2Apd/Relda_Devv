import React from 'react';
import { motion } from 'framer-motion';
import DealerImg2 from "../../assest/Dealer/DealerImg2.webp";

const AffordableSection = () => {
  return (
    <section className="bg-[#edf0f8] py-16 px-4 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src={DealerImg2}
                alt="RELDA Lifestyle"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col space-y-8"
          >
            {/* Heading */}
            <h2 className="text-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Affordable for Everyone
            </h2>

            {/* Paragraphs */}
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                At RELDA, our vision is to democratize high-quality technology. 
                We believe that every Indian household deserves the comfort of 
                modern appliances without a prohibitive price tag.
              </p>
              <p>
                Since our inception, we've focused on meticulous engineering and 
                local insights to build products that withstand the diverse Indian 
                environment while delivering global performance standards.
              </p>
            </div>

            {/* Bottom Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {/* Quality Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50"
              >
                <h4 className="text-brand-primary text-3xl font-bold mb-1">Quality</h4>
                <p className="text-gray-600 text-sm font-medium">No Compromise</p>
              </motion.div>

              {/* Service Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50"
              >
                <h4 className="text-brand-primary text-3xl font-bold mb-1">Service</h4>
                <p className="text-gray-600 text-sm font-medium">24/7 Support</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AffordableSection;