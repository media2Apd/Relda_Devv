// import React, { useContext } from 'react'
// import scrollTop from '../helpers/scrollTop'
// import displayINRCurrency from '../helpers/displayCurrency'
// import Context from '../context'
// import addToCart from '../helpers/addToCart'
// import { Link } from 'react-router-dom'

// const VerticalCard = ({loading,data = []}) => {
//     const loadingList = new Array(13).fill(null)
//     const { fetchUserAddToCart } = useContext(Context)

//     const handleAddToCart = async(e,id)=>{
//        await addToCart(e,id)
//        fetchUserAddToCart()
//     }

//   return (
//     <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,400px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all'>
//     {

//          loading ? (
//              loadingList.map((product,index)=>{
//                  return(
//                      <div className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow '>
//                          <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
//                          </div>
//                          <div className='p-4 grid gap-3'>
//                              <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'> </h2>
//                              <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2'></p>
//                              <div className='flex gap-3'>
//                                  <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
//                                  <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
//                              </div>
//                              <button className='text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse'></button>
//                          </div>
//                      </div>
//                  )
//              })
//          ) : (
//              data.map((product,index)=>{
//                  return(
//                      <Link to={"/product/"+product?._id} key={product?._id} className='w-full min-w-[280px] md:min-w-[300px] max-w-[400px] md:max-w-[300px] bg-white rounded-sm shadow ' onClick={scrollTop}>
//                          <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
//                              <img src={product?.productImage[0]} alt="product" className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply'/>
//                          </div>
//                          <div className='p-4 grid gap-3'>
//                              <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
//                              <p className='capitalize text-slate-500'>{product?.category}</p>
//                              <div className='flex gap-3'>
//                                 <p className='text-red-600 font-medium'>{ displayINRCurrency(product?.sellingPrice) }</p>
//                                 <p className='text-slate-500 line-through'>{ displayINRCurrency(product?.price) }</p>
// 				                <span
//                                     className="px-2 py-1 text-xs font-medium rounded-md shadow"
//                                     style={{ backgroundColor: "#175E17", color: "#E8F5E9" }}
//                                     >
//                                     {`${Math.ceil(
//                                         ((product?.price - product?.sellingPrice) / product?.price) * 100
//                                     )}% OFF`}
//                                 </span>
//                              </div>
//                              {product?.isHidden || product?.availability === 0 ? (<button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' >Enquiry Now</button>) : (<button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>)}
//                          </div>
//                      </Link>
//                  )
//              })
//          )
         
//      }
//     </div>
//   )
// }

// export default VerticalCard
// import React, { useContext } from 'react';
// import scrollTop from '../helpers/scrollTop';
// import displayINRCurrency from '../helpers/displayCurrency';
// import Context from '../context';
// import addToCart from '../helpers/addToCart';
// import { Link } from 'react-router-dom';

// const VerticalCard = ({ loading, data }) => {
//   const { fetchUserAddToCart } = useContext(Context);

//   const handleAddToCart = async (e, id) => {
//     await addToCart(e, id);
//     fetchUserAddToCart();
//   };

//   if (loading) {
//     return (
//       <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow'>
//         <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'></div>
//         <div className='p-4 grid gap-3'>
//           <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'></h2>
//           <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2'></p>
//           <div className='flex gap-3'>
//             <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
//             <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
//           </div>
//           <button className='text-sm text-white px-3 rounded-full bg-slate-200 py-2 animate-pulse'></button>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return null; // or return a placeholder/error message
//   }

//   return (
//     <Link to={"/product/" + data?._id} className='w-full min-w-[200px]  max-w-[100%]  bg-white rounded-sm shadow' onClick={scrollTop}>
//       <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
//         <img src={data?.productImage[0]} alt="product" className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
//       </div>
//       <div className='p-4 grid gap-3'>
//         <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{data?.productName}</h2>
//         <p className='capitalize text-slate-500'>{data?.category}</p>
//         <div className='flex gap-3'>
//           <p className='text-red-600 font-medium'>{displayINRCurrency(data?.sellingPrice)}</p>
//           <p className='text-slate-500 line-through'>{displayINRCurrency(data?.price)}</p>
//           <span
//             className="px-2 py-1 text-xs font-medium rounded-md shadow"
//             style={{ backgroundColor: "#175E17", color: "#E8F5E9" }}
//           >
//             {`${Math.ceil(
//               ((data?.price - data?.sellingPrice) / data?.price) * 100
//             )}% OFF`}
//           </span>
//         </div>
//         {data?.isHidden || data?.availability === 0 ? (
//           <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full'>Enquiry Now</button>
//         ) : (
//           <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e) => handleAddToCart(e, data?._id)}>
//             Add to Cart
//           </button>
//         )}
//       </div>
//     </Link>
//   );
// };

