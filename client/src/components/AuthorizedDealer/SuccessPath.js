import React from 'react';
import { motion } from 'framer-motion';

const SuccessPath = () => {
  const steps = [
    { id: 1, title: "Apply", desc: "Submit online form" },
    { id: 2, title: "Verification", desc: "Document review" },
    { id: 3, title: "Approval", desc: "Partnership contract" },
    { id: 4, title: "Setup", desc: "Showroom branding" },
    { id: 5, title: "Training", desc: "Sales & Product" },
    { id: 6, title: "Launch", desc: "Start Selling!" },
  ];

  return (
    <section className="bg-[#f8faff] py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Section Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold mb-20"
        >
          Your Path to Success
        </motion.h2>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-[40px] left-[5%] right-[5%] h-[2px] bg-blue-100 hidden md:block">
            <motion.div 
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-blue-200"
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-y-12 gap-x-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Circle Icon */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-red-100 border-[6px] border-white relative z-20"
                >
                  {step.id}
                </motion.div>

                {/* Text Content */}
                <div className="mt-6">
                  <h4 className="text-[#1A1A1A] font-bold text-lg mb-1">
                    {step.title}
                  </h4>
                  <p className="text-brand-textMuted text-sm font-medium">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-only connecting line fix (Vertical) */}
      <style>{`
        @media (max-width: 767px) {
          .grid { position: relative; }
          .grid::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #e2e8f0;
            transform: translateX(-50%);
            z-index: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default SuccessPath;