// import { useNavigate } from "react-router-dom";
// import displayINRCurrency from "../helpers/displayCurrency";

// const ProductCard = ({
//   product,
//   onClick,
//   showButton = true,
//   buttonText = "View Product",
// }) => {
//   const navigate = useNavigate();

//   const handleCardClick = () => {
//     if (onClick) {
//       onClick(product);
//     } else {
//       navigate(`/product/${product._id}`);
//     }
//   };

//   return (
//     // <div
//     //   onClick={handleCardClick}
//     //   className="w-full min-w-[280px] md:min-w-[320px] max-w-[400px] md:max-w-[320px] bg-white rounded-sm border border-sm border-1 border-color-gray-100"
//     // >
//     <div
//   onClick={handleCardClick}
//   className="
//     w-full min-w-[280px] md:min-w-[320px]
//     max-w-[400px] md:max-w-[320px]
//     bg-white
//     rounded-2xl
//     border border-[#E5E5E5]
//     overflow-hidden
//   "
// >

//       {/* Image */}
//       <div className="bg-brand-productCardImageBg p-4 rounded-t-[14px] flex justify-center items-center">
//         <img
//           src={
//             typeof product?.productImage?.[0] === "string"
//               ? product.productImage[0]
//               : product?.productImage?.[0]?.url
//           }
//           alt={product.productName}
//           className="h-[200px] object-contain"
//         />
//       </div>

//       {/* Content */}
//       <div className="p-4 md:p-6 grid gap-3">
//         <h4 className="font-medium text-base md:text-lg line-clamp-1">
//           {product.productName}
//         </h4>

//         <p className="capitalize text-brand-textMuted">
//           {product.category || "LED TV's"}
//         </p>

//         <div className="flex items-center gap-2 mt-2">
//           <span className="font-semibold text-sm md:text-base">
//             {displayINRCurrency(product.sellingPrice)}
//           </span>

//           <span className="text-xs md:text-sm line-through text-brand-textMuted">
//             {displayINRCurrency(product.price)}
//           </span>

//           <span className="text-[11px] bg-brand-offer text-white px-2 py-0.5 rounded-sm">
//             {`${Math.ceil(
//               ((product.price - product.sellingPrice) / product.price) * 100
//             )}% OFF`}
//           </span>
//         </div>

//         {showButton && (
//           <button className="mt-auto bg-brand-primary text-white py-2 rounded-md text-sm font-medium">
//             {buttonText}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import { useNavigate } from "react-router-dom";
import displayINRCurrency from "../helpers/displayCurrency";

const ProductCard = ({
  product,
  onClick,
  actionSlot,   // 👈 custom button area
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    } else {
      navigate(`/product/${product._id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        w-full min-w-[280px] md:min-w-[320px]
        max-w-[400px] md:max-w-[320px]
        bg-white rounded-2xl
        border border-[#E5E5E5]
        overflow-hidden
        cursor-pointer
        transition
      "
    >
      {/* Image */}
      <div className="bg-brand-productCardImageBg p-4 flex justify-center items-center">
        <img
          src={
            typeof product?.productImage?.[0] === "string"
              ? product.productImage[0]
              : product?.productImage?.[0]?.url
          }
          alt={product.productName}
          className="h-[200px] object-contain"
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 grid gap-3">
        <h4 className="font-medium text-base md:text-lg line-clamp-1">
          {product.productName}
        </h4>

        <p className="capitalize text-brand-textMuted">
          {product.category}
        </p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="font-semibold text-sm md:text-base">
            {displayINRCurrency(product.sellingPrice)}
          </span>

          <span className="text-xs md:text-sm line-through text-brand-textMuted">
            {displayINRCurrency(product.price)}
          </span>

          <span className="text-[11px] bg-brand-offer text-white px-2 py-0.5 rounded-md">
            {`${Math.ceil(
              ((product.price - product.sellingPrice) / product.price) * 100
            )}% OFF`}
          </span>
        </div>

        {/*  CUSTOM ACTION SLOT */}
        {actionSlot && (
          <div
          className="mt-1"
            onClick={(e) => e.stopPropagation()} 
          >
            {actionSlot}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
