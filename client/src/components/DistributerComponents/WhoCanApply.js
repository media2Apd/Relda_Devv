import React, { useEffect, useRef, useState } from "react";
import {
  Monitor,
  Archive,
  Store,
  Building2,
  ShoppingCart,
  Package,
  Briefcase,
} from "lucide-react";

const applicants = [
  { icon: Monitor, label: "Electronics Retailers" },
  { icon: Archive, label: "Home Durable Stores" },
  { icon: Store, label: "Supermarket Chains" },
  { icon: Building2, label: "Project Suppliers" },
  { icon: ShoppingCart, label: "DTC Aggregators" },
  { icon: Package, label: "Wholesalers" },
  { icon: Briefcase, label: "B2B Enterprises" },
];

const WhoCanApply = () => {
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

    const element = sectionRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#ECEEF0] py-16 overflow-hidden">
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
            Who Can Apply?
          </h2>
          <p className="text-brand-textMuted text-sm md:text-base transition-all duration-700 delay-200">
            We are looking for partners who share our passion for excellence.
          </p>
        </div>

        {/* Applicants Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 md:gap-6">
          {applicants.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm transition-all duration-500 ease-out hover:shadow-lg hover:scale-105 hover:bg-white ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: `${150 + idx * 80}ms`,
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm transition-all duration-500 ease-out ${
                    isVisible
                      ? "scale-100 rotate-0"
                      : "scale-0 rotate-180"
                  }`}
                  style={{
                    transitionDelay: `${250 + idx * 80}ms`,
                  }}
                >
                  <Icon
                    className="w-5 h-5 text-gray-900 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.75}
                  />
                </div>
                <p
                  className={`font-semibold text-gray-900 text-sm transition-all duration-500 ease-out ${
                    isVisible
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${300 + idx * 80}ms`,
                  }}
                >
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhoCanApply;