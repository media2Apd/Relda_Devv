import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Faqs = ({ 
  title = "Frequently Asked Questions", 
  faqs = [], 
  defaultOpenIndex = 0,
  bgColor = "bg-gray-50",
  textColor = "text-brand-primary",
  borderColor = "border-brand-productCardBorder"
}) => {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);
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

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, []);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  if (!faqs.length) return null;

  return (
    <section ref={sectionRef} className={`${bgColor} sm:pb-16 lg:py-16 overflow-hidden`} >
      <div className="max-w-3xl mx-auto px-4 lg:px-12">
        {/* Heading with animation */}
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${textColor} text-center mb-10`}>
            {title}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id ?? idx}
                className={`bg-white rounded-xl border ${borderColor} shadow-sm overflow-hidden transition-all duration-500 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: `${150 + idx * 80}ms`,
                }}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between text-left px-5 md:px-6 py-4 md:py-5 hover:bg-gray-50/50 transition-colors"
                >
                  <span className={`font-semibold ${textColor} text-sm md:text-base pr-4`}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-primary flex-shrink-0 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-brand-primary flex-shrink-0 transition-transform duration-300" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6">
                    <p className="text-gray-600 text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faqs;