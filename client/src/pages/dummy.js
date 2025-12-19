// import React, { useState, useEffect } from "react";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import * as XLSX from "xlsx";
// import SummaryApi from "../common";


// const AllCartSummary = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [filters, setFilters] = useState({
//     userId: "",
//     userName: "",
//     category: "",
//     startDate: "",
//     endDate: "",
//   });
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [allCategories, setAllCategories] = useState([]);
//   const [view, setView] = useState("summary");
//   const [selectedUserDetails, setSelectedUserDetails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => { 
//   // Fetch all cart items
//   const fetchCartItems = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.allCart.url, {
//         method: SummaryApi.allCart.method,
//         credentials: "include",
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         setCartItems(data.data.allCartItems || []);
//         populateFilters(data.data.allCartItems);
//       } else {
//         alert("Error fetching cart items");
//       }
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchCartItems();
// }, []);

//   // Populate unique user names and categories for dropdowns
//   const populateFilters = (items) => {
//     const users = [];
//     const categories = new Set();

//     items.forEach((item) => {
//       if (!users.some((u) => u.userId === item.userId._id)) {
//         users.push({ userId: item.userId._id, userName: item.userId.name });
//       }
//       categories.add(item.productId.category);
//     });

//     setAllUsers(users);
//     setFilteredUsers(users);
//     setAllCategories([...categories]);
//     setFilteredCategories([...categories]);
//   };

//   // Handle filter changes dynamically
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters({ ...filters, [name]: value });

//     // Filter dropdown dynamically
//     if (name === "userName") {
//       const filtered = allUsers.filter((user) =>
//         user.userName.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     }
//     if (name === "category") {
//       const filtered = allCategories.filter((category) =>
//         category.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredCategories(filtered);
//     }
//   };

//   const handleViewDetails = (userId) => {
//     const details = cartItems.filter((item) => item.userId._id === userId);
//     setSelectedUserDetails(details);
//     setView("details");
//   };

//   const handleBackToSummary = () => setView("summary");

//   const filteredCartItems = cartItems.filter((item) => {
//     const { startDate, endDate } = filters;
//     const itemDate = new Date(item.createdAt); // Ensure the createdAt is treated as a Date object.
  
//     // Initialize the filter logic for date-wise filtering
//     let matchDate = true;
  
//     if (startDate || endDate) {
//       let dateFilter = {}; // Create a filter object for the date range
  
//       if (startDate) {
//         const start = new Date(startDate);
//         start.setHours(0, 0, 0, 0); // Set to the start of the day (00:00:00)
//         dateFilter.$gte = start; // Greater than or equal to start date
//       }
  
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999); // Set to the end of the day (23:59:59.999)
//         dateFilter.$lte = end; // Less than or equal to end date
//       }
  
//       // Check if the itemDate fits within the date range
//       if (dateFilter.$gte || dateFilter.$lte) {
//         matchDate = (
//           (!dateFilter.$gte || itemDate >= dateFilter.$gte) &&
//           (!dateFilter.$lte || itemDate <= dateFilter.$lte)
//         );
//       }
//     }
  
//     // Additional filters for other fields
//     const matchUserId = !filters.userId || item.userId._id.includes(filters.userId);
//     const matchUserName = !filters.userName || item.userId.name.toLowerCase().includes(filters.userName.toLowerCase());
//     const matchCategory = !filters.category || item.productId.category.toLowerCase().includes(filters.category.toLowerCase());
  
//     // Return items that match all conditions
//     return matchUserId && matchUserName && matchCategory && matchDate;
//   });
  
  
  
  

//   // useEffect(() => {
//   //   fetchCartItems();
//   // }, []);
//   const groupedUserDetails = selectedUserDetails.reduce((acc, item) => {
//     if (!acc[item.userId._id]) {
//       acc[item.userId._id] = {
//         user: item.userId,
//         products: [],
//       };
//     }
//     acc[item.userId._id].products.push(item);
//     return acc;
//   }, {});
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   // Function to download all cart items in XLSX
//   const downloadXLSX = () => {
//     const wb = XLSX.utils.book_new(); // Create a new workbook
//     const headers = [
//       "User Name", 
//       "Email", 
//       "Mobile", 
//       "Product Name", 
//       "Category", 
//       "Quantity", 
//       "Selling Price", 
//       "Total Amount", 
//       "Address",
//     ];
//     const rows = filteredCartItems.map((item) => {
//       const productName = item.productId?.productName || "Product Name";
//       const category = item.productId?.category || "Category";
//       const sellingPrice = item.productId?.sellingPrice || 0;
//       const totalAmount = sellingPrice * item.quantity;
//       // Extract address fields and format as a string
//       const addressObj = item.userId?.address || {};
//       const address = `${addressObj.street || ""}, ${addressObj.city || ""}, ${addressObj.state || ""}, ${addressObj.country || ""}, ${addressObj.pinCode || ""}`.trim();
//       return [
//         item.userId?.name || "Unknown User",
//         item.userId?.email || "No Email",
//         item.userId?.mobile || "No Mobile",
//         productName,
//         category,
//         item.quantity,
//         sellingPrice,
//         totalAmount,
//         address,
//       ];
//     });
//     // Create a worksheet and append data
//     const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     // Append the worksheet to the workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Filtered Cart Details");
//     // Save the file with a timestamped name
//     XLSX.writeFile(wb, `filtered_cart_details_${new Date().toISOString()}.xlsx`);
//   };
//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
//       {view === "summary" ? (
//         <>
//         <h1 className="text-xl font-bold mb-4">All Cart Summary</h1>
// {/* Filters */}
// <div className="flex gap-4 flex-wrap mb-6 items-center">
//   <select
//     name="userName"
//     value={filters.userName}
//     onChange={handleFilterChange}
//     className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
//   >
//     <option value="">View All Users</option>
//     {filteredUsers.map((user) => (
//       <option key={user.userId} value={user.userName}>
//         {user.userName}
//       </option>
//     ))}
//   </select>

//   <select
//     name="category"
//     value={filters.category}
//     onChange={handleFilterChange}
//     className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
//   >
//     <option value="">Select Category</option>
//     {filteredCategories.map((category, index) => (
//       <option key={index} value={category}>
//         {category}
//       </option>
//     ))}
//   </select>

//   <input
//     type="date"
//     name="startDate"
//     value={filters.startDate}
//     onChange={handleFilterChange}
//     className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
//   />

//   <input
//     type="date"
//     name="endDate"
//     value={filters.endDate}
//     onChange={handleFilterChange}
//     className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
//   />

//   {/* Export button aligned to the right */}
//   <button
//     onClick={downloadXLSX}
//     className="border border-gray-300 rounded px-4 py-2 text-sm bg-blue-500 text-white ml-auto"
//   >
//     Export
//   </button>
// </div>




//           {/* Export Button for XLSX */}
//           {/* <div class="flex justify-end">
//           <button
//             onClick={downloadXLSX}
//             className="bg-blue-500 text-white px-6 py-2 mt-4 rounded-lg"
//           >
//             Export to Excel
//           </button>
//         </div> */}
//           {/* Table */}
//           <table className="min-w-full bg-white border border-gray-200 rounded">
//     <thead>
//       <tr className="bg-gray-100">
//         <th className="px-4 py-2 text-left font-semibold">User Name</th>
//         <th className="px-4 py-2 text-left font-semibold">Total Products</th>
//         <th className="px-4 py-2 text-left font-semibold">Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {filteredCartItems.length === 0 ? (
//         <tr>
//           <td colSpan="3" className="px-4 py-2 text-center">No matching cart items</td>
//         </tr>
//       ) : (
//         filteredCartItems.map((item) => {
//           const user = item.userId;
//           const totalProducts = filteredCartItems
//             .filter((cartItem) => cartItem.userId._id === user._id)
//             .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
//           return (
//             <tr key={item._id} className="hover:bg-gray-50">
//               <td className="px-4 py-2">{user.name}</td>
//               <td className="px-4 py-2">{totalProducts}</td>
//               <td className="px-4 py-2">
//                 <button
//                   onClick={() => handleViewDetails(user._id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                 >
//                   View
//                 </button>
//               </td>
//             </tr>
//           );
//         })
//       )}
//     </tbody>
//   </table>
//         </>
//       ) : (
//         <>
//           <div className="flex">
//             <button
//               onClick={handleBackToSummary}
//               className="mr-2 text-custom-red text-3xl font-semibold mb-4"
//             >
//               <IoMdArrowRoundBack />
//             </button>
//             <h1 className="text-2xl font-bold mb-4">User Cart Details</h1>
//           </div>
//           {/* User Details and Product Details Layout */}
//           {Object.values(groupedUserDetails).map((userDetail) => (
//             <div
//               key={userDetail.user._id}
//               className="flex justify-between mb-8 p-6 bg-white border rounded-lg shadow-sm"
//             >
//               {/* Right: Product Details */}
//               <div className="w-2/3">
//                 {userDetail.products.map((item) => {
//                   const productName = item.productId.productName || "Product Name";
//                   const sellingPrice = item.productId.sellingPrice || 0;
//                   const Price = item.productId.price;
//                   const productImage = item.productId.productImage;
//                   return (
//                     <div
//                       key={item._id}
//                       className="mb-8 p-6 bg-white border rounded-lg shadow-sm"
//                     >
//                       {/* Product Details */}
//                       <div className="flex items-start">
//                         {productImage && (
//                           <img
//                             src={productImage}
//                             alt={productName}
//                             className="w-32 h-32 object-cover flex-wrap rounded-md mr-4"
//                           />
//                         )}
//                         <div>
//                           <h3 className="text-l font-semibold text-gray-800">
//                             {productName}
//                           </h3>
//                           <p className="text-gray-500 mt-1">
//                             Price: <span className="text-red-600 font-bold">₹{sellingPrice}</span>{" "}
//                             {Price && (
//                               <span className="line-through text-gray-400 font-bold ml-2">
//                                 ₹{Price}
//                               </span>
//                             )}
//                           </p>
//                           <span className="ml-2 bg-green-500 text-white px-2 py-1 text-xs rounded font-semibold">
//                             {`${(
//                               ((Price - sellingPrice) / Price) * 100
//                             ).toFixed(2)}% OFF`}
//                           </span>
//                           <p className="text-gray-600 mt-2">Quantity: {item.quantity}</p>
//                         </div>
//                       </div>
//                       {/* Divider */}
//                       <div className="border-t mt-4"></div>
//                       {/* Total Amount */}
//                       <div className="text-right mt-4">
//                         <p className="text-m font-semibold">
//                           Total Amount: ₹{sellingPrice * item.quantity}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//               {/* Left: User Details */}
//               <div className="w-1/3 pl-2">
//                 <div className="p-6 pl-6 border rounded-lg shadow-md bg-white">
//                   <h3 className="text-l font-semibold text-gray-800">
//                     Customer: {userDetail.user.name}
//                   </h3>
//                   <p className="text-gray-600">Email: {userDetail.user.email}</p>
//                   <p className="text-gray-600">Mobile: {userDetail.user.mobile}</p>
//                   <div className="mt-4">
//                     <h4 className="text-l font-semibold">Customer Address</h4>
//                     <p className="text-gray-600">
//                       {userDetail.user?.address?.street || 'N/A'}
//                     </p>
//                     <p className="text-gray-600">
//                       {userDetail.user?.address?.city || 'N/A'},{" "}
//                       {userDetail.user?.address?.state || 'N/A'}
//                     </p>
//                     <p className="text-gray-600">
//                       {userDetail.user?.address?.country || 'N/A'} -{" "}
//                       {userDetail.user?.address?.pinCode || 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </>
//       )}
//     </div>
//   );
// };
// export default AllCartSummary;

// const options = {
//   amount: totalAmount, // Amount in paise (smallest currency unit)
//   currency: "INR",
//   receipt: `receipt_${new Date().getTime()}`, // Use a dynamic receipt ID
//   payment_capture: 1, // Auto-capture payment
//   notes: {
//       shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
//       customer_info: JSON.stringify(customerInfo),
//   },
//   order_id: order.id,  // Razorpay order ID from the earlier creation step
//   callback_url: "https://yourdomain.com/callback", // Your callback URL to receive payment updates
// };

// // Send the request to create the preferences
// const response = await razorpay.orders.create(options);

