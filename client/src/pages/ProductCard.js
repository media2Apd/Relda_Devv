import { useNavigate } from "react-router-dom";
import displayINRCurrency from "../helpers/displayCurrency";

const ProductCard = ({ product, onClick, actionSlot, loading }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (loading) return;
    if (onClick) onClick(product);
    else navigate(`/product/${product._id}`);
  };

    if (loading) {
    return (
      <div className="flex flex-col w-full bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        <div className="bg-slate-200 h-[200px] animate-pulse"></div>
        <div className="flex flex-col p-4 gap-2">
          <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2 mt-2"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="h-9 bg-slate-200 rounded animate-pulse mt-2"></div>
        </div>
      </div>
    );
  }

    // Get first image from productImage array
  const getProductImage = () => {
    if (!product?.productImage || product.productImage.length === 0) {
      return "/no-image.png";
    }

    const firstImage = product.productImage[0];
    
    if (typeof firstImage === "string") {
      return firstImage;
    }
    
    if (firstImage?.url) {
      return firstImage.url;
    }
    
    return "/no-image.png";
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        flex flex-col
        w-full min-w-[260px] md:min-w-[300px]
        max-w-[320px]
        bg-white rounded-2xl
        border border-brand-productCardBorder
        overflow-hidden
        cursor-pointer
        transition-shadow duration-200
      "
    >
      {/* IMAGE (FIXED HEIGHT) */}
      <div className="bg-brand-productCardImageBg h-[200px] flex items-center justify-center p-4">
        <img
          src={getProductImage()}
          alt={product.productName}
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = "/no-image.png";
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col px-3 py-4 md:p-4 gap-2 flex-1">
        {/* Title */}
        <h4 className="font-medium text-sm md:text-base line-clamp-2 min-h-[40px]">
          {product?.productName || "Product Name"}
        </h4>

        {/* Category */}
        <p className="text-sm font-semibold text-brand-textMuted capitalize">
          {product?.category || "Category"}
        </p>

        {/* PRICE */}
        <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
          <span className="font-semibold text-base">
            {displayINRCurrency(product.sellingPrice)}
          </span>

          <span className="text-sm line-through text-brand-textMuted">
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
            className="mt-auto pt-2"
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
