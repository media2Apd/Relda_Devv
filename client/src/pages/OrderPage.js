// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import moment from "moment";
// import displayINRCurrency from "../helpers/displayCurrency";
// import SummaryApi from "../common";

// const OrderPage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(SummaryApi.getOrder.url, {
//         method: SummaryApi.getOrder.method,
//         credentials: "include",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const result = await response.json();

//       setData(result.success ? result.data : []);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   if (loading) return <p className="text-center mt-8">Loading...</p>;

//   return (
//     <div className="p-4 max-w-7xl mx-auto mt-6">
//       <h1 className="text-2xl font-bold mb-4">All orders</h1>
//       {!data.length && <p className="text-center mt-8">No orders available.</p>}

//       <div className="space-y-4">
//         {data.map((order) => (
//           <div
//             key={order.orderId}
//             onClick={() => navigate(`/order/${order.orderId}`)}
//             className="relative border bg-gray-50 rounded-lg p-4 shadow-sm cursor-pointer flex flex-col md:flex-row"
//           >
//             {/* Products within the order */}
//             <div className="space-y-4 flex-1">
//               {order.productDetails.map((product, index) => (
//                 <div
//                   key={index}
//                   className="flex items-start pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
//                 >
//                   <img
//                     src={product.productImage}
//                     alt={product.altTitle || "product"}
//                     title={product.altTitle || "product"}
//                     className="w-20 h-20 rounded-lg object-cover"
//                   />
//                   <div className="ml-2 sm:ml-4 flex-1">
//                     <h2 className="text-red-600 text-md font-semibold uppercase">
//                       {product.brandName}
//                     </h2>
//                     <p className="text-sm text-gray-900 font-bold">
//                       {product.productName}
//                     </p>
//                     <p className="text-sm text-gray-600 font-bold">
//                       OrderId: {order.orderId}
//                     </p>
//                     <div className="flex flex-col md:flex-row max-w-xs justify-between">
//                       <p className="text-sm text-gray-500 font-semibold">
//                         Category: {product.category}
//                       </p>
//                       <p className="text-sm text-gray-500 font-semibold">
//                         Quantity:{" "}
//                         <span className="text-sm text-green-500 font-semibold">
//                           {product.quantity}
//                         </span>
//                       </p>
//                     </div>
//                     <div className="text-sm text-red-600 font-semibold">
//                       {displayINRCurrency(product.sellingPrice)}{" "}
//                       <span className="line-through text-gray-500">
//                         {displayINRCurrency(product.price)}
//                       </span>
//                       <span className="ml-1 px-2 py-1 text-xs font-medium rounded-md shadow" style={{ backgroundColor: "#175E17", color: "#E8F5E9" }}>
//                         {`${Math.ceil(
//                           ((product.price - product.sellingPrice) / product.price) *
//                           100
//                         )}% OFF`}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Order-level details */}
//             <div className="mt-2 ml-24 md:mt-0 md:ml-8 md:absolute md:top-1/2 md:right-4 md:transform md:-translate-y-1/2 flex flex-col">
//               <h1 className="text-md text-orange-600 font-semibold">
//                 Items:{" "}
//                 {order.productDetails.reduce(
//                   (totalItems, product) => totalItems + product.quantity,
//                   0
//                 )}
//               </h1>
//               <p className="text-sm text-gray-600 font-semibold">
//                 <span className="capitalize">{order.order_status}</span> on{" "}
//                 {moment(order.statusUpdatedAt).format("LL")}
//               </p>
//               <p className="text-sm text-gray-600 font-semibold">
//                 {moment(order.statusUpdatedAt).format("hh:mm A")}
//               </p>
//               <p
//                 className={`text-sm font-semibold capitalize ${
//                   order.order_status === "delivered"
//                     ? "text-green-500"
//                     : order.order_status === "cancelled"
//                     ? "text-red-500"
//                     : order.order_status === "returnRequested" || order.order_status === "returnAccepted" || order.order_status === "returned"
//                     ? "text-yellow-500"
//                     : "text-green-500"
//                 }`}
//               >
//                 <span className="text-gray-600">Your product</span> {order.order_status}
//               </p>
              
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderPage;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import moment from "moment";
// import displayINRCurrency from "../helpers/displayCurrency";
// import SummaryApi from "../common";

// const OrderPage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(SummaryApi.getOrder.url, {
//         method: SummaryApi.getOrder.method,
//         credentials: "include",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const result = await response.json();

//       setData(result.success ? result.data : []);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Helper function to handle different image formats (String vs Array vs Object)
//   const getDisplayImage = (productImage) => {
//     if (!productImage) return "";
    
