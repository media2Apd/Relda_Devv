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
        className="relative border bg-gray-50 rounded-lg p-4 shadow-sm cursor-pointer flex flex-col md:flex-row"
      >
        {/* Products within the order */}
        <div className="space-y-4 flex-1">
          {order.productDetails.map((product, index) => (
            <div
              key={index}
              className="flex items-start pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
            >
              <img
                src={product.productImage}
                alt={product.altTitle || "product"}
                title={product.altTitle || "product"}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="ml-2 sm:ml-4 flex-1">
                <h2 className="text-red-600 text-md font-semibold uppercase">
                  {product.brandName}
                </h2>
                <p className="text-sm text-gray-900 text-lg font-bold">
                  {product.productName}
                </p>
                <p className="text-sm text-gray-600 text-lg font-bold">
                  OrderId: {order.orderId}
                </p>
                <div className="flex flex-col md:flex-row max-w-xs justify-between">
                  <p className="text-sm text-gray-500 font-semibold">
                    Category: {product.category}
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">
                    Quantity:{" "}
                    <span className="text-sm text-green-500 font-semibold">
                      {product.quantity}
                    </span>
                  </p>
                </div>
                <div className="text-sm text-red-600 font-semibold">
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

        {/* Order-level details */}
        <div className="mt-2 ml-24 md:mt-0 md:ml-8 md:absolute md:top-1/2 md:right-4 md:transform md:-translate-y-1/2 flex flex-col">
          <h1 className="text-md text-orange-600 font-semibold">
            Items:{" "}
            {order.productDetails.reduce(
              (totalItems, product) => totalItems + product.quantity,
              0
            )}
          </h1>
          <p className="text-sm text-gray-600 font-semibold">
            <span className="capitalize">{order.order_status}</span> on{" "}
            {moment(order.statusUpdatedAt).format("LL")}
          </p>
          <p className="text-sm text-gray-600 font-semibold">
            {moment(order.statusUpdatedAt).format("hh:mm A")}
          </p>
          <p
            className={`text-sm font-semibold capitalize ${
              order.order_status === "delivered"
                ? "text-green-500"
                : order.order_status === "cancelled"
                ? "text-red-500"
                : order.order_status === "returnRequested" || order.order_status === "returnAccepted" || order.order_status === "returned"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            <span className="text-gray-600">Your product</span> {order.order_status}
          </p>
          
        </div>
      </div>
    ))}
  </div>
</div>


  );
};

export default OrderPage;