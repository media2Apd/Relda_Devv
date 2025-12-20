// import React, { useState, useEffect } from "react";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import * as XLSX from "xlsx";
// import { jsPDF } from "jspdf";
// import { Document, Packer, Paragraph, TextRun } from "docx";
// import { saveAs } from "file-saver";
// import SummaryApi from "../common";

// const AllCartSummary = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [filters, setFilters] = useState({
//     userId: "",
//     userName: "",
//     category: "",
//     fromDate: "",
//     toDate: "",
//   });
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [allCategories, setAllCategories] = useState([]);
//   const [view, setView] = useState("summary");
//   const [selectedUserDetails, setSelectedUserDetails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showExportOptions, setShowExportOptions] = useState(false); // Show Export options modal

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
//     const matchUserId = !filters.userId || item.userId._id.includes(filters.userId);
//     const matchUserName = !filters.userName || item.userId.name === filters.userName;
//     const matchCategory =
//       !filters.category || item.productId.category === filters.category;
//     const matchDate =
//       (!filters.fromDate || new Date(item.date) >= new Date(filters.fromDate)) &&
//       (!filters.toDate || new Date(item.date) <= new Date(filters.toDate));
//     return matchUserId && matchUserName && matchCategory && matchDate;
//   });

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   // Group selected user details by userId
//   const groupedUserDetails = selectedUserDetails.reduce((acc, item) => {
//     if (!acc[item.userId._id]) {
//       acc[item.userId._id] = {
//         user: item.userId, // Store user details
//         products: [], // Store products for that user
//       };
//     }
//     acc[item.userId._id].products.push(item); // Add product to user
//     return acc;
//   }, {});

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Function to download CSV
//   const downloadCSV = () => {
//     const headers = [
//       "User Name", "Email", "Mobile", "Product Name", "Quantity", "Selling Price", "Total Amount",
//     ];

//     const rows = [];
//     Object.values(groupedUserDetails).forEach((userDetail) => {
//       userDetail.products.forEach((item) => {
//         const productName = item.productId.productName || "Product Name";
//         const sellingPrice = item.productId.sellingPrice || 0;
//         const totalAmount = sellingPrice * item.quantity;
//         rows.push([
//           userDetail.user.name,
//           userDetail.user.email,
//           userDetail.user.mobile,
//           productName,
//           item.quantity,
//           sellingPrice,
//           totalAmount,
//         ]);
//       });
//     });

//     const csvContent = [
//       headers.join(","),
//       ...rows.map((row) => row.join(",")),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const filename = `user_cart_details_${new Date().toISOString()}.csv`;
//       link.setAttribute("href", URL.createObjectURL(blob));
//       link.setAttribute("download", filename);
//       link.click();
//     }
//   };

//   // Function to download XLSX
//   const downloadXLSX = () => {
//     const wb = XLSX.utils.book_new();
//     const headers = [
//       "User Name", "Email", "Mobile", "Product Name", "Quantity", "Selling Price", "Total Amount",
//     ];

//     const rows = [];
//     Object.values(groupedUserDetails).forEach((userDetail) => {
//       userDetail.products.forEach((item) => {
//         const productName = item.productId.productName || "Product Name";
//         const sellingPrice = item.productId.sellingPrice || 0;
//         const totalAmount = sellingPrice * item.quantity;
//         rows.push([
//           userDetail.user.name,
//           userDetail.user.email,
//           userDetail.user.mobile,
//           productName,
//           item.quantity,
//           sellingPrice,
//           totalAmount,
//         ]);
//       });
//     });

//     const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     XLSX.utils.book_append_sheet(wb, ws, "User Cart Details");
//     XLSX.writeFile(wb, `user_cart_details_${new Date().toISOString()}.xlsx`);
//   };

//   // Function to download PDF
//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(12);
//     doc.text("User Cart Details", 10, 10);

