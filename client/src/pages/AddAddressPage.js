// import React, { useState, useEffect } from "react";

// const AddAddress = () => {
//   const [addresses, setAddresses] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   const [form, setForm] = useState({
//     _id: "",  // Added _id to handle editing
//     country: "",
//     fullName: "",
//     phoneNumber: "",
//     pinCode: "",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     default: false,
//   });

//   // Fetch all addresses on component mount
//   useEffect(() => {
//     fetch("http://localhost:8080/api/allAddress", {
//       method: "GET",
//       credentials : "include",
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Check if the data is an array before setting state
//         if (Array.isArray(data)) {
//           setAddresses(data);
//         } else {
//           console.error("Expected an array of addresses but got:", data);
//           setAddresses([]);
//         }
//       })
//       .catch((error) => console.error("Error fetching addresses:", error));
//   }, []);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Handle form submission to add or update address
//   const handleSubmit = (e) => {
//     e.preventDefault();
  
//     // Validate form fields
//     if (!form.country || !form.fullName || !form.phoneNumber || !form.pinCode || !form.addressLine1 || !form.city || !form.state) {
//       alert("Please fill out all required fields.");
//       return;
//     }
  
//     const method = form._id ? "PUT" : "POST";  // Use PUT if updating, POST if adding
//     const url = form._id
//       ? `http://localhost:8080/api/updateaddress/${form._id}`
//       : "http://localhost:8080/api/addAddress";
  
//     fetch(url, {
//       method: method,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(form),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (data.success) {
//           setAddresses((prevAddresses) => {
//             if (method === "POST") {
//               return [...prevAddresses, data.address];
//             } else {
//               return prevAddresses.map((address) =>
//                 address._id === data.address._id ? data.address : address
//               );
//             }
//           });
          
//           // Success message
//           setSuccessMessage("Address saved successfully!");
          
//           // Reset form and close modal
//           resetForm();
//           setShowModal(false);
  
//           // Optionally, reset success message after a timeout
//           setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
//         } else {
//           throw new Error(data.message || "Unknown error");
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         alert(`Error: ${error.message || "Unknown error"}`);
//       });
//   };
  
  

//   // Delete an address
//   const deleteAddress = (id) => {
//     fetch(`http://localhost:8080/api/addresses/${id}`, {
//       method: "DELETE",
//       credentials : "include",
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           setAddresses((prevAddresses) =>
//             prevAddresses.filter((address) => address._id !== id)
//           );
//         } else {
//           console.error("Error deleting address:", data.message);
//         }
//       })
//       .catch((error) => console.error("Error deleting address:", error));
//   };

//   // Edit an address
//   const editAddress = (address) => {
//     setForm(address);
//     setShowModal(true);
//   };

//   // Set an address as default
//   const setDefaultAddress = (id) => {
//     fetch(`http://localhost:8080/api/setDefault/${id}`, {
//       method: "PUT",
//      credentials : 'include',
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           setAddresses((prevAddresses) =>
//             prevAddresses.map((address) =>
//               address._id === id
//                 ? { ...address, default: true }
//                 : { ...address, default: false }
//             )
//           );
//         } else {
//           console.error("Error setting default address:", data.message);
//         }
//       })
//       .catch((error) => console.error("Error setting default address:", error));
//   };

//   // Reset form to initial state
//   const resetForm = () => {
//     setForm({
//       _id: "",
//       country: "",
//       fullName: "",
//       phoneNumber: "",
//       pinCode: "",
//       addressLine1: "",
//       addressLine2: "",
//       city: "",
//       state: "",
//       default: false,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h2 className="text-2xl font-bold mb-6">Your Addresses</h2>
//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
//         {/* Add Address Card */}
//         <div
//           className="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer p-6 bg-white hover:bg-gray-50 transition"
//           onClick={() => setShowModal(true)}
//         >
//           <span className="text-gray-500 text-lg">+ Add Address</span>
//         </div>

//         {/* Existing Address Cards */}
//         {Array.isArray(addresses) && addresses.length > 0 ? (
//           addresses.map((address) => (
//             <div key={address._id} className="border rounded-lg p-4 bg-white shadow-sm relative">
//               {address.default && (
//                 <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
//                   Default
//                 </span>
//               )}
//               <p className="font-semibold text-lg">{address.fullName}</p>
//               <p className="text-gray-700">{address.addressLine1}</p>
//               <p className="text-gray-700">{address.addressLine2}</p>
//               <p className="text-gray-700">
//                 {address.city}, {address.state} - {address.pinCode}
//               </p>
//               <p className="text-gray-700">Phone: {address.phoneNumber}</p>
//               <div className="flex space-x-4 mt-4">
//                 <button
//                   className="text-blue-600 hover:underline"
//                   onClick={() => editAddress(address)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="text-red-600 hover:underline"
//                   onClick={() => deleteAddress(address._id)}
//                 >
//                   Remove
//                 </button>
//                 {!address.default && (
//                   <button
//                     className="text-green-600 hover:underline"
//                     onClick={() => setDefaultAddress(address._id)}
//                   >
//                     Set as Default
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No addresses found.</p>
//         )}
//       </div>

//       {/* Add/Edit Address Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-lg overflow-auto max-h-full">
//             <h3 className="text-xl font-bold mb-4">
//               {form._id ? "Edit Address" : "Add New Address"}
//             </h3>
//             <form onSubmit={handleSubmit}>
//               <div className="grid gap-4">
//                 {/* Country/Region */}
//                 <input
//                   type="text"
//                   name="country"
//                   placeholder="Country/Region"
//                   className="border p-2 rounded"
//                   value={form.country}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* Full Name */}
//                 <input
//                   type="text"
//                   name="fullName"
//                   placeholder="Full Name"
//                   className="border p-2 rounded"
//                   value={form.fullName}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* Mobile Number */}
//                 <input
//                   type="tel"
//                   name="phoneNumber"
//                   placeholder="Mobile Number"
//                   className="border p-2 rounded"
//                   value={form.phoneNumber}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* Pin Code */}
//                 <input
//                   type="text"
//                   name="pinCode"
//                   placeholder="Pin Code"
//                   className="border p-2 rounded"
//                   value={form.pinCode}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* Flat, House no., Building, Company, Apartment */}
//                 <input
//                   type="text"
//                   name="addressLine1"
//                   placeholder="Flat, House no., Building, Company, Apartment"
//                   className="border p-2 rounded"
//                   value={form.addressLine1}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* Area, Street, Sector, Village */}
//                 <input
//                   type="text"
//                   name="addressLine2"
//                   placeholder="Area, Street, Sector, Village"
//                   className="border p-2 rounded"
//                   value={form.addressLine2}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* Town/City */}
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="Town/City"
//                   className="border p-2 rounded"
//                   value={form.city}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* State */}
//                 <input
//                   type="text"
//                   name="state"
//                   placeholder="State"
//                   className="border p-2 rounded"
//                   value={form.state}
//                   onChange={handleChange}
//                   required
//                 />
//                 {/* Make Default Checkbox */}
//                 <label className="flex items-center mt-2">
//                   <input
//                     type="checkbox"
//                     name="default"
//                     className="mr-2"
//                     checked={form.default}
//                     onChange={handleChange}
//                   />
//                   Make this my default address
//                 </label>
//               </div>
//               {/* Modal Actions */}
//               <div className="mt-6 flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowModal(false);
//                     resetForm();
//                   }}
//                   className="text-gray-600 hover:underline"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//                 >
//                   Save Address
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddAddress;
