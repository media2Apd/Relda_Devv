import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency"; 

const RelatedProductsPage = () => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("viewedItems")) || [];

    if (viewed.length > 0) {
      fetch(SummaryApi.relatedProducts(viewed).url)
        .then((res) => res.json())
        .then((data) => setRelated(Array.isArray(data) ? data : []))
        .catch((error) => {
          console.error("Error fetching related products:", error);
          setLoading(false);
        })
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
            className="bject-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
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

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (!related.length) return <p className="text-center py-8">No related products found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">All Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {related.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/product/${item._id}`)}
          >
            
            <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center">
            {renderMedia(item)}
                              </div>
            <h4 className="font-medium text-gray-800 truncate">{item.productName}</h4>
            <div className="flex items-center text-sm">
              <p className="text-red-600 font-semibold mr-2">{displayINRCurrency(item.sellingPrice)}</p>
              <p className="line-through text-gray-400">{displayINRCurrency(item.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsPage;
