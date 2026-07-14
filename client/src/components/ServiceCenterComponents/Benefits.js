import React, { useEffect, useRef, useState } from "react";
import { Award, PackageCheck, GraduationCap, Gift } from "lucide-react";
import Img from "../../assest/ServiceCenterImages/Benifits.webp";

const benefits = [
  {
    icon: Award,
    title: "Official RELDA Recognition",
    description:
      "Become a certified partner and use our branding to build trust.",
  },
  {
    icon: PackageCheck,
    title: "Genuine Spare Parts",
    description:
      "Exclusive access to authentic RELDA components at partner prices.",
  },
  {
    icon: GraduationCap,
    title: "Ongoing Technical Training",
    description:
      "Regular updates and certifications for your staff on new products.",
  },
  {
    icon: Gift,
    title: "Incentives & Rewards",
    description:
      "Performance based bonuses and quarterly loyalty rewards.",
  },
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
    <section ref={sectionRef} className="bg-[#F7F9FB] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Image */}
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
                alt="RELDA service center partner benefits"
                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Decorative glow effects */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Right: Heading + benefit list */}
          <div
            className={`mt-6 lg:mt-0 transition-all duration-700 ease-out delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#000000] mb-8 text-center lg:text-left">
              Key Partner Benefits
            </h2>

            <div className="space-y-4">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm transition-all duration-500 ease-out ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{
                      transitionDelay: `${300 + idx * 100}ms`,
                    }}
                  >
                    <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-primary" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm md:text-base mb-1">
                        {benefit.title}
                      </p>
                      <p className="text-brand-textMuted text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;