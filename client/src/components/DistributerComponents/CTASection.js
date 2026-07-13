import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        <div
          className={`bg-brand-primary rounded-3xl px-6 sm:px-10 md:px-16 py-12 md:py-16 text-center transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Ready to Scale Your Business? Partner with RELDA Today.
          </motion.h2>

          <motion.p
            className="text-white/90 text-sm md:text-base max-w-xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            Take the first step towards a profitable future. Our team is ready
            to help you set up and succeed.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() =>
                document.getElementById("form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="w-full sm:w-auto bg-white text-brand-primary font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm md:text-base relative overflow-hidden group"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Become an Authorized Distributor</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>

            <motion.button
              onClick={() => navigate("/ContactUsPage")}
              className="w-full sm:w-auto border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm md:text-base relative overflow-hidden group"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(255,255,255,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Contact Sales Team</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </div>

          {/* Decorative floating particles */}
          {isVisible && (
            <>
              <motion.div
                className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full hidden lg:block"
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-10 right-10 w-3 h-3 bg-white/15 rounded-full hidden lg:block"
                animate={{
                  y: [0, 20, 0],
                  x: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              <motion.div
                className="absolute top-1/2 left-5 w-1.5 h-1.5 bg-white/10 rounded-full hidden lg:block"
                animate={{
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
              <motion.div
                className="absolute top-1/3 right-5 w-2 h-2 bg-white/10 rounded-full hidden lg:block"
                animate={{
                  y: [0, 25, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;