//     Object.values(groupedUserDetails).forEach((userDetail, index) => {
//       doc.text(`${userDetail.user.name} (${userDetail.user.email})`, 10, 20 + index * 20);
//       userDetail.products.forEach((item, itemIndex) => {
//         const productName = item.productId.productName || "Product Name";
//         const totalAmount = item.productId.sellingPrice * item.quantity;
//         doc.text(`${productName} - ₹${totalAmount}`, 10, 30 + itemIndex * 10 + index * 20);
//       });
//     });

//     doc.save(`user_cart_details_${new Date().toISOString()}.pdf`);
//   };

//   // Function to download DOCX
//   const downloadDOCX = () => {
//     const doc = new Document();

//     Object.values(groupedUserDetails).forEach((userDetail) => {
//       const userParagraph = new Paragraph({
//         children: [
//           new TextRun(`User: ${userDetail.user.name}`),
//           new TextRun(` (${userDetail.user.email})`).italic(),
//         ],
//       });

//       userDetail.products.forEach((item) => {
//         const productName = item.productId.productName || "Product Name";
//         const productParagraph = new Paragraph(`${productName} - ₹${item.productId.sellingPrice * item.quantity}`);
//         doc.addParagraph(userParagraph);
//         doc.addParagraph(productParagraph);
//       });
//     });

//     Packer.toBlob(doc).then((blob) => {
//       const filename = `user_cart_details_${new Date().toISOString()}.docx`;
//       saveAs(blob, filename);
//     });
//   };

//   // Toggle Export Options
//   const toggleExportOptions = () => setShowExportOptions(!showExportOptions);

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
//       {view === "summary" ? (
//         <>
//           <h1 className="text-2xl font-bold mb-4">All Cart Summary</h1>

//           {/* Filters */}
//           <div className="flex gap-4 flex-wrap mb-6">
//             <select
//               name="userName"
//               value={filters.userName}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded px-4 py-2"
//             >
//               <option value="">View All Users</option>
//               {filteredUsers.map((user) => (
//                 <option key={user.userId} value={user.userName}>
//                   {user.userName}
//                 </option>
//               ))}
//             </select>

//             <select
//               name="category"
//               value={filters.category}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded px-4 py-2"
//             >
//               <option value="">Select Category</option>
//               {filteredCategories.map((category, index) => (
//                 <option key={index} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="date"
//               name="fromDate"
//               value={filters.fromDate}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded px-4 py-2"
//             />
//             <input
//               type="date"
//               name="toDate"
//               value={filters.toDate}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded px-4 py-2"
//             />
//           </div>

         

//           {/* Table */}
//           <table className="min-w-full bg-white border border-gray-200 rounded">
//   <thead>
//     <tr className="bg-gray-100">
//       <th className="px-4 py-2 text-left font-semibold">User Name</th>
//       <th className="px-4 py-2 text-left font-semibold">Total Products</th>
//       <th className="px-4 py-2 text-left font-semibold">Actions</th>
//     </tr>
//   </thead>
//   <tbody>
//     {filteredUsers.map((user) => {
//       // Calculate the total number of products for each user
//       const totalProducts = cartItems
//         .filter((item) => item.userId._id === user.userId)
//         .reduce((sum, item) => sum + item.quantity, 0);

//       return (
//         <tr key={user.userId} className="hover:bg-gray-50">
//           <td className="px-4 py-2">{user.userName}</td>
//           <td className="px-4 py-2">{totalProducts}</td>
//           <td className="px-4 py-2">
//             <button
//               onClick={() => handleViewDetails(user.userId)}
//               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//             >
//               View
//             </button>
//           </td>
//         </tr>
//       );
//     })}
//   </tbody>
// </table>

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
//            {/* Export Button */}
//            <button
//             onClick={toggleExportOptions}
//             className="bg-blue-500 text-white px-6 py-2 mt-4 rounded-lg"
//           >
//             Export
//           </button>

//           {/* Export Options Modal */}
//           {showExportOptions && (
//             <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
//               <div className="bg-white p-6 rounded shadow-lg">
//                 <h3 className="text-xl mb-4">Choose Export Format</h3>
//                 <button onClick={downloadCSV} className="block mb-4 text-blue-600">CSV</button>
//                 <button onClick={downloadXLSX} className="block mb-4 text-blue-600">XLSX</button>
//                 <button onClick={downloadPDF} className="block mb-4 text-blue-600">PDF</button>
//                 <button onClick={downloadDOCX} className="block mb-4 text-blue-600">DOCX</button>
//                 <button onClick={toggleExportOptions} className="block text-red-600">Cancel</button>
//               </div>
//             </div>
//           )}

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


// import React, { useState, useEffect } from "react";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { useLocation } from "react-router-dom";
// import * as XLSX from "xlsx";
// import SummaryApi from "../common";

// const AllCartSummary = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [filters, setFilters] = useState({
//     userId: "",
//     userName: "",
//     category: "",
//     fromDate: "",
//     toDate: "",
//   });
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [allCategories, setAllCategories] = useState([]);
//   const [view, setView] = useState("summary");
//   const [selectedUserDetails, setSelectedUserDetails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     // Read filters from URL
//     const searchParams = new URLSearchParams(location.search);
//     const userId = searchParams.get('userId') || "";
//     const userName = searchParams.get('userName') || "";
//     const category = searchParams.get('category') || "";
//     const fromDate = searchParams.get('fromDate') || "";
//     const toDate = searchParams.get('toDate') || "";

