import React from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Megaphone, 
  UserSearch, 
  GraduationCap, 
  Banknote, 
  UserCheck 
} from 'lucide-react';

const WhyPartner = () => {
  const benefits = [
    {
      title: "Showroom Branding",
      description: "Complete assistance in showroom layout, interior design, and premium external signage to match our global brand identity.",
      icon: <Store className="w-6 h-6 text-brand-primary" />,
    },
    {
      title: "Marketing Support",
      description: "Aggressive national advertising and local marketing funds to drive footfall to your specific outlet throughout the year.",
      icon: <Megaphone className="w-6 h-6 text-brand-primary" />,
    },
    {
      title: "Lead Generation",
      description: "Direct transfer of online leads from our central portal to your dashboard, ensuring a steady stream of ready customers.",
      icon: <UserSearch className="w-6 h-6 text-brand-primary" />,
    },
    {
      title: "Regular Training",
      description: "Comprehensive product and sales training for your staff to ensure high conversion rates and superior customer service.",
      icon: <GraduationCap className="w-6 h-6 text-brand-primary" />,
    },
    {
      title: "High Margins",
      description: "Industry-leading profit margins and performance-based incentives designed to maximize your return on investment.",
      icon: <Banknote className="w-6 h-6 text-brand-primary" />,
    },
    {
      title: "Relationship Manager",
      description: "Dedicated single point of contact for all your business needs, from inventory management to after-sales support.",
      icon: <UserCheck className="w-6 h-6 text-brand-primary" />,
    },
  ];

  // Framer Motion Variants for Staggered Animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <section className="bg-[#F8F9FA] pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary text-4xl md:text-5xl font-bold mb-6"
          >
            Why Partner with RELDA?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-textMuted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            We don't just provide products; we provide a complete business ecosystem to 
            ensure your success as a dealer.
          </motion.p>
        </div>

        {/* Grid Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-start"
            >
              {/* Icon Container */}
              <div className="bg-[#FCECEC] p-4 rounded-xl mb-6">
                {benefit.icon}
              </div>

              {/* Title */}
              <h3 className="text-[#1A1A1A] text-2xl font-bold mb-4 leading-tight">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-brand-textMuted text-[16px] leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyPartner;