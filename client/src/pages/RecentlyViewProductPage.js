// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import SummaryApi from "../common";
// import displayINRCurrency from "../helpers/displayCurrency"; 

// const RelatedProductsPage = () => {
//   const [related, setRelated] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const viewed = JSON.parse(localStorage.getItem("viewedItems")) || [];

//     if (viewed.length > 0) {
//       fetch(SummaryApi.relatedProducts(viewed).url)
//         .then((res) => res.json())
//         .then((data) => setRelated(Array.isArray(data) ? data : []))
//         .catch((error) => {
//           console.error("Error fetching related products:", error);
//           setLoading(false);
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);
//   const renderMedia = (product) => {
//     if (Array.isArray(product?.productImage)) {
//       const imageMedia = product.productImage.find((media) => {
//         if (typeof media === "string") return true;
//         return media?.type === "image";
//       });
  
//       const imageUrl = typeof imageMedia === "string" ? imageMedia : imageMedia?.url;
  
//       if (imageUrl) {
//         return (
//           <img
//             src={imageUrl}
//             alt={product.altTitle || "product"}
//             title={product.altTitle || "product"}
//             className="bject-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
//           />
//         );
//       }
//     }
  
//     // Fallback in case no image found
//     return (
//       <div className="w-full h-28 sm:h-32 md:h-36 flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-t-lg">
//         No Image
//       </div>
//     );
//   };

//   if (loading) return <p className="text-center py-8">Loading...</p>;
//   if (!related.length) return <p className="text-center py-8">No related products found.</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4 text-center">All Related Products</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//         {related.map((item) => (
//           <div
//             key={item._id}
//             className="border rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer"
//             onClick={() => navigate(`/product/${item._id}`)}
//           >
            
//             <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center">
//             {renderMedia(item)}
//                               </div>
//             <h4 className="font-medium text-gray-800 truncate">{item.productName}</h4>
//             <div className="flex items-center text-sm">
//               <p className="text-red-600 font-semibold mr-2">{displayINRCurrency(item.sellingPrice)}</p>
//               <p className="line-through text-gray-400">{displayINRCurrency(item.price)}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RelatedProductsPage;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import SummaryApi from "../common";
// import ProductCard from "./ProductCard";

// const RecentlyViewProductPage = () => {
//   const [related, setRelated] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const viewed = JSON.parse(localStorage.getItem("viewedItems")) || [];
//     if (viewed.length) {
//       fetch(SummaryApi.relatedProducts(viewed).url)
//         .then(res => res.json())
//         .then(data => setRelated(Array.isArray(data) ? data : []))
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   if (loading) return <p className="text-center py-10">Loading...</p>;
//   if (!related.length)
//     return <p className="text-center py-10">No related products found</p>;

//   return (
//     <div className="mx-auto px-4 py-4">
//       <h1 className="text-2xl font-semibold mb-6">
//         All Related Products
//       </h1>

//       {/* RESPONSIVE GRID */}
//       <div
//         className="
//           grid gap-5
//           grid-cols-1
//           md:grid-cols-2
//           lg:grid-cols-3
//           xl:grid-cols-4
//         "
//       >
//         {related.map(product => (
//           <ProductCard
//             key={product._id}
//             product={product}
//             variant="grid"   // 👈 IMPORTANT
//             onClick={() => navigate(`/product/${product._id}`)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RecentlyViewProductPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import VerticalCard from "../components/VerticalCard";

const RecentlyViewProductPage = () => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("viewedItems")) || [];
    if (viewed.length) {
      fetch(SummaryApi.relatedProducts(viewed).url)
        .then(res => res.json())
        .then(data => setRelated(Array.isArray(data) ? data : []))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!related.length)
    return <p className="text-center py-10">No related products found</p>;

  return (
    <div className="mx-auto px-4 py-4">
      <h1 className="text-2xl font-semibold mb-6">
        Recently Viewed Products
      </h1>

      {/* RESPONSIVE GRID */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {related.map(product => (
          <VerticalCard
            key={product._id}
            product={product}
            onClick={() => navigate(`/product/${product._id}`)}
            actionSlot={
              <button
                className="w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation(); // 🔥 stop card click
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
  );
};

export default RecentlyViewProductPage;
