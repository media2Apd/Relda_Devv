import React, { useContext, useEffect, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import { useNavigate } from "react-router-dom";
import VerticalCard from "./VerticalCard";

const CategoryWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetchCategoryWiseProduct(category);
      if (res?.data) {
        setData(res.data.sort((a, b) => a.isHidden - b.isHidden));
      }
      setLoading(false);
    };
    fetchData();
  }, [category]);

  const handleAddToCart = async (e, id) => {
    e.stopPropagation(); // 🔥 IMPORTANT
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  return (
    <div className="container mx-auto px-1 md:px-4 my-6">
      <h1 className="text-xl md:text-2xl font-semibold py-4">
        {heading}
      </h1>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <VerticalCard key={index} loading={true} />
                ))
              ) : data.length > 0 ? (
              data.map((product) => (
                  <VerticalCard
                    key={product._id}
                    product={product}
                    onClick={() => navigate(`/product/${product._id}`)}
                    actionSlot={
                      product.isHidden || product.availability === 0 ? (
                        <button
                          className="w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product._id}`);
                          }}
                        >
                          Enquiry Now
                        </button>
                      ) : (
                        <button
                          className="w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm"
                          onClick={(e) =>
                            handleAddToCart(e, product._id)
                          }
                        >
                          Add to Cart
                        </button>
                      )
                    }
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <svg
                    className='mx-auto h-24 w-24 text-brand-textMuted mb-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                    />
                  </svg>
                  <p className="text-brand-primaryTextMuted text-lg">
                    {`No products found`}
                  </p>
                </div>
              )}
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;

// import React, { useContext, useEffect, useState } from 'react';
// import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
// import displayINRCurrency from '../helpers/displayCurrency';
// import { Link } from 'react-router-dom';
// import addToCart from '../helpers/addToCart';
// import Context from '../context';
// import scrollTop from '../helpers/scrollTop';

// const CategoryWiseProductDisplay = ({ category, heading }) => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const loadingList = new Array(13).fill(null);

//     const { fetchUserAddToCart } = useContext(Context);

//     const handleAddToCart = async (e, id) => {
//         e.preventDefault();
//         await addToCart(id);
//         fetchUserAddToCart();
//     };

//     const fetchData = async () => {
//         setLoading(true);
//         const categoryProduct = await fetchCategoryWiseProduct(category);
//         if (categoryProduct && categoryProduct.data) {
//             // Sort by isHidden: false first, then isHidden: true
//             const sortedProducts = categoryProduct.data.sort((a, b) => a.isHidden - b.isHidden);
//             setData(sortedProducts);
//         }

//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchData();
//     }, [category]);

//     const renderMedia = (media, data) => {
//         if (!media) return null;

//         if (typeof media === 'string' || media?.type === 'image') {
//             // Render image
//             return (
//                 <img
//                     src={media.url || media}
//                     alt={data?.altTitle || 'product'}
//                     title={data?.altTitle || 'product'}
//                     className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
//                 />
//             );
//         }

//         return null; // Ignore videos or other non-image types
//     };

//     const getFirstImage = (productImages) => {
//         if (Array.isArray(productImages)) {
//             return productImages.find(
//                 (media) => typeof media === 'string' || media?.type === 'image'
//             );
//         }
//         return null;
//     };

//     return (
//         <div className="container mx-auto px-1 md:px-4 my-6">
//             <h1 className="text-xl md:text-2xl font-semibold py-4">{heading}</h1>
//             <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 md:gap-6 overflow-x-auto pb-4">
//                 {loading ? (
//                     loadingList.map((_, index) => (
//                         <div
//                             className="w-full min-w-[280px] md:min-w-[320px] bg-white rounded-sm shadow"
//                             key={index}
//                         >
//                             <div className="bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse"></div>
//                             <div className="p-4 grid gap-3">
//                                 <div className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black animate-pulse rounded-full bg-slate-200 h-6"></div>
//                                 <div className="capitalize text-slate-500 animate-pulse rounded-full bg-slate-200 h-6"></div>
//                                 <div className="flex gap-3">
//                                     <div className="text-red-600 font-medium animate-pulse rounded-full bg-slate-200 h-6 w-full"></div>
//                                     <div className="text-slate-500 line-through animate-pulse rounded-full bg-slate-200 h-6 w-full"></div>
//                                 </div>
//                                 <div className="text-sm text-white px-3 rounded-full bg-slate-200 h-8 animate-pulse"></div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     data.map((product) => (
//                         <Link
//                             to={`/product/${product?._id}`}
//                             className="min-w-[280px] max-w-[320px] bg-white rounded-sm shadow"
//                             onClick={scrollTop}
//                             key={product?._id}
//                         >
//                             <div className="bg-slate-200 h-48 p-4 flex justify-center items-center">
//                                 {renderMedia(getFirstImage(product.productImage), product)}
//                             </div>
//                             <div className="p-4 grid gap-3">
//                                 <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
//                                     {product?.productName}
//                                 </h2>
//                                 <p className="capitalize text-slate-500">{product?.category}</p>
//                                 <div className="flex gap-3">
//                                     <p className="text-red-600 font-medium">
//                                         {displayINRCurrency(product?.sellingPrice)}
//                                     </p>
//                                     <p className="text-slate-500 line-through">
//                                         {displayINRCurrency(product?.price)}
//                                     </p>
//                                     <span
//                                         className="px-2 py-1 text-xs font-medium rounded-md shadow"
//                                         style={{ backgroundColor: '#175E17', color: '#E8F5E9' }}
//                                     >
//                                         {`${Math.ceil(
//                                             ((product?.price - product?.sellingPrice) /
//                                                 product?.price) *
//                                                 100
//                                         )}% OFF`}
//                                     </span>
//                                 </div>
//                                 {product?.isHidden || product?.availability === 0 ? (
//                                     <button className="text-sm bg-[#e60000] hover:bg-red-700 text-white px-3 py-0.5 rounded-full">
//                                         Enquiry Now
//                                     </button>
//                                 ) : (
//                                     <button
//                                         className="text-sm bg-[#e60000] hover:bg-red-700 text-white px-3 py-0.5 rounded-full"
//                                         onClick={(e) => handleAddToCart(e, product?._id)}
//                                     >
//                                         Add to Cart
//                                     </button>
//                                 )}
//                             </div>
//                         </Link>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CategoryWiseProductDisplay;