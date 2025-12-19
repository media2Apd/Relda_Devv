import React, { useEffect, useState } from "react";
import { TbArrowsMaximize } from "react-icons/tb";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import displayINRCurrency from "../helpers/displayCurrency";
import SummaryApi from "../common"; // Ensure you have the correct API object
import * as XLSX from "xlsx"; // Import the xlsx library

const ReturnedProducts = () => {
  const [returnedOrders, setReturnedOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(null); // To track which order is being updated
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({}); // To track expanded state

  const handleToggleDetails = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId], // Toggle the expanded state
    }));
  };

  const handleViewImage = (imageBase64) => {
    // Set the selected image to open in the modal
    setSelectedImage(imageBase64);
  };

  const handleCloseModal = () => {
    // Clear the selected image to close the modal
    setSelectedImage(null);
  };

  // Fetch all returned orders
  const fetchReturnedOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SummaryApi.allOrder.url}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch returned orders");
      }

      const responseData = await response.json();
      if (responseData.success) {
        const orders = responseData.order
          ? [responseData.order]
          : responseData.orders || responseData.data;

        const filteredOrders = orders.filter(
          (each) => each.order_status === "returnRequested"
        );
        setReturnedOrders(filteredOrders);
      } else {
        setReturnedOrders([]);
        setError(responseData.message || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnedOrders();
  }, []);

  // Handle return accepted button click
  const handleReturnAccept = async (orderId, newStatus) => {
    try {
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
      setReturnedOrders((prevData) =>
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

   // Export returned orders to Excel
   const handleExportExcel = () => {
    const ordersToExport = returnedOrders.map((order) => {
      const returnProducts = order.productDetails.filter(
        (each) => each.isReturn === true
      );
      const totalAmount = returnProducts.reduce(
        (acc, item) => acc + item.quantity * item?.sellingPrice,
        0
      );

      return {
        "Order ID": order.orderId,
        "Customer Name": order.billing_name,
        "Total Amount": displayINRCurrency(totalAmount),
        "Return Reason": order.returnReason,
        "Payment Method": order.paymentDetails?.payment_method_type || "N/A",
        "Payment Status": order.paymentDetails?.payment_status || "N/A",
      };
    });

    const ws = XLSX.utils.json_to_sheet(ordersToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Returned Orders");

    XLSX.writeFile(wb, "Returned_Orders.xlsx");
  };


  return (
    <div className="p-4">
      <h1 className="text-lg font-medium mb-4">Return Requested Products</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-2 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : returnedOrders.length === 0 ? (
        <p className="text-center">No Return Request Available</p>
      ) : (
        <div className=" gap-4">
           {/* Export to Excel Button */}
           <div className="flex justify-end">
           <button 
            onClick={handleExportExcel}
            className="p-2 bg-red-600 text-white rounded-md mb-4"
          >
            Export to Excel
          </button>
          </div>
          {returnedOrders.map((order) => {
            const returnProducts = order.productDetails.filter(
              (each) => each.isReturn === true
            );
            const totalAmount = returnProducts.reduce(
              (acc, item) => acc + item.quantity * item?.sellingPrice,
              0
            );
            const isExpanded = expandedOrders[order.orderId]; // Check if the order is expanded

            return (
              <div className="border rounded-md">
                  <p className="pl-4 pt-4"><span className="text-red-500 font-bold">Reason: </span>{order.returnReason}</p>
              <div
                key={order.orderId}
                className=" p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Order ID: {order.orderId}</p>
                  {returnProducts.map((product) => (
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                      {product?.productName}
                    </h2>
                  ))}
                  <p>Customer: {order.billing_name}</p>
                  <p>Total Amount: {displayINRCurrency(totalAmount)}</p>
                  <button
                    onClick={() => handleToggleDetails(order.orderId)}
                    className="mt-2 text-blue-500 underline"
                  >
                    {isExpanded ? "Hide Details" : "View All Details"}
                  </button>
                </div>
                <div className="flex flex-wrap items-center">
                  {order.returnImages.map((eachImage, index) => (
                    <div
                      key={index}
                      className="relative group m-2"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    >
                      {/* Image */}
                      <img
                        src={eachImage.imageBase64}
                        alt={`Return ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        {/* View Image Icon */}
                        <button
                          onClick={() => handleViewImage(eachImage.imageBase64)}
                          className="text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 m-1"
                          title="View Image"
                        >
                          <TbArrowsMaximize />
                        </button>

                        {/* Download Icon */}
                        <a
                          href={eachImage.imageBase64}
                          download={`ReturnImage_${index + 1}`}
                          className="text-white bg-green-500 hover:bg-green-600 rounded-full p-2 m-1"
                          title="Download Image"
                        >
                          <MdOutlineFileDownload />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    handleReturnAccept(order.orderId, "returnAccepted")
                  }
                  className={`p-2 rounded-md text-white ${
                    loadingOrder === order.orderId
                      ? "bg-gray-400 cursor-not-allowed"
                      : order.order_status === "returnRequested"
                      ? "bg-green-500"
                      : order.order_status === "returnAccepted"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  disabled={loadingOrder === order.orderId}
                >
                  {loadingOrder === order.orderId
                    ? "Updating..."
                    : order.order_status === "returnRequested"
                    ? "Accept"
                    : "Accepted"}
                </button>
              </div>
              {isExpanded && (
                  <div className="mt-4">
                    {/* Full Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-1 md:p-2 xl:p-3">
                      <div className="border p-4 rounded-md">
                        <div className="text-lg font-medium">Payment Details</div>
                        <p className="ml-1">
                          Payment method: {order.paymentDetails?.payment_method_type || "N/A"}
                        </p>
                        <p className="ml-1">
                          Payment Status: {order.paymentDetails?.payment_status || "N/A"}
                        </p>
                      </div>

                      <div className="border p-4 rounded-md">
                        <div className="text-lg font-medium">Customer Details</div>
                        <p className="ml-1">Name: {order.billing_name}</p>
                        <p className="ml-1">Email: {order.billing_email}</p>
                        <p className="ml-1">Mobile: {order.billing_tel}</p>
                      </div>

                      <div className="border p-4 rounded-md">
                        <div className="text-lg font-medium">Billing Address</div>
                        <p className="ml-1">
                          {typeof order.billing_address === "object"
                            ? `${order.billing_address.street}, ${order.billing_address.city}, ${order.billing_address.state}, ${order.billing_address.postalCode}, ${order.billing_address.country}`
                            : order.billing_address}
                        </p>
                      </div>

                      <div className="border p-4 rounded-md">
                        <div className="text-lg font-medium">Shipping Address</div>
                        <p className="ml-1">
                          {typeof order.shipping_address === "object"
                            ? `${order.shipping_address.street}, ${order.shipping_address.city}, ${order.shipping_address.state}, ${order.shipping_address.postalCode}, ${order.shipping_address.country}`
                            : order.shipping_address}
                        </p>
                      </div>

                      <div className="border p-4 rounded-md">
                        <div className="text-lg font-medium">Order Status</div>
                        <p className="ml-1">Order ID: {order.orderId}</p>
                        <p className="ml-1">Order Status: {order.order_status}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full p-4">
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-2 right-2 text-black bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                  title="Close"
                >
                  <IoClose />
                </button>

                {/* Full Image */}
                <img
                  src={selectedImage}
                  alt="Full View"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnedProducts;
