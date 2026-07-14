import React, { useEffect, useRef, useState } from "react";
import {
  Wrench,
  ShieldCheck,
  Settings,
  FileText,
  ClipboardCheck,
  RefreshCw,
  Recycle,
  Home,
} from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Installation",
    description: "Professional setup for all new appliance units.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Repairs",
    description: "Official in-warranty service fulfillment.",
  },
  {
    icon: Settings,
    title: "Out of Warranty",
    description: "Paid repair services for older appliances.",
  },
  {
    icon: FileText,
    title: "AMC Contracts",
    description: "Annual maintenance contract management.",
  },
  {
    icon: ClipboardCheck,
    title: "Safety Check",
    description: "Preventive maintenance and inspections.",
  },
  {
    icon: RefreshCw,
    title: "Replacements",
    description: "Managing unit exchange and upgrades.",
  },
  {
    icon: Recycle,
    title: "Refurbishment",
    description: "Product restoration and certification.",
  },
  {
    icon: Home,
    title: "Home Consultation",
    description: "Expert advice on product care and usage.",
  },
];

const Services = () => {
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
          <h2 className="text-3xl sm:text-3xl text-center md:text-4xl lg:text-5xl font-extrabold text-[#EFF1F3] leading-tight mb-3">
            Services You Will Offer
          </h2>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {services.map((item, idx) => {
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
                  transitionDelay: `${150 + idx * 90}ms`,
                }}
              >
                <div
                  className={`transition-all duration-500 ease-out ${
                    isVisible
                      ? "scale-100 rotate-0"
                      : "scale-0 -rotate-45"
                  }`}
                  style={{
                    transitionDelay: `${250 + idx * 90}ms`,
                  }}
                >
                  <Icon
                    className="w-7 h-7 text-[#D9E2FF] mb-4"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="font-bold text-[#F7F9FB] text-base md:text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-[#F7F9FB] text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;