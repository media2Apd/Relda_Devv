import React from "react";

const BottomCTA = () => {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-14 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-brand-primaryHover to-[#2a0000] px-6 sm:px-10 md:px-16 py-12 md:py-16 text-center">
          <h2 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-2xl mx-auto">
            Ready to Grow with RELDA?
          </h2>

          <p className="relative z-10 text-white/85 text-sm md:text-base max-w-xl mx-auto mb-8">
            Take the first step towards building a highly profitable authorized
            service business today.
          </p>

          <button
            onClick={() =>
              document.getElementById("form")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="relative z-10 bg-white text-brand-primary font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-sm md:text-base"
          >
            Join the RELDA Service Network Today
          </button>

          <p className="relative z-10 text-white/70 text-xs md:text-sm mt-6">
            Over 500+ successful partners already onboard.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BottomCTA;
