// import React, { useContext, useState, useEffect } from "react";
// import { useSelector } from 'react-redux';
// import Lottie from "react-lottie-player";
// import animationData from "../assest/animations/payment-done.json";
// import SummaryApi from "../common";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaRupeeSign } from "react-icons/fa";
// // import axios from "axios";
// import Context from '../context'
// import { toast } from "react-toastify";
// import ROLE from "../common/role";


// function CheckoutPage() {
//   const user = useSelector(state => state?.user?.user);
//   const { fetchUserAddToCart } = useContext(Context)
//   const navigate = useNavigate();


//   // useEffect(() => {
//   //   if (!user?._id) {
//   //     toast.warning("Please login to continue checkout");
//   //     navigate("/login", { state: { from: "/checkout" } });
//   //   }
//   // }, [user, navigate]);

//   const [customerInfo, setCustomerInfo] = useState({
//     email: user?.email || "",
//     phone: user?.mobile || "",
//     firstName: user?.name.split(" ")[0] || "",
//     lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });
//   const [cashOnHand, setCashOnHand] = useState(false);

//   const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
//   const [billingAddress, setBillingAddress] = useState({
//     firstName: "",
//     lastName: "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });


//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [shippingCharge, setShippingCharge] = useState(0);
//   const [shippingMessage, setShippingMessage] = useState("");
//   // const [totalPrice, setTotalPrice] = useState(0);
//   const [shippingDetailsFilled, setShippingDetailsFilled] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [paymentLinkLoading, setPaymentLinkLoading] = useState(false);
//   const handleAddressClick = (address) => {
//     setCustomerInfo((prevState) => ({
//       ...prevState,
//       ...address,
//       postalCode: address.pinCode
//     })); // Update selected address
//     setBillingAddress((prevState) => ({
//       ...prevState,
//       country: address.country,
//       street: address.street,
//       city: address.city,
//       postalCode: address.pinCode,
//       state: address.state,
//     }));
//     setShowModal(false); // Close the modal
//   };


//   useEffect(() => {
//     if (user) {
//       // Set the city, state, and postal code based on stored location data
//       setCustomerInfo((prevState) => ({
//         ...prevState,
//         email: user?.email || "",
//         phone: user?.mobile || "",
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));

//       setBillingAddress((prevState) => ({
//         ...prevState,
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(SummaryApi.addToCartProductView.url, {
//           method: SummaryApi.addToCartProductView.method,
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.status === 401) {
//         toast.warning("Please login to continue checkout");
//         navigate("/login", { state: { from: "/checkout" } });
//         return;
//       }

//         const responseData = await response.json();

//         if (responseData.success) {
//           setCartItems(responseData.data);
//           if (responseData.data.length === 0) {
//             toast.info("Your cart is empty");
//             navigate("/cart");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching cart data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBillingChange = (e) => {
//     const { name, value } = e.target;
//     setBillingAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const isFormComplete = () => {
//     const {
//       email,
//       phone,
//       firstName,
//       lastName,
//       country,
//       street,
//       city,
//       postalCode,
//       state,
//     } = customerInfo;
//     const addressComplete =
//       billingSameAsShipping ||
//       Object.values(billingAddress).every((field) => field.trim() !== "");
//     return (
//       [
//         email,
//         phone,
//         firstName,
//         lastName,
//         country,
//         street,
//         city,
//         postalCode,
//         state,
//       ].every((field) => field.trim() !== "") && addressComplete
//     );
//   };

//   //  Check if the postal code is valid for Tamil Nadu (typically starts with '6')
//   const isTamilNaduPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);

//     // Validate that the pin is within Tamil Nadu's postal range
//     if (pin >= 600001 && pin <= 669999) {
//       // Exclude Pondicherry postal codes (605001 to 605110)
//       return !(pin >= 605001 && pin <= 605110);
//     }

//     // Return false for any pin code outside Tamil Nadu's range
//     return false;
//   };

//   // Check if the postal code is valid for Kerala (starts with '6' but in range 680001 - 689999)
//   const isKeralaPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);
//     return pin >= 670001 && pin <= 689999; // Kerala's range
//   };

//   useEffect(() => {
//     const { state, postalCode } = customerInfo;

//     // Check if shipping details are filled
//     const isShippingDetailsFilled =
//       state.trim() !== "" &&
//       postalCode.trim() !== "" &&
//       customerInfo.street.trim() !== "" &&
//       customerInfo.city.trim() !== "" &&
//       customerInfo.country.trim() !== "";

//     setShippingDetailsFilled(isShippingDetailsFilled);

//     if (state && postalCode) {
//       if (isTamilNaduPostalCode(postalCode)) {
//         setShippingCharge(0); // Free shipping for Tamil Nadu
//         setShippingMessage("Shipping is available in Tamil Nadu");
//       } else if (isKeralaPostalCode(postalCode)) {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       } else {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       }
//     } else {
//       setShippingMessage("");
//     }
//   }, []);

// const handlePaymentLink = async () => {
//   const { postalCode, street } = customerInfo;

//   // Validate input
//   if (!postalCode || !street) {
//     toast.error("Please fill out all shipping details before proceeding.");
//     return;
//   }

//   // Ensure only Tamil Nadu postal codes are allowed
//   if (!isTamilNaduPostalCode(postalCode)) {
//     toast.error("Shipping is available only in Tamil Nadu.");
//     return;
//   }

//   // Proceed with free shipping
//   if (shippingCharge === 0) {
//     // OK to proceed
//   } else {
//     // Fallback in case some logic changes
//     toast.error("Invalid shipping configuration.");
//     return;
//   }

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }         
//   setPaymentLinkLoading(true);
//   try {
//     const billingAddressToSend = billingSameAsShipping
//       ? { ...customerInfo }
//       : billingAddress;

//     const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//     const payload = {
//       cartItems,
//       customerInfo: {
//         ...customerInfo,
//         billingAddress: billingAddressToSend,
//       },
//       billingSameAsShipping,
//       shippingOption,
//       usePaymentLink: true, // Important!
//     };

//     const response = await fetch(SummaryApi.payment.url, {
//       method: SummaryApi.payment.method,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     if (data.success && data.paymentLink) {
//       window.open(data.paymentLink, "_blank");
//       toast.success("Payment link opened in new tab!");
//     } else {
//       toast.error(data.message || "Failed to generate payment link.");
//     }
//   } catch (error) {
//     toast.error("Error generating payment link.");
//   } finally {
//     setPaymentLinkLoading(false);
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }
// // CASH ON HAND FLOW
//   if (cashOnHand && user?.role === ROLE.MANAGESALES) {
//     try {
//       const payload = {
//         cartItems,
//         customerInfo,
//         billingSameAsShipping,
//         paymentMode: "CASH_ON_HAND"
//       };

//       const response = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Order confirmed (Cash on Hand)");
//         fetchUserAddToCart();
//         navigate("/success");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to confirm cash order");
//     }
//     return; // 🚨 STOP Razorpay
//   }

//     try {
//       // const response = await axios.post(
//       //   "http://localhost:8080/api/validate-address",
//       //   customerInfo
//       // );
      

//       // Prepare the payload for the payment API
//       const billingAddressToSend = billingSameAsShipping
//         ? { ...customerInfo }
//         : billingAddress;

//       // Determine the shipping option name
//       const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//       const payload = {
//         cartItems,
//         customerInfo: {
//           ...customerInfo,
//           billingAddress: billingAddressToSend,
//         },
//         billingSameAsShipping,
//         shippingOption, // Add the shipping option
//       };

//       // Send the payload to the payment API
//       const paymentResponse = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const paymentResponseData = await paymentResponse.json();

//       if (paymentResponseData.success) {
//         // Razorpay options for initiating the payment
//         const options = {
//           // key: "rzp_live_dEoDcnBwCOkfCt", // Razorpay Live key
//           key: "rzp_test_66VslSnaYXyl0i", // Razorpay test key
//           amount: totalPrice * 100, // Amount in paise (Razorpay expects paise)
//           currency: "INR",
//           name: "Relda India",
//           description: "e-commerce",
//           image: "/client/src/assest/banner/logo.png",
//           order_id: paymentResponseData.orderId,
//           handler: async function (response) {
//             // Handle Razorpay payment response
//             const paymentMethod =
//               response.payment_method_type || response.payment_mode || "default";
//             setPaymentLoading(true);
//             const paymentVerification = await fetch(SummaryApi.verpay.url, {
//               method: SummaryApi.verpay.method,
//               credentials: "include",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpaySignature: response.razorpay_signature,
//                 paymentMethod,
//                 cartItems,
//                 customerInfo,
//               }),
//             });            

//             const paymentVerificationData = await paymentVerification.json();

//             if (paymentVerificationData.success) {
              
//               toast.success("Payment successful!");
//               navigate("/success"); // Redirect to success page
//               fetchUserAddToCart();
//             } else {
//               toast.error(
//                 "Payment verification failed. Please contact support."
//               );
//               navigate("/cancel"); // Redirect to failure page
//             }
//           },
//           prefill: {
//             name: customerInfo.firstName + " " + customerInfo.lastName,
//             email: customerInfo.email,
//             contact: customerInfo.phone,
//           },
//           notes: {
//             address: customerInfo.street,
//           },
//         };

//         // Open Razorpay payment modal
//         const rzp1 = new window.Razorpay(options);
//         rzp1.open();
//       } else {
//         setPaymentLoading(false);
//         throw new Error("Failed to create Razorpay order");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Error with payment processing. Please try again later.");
//       setPaymentLoading(false);
//     }
//   };

//   // const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item?.productId?.sellingPrice, 0);
//   // const shippingCharge = isTamilNaduPostalCode(customerInfo.postalCode) ? 0 : 'Not Available';
//   // Calculate the total amount (including shipping charge if applicable)
//   // const totalAmount = totalPrice + (shippingCharge === 0 ? 0 : shippingCharge || 0);
//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.quantity * item?.productId?.sellingPrice,
//     0
//   );

//   return (
//     <div className="container mx-auto p-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Left Column - Form Fields */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="email"
//               placeholder="Email Address"
//               onChange={handleChange}
//               value={customerInfo.email}
//               name="email"
//               className="border p-2 rounded-md"
//               required
//             />
//             <input
//               type="tel"
//               placeholder="Phone"
//               onChange={handleChange}
//               value={customerInfo.phone}
//               name="phone"
//               className="border p-2 rounded-md"
//               required
//             />
//           </div>

//           <div className="mt-6">
//             <div className="flex items-end mb-4">
//               <h2 className="text-2xl font-bold mr-2">Shipping Address</h2>
//               <button className="text-blue-600 hover:underline" 
//               onClick={() => setShowModal(true)}>Change</button>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={customerInfo.firstName}
//                 onChange={handleChange}
//                 className="border p-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={customerInfo.lastName}
//                 onChange={handleChange}
//                 className="border p-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 value={customerInfo.country}
//                 onChange={handleChange}
//                 className="border p-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="street"
//                 placeholder="Street Address"
//                 value={customerInfo.street}
//                 onChange={handleChange}
//                 className="border p-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="District"
//                 value={customerInfo.city}
//                 onChange={handleChange}
//                 className="border p-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 value={customerInfo.state}
//                 onChange={handleChange}
//                 className="border p-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="postalCode"
//                 placeholder="Postal/Zip Code"
//                 value={customerInfo.postalCode}
//                 onChange={handleChange}
//                 className="border p-2"
//                 required
//               />
//             </div>
//             {/* Shipping Message (only after shipping details are filled) */}
//             {shippingDetailsFilled && (
//               <div
//                 className={`text-sm ${
//                   shippingCharge === 0 ? "text-green-600" : "text-red-600"
//                 }`}
//               >
//                 <p>{shippingMessage}</p>
//               </div>
//             )}

//             <div className="mt-4">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={billingSameAsShipping}
//                   onChange={(e) => setBillingSameAsShipping(e.target.checked)}
//                   className="mr-2"
//                 />
//                 <span>Billing address same as shipping</span>
//               </label>
//             </div>
//             {!billingSameAsShipping && (
//               <>
//                 <h2 className="text-2xl font-bold mt-6 mb-4">
//                   Billing Address
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="First Name"
//                     value={billingAddress.firstName}
//                     onChange={handleBillingChange}
//                     className="border p-2 capitalize"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Last Name"
//                     value={billingAddress.lastName}
//                     onChange={handleBillingChange}
//                     className="border p-2"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="country"
//                     placeholder="Country"
//                     value={billingAddress.country}
//                     onChange={handleBillingChange}
//                     className="border p-2"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="street"
//                     placeholder="Street Address"
//                     value={billingAddress.street}
//                     onChange={handleBillingChange}
//                     className="border p-2"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="City"
//                     value={billingAddress.city}
//                     onChange={handleBillingChange}
//                     className="border p-2"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="state"
//                     placeholder="State"
//                     value={billingAddress.state}
//                     onChange={handleBillingChange}
//                     className="border p-2"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="postalCode"
//                     placeholder="Postal/Zip Code"
//                     value={billingAddress.postalCode}
//                     onChange={handleBillingChange}
//                     className="border p-2"
//                     required
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Order Details & Checkout Button */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//           <div className="bg-white border rounded-md p-4 shadow-md">
//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               <>
//                 <div className="bg-white p-4 rounded-md shadow-lg mb-4">
//                   <h2 className="font-bold text-lg mb-4">Your Order</h2>
//                   {cartItems.map((item, index) => (
//                     <div key={`item.id-${index}`} className="flex justify-between mb-2">
//                       <div>
//                         <h3 className="font-bold mb-0">
//                           {item.productId.productName}
//                         </h3>
//                         <div className="w-32 h-32">
//                           <img
//                             src={item.productId.productImage[0]}
//                             className="mt-0 w-full h-full object-scale-down mix-blend-multiply"
//                             alt={item.productId.altTitle || "product"}
//                             title={item.productId.altTitle || "product"}
//                           />
//                         </div>
//                         <p className="font-bold ">Quantity: {item.quantity}</p>
//                       </div>
//                       {/* <p className="font-bold "> */}
//                       {/* <FaRupeeSign />
//                       {item.productId.sellingPrice} <span className="text-sm">each</span>
//                       </p> */}
//                       <p className="font-bold flex items-center ">
//                         <FaRupeeSign />
//                         {item.quantity * item.productId.sellingPrice}
//                       </p>
//                     </div>
//                   ))}

//                   <div className="mt-2">
//                     <a href="/cart" className="text-blue-500 flex items-center">
//                       <FaEdit className="mr-1" /> Edit Cart
//                     </a>
//                   </div>
//                   <hr className="my-4" />
//                   <div className="flex justify-between">
//                     <p>Subtotal</p>
//                     <p className="flex items-center space-x-1 ">
//                       <span>
//                         <FaRupeeSign className="mr-1" />
//                       </span>
//                       <span> {totalPrice}</span>
//                     </p>
//                   </div>
//                   <div className="flex justify-between">
//                     <p>Shipping</p>
//                     <p>{shippingCharge === 0 ? "Free" : shippingCharge}</p>
//                   </div>
//                   <hr className="my-4" />
//                   <div className="flex justify-between font-bold">
//                     <p>Order Total</p>
//                     <p className="flex items-center">
//                       <FaRupeeSign className="mr-1" />
//                       {totalPrice}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleSubmit}
//                   className="mt-6 bg-blue-500 text-white p-2 rounded-md w-full"
//                   disabled={!isFormComplete()}
//                 >
//                   Checkout
//                 </button>

// 		{user?.role === ROLE.MANAGESALES             && (
//       <button
//         onClick={handlePaymentLink}
//         className="bg-green-600 text-white p-2 rounded-md w-full mt-2"
//         disabled={!isFormComplete() || paymentLinkLoading}
//       >
//         {paymentLinkLoading ? "Generating Link..." : "Pay via Payment Link"}
//       </button>
//                 )}

//                 {user?.role === ROLE.MANAGESALES && (
//   <div className="flex items-center mt-4">
//     <input
//       type="checkbox"
//       id="cashOnHand"
//       checked={cashOnHand}
//       onChange={(e) => setCashOnHand(e.target.checked)}
//       className="mr-2"
//     />
//     <label htmlFor="cashOnHand" className="font-medium">
//       Cash on Hand
//     </label>
//   </div>
// )}


//                 {paymentLoading && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white rounded-lg p-8 flex flex-col items-center text-center shadow-lg">
//                       {/* Lottie Animation */}
//                       <Lottie
//                         loop
//                         animationData={animationData}
//                         play
//                         style={{ width: 150, height: 150 }}
//                       />

//                       {/* Text */}
//                       <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                         Please sit back, your payment is processing
//                       </h2>
//                       <p className="text-gray-600">
//                         This may take a few moments...
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Modal for Address List */}
//                 {showModal && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
//                       <h2 className="text-lg font-semibold mb-4">Select an Address</h2>
//                       <div className="space-y-4 max-h-64 overflow-y-auto">
//                         {user?.addresses.length > 0 ? (user?.addresses.map((address) => (
//                           <div
//                             key={address._id}
//                             className="border rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
//                             onClick={() => handleAddressClick(address)}
//                           >
//                             <p className="text-gray-700">{address.street}</p>
//                             <p className="text-gray-700">
//                               {address.city}, {address.state} - {address.pinCode}
//                             </p>
//                             {address.default && (
//                               <span className="text-green-600 text-sm font-semibold">
//                                 Default
//                               </span>
//                             )}
//                           </div>
//                         ))) : (<p>Yet to add address</p>)}
//                       </div>
//                       <button
//                         className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
//                         onClick={() => setShowModal(false)}
//                       >
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default CheckoutPage;

// import React, { useContext, useState, useEffect } from "react";
// import { useSelector } from 'react-redux';
// import Lottie from "react-lottie-player";
// import animationData from "../assest/animations/payment-done.json";
// import SummaryApi from "../common";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaRupeeSign } from "react-icons/fa";
// // import axios from "axios";
// import Context from '../context'
// import { toast } from "react-toastify";
// import ROLE from "../common/role";


// function CheckoutPage() {
//   const user = useSelector(state => state?.user?.user);
//   const { fetchUserAddToCart } = useContext(Context)
//   const navigate = useNavigate();


//   // useEffect(() => {
//   //   if (!user?._id) {
//   //     toast.warning("Please login to continue checkout");
//   //     navigate("/login", { state: { from: "/checkout" } });
//   //   }
//   // }, [user, navigate]);

//   const [customerInfo, setCustomerInfo] = useState({
//     email: user?.email || "",
//     phone: user?.mobile || "",
//     firstName: user?.name.split(" ")[0] || "",
//     lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });
//   const [cashOnHand, setCashOnHand] = useState(false);

//   const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
//   const [billingAddress, setBillingAddress] = useState({
//     firstName: "",
//     lastName: "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });


//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [shippingCharge, setShippingCharge] = useState(0);
//   const [shippingMessage, setShippingMessage] = useState("");
//   // const [totalPrice, setTotalPrice] = useState(0);
//   const [shippingDetailsFilled, setShippingDetailsFilled] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [paymentLinkLoading, setPaymentLinkLoading] = useState(false);
//   const handleAddressClick = (address) => {
//     setCustomerInfo((prevState) => ({
//       ...prevState,
//       ...address,
//       postalCode: address.pinCode
//     })); // Update selected address
//     setBillingAddress((prevState) => ({
//       ...prevState,
//       country: address.country,
//       street: address.street,
//       city: address.city,
//       postalCode: address.pinCode,
//       state: address.state,
//     }));
//     setShowModal(false); // Close the modal
//   };


//   useEffect(() => {
//     if (user) {
//       // Set the city, state, and postal code based on stored location data
//       setCustomerInfo((prevState) => ({
//         ...prevState,
//         email: user?.email || "",
//         phone: user?.mobile || "",
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));

//       setBillingAddress((prevState) => ({
//         ...prevState,
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(SummaryApi.addToCartProductView.url, {
//           method: SummaryApi.addToCartProductView.method,
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.status === 401) {
//         toast.warning("Please login to continue checkout");
//         navigate("/login", { state: { from: "/checkout" } });
//         return;
//       }

//         const responseData = await response.json();

//         if (responseData.success) {
//           setCartItems(responseData.data);
//           if (responseData.data.length === 0) {
//             toast.info("Your cart is empty");
//             navigate("/cart");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching cart data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBillingChange = (e) => {
//     const { name, value } = e.target;
//     setBillingAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const isFormComplete = () => {
//     const {
//       email,
//       phone,
//       firstName,
//       lastName,
//       country,
//       street,
//       city,
//       postalCode,
//       state,
//     } = customerInfo;
//     const addressComplete =
//       billingSameAsShipping ||
//       Object.values(billingAddress).every((field) => field.trim() !== "");
//     return (
//       [
//         email,
//         phone,
//         firstName,
//         lastName,
//         country,
//         street,
//         city,
//         postalCode,
//         state,
//       ].every((field) => field.trim() !== "") && addressComplete
//     );
//   };

//   //  Check if the postal code is valid for Tamil Nadu (typically starts with '6')
//   const isTamilNaduPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);

//     // Validate that the pin is within Tamil Nadu's postal range
//     if (pin >= 600001 && pin <= 669999) {
//       // Exclude Pondicherry postal codes (605001 to 605110)
//       return !(pin >= 605001 && pin <= 605110);
//     }

//     // Return false for any pin code outside Tamil Nadu's range
//     return false;
//   };

//   // Check if the postal code is valid for Kerala (starts with '6' but in range 680001 - 689999)
//   const isKeralaPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);
//     return pin >= 670001 && pin <= 689999; // Kerala's range
//   };

//   useEffect(() => {
//     const { state, postalCode } = customerInfo;

//     // Check if shipping details are filled
//     const isShippingDetailsFilled =
//       state.trim() !== "" &&
//       postalCode.trim() !== "" &&
//       customerInfo.street.trim() !== "" &&
//       customerInfo.city.trim() !== "" &&
//       customerInfo.country.trim() !== "";

//     setShippingDetailsFilled(isShippingDetailsFilled);

//     if (state && postalCode) {
//       if (isTamilNaduPostalCode(postalCode)) {
//         setShippingCharge(0); // Free shipping for Tamil Nadu
//         setShippingMessage("Shipping is available in Tamil Nadu");
//       } else if (isKeralaPostalCode(postalCode)) {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       } else {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       }
//     } else {
//       setShippingMessage("");
//     }
//   }, [ customerInfo]);

// const handlePaymentLink = async () => {
//   const { postalCode, street } = customerInfo;

//   // Validate input
//   if (!postalCode || !street) {
//     toast.error("Please fill out all shipping details before proceeding.");
//     return;
//   }

//   // Ensure only Tamil Nadu postal codes are allowed
//   if (!isTamilNaduPostalCode(postalCode)) {
//     toast.error("Shipping is available only in Tamil Nadu.");
//     return;
//   }

//   // Proceed with free shipping
//   if (shippingCharge === 0) {
//     // OK to proceed
//   } else {
//     // Fallback in case some logic changes
//     toast.error("Invalid shipping configuration.");
//     return;
//   }

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }         
//   setPaymentLinkLoading(true);
//   try {
//     const billingAddressToSend = billingSameAsShipping
//       ? { ...customerInfo }
//       : billingAddress;

//     const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//     const payload = {
//       cartItems,
//       customerInfo: {
//         ...customerInfo,
//         billingAddress: billingAddressToSend,
//       },
//       billingSameAsShipping,
//       shippingOption,
//       usePaymentLink: true, // Important!
//     };

//     const response = await fetch(SummaryApi.payment.url, {
//       method: SummaryApi.payment.method,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     if (data.success && data.paymentLink) {
//       window.open(data.paymentLink, "_blank");
//       toast.success("Payment link opened in new tab!");
//     } else {
//       toast.error(data.message || "Failed to generate payment link.");
//     }
//   } catch (error) {
//     toast.error("Error generating payment link.");
//   } finally {
//     setPaymentLinkLoading(false);
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }
// // CASH ON HAND FLOW
//   if (cashOnHand && user?.role === ROLE.MANAGESALES) {
//     try {
//       const payload = {
//         cartItems,
//         customerInfo,
//         billingSameAsShipping,
//         paymentMode: "CASH_ON_HAND"
//       };

//       const response = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Order confirmed (Cash on Hand)");
//         fetchUserAddToCart();
//         navigate("/success");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to confirm cash order");
//     }
//     return; // 🚨 STOP Razorpay
//   }

//     try {
//       // const response = await axios.post(
//       //   "http://localhost:8080/api/validate-address",
//       //   customerInfo
//       // );
      

//       // Prepare the payload for the payment API
//       const billingAddressToSend = billingSameAsShipping
//         ? { ...customerInfo }
//         : billingAddress;

//       // Determine the shipping option name
//       const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//       const payload = {
//         cartItems,
//         customerInfo: {
//           ...customerInfo,
//           billingAddress: billingAddressToSend,
//         },
//         billingSameAsShipping,
//         shippingOption, // Add the shipping option
//       };

//       // Send the payload to the payment API
//       const paymentResponse = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const paymentResponseData = await paymentResponse.json();

//       if (paymentResponseData.success) {
//         // Razorpay options for initiating the payment
//         const options = {
//           key: "rzp_live_dEoDcnBwCOkfCt", // Razorpay Live key
//           // key: "rzp_test_66VslSnaYXyl0i", // Razorpay test key
//           amount: totalPrice * 100, // Amount in paise (Razorpay expects paise)
//           currency: "INR",
//           name: "Relda India",
//           description: "e-commerce",
//           image: "/client/src/assest/banner/logo.png",
//           order_id: paymentResponseData.orderId,
//           handler: async function (response) {
//             // Handle Razorpay payment response
//             const paymentMethod =
//               response.payment_method_type || response.payment_mode || "default";
//             setPaymentLoading(true);
//             const paymentVerification = await fetch(SummaryApi.verpay.url, {
//               method: SummaryApi.verpay.method,
//               credentials: "include",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpaySignature: response.razorpay_signature,
//                 paymentMethod,
//                 cartItems,
//                 customerInfo,
//               }),
//             });            

//             const paymentVerificationData = await paymentVerification.json();

//             if (paymentVerificationData.success) {
              
//               toast.success("Payment successful!");
//               navigate("/success"); // Redirect to success page
//               fetchUserAddToCart();
//             } else {
//               toast.error(
//                 "Payment verification failed. Please contact support."
//               );
//               navigate("/cancel"); // Redirect to failure page
//             }
//           },
//           prefill: {
//             name: customerInfo.firstName + " " + customerInfo.lastName,
//             email: customerInfo.email,
//             contact: customerInfo.phone,
//           },
//           notes: {
//             address: customerInfo.street,
//           },
//         };

//         // Open Razorpay payment modal
//         const rzp1 = new window.Razorpay(options);
//         rzp1.open();
//       } else {
//         setPaymentLoading(false);
//         throw new Error("Failed to create Razorpay order");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Error with payment processing. Please try again later.");
//       setPaymentLoading(false);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.quantity * item?.productId?.sellingPrice,
//     0
//   );

//   return (
//     <div className="container mx-auto p-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Left Column - Form Fields */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="email"
//               placeholder="Email Address"
//               onChange={handleChange}
//               value={customerInfo.email}
//               name="email"
//               className="border p-2 rounded-md outline-none focus:border-brand-primary"
//               required
//             />
//             <input
//               type="tel"
//               placeholder="Phone"
//               onChange={handleChange}
//               value={customerInfo.phone}
//               name="phone"
//               className="border p-2 rounded-md outline-none focus:border-brand-primary"
//               required
//             />
//           </div>

//           <div className="mt-6">
//             <div className="flex items-end mb-4">
//               <h2 className="text-2xl font-bold mr-2">Shipping Address</h2>
//               <button className="text-brand-primary font-semibold hover:underline" 
//               onClick={() => setShowModal(true)}>Change</button>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={customerInfo.firstName}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={customerInfo.lastName}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 value={customerInfo.country}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="street"
//                 placeholder="Street Address"
//                 value={customerInfo.street}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="District"
//                 value={customerInfo.city}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 value={customerInfo.state}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="postalCode"
//                 placeholder="Postal/Zip Code"
//                 value={customerInfo.postalCode}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//             </div>
//             {shippingDetailsFilled && (
//               <div
//                 className={`text-sm mt-1 font-semibold ${
//                   shippingCharge === 0 ? "text-green-600" : "text-brand-primary"
//                 }`}
//               >
//                 <p>{shippingMessage}</p>
//               </div>
//             )}

//             <div className="mt-4">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={billingSameAsShipping}
//                   onChange={(e) => setBillingSameAsShipping(e.target.checked)}
//                   className="mr-2 accent-brand-primary"
//                 />
//                 <span className="text-sm font-medium">Billing address same as shipping</span>
//               </label>
//             </div>
//             {!billingSameAsShipping && (
//               <>
//                 <h2 className="text-2xl font-bold mt-6 mb-4">
//                   Billing Address
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="First Name"
//                     value={billingAddress.firstName}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary capitalize"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Last Name"
//                     value={billingAddress.lastName}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   {/* ... (Other billing inputs) */}
//                   <input
//                     type="text"
//                     name="country"
//                     placeholder="Country"
//                     value={billingAddress.country}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="street"
//                     placeholder="Street Address"
//                     value={billingAddress.street}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="City"
//                     value={billingAddress.city}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="state"
//                     placeholder="State"
//                     value={billingAddress.state}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="postalCode"
//                     placeholder="Postal/Zip Code"
//                     value={billingAddress.postalCode}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Order Details */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//           <div className="">
//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               <>
//                 <div className="bg-white p-4 border border-color-brand-productCardBorder rounded-md mb-4">
//                   {/* <h2 className="font-bold text-lg mb-4">Your Order</h2> */}
//                   {cartItems.map((item, index) => {
//                     // Handling Mixed Image Format Logic
//                     const images = item?.productId?.productImage || [];
//                     const firstMedia = images[0];
//                     const displayImage = typeof firstMedia === "string" ? firstMedia : firstMedia?.url;

//                     return (
//                       <div key={`item.id-${index}`} className="flex justify-between mb-2 border-b pb-2">
//                         <div>
//                           <h3 className="font-bold text-base md:text-lg mb-1 line-clamp-1">
//                             {item.productId.productName}
//                           </h3>
//                           <div className="w-24 h-24 bg-gray-50 rounded">
//                             <img
//                               src={displayImage}
//                               className="w-full h-full object-scale-down mix-blend-multiply"
//                               alt={item.productId.altTitle || "product"}
//                               title={item.productId.altTitle || "product"}
//                             />
//                           </div>
//                           <p className="font-bold text-sm mt-1">Qty: {item.quantity}</p>
//                         </div>
//                         <p className="font-bold flex items-center">
//                           <FaRupeeSign className="text-xs" />
//                           {item.quantity * item.productId.sellingPrice}
//                         </p>
//                       </div>
//                     );
//                   })}

//                   <div className="mt-4">
//                     <a href="/cart" className="text-brand-primary font-bold flex items-center hover:underline">
//                       <FaEdit className="mr-1" /> Edit Cart
//                     </a>
//                   </div>
//                   <hr className="my-4" />
//                   <div className="flex justify-between">
//                     <p className="text-gray-600 font-medium">Subtotal</p>
//                     <p className="flex items-center font-bold">
//                       <FaRupeeSign className="mr-1 text-xs" />
//                       {totalPrice}
//                     </p>
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <p className="text-gray-600 font-medium">Shipping</p>
//                     <p className="font-bold text-green-600">{shippingCharge === 0 ? "Free" : shippingCharge}</p>
//                   </div>
//                   <hr className="my-4 border-gray-300" />
//                   <div className="flex justify-between font-bold text-xl">
//                     <p>Order Total</p>
//                     <p className="flex items-center">
//                       <FaRupeeSign className="text-base mt-0.5" />
//                       {totalPrice}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleSubmit}
//                   className="mt-6 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold py-3 rounded-lg w-full transition-all active:scale-95"
//                   disabled={!isFormComplete()}
//                 >
//                   Checkout
//                 </button>

//                 {user?.role === ROLE.MANAGESALES && (
//                   <button
//                     onClick={handlePaymentLink}
//                     className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg w-full mt-3 transition-all active:scale-95"
//                     disabled={!isFormComplete() || paymentLinkLoading}
//                   >
//                     {paymentLinkLoading ? "Generating Link..." : "Pay via Payment Link"}
//                   </button>
//                 )}

//                 {user?.role === ROLE.MANAGESALES && (
//                   <div className="flex items-center mt-4 p-2 bg-gray-50 rounded border">
//                     <input
//                       type="checkbox"
//                       id="cashOnHand"
//                       checked={cashOnHand}
//                       onChange={(e) => setCashOnHand(e.target.checked)}
//                       className="mr-2 h-4 w-4 accent-brand-primary cursor-pointer"
//                     />
//                     <label htmlFor="cashOnHand" className="font-bold text-gray-700 cursor-pointer">
//                       Cash on Hand
//                     </label>
//                   </div>
//                 )}


//                 {paymentLoading && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
//                     <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl max-w-xs mx-auto">
//                       <Lottie
//                         loop
//                         animationData={animationData}
//                         play
//                         style={{ width: 150, height: 150 }}
//                       />
//                       <h2 className="text-xl font-bold text-gray-800 mb-2">
//                         Payment Processing
//                       </h2>
//                       <p className="text-gray-600 text-sm">
//                         Please do not refresh the page. This may take a few moments...
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Modal for Address List */}
//                 {showModal && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1500]">
//                     <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full m-4">
//                       <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Select an Address</h2>
//                       <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
//                         {user?.addresses.length > 0 ? (user?.addresses.map((address) => (
//                           <div
//                             key={address._id}
//                             className="border-2 border-gray-100 rounded-xl p-4 bg-white cursor-pointer hover:border-brand-primary hover:bg-red-50 transition-all"
//                             onClick={() => handleAddressClick(address)}
//                           >
//                             <p className="text-gray-900 font-bold">{address.street}</p>
//                             <p className="text-gray-600 text-sm mt-1">
//                               {address.city}, {address.state} - {address.pinCode}
//                             </p>
//                             {address.default && (
//                               <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
//                                 Default Address
//                               </span>
//                             )}
//                           </div>
//                         ))) : (<p className="text-gray-400 text-center py-4">No saved addresses found.</p>)}
//                       </div>
//                       <div className="flex gap-4 mt-8">
//                         <button
//                           className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition-all"
//                           onClick={() => setShowModal(false)}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default CheckoutPage;


// import React, { useContext, useState, useEffect } from "react";
// import { useSelector } from 'react-redux';
// import Lottie from "react-lottie-player";
// import animationData from "../assest/animations/payment-done.json";
// import SummaryApi from "../common";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaRupeeSign, FaTicketAlt } from "react-icons/fa"; // Added FaTicketAlt
// // import axios from "axios";
// import Context from '../context'
// import { toast } from "react-toastify";
// import ROLE from "../common/role";


// function CheckoutPage() {
//   const user = useSelector(state => state?.user?.user);
//   const { fetchUserAddToCart } = useContext(Context)
//   const navigate = useNavigate();


//   // useEffect(() => {
//   //   if (!user?._id) {
//   //     toast.warning("Please login to continue checkout");
//   //     navigate("/login", { state: { from: "/checkout" } });
//   //   }
//   // }, [user, navigate]);

//   const [customerInfo, setCustomerInfo] = useState({
//     email: user?.email || "",
//     phone: user?.mobile || "",
//     firstName: user?.name.split(" ")[0] || "",
//     lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });
//   const [cashOnHand, setCashOnHand] = useState(false);

//   const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
//   const [billingAddress, setBillingAddress] = useState({
//     firstName: "",
//     lastName: "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });


//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [shippingCharge, setShippingCharge] = useState(0);
//   const [shippingMessage, setShippingMessage] = useState("");
//   // const [totalPrice, setTotalPrice] = useState(0);
//   const [shippingDetailsFilled, setShippingDetailsFilled] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [paymentLinkLoading, setPaymentLinkLoading] = useState(false);

//   // --- Coupon States ---
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [discountAmount, setCouponDiscount] = useState(0);
//   const [isCouponLoading, setIsCouponLoading] = useState(false);

//   const handleAddressClick = (address) => {
//     setCustomerInfo((prevState) => ({
//       ...prevState,
//       ...address,
//       postalCode: address.pinCode
//     })); // Update selected address
//     setBillingAddress((prevState) => ({
//       ...prevState,
//       country: address.country,
//       street: address.street,
//       city: address.city,
//       postalCode: address.pinCode,
//       state: address.state,
//     }));
//     setShowModal(false); // Close the modal
//   };


//   useEffect(() => {
//     if (user) {
//       // Set the city, state, and postal code based on stored location data
//       setCustomerInfo((prevState) => ({
//         ...prevState,
//         email: user?.email || "",
//         phone: user?.mobile || "",
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));

//       setBillingAddress((prevState) => ({
//         ...prevState,
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(SummaryApi.addToCartProductView.url, {
//           method: SummaryApi.addToCartProductView.method,
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.status === 401) {
//         toast.warning("Please login to continue checkout");
//         navigate("/login", { state: { from: "/checkout" } });
//         return;
//       }

//         const responseData = await response.json();

//         if (responseData.success) {
//           setCartItems(responseData.data);
//           if (responseData.data.length === 0) {
//             toast.info("Your cart is empty");
//             navigate("/cart");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching cart data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBillingChange = (e) => {
//     const { name, value } = e.target;
//     setBillingAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const isFormComplete = () => {
//     const {
//       email,
//       phone,
//       firstName,
//       lastName,
//       country,
//       street,
//       city,
//       postalCode,
//       state,
//     } = customerInfo;
//     const addressComplete =
//       billingSameAsShipping ||
//       Object.values(billingAddress).every((field) => field.trim() !== "");
//     return (
//       [
//         email,
//         phone,
//         firstName,
//         lastName,
//         country,
//         street,
//         city,
//         postalCode,
//         state,
//       ].every((field) => field.trim() !== "") && addressComplete
//     );
//   };

//   //  Check if the postal code is valid for Tamil Nadu (typically starts with '6')
//   const isTamilNaduPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);

//     // Validate that the pin is within Tamil Nadu's postal range
//     if (pin >= 600001 && pin <= 669999) {
//       // Exclude Pondicherry postal codes (605001 to 605110)
//       return !(pin >= 605001 && pin <= 605110);
//     }

//     // Return false for any pin code outside Tamil Nadu's range
//     return false;
//   };

//   // Check if the postal code is valid for Kerala (starts with '6' but in range 680001 - 689999)
//   const isKeralaPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);
//     return pin >= 670001 && pin <= 689999; // Kerala's range
//   };

//   useEffect(() => {
//     const { state, postalCode } = customerInfo;

//     // Check if shipping details are filled
//     const isShippingDetailsFilled =
//       state.trim() !== "" &&
//       postalCode.trim() !== "" &&
//       customerInfo.street.trim() !== "" &&
//       customerInfo.city.trim() !== "" &&
//       customerInfo.country.trim() !== "";

//     setShippingDetailsFilled(isShippingDetailsFilled);

//     if (state && postalCode) {
//       if (isTamilNaduPostalCode(postalCode)) {
//         setShippingCharge(0); // Free shipping for Tamil Nadu
//         setShippingMessage("Shipping is available in Tamil Nadu");
//       } else if (isKeralaPostalCode(postalCode)) {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       } else {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       }
//     } else {
//       setShippingMessage("");
//     }
//   }, [ customerInfo]);

//   // --- Apply Coupon Logic ---
//   const handleApplyCoupon = async () => {
//     if (!couponCode) {
//       toast.error("Please enter a coupon code");
//       return;
//     }

//     setIsCouponLoading(true);
//     try {
//       const response = await fetch(SummaryApi.applyCoupon.url, { // Ensure this route is in SummaryApi
//         method: SummaryApi.applyCoupon.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           code: couponCode,
//           cartItems: cartItems,
//           orderAmount: totalPrice
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setAppliedCoupon(data.data);
//         setCouponDiscount(data.discountAmount);
//         toast.success("Coupon applied successfully!");
//       } else {
//         toast.error(data.message || "Invalid coupon code");
//         setAppliedCoupon(null);
//         setCouponDiscount(0);
//       }
//     } catch (error) {
//       toast.error("Error applying coupon");
//     } finally {
//       setIsCouponLoading(false);
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponDiscount(0);
//     setCouponCode("");
//     toast.info("Coupon removed");
//   };

// const handlePaymentLink = async () => {
//   const { postalCode, street } = customerInfo;

//   // Validate input
//   if (!postalCode || !street) {
//     toast.error("Please fill out all shipping details before proceeding.");
//     return;
//   }

//   // Ensure only Tamil Nadu postal codes are allowed
//   if (!isTamilNaduPostalCode(postalCode)) {
//     toast.error("Shipping is available only in Tamil Nadu.");
//     return;
//   }

//   // Proceed with free shipping
//   if (shippingCharge === 0) {
//     // OK to proceed
//   } else {
//     // Fallback in case some logic changes
//     toast.error("Invalid shipping configuration.");
//     return;
//   }

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }         
//   setPaymentLinkLoading(true);
//   try {
//     const billingAddressToSend = billingSameAsShipping
//       ? { ...customerInfo }
//       : billingAddress;

//     const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//     const payload = {
//       cartItems,
//       customerInfo: {
//         ...customerInfo,
//         billingAddress: billingAddressToSend,
//       },
//       billingSameAsShipping,
//       shippingOption,
//       usePaymentLink: true, // Important!
//       couponCode: appliedCoupon?.code || null, // Added Coupon to Link
//       discountAmount: discountAmount // Added Discount to Link
//     };

//     const response = await fetch(SummaryApi.payment.url, {
//       method: SummaryApi.payment.method,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     if (data.success && data.paymentLink) {
//       window.open(data.paymentLink, "_blank");
//       toast.success("Payment link opened in new tab!");
//     } else {
//       toast.error(data.message || "Failed to generate payment link.");
//     }
//   } catch (error) {
//     toast.error("Error generating payment link.");
//   } finally {
//     setPaymentLinkLoading(false);
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }
// // CASH ON HAND FLOW
//   if (cashOnHand && user?.role === ROLE.MANAGESALES) {
//     try {
//       const payload = {
//         cartItems,
//         customerInfo,
//         billingSameAsShipping,
//         paymentMode: "CASH_ON_HAND",
//         couponCode: appliedCoupon?.code || null,
//         discountAmount: discountAmount
//       };

//       const response = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Order confirmed (Cash on Hand)");
//         fetchUserAddToCart();
//         navigate("/success");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to confirm cash order");
//     }
//     return; // 🚨 STOP Razorpay
//   }

//     try {
//       // const response = await axios.post(
//       //   "http://localhost:8080/api/validate-address",
//       //   customerInfo
//       // );
      

//       // Prepare the payload for the payment API
//       const billingAddressToSend = billingSameAsShipping
//         ? { ...customerInfo }
//         : billingAddress;

//       // Determine the shipping option name
//       const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//       const payload = {
//         cartItems,
//         customerInfo: {
//           ...customerInfo,
//           billingAddress: billingAddressToSend,
//         },
//         billingSameAsShipping,
//         shippingOption, // Add the shipping option
//         couponCode: appliedCoupon?.code || null,
//         discountAmount: discountAmount
//       };

//       // Send the payload to the payment API
//       const paymentResponse = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const paymentResponseData = await paymentResponse.json();

//       if (paymentResponseData.success) {
//         // Razorpay options for initiating the payment
//         const options = {
//           key: "rzp_live_dEoDcnBwCOkfCt", // Razorpay Live key
//           // key: "rzp_test_66VslSnaYXyl0i", // Razorpay test key
//           amount: finalAmount * 100, // 🔥 Updated to finalAmount (amount in paise)
//           currency: "INR",
//           name: "Relda India",
//           description: "e-commerce",
//           image: "/client/src/assest/banner/logo.png",
//           order_id: paymentResponseData.orderId,
//           handler: async function (response) {
//             // Handle Razorpay payment response
//             const paymentMethod =
//               response.payment_method_type || response.payment_mode || "default";
//             setPaymentLoading(true);
//             const paymentVerification = await fetch(SummaryApi.verpay.url, {
//               method: SummaryApi.verpay.method,
//               credentials: "include",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpaySignature: response.razorpay_signature,
//                 paymentMethod,
//                 cartItems,
//                 customerInfo,
//                 couponCode: appliedCoupon?.code || null, // Send coupon to verification
//                 discountAmount: discountAmount
//               }),
//             });            

//             const paymentVerificationData = await paymentVerification.json();

//             if (paymentVerificationData.success) {
              
//               toast.success("Payment successful!");
//               navigate("/success"); // Redirect to success page
//               fetchUserAddToCart();
//             } else {
//               toast.error(
//                 "Payment verification failed. Please contact support."
//               );
//               navigate("/cancel"); // Redirect to failure page
//             }
//           },
//           prefill: {
//             name: customerInfo.firstName + " " + customerInfo.lastName,
//             email: customerInfo.email,
//             contact: customerInfo.phone,
//           },
//           notes: {
//             address: customerInfo.street,
//           },
//         };

//         // Open Razorpay payment modal
//         const rzp1 = new window.Razorpay(options);
//         rzp1.open();
//       } else {
//         setPaymentLoading(false);
//         throw new Error("Failed to create Razorpay order");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Error with payment processing. Please try again later.");
//       setPaymentLoading(false);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.quantity * item?.productId?.sellingPrice,
//     0
//   );

//   // 🔥 Final Amount Calculation
//   const finalAmount = totalPrice - discountAmount;

//   return (
//     <div className="container mx-auto p-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Left Column - Form Fields */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="email"
//               placeholder="Email Address"
//               onChange={handleChange}
//               value={customerInfo.email}
//               name="email"
//               className="border p-2 rounded-md outline-none focus:border-brand-primary"
//               required
//             />
//             <input
//               type="tel"
//               placeholder="Phone"
//               onChange={handleChange}
//               value={customerInfo.phone}
//               name="phone"
//               className="border p-2 rounded-md outline-none focus:border-brand-primary"
//               required
//             />
//           </div>

//           <div className="mt-6">
//             <div className="flex items-end mb-4">
//               <h2 className="text-2xl font-bold mr-2">Shipping Address</h2>
//               <button className="text-brand-primary font-semibold hover:underline" 
//               onClick={() => setShowModal(true)}>Change</button>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={customerInfo.firstName}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={customerInfo.lastName}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 value={customerInfo.country}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="street"
//                 placeholder="Street Address"
//                 value={customerInfo.street}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="District"
//                 value={customerInfo.city}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 value={customerInfo.state}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="postalCode"
//                 placeholder="Postal/Zip Code"
//                 value={customerInfo.postalCode}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//             </div>
//             {shippingDetailsFilled && (
//               <div
//                 className={`text-sm mt-1 font-semibold ${
//                   shippingCharge === 0 ? "text-green-600" : "text-brand-primary"
//                 }`}
//               >
//                 <p>{shippingMessage}</p>
//               </div>
//             )}

//             <div className="mt-4">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={billingSameAsShipping}
//                   onChange={(e) => setBillingSameAsShipping(e.target.checked)}
//                   className="mr-2 accent-brand-primary"
//                 />
//                 <span className="text-sm font-medium">Billing address same as shipping</span>
//               </label>
//             </div>
//             {!billingSameAsShipping && (
//               <>
//                 <h2 className="text-2xl font-bold mt-6 mb-4">
//                   Billing Address
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="First Name"
//                     value={billingAddress.firstName}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary capitalize"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Last Name"
//                     value={billingAddress.lastName}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   {/* ... (Other billing inputs) */}
//                   <input
//                     type="text"
//                     name="country"
//                     placeholder="Country"
//                     value={billingAddress.country}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="street"
//                     placeholder="Street Address"
//                     value={billingAddress.street}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="City"
//                     value={billingAddress.city}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="state"
//                     placeholder="State"
//                     value={billingAddress.state}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="postalCode"
//                     placeholder="Postal/Zip Code"
//                     value={billingAddress.postalCode}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Order Details */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//           <div className="">
//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               <>
//                 <div className="bg-white p-4 border border-color-brand-productCardBorder rounded-md mb-4 shadow-sm">
//                   {/* <h2 className="font-bold text-lg mb-4">Your Order</h2> */}
//                   {cartItems.map((item, index) => {
//                     // Handling Mixed Image Format Logic
//                     const images = item?.productId?.productImage || [];
//                     const firstMedia = images[0];
//                     const displayImage = typeof firstMedia === "string" ? firstMedia : firstMedia?.url;

//                     return (
//                       <div key={`item.id-${index}`} className="flex justify-between mb-2 border-b pb-2">
//                         <div>
//                           <h3 className="font-bold text-base md:text-lg mb-1 line-clamp-1">
//                             {item.productId.productName}
//                           </h3>
//                           <div className="w-24 h-24 bg-gray-50 rounded">
//                             <img
//                               src={displayImage}
//                               className="w-full h-full object-scale-down mix-blend-multiply"
//                               alt={item.productId.altTitle || "product"}
//                               title={item.productId.altTitle || "product"}
//                             />
//                           </div>
//                           <p className="font-bold text-sm mt-1">Qty: {item.quantity}</p>
//                         </div>
//                         <p className="font-bold flex items-center">
//                           <FaRupeeSign className="text-xs" />
//                           {item.quantity * item.productId.sellingPrice}
//                         </p>
//                       </div>
//                     );
//                   })}

//                   {/* 🔥 Coupon Code Section */}
//                   <div className="mt-6 bg-slate-50 p-3 rounded-lg border border-dashed border-gray-300">
//                     <div className="flex items-center gap-2 mb-2">
//                         <FaTicketAlt className="text-brand-primary" />
//                         <span className="font-bold text-sm uppercase text-gray-700">Apply Coupon</span>
//                     </div>
                    
//                     {!appliedCoupon ? (
//                       <div className="flex gap-2">
//                         <input
//                           type="text"
//                           placeholder="Enter Code"
//                           value={couponCode}
//                           onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                           className="flex-1 border p-2 rounded outline-none text-sm font-mono focus:border-brand-primary"
//                         />
//                         <button
//                           onClick={handleApplyCoupon}
//                           disabled={isCouponLoading || !couponCode}
//                           className="bg-brand-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-brand-primaryHover transition-all disabled:bg-gray-300"
//                         >
//                           {isCouponLoading ? "..." : "APPLY"}
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex justify-between items-center bg-green-100 p-2 rounded border border-green-200">
//                         <div>
//                           <p className="text-xs font-bold text-green-700">COUPON APPLIED!</p>
//                           <p className="text-sm font-bold text-green-800">{appliedCoupon.code}</p>
//                         </div>
//                         <button 
//                           onClick={handleRemoveCoupon}
//                           className="text-xs font-bold text-red-600 hover:underline"
//                         >
//                           REMOVE
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-4">
//                     <a href="/cart" className="text-brand-primary font-bold flex items-center hover:underline">
//                       <FaEdit className="mr-1" /> Edit Cart
//                     </a>
//                   </div>
//                   <hr className="my-4" />
//                   <div className="flex justify-between">
//                     <p className="text-gray-600 font-medium">Subtotal</p>
//                     <p className="flex items-center font-bold">
//                       <FaRupeeSign className="mr-1 text-xs" />
//                       {totalPrice}
//                     </p>
//                   </div>

//                   {/* 🔥 Display Discount if Applied */}
//                   {discountAmount > 0 && (
//                     <div className="flex justify-between mt-1">
//                       <p className="text-green-600 font-medium">Coupon Discount</p>
//                       <p className="flex items-center font-bold text-green-600">
//                         - <FaRupeeSign className="mr-1 text-xs" />
//                         {discountAmount}
//                       </p>
//                     </div>
//                   )}

//                   <div className="flex justify-between mt-1">
//                     <p className="text-gray-600 font-medium">Shipping</p>
//                     <p className="font-bold text-green-600">{shippingCharge === 0 ? "Free" : shippingCharge}</p>
//                   </div>
//                   <hr className="my-4 border-gray-300" />
//                   <div className="flex justify-between font-bold text-xl">
//                     <p>Order Total</p>
//                     <p className="flex items-center">
//                       <FaRupeeSign className="text-base mt-0.5" />
//                       {finalAmount} {/* 🔥 Updated to finalAmount */}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleSubmit}
//                   className="mt-6 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold py-3 rounded-lg w-full transition-all active:scale-95"
//                   disabled={!isFormComplete()}
//                 >
//                   Checkout
//                 </button>

//                 {user?.role === ROLE.MANAGESALES && (
//                   <button
//                     onClick={handlePaymentLink}
//                     className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg w-full mt-3 transition-all active:scale-95"
//                     disabled={!isFormComplete() || paymentLinkLoading}
//                   >
//                     {paymentLinkLoading ? "Generating Link..." : "Pay via Payment Link"}
//                   </button>
//                 )}

//                 {user?.role === ROLE.MANAGESALES && (
//                   <div className="flex items-center mt-4 p-2 bg-gray-50 rounded border">
//                     <input
//                       type="checkbox"
//                       id="cashOnHand"
//                       checked={cashOnHand}
//                       onChange={(e) => setCashOnHand(e.target.checked)}
//                       className="mr-2 h-4 w-4 accent-brand-primary cursor-pointer"
//                     />
//                     <label htmlFor="cashOnHand" className="font-bold text-gray-700 cursor-pointer">
//                       Cash on Hand
//                     </label>
//                   </div>
//                 )}


//                 {paymentLoading && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
//                     <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl max-w-xs mx-auto">
//                       <Lottie
//                         loop
//                         animationData={animationData}
//                         play
//                         style={{ width: 150, height: 150 }}
//                       />
//                       <h2 className="text-xl font-bold text-gray-800 mb-2">
//                         Payment Processing
//                       </h2>
//                       <p className="text-gray-600 text-sm">
//                         Please do not refresh the page. This may take a few moments...
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Modal for Address List */}
//                 {showModal && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1500]">
//                     <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full m-4">
//                       <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Select an Address</h2>
//                       <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
//                         {user?.addresses.length > 0 ? (user?.addresses.map((address) => (
//                           <div
//                             key={address._id}
//                             className="border-2 border-gray-100 rounded-xl p-4 bg-white cursor-pointer hover:border-brand-primary hover:bg-red-50 transition-all"
//                             onClick={() => handleAddressClick(address)}
//                           >
//                             <p className="text-gray-900 font-bold">{address.street}</p>
//                             <p className="text-gray-600 text-sm mt-1">
//                               {address.city}, {address.state} - {address.pinCode}
//                             </p>
//                             {address.default && (
//                               <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
//                                 Default Address
//                               </span>
//                             )}
//                           </div>
//                         ))) : (<p className="text-gray-400 text-center py-4">No saved addresses found.</p>)}
//                       </div>
//                       <div className="flex gap-4 mt-8">
//                         <button
//                           className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition-all"
//                           onClick={() => setShowModal(false)}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default CheckoutPage;

// import React, { useContext, useState, useEffect } from "react";
// import { useSelector } from 'react-redux';
// import Lottie from "react-lottie-player";
// import animationData from "../assest/animations/payment-done.json";
// import SummaryApi from "../common";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaRupeeSign, FaTicketAlt, FaGift, FaPercentage } from "react-icons/fa"; // Added icons
// // import axios from "axios";
// import Context from '../context'
// import { toast } from "react-toastify";
// import ROLE from "../common/role";


// function CheckoutPage() {
//   const user = useSelector(state => state?.user?.user);
//   const { fetchUserAddToCart } = useContext(Context)
//   const navigate = useNavigate();


//   // useEffect(() => {
//   //   if (!user?._id) {
//   //     toast.warning("Please login to continue checkout");
//   //     navigate("/login", { state: { from: "/checkout" } });
//   //   }
//   // }, [user, navigate]);

//   const [customerInfo, setCustomerInfo] = useState({
//     email: user?.email || "",
//     phone: user?.mobile || "",
//     firstName: user?.name.split(" ")[0] || "",
//     lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });
//   const [cashOnHand, setCashOnHand] = useState(false);

//   const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
//   const [billingAddress, setBillingAddress] = useState({
//     firstName: "",
//     lastName: "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });


//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [shippingCharge, setShippingCharge] = useState(0);
//   const [shippingMessage, setShippingMessage] = useState("");
//   // const [totalPrice, setTotalPrice] = useState(0);
//   const [shippingDetailsFilled, setShippingDetailsFilled] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [paymentLinkLoading, setPaymentLinkLoading] = useState(false);

//   // --- 🔥 Coupon States ---
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [discountAmount, setCouponDiscount] = useState(0);
//   const [isCouponLoading, setIsCouponLoading] = useState(false);
//   const [availableCoupons, setAvailableCoupons] = useState([]);
//   const [showCouponModal, setShowCouponModal] = useState(false);

//   const handleAddressClick = (address) => {
//     setCustomerInfo((prevState) => ({
//       ...prevState,
//       ...address,
//       postalCode: address.pinCode
//     })); // Update selected address
//     setBillingAddress((prevState) => ({
//       ...prevState,
//       country: address.country,
//       street: address.street,
//       city: address.city,
//       postalCode: address.pinCode,
//       state: address.state,
//     }));
//     setShowModal(false); // Close the modal
//   };


//   useEffect(() => {
//     if (user) {
//       // Set the city, state, and postal code based on stored location data
//       setCustomerInfo((prevState) => ({
//         ...prevState,
//         email: user?.email || "",
//         phone: user?.mobile || "",
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));

//       setBillingAddress((prevState) => ({
//         ...prevState,
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(SummaryApi.addToCartProductView.url, {
//           method: SummaryApi.addToCartProductView.method,
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.status === 401) {
//         toast.warning("Please login to continue checkout");
//         navigate("/login", { state: { from: "/checkout" } });
//         return;
//       }

//         const responseData = await response.json();

//         if (responseData.success) {
//           setCartItems(responseData.data);
//           if (responseData.data.length === 0) {
//             toast.info("Your cart is empty");
//             navigate("/cart");
//           } else {
//             // 🔥 Fetch applicable coupons based on cart items
//             fetchAvailableCoupons(responseData.data);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching cart data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   // 🔥 Fetch Suggestion Coupons
//   const fetchAvailableCoupons = async (items) => {
//     try {
//       // We pass the IDs/Categories of the first few items to see relevant coupons
//       const firstItem = items[0]?.productId;
//       const query = new URLSearchParams({
//         productId: firstItem?._id || "",
//         productCategory: firstItem?.category || ""
//       }).toString();

//       const response = await fetch(`${SummaryApi.getApplicableCoupons.url}?${query}`);
//       const data = await response.json();
//       if(data.success) {
//         setAvailableCoupons(data.data);
//       }
//     } catch (err) {
//       console.error("Error fetching coupons", err);
//     }
//   };


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBillingChange = (e) => {
//     const { name, value } = e.target;
//     setBillingAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const isFormComplete = () => {
//     const {
//       email,
//       phone,
//       firstName,
//       lastName,
//       country,
//       street,
//       city,
//       postalCode,
//       state,
//     } = customerInfo;
//     const addressComplete =
//       billingSameAsShipping ||
//       Object.values(billingAddress).every((field) => field.trim() !== "");
//     return (
//       [
//         email,
//         phone,
//         firstName,
//         lastName,
//         country,
//         street,
//         city,
//         postalCode,
//         state,
//       ].every((field) => field.trim() !== "") && addressComplete
//     );
//   };

//   //  Check if the postal code is valid for Tamil Nadu (typically starts with '6')
//   const isTamilNaduPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);

//     // Validate that the pin is within Tamil Nadu's postal range
//     if (pin >= 600001 && pin <= 669999) {
//       // Exclude Pondicherry postal codes (605001 to 605110)
//       return !(pin >= 605001 && pin <= 605110);
//     }

//     // Return false for any pin code outside Tamil Nadu's range
//     return false;
//   };

//   // Check if the postal code is valid for Kerala (starts with '6' but in range 680001 - 689999)
//   const isKeralaPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);
//     return pin >= 670001 && pin <= 689999; // Kerala's range
//   };

//   useEffect(() => {
//     const { state, postalCode } = customerInfo;

//     // Check if shipping details are filled
//     const isShippingDetailsFilled =
//       state.trim() !== "" &&
//       postalCode.trim() !== "" &&
//       customerInfo.street.trim() !== "" &&
//       customerInfo.city.trim() !== "" &&
//       customerInfo.country.trim() !== "";

//     setShippingDetailsFilled(isShippingDetailsFilled);

//     if (state && postalCode) {
//       if (isTamilNaduPostalCode(postalCode)) {
//         setShippingCharge(0); // Free shipping for Tamil Nadu
//         setShippingMessage("Shipping is available in Tamil Nadu");
//       } else if (isKeralaPostalCode(postalCode)) {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       } else {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       }
//     } else {
//       setShippingMessage("");
//     }
//   }, [ customerInfo]);

//   // --- 🔥 Apply Coupon Logic ---
//   const handleApplyCoupon = async (codeFromList = null) => {
//     const codeToVerify = codeFromList || couponCode;
//     if (!codeToVerify) {
//       toast.error("Please enter a coupon code");
//       return;
//     }

//     setIsCouponLoading(true);
//     try {
//       const response = await fetch(SummaryApi.verifyCoupon.url, {
//         method: SummaryApi.verifyCoupon.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           couponCode: codeToVerify,
//           cartItems: cartItems
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setAppliedCoupon(data.data);
//         setCouponDiscount(data.data.discountAmount);
//         setCouponCode(data.data.coupon);
//         setShowCouponModal(false);
//         toast.success(data.message);
//       } else {
//         toast.error(data.message || "Invalid coupon code");
//         setAppliedCoupon(null);
//         setCouponDiscount(0);
//       }
//     } catch (error) {
//       toast.error("Error applying coupon");
//     } finally {
//       setIsCouponLoading(false);
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponDiscount(0);
//     setCouponCode("");
//     toast.info("Coupon removed");
//   };

// const handlePaymentLink = async () => {
//   const { postalCode, street } = customerInfo;

//   // Validate input
//   if (!postalCode || !street) {
//     toast.error("Please fill out all shipping details before proceeding.");
//     return;
//   }

//   // Ensure only Tamil Nadu postal codes are allowed
//   if (!isTamilNaduPostalCode(postalCode)) {
//     toast.error("Shipping is available only in Tamil Nadu.");
//     return;
//   }

//   // Proceed with free shipping
//   if (shippingCharge === 0) {
//     // OK to proceed
//   } else {
//     // Fallback in case some logic changes
//     toast.error("Invalid shipping configuration.");
//     return;
//   }

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }         
//   setPaymentLinkLoading(true);
//   try {
//     const billingAddressToSend = billingSameAsShipping
//       ? { ...customerInfo }
//       : billingAddress;

//     const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//     const payload = {
//       cartItems,
//       customerInfo: {
//         ...customerInfo,
//         billingAddress: billingAddressToSend,
//       },
//       billingSameAsShipping,
//       shippingOption,
//       usePaymentLink: true, // Important!
//       couponCode: appliedCoupon?.coupon || null, // 🔥 Send applied coupon
//       discountAmount: discountAmount // 🔥 Send discount amount
//     };

//     const response = await fetch(SummaryApi.payment.url, {
//       method: SummaryApi.payment.method,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     if (data.success && data.paymentLink) {
//       window.open(data.paymentLink, "_blank");
//       toast.success("Payment link opened in new tab!");
//     } else {
//       toast.error(data.message || "Failed to generate payment link.");
//     }
//   } catch (error) {
//     toast.error("Error generating payment link.");
//   } finally {
//     setPaymentLinkLoading(false);
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }
// // CASH ON HAND FLOW
//   if (cashOnHand && user?.role === ROLE.MANAGESALES) {
//     try {
//       const payload = {
//         cartItems,
//         customerInfo,
//         billingSameAsShipping,
//         paymentMode: "CASH_ON_HAND",
//         couponCode: appliedCoupon?.coupon || null,
//         discountAmount: discountAmount
//       };

//       const response = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Order confirmed (Cash on Hand)");
//         fetchUserAddToCart();
//         navigate("/success");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to confirm cash order");
//     }
//     return; // 🚨 STOP Razorpay
//   }

//     try {
//       // const response = await axios.post(
//       //   "http://localhost:8080/api/validate-address",
//       //   customerInfo
//       // );
      

//       // Prepare the payload for the payment API
//       const billingAddressToSend = billingSameAsShipping
//         ? { ...customerInfo }
//         : billingAddress;

//       // Determine the shipping option name
//       const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//       const payload = {
//         cartItems,
//         customerInfo: {
//           ...customerInfo,
//           billingAddress: billingAddressToSend,
//         },
//         billingSameAsShipping,
//         shippingOption, // Add the shipping option
//         couponCode: appliedCoupon?.coupon || null,
//         discountAmount: discountAmount
//       };

//       // Send the payload to the payment API
//       const paymentResponse = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const paymentResponseData = await paymentResponse.json();

//       if (paymentResponseData.success) {
//         // Razorpay options for initiating the payment
//         const options = {
//           key: "rzp_live_dEoDcnBwCOkfCt", // Razorpay Live key
//           // key: "rzp_test_66VslSnaYXyl0i", // Razorpay test key
//           amount: finalAmount * 100, // 🔥 Updated to finalAmount
//           currency: "INR",
//           name: "Relda India",
//           description: "e-commerce",
//           image: "/client/src/assest/banner/logo.png",
//           order_id: paymentResponseData.orderId,
//           handler: async function (response) {
//             // Handle Razorpay payment response
//             const paymentMethod =
//               response.payment_method_type || response.payment_mode || "default";
//             setPaymentLoading(true);
//             const paymentVerification = await fetch(SummaryApi.verpay.url, {
//               method: SummaryApi.verpay.method,
//               credentials: "include",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpaySignature: response.razorpay_signature,
//                 paymentMethod,
//                 cartItems,
//                 customerInfo,
//                 couponCode: appliedCoupon?.coupon || null,
//                 discountAmount: discountAmount
//               }),
//             });            

//             const paymentVerificationData = await paymentVerification.json();

//             if (paymentVerificationData.success) {
              
//               toast.success("Payment successful!");
//               navigate("/success"); // Redirect to success page
//               fetchUserAddToCart();
//             } else {
//               toast.error(
//                 "Payment verification failed. Please contact support."
//               );
//               navigate("/cancel"); // Redirect to failure page
//             }
//           },
//           prefill: {
//             name: customerInfo.firstName + " " + customerInfo.lastName,
//             email: customerInfo.email,
//             contact: customerInfo.phone,
//           },
//           notes: {
//             address: customerInfo.street,
//           },
//         };

//         // Open Razorpay payment modal
//         const rzp1 = new window.Razorpay(options);
//         rzp1.open();
//       } else {
//         setPaymentLoading(false);
//         throw new Error("Failed to create Razorpay order");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Error with payment processing. Please try again later.");
//       setPaymentLoading(false);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.quantity * item?.productId?.sellingPrice,
//     0
//   );

//   // 🔥 Final Calculation
//   const finalAmount = totalPrice - discountAmount;

//   return (
//     <div className="container mx-auto p-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Left Column - Form Fields */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="email"
//               placeholder="Email Address"
//               onChange={handleChange}
//               value={customerInfo.email}
//               name="email"
//               className="border p-2 rounded-md outline-none focus:border-brand-primary"
//               required
//             />
//             <input
//               type="tel"
//               placeholder="Phone"
//               onChange={handleChange}
//               value={customerInfo.phone}
//               name="phone"
//               className="border p-2 rounded-md outline-none focus:border-brand-primary"
//               required
//             />
//           </div>

//           <div className="mt-6">
//             <div className="flex items-end mb-4">
//               <h2 className="text-2xl font-bold mr-2">Shipping Address</h2>
//               <button className="text-brand-primary font-semibold hover:underline" 
//               onClick={() => setShowModal(true)}>Change</button>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={customerInfo.firstName}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={customerInfo.lastName}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 value={customerInfo.country}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="street"
//                 placeholder="Street Address"
//                 value={customerInfo.street}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="District"
//                 value={customerInfo.city}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 value={customerInfo.state}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="postalCode"
//                 placeholder="Postal/Zip Code"
//                 value={customerInfo.postalCode}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//             </div>
//             {shippingDetailsFilled && (
//               <div
//                 className={`text-sm mt-1 font-semibold ${
//                   shippingCharge === 0 ? "text-green-600" : "text-brand-primary"
//                 }`}
//               >
//                 <p>{shippingMessage}</p>
//               </div>
//             )}

//             <div className="mt-4">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={billingSameAsShipping}
//                   onChange={(e) => setBillingSameAsShipping(e.target.checked)}
//                   className="mr-2 accent-brand-primary"
//                 />
//                 <span className="text-sm font-medium">Billing address same as shipping</span>
//               </label>
//             </div>
//             {!billingSameAsShipping && (
//               <>
//                 <h2 className="text-2xl font-bold mt-6 mb-4">
//                   Billing Address
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="First Name"
//                     value={billingAddress.firstName}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary capitalize"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Last Name"
//                     value={billingAddress.lastName}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   {/* ... (Other billing inputs) */}
//                   <input
//                     type="text"
//                     name="country"
//                     placeholder="Country"
//                     value={billingAddress.country}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="street"
//                     placeholder="Street Address"
//                     value={billingAddress.street}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="City"
//                     value={billingAddress.city}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="state"
//                     placeholder="State"
//                     value={billingAddress.state}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="postalCode"
//                     placeholder="Postal/Zip Code"
//                     value={billingAddress.postalCode}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Order Details */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//           <div className="">
//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               <>
//                 <div className="bg-white p-4 border border-color-brand-productCardBorder rounded-md mb-4 shadow-sm">
//                   {/* <h2 className="font-bold text-lg mb-4">Your Order</h2> */}
//                   {cartItems.map((item, index) => {
//                     // Handling Mixed Image Format Logic
//                     const images = item?.productId?.productImage || [];
//                     const firstMedia = images[0];
//                     const displayImage = typeof firstMedia === "string" ? firstMedia : firstMedia?.url;

//                     return (
//                       <div key={`item.id-${index}`} className="flex justify-between mb-2 border-b pb-2">
//                         <div>
//                           <h3 className="font-bold text-base md:text-lg mb-1 line-clamp-1">
//                             {item.productId.productName}
//                           </h3>
//                           <div className="w-24 h-24 bg-gray-50 rounded">
//                             <img
//                               src={displayImage}
//                               className="w-full h-full object-scale-down mix-blend-multiply"
//                               alt={item.productId.altTitle || "product"}
//                               title={item.productId.altTitle || "product"}
//                             />
//                           </div>
//                           <p className="font-bold text-sm mt-1">Qty: {item.quantity}</p>
//                         </div>
//                         <p className="font-bold flex items-center">
//                           <FaRupeeSign className="text-xs" />
//                           {item.quantity * item.productId.sellingPrice}
//                         </p>
//                       </div>
//                     );
//                   })}

//                   {/* 🔥 NEW: Available Coupons Suggestion */}
//                   <div className="mt-4 p-3 bg-red-50 border border-dashed border-red-200 rounded-lg">
//                     <div className="flex justify-between items-center mb-2">
//                         <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
//                             <FaTicketAlt />
//                             COUPONS FOR YOU
//                         </div>
//                         <button 
//                             onClick={() => setShowCouponModal(true)} 
//                             className="text-xs font-bold text-blue-600 hover:underline uppercase"
//                         >
//                             View All
//                         </button>
//                     </div>
//                     {availableCoupons.length > 0 ? (
//                         <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
//                             {availableCoupons.slice(0, 2).map(cp => (
//                                 <div 
//                                     key={cp._id} 
//                                     onClick={() => handleApplyCoupon(cp.code)}
//                                     className="bg-white border rounded p-2 min-w-[120px] cursor-pointer hover:shadow-sm transition-all"
//                                 >
//                                     <p className="text-[10px] font-bold text-gray-400 uppercase">Save more with</p>
//                                     <p className="text-xs font-black text-brand-primary">{cp.code}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-[10px] text-gray-500 italic">No specific coupons found for these items.</p>
//                     )}
//                   </div>

//                   {/* 🔥 NEW: Manual Coupon Input */}
//                   <div className="mt-4 flex gap-2">
//                       <div className="relative flex-1">
//                         <FaTicketAlt className="absolute left-3 top-3 text-gray-400" />
//                         <input 
//                             type="text" 
//                             placeholder="Enter Promo Code" 
//                             value={couponCode}
//                             onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                             className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-md text-sm outline-none focus:border-brand-primary uppercase font-mono"
//                         />
//                       </div>
//                       {!appliedCoupon ? (
//                         <button 
//                             onClick={() => handleApplyCoupon()}
//                             disabled={isCouponLoading || !couponCode}
//                             className="bg-brand-primary text-white px-6 py-2 rounded font-bold text-sm hover:bg-brand-primaryHover disabled:bg-gray-300"
//                         >
//                             {isCouponLoading ? "..." : "APPLY"}
//                         </button>
//                       ) : (
//                         <button 
//                             onClick={handleRemoveCoupon}
//                             className="bg-gray-100 text-red-600 px-6 py-2 rounded font-bold text-sm border border-red-100"
//                         >
//                             REMOVE
//                         </button>
//                       )}
//                   </div>

//                   <div className="mt-6">
//                     <a href="/cart" className="text-brand-primary font-bold flex items-center hover:underline">
//                       <FaEdit className="mr-1" /> Edit Cart
//                     </a>
//                   </div>
//                   <hr className="my-4" />
//                   <div className="flex justify-between">
//                     <p className="text-gray-600 font-medium">Subtotal</p>
//                     <p className="flex items-center font-bold">
//                       <FaRupeeSign className="mr-1 text-xs" />
//                       {totalPrice}
//                     </p>
//                   </div>

//                   {/* 🔥 NEW: User Friendly Discount Display */}
//                   {appliedCoupon && (
//                     <div className="flex justify-between mt-2 text-green-600 animate-pulse">
//                         <div className="flex items-center gap-1 font-bold text-sm uppercase">
//                             <FaGift />
//                             Coupon Savings ({appliedCoupon.coupon})
//                         </div>
//                         <p className="flex items-center font-black">
//                             - <FaRupeeSign className="mr-1 text-xs" />
//                             {discountAmount}
//                         </p>
//                     </div>
//                   )}

//                   <div className="flex justify-between mt-1">
//                     <p className="text-gray-600 font-medium">Shipping</p>
//                     <p className="font-bold text-green-600">{shippingCharge === 0 ? "Free" : shippingCharge}</p>
//                   </div>
//                   <hr className="my-4 border-gray-300" />
//                   <div className="flex justify-between font-bold text-xl">
//                     <p>Order Total</p>
//                     <p className="flex items-center text-brand-primary">
//                       <FaRupeeSign className="text-base mt-0.5" />
//                       {finalAmount}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleSubmit}
//                   className="mt-6 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold py-3 rounded-lg w-full transition-all active:scale-95"
//                   disabled={!isFormComplete()}
//                 >
//                   Checkout
//                 </button>

//                 {user?.role === ROLE.MANAGESALES && (
//                   <button
//                     onClick={handlePaymentLink}
//                     className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg w-full mt-3 transition-all active:scale-95"
//                     disabled={!isFormComplete() || paymentLinkLoading}
//                   >
//                     {paymentLinkLoading ? "Generating Link..." : "Pay via Payment Link"}
//                   </button>
//                 )}

//                 {user?.role === ROLE.MANAGESALES && (
//                   <div className="flex items-center mt-4 p-2 bg-gray-50 rounded border">
//                     <input
//                       type="checkbox"
//                       id="cashOnHand"
//                       checked={cashOnHand}
//                       onChange={(e) => setCashOnHand(e.target.checked)}
//                       className="mr-2 h-4 w-4 accent-brand-primary cursor-pointer"
//                     />
//                     <label htmlFor="cashOnHand" className="font-bold text-gray-700 cursor-pointer">
//                       Cash on Hand
//                     </label>
//                   </div>
//                 )}


//                 {paymentLoading && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
//                     <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl max-w-xs mx-auto">
//                       <Lottie
//                         loop
//                         animationData={animationData}
//                         play
//                         style={{ width: 150, height: 150 }}
//                       />
//                       <h2 className="text-xl font-bold text-gray-800 mb-2">
//                         Payment Processing
//                       </h2>
//                       <p className="text-gray-600 text-sm">
//                         Please do not refresh the page. This may take a few moments...
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Modal for Address List */}
//                 {showModal && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1500]">
//                     <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full m-4">
//                       <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Select an Address</h2>
//                       <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
//                         {user?.addresses.length > 0 ? (user?.addresses.map((address) => (
//                           <div
//                             key={address._id}
//                             className="border-2 border-gray-100 rounded-xl p-4 bg-white cursor-pointer hover:border-brand-primary hover:bg-red-50 transition-all"
//                             onClick={() => handleAddressClick(address)}
//                           >
//                             <p className="text-gray-900 font-bold">{address.street}</p>
//                             <p className="text-gray-600 text-sm mt-1">
//                               {address.city}, {address.state} - {address.pinCode}
//                             </p>
//                             {address.default && (
//                               <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
//                                 Default Address
//                               </span>
//                             )}
//                           </div>
//                         ))) : (<p className="text-gray-400 text-center py-4">No saved addresses found.</p>)}
//                       </div>
//                       <div className="flex gap-4 mt-8">
//                         <button
//                           className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition-all"
//                           onClick={() => setShowModal(false)}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* 🔥 NEW: Modal for Available Coupons */}
//                 {showCouponModal && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2001] p-4">
//                     <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
//                         <div className="flex justify-between items-center border-b pb-4 mb-4">
//                             <h3 className="font-bold text-xl flex items-center gap-2">
//                                 <FaTicketAlt className="text-brand-primary" />
//                                 Available Coupons
//                             </h3>
//                             <button onClick={() => setShowCouponModal(false)} className="text-gray-400 hover:text-black">✕</button>
//                         </div>
//                         <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
//                             {availableCoupons.length > 0 ? (
//                                 availableCoupons.map((cp) => (
//                                     <div key={cp._id} className="border-2 border-dashed border-brand-primary rounded-xl p-4 bg-red-50 relative group">
//                                         <div className="flex justify-between items-start">
//                                             <div>
//                                                 <p className="text-brand-primary font-black text-lg font-mono">{cp.code}</p>
//                                                 <p className="text-gray-800 font-bold text-sm mt-1">
//                                                     {cp.discountType === 'percentage' ? `${cp.discountValue}% Off` : `₹${cp.discountValue} Off`}
//                                                 </p>
//                                                 <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">
//                                                     Min Order: ₹{cp.minOrderAmount}
//                                                 </p>
//                                             </div>
//                                             <button 
//                                                 onClick={() => handleApplyCoupon(cp.code)}
//                                                 className="bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-primaryHover transition-all"
//                                             >
//                                                 APPLY
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-center py-10 text-gray-400">No applicable coupons found for your current cart.</p>
//                             )}
//                         </div>
//                         <button 
//                             className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-lg mt-6 hover:bg-gray-200 transition-all"
//                             onClick={() => setShowCouponModal(false)}
//                         >
//                             CLOSE
//                         </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default CheckoutPage;


