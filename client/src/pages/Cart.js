// import React, { useContext, useEffect, useState } from "react";
// import SummaryApi from "../common";
// import Context from "../context";
// import displayINRCurrency from "../helpers/displayCurrency";
// import { MdDelete } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FiMinus, FiPlus } from "react-icons/fi";

// const Cart = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const context = useContext(Context);
//   const navigate = useNavigate();
//   const loadingCart = new Array(4).fill(null);


//   // Fetch cart data
//   const fetchData = async () => {
//     try {
//       const response = await fetch(SummaryApi.addToCartProductView.url, {
//         method: SummaryApi.addToCartProductView.method,
//         credentials: "include",
//         headers: {
//           "content-type": "application/json",
//         },
//       });
//       const responseData = await response.json();
//       if (responseData.success) {
//         setData(responseData.data);
//       }
//     } catch (error) {
//       console.error("Error fetching cart data:", error);
//     }
//     // console.log(setData);
//   };

//   // Initial fetch on component mount
//   useEffect(() => {
//     setLoading(true);
//     fetchData().finally(() => setLoading(false));
//   }, []);

//   // Increase quantity
//   const increaseQty = async (id, qty) => {
//     try {
//       const response = await fetch(SummaryApi.updateCartProduct.url, {
//         method: SummaryApi.updateCartProduct.method,
//         credentials: "include",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify({
//           _id: id,
//           quantity: qty + 1,
//         }),
//       });

//       const responseData = await response.json();
//       if (responseData.success) {
//         fetchData();
//       }
//       toast.error(responseData.message);
//     } catch (error) {
//       console.error("Error increasing quantity:", error);
//     }
//   };

//   // Decrease quantity
//   const decreaseQty = async (id, qty) => {
//     if (qty > 1) {
//       try {
//         const response = await fetch(SummaryApi.updateCartProduct.url, {
//           method: SummaryApi.updateCartProduct.method,
//           credentials: "include",
//           headers: {
//             "content-type": "application/json",
//           },
//           body: JSON.stringify({
//             _id: id,
//             quantity: qty - 1,
//           }),
//         });

//         const responseData = await response.json();
//         if (responseData.success) {
//           fetchData();
//         }
//       } catch (error) {
//         console.error("Error decreasing quantity:", error);
//       }
//     }
//   };

//   // Delete a product from cart
//   const deleteCartProduct = async (id) => {
//     try {
//       const response = await fetch(SummaryApi.deleteCartProduct.url, {
//         method: SummaryApi.deleteCartProduct.method,
//         credentials: "include",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify({
//           _id: id,
//         }),
//       });

//       const responseData = await response.json();
//       if (responseData.success) {
//         fetchData();
//         context.fetchUserAddToCart(); // Update cart context
//       }
//     } catch (error) {
//       console.error("Error deleting cart product:", error);
//     }
//   };

//   // Handle checkout navigation
//   // const handleCheckout = () => {
//   //   const isAnyProductSoldOut = data.some((product) => product?.productId?.availability === 0);

//   //   if (isAnyProductSoldOut){
//   //      toast.error("Please Remove Sold Out Product!"); 
//   //   } else {
//   //       navigate("/checkout");
//   //   }

//   // };

//   // const handleCheckout = () => {
//   //   // 1. Sold out check
//   //   const isAnyProductSoldOut = data.some(
//   //     (product) => product?.productId?.availability === 0
//   //   );

//   //   if (isAnyProductSoldOut) {
//   //     toast.error("Please remove sold out products!");
//   //     return;
//   //   }

//   //   // 2. LOGIN CHECK (MAIN CHANGE)
//   //   if (!context?.user?._id) {
//   //     toast.warning("Please login to continue checkout");
//   //     navigate("/login", {
//   //       state: { from: "/checkout" },
//   //       replace: true,
//   //     });
//   //     return;
//   //   }

//   //   // 3. Proceed
//   //   navigate("/checkout");
//   // };

//   const handleCheckout = async () => {
//   // 1. Sold out check
//   const isAnyProductSoldOut = data.some(
//     (product) => product?.productId?.availability === 0
//   );

//   if (isAnyProductSoldOut) {
//     toast.error("Please remove sold out products!");
//     return;
//   }

//   try {
//     // 2. BACKEND AUTH CHECK (COOKIE BASED)
//     const res = await fetch(SummaryApi.current_user.url, {
//       method: SummaryApi.current_user.method,
//       credentials: "include",
//     });

//      if (!res.ok) {
//       throw new Error("Not logged in");
//     }

//     const result = await res.json();

//     if (!result?.success || !result?.data?._id) {
//       throw new Error("Not logged in");
//     }

//     // ✅ Logged-in user
//     navigate("/checkout");
//   } catch (err) {
//     toast.warning("Please login to continue checkout");
//     navigate("/login", {
//       state: { from: "/checkout" },
//     });
//   }
// };



//   // Handle delete confirmation prompt
//   const handleDeletePrompt = (id) => {
//     setSelectedProductId(id);
//   };

//   const handlePromptYes = () => {
//     deleteCartProduct(selectedProductId);
//     setSelectedProductId(null);
//   };

//   const handlePromptNo = () => {
//     setSelectedProductId(null);
//   };

//   const totalQty = data.reduce((acc, item) => acc + item.quantity, 0);
//   const totalPrice = data.reduce(
//     (acc, item) => acc + item.quantity * item?.productId?.sellingPrice,
//     0
//   );

//   return (
//     <div className="container mx-auto">
//       <div className="text-center text-lg my-3">
//         {!loading && data.length === 0 && (
//           <h1 className="bg-white py-5 font-mediumbold text-brand-textmuted">
//             Your Cart is Empty. Please add products to proceed!
//           </h1>
//         )}
//       </div>
//       <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4 ">
//         <div className="w-full max-w-3xl ">
//           {loading
//             ? loadingCart.map((_, index) => (
//               <div
//                 key={index}
//                 className="w-full bg-brand-productCardImageBg h-32 my-2 border border-slate-300 animate-pulse rounded"
//               ></div>
//             ))
//             : data.length > 0 &&
//             data.map((product) => (
//               <div
//                 key={product?._id}
//                 className={`w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr] relative ${selectedProductId === product._id ? "selected" : ""
//                   }`}
//               >
//                 <div className="w-32 h-32 bg-brand-productCardImageBg">
//                   <img
//                     src={product?.productId?.productImage[0]}
//                     alt={product?.productId?.altTitle || "product"}
//                     title={product?.productId?.altTitle || "product"}
//                     className="w-full h-full object-scale-down mix-blend-multiply"
//                     // alt={product?.productId?.productName}
//                   />
//                 </div>
//                 <div className="px-4 py-2 relative">
//                   <div
//                     className="absolute right-0 text-brand-primary rounded-full p-2 hover:bg-brand-primaryHover hover:text-white cursor-pointer"
//                     onClick={() => handleDeletePrompt(product?._id)}
//                   >
//                     <MdDelete />
//                   </div>
//                   <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
//                     {product?.productId?.productName}
//                   </h2>
//                   <div className="flex justify-between">
//                     <p className="capitalize text-brand-textMuted font-medium">
//                       {product?.productId?.category}
//                     </p>
//                     <p className="capitalize text-slate-500 font-medium">
//                       <span
//                         className={`${product?.productId?.availability > 0
//                             ? "text-brand-buttonAccent"
//                             : "text-brand-primary"
//                           }`}
//                       >
//                         {product?.productId?.availability > 0
//                           ? "In stock"
//                           : "Sold out"}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <p className="text-black font-medium text-base">
//                       {displayINRCurrency(product?.productId?.sellingPrice)}
//                     </p>
//                     <p className="text-brand-textMuted font-medium text-lg">
//                       {displayINRCurrency(
//                         product?.productId?.sellingPrice * product?.quantity
//                       )}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-4 mt-2">
//                     <button
//                       className={`h-6 w-6 flex items-center justify-center rounded-full ${product?.quantity <= 1
//                           ? "bg-gray-100 cursor-not-allowed"
//                           : "bg-gray-100 hover:bg-indigo-600 hover:text-white"
//                         }`}
//                       onClick={() =>
//                         decreaseQty(product?._id, product?.quantity)
//                       }
//                       disabled={product?.quantity <= 1}
//                     >
//                       <span className="text-lg font-bold"><FiMinus /></span>
//                     </button>
//                     <p className="text-lg font-semibold">
//                       {product?.quantity}
//                     </p>
//                     <button
//                       className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-600 hover:text-white"
//                       onClick={() =>
//                         increaseQty(product?._id, product?.quantity)
//                       }
//                     >
//                       <span className="text-lg font-bold"><FiPlus/></span>
//                     </button>
//                   </div>
//                 </div>
//                 {selectedProductId === product._id && (
//                   <div className="prompt absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="prompt-inner bg-white p-4 rounded">
//                       <h2>Are you sure to delete?</h2>
//                       <div className="prompt-btn flex justify-between mt-4">
//                         <button
//                           className="prompt-yes bg-brand-primary text-white py-1 px-4 rounded hover:bg-brand-primaryHover"
//                           onClick={handlePromptYes}
//                         >
//                           Yes
//                         </button>
//                         <button
//                           className="prompt-no bg-gray-200 py-1 px-4 rounded hover:bg-gray-400"
//                           onClick={handlePromptNo}
//                         >
//                           No
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//         </div>
//         {data.length > 0 && (
//           <div className="w-full max-w-sm h-max bg-white border rounded p-4">
//             <h3 className="text-lg font-semibold mb-2">Summary</h3>
//             <div className="flex justify-between mb-2">
//               <h4>Total Quantity:</h4>
//               <p>{totalQty}</p>
//             </div>
//             <div className="flex justify-between mb-2">
//               <h5>Subtotal:</h5>
//               <p>{displayINRCurrency(totalPrice)}</p>
//             </div>
//             <button
//               className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//               onClick={handleCheckout}
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;


