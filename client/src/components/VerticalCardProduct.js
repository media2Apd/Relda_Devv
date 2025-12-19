// import React, { useContext, useEffect, useRef, useState } from 'react'
// import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
// import displayINRCurrency from '../helpers/displayCurrency'
// import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
// import { Link } from 'react-router-dom'
// import addToCart from '../helpers/addToCart'
// import Context from '../context'
// import scrollTop from '../helpers/scrollTop'

// const VerticalCardProduct = ({category, heading}) => {
//     const [data,setData] = useState([])
//     const [loading,setLoading] = useState(true)
//     const loadingList = new Array(13).fill(null)

//     const scrollElement = useRef()

//     const { fetchUserAddToCart } = useContext(Context)

//     const handleAddToCart = async(e,id)=>{
//        await addToCart(e,id)
//        fetchUserAddToCart()
//     }

//     const fetchData = async() =>{
//         setLoading(true);

//         const categoryProduct = await fetchCategoryWiseProduct(category);
//         if (categoryProduct && categoryProduct.data) {
//             // Sort by isHidden: false first, then isHidden: true
//             const sortedProducts = categoryProduct.data.sort((a, b) => a.isHidden - b.isHidden);
//             setData(sortedProducts);
//         }

//         setLoading(false);
//     }

//     useEffect(()=>{
//         fetchData()
//     },[])

//     const scrollRight = () =>{
//         scrollElement.current.scrollLeft += 300
//     }
//     const scrollLeft = () =>{
//         scrollElement.current.scrollLeft -= 300
//     }


//   return (
//     <div className='container mx-auto px-4 my-6 relative'>
//         <h2 className='text-2xl font-semibold py-4'>{heading}</h2>           
//         <div className='flex flex-col md:flex-row items-center gap-2 md:gap-6 overflow-x-scroll scrollbar-none transition-all' ref={scrollElement}>
//             <button  className='bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block' onClick={scrollLeft}><FaAngleLeft/></button>
//             <button  className='bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block' onClick={scrollRight}><FaAngleRight/></button> 

//             {loading ? (
//                     loadingList.map((product,index)=>{
//                         return(
//                             <div className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow' key={index}>
//                                 <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
//                                 </div>
//                                 <div className='p-4 grid gap-3'>
//                                     <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'> </h2>
//                                     <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2'></p>
//                                     <div className='flex gap-3'>
//                                         <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
//                                         <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
//                                     </div>
//                                     <button className='text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse'></button>
//                                 </div>
//                             </div>
//                         )
//                     })
//                 ) : (
//                     data.map((product,index)=>{
//                         return(
//                             <Link to={`/product/${product?._id}`} className='w-full min-w-[280px] md:min-w-[320px] max-w-[400px] md:max-w-[320px]  bg-white rounded-sm shadow' onClick={scrollTop} key={product?._id}>
//                                 <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
//                                     <img src={product.productImage[0]} alt="product" className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply'/>
//                                 </div>
//                                 <div className='p-2 md:p-4 grid gap-3'>
//                                     <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
//                                     <p className='capitalize text-slate-500'>{product?.category}</p>
//                                     <div className='flex flex-wrap gap-2 md:gap-3'>
//                                         <p className='text-red-600 font-medium'>{ displayINRCurrency(product?.sellingPrice) }</p>
//                                         <p className='text-slate-500 line-through'>{ displayINRCurrency(product?.price)  }</p>
//                                         <span
//                                             className="px-2 py-1 text-xs font-medium rounded-md shadow"
//                                             style={{ backgroundColor: "#175E17", color: "#E8F5E9" }}
//                                             >
//                                             {`${Math.ceil(
//                                                 ((product?.price - product?.sellingPrice) / product?.price) * 100
//                                             )}% OFF`}
//                                         </span>

//                                     </div>
//                                     {product?.isHidden || product?.availability === 0 ? (<button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' >Enquiry Now</button>) : (<button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>)}
//                                 </div>
//                             </Link>
//                         )
//                     })
//                 )       
//             }
//         </div>
//     </div>
//   )
// }

// export default VerticalCardProduct

import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';

const VerticalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(13).fill(null);

    const scrollElement = useRef();

    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id);
        fetchUserAddToCart();
    };

    const fetchData = async () => {
        setLoading(true);

        const categoryProduct = await fetchCategoryWiseProduct(category);
        if (categoryProduct && categoryProduct.data) {
            // Sort by isHidden: false first, then isHidden: true
            const sortedProducts = categoryProduct.data.sort((a, b) => a.isHidden - b.isHidden);
            setData(sortedProducts);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const scrollRight = () => {
        scrollElement.current.scrollLeft += 300;
    };
    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 300;
    };

    const renderMedia = (product) => {
        if (Array.isArray(product?.productImage)) {
            // Filter to include only images
            const imageMedia = product.productImage.find((media) => {
                if (typeof media === 'string') {
                    return true; // Direct URL (string assumed to be an image)
                }
                return media?.type === 'image'; // Object with type 'image'
            });

            if (typeof imageMedia === 'string') {
                return (
                    <img
                        src={imageMedia}
                        alt={product?.altTitle || 'product'}
                        title={product?.altTitle || 'product'}
                        className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                    />
                );
            } else if (imageMedia?.url) {
                return (
                    <img
                        src={imageMedia.url}
                        alt={product?.altTitle || 'product'}
                        title={product?.altTitle || 'product'}
                        className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                    />
                );
            }
        }

        // Fallback if no valid image is found
        return (
            <img
                src="https://via.placeholder.com/150"
                alt="placeholder"
                className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
            />
        );
    };

    return (
        <div className="container mx-auto px-4 my-6 relative">
            <h2 className="text-2xl font-semibold py-4">{heading}</h2>
            <div
                className="flex flex-row items-center gap-2 md:gap-6 overflow-x-scroll scrollbar-none transition-all"
                ref={scrollElement}
            >
                <button
                    className="bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block"
                    onClick={scrollLeft}
                >
                    <FaAngleLeft />
                </button>
                <button
                    className="bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block"
                    onClick={scrollRight}
                >
                    <FaAngleRight />
                </button>

                {loading
                    ? loadingList.map((product, index) => (
                          <div
                              className="w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow"
                              key={index}
                          >
                              <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse"></div>
                              <div className="p-4 grid gap-3">
                                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200"> </h2>
                                  <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2"></p>
                                  <div className="flex gap-3">
                                      <p className="text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2"></p>
                                      <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2"></p>
                                  </div>
                                  <button className="text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse"></button>
                              </div>
                          </div>
                      ))
                    : data.map((product, index) => (
                          <Link
                              to={`/product/${product?._id}`}
                              className="w-full min-w-[280px] md:min-w-[320px] max-w-[400px] md:max-w-[320px]  bg-white rounded-sm shadow"
                              onClick={scrollTop}
                              key={product?._id}
                          >
                              <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center">
                                  {renderMedia(product)}
                              </div>
                              <div className="p-2 md:p-4 grid gap-3">
                                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                                      {product?.productName}
                                  </h2>
                                  <p className="capitalize text-slate-500">{product?.category}</p>
                                  <div className="flex flex-wrap gap-2 md:gap-3">
                                      <p className="text-red-600 font-medium">
                                          {displayINRCurrency(product?.sellingPrice)}
                                      </p>
                                      <p className="text-slate-500 line-through">
                                          {displayINRCurrency(product?.price)}
                                      </p>
                                      <span
                                          className="px-2 py-1 text-xs font-medium rounded-md shadow"
                                          style={{ backgroundColor: '#175E17', color: '#E8F5E9' }}
                                      >
                                          {`${Math.ceil(
                                              ((product?.price - product?.sellingPrice) /
                                                  product?.price) *
                                                  100
                                          )}% OFF`}
                                      </span>
                                  </div>
                                  {product?.isHidden || product?.availability === 0 ? (
                                      <button className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full">
                                          Enquiry Now
                                      </button>
                                  ) : (
                                      <button
                                          className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full"
                                          onClick={(e) => handleAddToCart(e, product?._id)}
                                      >
                                          Add to Cart
                                      </button>
                                  )}
                              </div>
                          </Link>
                      ))}
            </div>
        </div>
    );
};

export default VerticalCardProduct;