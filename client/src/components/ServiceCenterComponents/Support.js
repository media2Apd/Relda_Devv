import React, { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Truck,
  BookOpen,
  Headset,
  BarChart3,
  Megaphone,
  PenTool,
  Cloud,
} from "lucide-react";

const supports = [
  {
    icon: GraduationCap,
    title: "Technical Training",
    description: "On-site and virtual modules.",
  },
  {
    icon: Truck,
    title: "Spare Parts",
    description: "Doorstep delivery within 24h.",
  },
  {
    icon: BookOpen,
    title: "Service Manuals",
    description: "Digital knowledge repository.",
  },
  {
    icon: Headset,
    title: "Help Desk",
    description: "Priority call support for partners.",
  },
  {
    icon: BarChart3,
    title: "Performance Dash",
    description: "Track your service metrics.",
  },
  {
    icon: Megaphone,
    title: "Marketing Kit",
    description: "Ready-to-use local ads.",
  },
  {
    icon: PenTool,
    title: "Design Support",
    description: "Workshop layout guidelines.",
  },
  {
    icon: Cloud,
    title: "Cloud CRM",
    description: "Advanced job management software.",
  },
];

const Support = () => {
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
    <section ref={sectionRef} className="bg-[#F7F9FB] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        {/* Heading Section */}
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Comprehensive Partner Support
          </h2>
        </div>

        {/* Support Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {supports.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all duration-700 ease-out hover:shadow-md hover:-translate-y-1 ${
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
                    className="w-6 h-6 text-brand-primary mb-4"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-brand-textMuted text-sm">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Support;