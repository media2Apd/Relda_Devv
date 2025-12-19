import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency"; 
const RelatedProducts = () => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxProducts, setMaxProducts] = useState(6); // default for desktop
  const navigate = useNavigate();

  useEffect(() => {
    const updateMaxProducts = () => {
      if (window.innerWidth < 768) {
        setMaxProducts(4); // mobile
      } else {
        setMaxProducts(6); // desktop
      }
    };

    updateMaxProducts();
    window.addEventListener("resize", updateMaxProducts);
    return () => window.removeEventListener("resize", updateMaxProducts);
  }, []);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("viewedItems")) || [];

    if (viewed.length > 0) {
      fetch(SummaryApi.relatedProducts(viewed).url)
        .then((res) => res.json())
        .then((data) => setRelated(Array.isArray(data) ? data : []))
        .catch(() => setError("Failed to load related products."))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  const renderMedia = (product) => {
    if (Array.isArray(product?.productImage)) {
      const imageMedia = product.productImage.find((media) => {
        if (typeof media === "string") return true;
        return media?.type === "image";
      });
  
      const imageUrl = typeof imageMedia === "string" ? imageMedia : imageMedia?.url;
  
      if (imageUrl) {
        return (
          <img
            src={imageUrl}
            alt={product.altTitle || "product"}
            title={product.altTitle || "product"}
            className="w-full h-28 sm:h-32 md:h-36 object-contain p-2 rounded-t-lg"
          />
        );
      }
    }
  
    // Fallback in case no image found
    return (
      <div className="w-full h-28 sm:h-32 md:h-36 flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-t-lg">
        No Image
      </div>
    );
  };
  if (loading) return <p className="text-center text-lg">Loading related products...</p>;
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;
  if (!related.length) return null;

  const productsToShow = related.slice(0, maxProducts);

  return (
    <div className="px-4 py-6 flex justify-center">
      <div className="w-full max-w-screen-xl bg-white shadow-md rounded-xl p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-xl font-semibold text-gray-800">
            Related to items you've viewed
          </h3>
          {related.length > maxProducts && (
            <button
              onClick={() => navigate("/related-products")}
              className="text-blue-600 text-sm hover:underline whitespace-nowrap"
            >
              See More
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {productsToShow.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/product/${item._id}`)}
            >
             {renderMedia(item)}              
		<div className="px-2 py-2 text-xs sm:text-sm">
                <h4 className="font-medium text-gray-800 truncate">{item.productName}</h4>
                <div className="flex items-center mt-1">
                  <p className="mr-2 text-red-600 font-semibold text-xs sm:text-sm">
                    {displayINRCurrency(item.sellingPrice)}
                  </p>
                  <p className="text-gray-400 line-through text-[10px] sm:text-xs">
                    {displayINRCurrency(item.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;