// // export default VerticalCard;
// import React, { useContext } from 'react';
// import scrollTop from '../helpers/scrollTop';
// import displayINRCurrency from '../helpers/displayCurrency';
// import Context from '../context';
// import addToCart from '../helpers/addToCart';
// import { Link } from 'react-router-dom';

// const VerticalCard = ({ loading, data }) => {
//   const { fetchUserAddToCart } = useContext(Context);

//   const handleAddToCart = async (e, id) => {
//     await addToCart(e, id);
//     fetchUserAddToCart();
//   };

//   if (loading) {
//     return (
//       <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow'>
//         <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'></div>
//         <div className='p-4 grid gap-3'>
//           <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'></h2>
//           <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2'></p>
//           <div className='flex gap-3'>
//             <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
//             <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
//           </div>
//           <button className='text-sm text-white px-3 rounded-full bg-slate-200 py-2 animate-pulse'></button>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return null; // or return a placeholder/error message
//   }

//   const renderMedia = () => {
//     // console.log('productImage:', data?.productImage); // Log the entire array
//     if (Array.isArray(data?.productImage)) {
//       const imageMedia = data.productImage.find((media) => {
//         // console.log('Checking media:', media); // Log each media item
//         if (typeof media === 'string') {
//           // console.log('Found string image URL:', media);
//           return true; // Assume string is an image URL
//         }
//         if (media?.type === 'image') {
//           // console.log('Found object image URL:', media.url);
//           return true; // Object with type 'image'
//         }
//         return false;
//       });

//       if (typeof imageMedia === 'string') {
//         // console.log('Rendering string image URL:', imageMedia);
//         return (
//           <img
//             src={imageMedia}
//             alt={data?.altTitle || 'product'}
//             title={data?.altTitle || 'product'}
//             className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
//           />
//         );
//       } else if (imageMedia?.url) {
//         // console.log('Rendering object image URL:', imageMedia.url);
//         return (
//           <img
//             src={imageMedia.url}
//             alt={data?.altTitle || 'product'}
//             title={data?.altTitle || 'product'}
//             className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
//           />
//         );
//       }
//     }
//     // console.log('No valid image found');
//     return (
//       <img
//         src="https://via.placeholder.com/150"
//         alt="placeholder"
//         className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
//       />
//     );
//   };

//   return (
//     <Link to={"/product/" + data?._id} className='w-full min-w-[200px] max-w-[100%] bg-white rounded-sm shadow' onClick={scrollTop}>
//       <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
//         {renderMedia()}
//       </div>
//       <div className='p-4 grid gap-3'>
//         <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{data?.productName}</h2>
//         <h1 className='capitalize text-slate-500'>{data?.category}</h1>
//         <div className='flex gap-3'>
//           <h3 className='text-red-600 font-medium'>{displayINRCurrency(data?.sellingPrice)}</h3>
//           <h4 className='text-slate-500 line-through'>{displayINRCurrency(data?.price)}</h4>
//           <span
//             className="px-2 py-1 text-xs font-medium rounded-md shadow"
//             style={{ backgroundColor: "#175E17", color: "#E8F5E9" }}
//           >
//             {`${Math.ceil(
//               ((data?.price - data?.sellingPrice) / data?.price) * 100
//             )}% OFF`}
//           </span>
//         </div>
//         {data?.isHidden || data?.availability === 0 ? (
//           <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full'>Enquiry Now</button>
//         ) : (
//           <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e) => handleAddToCart(e, data?._id)}>
//             Add to Cart
//           </button>
//         )}
//       </div>
//     </Link>
//   );
// };

// export default VerticalCard;

import { useNavigate } from "react-router-dom";
import displayINRCurrency from "../helpers/displayCurrency";

const VerticalCard = ({ product, onClick, actionSlot, loading }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (loading) return;
    if (onClick) onClick(product);
    else navigate(`/product/${product._id}`);
  };

  // Loading skeleton
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
      className="flex flex-col w-full bg-white rounded-2xl border border-brand-productCardBorder overflow-hidden cursor-pointer transition-shadow duration-200"
    >
      {/* IMAGE */}
      <div className="bg-brand-productCardImageBg h-[200px] flex items-center justify-center p-4 overflow-hidden">
        <img
          src={getProductImage()}
          alt={product?.productName || "Product"}
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = "/no-image.png";
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col p-4 gap-2 flex-1">
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
            {displayINRCurrency(product?.sellingPrice || 0)}
          </span>

          {product?.price && product.price !== product?.sellingPrice && (
            <>
              <span className="text-sm line-through text-brand-textMuted">
                {displayINRCurrency(product.price)}
              </span>

              <span className="text-[11px] bg-brand-offer text-white px-2 py-0.5 rounded-md">
                {Math.ceil(
                  ((product.price - product.sellingPrice) / product.price) * 100
                )}% OFF
              </span>
            </>
          )}
        </div>

        {/* BUTTON */}
        {actionSlot && (
          <div className="mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
            {actionSlot}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalCard;