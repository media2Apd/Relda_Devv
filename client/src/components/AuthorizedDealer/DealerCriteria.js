import React from 'react';
import { motion } from 'framer-motion';
import DealerImg3 from "../../assest/Dealer/DealerImg3.webp";

const DealerCriteria = () => {
  const criteria = [
    {
      id: 1,
      title: "Retail Space",
      description: "Commercial space of 300-1000 sq.ft. in a prime residential or commercial locality.",
    },
    {
      id: 2,
      title: "Passion",
      description: "A deep passion for consumer electronics and a drive to provide excellent customer experiences.",
    },
    {
      id: 3,
      title: "Mindset",
      description: "Growth-oriented entrepreneurial mindset with a long-term vision for the business.",
    },
    {
      id: 4,
      title: "Investment",
      description: "Sufficient capital for initial inventory and showroom setup as per brand guidelines.",
    },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <section className="bg-[#edf0f8] py-16 px-4 lg:px-8 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Heading and Cards */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-12 max-w-md"
            >
              Who Can Become a RELDA Dealer?
            </motion.h2>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-5"
            >
              {criteria.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  whileHover={{ x: 10 }}
                  className="bg-white p-6 rounded-[1.5rem] shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex items-start gap-5 border border-white transition-all"
                >
                  {/* Number Circle */}
                  <div className="bg-brand-primary min-w-[36px] h-[36px] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-1">
                    {item.id}
                  </div>

                  {/* Text Content */}
                  <div>
                    <h4 className="text-brand-primary font-bold text-lg mb-1">
                      {item.title}
                    </h4>
                    <p className="text-brand-textMuted leading-relaxed text-[15px]">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Side: Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="sticky top-24"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <img 
                src={DealerImg3}
                alt="RELDA Partnership"
                className="w-full h-[400px] object-cover"
              />
              {/* Optional: subtle blue overlay to match the image style */}
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DealerCriteria;