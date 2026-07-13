import React, { useEffect, useRef, useState } from "react";
import { CheckCircle } from "lucide-react";
import Img from "../../assest/DistributorImages/Benifits.webp";

const benefits = [
  "High Profit Margins",
  "Exclusive Territories",
  "Marketing Subsidies",
  "Quarterly Rebates",
  "Quick Delivery Cycle",
  "Service Center Support",
  "Digital Portal Access",
  "Training Workshops",
  "Branding Assistance",
  "24/7 Tech Support",
];

const Benefits = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const current = sectionRef.current;

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

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        try {
          observer.unobserve(current);
        } catch (e) {
          // ignore
        }
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2F4F6] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Image with badge */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500">
              <img
                src={Img}
                alt="RELDA warehouse logistics"
                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div 
              className={`absolute -bottom-5 left-4 right-4 sm:left-6 sm:right-auto sm:w-auto bg-white rounded-xl shadow-lg px-6 py-4 flex items-center gap-3 transition-all duration-700 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <span className="text-2xl md:text-3xl font-extrabold text-brand-primary">
                100%
              </span>
              <span className="text-sm text-brand-textMuted leading-tight">
                Logistics
                <br />
                Reliability Guaranteed
              </span>
            </div>
            {/* Decorative glow effects */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Right: Heading + checklist */}
          <div
            className={`mt-6 lg:mt-0 transition-all duration-700 ease-out delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#000000] mb-8 text-center lg:text-left">
              Unmatched Distributor Benefits
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 bg-gray-50 border-l-4 border-brand-primary rounded-md px-4 py-3 transition-all duration-500 ease-out ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: `${300 + idx * 50}ms`,
                  }}
                >
                  <CheckCircle
                    className="w-5 h-5 text-brand-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={2}
                  />
                  <span className="text-sm md:text-base font-medium text-gray-800">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;