// import React, { useContext, useState, useEffect } from "react";
// import { useSelector } from 'react-redux';
// import Lottie from "react-lottie-player";
// import animationData from "../assest/animations/payment-done.json";
// import SummaryApi from "../common";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaRupeeSign, FaTicketAlt, FaCheckCircle, FaPercentage } from "react-icons/fa"; // Added icons
// // import axios from "axios";
// import Context from '../context'
// import { toast } from "react-toastify";
// import ROLE from "../common/role";


// function CheckoutPage() {
//   const user = useSelector(state => state?.user?.user);
//   const { fetchUserAddToCart } = useContext(Context)
//   const navigate = useNavigate();


//   // useEffect(() => {
//   //   if (!user?._id) {
//   //     toast.warning("Please login to continue checkout");
//   //     navigate("/login", { state: { from: "/checkout" } });
//   //   }
//   // }, [user, navigate]);

//   const [customerInfo, setCustomerInfo] = useState({
//     email: user?.email || "",
//     phone: user?.mobile || "",
//     firstName: user?.name.split(" ")[0] || "",
//     lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });
//   const [cashOnHand, setCashOnHand] = useState(false);

//   const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
//   const [billingAddress, setBillingAddress] = useState({
//     firstName: "",
//     lastName: "",
//     country: "",
//     street: "",
//     city: "",
//     postalCode: "",
//     state: "",
//   });


//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [shippingCharge, setShippingCharge] = useState(0);
//   const [shippingMessage, setShippingMessage] = useState("");
//   // const [totalPrice, setTotalPrice] = useState(0);
//   const [shippingDetailsFilled, setShippingDetailsFilled] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [paymentLinkLoading, setPaymentLinkLoading] = useState(false);

//   // 🔥 NEW COUPON STATES
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [discountAmount, setCouponDiscount] = useState(0);
//   const [applicableCoupons, setApplicableCoupons] = useState([]);
//   const [isCouponLoading, setIsCouponLoading] = useState(false);

//   const handleAddressClick = (address) => {
//     setCustomerInfo((prevState) => ({
//       ...prevState,
//       ...address,
//       postalCode: address.pinCode
//     })); // Update selected address
//     setBillingAddress((prevState) => ({
//       ...prevState,
//       country: address.country,
//       street: address.street,
//       city: address.city,
//       postalCode: address.pinCode,
//       state: address.state,
//     }));
//     setShowModal(false); // Close the modal
//   };


//   useEffect(() => {
//     if (user) {
//       // Set the city, state, and postal code based on stored location data
//       setCustomerInfo((prevState) => ({
//         ...prevState,
//         email: user?.email || "",
//         phone: user?.mobile || "",
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));

//       setBillingAddress((prevState) => ({
//         ...prevState,
//         firstName: user?.name.split(" ")[0] || "",
//         lastName: user?.name.split(" ")[1] || user?.name.split(" ")[0] || "",
//         street: user?.address?.street || "",
//         country: user?.address?.country || "",
//         city: user?.address?.city || "",
//         postalCode: user?.address?.pinCode || "",
//         state: user?.address?.state || "",
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(SummaryApi.addToCartProductView.url, {
//           method: SummaryApi.addToCartProductView.method,
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.status === 401) {
//         toast.warning("Please login to continue checkout");
//         navigate("/login", { state: { from: "/checkout" } });
//         return;
//       }

//         const responseData = await response.json();

//         if (responseData.success) {
//           setCartItems(responseData.data);
//           if (responseData.data.length === 0) {
//             toast.info("Your cart is empty");
//             navigate("/cart");
//           } else {
//             // 🔥 Fetch applicable coupons once cart is loaded
//             fetchApplicableCoupons(responseData.data);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching cart data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   // 🔥 FETCH APPLICABLE COUPONS LOGIC
//   const fetchApplicableCoupons = async (items) => {
//     try {
//         const productIds = items.map(item => item.productId._id);
//         const response = await fetch(SummaryApi.getApplicableCoupons.url, {
//             method: "get", // Changed to POST to match your controller req.body expectation
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ productIds })
//         });
//         const data = await response.json();
//         if(data.success) {
//             setApplicableCoupons(data.data);
//         }
//     } catch (err) {
//         console.error("Coupon fetch error:", err);
//     }
//   };

//   // 🔥 VERIFY AND APPLY COUPON
//   const handleApplyCoupon = async (codeToApply = couponCode) => {
//     if (!codeToApply) return toast.error("Please enter a coupon code");
    
//     setIsCouponLoading(true);
//     try {
//         const response = await fetch(SummaryApi.verifyCoupon.url, {
//             method: SummaryApi.verifyCoupon.method,
//             headers: { "Content-Type" : "application/json" },
//             body: JSON.stringify({
//                 couponCode: codeToApply,
//                 cartItems: cartItems
//             })
//         });
//         const data = await response.json();
        
//         if(data.success) {
//             setAppliedCoupon(data.data);
//             setCouponDiscount(data.data.discountAmount);
//             setCouponCode(data.data.coupon);
//             toast.success("Coupon Applied!");
//         } else {
//             toast.error(data.message);
//             setAppliedCoupon(null);
//             setCouponDiscount(0);
//         }
//     } catch (err) {
//         toast.error("Error verifying coupon");
//     } finally {
//         setIsCouponLoading(false);
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponDiscount(0);
//     setCouponCode("");
//     toast.info("Coupon removed");
//   }


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBillingChange = (e) => {
//     const { name, value } = e.target;
//     setBillingAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const isFormComplete = () => {
//     const {
//       email,
//       phone,
//       firstName,
//       lastName,
//       country,
//       street,
//       city,
//       postalCode,
//       state,
//     } = customerInfo;
//     const addressComplete =
//       billingSameAsShipping ||
//       Object.values(billingAddress).every((field) => field.trim() !== "");
//     return (
//       [
//         email,
//         phone,
//         firstName,
//         lastName,
//         country,
//         street,
//         city,
//         postalCode,
//         state,
//       ].every((field) => field.trim() !== "") && addressComplete
//     );
//   };

//   //  Check if the postal code is valid for Tamil Nadu (typically starts with '6')
//   const isTamilNaduPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);

//     // Validate that the pin is within Tamil Nadu's postal range
//     if (pin >= 600001 && pin <= 669999) {
//       // Exclude Pondicherry postal codes (605001 to 605110)
//       return !(pin >= 605001 && pin <= 605110);
//     }

//     // Return false for any pin code outside Tamil Nadu's range
//     return false;
//   };

//   // Check if the postal code is valid for Kerala (starts with '6' but in range 680001 - 689999)
//   const isKeralaPostalCode = (postalCode) => {
//     const pin = parseInt(postalCode);
//     return pin >= 670001 && pin <= 689999; // Kerala's range
//   };

//   useEffect(() => {
//     const { state, postalCode } = customerInfo;

//     // Check if shipping details are filled
//     const isShippingDetailsFilled =
//       state.trim() !== "" &&
//       postalCode.trim() !== "" &&
//       customerInfo.street.trim() !== "" &&
//       customerInfo.city.trim() !== "" &&
//       customerInfo.country.trim() !== "";

//     setShippingDetailsFilled(isShippingDetailsFilled);

//     if (state && postalCode) {
//       if (isTamilNaduPostalCode(postalCode)) {
//         setShippingCharge(0); // Free shipping for Tamil Nadu
//         setShippingMessage("Shipping is available in Tamil Nadu");
//       } else if (isKeralaPostalCode(postalCode)) {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       } else {
//         setShippingCharge("Not Available");
//         setShippingMessage(
//           "Service is currently available only in Tamil Nadu."
//         );
//       }
//     } else {
//       setShippingMessage("");
//     }
//   }, [ customerInfo]);

// const handlePaymentLink = async () => {
//   const { postalCode, street } = customerInfo;

//   // Validate input
//   if (!postalCode || !street) {
//     toast.error("Please fill out all shipping details before proceeding.");
//     return;
//   }

//   // Ensure only Tamil Nadu postal codes are allowed
//   if (!isTamilNaduPostalCode(postalCode)) {
//     toast.error("Shipping is available only in Tamil Nadu.");
//     return;
//   }

//   // Proceed with free shipping
//   if (shippingCharge === 0) {
//     // OK to proceed
//   } else {
//     // Fallback in case some logic changes
//     toast.error("Invalid shipping configuration.");
//     return;
//   }

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }         
//   setPaymentLinkLoading(true);
//   try {
//     const billingAddressToSend = billingSameAsShipping
//       ? { ...customerInfo }
//       : billingAddress;

//     const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//     const payload = {
//       cartItems,
//       customerInfo: {
//         ...customerInfo,
//         billingAddress: billingAddressToSend,
//       },
//       billingSameAsShipping,
//       shippingOption,
//       usePaymentLink: true, // Important!
//       couponCode: appliedCoupon?.coupon || null, // 🔥 Added Coupon to Link
//       discountAmount: discountAmount // 🔥 Added Discount to Link
//     };

//     const response = await fetch(SummaryApi.payment.url, {
//       method: SummaryApi.payment.method,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     if (data.success && data.paymentLink) {
//       window.open(data.paymentLink, "_blank");
//       toast.success("Payment link opened in new tab!");
//     } else {
//       toast.error(data.message || "Failed to generate payment link.");
//     }
//   } catch (error) {
//     toast.error("Error generating payment link.");
//   } finally {
//     setPaymentLinkLoading(false);
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Ensure all shipping details are provided
//     if (!customerInfo.postalCode || !customerInfo.street) {
//       toast.error("Please fill out all shipping details before proceeding.");
//       return;
//     }

//     // Shipping charge checks
//     if (shippingCharge === 0) {
//       // Free shipping, proceed without alert
//     } else if (shippingCharge === "Not Available") {
//       toast.error(shippingMessage);
//       return;
//     } else {
//       toast.error(`Shipping charge: ?${shippingCharge}`);
//     }
// // CASH ON HAND FLOW
//   if (cashOnHand && user?.role === ROLE.MANAGESALES) {
//     try {
//       const payload = {
//         cartItems,
//         customerInfo,
//         billingSameAsShipping,
//         paymentMode: "CASH_ON_HAND",
//         couponCode: appliedCoupon?.coupon || null, // 🔥 Added Coupon
//         discountAmount: discountAmount // 🔥 Added Discount
//       };

//       const response = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Order confirmed (Cash on Hand)");
//         fetchUserAddToCart();
//         navigate("/success");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       toast.error("Failed to confirm cash order");
//     }
//     return; // 🚨 STOP Razorpay
//   }

//     try {
//       // const response = await axios.post(
//       //   "http://localhost:8080/api/validate-address",
//       //   customerInfo
//       // );
      

//       // Prepare the payload for the payment API
//       const billingAddressToSend = billingSameAsShipping
//         ? { ...customerInfo }
//         : billingAddress;

//       // Determine the shipping option name
//       const shippingOption = shippingCharge === 0 ? "Free" : "Paid";

//       const payload = {
//         cartItems,
//         customerInfo: {
//           ...customerInfo,
//           billingAddress: billingAddressToSend,
//         },
//         billingSameAsShipping,
//         shippingOption, // Add the shipping option
//         couponCode: appliedCoupon?.coupon || null, // 🔥 Added Coupon
//         discountAmount: discountAmount // 🔥 Added Discount
//       };

//       // Send the payload to the payment API
//       const paymentResponse = await fetch(SummaryApi.payment.url, {
//         method: SummaryApi.payment.method,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const paymentResponseData = await paymentResponse.json();

//       if (paymentResponseData.success) {
//         // Razorpay options for initiating the payment
//         const options = {
//           key: "rzp_live_dEoDcnBwCOkfCt", // Razorpay Live key
//           // key: "rzp_test_66VslSnaYXyl0i", // Razorpay test key
//           amount: (totalPrice - discountAmount) * 100, // 🔥 Updated amount (subtotal - discount)
//           currency: "INR",
//           name: "Relda India",
//           description: "e-commerce",
//           image: "/client/src/assest/banner/logo.png",
//           order_id: paymentResponseData.orderId,
//           handler: async function (response) {
//             // Handle Razorpay payment response
//             const paymentMethod =
//               response.payment_method_type || response.payment_mode || "default";
//             setPaymentLoading(true);
//             const paymentVerification = await fetch(SummaryApi.verpay.url, {
//               method: SummaryApi.verpay.method,
//               credentials: "include",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpaySignature: response.razorpay_signature,
//                 paymentMethod,
//                 cartItems,
//                 customerInfo,
//                 couponCode: appliedCoupon?.coupon || null, // 🔥 Verification Coupon
//                 discountAmount: discountAmount // 🔥 Verification Discount
//               }),
//             });            

//             const paymentVerificationData = await paymentVerification.json();

//             if (paymentVerificationData.success) {
              
//               toast.success("Payment successful!");
//               navigate("/success"); // Redirect to success page
//               fetchUserAddToCart();
//             } else {
//               toast.error(
//                 "Payment verification failed. Please contact support."
//               );
//               navigate("/cancel"); // Redirect to failure page
//             }
//           },
//           prefill: {
//             name: customerInfo.firstName + " " + customerInfo.lastName,
//             email: customerInfo.email,
//             contact: customerInfo.phone,
//           },
//           notes: {
//             address: customerInfo.street,
//           },
//         };

//         // Open Razorpay payment modal
//         const rzp1 = new window.Razorpay(options);
//         rzp1.open();
//       } else {
//         setPaymentLoading(false);
//         throw new Error("Failed to create Razorpay order");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Error with payment processing. Please try again later.");
//       setPaymentLoading(false);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.quantity * item?.productId?.sellingPrice,
//     0
//   );

//   return (
//     <div className="container mx-auto p-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Left Column - Form Fields */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="email"
//               placeholder="Email Address"
//               onChange={handleChange}
//               value={customerInfo.email}
//               name="email"
//               className="border p-2 rounded-md outline-none focus:border-brand-primary"
//               required
//             />
//             <input
//               type="tel"
//               placeholder="Phone"
//               onChange={handleChange}
//               value={customerInfo.phone}
//               name="phone"
//               className="border p-2 rounded-md outline-none focus:border-brand-primary"
//               required
//             />
//           </div>

//           <div className="mt-6">
//             <div className="flex items-end mb-4">
//               <h2 className="text-2xl font-bold mr-2">Shipping Address</h2>
//               <button className="text-brand-primary font-semibold hover:underline" 
//               onClick={() => setShowModal(true)}>Change</button>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={customerInfo.firstName}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={customerInfo.lastName}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 value={customerInfo.country}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="street"
//                 placeholder="Street Address"
//                 value={customerInfo.street}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="District"
//                 value={customerInfo.city}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 value={customerInfo.state}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//               <input
//                 type="text"
//                 name="postalCode"
//                 placeholder="Postal/Zip Code"
//                 value={customerInfo.postalCode}
//                 onChange={handleChange}
//                 className="border p-2 rounded outline-none focus:border-brand-primary"
//                 required
//               />
//             </div>
//             {shippingDetailsFilled && (
//               <div
//                 className={`text-sm mt-1 font-semibold ${
//                   shippingCharge === 0 ? "text-green-600" : "text-brand-primary"
//                 }`}
//               >
//                 <p>{shippingMessage}</p>
//               </div>
//             )}

//             <div className="mt-4">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={billingSameAsShipping}
//                   onChange={(e) => setBillingSameAsShipping(e.target.checked)}
//                   className="mr-2 accent-brand-primary"
//                 />
//                 <span className="text-sm font-medium">Billing address same as shipping</span>
//               </label>
//             </div>
//             {!billingSameAsShipping && (
//               <>
//                 <h2 className="text-2xl font-bold mt-6 mb-4">
//                   Billing Address
//                 </h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="First Name"
//                     value={billingAddress.firstName}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary capitalize"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Last Name"
//                     value={billingAddress.lastName}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   {/* ... (Other billing inputs) */}
//                   <input
//                     type="text"
//                     name="country"
//                     placeholder="Country"
//                     value={billingAddress.country}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="street"
//                     placeholder="Street Address"
//                     value={billingAddress.street}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="city"
//                     placeholder="City"
//                     value={billingAddress.city}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="state"
//                     placeholder="State"
//                     value={billingAddress.state}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                   <input
//                     type="text"
//                     name="postalCode"
//                     placeholder="Postal/Zip Code"
//                     value={billingAddress.postalCode}
//                     onChange={handleBillingChange}
//                     className="border p-2 rounded outline-none focus:border-brand-primary"
//                     required
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Order Details */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//           <div className="">
//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               <>
//                 <div className="bg-white p-4 border border-color-brand-productCardBorder rounded-md mb-4 shadow-sm">
//                   {/* <h2 className="font-bold text-lg mb-4">Your Order</h2> */}
//                   {cartItems.map((item, index) => {
//                     // Handling Mixed Image Format Logic
//                     const images = item?.productId?.productImage || [];
//                     const firstMedia = images[0];
//                     const displayImage = typeof firstMedia === "string" ? firstMedia : firstMedia?.url;

//                     return (
//                       <div key={`item.id-${index}`} className="flex justify-between mb-2 border-b pb-2">
//                         <div>
//                           <h3 className="font-bold text-base md:text-lg mb-1 line-clamp-1">
//                             {item.productId.productName}
//                           </h3>
//                           <div className="w-24 h-24 bg-gray-50 rounded">
//                             <img
//                               src={displayImage}
//                               className="w-full h-full object-scale-down mix-blend-multiply"
//                               alt={item.productId.altTitle || "product"}
//                               title={item.productId.altTitle || "product"}
//                             />
//                           </div>
//                           <p className="font-bold text-sm mt-1">Qty: {item.quantity}</p>
//                         </div>
//                         <p className="font-bold flex items-center">
//                           <FaRupeeSign className="text-xs" />
//                           {item.quantity * item.productId.sellingPrice}
//                         </p>
//                       </div>
//                     );
//                   })}

//                   {/* 🔥 APPLICABLE COUPONS LIST */}
//                   {applicableCoupons.length > 0 && !appliedCoupon && (
//                     <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
//                         <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1">
//                             <FaTicketAlt /> AVAILABLE OFFERS FOR YOU:
//                         </p>
//                         <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
//                             {applicableCoupons.map((cp) => (
//                                 <div 
//                                     key={cp._id} 
//                                     onClick={() => handleApplyCoupon(cp.code)}
//                                     className="min-w-[140px] bg-white border border-dashed border-red-400 p-2 rounded cursor-pointer hover:bg-red-100 transition-all"
//                                 >
//                                     <p className="text-xs font-bold text-gray-800">{cp.code}</p>
//                                     <p className="text-[10px] text-green-600 font-bold">
//                                         {cp.discountType === 'percentage' ? `${cp.discountValue}% OFF` : `₹${cp.discountValue} OFF`}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                   )}

//                   {/* 🔥 COUPON INPUT FIELD */}
//                   <div className="mt-6">
//                     <div className="flex items-center gap-2 mb-2">
//                         <FaTicketAlt className="text-brand-primary" />
//                         <span className="font-bold text-sm uppercase text-gray-700">Have a Coupon?</span>
//                     </div>
                    
//                     {!appliedCoupon ? (
//                       <div className="flex gap-2">
//                         <input
//                           type="text"
//                           placeholder="ENTER CODE"
//                           value={couponCode}
//                           onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                           className="flex-1 border p-2 rounded outline-none text-sm font-mono focus:border-brand-primary"
//                         />
//                         <button
//                           onClick={() => handleApplyCoupon()}
//                           disabled={isCouponLoading || !couponCode}
//                           className="bg-brand-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-brand-primaryHover transition-all disabled:bg-gray-300"
//                         >
//                           {isCouponLoading ? "..." : "APPLY"}
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200">
//                         <div className="flex items-center gap-2">
//                           <FaCheckCircle className="text-green-600" />
//                           <div>
//                             <p className="text-xs font-bold text-green-700 uppercase">Code "{appliedCoupon.coupon}" Applied</p>
//                             <p className="text-[10px] text-green-600 font-medium">You saved ₹{discountAmount} on this order!</p>
//                           </div>
//                         </div>
//                         <button 
//                           onClick={handleRemoveCoupon}
//                           className="text-xs font-bold text-red-600 hover:underline"
//                         >
//                           REMOVE
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-4">
//                     <a href="/cart" className="text-brand-primary font-bold flex items-center hover:underline">
//                       <FaEdit className="mr-1" /> Edit Cart
//                     </a>
//                   </div>
//                   <hr className="my-4" />
//                   <div className="flex justify-between">
//                     <p className="text-gray-600 font-medium">Subtotal</p>
//                     <p className="flex items-center font-bold">
//                       <FaRupeeSign className="mr-1 text-xs" />
//                       {totalPrice}
//                     </p>
//                   </div>

//                   {/* 🔥 DISPLAY DISCOUNT IN SUMMARY */}
//                   {discountAmount > 0 && (
//                     <div className="flex justify-between mt-1 items-center">
//                         <div className="flex items-center gap-1">
//                             <FaPercentage className="text-green-600 text-[10px]" />
//                             <p className="text-green-600 font-medium text-sm">Coupon Discount</p>
//                         </div>
//                         <p className="flex items-center font-bold text-green-600">
//                             - <FaRupeeSign className="mr-1 text-xs" />
//                             {discountAmount}
//                         </p>
//                     </div>
//                   )}

//                   <div className="flex justify-between mt-1">
//                     <p className="text-gray-600 font-medium">Shipping</p>
//                     <p className="font-bold text-green-600">{shippingCharge === 0 ? "Free" : shippingCharge}</p>
//                   </div>
//                   <hr className="my-4 border-gray-300" />
//                   <div className="flex justify-between font-bold text-xl">
//                     <p>Order Total</p>
//                     <p className="flex items-center">
//                       <FaRupeeSign className="text-base mt-0.5" />
//                       {totalPrice - discountAmount} {/* 🔥 Calculated Final Price */}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleSubmit}
//                   className="mt-6 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold py-3 rounded-lg w-full transition-all active:scale-95"
//                   disabled={!isFormComplete()}
//                 >
//                   Checkout
//                 </button>

//                 {user?.role === ROLE.MANAGESALES && (
//                   <button
//                     onClick={handlePaymentLink}
//                     className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg w-full mt-3 transition-all active:scale-95"
//                     disabled={!isFormComplete() || paymentLinkLoading}
//                   >
//                     {paymentLinkLoading ? "Generating Link..." : "Pay via Payment Link"}
//                   </button>
//                 )}

//                 {user?.role === ROLE.MANAGESALES && (
//                   <div className="flex items-center mt-4 p-2 bg-gray-50 rounded border">
//                     <input
//                       type="checkbox"
//                       id="cashOnHand"
//                       checked={cashOnHand}
//                       onChange={(e) => setCashOnHand(e.target.checked)}
//                       className="mr-2 h-4 w-4 accent-brand-primary cursor-pointer"
//                     />
//                     <label htmlFor="cashOnHand" className="font-bold text-gray-700 cursor-pointer">
//                       Cash on Hand
//                     </label>
//                   </div>
//                 )}


//                 {paymentLoading && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
//                     <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl max-w-xs mx-auto">
//                       <Lottie
//                         loop
//                         animationData={animationData}
//                         play
//                         style={{ width: 150, height: 150 }}
//                       />
//                       <h2 className="text-xl font-bold text-gray-800 mb-2">
//                         Payment Processing
//                       </h2>
//                       <p className="text-gray-600 text-sm">
//                         Please do not refresh the page. This may take a few moments...
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Modal for Address List */}
//                 {showModal && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1500]">
//                     <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full m-4">
//                       <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Select an Address</h2>
//                       <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
//                         {user?.addresses.length > 0 ? (user?.addresses.map((address) => (
//                           <div
//                             key={address._id}
//                             className="border-2 border-gray-100 rounded-xl p-4 bg-white cursor-pointer hover:border-brand-primary hover:bg-red-50 transition-all"
//                             onClick={() => handleAddressClick(address)}
//                           >
//                             <p className="text-gray-900 font-bold">{address.street}</p>
//                             <p className="text-gray-600 text-sm mt-1">
//                               {address.city}, {address.state} - {address.pinCode}
//                             </p>
//                             {address.default && (
//                               <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
//                                 Default Address
//                               </span>
//                             )}
//                           </div>
//                         ))) : (<p className="text-gray-400 text-center py-4">No saved addresses found.</p>)}
//                       </div>
//                       <div className="flex gap-4 mt-8">
//                         <button
//                           className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition-all"
//                           onClick={() => setShowModal(false)}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default CheckoutPage;

