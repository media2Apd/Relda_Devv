import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FinalCTA = ({ onApplyClick }) => {
  const navigate = useNavigate();
  return (
    <section className="bg-[#f8faff] py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-brand-primary rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden"
        >
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

          {/* Heading from Image 1 */}
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
          >
            Affordable for <br className="hidden md:block" /> Everyone.
          </motion.h2>

          {/* Description from Image 1 */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Delivering reliable, innovative, and affordable home appliance 
            solutions for every Indian family.
          </motion.p>

          {/* Buttons Layout from Image 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Primary Button Style from Image 2 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApplyClick} // Scrolls to the form
              className="bg-white text-brand-primary px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-50 transition-colors w-full sm:w-auto uppercase tracking-wider"
            >
              Apply Now
            </motion.button>

            {/* Outlined Button Style from Image 2 */}
            <motion.button
              onClick={() => navigate("/ContactUsPage")} // Scrolls to the form
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white/40 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all w-full sm:w-auto uppercase tracking-wider"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;