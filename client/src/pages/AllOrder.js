// import React, { useEffect, useState, useCallback } from "react";
// import { useLocation } from 'react-router-dom'; // Import useLocation
// import SummaryApi from "../common";
// import moment from "moment";
// import displayINRCurrency from "../helpers/displayCurrency";
// import { saveAs } from 'file-saver'; // For exporting CSV files

// const AllOrder = () => {
//   const location = useLocation(); // Initialize useLocation to read query parameters
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true); // Loading state
//   const [searchOrderId, setSearchOrderId] = useState("");
//   // const [singleDate, setSingleDate] = useState(""); // Single date for filtering
//   const [fromDate, setFromDate] = useState("");
// const [toDate, setToDate] = useState("");
// const [isFocused, setIsFocused] = useState('');
//   const [filterStatus, setFilterStatus] = useState("");
//   const [loadingOrder, setLoadingOrder] = useState(null); // Track which order is being updated

//   // Combined function to fetch order details
//   // const fetchOrderDetails = async () => {
//   //   try {
//   //     setLoading(true);

//   //     const response = await fetch(
//   //       `${SummaryApi.allOrder.url}?orderId=${searchOrderId}&date=${singleDate}&orderStatus=${filterStatus}`,
//   //       {
//   //         method: "GET",
//   //         credentials: "include",
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Failed to fetch order details");
//   //     }

//   //     const responseData = await response.json();
//   //     if (responseData.success) {
//   //       const orders = responseData.order
//   //         ? [responseData.order]
//   //         : responseData.orders || responseData.data;
//   //       setData(orders);
//   //     } else {
//   //       setData([]);
//   //       console.error(responseData.message);
//   //     }
//   //   } catch (err) {
//   //     console.error(err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchOrderDetails();
//   // }, [singleDate, searchOrderId, filterStatus]);

//   const parseQueryParams = () => {
//     const params = new URLSearchParams(location.search);
//     setFromDate(params.get('fromDate') || '');
//     setToDate(params.get('toDate') || '');
//     setFilterStatus(params.get('order_status') || '');
//   };

//   useEffect(() => {
//     parseQueryParams();
//   }, [location.search]);

//   const fetchOrderDetails = useCallback(async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${SummaryApi.allOrder.url}?orderId=${searchOrderId}&fromDate=${fromDate}&toDate=${toDate || fromDate}&orderStatus=${filterStatus}`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch order details");

//       const responseData = await response.json();
//       if (responseData.success) {
//         const orders = responseData.order
//           ? [responseData.order]
//           : responseData.orders || responseData.data;
//         setData(orders);
//       } else {
//         setData([]);
//         console.error(responseData.message);
//       }
//     } catch (err) {
//       console.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [fromDate, toDate, searchOrderId, filterStatus]);

//   useEffect(() => {
//     fetchOrderDetails();
//   }, [fetchOrderDetails]);

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchOrderId(value);
//   };

//   const handleFilterStatusChange = (e) => {
//     setFilterStatus(e.target.value);
//   };

//   // Function to handle status change
//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       // Check if the new status is different to avoid unnecessary API calls
//       const order = data.find((item) => item.orderId === orderId);
//       if (order && order.order_status === newStatus) {
//         return; // No update needed
//       }

//       setLoadingOrder(orderId); // Set loading state for the specific order

//       // Make the API request to update the order status
//       const response = await fetch(SummaryApi.updateOrderStatus.url, {
//         method: SummaryApi.updateOrderStatus.method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: 'include',
//         body: JSON.stringify({ orderId, order_status: newStatus }), // Update the body to match your API structure
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update order status");
//       }

//       // Update the local state immediately with the new status
//       setData((prevData) =>
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

//   // Function to handle order deletion
//   const handleDeleteOrder = async (orderId) => {
//     try {
//       // Ensure the URL includes the orderId as a query parameter
//       const url = `${SummaryApi.deleteOrder.url}?orderId=${orderId}`;

//       // Make the API request to delete the order
//       const response = await fetch(url, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include", // Include credentials if required by the backend
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete the order");
//       }

//       // Remove the deleted order from the local state
//       setData((prevData) => prevData.filter((item) => item.orderId !== orderId));
//     } catch (err) {
//       setError(err.message); // Handle error properly
//     }
//   };

//   // Function to handle exporting the order data
//   const handleExport = () => {
//     // Filter the data based on the current filter state
//     const exportData = filterStatus || searchOrderId || fromDate || toDate ? data : data;
//     // singleDate ? data : data;
//     // Convert the data to CSV format
//     const csvContent = exportData.map((item) => {
//       const row = [
//         item.orderId,
//         moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A"),
//         item.order_status,
//         item.totalAmount,
//         item.paymentDetails.payment_status,
//         item.billing_name,
//         item.billing_email,
//         item.billing_tel,
//         item.shipping_address,
//       ].join(",");
//       return row;
//     });

//     // Add the header to the CSV
//     const header = [
//       "Order ID",
//       "Order Date",
//       "Order Status",
//       "Total Amount",
//       "Payment Status",
//       "Billing Name",
//       "Billing Email",
//       "Billing Phone",
//       "Shipping Address",
//     ];

//     const csv = [header.join(",")].concat(csvContent).join("\n");

//     // Create a Blob and download the file
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "orders.csv");
//   };

//   return (
//     <div className="p-1 md:p-4 text-xs md:text-[15px] 2xl:text-lg">
//       <div className="p-1 md:p-4 flex flex-col md:flex-row">
//         {/* <input
//           type="date"
//           value={singleDate}
//           onChange={(e) => setSingleDate(e.target.value)}
//           className="border p-2 rounded-md md:mr-2"
//         /> */}
//         <input
//           type={isFocused ? "date" : "text"}
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           className="border p-2 rounded-md md:mr-2"
//           placeholder={isFocused ? "" : "From Date*"}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//         />
//         <input
//           type={isFocused ? "date" : "text"}
//           value={toDate||fromDate}
//           onChange={(e) => setToDate(e.target.value)}
//           className="border p-2 rounded-md md:mr-2"
//           placeholder={isFocused ? "" : "To Date*"}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//         />
//         <input
//           type="text"
//           placeholder="Search by Order ID"
//           value={searchOrderId}
//           onChange={handleSearchChange}
//           className="border p-2 rounded-md md:mr-2"
//         />

//         <select
//           name="status"
//           className="p-2 border rounded-md md:mr-2"
//           value={filterStatus}
//           onChange={handleFilterStatusChange}
//         >
//           <option value="">All Status</option>

//           <option key="ordered" value="ordered">
//             Ordered
//           </option>
//           <option key="packaged" value="packaged">
//             Packaged
//           </option>
//           <option key="shipped" value="shipped">
//             Shipped
//           </option>
//           <option key="delivered" value="delivered">
//             Delivered
//           </option>
//           <option key="Pending" value="Pending">
//             Pending
//           </option>
//           <option key="cancelled" value="cancelled">
//             Cancelled
//           </option>
//           <option key="returnRequested" value="returnRequested">
//             Return Request
//           </option>
//           <option key="returnAccepted" value="returnAccepted">
//             Return Accepted
//           </option>
//           <option key="returned" value="returned">
//             Returned
//           </option>
//         </select>
//       </div>

//       {error && <p className="text-center text-red-500">{error}</p>}
//       {/* Display error message */}
//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <div className="w-8 h-8 border-2 border-blue-400 border-dashed rounded-full animate-spin"></div>
//         </div> // Circular loading spinner
//       ) : data?.length === 0 ? (
//         <p className="text-center mt-8">No Order available</p>
//       ) : (
//         <div className="p-1 md:p-4 w-full">
//           <p className="font-medium mb-2">Order Results: {data?.length}</p>
//           <div className="flex justify-end">
//           {/* Export Button */}
//           <button
//             onClick={handleExport}
//             className="bg-red-600 text-white p-2 rounded-md"
//           >
//             Export Orders
//           </button>
//           </div>
//           {data?.map((item, index) => (
//             <div key={item.userId + index} className="mb-8">
//               <p className="font-medium text-lg">
//                 {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A")}
//               </p>
//               <div className="border rounded">
//                 <div className="flex flex-col lg:flex-row justify-between gap-4 p-1 md:p-4">
//                   {/* Product Details */}
//                   <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
//                     {item?.productDetails.map((product, index) => (
//                       <div
//                         key={product.productId + index}
//                         className="flex gap-3 bg-white p-2 rounded-md"
//                       >
//                         <img
//                           alt="product"
//                           src={product.productImage}
//                           className="w-28 h-28 bg-slate-200 object-scale-down p-2"
//                         />
//                         <div>
//                           <div className="font-medium">{product.productName}</div>
//                           <div className="font-medium ">{product.category}</div>
//                           <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-1">
//                             <div className=" text-red-500">
//                               {displayINRCurrency(product.sellingPrice)}{" "}
//                               <span className="line-through text-gray-500">
//                                 {displayINRCurrency(product.price)}
//                               </span>
//                             </div>
//                             <p>Quantity: {product.quantity}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 {/* Order Details and Payment Container */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-1 md:p-2 xl:p-3 ">
//                   <div className="border p-4 rounded-md">
//                     <div className="text-lg font-medium">Payment Details</div>
//                     <p className="ml-1">
//                       Payment method: {item.paymentDetails.payment_method_type}
//                     </p>
//                     <p className="ml-1">
//                       Payment Status: {item.paymentDetails.payment_status}
//                     </p>
//                   </div>

//                   <div className="border p-4 rounded-md">
//                     <div className="text-lg font-medium">Customer Details</div>
//                     <p className="ml-1">Name: {item.billing_name}</p>
//                     <p className="ml-1">Email: {item.billing_email}</p>
//                     <p className="ml-1">Mobile: {item.billing_tel}</p>
//                   </div>

//                   <div className="border p-4 rounded-md">
//                     <div className="text-lg font-medium">Billing Address</div>
//                     {typeof item.billing_address === "object" ? (
//                       <p className="ml-1">
//                         {item.billing_address.street},{" "}
//                         {item.billing_address.city},{" "}
//                         {item.billing_address.state},{" "}
//                         {item.billing_address.postalCode},{" "}
//                         {item.billing_address.country}
//                       </p>
//                     ) : (
//                       <p className="ml-1">{item.billing_address}</p>
//                     )}
//                   </div>

//                   <div className="border p-4 rounded-md">
//                     <div className="text-lg font-medium">Shipping Address</div>
//                     {typeof item.shipping_address === "object" ? (
//                       <p className="ml-1">
//                         {item.shipping_address.street},{" "}
//                         {item.shipping_address.city},{" "}
//                         {item.shipping_address.state},{" "}
//                         {item.shipping_address.postalCode},{" "}
//                         {item.shipping_address.country}
//                       </p>
//                     ) : (
//                       <p className="ml-1">{item.shipping_address}</p>
//                     )}
//                   </div>

//                   <div className="border p-4 rounded-md">
//   <div className="text-lg font-medium">Order Status</div>
//   <p className="ml-1">Order Id: {item.orderId}</p>
//   <p className="ml-1">Order Status: {item.order_status}</p>

//   {/* Conditional rendering for the dropdown */}
//   {!["Pending", "cancelled", "returned"].includes(item.order_status) && (
//     <div>
//       <select
//         value={loadingOrder === item.orderId ? "loading" : item.order_status}
//         onChange={(e) => handleStatusChange(item.orderId, e.target.value)}
//         className="mt-2 border p-2 rounded-md"
//         disabled={loadingOrder === item.orderId} // Disable only during update
//       >
//         {/* Show "Updating..." option while loading */}
//         {loadingOrder === item.orderId && (
//           <option value="loading" disabled>
//             Updating...
//           </option>
//         )}

//         {/* Regular options for status */}
//         <option value="ordered">Ordered</option>
//         <option value="packaged">Packaged</option>
//         <option value="shipped">Shipped</option>
//         <option value="delivered">Delivered</option>
//         <option value="returnAccepted">Return Accepted</option>
//         <option value="returned">Returned</option>
//       </select>
//     </div>
//   )}

