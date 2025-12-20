// import React, { useState, useEffect } from "react";
// import SummaryApi from "../common";

// const AddCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState("");
//   const [value, setValue] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [editIndex, setEditIndex] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [parentCategories, setParentCategories] = useState([]); // State for parent categories
//   const [selectedParentCategory, setSelectedParentCategory] = useState(""); // State for selected parent category

//   useEffect(() => {
//     fetchCategories();
//     fetchParentCategories(); // Fetch parent categories on component mount
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getProductCategory.url);
//       const data = await response.json();
//       if (data.success) {
//         setCategories(data.categories);
//       } else {
//         console.error("Error fetching categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchParentCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getParentCategories.url); // Replace with your actual API endpoint
//       const data = await response.json();

//       if (data.success && data.categories && Array.isArray(data.categories)) {
//         setParentCategories(data.categories.map((category) => category.name));
//       } else {
//         console.error("Error: Parent categories not found or invalid response structure");
//       }
//     } catch (error) {
//       console.error("Error fetching parent categories:", error);
//     }
//   };

//   const handleCategoryNameChange = (e) => setCategoryName(e.target.value);
//   const handleValueChange = (e) => setValue(e.target.value);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("label", categoryName);
//     formData.append("value", value);
//     formData.append("parentCategory", selectedParentCategory); // Append selected parent category

//     if (image) {
//       formData.append("categoryImage", image);
//     }

//     const url =
//       editIndex !== null
//         ? SummaryApi.editProductCategory.url.replace(
//             ":id",
//             categories[editIndex]._id
//           )
//         : SummaryApi.addProductCategory.url;

//     const method = editIndex !== null ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method,
//         body: formData,
//       });
//       const data = await response.json();
//       console.log(data);

//   // console.log(data.category.parentCategory ? data.category.parentCategory.name : 'No Parent Category');

//       if (data.success) {
//         fetchCategories();
//         setCategoryName("");
//         setValue("");
//         setImage(null);
//         setPreview(null);
//         setIsModalOpen(false);
//         setEditIndex(null);
//       } else {
//         console.error("Error saving category:", data.message);
//       }
//     } catch (error) {
//       console.error("Error saving category:", error);
//     }
//   };

//   // console.log(data.category.parentCategory ? data.category.parentCategory.name : 'No Parent Category');

//   const handleEdit = (index) => {
//     const category = categories[index];
//     setCategoryName(category.label);
//     setValue(category.value || "");
//     setSelectedParentCategory(category.parentCategory || ""); // Populate parent category
//     setPreview(category.categoryImage);
//     setEditIndex(index);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (index) => {
//     const categoryId = categories[index]._id;
//     try {
//       const response = await fetch(
//         SummaryApi.deleteProductCategory.url.replace(":id", categoryId),
//         { method: SummaryApi.deleteProductCategory.method }
//       );
//       const data = await response.json();
//       if (data.success) {
//         fetchCategories();
//       } else {
//         console.error("Error deleting category:", data.message);
//       }
//     } catch (error) {
//       console.error("Error deleting category:", error);
//     }
//   };

//   return (
//     <div className="p-8 max-w-6xl mx-auto rounded-lg">
//       <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//         <h2 className="text-2xl font-bold mb-4">All Product Categories</h2>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Add Product Category
//         </button>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
//             <h3 className="text-lg font-bold mb-4">
//               {editIndex !== null ? "Edit Product Category" : "Add Product Category"}
//             </h3>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Category label
//                 </label>
//                 <input
//                   type="text"
//                   value={categoryName}
//                   onChange={handleCategoryNameChange}
//                   placeholder="Enter category name"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>

//             <label className="block text-gray-700 text-sm font-bold mb-2">
//   Parent Category
// </label>
// <select
//   value={selectedParentCategory}
//   onChange={(e) => setSelectedParentCategory(e.target.value)}
//   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// >
//   <option value="">Select Parent Category</option>
//   {parentCategories.map((parentCategory, index) => (
//     <option key={index} value={parentCategory}>
//       {parentCategory}
//     </option>
//   ))}
// </select>

//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Category Name
//                 </label>
//                 <input
//                   type="text"
//                   value={value}
//                   onChange={handleValueChange}
//                   placeholder="Enter value added"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Image
//                 </label>
//                 <input
//                   type="file"
//                   onChange={handleImageChange}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//                 {preview && (
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="mt-4 w-32 h-32 object-cover rounded"
//                   />
//                 )}
//               </div>

//               <div className="flex justify-end">
//               <button
//               type="button"
//               onClick={() => {
//                 setIsModalOpen(false);
//                 setEditIndex(null);
//                 setCategoryName("");
//                 setValue("");
//                 setPreview(null);
//                 setSelectedParentCategory(""); // Reset parent category selection
//               }}
//               className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
//             >
//               Cancel
//             </button>

//                 <button
//                   type="submit"
//                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                   {editIndex !== null ? "Update" : "Add"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {categories.length > 0 && (
//         <div className="rounded-lg shadow-md mt-6 p-4">
//           <h3 className="text-lg font-bold mb-4">Category List</h3>
//           <table className="min-w-full table-auto">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2">Name</th>
//                 <th className="px-4 py-2">Value</th>
//                 {/* <th className="px-4 py-2">Value</th> */}
//                 <th className="px-4 py-2">Parent Category</th>
//                 <th className="px-4 py-2">Image</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="border border-r">
//               {categories.map((category, index) => (
//                 <tr key={index} className="text-center">
//                   <td className="px-4 py-2">{category.label}</td>
//                   <td className="px-4 py-2">{category.value || "N/A"}</td>
//                   <td className="px-4 py-2">{category.parentCategory ? category.parentCategory.name : "N/A"}</td>
//                   <td className="px-4 py-2">

//                       <img
//                         src={category.categoryImage}
//                         alt={category.label}
//                         className="w-16 h-16 object-cover mx-auto"
//                       />

//                   </td>
//                   <td className="px-4 py-2">
//                     <button
//                       onClick={() => handleEdit(index)}
//                       className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(index)}
//                       className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddCategory;

// import React, { useState, useEffect } from "react";
// import SummaryApi from "../common";

// const AddCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [categoryName, setCategoryName] = useState("");
//   const [value, setValue] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [editIndex, setEditIndex] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [parentCategories, setParentCategories] = useState([]);
//   const [isParentModalOpen, setIsParentModalOpen] = useState(false);
//   const [parentName, setParentName] = useState("");
//   const [parentImage, setParentImage] = useState(null);
//   const [parentImagePreview, setParentImagePreview] = useState(null);
//   const [editId, setEditId] = useState(null);
//   const [selectedParentCategory, setSelectedParentCategory] = useState("");

//   useEffect(() => {
//     fetchCategories();
//     fetchParentCategories();
//   }, [editIndex]);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getProductCategory.url);
//       const data = await response.json();
//       if (data.success) {
//         setCategories(data.categories);
//       } else {
//         console.error("Error fetching categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   // const fetchParentCategory = async () => {
//   //   const response = await fetch(SummaryApi.getParentCategories.url);
//   //   const data = await response.json();
//   //   console.log("Fetched Parent Categories:", data);
//   //   setParentCategories(data.categories);
//   // };

//   const fetchParentCategories = async () => {
//     try {
//       const response = await fetch(SummaryApi.getParentCategories.url); // Replace with your actual API endpoint
//       const data = await response.json();
//       console.log("Fetched Parent Categories:", data);

//       if (data.success && data.categories && Array.isArray(data.categories)) {
//         setParentCategories(data.categories);
//       } else {
//         console.error(
//           "Error: Parent categories not found or invalid response structure"
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching parent categories:", error);
//     }
//   };

//   const handleAddParentCategory = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", parentName);
//     formData.append("categoryImage", parentImage);

//     const response = await fetch(SummaryApi.AddParentCategory.url, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     if (data.success) {
//       fetchParentCategories();
//       setParentName("");
//       setParentImage(null);
//       setParentImagePreview(null);
//       setIsParentModalOpen(false);
//     } else {
//       alert(data.message);
//     }
//   };

//   const handleEditParentCategory = async (category) => {
//     setEditId(category._id);
//     setParentName(category.name || category.parentName);
//     setSelectedParentCategory(category.parentCategory || "");
//     setParentImagePreview(category.parentImage);
//     setIsParentModalOpen(true);
//   };

//   const handleUpdateParentCategory = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", parentName);
//     if (parentImage) {
//       formData.append("categoryImage", parentImage);
//     }

//     const url = SummaryApi.editParentCategory.url.replace(":id", editId);

//     const response = await fetch(url, {
//       method: SummaryApi.editParentCategory.method,
//       body: formData,
//     });

//     const data = await response.json();
//     if (data.success) {
//       fetchParentCategories();
//       setEditId(null);
//       setParentName("");
//       setParentImage(null);
//       setParentImagePreview(null);
//       setIsParentModalOpen(false);
//     } else {
//       alert(data.message);
//     }
//   };

//   const handleDeleteParentCategory = async (id) => {
//     const url = SummaryApi.deleteParentCategory.url.replace(":id", id);

//     const response = await fetch(url, {
//       method: SummaryApi.deleteParentCategory.method,
//     });

//     const data = await response.json();
//     if (data.success) {
//       fetchParentCategories();
//     } else {
//       alert(data.message);
//     }
//   };
//   const handleParentImageChange = (e) => {
//     const file = e.target.files[0];
//     setParentImage(file);
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setParentImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleCategoryNameChange = (e) => setCategoryName(e.target.value);
//   const handleValueChange = (e) => setValue(e.target.value);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("label", categoryName);
//     formData.append("value", value);
//     formData.append("parentCategory", selectedParentCategory); // Append selected parent category
//     console.log(
//       "Selected Parent Category before update:",
//       selectedParentCategory
//     );

//     if (image) {
//       formData.append("categoryImage", image);
//     }

//     const url =
//       editIndex !== null
//         ? SummaryApi.editProductCategory.url.replace(
//             ":id",
//             categories[editIndex]._id
//           )
//         : SummaryApi.addProductCategory.url;

//     const method = editIndex !== null ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method,
//         body: formData,
//       });
//       const data = await response.json();
//       console.log("API Response:", data);
//       if (data.success) {
//         fetchCategories();
//         setCategoryName("");
//         setValue("");
//         setImage(null);
//         setSelectedParentCategory(""); // Clear parent category selectio
//         setPreview(null);
//         setIsModalOpen(false);
//         setEditIndex(null);
//       } else {
//         console.error("Error saving category:", data.message);
//       }
//     } catch (error) {
//       console.error("Error saving category:", error);
//     }
//   };

//   const handleEdit = (index) => {
//     const category = categories[index];
//     setCategoryName(category.label);
//     setValue(category.value || ""); // Populate value
//     setSelectedParentCategory(
//       category.parentCategory ? category.parentCategory._id : ""
//     ); // Populate parent category
//     // setSelectedParentCategory(category.parentCategory || ""); // Populate parent category
//     setPreview(category.categoryImage);
//     setEditIndex(index);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (index) => {
//     const categoryId = categories[index]._id;
//     try {
//       const response = await fetch(
//         SummaryApi.deleteProductCategory.url.replace(":id", categoryId),
//         { method: SummaryApi.deleteProductCategory.method }
//       );
//       const data = await response.json();
//       if (data.success) {
//         fetchCategories();
//       } else {
//         console.error("Error deleting category:", data.message);
//       }
//     } catch (error) {
//       console.error("Error deleting category:", error);
//     }
//   };

//   let serialNumber = 1; // Initialize serial number

//   return (
//     <div className="p-8 min-h-screen bg-white mx-auto rounded-lg mt-2 lg:mt-0 ">
//       <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={() => setIsParentModalOpen(true)}
//         >
//           Add Parent Category
//         </button>

//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Add Product Category
//         </button>
//       </div>

//       {isParentModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-bold mb-4">
//               {editId ? "Edit Parent Category" : "Add Parent Category"}
//             </h2>
//             <form
//               onSubmit={
//                 editId ? handleUpdateParentCategory : handleAddParentCategory
//               }
//               className="flex flex-col"
//             >
//               <input
//                 type="text"
//                 placeholder="Category Name"
//                 className="mb-2 p-2 border border-gray-300"
//                 value={parentName}
//                 onChange={(e) => setParentName(e.target.value)}
//                 required
//               />

//               <input
//                 type="file"
//                 className="mb-2 p-2 border border-gray-300"
//                 onChange={handleParentImageChange}
//                 required={!editId}
//               />
//               {parentImagePreview && (
//                 <img
//                   src={parentImagePreview}
//                   alt="Preview"
//                   className="mt-4 w-32 h-32 object-cover rounded"
//                 />
//               )}
//               <button
//                 type="submit"
//                 className="p-2 bg-blue-500 text-white font-bold rounded"
//               >
//                 {editId ? "Update Category" : "Add Category"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsParentModalOpen(false)}
//                 className="mt-2 p-2 bg-gray-500 text-white font-bold rounded"
//               >
//                 Close
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {parentCategories.length > 0 && (
//         <div className="rounded-lg shadow-md mt-6 p-4">
//           <h3 className="text-lg font-bold mb-4">Parent Category List</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2">S.No</th>
//                 <th className="px-4 py-2">Name</th>
//                 <th className="px-4 py-2">Image</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="border border-r">
//               {parentCategories.map((category) => (
//                 <tr key={category._id} className="text-center">
//                   <td className="px-4 py-2">{serialNumber++}</td>
//                   <td className="px-4 py-2">{category.name}</td>
//                   <td className="px-4 py-2">
//                     <img
//                       src={category.categoryImage}
//                       alt={category.name}
//                       className="w-16 h-16 object-cover mx-auto"
//                     />
//                   </td>
//                   <td className="px-4 py-2 whitespace-nowrap">
//                     <button
//                       onClick={() => handleEditParentCategory(category)}
//                       className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteParentCategory(category._id)}
//                       className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           </div>
          
//         </div>
//       )}

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
//             <h3 className="text-lg font-bold mb-4">
//               {editIndex !== null
//                 ? "Edit Product Category"
//                 : "Add Product Category"}
//             </h3>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Category label
//                 </label>
//                 <input
//                   type="text"
//                   value={categoryName}
//                   onChange={handleCategoryNameChange}
//                   placeholder="Enter category name"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>

//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Parent Category
//               </label>
//               <select
//                 value={selectedParentCategory}
//                 onChange={(e) => setSelectedParentCategory(e.target.value)}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               >
//                 <option value="">Select Parent Category</option>
//                 {parentCategories.map((parent) => (
//                   <option key={parent._id} value={parent._id}>
//                     {parent.name}
//                   </option>
//                 ))}
//               </select>

//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Category Name
//                 </label>
//                 <input
//                   type="text"
//                   value={value}
//                   onChange={handleValueChange}
//                   placeholder="Enter value added"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Image
//                 </label>
//                 <input
//                   type="file"
//                   onChange={handleImageChange}
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//                 {preview && (
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="mt-4 w-32 h-32 object-cover rounded"
//                   />
//                 )}
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setEditIndex(null);
//                     setCategoryName("");
//                     setValue("");
//                     setPreview(null);
//                     setSelectedParentCategory(""); // Reset parent category selection
//                   }}
//                   className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                   {editIndex !== null ? "Update" : "Add"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {categories.length > 0 && (
//         <div className="rounded-lg shadow-md mt-6 p-4 ">
//           <h3 className="text-lg font-bold mb-4">Category List</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr>
//                   <th className="px-4 py-2">S.No</th>
//                   <th className="px-4 py-2">Name</th>
//                   <th className="px-4 py-2">Value</th>
//                   <th className="px-4 py-2">Parent Category</th>

//                   <th className="px-4 py-2">Image</th>
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="border border-r">
//                 {categories.map((category, index) => (
//                   <tr key={index} className="text-center">
//                     <td className="px-4 py-2">{index + 1}</td>
//                     <td className="px-4 py-2">{category.label}</td>
//                     <td className="px-4 py-2">{category.value || "N/A"}</td>
//                     <td className="px-4 py-2">
//                       {category.parentCategory
//                         ? category.parentCategory.name
//                         : "N/A"}
//                     </td>

//                     <td className="px-4 py-2">
//                       <img
//                         src={category.categoryImage}
//                         alt={category.label}
//                         className="w-16 h-16 object-cover mx-auto"
//                       />
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap">
//                       <button
//                         onClick={() => handleEdit(index)}
//                         className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(index)}
//                         className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddCategory;


import React, { useState, useEffect } from "react";
import SummaryApi from "../common";
import { MdModeEdit, MdDelete } from "react-icons/md";

const AddCategory = () => {
  // --- Sub-Category States ---
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isHideCategory, setIsHideCategory] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Parent Category States ---
  const [parentCategories, setParentCategories] = useState([]);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentImage, setParentImage] = useState(null);
  const [parentImagePreview, setParentImagePreview] = useState(null);
  const [isHideParent, setIsHideParent] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedParentCategory, setSelectedParentCategory] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchParentCategories();
  }, []);

  // --- API Fetchers ---
  const fetchCategories = async () => {
    try {
      const response = await fetch(SummaryApi.getProductCategory.url);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const response = await fetch(SummaryApi.getParentCategories.url);
      const data = await response.json();
      if (data.success && data.categories && Array.isArray(data.categories)) {
        setParentCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  // --- Image Handlers ---
  const handleParentImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setParentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setParentImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Fixed the missing handleImageChange function here
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- Parent Category Logic ---
  const handleAddParentCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", parentName);
    formData.append("categoryImage", parentImage);
    formData.append("isHide", isHideParent);

    const response = await fetch(SummaryApi.AddParentCategory.url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      fetchParentCategories();
      resetParentForm();
    } else {
      alert(data.message);
    }
  };

  const handleEditParentCategory = (category) => {
    setEditId(category._id);
    setParentName(category.name || category.parentName);
    setIsHideParent(category.isHide || false);
    setParentImagePreview(category.categoryImage);
    setIsParentModalOpen(true);
  };

  const handleUpdateParentCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", parentName);
    formData.append("isHide", isHideParent);
    if (parentImage) {
      formData.append("categoryImage", parentImage);
    }

    const url = SummaryApi.editParentCategory.url.replace(":id", editId);
    const response = await fetch(url, {
      method: SummaryApi.editParentCategory.method,
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      fetchParentCategories();
      resetParentForm();
    } else {
      alert(data.message);
    }
  };

  const resetParentForm = () => {
    setEditId(null);
    setParentName("");
    setParentImage(null);
    setParentImagePreview(null);
    setIsHideParent(false);
    setIsParentModalOpen(false);
  };

  const handleDeleteParentCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this parent category?")) {
      const url = SummaryApi.deleteParentCategory.url.replace(":id", id);
      const response = await fetch(url, { method: SummaryApi.deleteParentCategory.method });
      const data = await response.json();
      if (data.success) fetchParentCategories();
    }
  };

  // --- Sub-Category Logic ---
  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("label", categoryName);
    formData.append("value", value);
    formData.append("parentCategory", selectedParentCategory);
    formData.append("isHide", isHideCategory);

    if (image) formData.append("categoryImage", image);

    const url = editIndex !== null
      ? SummaryApi.editProductCategory.url.replace(":id", categories[editIndex]._id)
      : SummaryApi.addProductCategory.url;

    const method = editIndex !== null ? "PUT" : "POST";

    try {
      const response = await fetch(url, { method, body: formData });
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        resetCategoryForm();
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setValue("");
    setImage(null);
    setSelectedParentCategory("");
    setIsHideCategory(false);
    setPreview(null);
    setIsModalOpen(false);
    setEditIndex(null);
  };

  const handleEditSubCategory = (index) => {
    const category = categories[index];
    setCategoryName(category.label);
    setValue(category.value || "");
    setIsHideCategory(category.isHide || false);
    setSelectedParentCategory(category.parentCategory ? category.parentCategory._id : "");
    setPreview(category.categoryImage);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteSubCategory = async (index) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const categoryId = categories[index]._id;
      const response = await fetch(SummaryApi.deleteProductCategory.url.replace(":id", categoryId), { method: SummaryApi.deleteProductCategory.method });
      const data = await response.json();
      if (data.success) fetchCategories();
    }
  };

  return (
    <div className="p-4 min-h-screen mx-auto rounded-lg">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 bg-white p-4 shadow-sm rounded-lg mb-6">
        <h2 className="text-xl font-bold text-gray-800">Category Management</h2>
        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all text-sm font-medium" onClick={() => setIsParentModalOpen(true)}>
            Add Parent Category
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all text-sm font-medium">
            Add Sub Category
          </button>
        </div>
      </div>

      {/* --- Parent Category Modal --- */}
      {isParentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{editId ? "Edit Parent Category" : "Add Parent Category"}</h2>
            <form onSubmit={editId ? handleUpdateParentCategory : handleAddParentCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={parentName} onChange={(e) => setParentName(e.target.value)} required />
              </div>

              <div className="flex items-center p-2 bg-gray-50 rounded border">
                <input type="checkbox" id="isHideParent" className="w-4 h-4 text-blue-600 cursor-pointer" checked={isHideParent} onChange={(e) => setIsHideParent(e.target.checked)} />
                <label htmlFor="isHideParent" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Hide from users</label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Image</label>
                <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={handleParentImageChange} required={!editId} />
              </div>
              
              {parentImagePreview && <img src={parentImagePreview} alt="Preview" className="mt-2 w-full h-40 object-contain rounded border bg-gray-50" />}
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetParentForm} className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">{editId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Sub-Category Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6 text-gray-800">{editIndex !== null ? "Edit Sub Category" : "Add Sub Category"}</h3>
            <form onSubmit={handleSubmitSubCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sub Category Name</label>
                <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Category</label>
                <select value={selectedParentCategory} onChange={(e) => setSelectedParentCategory(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none" required>
                  <option value="">Select Parent...</option>
                  {parentCategories.map((parent) => <option key={parent._id} value={parent._id}>{parent.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL / Slug Value</label>
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>

              <div className="flex items-center p-2 bg-gray-50 rounded border">
                <input type="checkbox" id="isHideCategory" className="w-4 h-4 text-green-600 cursor-pointer" checked={isHideCategory} onChange={(e) => setIsHideCategory(e.target.checked)} />
                <label htmlFor="isHideCategory" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Hide from users</label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image</label>
                <input type="file" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              </div>

              {preview && <img src={preview} alt="Preview" className="mt-2 w-full h-40 object-contain rounded border bg-gray-50" />}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetCategoryForm} className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">{editIndex !== null ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Parent Category List Table --- */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">Parent Categories</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Image</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parentCategories.map((cat, idx) => (
                <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm">{idx + 1}</td>
                  <td className="px-4 py-4 text-sm font-medium">{cat.name}</td>
                  <td className="px-4 py-4 text-center">
                    {cat.isHide ? <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Hidden</span> : <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">Visible</span>}
                  </td>
                  <td className="px-4 py-4">
                    <img src={cat.categoryImage} className="w-10 h-10 object-cover rounded-md shadow-sm mx-auto" alt={cat.name} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditParentCategory(cat)} className="p-2 text-yellow-600 bg-yellow-50 rounded-full hover:bg-yellow-600 hover:text-white transition-all"><MdModeEdit size={18} /></button>
                      <button onClick={() => handleDeleteParentCategory(cat._id)} className="p-2 text-red-600 bg-red-50 rounded-full hover:bg-red-600 hover:text-white transition-all"><MdDelete size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Sub-Category List Table --- */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">Sub Categories</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Image</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat, idx) => (
                <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm">{idx + 1}</td>
                  <td className="px-4 py-4 text-sm font-medium">{cat.label}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{cat.parentCategory?.name || "N/A"}</td>
                  <td className="px-4 py-4 text-center">
                    {cat.isHide ? <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Hidden</span> : <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">Visible</span>}
                  </td>
                  <td className="px-4 py-4">
                    <img src={cat.categoryImage} className="w-10 h-10 object-cover rounded-md shadow-sm mx-auto" alt={cat.label} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditSubCategory(idx)} className="p-2 text-yellow-600 bg-yellow-50 rounded-full hover:bg-yellow-600 hover:text-white transition-all"><MdModeEdit size={18} /></button>
                      <button onClick={() => handleDeleteSubCategory(idx)} className="p-2 text-red-600 bg-red-50 rounded-full hover:bg-red-600 hover:text-white transition-all"><MdDelete size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;