import React, { useEffect, useRef, useState } from "react";
import { Megaphone, GraduationCap, Rocket, Users } from "lucide-react";

const supports = [
  {
    icon: Megaphone,
    title: "Local Marketing",
    description:
      "Geo-targeted digital ads and physical branding materials for your region.",
  },
  {
    icon: GraduationCap,
    title: "Product Training",
    description:
      "In-depth technical and sales training for your staff twice a year.",
  },
  {
    icon: Rocket,
    title: "Promotion Planning",
    description:
      "Seasonal sales blueprints and discount structures to maximize turnover.",
  },
  {
    icon: Users,
    title: "Relationship Lead",
    description:
      "Dedicated Relationship Manager to solve all operational hurdles.",
  },
];

const BusinessSupport = () => {
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

    const current = sectionRef.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        try {
          observer.unobserve(current);
        } catch (e) {
          /* ignore */
        }
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#2D3133] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        {/* Heading Section */}
        <div
          className={`text-center lg:text-left mb-12 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#EFF1F3] leading-tight mb-3">
            Comprehensive Business Support
          </h2>
          <p className="text-gray-400 text-sm md:text-base transition-all duration-700 delay-200">
            We don't just supply products; we build empires together.
          </p>
        </div>

        {/* Support Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {supports.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-2xl p-6 transition-all duration-700 ease-out hover:bg-[#FFFFFF15] hover:border-[#FFFFFF30] hover:scale-105 hover:shadow-xl ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: `${200 + idx * 120}ms`,
                }}
              >
                <div
                  className={`transition-all duration-500 ease-out ${
                    isVisible
                      ? "scale-100 rotate-0"
                      : "scale-0 -rotate-45"
                  }`}
                  style={{
                    transitionDelay: `${300 + idx * 120}ms`,
                  }}
                >
                  <Icon
                    className="w-7 h-7 text-indigo-300 mb-4"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="font-bold text-white text-base md:text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessSupport;