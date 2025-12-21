// import React, { useEffect, useState, useCallback } from "react";
// import { useLocation } from "react-router-dom";
// import SummaryApi from "../common";
// import moment from "moment";
// import displayINRCurrency from "../helpers/displayCurrency";
// import { saveAs } from "file-saver";
// import { IoMdArrowRoundBack } from "react-icons/io";


// const Order = () => {
//   const location = useLocation();
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchOrderId, setSearchOrderId] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const parseQueryParams = () => {
//     const params = new URLSearchParams(location.search);
//     setFromDate(params.get("fromDate") || "");
//     setToDate(params.get("toDate") || "");
//   };

//   useEffect(() => {
//     parseQueryParams();
//   }, [location.search]);

//   const fetchOrderDetails = useCallback(async () => {
//     try {
//       setLoading(true);
//       let url = `${SummaryApi.allOrder.url}?orderId=${searchOrderId}&fromDate=${fromDate}&toDate=${toDate || fromDate}`;

//       const response = await fetch(url, {
//         method: "GET",
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error(`Failed to fetch order details: ${response.statusText}`);

//       const responseData = await response.json();
//       if (responseData.success) {
//         const orders = responseData.orders || responseData.data || [];
//         const filteredOrders = orders.filter((order) =>
//           ["delivered", "returnRequest", "returnAccepted"].includes(order.order_status)
//         );
//         setData(filteredOrders);
//       } else {
//         setData([]);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [fromDate, toDate, searchOrderId]);

//   useEffect(() => {
//     fetchOrderDetails();
//   }, [fetchOrderDetails]);

//   const handleExport = () => {
//     const exportData = data.map((item) => ({
//       orderId: item.orderId,
//       orderDate: moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A"),
//       orderStatus: item.order_status,
//       totalAmount: displayINRCurrency(item.totalAmount),
//       paymentStatus: item.paymentDetails.payment_status,
//       billingName: item.billing_name,
//       billingEmail: item.billing_email,
//       billingTel: item.billing_tel,
//       shipping_address: item.shipping_address,
//     }));

//     const csvContent = [
//       [
//         "Order ID",
//         "Order Date",
//         "Order Status",
//         "Total Amount",
//         "Payment Status",
//         "Billing Name",
//         "Billing Email",
//         "Billing Phone",
//         "Shipping Address",
//       ],
//       ...exportData.map((row) => Object.values(row)),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "orders.csv");
//   };

//   // Function to render order details
//   const renderOrderDetails = () => {
//     if (!selectedOrder) return null;
//   console.log(selectedOrder);
  
//     return (
//       <>
//         <div className="flex">
//           <button
//             onClick={() => setSelectedOrder(null)}
//             className="mr-2 text-custom-red text-3xl font-semibold mb-4"
//           >
//             <IoMdArrowRoundBack />
//           </button>
//           <h1 className="text-2xl font-bold mb-4">Order Details</h1>
//         </div>
//         <div className="flex justify-between mb-8 p-6 bg-white border rounded-lg shadow-sm">
//           {/* Right: Product Details */}
//           <div className="w-2/3">
//             {selectedOrder.productDetails && selectedOrder.productDetails[0] ? (
//               <>
//                 <div className="mb-8 p-6 bg-white border rounded-lg shadow-sm">
//                   <div className="flex items-start">
//                     <img
//                       src={selectedOrder.productDetails[0].productImage}
//                       alt={selectedOrder.productDetails[0].productName}
//                       className="w-32 h-32 object-cover flex-wrap rounded-md mr-4"
//                     />
//                     <div>
//                       <h3 className="text-l font-semibold text-gray-800">
//                         {selectedOrder.productDetails[0].productName}
//                       </h3>
//                       <p className="text-gray-500 mt-1">
//                         Price: <span className="text-red-600 font-bold">?{selectedOrder.productDetails[0].sellingPrice}</span>{" "}
//                         {selectedOrder.productDetails[0].price && (
//                           <span className="line-through text-gray-400 font-bold ml-2">
//                             ?{selectedOrder.productDetails[0].price}
//                           </span>
//                         )}
//                       </p>
//                       <span className="ml-2 bg-green-500 text-white px-2 py-1 text-xs rounded font-semibold">
//                         {`${(
//                           ((selectedOrder.productDetails[0].price - selectedOrder.productDetails[0].sellingPrice) / selectedOrder.productDetails[0].price) * 100
//                         ).toFixed(2)}% OFF`}
//                       </span>
//                       <p className="text-gray-600 mt-2">Quantity: {selectedOrder.productDetails[0].quantity}</p>
//                     </div>
//                   </div>
//                   <div className="border-t mt-4"></div>
//                   <div className="text-right mt-4">
//                     <p className="text-m font-semibold">
//                       Total Amount: ?{selectedOrder.productDetails[0].sellingPrice * selectedOrder.productDetails[0].quantity}
//                     </p>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <p>No product details available</p>
//             )}
//           </div>
//           {/* Left: User Details */}
//           <div className="w-1/3 pl-2 mb-8">
//             <div className="p-6 pl-6 border rounded-lg shadow-md bg-white mb-8">
//               <h3 className="text-l font-semibold text-gray-800 mb-2">
//                 Customer: {selectedOrder.billing_name}
//               </h3>
//               <p className="text-gray-600">Email: {selectedOrder.billing_email}</p>
//               <p className="text-gray-600">Mobile: {selectedOrder.billing_tel}</p>
//               <div className="mt-4">
//                 <h4 className="text-l font-semibold mb-4">Customer Address</h4>
//                 <p className="text-gray-600">
//                   {selectedOrder.billing_address || 'N/A'}
//                 </p>
//                 {/* <p className="text-gray-600">
//                   {selectedOrder.billing_address?.city || 'N/A'},{" "}
//                   {selectedOrder.billing_address?.state || 'N/A'}
//                 </p>
//                 <p className="text-gray-600">
//                   {selectedOrder.billing_address?.country || 'N/A'} -{" "}
//                   {selectedOrder.billing_address?.pinCode || 'N/A'}
//                 </p> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };
  
  
  

//   if (selectedOrder) {
//     return renderOrderDetails();
//   }

//   return (
//     <div className="p-4">
//       <div className="mb-4 flex flex-wrap gap-4">
//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           className="border p-2 rounded"
//           placeholder="From Date"
//         />
//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//           className="border p-2 rounded"
//           placeholder="To Date"
//         />
//         <input
//           type="text"
//           placeholder="Search by Order ID"
//           value={searchOrderId}
//           onChange={(e) => setSearchOrderId(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <button
//           onClick={handleExport}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Export Orders
//         </button>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}
//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : data.length === 0 ? (
//         <p className="text-center">No orders available</p>
//       ) : (
        
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead>
//             <tr className="bg-red-600">
//               <th className="py-2 px-4 border text-white">Order ID</th>
//               <th className="py-2 px-4 border text-white">Order Date</th>
//               <th className="py-2 px-4 border text-white">Order Status</th>
//               <th className="py-2 px-4 border text-white">Total Amount</th>
//               <th className="py-2 px-4 border text-white">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item.orderId}>
//                 <td className="py-2 px-4 border">{item.orderId}</td>
//                 <td className="py-2 px-4 border">
//                   {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A")}
//                 </td>
//                 <td className="py-2 px-4 border">{item.order_status}</td>
//                 <td className="py-2 px-4 border">
//                   {displayINRCurrency(item.totalAmount)}
//                 </td>
//                 <td className="py-2 px-4 border">
//                   <button
//                     onClick={() => setSelectedOrder(item)}
//                     className="bg-red-600 text-white px-2 py-1 rounded"
//                   >
//                     View
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Order;
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import SummaryApi from "../common";
import moment from "moment";
import displayINRCurrency from "../helpers/displayCurrency";
import { saveAs } from "file-saver";
import { IoMdArrowRoundBack } from "react-icons/io";
import * as XLSX from "xlsx";

const Order = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatuses, setFilterStatuses] = useState([]); // Store selected filter statuses
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility

  const orderStatuses = [
    "ordered",
    "packaged",
    "shipped",
    "delivered",
    "Pending",
    "cancelled",
    "returnRequested",
    "returnAccepted",
    "returned",
  ];

  const parseQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    setFromDate(params.get("fromDate") || "");
    setToDate(params.get("toDate") || "");
    const statuses = params.getAll("order_status");
    setFilterStatuses(statuses.length > 0 ? statuses : []);
  }, [location.search]);

  useEffect(() => {
    parseQueryParams();
  }, [parseQueryParams]);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${SummaryApi.allOrder.url}?orderId=${searchOrderId}&fromDate=${fromDate}&toDate=${toDate || fromDate}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(`Failed to fetch order details: ${response.statusText}`);

      const responseData = await response.json();
      if (responseData.success) {
        const orders = responseData.orders || responseData.data || [];
        setData(orders); // Don't apply any filter here, load all orders
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, searchOrderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleStatusChange = (status) => {
    setFilterStatuses((prevStatuses) =>
      prevStatuses.includes(status)
        ? prevStatuses.filter((s) => s !== status)
        : [...prevStatuses, status]
    );
  };

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

    const ws = XLSX.utils.json_to_sheet(exportData);

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

    const wscols = [
      { wch: 10 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 70 },
    ];

    ws["!cols"] = wscols;
    XLSX.utils.sheet_add_aoa(ws, [wsHeaders], { origin: "A1" });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    saveAs(blob, "orders.xlsx");
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  const filteredOrders = filterStatuses.length
  ? data.filter((order) => filterStatuses.includes(order.order_status))
  : data.filter(
      (order) =>
        !["Pending", "returned", "cancelled"].includes(order.order_status)
    );


  const totalAmount = filteredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  // Function to render order details
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;
  
    return (
      <div className="p-1 md:p-4">
        <div className="flex">
          <button
            onClick={() => setSelectedOrder(null)}
            className="mr-2 text-custom-red text-3xl font-semibold mb-4"
          >
            <IoMdArrowRoundBack />
          </button>
          <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        </div>
        <div className="flex flex-col lg:flex-row justify-between mb-8 p-6 bg-white border rounded-lg shadow-sm">
          {/* Right: Product Details */}
          <div className="w-full lg:w-2/3">
            {selectedOrder.productDetails && selectedOrder.productDetails[0] ? (
              <>
                <div className="mb-8 p-6 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <img
                      src={selectedOrder.productDetails[0].productImage}
                      alt={selectedOrder.productDetails[0].productName}
                      className="w-32 h-32 object-cover flex-wrap rounded-md mr-4"
                    />
                    <div>
                      <h3 className="text-l font-semibold text-gray-800">
                        {selectedOrder.productDetails[0].productName}
                      </h3>
                      <p className="text-gray-500 mt-1">
                        Price: <span className="text-red-600 font-bold">?{selectedOrder.productDetails[0].sellingPrice}</span>{" "}
                        {selectedOrder.productDetails[0].price && (
                          <span className="line-through text-gray-400 font-bold ml-2">
                            ?{selectedOrder.productDetails[0].price}
                          </span>
                        )}
                      </p>
                      <span className="ml-2 bg-green-500 text-white px-2 py-1 text-xs rounded font-semibold">
                        {`${(
                          ((selectedOrder.productDetails[0].price - selectedOrder.productDetails[0].sellingPrice) / selectedOrder.productDetails[0].price) * 100
                        ).toFixed(2)}% OFF`}
                      </span>
                      <p className="text-gray-600 mt-2">Quantity: {selectedOrder.productDetails[0].quantity}</p>
                    </div>
                  </div>
                  <div className="border-t mt-4"></div>
                  <div className="text-right mt-4">
                    <p className="text-m font-semibold">
                      Total Amount: ?{selectedOrder.productDetails[0].sellingPrice * selectedOrder.productDetails[0].quantity}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p>No product details available</p>
            )}
          </div>
          {/* Left: User Details */}
          <div className="w-full lg:w-1/3 pl-2 mb-8">
            <div className="p-6 pl-6 border rounded-lg shadow-md bg-white mb-8">
              <h3 className="text-l font-semibold text-gray-800 mb-2">
                Customer: {selectedOrder.billing_name}
              </h3>
              <p className="text-gray-600">Email: {selectedOrder.billing_email}</p>
              <p className="text-gray-600">Mobile: {selectedOrder.billing_tel}</p>
              <div className="mt-4">
                <h4 className="text-l font-semibold mb-4">Customer Address</h4>
                <p className="text-gray-600">
                  {selectedOrder.billing_address || 'N/A'}
                </p>
                {/* <p className="text-gray-600">
                  {selectedOrder.billing_address?.city || 'N/A'},{" "}
                  {selectedOrder.billing_address?.state || 'N/A'}
                </p>
                <p className="text-gray-600">
                  {selectedOrder.billing_address?.country || 'N/A'} -{" "}
                  {selectedOrder.billing_address?.pinCode || 'N/A'}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedOrder) {
    return renderOrderDetails();
  }
  return (
    <div className="p-1 md:p-4">
      <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
        <h2 className='font-bold text-xl text-gray-800'>All Sales Orders</h2>
        <button className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-4 rounded-full' onClick={handleExport}>Export to Excel</button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 mt-4 p-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded w-full md:w-auto"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded w-full md:w-auto"
        />
        <input
        className="border p-2 rounded text-black w-full md:w-auto"
          type="text"
          placeholder="Search by Order ID"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
        />
        <div className="relative w-full md:w-auto">
        <button
          onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility
          className="p-2 border rounded-md bg-white min-w-60 w-full"
        >
          Filter Order Status
        </button>

        {showDropdown && (
          <div className="border p-4 right-25 min-w-60 w-full bg-white shadow rounded-lg absolute z-10 left-0 top-full mt-2">
            {orderStatuses.map((status) => (
              <label key={status} className="block mb-2">
                <input
                  type="checkbox"
                  value={status}
                  checked={filterStatuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                  className="mr-2"
                />
                {status}
              </label>
            ))}
          </div>
        )}
        </div>
      </div>

      <div className="mb-4 text-lg font-semibold">
        Total Amount for Filtered Orders: {displayINRCurrency(totalAmount)}
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center">No orders available</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-red-600">
              <th className="py-2 px-4 border text-white ">Order ID</th>
              <th className="py-2 px-4 border text-white">Order Date</th>
              <th className="py-2 px-4 border text-white">Order Status</th>
              <th className="py-2 px-4 border text-white">Total Amount</th>
              <th className="py-2 px-4 border text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((item) => (
              <tr key={item.orderId}>
                <td className="py-2 px-4 border text-center">{item.orderId}</td>
                <td className="py-2 px-4 border text-center whitespace-nowrap">
                  {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A")}
                </td>
                <td className="py-2 px-4 border text-center">{item.order_status}</td>
                <td className="py-2 px-4 border text-center">
                  {displayINRCurrency(item.totalAmount)}
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => setSelectedOrder(item)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-center"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
      )}
    </div>
  );
};

export default Order;





