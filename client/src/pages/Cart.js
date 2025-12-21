import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMinus, FiPlus } from "react-icons/fi";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const context = useContext(Context);
  const navigate = useNavigate();
  const loadingCart = new Array(4).fill(null);


  // Fetch cart data
  const fetchData = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const responseData = await response.json();
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
    // console.log(setData);
  };

  // Initial fetch on component mount
  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  // Increase quantity
  const increaseQty = async (id, qty) => {
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty + 1,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        fetchData();
      }
      toast.error(responseData.message);
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  // Decrease quantity
  const decreaseQty = async (id, qty) => {
    if (qty > 1) {
      try {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
          method: SummaryApi.updateCartProduct.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            _id: id,
            quantity: qty - 1,
          }),
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

  // Delete a product from cart
  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        fetchData();
        context.fetchUserAddToCart(); // Update cart context
      }
    } catch (error) {
      console.error("Error deleting cart product:", error);
    }
  };

  // Handle checkout navigation
  // const handleCheckout = () => {
  //   const isAnyProductSoldOut = data.some((product) => product?.productId?.availability === 0);

  //   if (isAnyProductSoldOut){
  //      toast.error("Please Remove Sold Out Product!"); 
  //   } else {
  //       navigate("/checkout");
  //   }

  // };

  // const handleCheckout = () => {
  //   // 1. Sold out check
  //   const isAnyProductSoldOut = data.some(
  //     (product) => product?.productId?.availability === 0
  //   );

  //   if (isAnyProductSoldOut) {
  //     toast.error("Please remove sold out products!");
  //     return;
  //   }

  //   // 2. LOGIN CHECK (MAIN CHANGE)
  //   if (!context?.user?._id) {
  //     toast.warning("Please login to continue checkout");
  //     navigate("/login", {
  //       state: { from: "/checkout" },
  //       replace: true,
  //     });
  //     return;
  //   }

  //   // 3. Proceed
  //   navigate("/checkout");
  // };

  const handleCheckout = async () => {
  // 1. Sold out check
  const isAnyProductSoldOut = data.some(
    (product) => product?.productId?.availability === 0
  );

  if (isAnyProductSoldOut) {
    toast.error("Please remove sold out products!");
    return;
  }

  try {
    // 2. BACKEND AUTH CHECK (COOKIE BASED)
    const res = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: "include",
    });

     if (!res.ok) {
      throw new Error("Not logged in");
    }

    const result = await res.json();

    if (!result?.success || !result?.data?._id) {
      throw new Error("Not logged in");
    }

    // ✅ Logged-in user
    navigate("/checkout");
  } catch (err) {
    toast.warning("Please login to continue checkout");
    navigate("/login", {
      state: { from: "/checkout" },
    });
  }
};



  // Handle delete confirmation prompt
  const handleDeletePrompt = (id) => {
    setSelectedProductId(id);
  };

  const handlePromptYes = () => {
    deleteCartProduct(selectedProductId);
    setSelectedProductId(null);
  };

  const handlePromptNo = () => {
    setSelectedProductId(null);
  };

  const totalQty = data.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = data.reduce(
    (acc, item) => acc + item.quantity * item?.productId?.sellingPrice,
    0
  );

  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {!loading && data.length === 0 && (
          <h1 className="bg-white py-5 font-mediumbold text-brand-textmuted">
            Your Cart is Empty. Please add products to proceed!
          </h1>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4 ">
        <div className="w-full max-w-3xl ">
          {loading
            ? loadingCart.map((_, index) => (
              <div
                key={index}
                className="w-full bg-brand-productCardImageBg h-32 my-2 border border-slate-300 animate-pulse rounded"
              ></div>
            ))
            : data.length > 0 &&
            data.map((product) => (
              <div
                key={product?._id}
                className={`w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr] relative ${selectedProductId === product._id ? "selected" : ""
                  }`}
              >
                <div className="w-32 h-32 bg-brand-productCardImageBg">
                  <img
                    src={product?.productId?.productImage[0]}
                    alt={product?.productId?.altTitle || "product"}
                    title={product?.productId?.altTitle || "product"}
                    className="w-full h-full object-scale-down mix-blend-multiply"
                    // alt={product?.productId?.productName}
                  />
                </div>
                <div className="px-4 py-2 relative">
                  <div
                    className="absolute right-0 text-brand-primary rounded-full p-2 hover:bg-brand-primaryHover hover:text-white cursor-pointer"
                    onClick={() => handleDeletePrompt(product?._id)}
                  >
                    <MdDelete />
                  </div>
                  <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                    {product?.productId?.productName}
                  </h2>
                  <div className="flex justify-between">
                    <p className="capitalize text-brand-textMuted font-medium">
                      {product?.productId?.category}
                    </p>
                    <p className="capitalize text-slate-500 font-medium">
                      <span
                        className={`${product?.productId?.availability > 0
                            ? "text-brand-buttonAccent"
                            : "text-brand-primary"
                          }`}
                      >
                        {product?.productId?.availability > 0
                          ? "In stock"
                          : "Sold out"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-black font-medium text-base">
                      {displayINRCurrency(product?.productId?.sellingPrice)}
                    </p>
                    <p className="text-brand-textMuted font-medium text-lg">
                      {displayINRCurrency(
                        product?.productId?.sellingPrice * product?.quantity
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      className={`h-6 w-6 flex items-center justify-center rounded-full ${product?.quantity <= 1
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-indigo-600 hover:text-white"
                        }`}
                      onClick={() =>
                        decreaseQty(product?._id, product?.quantity)
                      }
                      disabled={product?.quantity <= 1}
                    >
                      <span className="text-lg font-bold"><FiMinus /></span>
                    </button>
                    <p className="text-lg font-semibold">
                      {product?.quantity}
                    </p>
                    <button
                      className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-indigo-600 hover:text-white"
                      onClick={() =>
                        increaseQty(product?._id, product?.quantity)
                      }
                    >
                      <span className="text-lg font-bold"><FiPlus/></span>
                    </button>
                  </div>
                </div>
                {selectedProductId === product._id && (
                  <div className="prompt absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="prompt-inner bg-white p-4 rounded">
                      <h2>Are you sure to delete?</h2>
                      <div className="prompt-btn flex justify-between mt-4">
                        <button
                          className="prompt-yes bg-brand-primary text-white py-1 px-4 rounded hover:bg-brand-primaryHover"
                          onClick={handlePromptYes}
                        >
                          Yes
                        </button>
                        <button
                          className="prompt-no bg-gray-200 py-1 px-4 rounded hover:bg-gray-400"
                          onClick={handlePromptNo}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
        {data.length > 0 && (
          <div className="w-full max-w-sm h-max bg-white border rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <div className="flex justify-between mb-2">
              <h4>Total Quantity:</h4>
              <p>{totalQty}</p>
            </div>
            <div className="flex justify-between mb-2">
              <h5>Subtotal:</h5>
              <p>{displayINRCurrency(totalPrice)}</p>
            </div>
            <button
              className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
