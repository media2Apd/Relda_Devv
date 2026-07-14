import React, { useEffect, useRef, useState } from "react";
import { Wrench, Store, UserCog, Zap, Briefcase } from "lucide-react";

const applicants = [
  { icon: Briefcase, label: "Service Providers" },
  { icon: Store, label: "Repair Shops" },
  { icon: UserCog, label: "Technicians" },
  { icon: Briefcase, label: "Franchise Owners" },
  { icon: Zap, label: "Electrical Contractors" },
  { icon: Wrench, label: "Service Entrepreneurs" },
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
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
            Who Can Apply
          </h2>
          <p className="text-brand-textMuted text-sm md:text-base transition-all duration-700 delay-200">
            We welcome expertise from all sectors of the appliance service
            industry.
          </p>
        </div>

        {/* Applicants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {applicants.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white border border-gray-200 rounded-2xl px-6 py-5 flex items-center gap-3 transition-all duration-500 ease-out hover:border-brand-primary/40 hover:shadow-md ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: `${150 + idx * 80}ms`,
                }}
              >
                <Icon
                  className="w-5 h-5 text-brand-primary flex-shrink-0"
                  strokeWidth={2}
                />
                <p className="font-bold text-gray-900 text-base">
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