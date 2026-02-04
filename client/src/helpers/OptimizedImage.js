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
}) => {
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
      className={className}
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
    />
  );
};

export default OptimizedImage;
