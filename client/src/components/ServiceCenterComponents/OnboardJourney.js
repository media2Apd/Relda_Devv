import React, { useEffect, useRef, useState } from "react";

const steps = [
  { title: "Apply", description: "Submit your application online" },
  { title: "Verification", description: "Document and site review" },
  { title: "Training", description: "Intensive product training" },
  { title: "Certification", description: "Final test and licensing" },
  { title: "Launch", description: "Setup workshop and start" },
  { title: "Growth", description: "Expand and scale business" },
];

const OnboardJourney = () => {
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

    const target = sectionRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#ECEEF0] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        {/* Heading Section */}
        <div
          className={`text-center mb-14 md:mb-16 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#000000] mb-3">
            The Onboarding Journey
          </h2>
          <p className="text-brand-textMuted text-sm md:text-base transition-all duration-700 delay-200">
            Simple steps to launch your service franchise
          </p>
        </div>

        {/* Desktop / Tablet: horizontal timeline */}
        <div className="hidden sm:block relative">
          <div
            className={`absolute top-6 left-6 right-6 h-0.5 bg-brand-primary transition-all duration-1000 ease-out ${
              isVisible
                ? "scale-x-100 opacity-100"
                : "scale-x-0 opacity-0"
            }`}
            style={{ transformOrigin: "left center" }}
          ></div>
          <div className="relative grid grid-cols-6 gap-2">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: `${200 + idx * 150}ms`,
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-brand-primary text-white font-bold flex items-center justify-center shadow-md z-10 transition-all duration-500 ${
                    isVisible
                      ? "scale-100"
                      : "scale-0"
                  }`}
                  style={{
                    transitionDelay: `${300 + idx * 150}ms`,
                  }}
                >
                  {idx + 1}
                </div>
                <p className="mt-4 font-semibold text-gray-900 text-sm md:text-base">
                  {step.title}
                </p>
                <p className="mt-1 text-brand-textMuted text-xs md:text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="sm:hidden relative pl-6">
          <div
            className={`absolute top-0 bottom-0 left-6 w-0.5 bg-brand-primary transition-all duration-1000 ease-out ${
              isVisible
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0"
            }`}
            style={{ transformOrigin: "top center" }}
          ></div>
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`relative flex items-start gap-4 transition-all duration-700 ease-out ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
                style={{
                  transitionDelay: `${200 + idx * 120}ms`,
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-brand-primary text-white font-bold flex items-center justify-center shadow-md z-10 -ml-6 flex-shrink-0 transition-all duration-500 ${
                    isVisible
                      ? "scale-100"
                      : "scale-0"
                  }`}
                  style={{
                    transitionDelay: `${300 + idx * 120}ms`,
                  }}
                >
                  {idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                  <p className="text-brand-textMuted text-xs mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardJourney;