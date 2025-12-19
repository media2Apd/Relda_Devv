import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import { toast } from 'react-toastify';
const OrderTracking = () => {
  const { orderId } = useParams(); // Get order ID from route
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false); // State to toggle modal
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Store selected order ID
  const [cancelReason, setCancelReason] = useState(""); // Store the selected reason
  const [customComment, setCustomComment] = useState("");
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [productReturn, setProductReturn] = useState("");
  const [isRequestClick, setIsRequestClick] = useState(false);


  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${SummaryApi.viewOneOrder.url}/${orderId}`,
        {
          method: SummaryApi.getOrder.method,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setOrderDetails(result.data);
      } else {
        console.error("Failed to fetch order details.");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  // Predefined cancellation reasons
  const cancelReasons = [
    "Shipping Time Too Long",
    "Ordered by mistake",
    "Wrong address selected",
    "Wrong contact number entered",
    "Other (please specify): _______________",
  ];

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId); // Set the selected order ID
    setShowCancelModal(true); // Open the modal
  };

  // Function to handle order cancellation
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error("Please select a reason for cancellation.");
      return;
    }
    setIsRequestClick(true)

    try {
      // Make a request to update the order status to 'cancelled'
      const response = await fetch(SummaryApi.CancelOrder.url, {
        method: SummaryApi.CancelOrder.method,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: selectedOrderId,
          cancelReason: cancelReason,
          customComment: customComment, // Send custom comment if provided
          order_status: "cancelled", // Set status to 'cancelled'
        }),
      });

      if (!response.ok) {
        console.error(`Failed to cancel order. Status: ${response.status}`);
        return;
      }

      fetchOrderDetails();
      setShowCancelModal(false); // Close the modal
      toast.success("Order has been cancelled successfully.");
    } catch (err) {
      console.error("Error canceling order:", err);
      toast.error("An error occurred while canceling the order.");
    } finally {
      setIsRequestClick(false)
    }
  };

  const handleReturn = () => {
    setIsReturnModalOpen(true);
  };

  const handleProductChange = (selectedOptions) => {
    setProductReturn(selectedOptions.map((option) => option.value)); // Update state with selected values
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmitReturn = async () => {
    if (!returnReason || uploadedImages.length === 0) {
      toast.error("Please provide a return reason and upload at least one image.");
      return;
    }
    setIsRequestClick(true)

    try {
      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("productIds", productReturn);

      formData.append("returnReason", returnReason);
      formData.append("order_status", "returnRequested");
      uploadedImages.forEach((file) => formData.append("returnImages", file));

      const response = await fetch(SummaryApi.returnOrder.url, {
        method: SummaryApi.returnOrder.method,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast("Return request submitted successfully.");
        fetchOrderDetails();
        setIsReturnModalOpen(false); // Close modal
        setReturnReason("");
        setUploadedImages([]);
      } else {
        console.error("Failed to submit return request.");
      }
    } catch (err) {
      console.error("Error submitting return request:", err);
    } finally {
      setIsRequestClick(false)
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!orderDetails)
    return <p className="text-center mt-8">Order not found.</p>;

  const orderStages = [
    { id: "ordered", label: "Ordered" },
    { id: "packaged", label: "Packaged" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
    { id: "returnRequested", label: "Requested" },
    { id: "returnAccepted", label: "Accepted" },
    { id: "returned", label: "Returned" },
  ];

  let isReturnEligible = null;

  const calculateReturnEligible = (deliveredObject) => {
    const deliveredDate = new Date(deliveredObject?.updatedAt); // Parse the delivered date
    const currentDate = new Date(); // Get the current date
    const differenceInDays = Math.floor(
      (currentDate - deliveredDate) / (1000 * 60 * 60 * 24)
    ); // Calculate the difference in days
    
    const isReturnEligible = differenceInDays <= 6; // Check if it's within 7 days
    return isReturnEligible;
  }
  
  const calculateTotalDiscountPercentage = (products) => {
    const totalOriginalPrice = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const totalSellingPrice = products.reduce(
      (sum, product) => sum + product.sellingPrice * product.quantity,
      0
    );

    const totalDiscount = totalOriginalPrice - totalSellingPrice;

    return ((totalDiscount / totalOriginalPrice) * 100).toFixed(2);
  };

  return (
    <div className="p-6 mt-2 space-y-6 max-w-7xl mx-auto font-semibold">
      <div
        onClick={() => navigate(-1)}
        className="cursor-pointer flex justify-between"
      >
        <button className="text-black-500 font-bold flex">
          <IoMdArrowRoundBack className="text-2xl" /> Back
        </button>
        <p className="text-sm text-gray-700 font-semibold">
          Order Date: {moment(orderDetails.createdAt).format("LL")}
        </p>
      </div>
      <div className="flex justify-between">
        <h1 className="text-sm font-bold">Order ID:<span className="text-gray-600">{orderDetails.orderId}</span></h1>

        <h1 className="text-md text-orange-600 font-semibold">
          Items:{" "}
          {orderDetails.productDetails.reduce(
            (totalItems, product) => totalItems + product.quantity,
            0
          )}
        </h1>
      </div>
      {/* Order Header */}

      {/* Product Section */}
      <div className="gap-2">
        <div
          className={`grid grid-cols-1 gap-6 ${orderDetails.productDetails.length === 1
            ? "md:grid-cols-1"
            : "md:grid-cols-2"
            }`}
        >
          {orderDetails.productDetails.map((product, index) => (
            <div
              className="bg-gray-50 flex items-start rounded-lg p-2"
              key={product.productId}
            >
              <img
                src={product.productImage}
                alt={product.altTitle || "product"}
                title={product.altTitle || "product"}
                // className="w-20 h-20 rounded-lg object-cover"
                className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-lg object-cover cursor-pointer transition-transform duration-300 hover:scale-105"

              />
              <div className="ml-4 flex-1">
                <h2 className="text-red-600 text-md font-bold uppercase">
                  {product.brandName}
                </h2>
                <p className="text-sm text-gray-900 font-bold mt-2">
                  {product.productName}
                </p>
                <p className="text-sm text-gray-600 font-semibold">
                  Quantity:{" "}
                  <span className="text-orange-600 font-semibold">
                    {product.quantity}
                  </span>
                </p>
                <div className="text-red-600 text-sm font-semibold mt-2">
                  {displayINRCurrency(product.sellingPrice)}{" "}
                  <span className="line-through text-gray-500">
                    {displayINRCurrency(product.price)}
                  </span>
                  <span className="ml-1 px-2 py-1 text-xs font-medium rounded-md shadow" style={{ backgroundColor: "#175E17", color: "#E8F5E9" }}>
                    {`${Math.ceil(
                      ((product.price - product.sellingPrice) / product.price) *
                      100
                    )}% OFF`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="bg-gray-50 p-2 rounded-lg">
          <h2 className="font-bold text-lg">Customers</h2>
          <p className="text-gray-600">{orderDetails.billing_name}</p>
          <p className="text-gray-500">
            {orderDetails.productDetails[0].quantity} <span>Order</span>
          </p>
        </div>
        <div className="bg-gray-50 p-2 mt-2 rounded-lg">
          <h2 className="font-bold text-lg">Contact Information</h2>
          <p className="text-gray-600">{orderDetails.email}</p>
          <p className="text-gray-500">{orderDetails.billing_tel}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-2">
          <h2 className="font-bold text-lg">Order Summary</h2>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{displayINRCurrency(orderDetails.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span>
                {calculateTotalDiscountPercentage(orderDetails.productDetails)}%
                OFF
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{orderDetails.shippingOption}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Expected delivery</span>
              <span>Within 4 Days</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Paid</span>
              <span>{displayINRCurrency(orderDetails.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="">
          <div className="bg-gray-50 p-2 rounded-lg">
            <h2 className="font-bold text-lg">Billing Information</h2>
            <p className="text-gray-600">{orderDetails.billing_name}</p>
            <p className="text-gray-500">{orderDetails.billing_email}</p>
            <p className="text-gray-500">{orderDetails.billing_tel}</p>
            <p className="text-gray-500">{orderDetails.billing_address}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg mt-2">
            <h2 className="font-bold text-lg">Shipping Address</h2>
            <p className="text-gray-600">{orderDetails.shipping_address}</p>
          </div>
        </div>
      </div>

      {/* Order Activity */}
      <div className="bg-gray-50 p-2 rounded-lg">
        <h2 className="font-bold text-lg">Order Status</h2>

        <div className="flex flex-col gap-10 p-2 min-w-[200px] lg:flex-row lg:gap-6 ">
          {orderStages.map((stage, idx) => {
            // Determine if the current stage is included in statusUpdates
            const isCompleted = orderDetails.statusUpdates?.some(
              (update) => update.status === stage.id
            );

            // Check if the order has been cancelled
            const isCancelled = orderDetails.statusUpdates?.some(
              (update) => update.status === "cancelled"
            );

            // Check specific conditions to hide stages
            const hasOrdered = orderDetails.statusUpdates?.some(
              (update) => update.status === "ordered"
            );

            const hasPackaged = orderDetails.statusUpdates?.some(
              (update) => update.status === "packaged"
            );

            const hasShipped = orderDetails.statusUpdates?.some(
              (update) => update.status === "shipped"
            );

            const hasDelivered = orderDetails.statusUpdates?.some(
              (update) => update.status === "delivered"
            );

            const hasReturnRequest = orderDetails.statusUpdates?.some(
              (update) => update.status === "returnRequested"
            );

            const condition1 = hasOrdered;
            const condition2 = hasOrdered && isCancelled;
            const condition3 = hasOrdered && hasPackaged && isCancelled;
            const condition4 = hasOrdered && hasPackaged && hasShipped;
            const condition5 =
              hasOrdered && hasPackaged && hasShipped && hasDelivered;
            const condition6 =
              hasOrdered &&
              hasPackaged &&
              hasShipped &&
              hasDelivered &&
              hasReturnRequest;

              const deliveredObject = orderDetails?.statusUpdates?.find(each => each.status === "delivered");
              isReturnEligible = hasDelivered ? calculateReturnEligible(deliveredObject) : false;
            // Condition 3: ordered ? packaged ? cancelled (hide shipped, delivered)
            if (condition6) {
              if (stage.id === "cancelled") {
                return null;
              }
            }
            // Condition 3: ordered ? packaged ? cancelled (hide shipped, delivered)
            else if (condition5) {
              if (
                stage.id === "cancelled" ||
                stage.id === "returnRequested" ||
                stage.id === "returnAccepted" ||
                stage.id === "returned"
              ) {
                return null;
              }
            }

            // Condition 3: ordered ? packaged ? cancelled (hide shipped, delivered)
            else if (condition4) {
              if (
                stage.id === "cancelled" ||
                stage.id === "returnRequested" ||
                stage.id === "returnAccepted" ||
                stage.id === "returned"
              ) {
                return null;
              }
            }
            // Condition 1: ordered  (hide returnRequested, returnAccepted, returned)
            else if (condition1) {
              if (
                stage.id === "returnRequested" ||
                stage.id === "returnAccepted" ||
                stage.id === "returned"
              ) {
                return null;
              }
            }

            // Condition 3: ordered ? packaged ? cancelled (hide shipped, delivered)
            if (condition3) {
              if (
                stage.id === "shipped" ||
                stage.id === "delivered" ||
                stage.id === "returnRequested" ||
                stage.id === "returnAccepted" ||
                stage.id === "returned"
              ) {
                return null;
              }
            }

            // Condition 2: ordered ? packaged ? cancelled (hide shipped, delivered)
            else if (condition2) {
              if (
                stage.id === "packaged" ||
                stage.id === "shipped" ||
                stage.id === "delivered" ||
                stage.id === "returnRequested" ||
                stage.id === "returnAccepted" ||
                stage.id === "returned"
              ) {
                return null;
              }
            }

            else if (hasOrdered && hasPackaged && hasShipped) {
              if (stage.id === "cancelled") {
                return null;
              }
            }

            else if (hasOrdered && hasPackaged && hasShipped && hasDelivered) {
              if (stage.id === "cancelled") {
                return null;
              }
            }

            return (
              <div key={idx}
                className={`flex flex-row items-center lg:flex-col lg:items-start`}
              >
                <div
                  key={stage.id}
                  className={`relative flex items-center font-semibold gap-3`}
                >
                  {/* Status Icon */}
                  {/* <div> */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isCancelled
                      ? "bg-red-500"
                      : condition6
                        ? "bg-yellow-400"
                        : isCompleted
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                  >
                    {isCompleted ? (
                      <span className="text-white font-bold text-lg">
                        &#10003;
                      </span>
                    ) : (
                      <span className="w-4 h-4 bg-white rounded-full" />
                    )}
                  </div>

                  {/* Vertical Line between icons */}
                  {idx <
                    orderStages.length -
                    (condition6 ? 1 : condition5 || condition4 ? 5 : condition1 ? 4 : 1) && (
                      <div
                        className={` absolute left-4 top-8 lg:left-8 lg:top-4 h-16 lg:h-[3px] w-[2px] lg:w-32  ${isCancelled
                          ? "bg-red-500 animate-grow-sm lg:animate-grow"
                          : condition6
                            ? "bg-yellow-400 animate-grow-sm lg:animate-grow"
                            : isCompleted
                              ? "bg-green-500 animate-grow-sm lg:animate-grow"
                              : "bg-gray-300"
                          }`}
                      />
                    )}
                  {/* </div> */}
                </div>
                {/* Status Label */}

                <div className="ml-8 lg:mt-6 lg:ml-0 lg:mr-10">
                  <p
                    className="text-gray-700 font-bold text-md"
                  >
                    {stage.label}
                  </p>

                  {/* Timestamp */}
                  {orderDetails.statusUpdates?.find(
                    (update) => update.status === stage.id
                  )?.updatedAt && (
                      <div className="flex flex-row lg:flex-col">
                        <p className="text-sm text-gray-400">
                          {
                            new Date(
                              orderDetails.statusUpdates.find(
                                (update) => update.status === stage.id
                              ).updatedAt
                            )
                              .toLocaleString()
                              .split(",")[0]
                          }
                          -
                        </p>
                        <p className="text-sm text-gray-400">
                          {
                            new Date(
                              orderDetails.statusUpdates.find(
                                (update) => update.status === stage.id
                              ).updatedAt
                            )
                              .toLocaleString()
                              .split(",")[1]
                          }
                        </p>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border rounded-md shadow-md bg-white  mx-auto mt-6">
        <h2 className="text-lg font-semibold text-gray-700">7 Days Return Policy</h2>
        <p className="text-sm text-gray-500 mt-2">
          You can request a Return within 7 days of delivery. 
        </p>
        <a href="/RefundPolicy" target="_blank" className="text-sm text-blue-600 font-semibold hover:underline">
            Return & Refund Policy
          </a>
      </div>

      <div className="flex justify-between">
        {/* Cancel Order */}
        {(orderDetails.order_status === "ordered" ||
          orderDetails.order_status === "packaged") && (
            <button
              className="bg-red-500 text-white p-2 rounded mt-4"
              onClick={() => openCancelModal(orderDetails.orderId)} // Open cancel modal
            >
              Cancel Order
            </button>
          )}
        {/* Cancel Order Modal */}
        {orderDetails.order_status === "delivered" && isReturnEligible && (
        <div className="flex items-center justify-center">
          <button
            className="bg-yellow-500 text-white p-2 rounded mt-4"
            onClick={handleReturn} // Open cancel modal
          >
            Return Order
          </button>
        </div>
      )}

      </div>
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-medium">Cancel Order</h2>
            <p className="mb-4">Please select a reason for cancellation:</p>

            <select
              className="w-full p-2 mb-4 border rounded"
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                if (e.target.value !== "Other") {
                  setCustomComment(""); // Clear the custom comment if not "Other"
                }
              }}
            >
              <option value="">Select Reason</option>
              {cancelReasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            {/* Conditionally render the textarea for "Other" */}
            {cancelReason === "Other (please specify): _______________" && (
              <textarea
                className="w-full p-2 mb-4 border rounded"
                placeholder="Add your custom comment (optional)"
                value={customComment}
                onChange={(e) => setCustomComment(e.target.value)}
              />
            )}

            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCancelModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                type="button" class="flex items-center rounded-lg bg-red-500 text-white px-4 py-2" disabled={isRequestClick}>
                {isRequestClick && <svg class="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>}
                <span class="font-medium">Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Return Product</h2>
            <Select
              isMulti
              options={orderDetails.productDetails.map((product) => ({
                value: product.productId,
                label: product.productName,
              }))}
              className="w-full p-2 mb-4 border rounded"
              onChange={handleProductChange}
            />

            {/* Text Input */}
            <textarea
              placeholder="Enter return reason"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>

            {/* File Upload */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 mb-4"
            />

            {/* Image Preview */}
            <div className="flex flex-wrap gap-2 mb-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Close
              </button>
              <button
                onClick={handleSubmitReturn}
                type="button" class="flex items-center rounded-lg bg-yellow-500 text-white px-4 py-2" disabled={isRequestClick}>
                {isRequestClick && <svg class="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>}
                <span class="font-medium">Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
