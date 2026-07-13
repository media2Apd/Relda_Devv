import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "500+", label: "Partners Nationwide", target: 500 },
  { value: "150+", label: "Cities Covered", target: 150 },
  { value: "50+", label: "Product Categories", target: 50 },
  { value: "10000+", label: "Happy Customers", target: 10000 },
];

// Counter component
const Counter = ({ target, suffix, isInView, delay }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const duration = 2000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * target);
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    const timeout = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, isInView, delay]);

  return <>{count}{suffix}</>;
};

const StatsCard = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    once: true, 
    amount: 0.2 
  });

  return (
    <section ref={sectionRef} className="bg-brand-primary py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                delay: 0.1 + idx * 0.15, 
                duration: 0.6,
                ease: "easeOut" 
              }}
            >
              {/* Number with Counter */}
              <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-1">
                <Counter 
                  target={stat.target} 
                  suffix="+" 
                  isInView={isInView}
                  delay={0.2 + idx * 0.15}
                />
              </p>

              {/* Label */}
              <motion.p
                className="text-white text-sm md:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ 
                  delay: 0.5 + idx * 0.15, 
                  duration: 0.5,
                  ease: "easeOut" 
                }}
              >
                {stat.label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCard;