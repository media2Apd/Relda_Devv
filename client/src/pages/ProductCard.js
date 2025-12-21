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

// import { useNavigate } from "react-router-dom";
// import displayINRCurrency from "../helpers/displayCurrency";

// const ProductCard = ({
//   product,
//   onClick,
//   actionSlot,   // 👈 custom button area
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
//     <div
//       onClick={handleCardClick}
//       className="
//         w-full min-w-[280px] md:min-w-[320px]
//         max-w-[400px] md:max-w-[320px]
//         bg-white rounded-2xl
//         border border-[#E5E5E5]
//         overflow-hidden
//         cursor-pointer
//         transition
//       "
//     >
//       {/* Image */}
//       <div className="bg-brand-productCardImageBg p-4 flex justify-center items-center">
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
//           {product.category}
//         </p>

//         <div className="flex items-center gap-2 mt-1 flex-wrap">
//           <span className="font-semibold text-sm md:text-base">
//             {displayINRCurrency(product.sellingPrice)}
//           </span>

//           <span className="text-xs md:text-sm line-through text-brand-textMuted">
//             {displayINRCurrency(product.price)}
//           </span>

//           <span className="text-[11px] bg-brand-offer text-white px-2 py-0.5 rounded-md">
//             {`${Math.ceil(
//               ((product.price - product.sellingPrice) / product.price) * 100
//             )}% OFF`}
//           </span>
//         </div>

//         {/*  CUSTOM ACTION SLOT */}
//         {actionSlot && (
//           <div
//           className="mt-1"
//             onClick={(e) => e.stopPropagation()} 
//           >
//             {actionSlot}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import { useNavigate } from "react-router-dom";
import displayINRCurrency from "../helpers/displayCurrency";

const ProductCard = ({ product, onClick, actionSlot }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) onClick(product);
    else navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        flex flex-col
        w-full min-w-[260px] md:min-w-[300px]
        max-w-[320px]
        bg-white rounded-2xl
        border border-[#E5E5E5]
        overflow-hidden
        cursor-pointer
        transition
      "
    >
      {/* IMAGE (FIXED HEIGHT) */}
      <div className="bg-brand-productCardImageBg h-[200px] flex items-center justify-center p-4">
        <img
          src={
            typeof product?.productImage?.[0] === "string"
              ? product.productImage[0]
              : product?.productImage?.[0]?.url
          }
          alt={product.productName}
          className="max-h-full object-contain"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col p-4 gap-2 flex-1">
        {/* Title */}
        <h4 className="font-medium text-sm md:text-base line-clamp-2 min-h-[40px]">
          {product.productName}
        </h4>

        {/* Category */}
        <p className="text-xs text-brand-textMuted">
          {product.category}
        </p>

        {/* PRICE */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="font-semibold text-sm">
            {displayINRCurrency(product.sellingPrice)}
          </span>

          <span className="text-xs line-through text-brand-textMuted">
            {displayINRCurrency(product.price)}
          </span>

          <span className="text-[11px] bg-brand-offer text-white px-2 py-0.5 rounded-md">
            {`${Math.ceil(
              ((product.price - product.sellingPrice) / product.price) * 100
            )}% OFF`}
          </span>
        </div>

        {/* BUTTON – ALWAYS AT BOTTOM */}
        {actionSlot && (
          <div
            className="mt-auto"
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
