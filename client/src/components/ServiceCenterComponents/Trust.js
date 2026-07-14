import React, { useEffect, useRef, useState } from "react";
import { UserCheck, Clock, Star, Lock, MapPin } from "lucide-react";

const trustPoints = [
  {
    icon: UserCheck,
    title: "Certified Technicians",
    description: "Rigorous vetting and multi-level training.",
    span: "lg:col-span-3",
  },
  {
    icon: Clock,
    title: "Quick Response",
    description: "Average TAT of less than 24 hours.",
    span: "lg:col-span-4",
  },
  {
    icon: Star,
    title: "4.8/5 Star Rating",
    description:
      "Highest rated service network in the appliance category nationwide.",
    span: "lg:col-span-5",
  },
  {
    icon: Lock,
    title: "100% Secure Payments",
    description:
      "Digital billing and transparent pricing structures for every job.",
    span: "lg:col-span-5",
  },
  {
    icon: MapPin,
    title: "Wide Network Reach",
    description:
      "Strategic presence across tier 1, 2, and 3 cities ensuring no customer is left behind.",
    badge: "PAN INDIA",
    span: "lg:col-span-7",
  },
];

const Trust = () => {
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
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        {/* Heading Section */}
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#000000] mb-3">
            Unmatched Customer Trust
          </h2>
        </div>

        {/* Trust Cards - Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`relative bg-brand-primary rounded-2xl p-6 shadow-md transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${item.span} ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: `${150 + idx * 120}ms`,
                }}
              >
                {item.badge && (
                  <span className="absolute top-4 right-4 bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full tracking-wide">
                    {item.badge}
                  </span>
                )}
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-white text-base md:text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-white/85 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Trust;