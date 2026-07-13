import React from 'react';
import { motion } from 'framer-motion';
import DealerHeroImg from "../../assest/Dealer/DealerHero.webp"

const DealerHero = () => {
  return (
    <section className="relative w-full bg-[#f8faff] py-12 lg:py-16 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            {/* Top Badge - Using a light version of your brand color */}
            <span className="bg-red-50 text-brand-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              Start Your Entrepreneurial Journey
            </span>

            {/* Main Heading - Using your brand-primary and font-sf */}
            {/* !leading-[1.1] will fix the "otti otti" issue */}
            <h1 className="text-brand-primary font-bold text-5xl md:text-6xl lg:text-[72px] !leading-[1.1] tracking-tight mb-6">
              Become a RELDA <br /> 
              Authorized Dealer
            </h1>

            {/* Paragraph - Using textMuted from your config */}
            <p className="text-brand-textMuted text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-medium">
              Partner with one of India's fastest-growing home appliance 
              brands. Build a legacy of quality and trust with our 
              comprehensive support ecosystem.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-brand-primary text-white px-12 py-4 rounded-lg font-bold text-lg shadow-xl hover:bg-brand-primaryHover transition-all"
            >
              Apply Now
            </motion.button>
          </motion.div>

          {/* Right Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image with rounded corners */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={DealerHeroImg}
                alt="RELDA Store"
                className="w-full h-[450px] object-cover"
              />
            </div>

            {/* Floating 25%+ Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-8 -right-4 bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 border border-gray-100 min-w-[200px]"
            >
              <div className="bg-brand-primary p-3 rounded-full shadow-lg shadow-red-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 leading-none">25%+</div>
                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">Annual Growth</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Red Bottom Bar - Using brand-primary */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full bg-brand-primary mt-24 py-12"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-y-10 text-center text-white">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-bold">291+</h3>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold mt-3 opacity-90">Dealers Nationwide</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-bold">87+</h3>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold mt-3 opacity-90">Cities Covered</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-bold">5,832+</h3>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold mt-3 opacity-90">Happy Customers</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-bold">29+</h3>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold mt-3 opacity-90">Premium Products</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DealerHero;