// import React, { useEffect, useState } from "react";
// import { TbArrowsMaximize } from "react-icons/tb";
// import { MdOutlineFileDownload } from "react-icons/md";
// import { IoClose } from "react-icons/io5";
// import displayINRCurrency from "../helpers/displayCurrency";
// import SummaryApi from "../common"; // Ensure you have the correct API object
// import * as XLSX from "xlsx"; // Import the xlsx library

// const ReturnedProducts = () => {
//   const [returnedOrders, setReturnedOrders] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [loadingOrder, setLoadingOrder] = useState(null); // To track which order is being updated
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [expandedOrders, setExpandedOrders] = useState({}); // To track expanded state

//   const handleToggleDetails = (orderId) => {
//     setExpandedOrders((prevState) => ({
//       ...prevState,
//       [orderId]: !prevState[orderId], // Toggle the expanded state
//     }));
//   };

//   const handleViewImage = (imageBase64) => {
//     // Set the selected image to open in the modal
//     setSelectedImage(imageBase64);
//   };

//   const handleCloseModal = () => {
//     // Clear the selected image to close the modal
//     setSelectedImage(null);
//   };

//   // Fetch all returned orders
//   const fetchReturnedOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${SummaryApi.allOrder.url}`, {
//         method: "GET",
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch returned orders");
//       }

//       const responseData = await response.json();
//       if (responseData.success) {
//         const orders = responseData.order
//           ? [responseData.order]
//           : responseData.orders || responseData.data;

//         const filteredOrders = orders.filter(
//           (each) => each.order_status === "returnRequested"
//         );
//         setReturnedOrders(filteredOrders);
//       } else {
//         setReturnedOrders([]);
//         setError(responseData.message || "Failed to fetch data");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReturnedOrders();
//   }, []);

//   // Handle return accepted button click
//   const handleReturnAccept = async (orderId, newStatus) => {
//     try {
//       setLoadingOrder(orderId); // Set loading state for the specific order

//       // Make the API request to update the order status
//       const response = await fetch(SummaryApi.updateOrderStatus.url, {
//         method: SummaryApi.updateOrderStatus.method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ orderId, order_status: newStatus }), // Update the body to match your API structure
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update order status");
//       }

//       // Update the local state immediately with the new status
//       setReturnedOrders((prevData) =>
//         prevData.map((item) =>
//           item.orderId === orderId ? { ...item, order_status: newStatus } : item
//         )
//       );
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoadingOrder(null); // Reset loading state after the operation
//     }
//   };

//   // Export returned orders to Excel
//   const handleExportExcel = () => {
//     const ordersToExport = returnedOrders.map((order) => {
//       const returnProducts = order.productDetails.filter(
//         (each) => each.isReturn === true
//       );
//       const totalAmount = returnProducts.reduce(
//         (acc, item) => acc + item.quantity * item?.sellingPrice,
//         0
//       );

//       return {
//         "Order ID": order.orderId,
//         "Customer Name": order.billing_name,
//         "Total Amount": displayINRCurrency(totalAmount),
//         "Return Reason": order.returnReason,
//         "Payment Method": order.paymentDetails?.payment_method_type || "N/A",
//         "Payment Status": order.paymentDetails?.payment_status || "N/A",
//       };
//     });

//     const ws = XLSX.utils.json_to_sheet(ordersToExport);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Returned Orders");

//     XLSX.writeFile(wb, "Returned_Orders.xlsx");
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-lg font-medium mb-4">Return Requested Products</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <div className="w-8 h-8 border-2 border-blue-400 border-dashed rounded-full animate-spin"></div>
//         </div>
//       ) : returnedOrders.length === 0 ? (
//         <p className="text-center">No Return Request Available</p>
//       ) : (
//         <div className="gap-4">
//           {/* Export to Excel Button */}
//           <button
//             onClick={handleExportExcel}
//             className="p-2 bg-blue-500 text-white rounded-md mb-4"
//           >
//             Export to Excel
//           </button>
//           {returnedOrders.map((order) => {
//             const returnProducts = order.productDetails.filter(
//               (each) => each.isReturn === true
//             );
//             const totalAmount = returnProducts.reduce(
//               (acc, item) => acc + item.quantity * item?.sellingPrice,
//               0
//             );
//             const isExpanded = expandedOrders[order.orderId]; // Check if the order is expanded

//             return (
//               <div className="border rounded-md" key={order.orderId}>
//                 <p className="pl-4 pt-4">
//                   <span className="text-red-500 font-bold">Reason: </span>
//                   {order.returnReason}
//                 </p>
//                 <div className="p-4 flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">Order ID: {order.orderId}</p>
//                     {returnProducts.map((product) => (
//                       <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
//                         {product?.productName}
//                       </h2>
//                     ))}
//                     <p>Customer: {order.billing_name}</p>
//                     <p>Total Amount: {displayINRCurrency(totalAmount)}</p>
//                     <button
//                       onClick={() => handleToggleDetails(order.orderId)}
//                       className="mt-2 text-blue-500 underline"
//                     >
//                       {isExpanded ? "Hide Details" : "View All Details"}
//                     </button>
//                   </div>
//                   <div className="flex flex-wrap items-center">
//                     {order.returnImages.map((eachImage, index) => (
//                       <div
//                         key={index}
//                         className="relative group m-2"
//                         style={{
//                           width: "100px",
//                           height: "100px",
//                         }}
//                       >
//                         <img
//                           src={eachImage.imageBase64}
//                           alt={`Return ${index + 1}`}
//                           className="w-full h-full object-cover rounded-lg"
//                         />

//                         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
//                           <button
//                             onClick={() => handleViewImage(eachImage.imageBase64)}
//                             className="text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 m-1"
//                             title="View Image"
//                           >
//                             <TbArrowsMaximize />
//                           </button>

//                           <a
//                             href={eachImage.imageBase64}
//                             download={`ReturnImage_${index + 1}`}
//                             className="text-white bg-green-500 hover:bg-green-600 rounded-full p-2 m-1"
//                             title="Download Image"
//                           >
//                             <MdOutlineFileDownload />
//                           </a>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     onClick={() =>
//                       handleReturnAccept(order.orderId, "returnAccepted")
//                     }
//                     className={`p-2 rounded-md text-white ${
//                       loadingOrder === order.orderId
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : order.order_status === "returnRequested"
//                         ? "bg-green-500"
//                         : order.order_status === "returnAccepted"
//                         ? "bg-yellow-500"
//                         : "bg-red-500"
//                     }`}
//                     disabled={loadingOrder === order.orderId}
//                   >
//                     {loadingOrder === order.orderId
//                       ? "Updating..."
//                       : order.order_status === "returnRequested"
//                       ? "Accept"
//                       : "Accepted"}
//                   </button>
//                 </div>
//                 {isExpanded && (
//                   <div className="mt-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-1 md:p-2 xl:p-3">
//                       <div className="border p-4 rounded-md">
//                         <div className="text-lg font-medium">Payment Details</div>
//                         <p className="ml-1">
//                           Payment method:{" "}
//                           {order.paymentDetails?.payment_method_type || "N/A"}
//                         </p>
//                         <p className="ml-1">
//                           Payment Status:{" "}
//                           {order.paymentDetails?.payment_status || "N/A"}
//                         </p>
//                       </div>

//                       <div className="border p-4 rounded-md">
//                         <div className="text-lg font-medium">Customer Details</div>
//                         <p className="ml-1">Name: {order.billing_name}</p>
//                         <p className="ml-1">Email: {order.billing_email}</p>
//                         <p className="ml-1">Phone: {order.billing_phone}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
//           onClick={handleCloseModal}
//         >
//           <img
//             src={selectedImage}
//             alt="Selected"
//             className="max-w-full max-h-full object-contain"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReturnedProducts;

// const userModel = require("../../models/userModel");
// const productModel = require("../../models/productModel");
// const orderModel = require("../../models/orderProductModel");
// const CookieAcceptance = require("../../models/CookieAcceptance");
// const ProductCategory = require("../../models/productCategory");
// const addToCartModel = require("../../models/cartProduct")
// const moment = require('moment');
// // Function to get the financial year's start date
// function getFinancialYearStartDate() {
//   const currentDate = new Date();
//   let startYear = currentDate.getFullYear();
//   if (currentDate.getMonth() < 3) {
//     // Before April
//     startYear -= 1;
//   }
//   return new Date(startYear, 3, 1); // April 1st
// }
// // Helper function for MTD filter
// function getMTDFilter(startDate, endDate) {
//   const startOfMonth = startDate
//     ? new Date(startDate)
//     : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//   const endOfMonth = endDate
//     ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999))
//     : new Date();
//   return {
//     createdAt: {
//       $gte: startOfMonth,
//       $lte: endOfMonth,
//     },
//   };
// }
// // function calculatePercentage(current, previous) {
// //   if (previous === 0) return current > 0 ? 100 : 0;
// //   return ((current - previous) / previous) * 100;
// // }
// function calculatePercentage(current, previous) {
//   if (previous === 0) {
//     return current > 0 ? 100 : 0;
//   }
//   const percentage = ((current - previous) / previous) * 100;
//   return percentage;
// }
// function getTrend(percentage) {
//   return percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral";
// }
// function getStatics(trend, comparisonPeriod) {
//   switch (trend) {
//     case "up":
//       return `Up from ${comparisonPeriod}`;
//     case "down":
//       return `Down from ${comparisonPeriod}`;
//     default:
//       return `No change from ${comparisonPeriod}`;
//   }
// }
// const currentDayFilter = {
//   createdAt: {
//     $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
//     $lt: new Date(new Date().setHours(23, 59, 59, 999)), // End of today
//   },
// };
// const previousDayFilter = {
//   createdAt: {
//     $gte: moment().subtract(1, 'days').startOf('day').toDate(),
//     $lt: moment().subtract(1, 'days').endOf('day').toDate(),
//   },
// };
// const previousMonthFilter = {
//   createdAt: {
//     $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), // Start of previous month
//     $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
//   },
// };
// const previousYearFilter = {
//   createdAt: {
//     $gte: new Date(new Date().getFullYear() - 1, 3, 1), // Start of previous financial year
//     $lt: getFinancialYearStartDate(), // Start of current financial year
//   },
// };
// // Helper function for YTD filter
// function getYTDFilter(startDate, endDate) {
//   const financialYearStart = getFinancialYearStartDate();
//   const financialYearEnd = new Date(
//     new Date(financialYearStart).setFullYear(
//       financialYearStart.getFullYear() + 1
//     )
//   );
//   const ytdStart = startDate ? new Date(startDate) : financialYearStart;
//   const ytdEnd = endDate
//     ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999))
//     : financialYearEnd;
//   return {
//     createdAt: {
//       $gte: ytdStart,
//       $lte: ytdEnd,
//     },
//   };
// }
// exports.getDashboardCounts = async (req, res) => {
//   const { startDate, endDate, category } = req.query;
//   try {
//     // General date range filter
//     const dateFilter =
//       startDate && endDate
//         ? {
//           createdAt: {
//             $gte: new Date(startDate),
//             $lte: new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)),
//           },
//         }
//         : {};
//     // Category filter for products within orders
//     const categoryFilter = category ? { category } : {};
//     const categoryCountFilter = category ? { value: category } : {};
//     const categoryFilterOrders = category
//       ? {
//         productDetails: { $elemMatch: { category } },
//       }
//       : {};
//     const mtdFilter = getMTDFilter(startDate, endDate);
//     const ytdFilter = getYTDFilter(startDate, endDate);
//     // Fetch general counts
//     const userCount = await userModel.countDocuments(dateFilter);
//     const productCount = await productModel.countDocuments({ ...categoryFilter });
//     const categoryCount = await ProductCategory.countDocuments(categoryCountFilter);
//     const cartCount = await addToCartModel.countDocuments({ ...dateFilter, ...categoryFilter })
//     const orderCount = await orderModel.countDocuments({
//       ...dateFilter,
//       ...categoryFilterOrders,
//       order_status: { $ne: "Pending" }
//     });
//     // Calculate product stock for the specified category
//     const products = await productModel.find({ ...categoryFilter }, 'availability').lean();
//     const productStock = products.reduce(
//       (total, product) => total + (product.availability || 0),
//       0
//     );
//     // Calculate visitors
//     const visitors = await CookieAcceptance.find({}, 'acceptanceTimestamps').lean();
//     const totalVisitor = visitors.reduce((count, doc) => {
//       const filteredTimestamps = doc.acceptanceTimestamps.filter((timestamp) => {
//         const date = new Date(timestamp);
//         const startDateUTC = startDate
//           ? new Date(startDate).setUTCHours(0, 0, 0, 0)
//           : null;
//         const endDateUTC = endDate
//           ? new Date(endDate).setUTCHours(23, 59, 59, 999)
//           : null;
//         return (!startDateUTC || date >= startDateUTC) && (!endDateUTC || date <= endDateUTC);
//       });
//       return count + filteredTimestamps.length;
//     }, 0);
//     // month wise counts
//     const mtdUsers = await userModel.countDocuments(mtdFilter);
//     const mtdOrders = await orderModel.countDocuments({ ...mtdFilter, ...categoryFilterOrders ,order_status: { $ne: "Pending" } });
//     const mtdVisitors = visitors.reduce((count, doc) => {
//       const startOfMonth = mtdFilter.createdAt.$gte;
//       return count + doc.acceptanceTimestamps.filter((timestamp) => {
//         const date = new Date(timestamp);
//         return date >= startOfMonth && date <= mtdFilter.createdAt.$lte;
//       }).length;
//     }, 0);
//     // Year wise Counts
//     const ytdUsers = await userModel.countDocuments(ytdFilter);
//     const ytdOrders = await orderModel.countDocuments({ ...ytdFilter, ...categoryFilterOrders, order_status: { $ne: "Pending" } });
//     const ytdVisitors = visitors.reduce((count, doc) => {
//       const ytdStart = ytdFilter.createdAt.$gte;
//       return count + doc.acceptanceTimestamps.filter((timestamp) => {
//         const date = new Date(timestamp);
//         return date >= ytdStart && date <= ytdFilter.createdAt.$lte;
//       }).length;
//     }, 0);
//     let salesAmount = 0;
//     let returnSalesAmount = 0;
//     let cancelSalesAmount = 0;
//     let damageSalesAmount = 0;
//     let mtdSalesAmount = 0;
//     let ytdSalesAmount = 0;
//     let totalSalesAmount = 0;
//     let totalMtdSalesAmount = 0;
//     let totalYtdSalesAmount = 0;
//     const statusCounts = {
//       pending: 0,
//       ordered: 0,
//       packaged: 0,
//       shipped: 0,
//       delivered: 0,
//       cancelled: 0,
//       returnRequested: 0,
//       returnAccepted: 0,
//       returned: 0,
//     };
//     const ytdStatusCounts = { ...statusCounts, };
//     const mtdStatusCounts = { ...statusCounts, };
//     // Fetch orders and calculate statuses
//     const orders = await orderModel.find({ ...dateFilter, ...categoryFilterOrders, }).lean();
//     orders.forEach((order) => {
//       const { statusUpdates, productDetails, order_status } = order;
//     // Update Pending Status Count
//     if (order_status === 'Pending') {
//         statusCounts.pending++;
//     }
//       const latestStatus = statusUpdates?.at(-1)?.status || 'pending';
//       // If a category is selected, filter the products based on that category
//       const categoryProducts = productDetails.filter(
//         (product) => !category || product.category === category
//       );
//       // Skip this order if no products match the selected category
//       if (!categoryProducts.length) return;
//       // Product Status counts
//       if (latestStatus && statusCounts.hasOwnProperty(latestStatus)) {
//         statusCounts[latestStatus]++;
//       }
//       if (ytdFilter.createdAt.$gte <= new Date(order.createdAt) && ytdFilter.createdAt.$lte >= new Date(order.createdAt)) {
//         if (latestStatus && ytdStatusCounts.hasOwnProperty(latestStatus)) {
//           ytdStatusCounts[latestStatus]++;
//         }
//       }
//       if (mtdFilter.createdAt.$gte <= new Date(order.createdAt) && mtdFilter.createdAt.$lte >= new Date(order.createdAt)) {
//         if (latestStatus && mtdStatusCounts.hasOwnProperty(latestStatus)) {
//           mtdStatusCounts[latestStatus]++;
//         }
//       }
//       // Calculate the total amount for the selected category products only
//       const categoryTotalAmount = categoryProducts.reduce(
//         (sum, product) => sum + (product.sellingPrice || 0) * product.quantity,
//         0
//       );
//       // Total Sales Calculations and Skip sales calculations for orders with 'Pending' status
//       if (order_status !== 'Pending') {
//         salesAmount += categoryTotalAmount;
//         if (new Date(order.createdAt) >= mtdFilter.createdAt.$gte && new Date(order.createdAt) <= mtdFilter.createdAt.$lte) {
//           mtdSalesAmount += categoryTotalAmount;
//         }
//         if (new Date(order.createdAt) >= ytdFilter.createdAt.$gte && new Date(order.createdAt) <= ytdFilter.createdAt.$lte) {
//           ytdSalesAmount += categoryTotalAmount;
//         }
//       }
//       // Return Sales Calculations
//       if (latestStatus === 'returned') {
//         damageSalesAmount += categoryTotalAmount;
//       } 
//       // Canceled and Damaged Orders
//       if (latestStatus === 'cancelled') {
//         cancelSalesAmount += categoryTotalAmount;
//       }

//       returnSalesAmount = damageSalesAmount + cancelSalesAmount

//       totalSalesAmount = salesAmount - returnSalesAmount

//       totalMtdSalesAmount = salesAmount - returnSalesAmount

//       totalYtdSalesAmount = salesAmount - returnSalesAmount

//     });
//     // Total Sales Amount percentage, trends, statics
//     const [todayOrders, prevDayOrders, prevMonthOrders, prevYearOrders] = await Promise.all([
//       orderModel.find({ ...currentDayFilter, ...categoryFilterOrders, "paymentDetails.payment_status": "success" }),
//       orderModel.find({ ...previousDayFilter, ...categoryFilterOrders, "paymentDetails.payment_status": "success" }),
//       orderModel.find({ ...previousMonthFilter, ...categoryFilterOrders, "paymentDetails.payment_status": "success" }),
//       orderModel.find({ ...previousYearFilter, ...categoryFilterOrders, "paymentDetails.payment_status": "success" }),
//     ]);
//     // Calculate sales
//     const calculateSales = (orders) => {
//       return orders.reduce(
//         (sum, order) =>
//           sum +
//           order.productDetails.reduce(
//             (productSum, product) =>
//               productSum + (product.sellingPrice || 0) * product.quantity,
//             0
//           ),
//         0
//       );
//     };

//     const todaySales = calculateSales(todayOrders || []);
    
//     const prevDaySales = calculateSales(prevDayOrders || []);
    
    
//     const prevMonthSales = calculateSales(prevMonthOrders);
//     const prevYearSales = calculateSales(prevYearOrders);

//     // Calculate percentages and trends
//     const salesPercentage = calculatePercentage(todaySales, prevDaySales);
    
//     const mtdPercentage = calculatePercentage(totalMtdSalesAmount, prevMonthSales);
//     const ytdPercentage = calculatePercentage(totalYtdSalesAmount, prevYearSales);

//     const salesTrend = getTrend(salesPercentage);
//     const mtdTrend = getTrend(mtdPercentage);
//     const ytdTrend = getTrend(ytdPercentage);

//     const salesStatics = getStatics(salesTrend, "yesterday");
//     const mtdStatics = getStatics(mtdTrend, "last month");
//     const ytdStatics = getStatics(ytdTrend, "last year");

//         // total visitors percentage, trends, statics
//         const [todayVisitorCo, prevDayVisitorCo, prevMonthVisitorCo, prevYearVisitorCo] = await Promise.all([
//           CookieAcceptance.find({ ...currentDayFilter }),
//           CookieAcceptance.find({ ...previousDayFilter }),
//           CookieAcceptance.find({ ...previousMonthFilter }),
//           CookieAcceptance.find({ ...previousYearFilter }),
//         ]);
    
//         // Calculate sales
//         const calculateTotalVisitors = (visitors) => {
//           // Sum up the `count` field for all visitors
//           return visitors.reduce((total, visitor) => total + (visitor.count || 0), 0);
//         };
    
//         const todayVisitors = calculateTotalVisitors(todayVisitorCo);
//         const prevDayVisitors = calculateTotalVisitors(prevDayVisitorCo);
//         const prevMonthVisitors = calculateTotalVisitors(prevMonthVisitorCo);
//         const prevYearVisitors = calculateTotalVisitors(prevYearVisitorCo);
    
//         // Calculate percentages and trends
//         const visitorsPercentage = calculatePercentage(todayVisitors, prevDayVisitors);
//         const visitorMtdPercentage = calculatePercentage(mtdVisitors, prevMonthVisitors);
//         const visitorYtdPercentage = calculatePercentage(ytdVisitors, prevYearVisitors);
    
//         const visitorTrend = getTrend(visitorsPercentage);
//         const visitorMtdTrend = getTrend(visitorMtdPercentage);
//         const visitorYtdTrend = getTrend(visitorYtdPercentage);
    
//         const visitorStatics = getStatics(visitorTrend, "yesterday");
//         const visitorMtdStatics = getStatics(visitorMtdTrend, "last month");
//         const visitorYtdStatics = getStatics(visitorYtdTrend, "last year");

//     res.status(200).json({
//       success: true,
//       message: startDate && endDate
//         ? 'Counts fetched successfully for the specified date range'
//         : 'Total counts fetched successfully',
//       data: {
//         productStock,
//         categoryCount,
//         cartCount,
//         totalProducts: productCount,
//         visitors: {
//           total: totalVisitor,
//           percentage: visitorsPercentage.toFixed(0) + '%',
//           trend: visitorTrend,
//           statics: visitorStatics,
//           monthly: {
//             total:mtdVisitors,
//             percentage: visitorMtdPercentage.toFixed(0) + '%',
//             trend: visitorMtdTrend,
//             statics: visitorMtdStatics,
//           },
//           yearly: {
//             total: ytdVisitors,
//             percentage: visitorYtdPercentage.toFixed(0) + '%',
//             trend: visitorYtdTrend,
//             statics: visitorYtdStatics,
//           },
//         },
//         users: {
//           total: userCount,
//           monthly: mtdUsers,
//           yearly: ytdUsers,
//         },
//         orders: {
//           total: orderCount,
//           monthly: mtdOrders,
//           yearly: ytdOrders,
//         },
//         statuses: {
//           total: statusCounts,
//           monthly: mtdStatusCounts,
//           yearly: ytdStatusCounts,
//         },
//         sales: {
//           total: totalSalesAmount,
//           percentage: salesPercentage.toFixed(0) + '%',
//           trend: salesTrend,
//           statics: salesStatics,
//           monthly: {
//             total: totalMtdSalesAmount,
//             percentage: mtdPercentage.toFixed(0) + '%',
//             trend: mtdTrend,
//             statics: mtdStatics,
//           },
//           yearly: {
//             total: totalYtdSalesAmount,
//             percentage: ytdPercentage.toFixed(0) + '%',
//             trend: ytdTrend,
//             statics: ytdStatics,
//           },
//         },
//         salesReturn: {
//           total: returnSalesAmount,
//           return: damageSalesAmount,
//           cancel: cancelSalesAmount,
//         },


//       },
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching counts",
//       error: error.message,
//     });
//   }
// };
// exports.verifyPayment = async (req, res) => {
//   const { razorpayPaymentId, cartItems, customerInfo, razorpayOrderId } = req.body;

//   if (!razorpayPaymentId || !razorpayOrderId) {
//       return res.status(400).json({
//           success: false,
//           message: 'Payment ID and Order ID are required'
//       });
//   }

//   try {
//       // Verify the payment status and get the payment method
//       const { isPaymentCaptured, paymentMethod, paymentDetails } = await verifyPayment(razorpayPaymentId);
// console.log(paymentDetails);

//       if (isPaymentCaptured) {
//           // Batch database operations in parallel
//           const [updatedOrder, clearedCart] = await Promise.all([
//               orderModel.findOneAndUpdate(
//                   { orderId: razorpayOrderId },
//                   {
//                       $set: {
//                           'paymentDetails.paymentId': razorpayPaymentId,
//                           'paymentDetails.payment_status': 'success',
//                           'paymentDetails.payment_method_type': paymentMethod, // Save payment method
//                           'paymentDetails.fullDetails': paymentDetails, // Save full payment details
//                           'order_status': 'ordered',
//                           updatedAt: new Date(),
//                       },
//                       $push: {
//                           statusUpdates: {
//                               status: 'ordered',
//                               timestamp: new Date(),
//                           },
//                       },
//                   },
//                   { new: true }
//               ),
//               addToCartModel.deleteMany({ userId: req.userId }), // Clear cart in parallel
//           ]);

//           // Check if the order was updated
//           if (!updatedOrder) {
//               return res.status(404).json({
//                   success: false,
//                   message: 'Order not found.',
//               });
//           }

//           // Calculate delivery date (4 days from now)
//           const deliveryDate = moment().add(4, 'days').toDate(); // Use moment.js to add 4 days

//           // Update the order with the delivery date
//           await orderModel.updateOne(
//               { orderId: updatedOrder.orderId },
//               { $set: { delivered_at: deliveryDate } }
//           );

//           // Parallelize product availability update and email sending
//           await Promise.all([
//               // Update product availability in parallel
//               ...cartItems.map((item) =>
//                   productModel.findByIdAndUpdate(
//                       item.productId._id,
//                       { $inc: { availability: -1 } }, // Decrease the available quantity by 1
//                       { new: true }
//                   )
//               ),
//               // Send emails in parallel
//               sendOrderConfirmationEmail(customerInfo, razorpayPaymentId, updatedOrder),
//               sendAdminNotificationEmail(updatedOrder),
//           ]);

//           res.json({
//               success: true,
//               message: 'Payment successful and order confirmed.',
//               paymentMethod, // Optionally return the payment method in the response
//           });
//       } else {
//           // Payment failed, send cart reminder
//           await sendCartReminder(customerInfo, cartItems);

//           res.status(400).json({
//               success: false,
//               message: 'Payment failed. Reminder sent to complete the purchase.',
//           });
//       }
//   } catch (error) {
//       console.error("Error in verifyPayment:", error.message || error); // Log the specific error message
//       res.status(500).json({
//           success: false,
//           message: error.message || "Internal Server Error",
//       });
//   }
// };

// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import SummaryApi from '../common';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsersViewfinder, faCalendarCheck, faArrowUpWideShort, faSackXmark, faHeartCrack, faCubes, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

// const Dashboard = () => {
//   const navigate = useNavigate(); // Initialize navigate
//   const [category, setCategory] = useState("");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [categories, setCategories] = useState([]);
//   const [dashboardData, setDashboardData] = useState({
//     visitors: 0,
//     users: 0,
//     orders: 0,
//     totalProducts: 0,
//     statuses: {},
//   });

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//   };

//   const displayINRCurrency = (num) => {
//     const formatter = new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     });
//     return formatter.format(num);
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getProductCategory.url);
//       const data = await response.json();
//       const filteredCategories = data.categories.filter(
//         (category) => category.productCount > 0
//       );
//       if (data.success) {
//         setCategories(filteredCategories);
//       } else {
//         console.error("Error fetching categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch data from the backend
//   const fetchData = async () => {
//     let url = SummaryApi.getDashboard.url;
//     if (dateRange || category) {
//       url += `?startDate=${dateRange.start}&endDate=${dateRange.end || dateRange.start}&category=${category}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.success) {
//         setDashboardData(data.data);
//       } else {
//         console.error("Error fetching data:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Fetch data on component mount and when the date range changes
//   useEffect(() => {
//     fetchData();
//   }, [dateRange, category]);

//   const handleDateChange = (e) => {
//     setDateRange({
//       ...dateRange,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCardClick = (cardTitle) => {
//     // Navigate to a different route based on the card clicked
//     switch (cardTitle) {
//       case "Visitors":
//         navigate("/all-visitors");
//         break;
//       case "MTD":
//         navigate("/monthly-dashboard");
//         break;
//       case "YTD":
//         navigate("/yearly-dashboard");
//         break;
//       case "Sales":
//         navigate("/sales-dashboard");
//         break;
//       case "Total Products":
//         navigate("/all-products");
//         break;
//       case "Orders":
//         navigate("/all-orders");
//         break;
//       case "Users":
//         navigate("/all-users");
//         break;
//       case "Total Categories":
//         navigate("/all-categories");
//         break;
//       default:
//         navigate("/dashboard"); // Default case
//         break;
//     }
//   };

//   const cards = [
//     { icon: <FontAwesomeIcon icon={faUsersViewfinder} />, title: "Visitors", count: dashboardData?.visitors?.total || 0, percentage: dashboardData?.visitors?.percentage, trend: dashboardData?.visitors?.trend, statics: dashboardData?.visitors?.statics, description: "Total Visitors Count", bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", count: dashboardData?.visitors?.monthly?.total || 0, percentage: dashboardData?.visitors?.monthly?.percentage, trend: dashboardData?.visitors?.monthly?.trend, statics: dashboardData?.visitors?.monthly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", count: dashboardData?.visitors?.yearly?.total || 0, percentage: dashboardData?.visitors?.yearly?.percentage, trend: dashboardData?.visitors?.yearly?.trend, statics: dashboardData?.visitors?.yearly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faArrowUpWideShort} />, title: "Sales", count: displayINRCurrency(dashboardData?.sales?.total || 0), percentage: dashboardData?.sales?.percentage, trend: dashboardData?.sales?.trend, statics: dashboardData?.sales?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200', iconColor: 'text-green-600' },
//     { icon: <FontAwesomeIcon icon={faCubes} />, title: "Total Products", count: dashboardData?.totalProducts || 0, description: "Total products Count", bgColor: 'bg-violet-200', iconColor: 'text-violet-600' },
//     { icon: <FontAwesomeIcon icon={faBoxOpen} />, title: "Packed Count", count: dashboardData?.statuses?.total?.packaged || 0, description: "Packed Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
//     { icon: <FontAwesomeIcon icon={faHandshakeSimple} />, title: "Orders", count: dashboardData?.orders?.total || 0, description: "Total Orders Count", bgColor: 'bg-orange-200', iconColor: 'text-orange-600' },
//   ];

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <div className="flex items-center justify-between mb-6 flex-wrap">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             className={`shadow-md rounded-lg p-2 flex flex-col justify-between ${card.bgColor}`}
//             onClick={() => handleCardClick(card.title)} // Trigger navigation on card click
//           >
//             <div className="flex items-center justify-between mb-1">
//               <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
//             </div>
//             <p className="text-xl font-bold text-gray-900">{card.count}</p>
//             <div className="flex justify-between items-center mt-1">
//               <p className="text-sm text-gray-500">{card.description}</p>
//             </div>
//             <div className="flex justify-between items-center">
//               <p className={`text-sm font-bold ${card.trend === "up" ? "text-green-600" : card.trend === "down" ? "text-red-500" : "text-yellow-500"}`}>
//                 {card.statics}
//               </p>
//               <p className={`text-gray-700 text-2xl ${card.iconColor}`}>{card.icon}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import SummaryApi from '../common';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsersViewfinder, faArrowUpWideShort, faArrowDownWideShort, faCubes, faCubesStacked, faLayerGroup, faUsers, faHandshakeSimple, faHourglassHalf, faCartArrowDown, faTruckFast, faBoxOpen, faCommentDots, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

// const Dashboard = () => {
//   const [category, setCategory] = useState("");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [categories, setCategories] = useState([]);
//   const [dashboardData, setDashboardData] = useState({
//     visitors: 0,
//     users: 0,
//     orders: 0,
//     totalProducts: 0,
//     statuses: {},
//   });
  
//   // State to manage the active page/tab
//   const [activeTab, setActiveTab] = useState("visitors");

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getProductCategory.url);
//       const data = await response.json();
//       const filteredCategories = data.categories.filter(category => category.productCount > 0);
//       if (data.success) {
//         setCategories(filteredCategories);
//       } else {
//         console.error("Error fetching categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   // Fetch data from the backend
//   const fetchData = async () => {
//     let url = SummaryApi.getDashboard.url;
//     if (dateRange || category) {
//       url += `?startDate=${dateRange.start}&endDate=${dateRange.end || dateRange.start}&category=${category}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       if (data.success) {
//         setDashboardData(data.data);
//       } else {
//         console.error("Error fetching data:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchData();
//   }, [dateRange, category]);

//   // Handle category change
//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//   };

//   // Handle date range change
//   const handleDateChange = (e) => {
//     setDateRange({
//       ...dateRange,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Show data in INR format
//   const displayINRCurrency = (num) => {
//     const formatter = new Intl.NumberFormat('en-IN', {
//       style: "currency",
//       currency: 'INR',
//       minimumFractionDigits: 0,
//     });

//     return formatter.format(num);
//   };

//   // Define cards and sections based on the active tab
//   const cards = {
//     visitors: [
//       { icon: <FontAwesomeIcon icon={faUsersViewfinder} />, title: "Visitors", count: dashboardData?.visitors?.total || 0, description: "Total Visitors Count" },
//       { icon: <FontAwesomeIcon icon={faUsers} />, title: "Users", count: dashboardData?.users?.total || 0, description: "Total User Count" },
//     ],
//     sales: [
//       { icon: <FontAwesomeIcon icon={faArrowUpWideShort} />, title: "Sales", count: displayINRCurrency(dashboardData?.sales?.total || 0), description: "Total Sales Amount" },
//       { icon: <FontAwesomeIcon icon={faArrowDownWideShort} />, title: "Return", count: displayINRCurrency(dashboardData?.salesReturn?.total || 0), description: "Total Return Amount" },
//     ],
//     orders: [
//       { icon: <FontAwesomeIcon icon={faHandshakeSimple} />, title: "Orders", count: dashboardData?.orders?.total || 0, description: "Total Orders Count" },
//       { icon: <FontAwesomeIcon icon={faCartArrowDown} />, title: "Cart Count", count: dashboardData?.cartCount || 0, description: "Add ToCart Count" },
//     ],
//     products: [
//       { icon: <FontAwesomeIcon icon={faCubes} />, title: "Total Products", count: dashboardData?.totalProducts || 0, description: "Total Products Count" },
//       { icon: <FontAwesomeIcon icon={faCubesStacked} />, title: "Product Stock", count: dashboardData?.productStock || 0, description: "Product Stock Count" },
//     ]
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <div className="flex items-center justify-between mb-6 flex-wrap">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//         <div className="flex items-center gap-2 flex-wrap">
//           <select
//             required
//             value={category}
//             name="category"
//             onChange={handleCategoryChange}
//             className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Category</option>
//             {categories.map((el, index) => (
//               <option value={el.value} key={el.value + index}>
//                 {el.label}
//               </option>
//             ))}
//           </select>

//           <div className="flex items-center gap-2 flex-wrap">
//             <input
//               type="date"
//               name="start"
//               value={dateRange.start}
//               onChange={handleDateChange}
//               className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="text-gray-500 hidden md:block">to</span>
//             <input
//               type="date"
//               name="end"
//               value={dateRange.end || dateRange.start}
//               onChange={handleDateChange}
//               className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Tab Navigation */}
//       <div className="flex space-x-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded-md ${activeTab === 'visitors' ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
//           onClick={() => setActiveTab('visitors')}
//         >
//           Visitors
//         </button>
//         <button
//           className={`px-4 py-2 rounded-md ${activeTab === 'sales' ? 'bg-green-600 text-white' : 'bg-green-200'}`}
//           onClick={() => setActiveTab('sales')}
//         >
//           Sales
//         </button>
//         <button
//           className={`px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-orange-600 text-white' : 'bg-orange-200'}`}
//           onClick={() => setActiveTab('orders')}
//         >
//           Orders
//         </button>
//         <button
//           className={`px-4 py-2 rounded-md ${activeTab === 'products' ? 'bg-purple-600 text-white' : 'bg-purple-200'}`}
//           onClick={() => setActiveTab('products')}
//         >
//           Products
//         </button>
//       </div>

//       {/* Display Cards based on Active Tab */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {cards[activeTab]?.map((card, index) => (
//           <div key={index} className="shadow-md rounded-lg p-4 bg-white">
//             <div className="flex justify-between mb-2">
//               <h2 className="text-lg font-semibold">{card.title}</h2>
//             </div>
//             <p className="text-xl font-bold">{card.count}</p>
//             <p className="text-sm text-gray-500">{card.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import SummaryApi from '../common';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLayerGroup, faArrowDownWideShort, faCubes, faCalendarCheck, faHandshakeSimple, faSackXmark, faHeartCrack, faCubesStacked, faPeopleCarryBox, faDiagramSuccessor, faCommentDots, faUsers, faBan, faCartArrowDown, faClipboardCheck, faHourglassHalf, faUsersViewfinder, faArrowUpWideShort, faTruckFast, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

