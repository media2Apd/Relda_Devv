import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import Img from "../../assest/ServiceCenterImages/HeroImage.webp";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
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

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div
            className={`text-center lg:text-left transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <span className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-5 transition-all duration-700 delay-200">
              <ShieldCheck className="w-4 h-4" strokeWidth={2} />
              India's Growing Home Appliance Brand
            </span>

            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#000000] leading-tight mb-5">
              Become an <br className="hidden sm:block" /> Authorized<br />
              RELDA <span className="text-brand-primary">Service Center</span>
            </h1>

            <p className="text-brand-textMuted text-base md:text-lg max-w-md mx-auto lg:mx-0 mb-8">
              Start Your Service Business with RELDA. Join our nationwide
              network and deliver world-class installation and repair support
              for premium home appliances.
            </p>

            <button
              onClick={() =>
                document.getElementById("form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="bg-brand-primary hover:bg-brand-primaryHover transition-colors text-white font-semibold px-8 py-3 rounded-lg text-sm md:text-base"
            >
              Apply Now
            </button>
          </div>

          {/* Right: Image */}
          <div
            className={`relative transition-all duration-1000 ease-out delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_0_40px_-10px_rgba(230,0,0,0.15)] hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4),0_0_50px_-10px_rgba(230,0,0,0.25)] transition-shadow duration-500">
              <img
                src={Img}
                alt="Become a RELDA Authorized Service Center"
                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Decorative glow effect */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;