//   {/* Button to delete order for Pending status */}
//   {item.order_status === "Pending" && (
//     <button
//       onClick={() => handleDeleteOrder(item.orderId)}
//       className="bg-red-500 text-white p-2 rounded-md mt-2"
//     >
//       Delete Order
//     </button>
//   )}
// </div>

//                   {/* Delete Button for Pending Orders */}
//                   {/* {item.order_status === "Pending" && (
//                     <div className="text-center mt-2">
//                       <button
//                         onClick={() => handleDeleteOrder(item.orderId)}
//                         className="bg-red-500 text-white p-2 rounded-md"
//                       >
//                         Delete Order
//                       </button>
//                     </div>
//                   )} */}
//                 </div>

//                 <div className="font-semibold ml-auto w-fit lg:text-lg pr-2">
//                   Total Amount: {displayINRCurrency(item.totalAmount)}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllOrder;
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import SummaryApi from "../common";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const AllOrder = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchOrderId, setSearchOrderId] = useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(null); // Track which order is being updated
  const [isFocused, setIsFocused] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null); // Track the expanded order ID

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId); // Toggle between expand and collapse
  };
  const parseQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    setFromDate(params.get("fromDate") || "");
    setToDate(params.get("toDate") || "");
    setFilterStatus(params.get("order_status") || "");
  }, [location.search]);

  useEffect(() => {
    parseQueryParams();
  }, [location.search, parseQueryParams]);
  // Combined function to fetch order details
  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${
          SummaryApi.allOrder.url
        }?orderId=${searchOrderId}&fromDate=${fromDate}&toDate=${
          toDate || fromDate
        }&orderStatus=${filterStatus}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

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
      if (!SummaryApi.deleteOrder?.url) {
        throw new Error(
          "API URL is undefined. Please check your configuration."
        );
      }

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
      setData((prevData) =>
        prevData.filter((item) => item.orderId !== orderId)
      );
      // Show success toast
      toast.success("Order deleted successfully!");
    } catch (err) {
      // Show error message as a toast
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  // Function to handle exporting the order data
  const handleExport = () => {
    // Filter the data based on the current filter state
    const exportData =
      filterStatus || searchOrderId || fromDate || toDate ? data : data;

    // Convert the data to CSV format
    const csvContent = exportData.map((item) => {
      const row = [
        item.orderId,
        moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A"),
        item.order_status,
        item.totalAmount,
        item.paymentDetails.payment_status,
        item.billing_name,
        item.billing_email,
        item.billing_tel,
        item.shipping_address,
      ].join(",");
      return row;
    });

    // Add the header to the CSV
    const header = [
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

    const csv = [header.join(",")].concat(csvContent).join("\n");

    // Create a Blob and download the file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "orders.csv");
  };

  return (
    <div className="p-1 md:p-4 text-xs md:text-[15px] 2xl:text-lg">

      <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
        <h2 className='font-bold text-xl text-gray-900'>All Orders</h2>
        <button className='border-2 border-brand-buttonSecondary text-brand-buttonSecondary hover:bg-brand-buttonSecondaryHover hover:text-white transition-all py-2 px-4 rounded-full ' onClick={handleExport}>Export Orders</button>
      </div>

      <div className="p-4 flex flex-col md:flex-row md:flex-wrap gap-4 mb-6  mt-4">
        <input
          type={isFocused ? "date" : "text"}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded-md "
          placeholder={isFocused ? "" : "From Date*"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <input
          type={isFocused ? "date" : "text"}
          value={toDate || fromDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded-md "
          placeholder={isFocused ? "" : "To Date*"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchOrderId}
          onChange={handleSearchChange}
          className="border p-2 rounded-md "
        />

        <select
          name="status"
          className="p-2 border rounded-md "
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

      {error && <p className="text-center text-brand-primary">{error}</p>}
      {/* Display error message */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-2 border-brand-buttonSecondary border-dashed rounded-full animate-spin"></div>
        </div> // Circular loading spinner
      ) : data?.length === 0 ? (
        <p className="text-center mt-8">No Order available</p>
      ) : (
        <div className="p-1 md:p-4 w-full">
          <div className="flex flex-col md:flex-row justify-between item-center space-y-4 md:space-y-0">
            <h2 className="text-xl font-bold">Order Results: {data?.length}</h2>
          </div>
          {data?.map((item, index) => (
            <div
              key={item.userId + index}
              className="mt-4 border rounded-lg p-4 bg-white shadow"
            >
              {/* Header Section */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-lg">
                    {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A")}
                  </p>
                  <p className="text-brand-textMuted0">Order ID: {item.orderId}</p>
                </div>
                <button
                  onClick={() => toggleExpand(item.orderId)}
                  className="text-brand-buttonSecondary font-semibold hover:underline"
                >
                  {expandedOrder === item.orderId
                    ? "Collapse Details"
                    : "Expand Details"}
                </button>
              </div>
              {/* Expanded Details */}
              {expandedOrder === item.orderId && (
                <div className="mt-4">
                  {/* Product Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
                    {item?.productDetails.map((product, index) => (
                      <div
                        key={product.productId + index}
                        className="flex gap-3 bg-white p-2 border rounded-md shadow"
                      >
                        <img
                          alt={product.altTitle || "Product"}
                          title={product.altTitle || "Product"}
                          src={product.productImage}
                          className="w-28 h-28 bg-slate-200 object-scale-down p-2"
                        />
                        <div>
                          <div className="font-medium">
                            {product.productName}
                          </div>
                          <div className="text-sm text-brand-textMuted">
                            {product.category}
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-1">
                            <div className=" text-brand-primary">
                              {displayINRCurrency(product.sellingPrice)}{" "}
                              <span className="line-through text-brand-textMuted">
                                {displayINRCurrency(product.price)}
                              </span>
                            </div>
                            <p>Quantity: {product.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details and Payment Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="border p-4 rounded-md bg-white shadow">
                      <div className="text-lg font-medium">Payment Details</div>
                      <p className="ml-1">
                        Payment method:{" "}
                        {item.paymentDetails.payment_method_type}
                      </p>
                      <p className="ml-1">
                        Payment Status: {item.paymentDetails.payment_status}
                      </p>
                    </div>

                    <div className="border p-4 rounded-md bg-white shadow">
                      <div className="text-lg font-medium">
                        Customer Details
                      </div>
                      <p className="ml-1">Name: {item.billing_name}</p>
                      <p className="ml-1">Email: {item.billing_email}</p>
                      <p className="ml-1">Mobile: {item.billing_tel}</p>
                    </div>

                    <div className="border p-4 rounded-md bg-white shadow">
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

                    <div className="border p-4 rounded-md bg-white shadow">
                      <div className="text-lg font-medium">
                        Shipping Address
                      </div>
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

                    <div className="border p-4 rounded-md bg-white shadow">
                      <div className="text-lg font-medium">Order Status</div>
                      <p className="ml-1">Order Id: {item.orderId}</p>
                      <p className="ml-1">Order Status: {item.order_status}</p>

                      {/* Conditional rendering for the dropdown */}
                      {!["Pending", "cancelled", "returned"].includes(
                        item.order_status
                      ) && (
                        <div>
                          <select
                            value={
                              loadingOrder === item.orderId
                                ? "loading"
                                : item.order_status
                            }
                            onChange={(e) =>
                              handleStatusChange(item.orderId, e.target.value)
                            }
                            className="mt-2 border p-2 rounded-lg shadow"
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
                            <option value="returnAccepted">
                              Return Accepted
                            </option>
                            <option value="returned">Returned</option>
                          </select>
                        </div>
                      )}
                      {/* Button to delete order for Pending status */}
                      {item.order_status === "Pending" && (
                        <button
                          onClick={() => handleDeleteOrder(item.orderId)}
                          className="bg-brand-primary text-white p-2 rounded-lg mt-2 shadow"
                        >
                          Delete Order
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="font-semibold mt-4 text-right">
                    Total Amount: {displayINRCurrency(item.totalAmount)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrder;