// const Dashboard = () => {
//   const [category, setCategory] = useState("");
//   const [dateRange, setDateRange] = useState({start:"", end:""});
//   const [categories, setCategories] = useState([]);
//   const [dashboardData, setDashboardData] = useState({
//     visitors: 0,
//     users: 0,
//     orders: 0,
//     totalProducts: 0,
//     statuses: {},
//   });
//   const [filteredData, setFilteredData] = useState(null);

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//   };

//   const displayINRCurrency = (num) => {
//     const formatter = new Intl.NumberFormat('en-IN',{
//       style : "currency",
//       currency : 'INR',
//       minimumFractionDigits : 0
//     });

//     return formatter.format(num);
//   }

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getProductCategory.url);
//       const data = await response.json();
//       const filteredCategories = data.categories.filter(category => category.productCount > 0);
//       if (data.success) {
//         setCategories(filteredCategories);
//       } else {
//         console.error("Error fetching categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchData = async () => {
//     let url = SummaryApi.getDashboard.url;
//     if (dateRange || category) {
//       url += `?startDate=${dateRange.start}&endDate=${dateRange.end || dateRange.start}&category=${category}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
      
//       if (data.success) {
//         setDashboardData(data.data);
//       } else {
//         console.error("Error fetching data:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [dateRange, category]);

//   const handleDateChange = (e) => {
//     setDateRange({
//       ...dateRange,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleCardClick = (cardType) => {
//     // Filter data based on the card type
//     // Update the state with the filtered data
//     const filtered = dashboardData[cardType];
//     setFilteredData(filtered);
//   };

//   const cards = [
//     { type: 'visitors', icon: <FontAwesomeIcon icon={faUsersViewfinder} />, title: "Visitors", count: dashboardData?.visitors?.total || 0, percentage: dashboardData?.visitors?.percentage, trend: dashboardData?.visitors?.trend, statics: dashboardData?.visitors?.statics, description: "Total Visitors Count", bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { type: 'sales', icon: <FontAwesomeIcon icon={faArrowUpWideShort} />, title: "Sales", count: displayINRCurrency(dashboardData?.sales?.total || 0), percentage: dashboardData?.sales?.percentage, trend: dashboardData?.sales?.trend, statics: dashboardData?.sales?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200', iconColor: 'text-green-600' },
//     // Add other cards here with their respective types
//   ];

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <div className="flex items-center justify-between mb-6 flex-wrap">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//         <div className="flex items-center gap-2 flex-wrap">
//           <select
//             required
//             value={category}
//             name="category"
//             onChange={handleCategoryChange}
//             className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Category</option>
//             {categories.map((el, index) => (
//               <option value={el.value} key={el.value + index}>
//                 {el.label}
//               </option>
//             ))}
//           </select>

//           <div className="flex items-center gap-2 flex-wrap">
//             <input
//               type="date"
//               name="start"
//               value={dateRange.start}
//               onChange={handleDateChange}
//               className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="text-gray-500 hidden md:block">to</span>
//             <input
//               type="date"
//               name="end"
//               value={dateRange.end || dateRange.start}
//               onChange={handleDateChange}
//               className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             className={`shadow-md rounded-lg p-2 flex flex-col justify-between ${card.bgColor}`}
//             onClick={() => handleCardClick(card.type)}
//             style={{ cursor: 'pointer' }}
//           >
//             <div className="flex items-center justify-between mb-1">
//               <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
//               <span className={`text-sm font-bold ${card.trend === "up" ? "text-green-600" : card.trend === "down" ? "text-red-500" : "text-yellow-500"}`}>
//                 {card.trend === "up" || card.trend === "neutral" ? "↑" : card.trend === "down" ? "↓" : ""} {card.percentage}
//               </span>
//             </div>
//             <p className="text-xl font-bold text-gray-900">{card.count}</p>
//             <div className="flex justify-between items-center mt-1">
//               <p className="text-sm text-gray-500">{card.description}</p>
//             </div>
//             <div className="flex justify-between items-center">
//               <p className={`text-sm font-bold ${card.trend === "up" ? "text-green-600" : card.trend === "down" ? "text-red-500" : "text-yellow-500"}`}>{card.statics}</p>
//               <p className={`text-gray-700 text-2xl ${card.iconColor}`}>{card.icon}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       {filteredData && (
//         <div className="mt-6">
//           <h2 className="text-xl font-bold">Filtered Data</h2>
//           {/* Render filtered data here */}
//           <pre>{JSON.stringify(filteredData, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import SummaryApi from '../common';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsersViewfinder, faCalendarCheck, faArrowUpWideShort, faSackXmark, faHeartCrack, faCubes, faBoxOpen, faHandshakeSimple } from '@fortawesome/free-solid-svg-icons';

// const Dashboard = () => {
//   const navigate = useNavigate(); // Initialize navigate
//   const [category, setCategory] = useState("");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [categories, setCategories] = useState([]);
//   const [dashboardData, setDashboardData] = useState({
//     visitors: 0,
//     users: 0,
//     orders: 0,
//     totalProducts: 0,
//     statuses: {},
//   });

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//   };

//   const displayINRCurrency = (num) => {
//     const formatter = new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     });
//     return formatter.format(num);
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getProductCategory.url);
//       const data = await response.json();
//       const filteredCategories = data.categories.filter(
//         (category) => category.productCount > 0
//       );
//       if (data.success) {
//         setCategories(filteredCategories);
//       } else {
//         console.error("Error fetching categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch data from the backend
//   const fetchData = async () => {
//     let url = SummaryApi.getDashboard.url;
//     if (dateRange || category) {
//       url += `?startDate=${dateRange.start}&endDate=${dateRange.end || dateRange.start}&category=${category}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.success) {
//         setDashboardData(data.data);
//       } else {
//         console.error("Error fetching data:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Fetch data on component mount and when the date range changes
//   useEffect(() => {
//     fetchData();
//   }, [dateRange, category]);

//   const handleDateChange = (e) => {
//     setDateRange({
//       ...dateRange,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCardClick = (cardTitle) => {
//     // Navigate to a different route based on the card clicked
//     switch (cardTitle) {
//       case "Visitors":
//         navigate("/all-visitors");
//         break;
//       case "MTD":
//         navigate("/monthly-dashboard");
//         break;
//       case "YTD":
//         navigate("/yearly-dashboard");
//         break;
//       case "Sales":
//         navigate("/sales-dashboard");
//         break;
//       case "Total Products":
//         navigate("/all-products");
//         break;
//       case "Orders":
//         navigate("/all-orders");
//         break;
//       case "Users":
//         navigate("/all-users");
//         break;
//       case "Total Categories":
//         navigate("/all-categories");
//         break;
//       default:
//         navigate("/dashboard"); // Default case
//         break;
//     }
//   };

//   const cards = [
//     { icon: <FontAwesomeIcon icon={faUsersViewfinder} />, title: "Visitors", count: dashboardData?.visitors?.total || 0, percentage: dashboardData?.visitors?.percentage, trend: dashboardData?.visitors?.trend, statics: dashboardData?.visitors?.statics, description: "Total Visitors Count", bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", count: dashboardData?.visitors?.monthly?.total || 0, percentage: dashboardData?.visitors?.monthly?.percentage, trend: dashboardData?.visitors?.monthly?.trend, statics: dashboardData?.visitors?.monthly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", count: dashboardData?.visitors?.yearly?.total || 0, percentage: dashboardData?.visitors?.yearly?.percentage, trend: dashboardData?.visitors?.yearly?.trend, statics: dashboardData?.visitors?.yearly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faArrowUpWideShort} />, title: "Sales", count: displayINRCurrency(dashboardData?.sales?.total || 0), percentage: dashboardData?.sales?.percentage, trend: dashboardData?.sales?.trend, statics: dashboardData?.sales?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200', iconColor: 'text-green-600' },
//     { icon: <FontAwesomeIcon icon={faCubes} />, title: "Total Products", count: dashboardData?.totalProducts || 0, description: "Total products Count", bgColor: 'bg-violet-200', iconColor: 'text-violet-600' },
//     { icon: <FontAwesomeIcon icon={faBoxOpen} />, title: "Packed Count", count: dashboardData?.statuses?.total?.packaged || 0, description: "Packed Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
//     { icon: <FontAwesomeIcon icon={faHandshakeSimple} />, title: "Orders", count: dashboardData?.orders?.total || 0, description: "Total Orders Count", bgColor: 'bg-orange-200', iconColor: 'text-orange-600' },
//   ];

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <div className="flex items-center justify-between mb-6 flex-wrap">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             className={`shadow-md rounded-lg p-2 flex flex-col justify-between ${card.bgColor}`}
//             onClick={() => handleCardClick(card.title)} // Trigger navigation on card click
//           >
//             <div className="flex items-center justify-between mb-1">
//               <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
//             </div>
//             <p className="text-xl font-bold text-gray-900">{card.count}</p>
//             <div className="flex justify-between items-center mt-1">
//               <p className="text-sm text-gray-500">{card.description}</p>
//             </div>
//             <div className="flex justify-between items-center">
//               <p className={`text-sm font-bold ${card.trend === "up" ? "text-green-600" : card.trend === "down" ? "text-red-500" : "text-yellow-500"}`}>
//                 {card.statics}
//               </p>
//               <p className={`text-gray-700 text-2xl ${card.iconColor}`}>{card.icon}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import SummaryApi from '../common';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsersViewfinder, faCalendarCheck, faArrowUpWideShort, faSackXmark, faHeartCrack, faCubes, faBoxOpen, faHandshakeSimple } from '@fortawesome/free-solid-svg-icons';

// const Dashboard = () => {
//   const navigate = useNavigate(); // Initialize navigate
//   const [category, setCategory] = useState("");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [categories, setCategories] = useState([]);
//   const [dashboardData, setDashboardData] = useState({
//     visitors: 0,
//     users: 0,
//     orders: 0,
//     totalProducts: 0,
//     statuses: {},
//   });

//   const [fromDate, setFromDate] = useState(""); // Define fromDate state
//   const [toDate, setToDate] = useState(""); // Define toDate state

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//   };

//   const displayINRCurrency = (num) => {
//     const formatter = new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     });
//     return formatter.format(num);
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getProductCategory.url);
//       const data = await response.json();
//       const filteredCategories = data.categories.filter(
//         (category) => category.productCount > 0
//       );
//       if (data.success) {
//         setCategories(filteredCategories);
//       } else {
//         console.error("Error fetching categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch data from the backend
//   const fetchData = async () => {
//     let url = SummaryApi.getDashboard.url;
//     if (dateRange || category) {
//       url += `?startDate=${dateRange.start}&endDate=${dateRange.end || dateRange.start}&category=${category}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.success) {
//         setDashboardData(data.data);
//       } else {
//         console.error("Error fetching data:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Fetch data on component mount and when the date range changes
//   useEffect(() => {
//     fetchData();
//   }, [dateRange, category]);

//   const handleDateChange = (e) => {
//     setDateRange({
//       ...dateRange,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCardClick = (cardTitle) => {
//     // Construct query parameters for filters
//     const queryParams = new URLSearchParams({
//       fromDate: fromDate || '',
//       toDate: toDate || fromDate || '',
//     });

//     // Navigate to a different route based on the card clicked
//     switch (cardTitle) {
//       case "Visitors":
//         navigate(`/admin-panel/all-cookies-page?${queryParams.toString()}`);
//         break;
//       case "Cart Count":
//         navigate(`/admin-panel/all-cart-items?${queryParams.toString()}`);
//         break;
//       case "Request Count":
//         navigate(`/admin-panel/all-returned-products?${queryParams.toString()}`);
//         break;
//       case "Sales":
//         queryParams.append('order_status', 'delivered'); // Add status filter for Sales
//         navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
//         break;
//       case "Total Products":
//         navigate(`/admin-panel/all-products?${queryParams.toString()}`);
//         break;
//       case "Orders":
//         navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
//         break;
//       case "Users":
//         navigate(`/admin-panel/all-users?${queryParams.toString()}`);
//         break;
//       case "Total Categories":
//         navigate(`/admin-panel/all-categories?${queryParams.toString()}`);
//         break;
//       default:
//         // navigate("/admin-panel/dashboard"); // Default case
//         break;
//     }
//   };

//   const cards = [
//     { icon: <FontAwesomeIcon icon={faUsersViewfinder} />, title: "Visitors", count: dashboardData?.visitors?.total || 0, percentage: dashboardData?.visitors?.percentage, trend: dashboardData?.visitors?.trend, statics: dashboardData?.visitors?.statics, description: "Total Visitors Count", bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", count: dashboardData?.visitors?.monthly?.total || 0, percentage: dashboardData?.visitors?.monthly?.percentage, trend: dashboardData?.visitors?.monthly?.trend, statics: dashboardData?.visitors?.monthly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", count: dashboardData?.visitors?.yearly?.total || 0, percentage: dashboardData?.visitors?.yearly?.percentage, trend: dashboardData?.visitors?.yearly?.trend, statics: dashboardData?.visitors?.yearly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faArrowUpWideShort} />, title: "Sales", count: displayINRCurrency(dashboardData?.sales?.total || 0), percentage: dashboardData?.sales?.percentage, trend: dashboardData?.sales?.trend, statics: dashboardData?.sales?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200', iconColor: 'text-green-600' },
//     { icon: <FontAwesomeIcon icon={faCubes} />, title: "Total Products", count: dashboardData?.totalProducts || 0, description: "Total products Count", bgColor: 'bg-violet-200', iconColor: 'text-violet-600' },
//     { icon: <FontAwesomeIcon icon={faBoxOpen} />, title: "Packed Count", count: dashboardData?.statuses?.total?.packaged || 0, description: "Packed Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
//     { icon: <FontAwesomeIcon icon={faHandshakeSimple} />, title: "Orders", count: dashboardData?.orders?.total || 0, description: "Total Orders Count", bgColor: 'bg-orange-200', iconColor: 'text-orange-600' },
//   ];

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <div className="flex items-center justify-between mb-6 flex-wrap">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             className={`shadow-md rounded-lg p-2 flex flex-col justify-between ${card.bgColor}`}
//             onClick={() => handleCardClick(card.title)} // Trigger navigation on card click
//           >
//             <div className="flex items-center justify-between mb-1">
//               <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
//             </div>
//             <p className="text-xl font-bold text-gray-900">{card.count}</p>
//             <div className="flex justify-between items-center mt-1">
//               <p className="text-sm text-gray-500">{card.description}</p>
//             </div>
//             <div className="flex justify-between items-center">
//               <p className={`text-sm font-bold ${card.trend === "up" ? "text-green-600" : card.trend === "down" ? "text-red-500" : "text-yellow-500"}`}>
//                 {card.statics}
//               </p>
//               <p className={`text-gray-700 text-2xl ${card.iconColor}`}>{card.icon}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// const parseQueryParams = () => {
//   const params = new URLSearchParams(location.search);
//   setFromDate(params.get('fromDate') || '');
//   setToDate(params.get('toDate') || '');
//   setFilterStatus(params.get('order_status') || '');
// };

// useEffect(() => {
//   parseQueryParams();
// }, [location.search]);

// const fetchOrderDetails = useCallback(async () => {
//   try {
//     setLoading(true);

//     const response = await fetch(
//       `${SummaryApi.allOrder.url}?orderId=${searchOrderId}&fromDate=${fromDate}&toDate=${toDate || fromDate}&orderStatus=${filterStatus}`,
//       {
//         method: "GET",
//         credentials: "include",
//       }
//     );

//     if (!response.ok) throw new Error("Failed to fetch order details");

//     const responseData = await response.json();
//     if (responseData.success) {
//       const orders = responseData.order
//         ? [responseData.order]
//         : responseData.orders || responseData.data;
//       setData(orders);
//     } else {
//       setData([]);
//       console.error(responseData.message);
//     }
//   } catch (err) {
//     console.error(err.message);
//   } finally {
//     setLoading(false);
//   }
// }, [fromDate, toDate, searchOrderId, filterStatus]);

// useEffect(() => {
//   fetchOrderDetails();
// }, [fetchOrderDetails]);

// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import SummaryApi from '../common';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsersViewfinder, faCalendarCheck, faArrowUpWideShort, faSackXmark, faHeartCrack, faCubes, faBoxOpen, faHandshakeSimple } from '@fortawesome/free-solid-svg-icons';

// const Dashboard = () => {
//   const navigate = useNavigate(); // Initialize navigate
//   const [category, setCategory] = useState("");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
//   const [categories, setCategories] = useState([]);
//   const [dashboardData, setDashboardData] = useState({
//     visitors: 0,
//     users: 0,
//     orders: 0,
//     totalProducts: 0,
//     statuses: {},
//   });

//   const [fromDate, setFromDate] = useState(""); // Define fromDate state
//   const [toDate, setToDate] = useState(""); // Define toDate state

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//   };

//   const displayINRCurrency = (num) => {
//     const formatter = new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     });
//     return formatter.format(num);
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getProductCategory.url);
//       const data = await response.json();
//       const filteredCategories = data.categories.filter(
//         (category) => category.productCount > 0
//       );
//       if (data.success) {
//         setCategories(filteredCategories);
//       } else {
//         console.error("Error fetching categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch data from the backend
//   const fetchData = async () => {
//     let url = SummaryApi.getDashboard.url;
//     if (dateRange || category) {
//       url += `?startDate=${dateRange.start}&endDate=${dateRange.end || dateRange.start}&category=${category}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       if (data.success) {
//         setDashboardData(data.data);
//       } else {
//         console.error("Error fetching data:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Fetch data on component mount and when the date range changes
//   useEffect(() => {
//     fetchData();
//   }, [dateRange, category]);

//   const handleDateChange = (e) => {
//     setDateRange({
//       ...dateRange,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCardClick = (cardTitle) => {
//     // Construct query parameters for filters
//     const queryParams = new URLSearchParams({
//       fromDate: fromDate || '',
//       toDate: toDate || fromDate || '',
//     });

//     // Navigate to a different route based on the card clicked
//     switch (cardTitle) {
//       case "Visitors":
//         navigate(`/admin-panel/all-cookies-page?${queryParams.toString()}`);
//         break;
//       case "Cart Count":
//         navigate(`/admin-panel/all-cart-items?${queryParams.toString()}`);
//         break;
//       case "Request Count":
//         navigate(`/admin-panel/all-returned-products?${queryParams.toString()}`);
//         break;
//       case "Sales":
//         queryParams.append('order_status', 'delivered'); // Add status filter for Sales
//         navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
//         break;
//       case "Total Products":
//         navigate(`/admin-panel/all-products?${queryParams.toString()}`);
//         break;
//       case "Orders":
//         navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
//         break;
//       case "Users":
//         navigate(`/admin-panel/all-users?${queryParams.toString()}`);
//         break;
//       case "Total Categories":
//         navigate(`/admin-panel/all-categories?${queryParams.toString()}`);
//         break;
//       default:
//         // navigate("/admin-panel/dashboard"); // Default case
//         break;
//     }
//   };

//   const cards = [
//     { icon: <FontAwesomeIcon icon={faUsersViewfinder} />, title: "Visitors", count: dashboardData?.visitors?.total || 0, percentage: dashboardData?.visitors?.percentage, trend: dashboardData?.visitors?.trend, statics: dashboardData?.visitors?.statics, description: "Total Visitors Count", bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", count: dashboardData?.visitors?.monthly?.total || 0, percentage: dashboardData?.visitors?.monthly?.percentage, trend: dashboardData?.visitors?.monthly?.trend, statics: dashboardData?.visitors?.monthly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", count: dashboardData?.visitors?.yearly?.total || 0, percentage: dashboardData?.visitors?.yearly?.percentage, trend: dashboardData?.visitors?.yearly?.trend, statics: dashboardData?.visitors?.yearly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//     { icon: <FontAwesomeIcon icon={faArrowUpWideShort} />, title: "Sales", count: displayINRCurrency(dashboardData?.sales?.total || 0), percentage: dashboardData?.sales?.percentage, trend: dashboardData?.sales?.trend, statics: dashboardData?.sales?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200', iconColor: 'text-green-600' },
//     { icon: <FontAwesomeIcon icon={faCubes} />, title: "Total Products", count: dashboardData?.totalProducts || 0, description: "Total products Count", bgColor: 'bg-violet-200', iconColor: 'text-violet-600' },
//     { icon: <FontAwesomeIcon icon={faBoxOpen} />, title: "Packed Count", count: dashboardData?.statuses?.total?.packaged || 0, description: "Packed Status Count", bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
//     { icon: <FontAwesomeIcon icon={faHandshakeSimple} />, title: "Orders", count: dashboardData?.orders?.total || 0, description: "Total Orders Count", bgColor: 'bg-orange-200', iconColor: 'text-orange-600' },
//   ];

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <div className="flex items-center justify-between mb-6 flex-wrap">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             className={`shadow-md rounded-lg p-2 flex flex-col justify-between ${card.bgColor}`}
//             onClick={() => handleCardClick(card.title)} // Trigger navigation on card click
//           >
//             <div className="flex items-center justify-between mb-1">
//               <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
//             </div>
//             <p className="text-xl font-bold text-gray-900">{card.count}</p>
//             <div className="flex justify-between items-center mt-1">
//               <p className="text-sm text-gray-500">{card.description}</p>
//             </div>
//             <div className="flex justify-between items-center">
//               <p className={`text-sm font-bold ${card.trend === "up" ? "text-green-600" : card.trend === "down" ? "text-red-500" : "text-yellow-500"}`}>
//                 {card.statics}
//               </p>
//               <p className={`text-gray-700 text-2xl ${card.iconColor}`}>{card.icon}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import SummaryApi from '../common';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLayerGroup, faArrowDownWideShort, faCubes, faCalendarCheck, faHandshakeSimple, faSackXmark, faHeartCrack, faCubesStacked, faPeopleCarryBox, faDiagramSuccessor, faCommentDots, faUsers, faBan, faCartArrowDown, faClipboardCheck, faHourglassHalf, faUsersViewfinder, faArrowUpWideShort, faTruckFast, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

// const Dashboard = () => {
//     const navigate = useNavigate(); // Initialize navigate
//   const [category, setCategory] = useState("");
//   const [dateRange, setDateRange] = useState({start:"", end:""});
//   const [categories, setCategories] = useState([]);
//   const [dashboardData, setDashboardData] = useState({
//     visitors: 0,
//     users: 0,
//     orders: 0,
//     totalProducts: 0,
//     statuses: {},
//   });

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//   };

//   const displayINRCurrency = (num) => {
//     const formatter = new Intl.NumberFormat('en-IN',{
//         style : "currency",
//         currency : 'INR',
//         minimumFractionDigits : 0
//     })

//     return formatter.format(num)

// }

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getProductCategory.url);
//       const data = await response.json();
//       const filteredCategories = data.categories.filter(category => category.productCount > 0);
//       if (data.success) {
//         setCategories(filteredCategories);
//       } else {
//         console.error("Error fetching categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch data from the backend
//   const fetchData = useCallback(async () => {
//     let url = SummaryApi.getDashboard.url;
//     if (dateRange || category) {
//       url += `?startDate=${dateRange.start}&endDate=${dateRange.end || dateRange.start}&category=${category}`;
//     }

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
      
//       if (data.success) {
//         setDashboardData(data.data);
//       } else {
//         console.error("Error fetching data:", data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }, [dateRange, category]);