//     // If it's already a string, return it
//     if (typeof productImage === "string") return productImage;

//     // If it's an array (new format)
//     if (Array.isArray(productImage) && productImage.length > 0) {
//       const firstMedia = productImage[0];
//       // If first element is string ["url", "url"]
//       if (typeof firstMedia === "string") return firstMedia;
//       // If first element is object [{url: "...", type: "..."}]
//       return firstMedia?.url || "";
//     }

//     return "";
//   };

//   if (loading) return <p className="text-center mt-8 font-medium text-gray-500">Loading your orders...</p>;

//   return (
//     <div className="p-4 max-w-7xl mx-auto mt-6">
//       <h1 className="text-2xl font-bold mb-6 text-gray-900">All Orders</h1>
      
//       {!data.length && (
//         <div className="text-center mt-12 py-10 bg-gray-50 rounded-xl border-2 border-dashed">
//             <p className="text-gray-500 font-medium">No orders available yet.</p>
//         </div>
//       )}

//       <div className="space-y-6">
//         {data.map((order) => (
//           <div
//             key={order.orderId}
//             onClick={() => navigate(`/order/${order.orderId}`)}
//             className="relative border border-gray-200 bg-white hover:bg-gray-50 transition-all rounded-xl p-5 shadow-sm cursor-pointer flex flex-col md:flex-row gap-4"
//           >
//             {/* Products within the order */}
//             <div className="space-y-5 flex-1">
//               {order.productDetails.map((product, index) => {
//                 const displayImage = getDisplayImage(product.productImage);
                
//                 return (
//                   <div
//                     key={index}
//                     className="flex items-start pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
//                   >
//                     <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
//                         <img
//                             src={displayImage}
//                             alt={product.altTitle || product.productName}
//                             title={product.altTitle || product.productName}
//                             className="w-full h-full object-contain mix-blend-multiply"
//                         />
//                     </div>
                    
//                     <div className="ml-4 flex-1">
//                       <h2 className="text-[#E60000] text-xs font-bold uppercase tracking-wider mb-1">
//                         {product.brandName}
//                       </h2>
//                       <p className="text-sm text-gray-900 font-bold line-clamp-1">
//                         {product.productName}
//                       </p>
//                       <p className="text-[12px] text-gray-400 font-semibold mt-1">
//                         Order ID: <span className="text-gray-600">#{order.orderId}</span>
//                       </p>
                      
//                       <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
//                         <p className="text-xs text-gray-500 font-semibold">
//                           Category: <span className="text-gray-700">{product.category}</span>
//                         </p>
//                         <p className="text-xs text-gray-500 font-semibold">
//                           Quantity:{" "}
//                           <span className="text-green-600 font-bold">
//                             {product.quantity}
//                           </span>
//                         </p>
//                       </div>

//                       <div className="text-sm font-bold mt-2 flex items-center gap-2">
//                         <span className="text-[#E60000]">{displayINRCurrency(product.sellingPrice)}</span>
//                         <span className="line-through text-gray-300 text-xs">
//                           {displayINRCurrency(product.price)}
//                         </span>
//                         <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-green-100 text-green-700">
//                           {`${Math.ceil(
//                             ((product.price - product.sellingPrice) / product.price) * 100
//                           )}% OFF`}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Order Status Section */}
//             <div className="md:w-56 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
//               <h3 className="text-sm text-orange-600 font-bold flex items-center gap-2">
//                 Total Items:{" "}
//                 <span className="bg-orange-50 px-2 py-0.5 rounded-full text-xs">
//                     {order.productDetails.reduce((total, p) => total + p.quantity, 0)}
//                 </span>
//               </h3>
              
//               <div className="mt-3">
//                 <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Status Date</p>
//                 <p className="text-sm text-gray-700 font-bold">
//                     {moment(order.statusUpdatedAt).format("LL")}
//                 </p>
//                 <p className="text-xs text-gray-400 font-medium">
//                     {moment(order.statusUpdatedAt).format("hh:mm A")}
//                 </p>
//               </div>

//               <div className="mt-4">
//                 <p
//                     className={`text-sm font-bold capitalize px-3 py-1.5 rounded-lg inline-block ${
//                     order.order_status === "delivered"
//                         ? "bg-green-50 text-green-600"
//                         : order.order_status === "cancelled"
//                         ? "bg-red-50 text-red-600"
//                         : order.order_status.includes("return")
//                         ? "bg-yellow-50 text-yellow-600"
//                         : "bg-blue-50 text-blue-600"
//                     }`}
//                 >
//                     {order.order_status}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderPage;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";
import SummaryApi from "../common";

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getOrder.url, {
        method: SummaryApi.getOrder.method,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      setData(result.success ? result.data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Robust Helper function to extract image from either format
  const getProductThumbnail = (imageSource) => {
    if (!imageSource) return "";

    // If it's an array (both formats are arrays)
    if (Array.isArray(imageSource)) {
      const firstItem = imageSource[0];
      
      // Format 1: ["url", "url"]
      if (typeof firstItem === 'string') {
        return firstItem;
      }
      
      // Format 2: [{url: "url", type: "image"}]
      if (typeof firstItem === 'object' && firstItem !== null) {
        return firstItem.url || "";
      }
    }

    // Fallback if the backend sent a single string instead of an array
    if (typeof imageSource === 'string') {
      return imageSource;
    }

    return "";
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">All orders</h1>
      {!data.length && <p className="text-center mt-8">No orders available.</p>}

      <div className="space-y-4">
        {data.map((order) => (
          <div
            key={order.orderId}
            onClick={() => navigate(`/order/${order.orderId}`)}
            className="relative border bg-gray-50 rounded-lg p-4 shadow-sm cursor-pointer flex flex-col md:flex-row transition-all hover:bg-white hover:shadow-md"
          >
            {/* Products within the order */}
            <div className="space-y-4 flex-1">
              {order.productDetails.map((product, index) => {
                
                // Get image using the robust helper
                const displayImage = getProductThumbnail(product.productImage);

                return (
                  <div
                    key={index}
                    className="flex items-start pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <div className="w-24 h-24 bg-white rounded-lg border flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={product.altTitle || product.productName}
                          title={product.altTitle || product.productName}
                          className="w-full h-full object-scale-down mix-blend-multiply p-1"
                        />
                      ) : (
                        <div className="text-[10px] text-gray-400">No Image</div>
                      )}
                    </div>
                    
                    <div className="ml-3 sm:ml-4 flex-1">
                      <h2 className="text-[#E60000] text-sm font-bold uppercase tracking-wider">
                        {product.brandName}
                      </h2>
                      <p className="text-sm md:text-base text-gray-900 font-bold line-clamp-1">
                        {product.productName}
                      </p>
                      <p className="text-xs text-gray-500 font-bold mt-1">
                        OrderId: <span className="text-gray-800">{order.orderId}</span>
                      </p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <p className="text-xs text-gray-500 font-semibold">
                          Category: <span className="text-gray-700">{product.category}</span>
                        </p>
                        <p className="text-xs text-gray-500 font-semibold">
                          Qty: <span className="text-[#175E17] font-bold">{product.quantity}</span>
                        </p>
                      </div>

                      <div className="text-sm font-bold mt-2 flex items-center gap-2">
                        <span className="text-[#E60000]">{displayINRCurrency(product.sellingPrice)}</span>
                        {product.price > product.sellingPrice && (
                          <>
                            <span className="line-through text-gray-400 font-normal text-xs">
                              {displayINRCurrency(product.price)}
                            </span>
                            <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#175E17] text-[#E8F5E9]">
                              {`${Math.ceil(((product.price - product.sellingPrice) / product.price) * 100)}% OFF`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order-level details */}
            <div className="mt-4 md:mt-0 md:ml-6 md:min-w-[220px] border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
              <div className="mb-2">
                 {/* <span className="text-xs font-bold text-gray-400 uppercase">Status</span> */}
                 <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                    <div className={`w-2 h-2 rounded-full ${
                        order.order_status === "delivered" ? "bg-green-500" : 
                        order.order_status === "cancelled" ? "bg-red-500" : "bg-orange-500"
                    }`}></div>
                    <p className={`text-sm font-bold capitalize ${
                        order.order_status === "delivered" ? "text-green-600" : 
                        order.order_status === "cancelled" ? "text-red-600" : "text-orange-600"
                    }`}>
                        {order.order_status}
                    </p>
                 </div>
              </div>

              <p className="text-xs text-gray-500 font-semibold">
                Updated on {moment(order.statusUpdatedAt).format("DD MMM YYYY")}
              </p>
              <p className="text-xs text-gray-400">
                {moment(order.statusUpdatedAt).format("hh:mm A")}
              </p>
              
              <div className="mt-4 p-2 bg-white rounded border border-dashed border-gray-300">
                 <p className="text-xs font-bold text-gray-600">
                    Total Items: <span className="text-black">{order.productDetails.reduce((t, p) => t + p.quantity, 0)}</span>
                 </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;