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


import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import SummaryApi from "../common";

const AllCartSummary = () => {
  const [cartItems, setCartItems] = useState([]);
  const [filters, setFilters] = useState({
    userId: "",
    userName: "",
    category: "",
    fromDate: "",
    toDate: "",
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [view, setView] = useState("summary");
  const [selectedUserDetails, setSelectedUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Read filters from URL
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get('userId') || "";
    const userName = searchParams.get('userName') || "";
    const category = searchParams.get('category') || "";
    const fromDate = searchParams.get('fromDate') || "";
    const toDate = searchParams.get('toDate') || "";

    setFilters({
      userId,
      userName,
      category,
      fromDate,
      toDate,
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
        console.log(data);
        
        if (data.success) {
          setCartItems(data.data.allCartItems || []);
          populateFilters(data.data.allCartItems);
        } else {
          alert("Error fetching cart items");
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
      if (!users.some((u) => u.userId === item.userId._id)) {
        users.push({ userId: item.userId._id, userName: item.userId.name });
      }
      categories.add(item.productId.category);
    });

    setAllUsers(users);
    setFilteredUsers(users);
    setAllCategories([...categories]);
    setFilteredCategories([...categories]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    if (name === "userName") {
      const filtered = allUsers.filter((user) =>
        user.userName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    if (name === "category") {
      const filtered = allCategories.filter((category) =>
        category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const handleViewDetails = (userId) => {
    const details = cartItems.filter((item) => item.userId._id === userId);
    setSelectedUserDetails(details);
    setView("details");
  };

  const handleBackToSummary = () => setView("summary");

  const filteredCartItems = cartItems.filter((item) => {
    const { fromDate, toDate } = filters;
    const itemDate = new Date(item.createdAt); // Ensure the createdAt is treated as a Date object.
  
    // Initialize the filter logic for date-wise filtering
    let matchDate = true;
  
    if (fromDate || toDate) {
      let dateFilter = {}; // Create a filter object for the date range
  
      if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0); // Set to the start of the day (00:00:00)
        dateFilter.$gte = start; // Greater than or equal to start date
      }
  
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999); // Set to the end of the day (23:59:59.999)
        dateFilter.$lte = end; // Less than or equal to end date
      }
  
      // Check if the itemDate fits within the date range
      if (dateFilter.$gte || dateFilter.$lte) {
        matchDate = (
          (!dateFilter.$gte || itemDate >= dateFilter.$gte) &&
          (!dateFilter.$lte || itemDate <= dateFilter.$lte)
        );
      }
    }
  
    // Additional filters for other fields
    const matchUserId = !filters.userId || item.userId._id.includes(filters.userId);
    const matchUserName = !filters.userName || item.userId.name.toLowerCase().includes(filters.userName.toLowerCase());
    const matchCategory = !filters.category || item.productId.category.toLowerCase().includes(filters.category.toLowerCase());
  
    // Return items that match all conditions
    return matchUserId && matchUserName && matchCategory && matchDate;
  });
  

  const groupedUserDetails = selectedUserDetails.reduce((acc, item) => {
    if (!acc[item.userId._id]) {
      acc[item.userId._id] = {
        user: item.userId,
        products: [],
      };
    }
    acc[item.userId._id].products.push(item);
    return acc;
  }, {});
  
  if (loading) {
    return <div>Loading...</div>;
  }
  const downloadXLSX = () => {
    const wb = XLSX.utils.book_new();
    
    // Define headers with a new "Date" column
    const headers = [
      "User Name",
      "Email",
      "Mobile",
      "Product Name",
      "Category",
      "Quantity",
      "Selling Price",
      "Total Amount",
      "Address",
      "Date"
    ];
    
    const rows = filteredCartItems.map((item) => {
      const productName = item.productId?.productName || "Product Name";
      const category = item.productId?.category || "Category";
      const sellingPrice = item.productId?.sellingPrice || 0;
      const totalAmount = sellingPrice * item.quantity;
      const addressObj = item.userId?.address || {};
      const address = `${addressObj.street || ""}, ${addressObj.city || ""}, ${addressObj.state || ""}, ${addressObj.country || ""}, ${addressObj.pinCode || ""}`.trim();
  
      // Use the createdAt field to include the date (format it if needed)
      const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Unknown Date";
  
      return [
        item.userId?.name || "Unknown User",
        item.userId?.email || "No Email",
        item.userId?.mobile || "No Mobile",
        productName,
        category,
        item.quantity,
        sellingPrice,
        totalAmount,
        address,
        date,  // Add the date column here
      ];
    });
  
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Cart Details");
    XLSX.writeFile(wb, `filtered_cart_details_${new Date().toISOString()}.xlsx`);
  };
  

  // Grouping cart items by userId
  const groupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.userId._id]) {
      acc[item.userId._id] = { ...item.userId, totalQuantity: 0 };
    }
    acc[item.userId._id].totalQuantity += item.quantity;
    return acc;
  }, {});

  const uniqueUsers = Object.values(groupedCartItems);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      {view === "summary" ? (
        <>
          <h1 className="text-xl font-bold mb-4">All Cart Summary</h1>
          {/* Filters */}
          <div className="flex gap-4 flex-wrap mb-6 items-center">
            <select
              name="userName"
              value={filters.userName}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
            >
              <option value="">View All Users</option>
              {filteredUsers.map((user) => (
                <option key={user.userId} value={user.userName}>
                  {user.userName}
                </option>
              ))}
            </select>

            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
            >
              <option value="">Select Category</option>
              {filteredCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
            />

            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-4 py-2 text-sm w-48"
            />

            {/* Export button aligned to the right */}
            <button
              onClick={downloadXLSX}
              className="border border-gray-300 rounded px-4 py-2 text-sm bg-blue-500 text-white ml-auto"
            >
              Export
            </button>
          </div>

          {/* Table */}
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-semibold">User Name</th>
                <th className="px-4 py-2 text-left font-semibold">Total Products</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCartItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center">No matching cart items</td>
                </tr>
              ) : (
                filteredCartItems.map((item) => {
                  const user = item.userId;
                  const totalProducts = filteredCartItems
                    .filter((cartItem) => cartItem.userId._id === user._id)
                    .reduce((sum, cartItem) => sum + cartItem.quantity, 0);
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{totalProducts}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleViewDetails(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <div className="flex">
            <button
              onClick={handleBackToSummary}
              className="mr-2 text-custom-red text-3xl font-semibold mb-4"
            >
              <IoMdArrowRoundBack />
            </button>
            <h1 className="text-2xl font-bold mb-4">User Cart Details</h1>
          </div>
          {/* User Details and Product Details Layout */}
          {Object.values(groupedUserDetails).map((userDetail) => (
            <div
              key={userDetail.user._id}
              className="flex justify-between mb-8 p-6 bg-white border rounded-lg shadow-sm"
            >
              {/* Right: Product Details */}
              <div className="w-2/3">
                {userDetail.products.map((item) => {
                  const productName = item.productId.productName || "Product Name";
                  const sellingPrice = item.productId.sellingPrice || 0;
                  const Price = item.productId.price;
                  const productImage = item.productId.productImage;
                  return (
                    <div
                      key={item._id}
                      className="mb-8 p-6 bg-white border rounded-lg shadow-sm"
                    >
                      {/* Product Details */}
                      <div className="flex items-start">
                        {productImage && (
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-32 h-32 object-cover flex-wrap rounded-md mr-4"
                          />
                        )}
                        <div>
                          <h3 className="text-l font-semibold text-gray-800">
                            {productName}
                          </h3>
                          <p className="text-gray-500 mt-1">
                            Price: <span className="text-red-600 font-bold">₹{sellingPrice}</span>{" "}
                            {Price && (
                              <span className="line-through text-gray-400 font-bold ml-2">
                                ₹{Price}
                              </span>
                            )}
                          </p>
                          <span className="ml-2 bg-green-500 text-white px-2 py-1 text-xs rounded font-semibold">
                            {`${(
                              ((Price - sellingPrice) / Price) * 100
                            ).toFixed(2)}% OFF`}
                          </span>
                          <p className="text-gray-600 mt-2">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      {/* Divider */}
                      <div className="border-t mt-4"></div>
                      {/* Total Amount */}
                      <div className="text-right mt-4">
                        <p className="text-m font-semibold">
                          Total Amount: ₹{sellingPrice * item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Left: User Details */}
              <div className="w-1/3 pl-2">
                <div className="p-6 pl-6 border rounded-lg shadow-md bg-white">
                  <h3 className="text-l font-semibold text-gray-800">
                    Customer: {userDetail.user.name}
                  </h3>
                  <p className="text-gray-600">Email: {userDetail.user.email}</p>
                  <p className="text-gray-600">Mobile: {userDetail.user.mobile}</p>
                  <div className="mt-4">
                    <h4 className="text-l font-semibold">Customer Address</h4>
                    <p className="text-gray-600">
                      {userDetail.user?.address?.street || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      {userDetail.user?.address?.city || 'N/A'},{" "}
                      {userDetail.user?.address?.state || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      {userDetail.user?.address?.country || 'N/A'} -{" "}
                      {userDetail.user?.address?.pinCode || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AllCartSummary;