import React, { useContext, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Lottie from "react-lottie-player";
import animationData from "../assest/animations/payment-done.json";
import SummaryApi from "../common";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaRupeeSign, FaTicketAlt, FaTimes, FaCheckCircle, FaPercentage } from "react-icons/fa";
// import axios from "axios";
import Context from '../context'
import { toast } from "react-toastify";
import ROLE from "../common/role";


function CheckoutPage() {
  const user = useSelector(state => state?.user?.user);
  const { fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate();


  // useEffect(() => {
  //   if (!user?._id) {
  //     toast.warning("Please login to continue checkout");
  //     navigate("/login", { state: { from: "/checkout" } });
  //   }
  // }, [user, navigate]);

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
  const [cashOnHand, setCashOnHand] = useState(false);

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
  // const [totalPrice, setTotalPrice] = useState(0);
  const [shippingDetailsFilled, setShippingDetailsFilled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentLinkLoading, setPaymentLinkLoading] = useState(false);

  // --- Coupon States ---
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [applicableCoupons, setApplicableCoupons] = useState([]);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [showCouponsModal, setShowCouponsModal] = useState(false); // To toggle Coupon Modal

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

        if (response.status === 401) {
        toast.warning("Please login to continue checkout");
        navigate("/login", { state: { from: "/checkout" } });
        return;
      }

        const responseData = await response.json();

        if (responseData.success) {
          setCartItems(responseData.data);
          if (responseData.data.length === 0) {
            toast.info("Your cart is empty");
            navigate("/cart");
          } else {
            // 🔥 Fetch applicable coupons for these items
            fetchApplicableCoupons(responseData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 🔥 FETCH APPLICABLE COUPONS (GET Method)
  const fetchApplicableCoupons = async (items) => {
    try {
        // 1. Extract IDs from cart items
        const productIds = items.map(item => item.productId._id);

        // 2. We must use POST to send data in the 'body'
        // Your backend uses: const { productIds } = req.body;
        const response = await fetch(SummaryApi.getApplicableCoupons.url, {
            method: "POST", // Changed from GET to POST
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ 
                productIds: productIds 
            }) // Correctly wrapped in an object
        });

        const data = await response.json();

        if (data.success) {
            setApplicableCoupons(data.data);
        } else {
            console.error("Coupon error:", data.message);
        }
    } catch (err) {
        console.error("Coupon list fetch error:", err);
    }
  };

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
  }, [ customerInfo]);

  // --- Apply Coupon Logic ---
  const handleApplyCoupon = async (codeToApply = couponCode) => {
    if (!codeToApply) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsCouponLoading(true);
    try {
      const response = await fetch(SummaryApi.verifyCoupon.url, { 
        method: SummaryApi.verifyCoupon.method, // POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          couponCode: codeToApply,
          cartItems: cartItems
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.data);
        setCouponDiscount(data.data.discountAmount);
        setCouponCode(data.data.coupon);
        setShowCouponsModal(false); // Close modal if user applied from there
        toast.success("Coupon applied successfully!");
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (error) {
      toast.error("Error applying coupon");
    } finally {
      setIsCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    toast.info("Coupon removed");
  };

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
      couponCode: appliedCoupon?.coupon || null, 
      couponDiscount: couponDiscount 
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
// CASH ON HAND FLOW
  if (cashOnHand && user?.role === ROLE.MANAGESALES) {
    try {
      const payload = {
        cartItems,
        customerInfo,
        billingSameAsShipping,
        paymentMode: "CASH_ON_HAND",
        couponCode: appliedCoupon?.coupon || null,
        couponDiscount: couponDiscount
      };

      const response = await fetch(SummaryApi.payment.url, {
        method: SummaryApi.payment.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order confirmed (Cash on Hand)");
        fetchUserAddToCart();
        navigate("/success");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to confirm cash order");
    }
    return; // 🚨 STOP Razorpay
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
        couponCode: appliedCoupon?.coupon || null,
        couponDiscount: couponDiscount
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
          // key: "rzp_test_66VslSnaYXyl0i", // Razorpay test key
          amount: (totalPrice - couponDiscount) * 100, // 🔥 Updated to final amount
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
                couponCode: appliedCoupon?.coupon || null,
                couponDiscount: couponDiscount
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
              className="border p-2 rounded-md outline-none focus:border-brand-primary"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              onChange={handleChange}
              value={customerInfo.phone}
              name="phone"
              className="border p-2 rounded-md outline-none focus:border-brand-primary"
              required
            />
          </div>

          <div className="mt-6">
            <div className="flex items-end mb-4">
              <h2 className="text-2xl font-bold mr-2">Shipping Address</h2>
              <button className="text-brand-primary font-semibold hover:underline" 
              onClick={() => setShowModal(true)}>Change</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={customerInfo.firstName}
                onChange={handleChange}
                className="border p-2 rounded outline-none focus:border-brand-primary"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={customerInfo.lastName}
                onChange={handleChange}
                className="border p-2 rounded outline-none focus:border-brand-primary"
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={customerInfo.country}
                onChange={handleChange}
                className="border p-2 rounded outline-none focus:border-brand-primary"
                required
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={customerInfo.street}
                onChange={handleChange}
                className="border p-2 rounded outline-none focus:border-brand-primary"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="District"
                value={customerInfo.city}
                onChange={handleChange}
                className="border p-2 rounded outline-none focus:border-brand-primary"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={customerInfo.state}
                onChange={handleChange}
                className="border p-2 rounded outline-none focus:border-brand-primary"
                required
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal/Zip Code"
                value={customerInfo.postalCode}
                onChange={handleChange}
                className="border p-2 rounded outline-none focus:border-brand-primary"
                required
              />
            </div>
            {shippingDetailsFilled && (
              <div
                className={`text-sm mt-1 font-semibold ${
                  shippingCharge === 0 ? "text-green-600" : "text-brand-primary"
                }`}
              >
                <p>{shippingMessage}</p>
              </div>
            )}

            <div className="mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  className="mr-2 accent-brand-primary"
                />
                <span className="text-sm font-medium">Billing address same as shipping</span>
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
                    className="border p-2 rounded outline-none focus:border-brand-primary capitalize"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={billingAddress.lastName}
                    onChange={handleBillingChange}
                    className="border p-2 rounded outline-none focus:border-brand-primary"
                    required
                  />
                  {/* ... (Other billing inputs) */}
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={billingAddress.country}
                    onChange={handleBillingChange}
                    className="border p-2 rounded outline-none focus:border-brand-primary"
                    required
                  />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={billingAddress.street}
                    onChange={handleBillingChange}
                    className="border p-2 rounded outline-none focus:border-brand-primary"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={billingAddress.city}
                    onChange={handleBillingChange}
                    className="border p-2 rounded outline-none focus:border-brand-primary"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={billingAddress.state}
                    onChange={handleBillingChange}
                    className="border p-2 rounded outline-none focus:border-brand-primary"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal/Zip Code"
                    value={billingAddress.postalCode}
                    onChange={handleBillingChange}
                    className="border p-2 rounded outline-none focus:border-brand-primary"
                    required
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column - Order Details */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="bg-white p-4 border border-color-brand-productCardBorder rounded-md mb-4 shadow-sm">
                  {/* <h2 className="font-bold text-lg mb-4">Your Order</h2> */}
                  {cartItems.map((item, index) => {
                    // Handling Mixed Image Format Logic
                    const images = item?.productId?.productImage || [];
                    const firstMedia = images[0];
                    const displayImage = typeof firstMedia === "string" ? firstMedia : firstMedia?.url;

                    return (
                      <div key={`item.id-${index}`} className="flex justify-between mb-2 border-b pb-2">
                        <div>
                          <h3 className="font-bold text-base md:text-lg mb-1 line-clamp-1">
                            {item.productId.productName}
                          </h3>
                          <div className="w-24 h-24 bg-gray-50 rounded">
                            <img
                              src={displayImage}
                              className="w-full h-full object-scale-down mix-blend-multiply"
                              alt={item.productId.altTitle || "product"}
                              title={item.productId.altTitle || "product"}
                            />
                          </div>
                          <p className="font-bold text-sm mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold flex items-center">
                          <FaRupeeSign className="text-xs" />
                          {item.quantity * item.productId.sellingPrice}
                        </p>
                      </div>
                    );
                  })}

                  {/* 🔥 COUPON SECTION */}
                  <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-dashed border-gray-300">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <FaTicketAlt className="text-brand-primary" />
                            <span className="font-bold text-sm uppercase text-gray-700 tracking-wider">Apply Coupon</span>
                        </div>
                        {applicableCoupons.length > 0 && !appliedCoupon && (
                            <button 
                                onClick={() => setShowCouponsModal(true)}
                                className="text-xs font-bold text-brand-primary hover:underline"
                            >
                                VIEW ALL({applicableCoupons.length})
                            </button>
                        )}
                    </div>
                    
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="ENTER CODE"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 border p-2 rounded outline-none text-sm font-mono focus:border-brand-primary bg-white"
                        />
                        <button
                          onClick={() => handleApplyCoupon()}
                          disabled={isCouponLoading || !couponCode}
                          className="bg-brand-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-brand-primaryHover transition-all disabled:bg-gray-300"
                        >
                          {isCouponLoading ? "..." : "APPLY"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200 shadow-sm">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-600 text-lg" />
                          <div>
                            <p className="text-xs font-bold text-green-700 uppercase">'{appliedCoupon.coupon}' Applied</p>
                            <p className="text-[10px] text-green-600 font-medium">You saved ₹{couponDiscount} on this order!</p>
                          </div>
                        </div>
                        <button 
                          onClick={handleRemoveCoupon}
                          className="text-xs font-bold text-red-600 hover:underline"
                        >
                          REMOVE
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <a href="/cart" className="text-brand-primary font-bold flex items-center hover:underline">
                      <FaEdit className="mr-1" /> Edit Cart
                    </a>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between">
                    <p className="text-gray-600 font-medium">Subtotal</p>
                    <p className="flex items-center font-bold">
                      <FaRupeeSign className="mr-1 text-xs" />
                      {totalPrice}
                    </p>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between mt-1 items-center">
                        <div className="flex items-center gap-1">
                            <FaPercentage className="text-green-600 text-[10px]" />
                            <p className="text-green-600 font-medium text-sm">Coupon Discount</p>
                        </div>
                        <p className="flex items-center font-bold text-green-600">
                            - <FaRupeeSign className="mr-1 text-xs" />
                            {couponDiscount}
                        </p>
                    </div>
                  )}

                  <div className="flex justify-between mt-1">
                    <p className="text-gray-600 font-medium">Shipping</p>
                    <p className="font-bold text-green-600">{shippingCharge === 0 ? "Free" : shippingCharge}</p>
                  </div>
                  <hr className="my-4 border-gray-300" />
                  <div className="flex justify-between font-bold text-xl">
                    <p>Order Total</p>
                    <p className="flex items-center">
                      <FaRupeeSign className="text-base mt-0.5" />
                      {totalPrice - couponDiscount} 
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-6 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold py-2 rounded-lg w-full transition-all active:scale-95"
                  disabled={!isFormComplete()}
                >
                  Checkout
                </button>

                {user?.role === ROLE.MANAGESALES && (
                  <button
                    onClick={handlePaymentLink}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg w-full mt-3 transition-all active:scale-95"
                    disabled={!isFormComplete() || paymentLinkLoading}
                  >
                    {paymentLinkLoading ? "Generating Link..." : "Pay via Payment Link"}
                  </button>
                )}

                {user?.role === ROLE.MANAGESALES && (
                  <div className="flex items-center mt-4 p-2 bg-gray-50 rounded border">
                    <input
                      type="checkbox"
                      id="cashOnHand"
                      checked={cashOnHand}
                      onChange={(e) => setCashOnHand(e.target.checked)}
                      className="mr-2 h-4 w-4 accent-brand-primary cursor-pointer"
                    />
                    <label htmlFor="cashOnHand" className="font-bold text-gray-700 cursor-pointer">
                      Cash on Hand
                    </label>
                  </div>
                )}


                {paymentLoading && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl max-w-xs mx-auto">
                      <Lottie
                        loop
                        animationData={animationData}
                        play
                        style={{ width: 150, height: 150 }}
                      />
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Payment Processing
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Please do not refresh the page. This may take a few moments...
                      </p>
                    </div>
                  </div>
                )}

                {/* Modal for Address List */}
                {showModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1500]">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full m-4">
                      <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Select an Address</h2>
                      <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                        {user?.addresses.length > 0 ? (user?.addresses.map((address) => (
                          <div
                            key={address._id}
                            className="border-2 border-gray-100 rounded-xl p-4 bg-white cursor-pointer hover:border-brand-primary hover:bg-red-50 transition-all"
                            onClick={() => handleAddressClick(address)}
                          >
                            <p className="text-gray-900 font-bold">{address.street}</p>
                            <p className="text-gray-600 text-sm mt-1">
                              {address.city}, {address.state} - {address.pinCode}
                            </p>
                            {address.default && (
                              <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                Default Address
                              </span>
                            )}
                          </div>
                        ))) : (<p className="text-gray-400 text-center py-4">No saved addresses found.</p>)}
                      </div>
                      <div className="flex gap-4 mt-8">
                        <button
                          className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300 transition-all"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 AVAILABLE COUPONS MODAL */}
      {showCouponsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[2500] p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="bg-brand-primary p-4 text-white flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-2">
                        <FaTicketAlt />
                        <h2 className="font-bold tracking-wide">Available Coupons</h2>
                    </div>
                    <button 
                        onClick={() => setShowCouponsModal(false)} 
                        className="text-white hover:bg-white hover:text-brand-primary p-2 rounded-full transition-all"
                    >
                        <FaTimes />
                    </button>
                </div>
                
                {/* Modal Content */}
                <div className="p-4 flex-1 overflow-y-auto max-h-[60vh] space-y-4 bg-gray-50 custom-scrollbar">
                    {applicableCoupons.length > 0 ? (
                        applicableCoupons.map((coupon) => (
                            <div key={coupon._id} className="border-2 border-dashed border-gray-200 rounded-xl p-4 relative bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-brand-primary bg-opacity-10 text-brand-primary px-3 py-1 rounded font-mono font-bold text-sm tracking-widest border border-brand-primary border-opacity-20 uppercase">
                                                {coupon.code}
                                            </span>
                                        </div>
                                        <p className="text-green-600 font-extrabold text-lg mt-2">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
                                        </p>
                                        <div className="mt-2 space-y-0.5">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                                Min Order: ₹{coupon.minOrderAmount}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                Expires on: {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleApplyCoupon(coupon.code)}
                                        className="bg-brand-primary text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-brand-primaryHover shadow-lg active:scale-90 transition-all uppercase"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <FaTicketAlt className="text-gray-200 text-5xl mx-auto mb-2" />
                            <p className="text-gray-400 font-medium">No coupons currently available.</p>
                        </div>
                    )}
                </div>
                
                {/* Modal Footer */}
                <div className="p-4 bg-white border-t text-center text-[10px] text-gray-400 font-medium">
                    Please note that coupons are valid only for a limited period and specific products.
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
export default CheckoutPage;