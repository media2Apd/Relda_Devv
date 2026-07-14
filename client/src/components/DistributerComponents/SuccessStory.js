import React, { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import img1 from "../../assest/DistributorImages/Client1.webp";
import img2 from "../../assest/DistributorImages/Client2.webp";
import img3 from "../../assest/DistributorImages/Client3.webp";

const testimonials = [
  {
    name: "Expanding Our Distribution Network",
    role: "Authorized Distributor",
    quote:
      "Partnering with RELDA helped us expand our dealer network and grow our business with confidence.",
    rating: 4,
    avatar: `${img1}`,
    highlighted: false,
  },
  {
    name: "Stronger Market Presence",
    role: "Regional Distributor",
    quote:
      "RELDA's marketing support and quality products helped us establish a stronger presence in our region.",
    rating: 4,
    avatar: `${img2}`,
    highlighted: true,
  },
  {
    name: "Partnership Built for Growth",
    role: "Distribution Partner",
    quote:
      "From training to business guidance, RELDA has been a reliable partner in helping us achieve consistent growth.",
    rating: 4,
    avatar: `${img3}`,
    highlighted: false,
  },
];

const SuccessStory = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
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

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-50 pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Heading Section */}
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#000000]">
            Distributor Success Stories
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-6 shadow-sm transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
                t.highlighted
                  ? "border-2 border-brand-primary shadow-md"
                  : "border border-brand-productCardBorder"
              } ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: `${200 + idx * 150}ms`,
              }}
            >
              {/* Avatar and Name Section */}
              <div
                className={`flex items-center gap-3 mb-4 transition-all duration-500 ease-out ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
                style={{
                  transitionDelay: `${300 + idx * 150}ms`,
                }}
              >
                <div className="relative">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover transition-all duration-500 hover:scale-110 hover:ring-2 hover:ring-brand-primary"
                  />
                  {t.highlighted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-brand-textMuted text-xs">{t.role}</p>
                </div>
              </div>

              {/* Quote Section */}
              <p
                className={`text-gray-700 text-sm italic mb-5 transition-all duration-500 ease-out ${
                  isVisible
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                style={{
                  transitionDelay: `${400 + idx * 150}ms`,
                }}
              >
                "{t.quote}"
              </p>

              {/* Stars Section */}
              <div
                className={`flex items-center gap-1 transition-all duration-500 ease-out ${
                  isVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
                style={{
                  transitionDelay: `${500 + idx * 150}ms`,
                }}
              >
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-4 h-4 transition-all duration-300 ${
                      starIdx < t.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    style={{
                      transitionDelay: `${550 + idx * 150 + starIdx * 50}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStory;