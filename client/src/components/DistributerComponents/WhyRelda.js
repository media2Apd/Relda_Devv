import React, { useEffect, useRef, useState } from "react";
import { Wallet, ShieldCheck, TrendingUp, Tags } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Affordable for Everyone",
    description:
      "Luxury quality engineered for the mass market without compromising performance.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Brand",
    description:
      "A legacy of engineering excellence and customer-centric business practices.",
  },
  {
    icon: TrendingUp,
    title: "Growing Product Demand",
    description:
      "Rapidly expanding portfolio capturing significant market share in high-growth zones.",
  },
  {
    icon: Tags,
    title: "Business Growth Support",
    description:
      "Dedicated account managers and comprehensive marketing collateral for your success.",
  },
];

const WhyRelda = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
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

    if (section) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#FFFFFF] pb-16 overflow-hidden">
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
            Why Choose RELDA?
          </h2>
          <div className="w-14 h-1 bg-brand-primary mx-auto rounded-full transition-all duration-700 delay-200"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`bg-[#FFFFFFB2] border border-brand-productCardBorder rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-700 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: `${idx * 150}ms`,
                }}
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-brand-primary/10 flex items-center justify-center transition-all duration-500 hover:scale-110 hover:bg-brand-primary/20">
                  <Icon className="w-6 h-6 text-brand-primary" strokeWidth={2} />
                </div>
                <h3 className="font-medium text-[#000000] text-base md:text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-brand-textMuted text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyRelda;