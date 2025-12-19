import React, { useContext, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Lottie from "react-lottie-player";
import animationData from "../assest/animations/payment-done.json";
import SummaryApi from "../common";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaRupeeSign } from "react-icons/fa";
// import axios from "axios";
import Context from '../context'
import { toast } from "react-toastify";
import ROLE from "../common/role";


function CheckoutPage() {
  const user = useSelector(state => state?.user?.user);
  const { fetchUserAddToCart } = useContext(Context)
  const [customerInfo, setCustomerInfo] = useState({
    email: user?.email || "",
    phone: user?.mobile || "",
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
    country: "",
    street: "",
    city: "",
    postalCode: "",
    state: "",
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    country: "",
    street: "",
    city: "",
    postalCode: "",
    state: "",
  });


  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [shippingMessage, setShippingMessage] = useState("");
  const navigate = useNavigate();
  // const [totalPrice, setTotalPrice] = useState(0);
  const [shippingDetailsFilled, setShippingDetailsFilled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentLinkLoading, setPaymentLinkLoading] = useState(false);
  const handleAddressClick = (address) => {
    setCustomerInfo((prevState) => ({
      ...prevState,
      ...address,
      postalCode: address.pinCode
    })); // Update selected address
    setBillingAddress((prevState) => ({
      ...prevState,
      country: address.country,
      street: address.street,
      city: address.city,
      postalCode: address.pinCode,
      state: address.state,
    }));
    setShowModal(false); // Close the modal
  };


  useEffect(() => {
    if (user) {
      // Set the city, state, and postal code based on stored location data
      setCustomerInfo((prevState) => ({
        ...prevState,
        email: user?.email || "",
        phone: user?.mobile || "",
        firstName: user?.name.split(" ")[0] || "",
        lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
        street: user?.address?.street || "",
        country: user?.address?.country || "",
        city: user?.address?.city || "",
        postalCode: user?.address?.pinCode || "",
        state: user?.address?.state || "",
      }));

      setBillingAddress((prevState) => ({
        ...prevState,
        firstName: user?.name.split(" ")[0] || "",
        lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
        street: user?.address?.street || "",
        country: user?.address?.country || "",
        city: user?.address?.city || "",
        postalCode: user?.address?.pinCode || "",
        state: user?.address?.state || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(SummaryApi.addToCartProductView.url, {
          method: SummaryApi.addToCartProductView.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseData = await response.json();

        if (responseData.success) {
          setCartItems(responseData.data);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const isFormComplete = () => {
    const {
      email,
      phone,
      firstName,
      lastName,
      country,
      street,
      city,
      postalCode,
      state,
    } = customerInfo;
    const addressComplete =
      billingSameAsShipping ||
      Object.values(billingAddress).every((field) => field.trim() !== "");
    return (
      [
        email,
        phone,
        firstName,
        lastName,
        country,
        street,
        city,
        postalCode,
        state,
      ].every((field) => field.trim() !== "") && addressComplete
    );
  };

  //  Check if the postal code is valid for Tamil Nadu (typically starts with '6')
  const isTamilNaduPostalCode = (postalCode) => {
    const pin = parseInt(postalCode);

    // Validate that the pin is within Tamil Nadu's postal range
    if (pin >= 600001 && pin <= 669999) {
      // Exclude Pondicherry postal codes (605001 to 605110)
      return !(pin >= 605001 && pin <= 605110);
    }

    // Return false for any pin code outside Tamil Nadu's range
    return false;
  };

  // Check if the postal code is valid for Kerala (starts with '6' but in range 680001 - 689999)
  const isKeralaPostalCode = (postalCode) => {
    const pin = parseInt(postalCode);
    return pin >= 670001 && pin <= 689999; // Kerala's range
  };

  useEffect(() => {
    const { state, postalCode } = customerInfo;

    // Check if shipping details are filled
    const isShippingDetailsFilled =
      state.trim() !== "" &&
      postalCode.trim() !== "" &&
      customerInfo.street.trim() !== "" &&
      customerInfo.city.trim() !== "" &&
      customerInfo.country.trim() !== "";

    setShippingDetailsFilled(isShippingDetailsFilled);

    if (state && postalCode) {
      if (isTamilNaduPostalCode(postalCode)) {
        setShippingCharge(0); // Free shipping for Tamil Nadu
        setShippingMessage("Shipping is available in Tamil Nadu");
      } else if (isKeralaPostalCode(postalCode)) {
        setShippingCharge("Not Available");
        setShippingMessage(
          "Service is currently available only in Tamil Nadu."
        );
      } else {
        setShippingCharge("Not Available");
        setShippingMessage(
          "Service is currently available only in Tamil Nadu."
        );
      }
    } else {
      setShippingMessage("");
    }
  }, []);

const handlePaymentLink = async () => {
  const { postalCode, street } = customerInfo;

  // Validate input
  if (!postalCode || !street) {
    toast.error("Please fill out all shipping details before proceeding.");
    return;
  }

  // Ensure only Tamil Nadu postal codes are allowed
  if (!isTamilNaduPostalCode(postalCode)) {
    toast.error("Shipping is available only in Tamil Nadu.");
    return;
  }

  // Proceed with free shipping
  if (shippingCharge === 0) {
    // OK to proceed
  } else {
    // Fallback in case some logic changes
    toast.error("Invalid shipping configuration.");
    return;
  }

    // Ensure all shipping details are provided
    if (!customerInfo.postalCode || !customerInfo.street) {
      toast.error("Please fill out all shipping details before proceeding.");
      return;
    }

    // Shipping charge checks
    if (shippingCharge === 0) {
      // Free shipping, proceed without alert
    } else if (shippingCharge === "Not Available") {
      toast.error(shippingMessage);
      return;
    } else {
      toast.error(`Shipping charge: ?${shippingCharge}`);
    }         
  setPaymentLinkLoading(true);
  try {
    const billingAddressToSend = billingSameAsShipping
      ? { ...customerInfo }
      : billingAddress;

    const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

    const payload = {
      cartItems,
      customerInfo: {
        ...customerInfo,
        billingAddress: billingAddressToSend,
      },
      billingSameAsShipping,
      shippingOption,
      usePaymentLink: true, // Important!
    };

    const response = await fetch(SummaryApi.payment.url, {
      method: SummaryApi.payment.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success && data.paymentLink) {
      window.open(data.paymentLink, "_blank");
      toast.success("Payment link opened in new tab!");
    } else {
      toast.error(data.message || "Failed to generate payment link.");
    }
  } catch (error) {
    toast.error("Error generating payment link.");
  } finally {
    setPaymentLinkLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all shipping details are provided
    if (!customerInfo.postalCode || !customerInfo.street) {
      toast.error("Please fill out all shipping details before proceeding.");
      return;
    }

    // Shipping charge checks
    if (shippingCharge === 0) {
      // Free shipping, proceed without alert
    } else if (shippingCharge === "Not Available") {
      toast.error(shippingMessage);
      return;
    } else {
      toast.error(`Shipping charge: ?${shippingCharge}`);
    }

    try {
      // const response = await axios.post(
      //   "http://localhost:8080/api/validate-address",
      //   customerInfo
      // );
      

      // Prepare the payload for the payment API
      const billingAddressToSend = billingSameAsShipping
        ? { ...customerInfo }
        : billingAddress;

      // Determine the shipping option name
      const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

      const payload = {
        cartItems,
        customerInfo: {
          ...customerInfo,
          billingAddress: billingAddressToSend,
        },
        billingSameAsShipping,
        shippingOption, // Add the shipping option
      };

      // Send the payload to the payment API
      const paymentResponse = await fetch(SummaryApi.payment.url, {
        method: SummaryApi.payment.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const paymentResponseData = await paymentResponse.json();

      if (paymentResponseData.success) {
        // Razorpay options for initiating the payment
        const options = {
          key: "rzp_live_dEoDcnBwCOkfCt", // Razorpay Live key
          //key: "rzp_test_G2fioibkS2JYpg", // Razorpay test key
          amount: totalPrice * 100, // Amount in paise (Razorpay expects paise)
          currency: "INR",
          name: "Relda India",
          description: "e-commerce",
          image: "/client/src/assest/banner/logo.png",
          order_id: paymentResponseData.orderId,
          handler: async function (response) {
            // Handle Razorpay payment response
            const paymentMethod =
              response.payment_method_type || response.payment_mode || "default";
            setPaymentLoading(true);
            const paymentVerification = await fetch(SummaryApi.verpay.url, {
              method: SummaryApi.verpay.method,
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                paymentMethod,
                cartItems,
                customerInfo,
              }),
            });            

            const paymentVerificationData = await paymentVerification.json();

            if (paymentVerificationData.success) {
              
              toast.success("Payment successful!");
              navigate("/success"); // Redirect to success page
              fetchUserAddToCart();
            } else {
              toast.error(
                "Payment verification failed. Please contact support."
              );
              navigate("/cancel"); // Redirect to failure page
            }
          },
          prefill: {
            name: customerInfo.firstName + " " + customerInfo.lastName,
            email: customerInfo.email,
            contact: customerInfo.phone,
          },
          notes: {
            address: customerInfo.street,
          },
        };

        // Open Razorpay payment modal
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        setPaymentLoading(false);
        throw new Error("Failed to create Razorpay order");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error with payment processing. Please try again later.");
      setPaymentLoading(false);
    }
  };

  // const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item?.productId?.sellingPrice, 0);
  // const shippingCharge = isTamilNaduPostalCode(customerInfo.postalCode) ? 0 : 'Not Available';
  // Calculate the total amount (including shipping charge if applicable)
  // const totalAmount = totalPrice + (shippingCharge === 0 ? 0 : shippingCharge || 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item?.productId?.sellingPrice,
    0
  );

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Form Fields */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              value={customerInfo.email}
              name="email"
              className="border p-2 rounded-md"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              onChange={handleChange}
              value={customerInfo.phone}
              name="phone"
              className="border p-2 rounded-md"
              required
            />
          </div>

          <div className="mt-6">
            <div className="flex items-end mb-4">
              <h2 className="text-2xl font-bold mr-2">Shipping Address</h2>
              <button className="text-blue-600 hover:underline" 
              onClick={() => setShowModal(true)}>Change</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={customerInfo.firstName}
                onChange={handleChange}
                className="border p-2"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={customerInfo.lastName}
                onChange={handleChange}
                className="border p-2"
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={customerInfo.country}
                onChange={handleChange}
                className="border p-2"
                required
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={customerInfo.street}
                onChange={handleChange}
                className="border p-2"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="District"
                value={customerInfo.city}
                onChange={handleChange}
                className="border p-2"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={customerInfo.state}
                onChange={handleChange}
                className="border p-2"
                required
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal/Zip Code"
                value={customerInfo.postalCode}
                onChange={handleChange}
                className="border p-2"
                required
              />
            </div>
            {/* Shipping Message (only after shipping details are filled) */}
            {shippingDetailsFilled && (
              <div
                className={`text-sm ${
                  shippingCharge === 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                <p>{shippingMessage}</p>
              </div>
            )}

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  className="mr-2"
                />
                <span>Billing address same as shipping</span>
              </label>
            </div>
            {!billingSameAsShipping && (
              <>
                <h2 className="text-2xl font-bold mt-6 mb-4">
                  Billing Address
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={billingAddress.firstName}
                    onChange={handleBillingChange}
                    className="border p-2 capitalize"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={billingAddress.lastName}
                    onChange={handleBillingChange}
                    className="border p-2"
                    required
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={billingAddress.country}
                    onChange={handleBillingChange}
                    className="border p-2"
                    required
                  />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={billingAddress.street}
                    onChange={handleBillingChange}
                    className="border p-2"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={billingAddress.city}
                    onChange={handleBillingChange}
                    className="border p-2"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={billingAddress.state}
                    onChange={handleBillingChange}
                    className="border p-2"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal/Zip Code"
                    value={billingAddress.postalCode}
                    onChange={handleBillingChange}
                    className="border p-2"
                    required
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column - Order Details & Checkout Button */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="bg-white border rounded-md p-4 shadow-md">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="bg-white p-4 rounded-md shadow-lg mb-4">
                  <h2 className="font-bold text-lg mb-4">Your Order</h2>
                  {cartItems.map((item, index) => (
                    <div key={`item.id-${index}`} className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-bold mb-0">
                          {item.productId.productName}
                        </h3>
                        <div className="w-32 h-32">
                          <img
                            src={item.productId.productImage[0]}
                            className="mt-0 w-full h-full object-scale-down mix-blend-multiply"
                            alt={item.productId.altTitle || "product"}
                            title={item.productId.altTitle || "product"}
                          />
                        </div>
                        <p className="font-bold ">Quantity: {item.quantity}</p>
                      </div>
                      {/* <p className="font-bold "> */}
                      {/* <FaRupeeSign />
                      {item.productId.sellingPrice} <span className="text-sm">each</span>
                      </p> */}
                      <p className="font-bold flex items-center ">
                        <FaRupeeSign />
                        {item.quantity * item.productId.sellingPrice}
                      </p>
                    </div>
                  ))}

                  <div className="mt-2">
                    <a href="/cart" className="text-blue-500 flex items-center">
                      <FaEdit className="mr-1" /> Edit Cart
                    </a>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p className="flex items-center space-x-1 ">
                      <span>
                        <FaRupeeSign className="mr-1" />
                      </span>
                      <span> {totalPrice}</span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>{shippingCharge === 0 ? "Free" : shippingCharge}</p>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between font-bold">
                    <p>Order Total</p>
                    <p className="flex items-center">
                      <FaRupeeSign className="mr-1" />
                      {totalPrice}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-6 bg-blue-500 text-white p-2 rounded-md w-full"
                  disabled={!isFormComplete()}
                >
                  Checkout
                </button>

		{user?.role === ROLE.MANAGESALES             && (
      <button
        onClick={handlePaymentLink}
        className="bg-green-600 text-white p-2 rounded-md w-full mt-2"
        disabled={!isFormComplete() || paymentLinkLoading}
      >
        {paymentLinkLoading ? "Generating Link..." : "Pay via Payment Link"}
      </button>
                )}

                {paymentLoading && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center text-center shadow-lg">
                      {/* Lottie Animation */}
                      <Lottie
                        loop
                        animationData={animationData}
                        play
                        style={{ width: 150, height: 150 }}
                      />

                      {/* Text */}
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Please sit back, your payment is processing
                      </h2>
                      <p className="text-gray-600">
                        This may take a few moments...
                      </p>
                    </div>
                  </div>
                )}

                {/* Modal for Address List */}
                {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                      <h2 className="text-lg font-semibold mb-4">Select an Address</h2>
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {user?.addresses.length > 0 ? (user?.addresses.map((address) => (
                          <div
                            key={address._id}
                            className="border rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleAddressClick(address)}
                          >
                            <p className="text-gray-700">{address.street}</p>
                            <p className="text-gray-700">
                              {address.city}, {address.state} - {address.pinCode}
                            </p>
                            {address.default && (
                              <span className="text-green-600 text-sm font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                        ))) : (<p>Yet to add address</p>)}
                      </div>
                      <button
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default CheckoutPage;