import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
// import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Trash2 } from 'lucide-react';
const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const context = useContext(Context);
  const navigate = useNavigate();
  const loadingCart = new Array(4).fill(null);

  const fetchData = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
      });
      const responseData = await response.json();
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  const increaseQty = async (id, qty) => {
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id, quantity: qty + 1 }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        fetchData();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty > 1) {
      try {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
          method: SummaryApi.updateCartProduct.method,
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ _id: id, quantity: qty - 1 }),
        });
        const responseData = await response.json();
        if (responseData.success) {
          fetchData();
        }
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      }
    }
  };

  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        fetchData();
        context.fetchUserAddToCart();
      }
    } catch (error) {
      console.error("Error deleting cart product:", error);
    }
  };

  const handleCheckout = async () => {
    const isAnyProductSoldOut = data.some(
      (product) => product?.productId?.availability === 0
    );

    if (isAnyProductSoldOut) {
      toast.error("Please remove sold out products!");
      return;
    }

    try {
      const res = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not logged in");
      const result = await res.json();
      if (!result?.success || !result?.data?._id) throw new Error("Not logged in");

      navigate("/checkout");
    } catch (err) {
      toast.warning("Please login to continue checkout");
      navigate("/login", { state: { from: "/checkout" } });
    }
  };

  const handleDeletePrompt = (id) => setSelectedProductId(id);
  const handlePromptYes = () => {
    deleteCartProduct(selectedProductId);
    setSelectedProductId(null);
  };
  const handlePromptNo = () => setSelectedProductId(null);

  const totalQty = data.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = data.reduce(
    (acc, item) => acc + item.quantity * item?.productId?.sellingPrice,
    0
  );

  // return (
  //   <div className="container mx-auto">
  //     <div className="text-center text-lg my-3">
  //       {!loading && data.length === 0 && (
  //         <h1 className="bg-white py-5 font-medium text-brand-textmuted">
  //           Your Cart is Empty. Please add products to proceed!
  //         </h1>
  //       )}
  //     </div>
  //     <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
  //       <div className="w-full max-w-3xl">
  //         {loading
  //           ? loadingCart.map((_, index) => (
  //               <div key={index} className="w-full bg-brand-productCardImageBg h-32 my-2 border border-slate-300 animate-pulse rounded"></div>
  //             ))
  //           : data.map((product) => {
  //               // Handling Mixed Image Format Logic
  //               const images = product?.productId?.productImage || [];
  //               const firstMedia = images[0];
  //               const displayImage = typeof firstMedia === "string" ? firstMedia : firstMedia?.url;

  //               return (
  //                 <div key={product?._id} className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr] relative">
  //                   <div className="w-32 h-32 bg-brand-productCardImageBg">
  //                     <img
  //                       src={displayImage}
  //                       alt={product?.productId?.altTitle || product?.productId?.productName}
  //                       title={product?.productId?.altTitle || product?.productId?.productName}
  //                       className="w-full h-full object-scale-down mix-blend-multiply"
  //                     />
  //                   </div>
  //                   <div className="px-4 py-2 relative">
  //                     <div
  //                       className="absolute right-0 text-brand-primary rounded-full p-2 hover:bg-brand-primaryHover hover:text-white cursor-pointer"
  //                       onClick={() => handleDeletePrompt(product?._id)}
  //                     >
  //                       <MdDelete />
  //                     </div>
  //                     <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1 font-semibold">
  //                       {product?.productId?.productName}
  //                     </h2>
  //                     <div className="flex justify-between">
  //                       <p className="capitalize text-brand-textMuted font-medium">{product?.productId?.category}</p>
  //                       <p className={`capitalize font-medium ${product?.productId?.availability > 0 ? "text-green-600" : "text-brand-primary"}`}>
  //                         {product?.productId?.availability > 0 ? "In stock" : "Sold out"}
  //                       </p>
  //                     </div>
  //                     <div className="flex items-center justify-between">
  //                       <p className="text-black font-bold">{displayINRCurrency(product?.productId?.sellingPrice)}</p>
  //                       <p className="text-brand-textMuted font-medium">{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
  //                     </div>
                      
  //                     {/* Quantity Controls with Brand Colors */}
  //                     <div className="flex items-center gap-4 mt-1">
  //                       <button
  //                         className={`h-6 w-6 flex items-center justify-center rounded-full transition-colors ${
  //                           product?.quantity <= 1 
  //                           ? "bg-gray-100 cursor-not-allowed text-gray-400" 
  //                           : "bg-gray-100 hover:bg-brand-primary hover:text-white"
  //                         }`}
  //                         onClick={() => decreaseQty(product?._id, product?.quantity)}
  //                         disabled={product?.quantity <= 1}
  //                       >
  //                         <FiMinus />
  //                       </button>
  //                       <p className="text-lg font-semibold">{product?.quantity}</p>
  //                       <button
  //                         className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-brand-primary hover:text-white transition-colors"
  //                         onClick={() => increaseQty(product?._id, product?.quantity)}
  //                       >
  //                         <FiPlus />
  //                       </button>
  //                     </div>
  //                   </div>

  //                   {/* Delete Confirmation Overlay */}
  //                   {selectedProductId === product._id && (
  //                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded">
  //                       <div className="bg-white p-4 rounded shadow-lg text-center">
  //                         <h2 className="font-semibold mb-3">Remove from cart?</h2>
  //                         <div className="flex justify-center gap-4">
  //                           <button
  //                             className="bg-brand-primary text-white py-1 px-5 rounded hover:bg-brand-primaryHover transition-colors"
  //                             onClick={handlePromptYes}
  //                           >
  //                             Yes
  //                           </button>
  //                           <button
  //                             className="bg-gray-200 py-1 px-5 rounded hover:bg-gray-300 transition-colors"
  //                             onClick={handlePromptNo}
  //                           >
  //                             No
  //                           </button>
  //                         </div>
  //                       </div>
  //                     </div>
  //                   )}
  //                 </div>
  //               );
  //             })}
  //       </div>

  //       {/* Summary Card */}
  //       {data.length > 0 && (
  //         <div className="w-full max-w-sm h-max bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
  //           <h3 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h3>
  //           <div className="flex justify-between mb-3 text-brand-textMuted">
  //             <span>Total Quantity:</span>
  //             <span className="font-semibold text-black">{totalQty}</span>
  //           </div>
  //           <div className="flex justify-between mb-6 text-lg">
  //             <span className="font-medium">Subtotal:</span>
  //             <span className="font-bold text-brand-primary">{displayINRCurrency(totalPrice)}</span>
  //           </div>
  //           <button
  //             className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primaryHover transition-all shadow-md active:scale-95"
  //             onClick={handleCheckout}
  //           >
  //             Proceed to Checkout
  //           </button>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
  <div className="mx-auto px-4 md:px-6 lg:px-12 py-6">

    {/* HEADER */}
    {!loading && data.length > 0 && (
      <p className="text-sm text-brand-textMuted mb-6">
        You have {totalQty} {totalQty === 1 ? "item" : "items"} in your cart
      </p>
    )}

    {/* EMPTY CART */}
    {!loading && data.length === 0 && (
      <h1 className="text-center bg-white py-10 font-medium text-brand-textMuted">
        Your Cart is Empty. Please add products to proceed!
      </h1>
    )}

    <div className="flex flex-col lg:flex-row gap-10">

      {/* ================= LEFT : CART LIST ================= */}
      <div className="flex-1">

        {loading
          ? loadingCart.map((_, i) => (
              <div key={i} className="h-40 bg-brand-textMuted animate-pulse rounded mb-6" />
            ))
          : data.map((item) => {
              const images = item?.productId?.productImage || [];
              const firstMedia = images[0];
              const displayImage =
                typeof firstMedia === "string" ? firstMedia : firstMedia?.url;

              return (
                <div
                  key={item._id}
                  className="border-b border-brand-productCardBorder pb-8 mb-0 md:pb-8 md:mb-8 relative"
                >
                  <div className="flex flex-col md:flex-row gap-6">

                    {/* IMAGE */}
                    <div className="w-full md:w-56 h-40 bg-brand-productCardImageBg flex items-center justify-center rounded">
                      <img
                        src={displayImage}
                        alt={item.productId.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 flex flex-col">

                      {/* NAME + PRICE */}
                      <div className="flex justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold leading-snug">
                            {item.productId.productName}
                          </h2>
                          <div></div>
                          <p className="text-sm text-brand-textMuted mt-2 font-normal">
                            {item.productId.category}
                          </p>
                          <p className="text-sm text-brand-textMuted font-normal mt-1">
                            {item.productId.availability > 0
                              ? "In Stock"
                              : "Sold Out"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-semibold">
                            {displayINRCurrency(
                              item.productId.sellingPrice
                            )}
                          </p>

                          {item.productId.price >
                            item.productId.sellingPrice && (
                            <>
                              <p className="text-sm text-brand-textMuted line-through">
                                {displayINRCurrency(item.productId.price)}
                              </p>
                              <span className="inline-block mt-1 bg-brand-offer text-white text-xs px-2 py-0.5 rounded">
                                {Math.round(
                                  ((item.productId.price -
                                    item.productId.sellingPrice) /
                                    item.productId.price) *
                                    100
                                )}
                                % OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* QTY + DELETE */}
                      <div className="flex justify-between items-center mt-2 ">

                        {/* QTY */}
                        <div className="flex items-center border border-brand-productCardBorder rounded-md overflow-hidden">
                          <button
                            className="px-1.5 py-1.5 text-[#141B34] hover:bg-gray-100 disabled:text-gray-300"
                            onClick={() =>
                              decreaseQty(item._id, item.quantity)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span className="px-1 font-normal">
                            {item.quantity}
                          </span>
                          <button
                            className="px-1.5 py-1.5 text-[#141B34] hover:bg-gray-100"
                            onClick={() =>
                              increaseQty(item._id, item.quantity)
                            }
                          >
                            <FiPlus />
                          </button>
                        </div>

                        {/* DELETE */}
                        <button
                          className="text-[#141B34] hover:text-brand-primaryHover"
                          onClick={() => handleDeletePrompt(item._id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* DELETE CONFIRMATION */}
                  {selectedProductId === item._id && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-md z-10">
                      <div className="bg-gray-100 p-6 rounded shadow-md w-full max-w-sm">
                        <h2 className="font-semibold mb-4 text-center">
                          Are you sure you want to remove this item?
                        </h2>
                        <div className="flex justify-end gap-4">
                          <button
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={handlePromptNo}
                          >
                            No
                          </button>
                          <button
                            className="px-4 py-2 bg-brand-primary text-white rounded"
                            onClick={handlePromptYes}
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
      </div>

      {/* ================= RIGHT : ORDER SUMMARY ================= */}
      {data.length > 0 && (
        <div className="w-full lg:w-[380px]">
          <div className="bg-white border border-brand-productCardBorder rounded-lg p-6 lg:sticky lg:top-6">
            <h1 className="text-xl md:text-2xl font-bold mb-6">Order Summary</h1>

            <div className="space-y-4 text-base md:text-lg font-medium">
              
            <div className="flex text-base md:text-lg justify-between mb-3 text-brand-textMuted">
              <span>Total Quantity:</span>
              <span className="font-semibold text-black">{totalQty}</span>
            </div>

              <div className="flex text-sm md:text-base font-medium justify-between">
                <span>Price (inclusive of all taxes)</span>
                <span>
                  {displayINRCurrency(totalPrice)}
                </span>
              </div>

              <div className="flex text-sm md:text-base justify-between font-medium">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t border-brand-productCardBorder mt-6 pt-4 flex justify-between text-lg md:text-xl font-bold">
              <span>Order Total</span>
              <span>{displayINRCurrency(totalPrice)}</span>
            </div>

          </div>
            <button
              className="w-full mt-6 py-2 bg-brand-primary text-white font-medium rounded-md hover:bg-brand-primaryHover transition"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
        </div>
      )}
    </div>
  </div>
);

};

export default Cart;