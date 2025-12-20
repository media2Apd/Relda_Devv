import { useNavigate } from "react-router-dom";
import topSellingProducts from "../hooks/topSellingDummy";

const TopSellingProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pb-6">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-medium mb-4">
        Top Selling Products
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {topSellingProducts.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.slug)}
            className="
              relative cursor-pointer
              rounded-2xl overflow-hidden
              group
            "
          >
            {/* Image */}
            <img
              src={item.image}
              alt={`${item.titleRed} ${item.titleWhite}`}
              className="
                w-full h-[320px] md:h-full
                object-contain
                transition-transform duration-500
                group-hover:scale-105
              "
            />

            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-black/20" /> */}

            {/* Text */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold leading-tight">
                  <span className="text-brand-primary">
                    {item.titleRed}
                  </span>
                  <br />
                  <span className="text-white">
                    {item.titleWhite}
                  </span>
                </h3>
              </div>

              {/* Subtitle */}
              <p className="text-sm text-white">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