//   // Fetch data on component mount and when the date range changes
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleDateChange = (e)=>{
//     setDateRange({
//       ...dateRange,
//       [e.target.name]:e.target.value
//     })
//   }

//   const handleCardClick = (cardTitle) => {
//     // Construct query parameters for filters
//     const queryParams = new URLSearchParams({
//       fromDate: dateRange.start || '',
//       toDate: dateRange.end || dateRange.start || '',
//     });
  
//     // Navigate to a different route based on the card clicked
//     switch (cardTitle) {
//       case "Visitors":
//         navigate(`/admin-panel/all-cookies-page?${queryParams.toString()}`);
//         break;
//       case "Cart Count":
//         navigate(`/admin-panel/all-cart-items?${queryParams.toString()}`);
//         break;
//       case "Request Count":
//         navigate(`/admin-panel/all-returned-products?${queryParams.toString()}`);
//         break;
//       case "Sales":
//         queryParams.append('order_status', 'delivered'); // Add status filter for Sales
//         navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
//         break;
//       case "Total Products":
//         navigate(`/admin-panel/all-products?${queryParams.toString()}`);
//         break;
//       case "Orders":
//         queryParams.append('order_status', 'ordered');
//         navigate(`/admin-panel/all-orders?${queryParams.toString()}`);
//         break;
//       case "Users":
//         navigate(`/admin-panel/all-users?${queryParams.toString()}`);
//         break;
//       case "Total Categories":
//         navigate(`/admin-panel/all-categories?${queryParams.toString()}`);
//         break;
//       default:
//         // navigate("/admin-panel/dashboard"); // Default case
//         break;
//     }
//   };

//       const cards = [
//         { icon: <FontAwesomeIcon icon={faUsersViewfinder} />, title: "Visitors", count: dashboardData?.visitors?.total || 0, percentage: dashboardData?.visitors?.percentage, trend: dashboardData?.visitors?.trend, statics: dashboardData?.visitors?.statics, description: "Total Visitors Count", bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//         { icon:<FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", count: dashboardData?.visitors?.monthly?.total || 0, percentage: dashboardData?.visitors?.monthly?.percentage, trend:dashboardData?.visitors?.monthly?.trend, statics: dashboardData?.visitors?.monthly?.statics, bgColor: 'bg-blue-200', iconColor: 'text-blue-700' },
//         { icon:<FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", count: dashboardData?.visitors?.yearly?.total || 0, percentage: dashboardData?.visitors?.yearly?.percentage, trend: dashboardData?.visitors?.yearly?.trend, statics: dashboardData?.visitors?.yearly?.statics, bgColor: 'bg-blue-200',iconColor: 'text-blue-700' },
//         { icon: <FontAwesomeIcon icon={faArrowUpWideShort}  />, title: "Sales", count: displayINRCurrency(dashboardData?.sales?.total || 0), percentage: dashboardData?.sales?.percentage, trend: dashboardData?.sales?.trend, statics:dashboardData?.sales?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200',iconColor: 'text-green-600' },
//         { icon:<FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", count: displayINRCurrency(dashboardData?.sales?.monthly?.total || 0), percentage: dashboardData?.sales?.monthly?.percentage, trend: dashboardData?.sales?.monthly?.trend, statics:dashboardData?.sales?.monthly?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200',iconColor: 'text-green-600' },
//         { icon:<FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", count: displayINRCurrency(dashboardData?.sales?.yearly?.total || 0), percentage: dashboardData?.sales?.yearly?.percentage, trend: dashboardData?.sales?.yearly?.trend, statics:dashboardData?.sales?.yearly?.statics, description: "Total Sales Amount", bgColor: 'bg-green-200',iconColor: 'text-green-600' },
//         { icon:<FontAwesomeIcon icon={faArrowDownWideShort}  />, title: "Return", count: displayINRCurrency(dashboardData?.salesReturn?.total || 0), description: "Total Return Amount",bgColor: 'bg-red-200',iconColor: 'text-red-600' },
//         { icon:<FontAwesomeIcon icon={faHeartCrack} />, title: "Damaged", count: displayINRCurrency(dashboardData?.salesReturn?.return || 0), description: "Damaged sales Amount",bgColor: 'bg-red-200',iconColor: 'text-red-600' },
//         { icon:<FontAwesomeIcon icon={faSackXmark}  />, title: "Cancel ", count: displayINRCurrency(dashboardData?.salesReturn?.cancel || 0),  description: "Cancel sales Amount",bgColor: 'bg-red-200',iconColor: 'text-red-600' },
//         { icon:<FontAwesomeIcon icon={faCubes} />,  title: "Total Products", count: dashboardData?.totalProducts || 0, description: "Total products Count",bgColor:'bg-violet-200',iconColor: 'text-violet-600' },
//         { icon:<FontAwesomeIcon icon={faCubesStacked} />, title: "Product Stock", count: dashboardData?.productStock || 0, description: "Product Stock Count",bgColor:'bg-violet-200',iconColor: 'text-violet-600' },
//         { icon: <FontAwesomeIcon icon={faLayerGroup} />,title: "Total Categories", count: dashboardData?.categoryCount || 0, description: "Total Categories Count", bgColor:'bg-violet-200',iconColor: 'text-violet-600'},
//         { icon: <FontAwesomeIcon icon={faUsers} />, title: "Users", count: dashboardData?.users?.total || 0,  description: "Total User Count" ,bgColor:'bg-pink-200',iconColor: 'text-pink-600' },
//         { icon:<FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", count: dashboardData?.users?.monthly || 0,  description: "Up from yesterday",bgColor:'bg-pink-200',iconColor: 'text-pink-600' },
//         { icon:<FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", count: dashboardData?.users?.yearly || 0,  description: "Up from yesterday" ,bgColor:'bg-pink-200',iconColor: 'text-pink-600' },
//         { icon:<FontAwesomeIcon icon={faHandshakeSimple} />,  title: "Orders", count: dashboardData?.orders?.total || 0, description: "Total Orders Count",bgColor: 'bg-orange-200',iconColor: 'text-orange-600' },
//         { icon:<FontAwesomeIcon icon={faCalendarCheck} />, title: "MTD", count: dashboardData?.orders?.monthly || 0,  description: "Up from yesterday",bgColor: 'bg-orange-200',iconColor: 'text-orange-600' },
//         { icon:<FontAwesomeIcon icon={faCalendarCheck} />, title: "YTD", count: dashboardData?.orders?.yearly || 0,  description: "Up from yesterday",bgColor: 'bg-orange-200',iconColor: 'text-orange-600' },
//         { icon:<FontAwesomeIcon icon={faHourglassHalf}  />, title: "Pending Count", count: dashboardData?.statuses?.total?.pending || 0, description: "Payment Pending Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//         {  icon:<FontAwesomeIcon icon={faCartArrowDown}  />, title: "Cart Count", count: dashboardData?.cartCount || 0, description: "Add ToCart Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//         { icon:<FontAwesomeIcon icon={faHandshakeSimple} />, title: "Order Count", count: dashboardData?.statuses?.total?.ordered || 0, description: "Order Status Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//         { icon:<FontAwesomeIcon icon={faBoxOpen} />, title: "Packed Count", count: dashboardData?.statuses?.total?.packaged || 0, description: "Packed Status Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//         { icon:<FontAwesomeIcon icon={faTruckFast} />, title: "Shipped Count", count: dashboardData?.statuses?.total?.shipped || 0,  description: "Shipped Status Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//         { icon:<FontAwesomeIcon icon={faPeopleCarryBox}  />, title: "Delivered Count", count: dashboardData?.statuses?.total?.delivered || 0, description: "Delivered Status Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//         { icon:<FontAwesomeIcon icon={faBan} />, title: "Cancel Count", count: dashboardData?.statuses?.total?.cancelled || 0,  description: "Cancel Status Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//         { icon:<FontAwesomeIcon icon={faCommentDots}  />, title: "Request Count", count: dashboardData?.statuses?.total?.returnRequested || 0,  description: "Request Status Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//         { icon:<FontAwesomeIcon icon={faClipboardCheck}  />, title: "Accept Count", count: dashboardData?.statuses?.total?.returnAccepted || 0,  description: "Accept Status Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//         {icon:<FontAwesomeIcon icon={faDiagramSuccessor}  />, title: "Return Count", count: dashboardData?.statuses?.total?.returned || 0 ,  description: "Return Status Count", bgColor: 'bg-yellow-100',iconColor: 'text-yellow-600' },
//       ];

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       {/* Header Section */}
//       <div className="flex items-center justify-between mb-6 flex-wrap">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//         <div className="flex items-center gap-2 flex-wrap">
//           {/* Category Filter */}
//           <select
//             required
//             value={category}
//             name="category"
//             onChange={handleCategoryChange}
//             className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Category</option>
//             {categories.map((el, index) => {
//               return (
//                 <option value={el.value} key={el.value + index}>
//                   {el.label}
//                 </option>
//               );
//             })}
//           </select>

//           {/* Date Range Filter */}
//           <div className="flex items-center gap-2 flex-wrap">
//             <input
//               type="date"
//               name="start"
//               value={dateRange.start}
//               onChange={handleDateChange}
//               className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="text-gray-500 hidden md:block">to</span>
//             <input
//               type="date"
//               name="end"
//               value={dateRange.end || dateRange.start}
//               onChange={handleDateChange}
//               className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
//         {cards.map((card, index) => (
//           <div
//             key={index}
//             className={`shadow-md rounded-lg p-2 flex flex-col justify-between ${card.bgColor}`}
//             onClick={() => handleCardClick(card.title)} // Trigger navigation on card click
//           >
//             <div className="flex items-center justify-between mb-1">
//               <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
//               <span
//                 className={`text-sm font-bold ${
//                    card.trend === "up" ? "text-green-600" :card.trend === "down" ? "text-red-500":"text-yellow-500"
//                 }`}
//               >
//                 {card.trend === "up" || card.trend === "neutral"? "↑" :card.trend === "down" ?  "↓":""} {card.percentage}
//               </span>
//             </div>
//             <p className="text-xl font-bold text-gray-900">{card.count}</p>
//             <div className="flex justify-between items-center mt-1">
//             <p className="text-sm text-gray-500">{card.description}</p>
//             </div>
//             <div className="flex justify-between items-center">
//             <p className={`text-sm font-bold ${
//                   card.trend === "up" ? "text-green-600" :card.trend === "down" ? "text-red-500":"text-yellow-500"
//                 }`}>{card.statics}</p>
//             <p className={`text-gray-700 text-2xl ${card.iconColor}`}>{card.icon}</p>            
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
// const handleCardClick = (card) => {
//   let startDate, endDate;

//   // Helper function to get the last day of the month
//   const getLastDayOfMonth = (year, month) => {
//       return new Date(year, month + 1, 0);
//   };

//   // Helper function to get the first day of the current month
//   const getFirstDayOfMonth = () => {
//       const date = new Date();
//       date.setDate(1); // Set to the first day of the month
//       return date;
//   };

//   // Helper function to get the start of the fiscal year (April 1)
//   const getFiscalYearStart = (currentDate) => {
//       let fiscalYearStart = new Date(currentDate);

//       // If the current month is January, February, or March, the fiscal year started the previous year
//       if (currentDate.getMonth() < 3) {
//           fiscalYearStart.setFullYear(currentDate.getFullYear() - 1);
//       }

//       fiscalYearStart.setMonth(3); // Set to April
//       fiscalYearStart.setDate(1);  // Set to the first day of the month
//       return fiscalYearStart;
//   };

//   // Check if the card is an "MTD" or "YTD" card
//   if (card.title.includes("MTD")) {
//       // For MTD (Month-to-Date): Calculate the start and end of the current month
//       const currentDate = new Date();
//       startDate = getFirstDayOfMonth().toISOString().split('T')[0]; // Start of the current month
//       endDate = getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()).toISOString().split('T')[0]; // End of the current month
//   } else if (card.title.includes("YTD")) {
//       // For YTD (Year-to-Date): Calculate the start date from April 1 of the current fiscal year and end date to today's date
//       const currentDate = new Date();
//       const fiscalYearStart = getFiscalYearStart(currentDate);
//       startDate = fiscalYearStart.toISOString().split('T')[0]; // Start of the fiscal year
//       endDate = currentDate.toISOString().split('T')[0]; // Today's date
//   } else {
//       // If it's neither MTD nor YTD, use the existing date range from the state
//       startDate = dateRange.start;
//       endDate = dateRange.end || dateRange.start;
//   }

//   // Construct query parameters for filters
//   const queryParams = new URLSearchParams({
//       fromDate: startDate,
//       toDate: endDate,
//       category: category,
//   });

//   // Navigate to the card's path with query parameters
//   const [basePath, existingParams] = card.path.split('?');
//   const fullPath = `${basePath}?${queryParams.toString()}${existingParams ? `&${existingParams}` : ''}`;

//   navigate(fullPath);
// };

// import React, { useEffect, useState } from 'react';
// import SummaryApi from '../common';

// const CookiePage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [isFocused, setIsFocused] = useState(false); // Track focus state for inputs

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // If only fromDate is provided, set toDate to the same value
//       const toDateValue = toDate || fromDate;

//       const url = new URL(SummaryApi.allCookies.url); // Replace with your backend URL
//       if (fromDate) url.searchParams.append('fromDate', fromDate);
//       if (toDateValue) url.searchParams.append('toDate', toDateValue);

//       const response = await fetch(url.toString());
//       if (!response.ok) throw new Error('Failed to fetch data');
//       const result = await response.json();
//       setData(result.data);
//       setLoading(false);
//     } catch (err) {
//       setError('Error fetching data');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleFromDateChange = (e) => {
//     const newFromDate = e.target.value;
//     setFromDate(newFromDate);
//     // Set toDate automatically to the same value if fromDate is set
//     setToDate(newFromDate);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-semibold mb-4">Cookie Acceptance Data</h1>
//       <div className="mb-4 flex space-x-4">
//         <div>
//           <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">From Date</label>
//           <input
//             type={isFocused ? "date" : "text"}
//             value={fromDate}
//             onChange={handleFromDateChange}
//             className="border p-2 rounded-md md:mr-2"
//             placeholder={isFocused ? "" : "From Date*"}
//             onFocus={() => setIsFocused(true)}
//             onBlur={() => setIsFocused(false)}
//           />
//         </div>
//         <div>
//           <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">To Date</label>
//           <input
//             type={isFocused ? "date" : "text"}
//             value={toDate || fromDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="border p-2 rounded-md md:mr-2"
//             placeholder={isFocused ? "" : "To Date*"}
//             onFocus={() => setIsFocused(true)}
//             onBlur={() => setIsFocused(false)}
//           />
//         </div>
//       </div>
//       {data.length === 0 ? (
//         <p>No cookie acceptance data available.</p>
//       ) : (
//         <table className="w-full border border-gray-300 rounded-lg">
//           <thead className="bg-red-600 text-white">
//             <tr>
//               <th className="px-4 py-2 border-b text-left">Sr.</th>
//               <th className="px-4 py-2 border-b text-left">IP Address</th>
//               <th className="px-4 py-2 border-b text-left">Location</th>
//               <th className="px-4 py-2 border-b text-left">Acceptance Count</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, index) => (
//               <tr
//                 key={item._id}
//                 className="hover:bg-gray-50 even:bg-gray-100 odd:bg-white"
//               >
//                 <td className="px-4 py-2 border-b">{index + 1}</td>
//                 <td className="px-4 py-2 border-b">
//                   {item.ipLocations.map((ip) => ip.ipAddress).join(', ')}
//                 </td>
//                 <td className="px-4 py-2 border-b">
//                   {item.ipLocations.map((ip, i) => (
//                     <div key={i}>
//                       <strong>{ip.location.city}</strong>, {ip.location.region},{' '}
//                       {ip.location.country}
//                     </div>
//                   ))}
//                 </td>
//                 <td className="px-4 py-2 border-b">{item.count}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default CookiePage;
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from 'react-router-dom'; // Import useLocation
import SummaryApi from "../common";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";
import { saveAs } from 'file-saver'; // For exporting CSV files
import * as XLSX from 'xlsx'; // For exporting Excel files

const AllOrder = () => {
  const location = useLocation(); // Initialize useLocation to read query parameters
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchOrderId, setSearchOrderId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isFocused, setIsFocused] = useState('');
  const [filterStatus, setFilterStatus] = useState(""); // Default to empty for showing all orders
  const [loadingOrder, setLoadingOrder] = useState(null); // Track which order is being updated

  // Function to parse query parameters
  const parseQueryParams = () => {
    const params = new URLSearchParams(location.search);
    setFromDate(params.get('fromDate') || '');
    setToDate(params.get('toDate') || '');
    setFilterStatus(params.get('order_status') || '');
  };

  useEffect(() => {
    parseQueryParams();
  }, [location.search]);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);

      let url = `${SummaryApi.allOrder.url}?orderId=${searchOrderId}&fromDate=${fromDate}&toDate=${toDate || fromDate}`;

      if (filterStatus) {
        url += `&orderStatus=${filterStatus}`;
      } else {
        url += `&exclude_status=Pending`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch order details");

      const responseData = await response.json();
      if (responseData.success) {
        const orders = responseData.order
          ? [responseData.order]
          : responseData.orders || responseData.data;
        setData(orders);
      } else {
        setData([]);
        console.error(responseData.message);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, searchOrderId, filterStatus]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchOrderId(value);
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Function to handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Check if the new status is different to avoid unnecessary API calls
      const order = data.find((item) => item.orderId === orderId);
      if (order && order.order_status === newStatus) {
        return; // No update needed
      }

      setLoadingOrder(orderId); // Set loading state for the specific order

      // Make the API request to update the order status
      const response = await fetch(SummaryApi.updateOrderStatus.url, {
        method: SummaryApi.updateOrderStatus.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ orderId, order_status: newStatus }), // Update the body to match your API structure
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update the local state immediately with the new status
      setData((prevData) =>
        prevData.map((item) =>
          item.orderId === orderId ? { ...item, order_status: newStatus } : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingOrder(null); // Reset loading state after the operation
    }
  };

  // Function to handle order deletion
  const handleDeleteOrder = async (orderId) => {
    try {
      // Ensure the URL includes the orderId as a query parameter
      const url = `${SummaryApi.deleteOrder.url}?orderId=${orderId}`;
  
      // Make the API request to delete the order
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials if required by the backend
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete the order");
      }
  
      // Remove the deleted order from the local state
      setData((prevData) => prevData.filter((item) => item.orderId !== orderId));
    } catch (err) {
      setError(err.message); // Handle error properly
    }
  };

  // Function to handle exporting the order data
  const handleExport = () => {
    const exportData = data.map((item) => ({
      orderId: item.orderId,
      orderDate: moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A"),
      orderStatus: item.order_status,
      totalAmount: displayINRCurrency(item.totalAmount),
      paymentStatus: item.paymentDetails.payment_status,
      billingName: item.billing_name,
      billingEmail: item.billing_email,
      billingTel: item.billing_tel,
      shippingAddress: item.shipping_address,
    }));
  
    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(exportData);
  
    // Add custom headers
    const wsHeaders = [
      "Order ID",
      "Order Date",
      "Order Status",
      "Total Amount",
      "Payment Status",
      "Billing Name",
      "Billing Email",
      "Billing Phone",
      "Shipping Address",
    ];
    
    // Define column width and other styling options (for better readability in Excel)
    const wscols = [
      { wch: 10 }, // Column width for Order ID
      { wch: 20 }, // Column width for Order Date
      { wch: 15 }, // Column width for Order Status
      { wch: 15 }, // Column width for Total Amount
      { wch: 15 }, // Column width for Payment Status
      { wch: 20 }, // Column width for Billing Name
      { wch: 30 }, // Column width for Billing Email
      { wch: 15 }, // Column width for Billing Phone
      { wch: 70 }, // Column width for Shipping Address
    ];
  
    ws['!cols'] = wscols; // Apply column widths to worksheet
    XLSX.utils.sheet_add_aoa(ws, [wsHeaders], { origin: 'A1' }); // Add headers at the top
  
    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  
    // Generate Excel file and trigger download
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, "orders.xlsx");
  };
  
  // Convert string to array buffer (needed for binary data export)
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  return (
    <div className="p-1 md:p-4 text-xs md:text-[15px] 2xl:text-lg">
      <div className="p-1 md:p-4 flex flex-col md:flex-row">
        <input
          type={isFocused ? "date" : "text"}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded-md md:mr-2"
          placeholder={isFocused ? "" : "From Date*"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <input
          type={isFocused ? "date" : "text"}
          value={toDate || fromDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded-md md:mr-2"
          placeholder={isFocused ? "" : "To Date*"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchOrderId}
          onChange={handleSearchChange}
          className="border p-2 rounded-md md:mr-2"
        />

        <select
          name="status"
          className="p-2 border rounded-md md:mr-2"
          value={filterStatus}
          onChange={handleFilterStatusChange}
        >
          <option value="">All Status</option>
          <option key="ordered" value="ordered">
            Ordered
          </option>
          <option key="packaged" value="packaged">
            Packaged
          </option>
          <option key="shipped" value="shipped">
            Shipped
          </option>
          <option key="delivered" value="delivered">
            Delivered
          </option>
          <option key="Pending" value="Pending">
            Pending
          </option>
          <option key="cancelled" value="cancelled">
            Cancelled
          </option>
          <option key="returnRequested" value="returnRequested">
            Return Request
          </option>
          <option key="returnAccepted" value="returnAccepted">
            Return Accepted
          </option>
          <option key="returned" value="returned">
            Returned
          </option>
        </select>
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-2 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : data?.length === 0 ? (
        <p className="text-center mt-8">No Order available</p>
      ) : (
        <div className="p-1 md:p-4 w-full">
          <p className="font-medium mb-2">Order Results: {data?.length}</p>
          <div className="flex justify-end">
            <button
              onClick={handleExport}
              className="bg-red-600 text-white p-2 rounded-md"
            >
              Export Orders
            </button>
          </div>
          {data?.map((item, index) => (
            <div key={item.userId + index} className="mb-8">
              <p className="font-medium text-lg">
                {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A")}
              </p>
              <div className="border rounded">
                <div className="flex flex-col lg:flex-row justify-between gap-4 p-1 md:p-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {item?.productDetails.map((product, index) => (
                      <div
                        key={product.productId + index}
                        className="flex gap-3 bg-white p-2 rounded-md"
                      >
                        <img
                          alt="product"
                          src={product.productImage}
                          className="w-28 h-28 bg-slate-200 object-scale-down p-2"
                        />
                        <div>
                          <div className="font-medium">{product.productName}</div>
                          <div className="font-medium ">{product.category}</div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-1">
                            <div className=" text-red-500">
                              {displayINRCurrency(product.sellingPrice)}{" "}
                              <span className="line-through text-gray-500">
                                {displayINRCurrency(product.price)}
                              </span>
                            </div>
                            <p>Quantity: {product.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-1 md:p-2 xl:p-3 ">
                  <div className="border p-4 rounded-md">
                    <div className="text-lg font-medium">Payment Details</div>
                    <p className="ml-1">
                      Payment method: {item.paymentDetails.payment_method_type}
                    </p>
                    <p className="ml-1">
                      Payment Status: {item.paymentDetails.payment_status}
                    </p>
                  </div>

                  <div className="border p-4 rounded-md">
                    <div className="text-lg font-medium">Customer Details</div>
                    <p className="ml-1">Name: {item.billing_name}</p>
                    <p className="ml-1">Email: {item.billing_email}</p>
                    <p className="ml-1">Mobile: {item.billing_tel}</p>
                  </div>

                  <div className="border p-4 rounded-md">
                    <div className="text-lg font-medium">Billing Address</div>
                    {typeof item.billing_address === "object" ? (
                      <p className="ml-1">
                        {item.billing_address.street},{" "}
                        {item.billing_address.city},{" "}
                        {item.billing_address.state},{" "}
                        {item.billing_address.postalCode},{" "}
                        {item.billing_address.country}
                      </p>
                    ) : (
                      <p className="ml-1">{item.billing_address}</p>
                    )}
                  </div>

                  <div className="border p-4 rounded-md">
                    <div className="text-lg font-medium">Shipping Address</div>
                    {typeof item.shipping_address === "object" ? (
                      <p className="ml-1">
                        {item.shipping_address.street},{" "}
                        {item.shipping_address.city},{" "}
                        {item.shipping_address.state},{" "}
                        {item.shipping_address.postalCode},{" "}
                        {item.shipping_address.country}
                      </p>
                    ) : (
                      <p className="ml-1">{item.shipping_address}</p>
                    )}
                  </div>

                  <div className="border p-4 rounded-md">
                    <div className="text-lg font-medium">Order Status</div>
                    <p className="ml-1">Order Id: {item.orderId}</p>
                    <p className="ml-1">Order Status: {item.order_status}</p>

                    {/* Conditional rendering for the dropdown */}
                    {!["Pending", "cancelled", "returned"].includes(item.order_status) && (
                      <div>
                        <select
                          value={loadingOrder === item.orderId ? "loading" : item.order_status}
                          onChange={(e) => handleStatusChange(item.orderId, e.target.value)}
                          className="mt-2 border p-2 rounded-md"
                          disabled={loadingOrder === item.orderId} // Disable only during update
                        >
                          {/* Show "Updating..." option while loading */}
                          {loadingOrder === item.orderId && (
                            <option value="loading" disabled>
                              Updating...
                            </option>
                          )}

                          {/* Regular options for status */}
                          <option value="ordered">Ordered</option>
                          <option value="packaged">Packaged</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="returnAccepted">Return Accepted</option>
                          <option value="returned">Returned</option>
                        </select>
                      </div>
                    )}

                    {/* Button to delete order for Pending status */}
                    {item.order_status === "Pending" && (
                      <button
                        onClick={() => handleDeleteOrder(item.orderId)}
                        className="bg-red-500 text-white p-2 rounded-md mt-2"
                      >
                        Delete Order
                      </button>
                    )}
                  </div>
                </div>

                <div className="font-semibold ml-auto w-fit lg:text-lg pr-2">
                  Total Amount: {displayINRCurrency(item.totalAmount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrder;
