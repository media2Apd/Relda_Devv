import React, { useEffect, useState } from "react";
import useBannerImages from "../hooks/useBannerImages";

const BannerProduct = ({ type = "home" }) => {
  const { banners, loading } = useBannerImages(type);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [banners]);

  if (loading) {
    return (
      <div className="w-full h-[300px] animate-pulse" />
    );
  }

  return (
    <div className="relative w-full overflow-hidden">

      {/* Slider */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((item, index) => (
          <div key={item.id || index} className="w-full flex-shrink-0">
            <img
              src={item.imageUrl}
              alt="banner"
              className="
                w-full
                max-h-[520px]
                mx-auto
              "
            />
            {/* <img
              src={item.imageUrl}
              alt="banner"
              className="
                w-full
                h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px]
                object-cover md:object-contain
                mx-auto
              "
            /> */}
          </div>
        ))}
      </div>

      {/* Indicator line (inside image) */}
      {/* {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`
                h-[3px] transition-all duration-500
                ${current === index ? "w-10 bg-[#e60000]" : "w-10 bg-white"}
              `}
            />
          ))}
        </div>
      )} */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <div
              key={index}
              className="relative w-10 h-[3px] bg-white overflow-hidden"
            >
              {current === index && (
                <div
                  key={current} // reset animation
                  className="
              absolute left-0 top-0
              h-full w-full
              bg-brand-primary
              origin-left
              animate-progress
            "
                />
              )}
            </div>
          ))}
        </div>
      )}


    </div>
  );
};

export default BannerProduct;