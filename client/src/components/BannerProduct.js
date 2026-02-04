import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBannerImages from "../hooks/useBannerImages";

const BannerProduct = ({ type = "home-top" }) => {
  const { banners, loading } = useBannerImages(type);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [banners]);

  if (loading) {
    return <div className="w-full h-[300px] animate-pulse" />;
  }

  if (!banners.length) return null;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slider */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((item, index) => (
          <div
            key={item._id || index}
            className="w-full flex-shrink-0 cursor-pointer"
            onClick={() => item.link && navigate(item.link)}
          >
            <picture>
              {/* Mobile only - small screens */}
              <source
                media="(max-width: 768px)"
                srcSet={item.mobileImage}
              />
              {/* All other screens (tablet, desktop, large screens) */}
              <source
                media="(min-width: 769px)"
                srcSet={item.desktopImage}
              />
              <img
                src={item.desktopImage} // fallback
                alt={item.title || "banner"}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="relative w-6 sm:w-7 md:w-8 h-[3px] bg-white/50 hover:bg-white/70 transition-colors overflow-hidden"
            >
              {current === index && (
                <div className="absolute left-0 top-0 h-full w-full bg-brand-primary animate-progress" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerProduct;