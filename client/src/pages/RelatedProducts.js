import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RelatedProducts = () => {
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ✅ Fetch data
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("viewedItems")) || [];
    if (viewed.length) {
      fetch(SummaryApi.relatedProducts(viewed).url)
        .then(res => res.json())
        .then(data => setRelated(Array.isArray(data) ? data : []));
    }
  }, []);

  // ✅ Scroll handler
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = 380;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  // ✅ Detect scroll position
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  // ✅ Attach scroll listener (ALWAYS runs)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    handleScroll();
    el.addEventListener("scroll", handleScroll);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [related]);

  return (
    <>
      {related.length > 0 && (
        <div className="container mx-auto px-4 my-10 relative">
          {/* Heading */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-medium">Recently Viewed</h2>
              <p className="text-sm text-brand-textMuted">
                Continue where you left off
              </p>
            </div>

            {related.length > 6 && (
              <button
                onClick={() => navigate("/related-products")}
                className="text-blue-600 hover:text-blue-700 text-sm md:text-base font-medium"
              >
                See More
              </button>
            )}
          </div>

          {/* LEFT ARROW */}
          {related.length > 6 && canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden 2xl:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
            >
              <ChevronLeft />
            </button>
          )}

          {/* RIGHT ARROW */}
          {related.length > 6 && canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden 2xl:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
            >
              <ChevronRight />
            </button>
          )}

          {/* Scroll Row */}
          <div
            ref={scrollRef}
            className="
              flex gap-6 overflow-x-auto
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {related.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => navigate(`/product/${product._id}`)}
                actionSlot={
                  <button
                    className="w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product._id}`);
                    }}
                  >
                    View Product
                  </button>
                }
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RelatedProducts;