//     setFilters({
//       userId,
//       userName,
//       category,
//       fromDate,
//       toDate,
//     });
//   }, [location.search]);

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(SummaryApi.allCart.url, {
//           method: SummaryApi.allCart.method,
//           credentials: "include",
//         });

//         const data = await response.json();
//         console.log(data);
        
//         if (data.success) {
//           setCartItems(data.data.allCartItems || []);
//           populateFilters(data.data.allCartItems);
//         } else {
//           alert("Error fetching cart items");
//         }
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCartItems();
//   }, []);

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

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters({ ...filters, [name]: value });

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
//     const { fromDate, toDate } = filters;
//     const itemDate = new Date(item.createdAt); // Ensure the createdAt is treated as a Date object.
  
//     // Initialize the filter logic for date-wise filtering
//     let matchDate = true;
  
//     if (fromDate || toDate) {
//       let dateFilter = {}; // Create a filter object for the date range
  
//       if (fromDate) {
//         const start = new Date(fromDate);
//         start.setHours(0, 0, 0, 0); // Set to the start of the day (00:00:00)
//         dateFilter.$gte = start; // Greater than or equal to start date
//       }
  
//       if (toDate) {
//         const end = new Date(toDate);
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
//   const downloadXLSX = () => {
//     const wb = XLSX.utils.book_new();
    
//     // Define headers with a new "Date" column
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
//       "Date"
//     ];
    
//     const rows = filteredCartItems.map((item) => {
//       const productName = item.productId?.productName || "Product Name";
//       const category = item.productId?.category || "Category";
//       const sellingPrice = item.productId?.sellingPrice || 0;
//       const totalAmount = sellingPrice * item.quantity;
//       const addressObj = item.userId?.address || {};
//       const address = `${addressObj.street || ""}, ${addressObj.city || ""}, ${addressObj.state || ""}, ${addressObj.country || ""}, ${addressObj.pinCode || ""}`.trim();
  
//       // Use the createdAt field to include the date (format it if needed)
//       const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Unknown Date";
  
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
//         date,  // Add the date column here
//       ];
//     });
  
//     const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     XLSX.utils.book_append_sheet(wb, ws, "Filtered Cart Details");
//     XLSX.writeFile(wb, `filtered_cart_details_${new Date().toISOString()}.xlsx`);
//   };
  

//   // Grouping cart items by userId
//   const groupedCartItems = cartItems.reduce((acc, item) => {
//     if (!acc[item.userId._id]) {
//       acc[item.userId._id] = { ...item.userId, totalQuantity: 0 };
//     }
//     acc[item.userId._id].totalQuantity += item.quantity;
//     return acc;
//   }, {});

//   const uniqueUsers = Object.values(groupedCartItems);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
//       {view === "summary" ? (
//         <>
//           <h1 className="text-xl font-bold mb-4">All Cart Summary</h1>
//           {/* Filters */}
//           <div className="flex gap-4 flex-wrap mb-6 items-center">
//             <select
//               name="userName"
//               value={filters.userName}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
//             >
//               <option value="">View All Users</option>
//               {filteredUsers.map((user) => (
//                 <option key={user.userId} value={user.userName}>
//                   {user.userName}
//                 </option>
//               ))}
//             </select>

//             <select
//               name="category"
//               value={filters.category}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
//             >
//               <option value="">Select Category</option>
//               {filteredCategories.map((category, index) => (
//                 <option key={index} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="date"
//               name="fromDate"
//               value={filters.fromDate}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
//             />

//             <input
//               type="date"
//               name="toDate"
//               value={filters.toDate}
//               onChange={handleFilterChange}
//               className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
//             />

//             {/* Export button aligned to the right */}
//             <button
//               onClick={downloadXLSX}
//               className="border border-gray-300 rounded px-4 py-2 text-sm bg-blue-500 text-white ml-auto"
//             >
//               Export
//             </button>
//           </div>

//           {/* Table */}
//           <table className="min-w-full bg-white border border-gray-200 rounded">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="px-4 py-2 text-left font-semibold">User Name</th>
//                 <th className="px-4 py-2 text-left font-semibold">Total Products</th>
//                 <th className="px-4 py-2 text-left font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCartItems.length === 0 ? (
//                 <tr>
//                   <td colSpan="3" className="px-4 py-2 text-center">No matching cart items</td>
//                 </tr>
//               ) : (
//                 filteredCartItems.map((item) => {
//                   const user = item.userId;
//                   const totalProducts = filteredCartItems
//                     .filter((cartItem) => cartItem.userId._id === user._id)
//                     .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
//                   return (
//                     <tr key={item._id} className="hover:bg-gray-50">
//                       <td className="px-4 py-2">{user.name}</td>
//                       <td className="px-4 py-2">{totalProducts}</td>
//                       <td className="px-4 py-2">
//                         <button
//                           onClick={() => handleViewDetails(user._id)}
//                           className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
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

// import React, { useState, useEffect, useMemo } from "react";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { useLocation } from "react-router-dom";
// import * as XLSX from "xlsx";
// import SummaryApi from "../common";

// const AllCartSummary = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [filters, setFilters] = useState({
//     userId: "",
//     userName: "",
//     category: "",
//     fromDate: "",
//     toDate: "",
//   });
//   const [allUsers, setAllUsers] = useState([]);
//   const [allCategories, setAllCategories] = useState([]);
//   const [view, setView] = useState("summary");
//   const [selectedUserDetails, setSelectedUserDetails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     setFilters({
//       userId: searchParams.get('userId') || "",
//       userName: searchParams.get('userName') || "",
//       category: searchParams.get('category') || "",
//       fromDate: searchParams.get('fromDate') || "",
//       toDate: searchParams.get('toDate') || "",
//     });
//   }, [location.search]);

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(SummaryApi.allCart.url, {
//           method: SummaryApi.allCart.method,
//           credentials: "include",
//         });
//         const data = await response.json();
//         if (data.success) {
//           setCartItems(data.data.allCartItems || []);
//           populateFilters(data.data.allCartItems);
//         } else {
//           alert("Error fetching cart items");
//         }
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCartItems();
//   }, []);

//   const populateFilters = (items) => {
//     const users = [];
//     const categories = new Set();
//     items.forEach((item) => {
//       if (item.userId && !users.some((u) => u.userId === item.userId._id)) {
//         users.push({ userId: item.userId._id, userName: item.userId.name });
//       }
//       if (item.productId?.category) categories.add(item.productId.category);
//     });
//     setAllUsers(users);
//     setAllCategories([...categories]);
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters({ ...filters, [name]: value });
//   };

//   // 1. Filter the raw cart items first
//   const filteredCartItems = useMemo(() => {
//     return cartItems.filter((item) => {
//       const { fromDate, toDate, userName, category, userId } = filters;
//       const itemDate = new Date(item.createdAt);

//       let matchDate = true;
//       if (fromDate || toDate) {
//         const start = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
//         const end = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;
//         if (start && itemDate < start) matchDate = false;
//         if (end && itemDate > end) matchDate = false;
//       }

//       const matchUserId = !userId || item.userId?._id === userId;
//       const matchUserName = !userName || item.userId?.name.toLowerCase().includes(userName.toLowerCase());
//       const matchCategory = !category || item.productId?.category.toLowerCase().includes(category.toLowerCase());

//       return matchUserId && matchUserName && matchCategory && matchDate;
//     });
//   }, [cartItems, filters]);

//   // 2. GROUP the filtered results by User for the Table Display
//   const groupedTableData = useMemo(() => {
//     const groups = filteredCartItems.reduce((acc, item) => {
//       const uId = item.userId?._id;
//       if (!uId) return acc;
//       if (!acc[uId]) {
//         acc[uId] = {
//           userId: uId,
//           userName: item.userId.name,
//           totalQuantity: 0,
//           itemCount: 0 // Number of unique product types
//         };
//       }
//       acc[uId].totalQuantity += item.quantity;
//       acc[uId].itemCount += 1;
//       return acc;
//     }, {});
//     return Object.values(groups);
//   }, [filteredCartItems]);

//   const handleViewDetails = (userId) => {
//     // Show only items for this user that also match the current category/date filters
//     const details = filteredCartItems.filter((item) => item.userId._id === userId);
//     setSelectedUserDetails(details);
//     setView("details");
//   };

//   const downloadXLSX = () => {
//     const wb = XLSX.utils.book_new();
//     const headers = ["User Name", "Email", "Mobile", "Product Name", "Category", "Quantity", "Selling Price", "Total Amount", "Address", "Date"];
//     const rows = filteredCartItems.map((item) => {
//       const addressObj = item.userId?.address || {};
//       const address = `${addressObj.street || ""}, ${addressObj.city || ""}, ${addressObj.state || ""}`.trim();
//       return [
//         item.userId?.name || "N/A",
//         item.userId?.email || "N/A",
//         item.userId?.mobile || "N/A",
//         item.productId?.productName || "N/A",
//         item.productId?.category || "N/A",
//         item.quantity,
//         item.productId?.sellingPrice || 0,
//         (item.productId?.sellingPrice || 0) * item.quantity,
//         address,
//         item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
//       ];
//     });
//     const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     XLSX.utils.book_append_sheet(wb, ws, "Cart Details");
//     XLSX.writeFile(wb, `Cart_Summary_${new Date().getTime()}.xlsx`);
//   };

//   if (loading) return <div className="flex justify-center items-center h-screen text-center">Loading...</div>;

//   return (
//     <div className="p-4">
//       {view === "summary" ? (
//         <>
//         <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg mb-4'>
//         <h2 className='font-bold text-xl text-gray-800'>All Cart Summary</h2>
//         <button className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-4 rounded-full ' onClick={downloadXLSX}>Export to Excel</button>
//       </div>
//           {/* <h1 className="text-xl font-bold mb-4">All Cart Summary</h1> */}
//           <div className="flex gap-4 flex-wrap mb-6 items-center">
//             <select name="userName" value={filters.userName} onChange={handleFilterChange} className="border rounded px-4 py-2 text-sm w-48">
//               <option value="">View All Users</option>
//               {allUsers.map((user) => (
//                 <option key={user.userId} value={user.userName}>{user.userName}</option>
//               ))}
//             </select>

//             <select name="category" value={filters.category} onChange={handleFilterChange} className="border rounded px-4 py-2 text-sm w-48">
//               <option value="">Select Category</option>
//               {allCategories.map((cat, i) => (
//                 <option key={i} value={cat}>{cat}</option>
//               ))}
//             </select>

//             <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className="border rounded px-4 py-2 text-sm" />
//             <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className="border rounded px-4 py-2 text-sm" />

//             <button onClick={downloadXLSX} className="bg-blue-500 text-white px-4 py-2 rounded text-sm ml-auto">Export Excel</button>
//           </div>

//           <table className="min-w-full bg-white border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="px-4 py-2 text-left">User Name</th>
//                 <th className="px-4 py-2 text-left">Total Quantity</th>
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {groupedTableData.length === 0 ? (
//                 <tr><td colSpan="3" className="px-4 py-10 text-center">No matching records found</td></tr>
//               ) : (
//                 groupedTableData.map((group) => (
//                   <tr key={group.userId} className="border-b hover:bg-gray-50">
//                     <td className="px-4 py-2 font-medium">{group.userName}</td>
//                     <td className="px-4 py-2">{group.totalQuantity} Items</td>
//                     <td className="px-4 py-2">
//                       <button
//                         onClick={() => handleViewDetails(group.userId)}
//                         className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </>
//       ) : (
//         /* Detailed View remains similar but uses selectedUserDetails state */
//         <div>
//            <button onClick={() => setView("summary")} className="flex items-center text-red-600 mb-4 font-bold">
//             <IoMdArrowRoundBack className="mr-2" size={24} /> Back to Summary
//           </button>
//           <h2 className="text-2xl font-bold mb-6">User Cart Details</h2>
          
//           {selectedUserDetails.length > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="md:col-span-2 space-y-4">
//                 {selectedUserDetails.map((item) => (
//                   <div key={item._id} className="flex border p-4 rounded-lg shadow-sm bg-gray-50">
//                     <img 
//                       src={Array.isArray(item.productId.productImage) ? (item.productId.productImage[0]?.url || item.productId.productImage[0]) : item.productId.productImage} 
//                       className="w-24 h-24 object-contain bg-white border rounded" 
//                       alt=""
//                     />
//                     <div className="ml-4 flex-1">
//                       <h4 className="font-bold text-gray-800">{item.productId.productName}</h4>
//                       <p className="text-sm text-gray-500">Category: {item.productId.category}</p>
//                       <p className="text-sm">Price: <span className="text-red-600 font-bold">₹{item.productId.sellingPrice}</span> x {item.quantity}</p>
//                       <p className="text-sm font-bold mt-2">Subtotal: ₹{item.productId.sellingPrice * item.quantity}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="bg-white border p-4 rounded-lg shadow-md h-fit">
//                 <h3 className="font-bold text-lg border-b pb-2 mb-2">Customer Info</h3>
//                 <p className="text-sm"><strong>Name:</strong> {selectedUserDetails[0].userId.name}</p>
//                 <p className="text-sm"><strong>Email:</strong> {selectedUserDetails[0].userId.email}</p>
//                 <p className="text-sm"><strong>Phone:</strong> {selectedUserDetails[0].userId.mobile}</p>
//                 <div className="mt-4">
//                   <h4 className="font-bold text-sm">Delivery Address:</h4>
//                   <p className="text-sm text-gray-600">
//                     {selectedUserDetails[0].userId.address?.street},<br/>
//                     {selectedUserDetails[0].userId.address?.city}, {selectedUserDetails[0].userId.address?.state}<br/>
//                     {selectedUserDetails[0].userId.address?.pinCode}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllCartSummary;

import React, { useState, useEffect, useMemo } from "react";
import { IoMdArrowRoundBack, IoMdEye } from "react-icons/io";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import SummaryApi from "../common";
import moment from 'moment';

const AllCartSummary = () => {
  const [cartItems, setCartItems] = useState([]);
  const [filters, setFilters] = useState({
    userId: "",
    userName: "",
    category: "",
    fromDate: "",
    toDate: "",
  });
  const [isFocused, setIsFocused] = useState({
    fromDate: false,
    toDate: false
  });
  const [allUsers, setAllUsers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [view, setView] = useState("summary");
  const [selectedUserDetails, setSelectedUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setFilters({
      userId: searchParams.get('userId') || "",
      userName: searchParams.get('userName') || "",
      category: searchParams.get('category') || "",
      fromDate: searchParams.get('fromDate') || "",
      toDate: searchParams.get('toDate') || "",
    });
  }, [location.search]);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(SummaryApi.allCart.url, {
          method: SummaryApi.allCart.method,
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setCartItems(data.data.allCartItems || []);
          populateFilters(data.data.allCartItems);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const populateFilters = (items) => {
    const users = [];
    const categories = new Set();
    items.forEach((item) => {
      if (item.userId && !users.some((u) => u.userId === item.userId._id)) {
        users.push({ userId: item.userId._id, userName: item.userId.name });
      }
      if (item.productId?.category) categories.add(item.productId.category);
    });
    setAllUsers(users);
    setAllCategories([...categories]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredCartItems = useMemo(() => {
    return cartItems.filter((item) => {
      const { fromDate, toDate, userName, category, userId } = filters;
      const itemDate = new Date(item.createdAt);

      let matchDate = true;
      if (fromDate || toDate) {
        const start = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
        const end = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;
        if (start && itemDate < start) matchDate = false;
        if (end && itemDate > end) matchDate = false;
      }

      const matchUserId = !userId || item.userId?._id === userId;
      const matchUserName = !userName || item.userId?.name.toLowerCase().includes(userName.toLowerCase());
      const matchCategory = !category || item.productId?.category.toLowerCase().includes(category.toLowerCase());

      return matchUserId && matchUserName && matchCategory && matchDate;
    });
  }, [cartItems, filters]);

  const groupedTableData = useMemo(() => {
    const groups = filteredCartItems.reduce((acc, item) => {
      const uId = item.userId?._id;
      if (!uId) return acc;
      if (!acc[uId]) {
        acc[uId] = {
          userId: uId,
          userName: item.userId.name,
          email: item.userId.email,
          totalQuantity: 0,
        };
      }
      acc[uId].totalQuantity += item.quantity;
      return acc;
    }, {});
    return Object.values(groups);
  }, [filteredCartItems]);

  const handleViewDetails = (userId) => {
    const details = filteredCartItems.filter((item) => item.userId._id === userId);
    setSelectedUserDetails(details);
    setView("details");
  };

  const downloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCartItems.map(item => ({
        User: item.userId?.name,
        Product: item.productId?.productName,
        Category: item.productId?.category,
        Quantity: item.quantity,
        Price: item.productId?.sellingPrice,
        Date: moment(item.createdAt).format('LL')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CartSummary");
    XLSX.writeFile(wb, "Cart_Summary.xlsx");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className='mx-auto pb-8 p-1 md:p-4 text-gray-800'>
      {view === "summary" ? (
        <>
          {/* Header Section */}
          <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
            <h2 className='font-bold text-xl text-gray-800'>All Cart Summary</h2>
            <button 
              className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-4 rounded-full text-sm font-semibold' 
              onClick={downloadXLSX}
            >
              Export to Excel
            </button>
          </div>

          {/* Filter Section */}
          <div className="flex gap-4 flex-wrap mb-6 items-center mt-4 p-4">
            <select 
              name="userName" 
              value={filters.userName} 
              onChange={handleFilterChange} 
              className="border p-2 rounded-md border-gray-300 text-sm w-full md:w-auto outline-none"
            >
              <option value="">All Users</option>
              {allUsers.map((user) => (
                <option key={user.userId} value={user.userName}>{user.userName}</option>
              ))}
            </select>

            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange} 
              className="border p-2 rounded-md border-gray-300 text-sm w-full md:w-auto outline-none"
            >
              <option value="">All Categories</option>
              {allCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type={isFocused.fromDate ? "date" : "text"}
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="border p-2 rounded-md border-gray-300 text-sm w-full md:w-auto outline-none"
              placeholder={isFocused.fromDate ? "" : "From Date*"}
              onFocus={() => setIsFocused({ ...isFocused, fromDate: true })}
              onBlur={() => setIsFocused({ ...isFocused, fromDate: false })}
            />
            <input
              type={isFocused.toDate ? "date" : "text"}
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="border p-2 rounded-md border-gray-300 text-sm w-full md:w-auto outline-none"
              placeholder={isFocused.toDate ? "" : "To Date*"}
              onFocus={() => setIsFocused({ ...isFocused, toDate: true })}
              onBlur={() => setIsFocused({ ...isFocused, toDate: false })}
            />
          </div>

          {/* Table Section */}
          <div className='overflow-x-auto rounded-lg shadow-lg'>
            <table className='w-full bg-white'>
              <thead>
                <tr className='bg-red-600 text-white'>
                  <th className="border border-gray-300 px-4 py-2">S.No</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">User Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Total Items</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {groupedTableData.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-10 text-center text-gray-500">No records found</td></tr>
                ) : (
                  groupedTableData.map((group, index) => (
                    <tr key={group.userId} className="hover:bg-gray-100 transition-colors">
                      <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{group.userName}</td>
                      <td className="border border-gray-300 px-4 py-2">{group.email}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{group.totalQuantity}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleViewDetails(group.userId)}
                          className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-500 hover:text-white transition-all"
                          title="View Details"
                        >
                          <IoMdEye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Detailed View */
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <button 
              onClick={() => setView("summary")} 
              className="flex items-center text-red-600 hover:text-red-800 font-bold transition-all"
            >
              <IoMdArrowRoundBack className="mr-2" size={24} /> Back to Summary
            </button>
            <h2 className="text-xl font-bold">User Cart Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {selectedUserDetails.map((item) => (
                <div key={item._id} className="flex border border-gray-200 p-4 rounded-lg bg-gray-50 hover:shadow-sm transition-shadow">
                  <img 
                    src={Array.isArray(item.productId.productImage) ? (item.productId.productImage[0]?.url || item.productId.productImage[0]) : item.productId.productImage} 
                    className="w-24 h-24 object-contain bg-white border rounded p-1" 
                    alt={item.productId.productName}
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-gray-800 leading-tight">{item.productId.productName}</h4>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{item.productId.category}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-700">Price: <span className="font-bold">₹{item.productId.sellingPrice}</span> x {item.quantity}</p>
                      <p className="text-sm font-bold text-red-600">Subtotal: ₹{item.productId.sellingPrice * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg h-fit sticky top-4">
              <h3 className="font-bold text-lg text-gray-800 border-b border-gray-300 pb-2 mb-4">Customer Info</h3>
              <div className="space-y-3">
                <p className="text-sm"><strong>Name:</strong> <span className="text-gray-600 ml-1">{selectedUserDetails[0].userId.name}</span></p>
                <p className="text-sm"><strong>Email:</strong> <span className="text-gray-600 ml-1">{selectedUserDetails[0].userId.email}</span></p>
                <p className="text-sm"><strong>Phone:</strong> <span className="text-gray-600 ml-1">{selectedUserDetails[0].userId.mobile || "N/A"}</span></p>
                
                <div className="pt-4 mt-4 border-t border-gray-300">
                  <h4 className="font-bold text-sm text-gray-800 mb-2 underline">Delivery Address</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedUserDetails[0].userId.address?.street}<br/>
                    {selectedUserDetails[0].userId.address?.city}, {selectedUserDetails[0].userId.address?.state}<br/>
                    <span className="font-semibold text-gray-800">{selectedUserDetails[0].userId.address?.pinCode}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCartSummary;