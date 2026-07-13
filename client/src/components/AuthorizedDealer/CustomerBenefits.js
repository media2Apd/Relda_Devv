import React from 'react';
import { motion } from 'framer-motion';
import { 
  BadgeCheck, 
  Tag, 
  Palette, 
  Zap, 
  Box, 
  Headphones 
} from 'lucide-react';

const CustomerBenefits = () => {
  const features = [
    {
      title: "Premium Quality",
      description: "Rigorous 15-point quality checks on every appliance before it leaves our facility.",
      icon: <BadgeCheck className="w-8 h-8 stroke-[1.5]" />,
    },
    {
      title: "Affordable Prices",
      description: "Disrupting the market with high-end features at prices that make sense for India.",
      icon: <Tag className="w-8 h-8 stroke-[1.5]" />,
    },
    {
      title: "Modern Designs",
      description: "Aesthetic appliances that enhance the interior decor of modern Indian homes.",
      icon: <Palette className="w-8 h-8 stroke-[1.5]" />,
    },
    {
      title: "Reliable Performance",
      description: "Engineered specifically for Indian power and water conditions for long-lasting use.",
      icon: <Zap className="w-8 h-8 stroke-[1.5]" />,
    },
    {
      title: "Wide Product Range",
      description: "From Smart TVs to Washing Machines, we cover all major home appliance categories.",
      icon: <Box className="w-8 h-8 stroke-[1.5]" />,
    },
    {
      title: "After Sales Support",
      description: "Our service network spans across India, ensuring rapid resolution of any customer query.",
      icon: <Headphones className="w-8 h-8 stroke-[1.5]" />,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <section className="bg-[#f8faff] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Why Customers Choose RELDA
          </h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: "#ffffff",
                boxShadow: "0 20px 40px rgba(0,0,0,0.04)" 
              }}
              className="bg-white/60 backdrop-blur-sm p-10 rounded-[2rem] border border-blue-100 transition-all duration-300"
            >
              {/* Icon - Using brand-primary */}
              <div className="text-brand-primary mb-6">
                {feature.icon}
              </div>

              {/* Card Title */}
              <h3 className="text-[#1A1A1A] text-2xl font-bold mb-4 leading-tight">
                {feature.title}
              </h3>

              {/* Card Description - Using brand-textMuted */}
              <p className="text-brand-textMuted text-[17px] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerBenefits;