// // import React, { useState, useEffect } from 'react';

// // function AddParentCategory() {
// //   const [categories, setCategories] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [name, setName] = useState('');
// //   const [categoryImage, setCategoryImage] = useState(null);
// //   const [categoryImagePreview, setCategoryImagePreview] = useState(null);
// //   const [editId, setEditId] = useState(null);

// //   useEffect(() => {
// //     fetchCategories();
// //   }, []);

// //   const fetchCategories = async () => {
// //     const response = await fetch('http://localhost:8080/api/get-parent-categories');
// //     const data = await response.json();
// //     setCategories(data.categories);
// //   };

// //   const handleAddCategory = async (e) => {
// //     e.preventDefault();

// //     const formData = new FormData();
// //     formData.append('name', name);
// //     formData.append('categoryImage', categoryImage);

// //     const response = await fetch('http://localhost:8080/api/add-parent-category', {
// //       method: 'POST',
// //       body: formData,
// //     });

// //     const data = await response.json();
// //     if (data.success) {
// //       fetchCategories();
// //       setName('');
// //       setCategoryImage(null);
// //       setCategoryImagePreview(null);
// //       setIsModalOpen(false);
// //     } else {
// //       alert(data.message);
// //     }
// //   };

// //   const handleEditCategory = async (category) => {
// //     setEditId(category._id);
// //     setName(category.name);
// //     setCategoryImage(null);
// //     setCategoryImagePreview(category.categoryImage);
// //     setIsModalOpen(true);
// //   };

// //   const handleUpdateCategory = async (e) => {
// //     e.preventDefault();

// //     const formData = new FormData();
// //     formData.append('name', name);
// //     if (categoryImage) {
// //       formData.append('categoryImage', categoryImage);
// //     }

// //     const response = await fetch(`http://localhost:8080/api/edit-parent-category/${editId}`, {
// //       method: 'PUT',
// //       body: formData,
// //     });

// //     const data = await response.json();
// //     if (data.success) {
// //       fetchCategories();
// //       setEditId(null);
// //       setName('');
// //       setCategoryImage(null);
// //       setCategoryImagePreview(null);
// //       setIsModalOpen(false);
// //     } else {
// //       alert(data.message);
// //     }
// //   };

// //   const handleDeleteCategory = async (id) => {
// //     const response = await fetch(`http://localhost:8080/api/delete-parent-category/${id}`, {
// //       method: 'DELETE',
// //     });

// //     const data = await response.json();
// //     if (data.success) {
// //       fetchCategories();
// //     } else {
// //       alert(data.message);
// //     }
// //   };

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0];
// //     setCategoryImage(file);
// //     const reader = new FileReader();
// //     reader.onloadend = () => {
// //       setCategoryImagePreview(reader.result);
// //     };
// //     reader.readAsDataURL(file);
// //   };

// //   return (
// //     <div className="container mx-auto p-6">
// //       <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
// //         <h2 className="text-2xl font-bold mb-4">Parent Categories</h2>
// //         <button
// //           className="mb-4 px-4 py-2 bg-blue-500 text-white font-bold rounded"
// //           onClick={() => setIsModalOpen(true)}
// //         >
// //           Add Parent Category
// //         </button>
// //       </div>

// //       {isModalOpen && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg">
// //             <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Parent Category' : 'Add Parent Category'}</h2>
// //             <form
// //               onSubmit={editId ? handleUpdateCategory : handleAddCategory}
// //               className="flex flex-col"
// //             >
// //               <input
// //                 type="text"
// //                 placeholder="Category Name"
// //                 className="mb-2 p-2 border border-gray-300"
// //                 value={name}
// //                 onChange={(e) => setName(e.target.value)}
// //                 required
// //               />
              
// //               <input
// //                 type="file"
// //                 className="mb-2 p-2 border border-gray-300"
// //                 onChange={handleImageChange}
// //                 required={!editId}
// //               />
// //               {categoryImagePreview && (
// //                 <img
// //                   src={categoryImagePreview}
// //                   alt="Preview"
// //                   className="mt-4 w-32 h-32 object-cover rounded"
// //                 />
// //               )}
// //               <button
// //                 type="submit"
// //                 className="p-2 bg-blue-500 text-white font-bold rounded"
// //               >
// //                 {editId ? 'Update Category' : 'Add Category'}
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={() => setIsModalOpen(false)}
// //                 className="mt-2 p-2 bg-gray-500 text-white font-bold rounded"
// //               >
// //                 Close
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //       {categories.length > 0 && (
// //         <div className="rounded-lg shadow-md mt-6 p-4">
// //         <h3 className="text-lg font-bold mb-4">Parent Category List</h3>
// //           <table className="min-w-full table-auto">
// //             <thead>
// //           <tr>
// //             <th className="px-4 py-2">Name</th>
// //             <th className="px-4 py-2">Image</th>
// //             <th className="px-4 py-2">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody className="border border-r">
// //           {categories.map((category) => (
// //             <tr key={category._id} className="text-center">
// //               <td className="px-4 py-2">{category.name}</td>
// //               <td className="px-4 py-2">
// //                 <img src={category.categoryImage} alt={category.name} className="w-16 h-16 object-cover mx-auto" />
// //               </td>
// //               <td className="px-4 py-2">
// //                 <button
// //                   onClick={() => handleEditCategory(category)}
// //                   className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2"
// //                 >
// //                   Edit
// //                 </button>
// //                 <button
// //                   onClick={() => handleDeleteCategory(category._id)}
// //                   className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
// //                 >
// //                   Delete
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //       </div>
// //     )}
// //     </div>
// //   );
// // }

// // export default AddParentCategory;


// import React, { useState, useEffect } from 'react';

// function AddParentCategory() {
//   const [categories, setCategories] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [name, setName] = useState('');
//   const [categoryImage, setCategoryImage] = useState(null);
//   const [categoryImagePreview, setCategoryImagePreview] = useState(null);
//   const [isHide, setIsHide] = useState(false); // 1. New State
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     const response = await fetch('http://localhost:8080/api/get-parent-categories');
//     const data = await response.json();
//     setCategories(data.categories);
//   };

//   const handleAddCategory = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('categoryImage', categoryImage);
//     formData.append('isHide', isHide); // 2. Add to FormData

//     const response = await fetch('http://localhost:8080/api/add-parent-category', {
//       method: 'POST',
//       body: formData,
//     });

//     const data = await response.json();
//     if (data.success) {
//       fetchCategories();
//       resetForm();
//       setIsModalOpen(false);
//     } else {
//       alert(data.message);
//     }
//   };

//   const handleEditCategory = async (category) => {
//     setEditId(category._id);
//     setName(category.name);
//     setIsHide(category.isHide || false); // 3. Set hide state for edit
//     setCategoryImage(null);
//     setCategoryImagePreview(category.categoryImage);
//     setIsModalOpen(true);
//   };

//   const handleUpdateCategory = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('isHide', isHide); // 4. Add to FormData
//     if (categoryImage) {
//       formData.append('categoryImage', categoryImage);
//     }

//     const response = await fetch(`http://localhost:8080/api/edit-parent-category/${editId}`, {
//       method: 'PUT',
//       body: formData,
//     });

//     const data = await response.json();
//     if (data.success) {
//       fetchCategories();
//       resetForm();
//       setIsModalOpen(false);
//     } else {
//       alert(data.message);
//     }
//   };

//   // Helper to clear form
//   const resetForm = () => {
//     setEditId(null);
//     setName('');
//     setIsHide(false);
//     setCategoryImage(null);
//     setCategoryImagePreview(null);
//   };

//   const handleDeleteCategory = async (id) => {
//     const response = await fetch(`http://localhost:8080/api/delete-parent-category/${id}`, {
//       method: 'DELETE',
//     });

//     const data = await response.json();
//     if (data.success) {
//       fetchCategories();
//     } else {
//       alert(data.message);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setCategoryImage(file);
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setCategoryImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//         <h2 className="text-2xl font-bold mb-4">Parent Categories</h2>
//         <button
//           className="mb-4 px-4 py-2 bg-blue-500 text-white font-bold rounded"
//           onClick={() => { resetForm(); setIsModalOpen(true); }}
//         >
//           Add Parent Category
//         </button>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Parent Category' : 'Add Parent Category'}</h2>
//             <form
//               onSubmit={editId ? handleUpdateCategory : handleAddCategory}
//               className="flex flex-col"
//             >
//               <label className="text-sm font-semibold mb-1">Category Name</label>
//               <input
//                 type="text"
//                 placeholder="Category Name"
//                 className="mb-4 p-2 border border-gray-300 rounded"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
              
//               <label className="text-sm font-semibold mb-1">Category Image</label>
//               <input
//                 type="file"
//                 className="mb-4 p-2 border border-gray-300 rounded"
//                 onChange={handleImageChange}
//                 required={!editId}
//               />

//               {/* IS HIDE CHECKBOX */}
//               <div className="flex items-center mb-4">
//                 <input
//                   type="checkbox"
//                   id="isHide"
//                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   checked={isHide}
//                   onChange={(e) => setIsHide(e.target.checked)}
//                 />
//                 <label htmlFor="isHide" className="ml-2 text-sm font-medium text-gray-700">
//                   Hide this category from users
//                 </label>
//               </div>

//               {categoryImagePreview && (
//                 <div className="mb-4 flex justify-center">
//                    <img
//                     src={categoryImagePreview}
//                     alt="Preview"
//                     className="w-32 h-32 object-cover rounded border"
//                   />
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 className="p-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
//               >
//                 {editId ? 'Update Category' : 'Add Category'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="mt-2 p-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition"
//               >
//                 Close
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {categories.length > 0 && (
//         <div className="rounded-lg shadow-md mt-6 p-4 bg-white">
//           <h3 className="text-lg font-bold mb-4">Parent Category List</h3>
//           <table className="min-w-full table-auto">
//             <thead>
//               <tr className="bg-gray-100 text-gray-700">
//                 <th className="px-4 py-2">Name</th>
//                 <th className="px-4 py-2">Status</th> {/* Added status column */}
//                 <th className="px-4 py-2">Image</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((category) => (
//                 <tr key={category._id} className="text-center border-b">
//                   <td className="px-4 py-2 font-medium">{category.name}</td>
//                   <td className="px-4 py-2">
//                     {category.isHide ? (
//                       <span className="text-red-500 text-xs font-bold px-2 py-1 bg-red-100 rounded-full">Hidden</span>
//                     ) : (
//                       <span className="text-green-500 text-xs font-bold px-2 py-1 bg-green-100 rounded-full">Visible</span>
//                     )}
//                   </td>
//                   <td className="px-4 py-2">
//                     <img src={category.categoryImage} alt={category.name} className="w-16 h-16 object-cover mx-auto rounded" />
//                   </td>
//                   <td className="px-4 py-2">
//                     <button
//                       onClick={() => handleEditCategory(category)}
//                       className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded mr-2 transition"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteCategory(category._id)}
//                       className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded transition"
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
// }

// export default AddParentCategory;