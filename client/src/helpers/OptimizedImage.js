const OptimizedImage = ({
  src,
  srcSet,
  sizes,
  alt = "",
  title = "",
  width,
  height,
  className = "",
  fallback = "/no-image.png",
  onClick,
}) => {
  const isClickable = typeof onClick === "function";

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      title={title}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={`${className} ${isClickable ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                onClick(e);
              }
            }
          : undefined
      }
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
    />
  );
};

export default OptimizedImage;
