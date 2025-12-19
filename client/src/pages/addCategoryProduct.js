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

import React, { useState, useEffect } from "react";
import SummaryApi from "../common";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [parentCategories, setParentCategories] = useState([]);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentImage, setParentImage] = useState(null);
  const [parentImagePreview, setParentImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [selectedParentCategory, setSelectedParentCategory] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchParentCategories();
  }, [editIndex]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(SummaryApi.getProductCategory.url);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        console.error("Error fetching categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // const fetchParentCategory = async () => {
  //   const response = await fetch(SummaryApi.getParentCategories.url);
  //   const data = await response.json();
  //   console.log("Fetched Parent Categories:", data);
  //   setParentCategories(data.categories);
  // };

  const fetchParentCategories = async () => {
    try {
      const response = await fetch(SummaryApi.getParentCategories.url); // Replace with your actual API endpoint
      const data = await response.json();
      console.log("Fetched Parent Categories:", data);

      if (data.success && data.categories && Array.isArray(data.categories)) {
        setParentCategories(data.categories);
      } else {
        console.error(
          "Error: Parent categories not found or invalid response structure"
        );
      }
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  const handleAddParentCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", parentName);
    formData.append("categoryImage", parentImage);

    const response = await fetch(SummaryApi.AddParentCategory.url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      fetchParentCategories();
      setParentName("");
      setParentImage(null);
      setParentImagePreview(null);
      setIsParentModalOpen(false);
    } else {
      alert(data.message);
    }
  };

  const handleEditParentCategory = async (category) => {
    setEditId(category._id);
    setParentName(category.name || category.parentName);
    setSelectedParentCategory(category.parentCategory || "");
    setParentImagePreview(category.parentImage);
    setIsParentModalOpen(true);
  };

  const handleUpdateParentCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", parentName);
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
      setEditId(null);
      setParentName("");
      setParentImage(null);
      setParentImagePreview(null);
      setIsParentModalOpen(false);
    } else {
      alert(data.message);
    }
  };

  const handleDeleteParentCategory = async (id) => {
    const url = SummaryApi.deleteParentCategory.url.replace(":id", id);

    const response = await fetch(url, {
      method: SummaryApi.deleteParentCategory.method,
    });

    const data = await response.json();
    if (data.success) {
      fetchParentCategories();
    } else {
      alert(data.message);
    }
  };
  const handleParentImageChange = (e) => {
    const file = e.target.files[0];
    setParentImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setParentImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryNameChange = (e) => setCategoryName(e.target.value);
  const handleValueChange = (e) => setValue(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("label", categoryName);
    formData.append("value", value);
    formData.append("parentCategory", selectedParentCategory); // Append selected parent category
    console.log(
      "Selected Parent Category before update:",
      selectedParentCategory
    );

    if (image) {
      formData.append("categoryImage", image);
    }

    const url =
      editIndex !== null
        ? SummaryApi.editProductCategory.url.replace(
            ":id",
            categories[editIndex]._id
          )
        : SummaryApi.addProductCategory.url;

    const method = editIndex !== null ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
      const data = await response.json();
      console.log("API Response:", data);
      if (data.success) {
        fetchCategories();
        setCategoryName("");
        setValue("");
        setImage(null);
        setSelectedParentCategory(""); // Clear parent category selectio
        setPreview(null);
        setIsModalOpen(false);
        setEditIndex(null);
      } else {
        console.error("Error saving category:", data.message);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (index) => {
    const category = categories[index];
    setCategoryName(category.label);
    setValue(category.value || ""); // Populate value
    setSelectedParentCategory(
      category.parentCategory ? category.parentCategory._id : ""
    ); // Populate parent category
    // setSelectedParentCategory(category.parentCategory || ""); // Populate parent category
    setPreview(category.categoryImage);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = async (index) => {
    const categoryId = categories[index]._id;
    try {
      const response = await fetch(
        SummaryApi.deleteProductCategory.url.replace(":id", categoryId),
        { method: SummaryApi.deleteProductCategory.method }
      );
      const data = await response.json();
      if (data.success) {
        fetchCategories();
      } else {
        console.error("Error deleting category:", data.message);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  let serialNumber = 1; // Initialize serial number

  return (
    <div className="p-8 min-h-screen bg-white mx-auto rounded-lg mt-2 lg:mt-0 ">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsParentModalOpen(true)}
        >
          Add Parent Category
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Product Category
        </button>
      </div>

      {isParentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Parent Category" : "Add Parent Category"}
            </h2>
            <form
              onSubmit={
                editId ? handleUpdateParentCategory : handleAddParentCategory
              }
              className="flex flex-col"
            >
              <input
                type="text"
                placeholder="Category Name"
                className="mb-2 p-2 border border-gray-300"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
              />

              <input
                type="file"
                className="mb-2 p-2 border border-gray-300"
                onChange={handleParentImageChange}
                required={!editId}
              />
              {parentImagePreview && (
                <img
                  src={parentImagePreview}
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-cover rounded"
                />
              )}
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white font-bold rounded"
              >
                {editId ? "Update Category" : "Add Category"}
              </button>
              <button
                type="button"
                onClick={() => setIsParentModalOpen(false)}
                className="mt-2 p-2 bg-gray-500 text-white font-bold rounded"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {parentCategories.length > 0 && (
        <div className="rounded-lg shadow-md mt-6 p-4">
          <h3 className="text-lg font-bold mb-4">Parent Category List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">S.No</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="border border-r">
              {parentCategories.map((category) => (
                <tr key={category._id} className="text-center">
                  <td className="px-4 py-2">{serialNumber++}</td>
                  <td className="px-4 py-2">{category.name}</td>
                  <td className="px-4 py-2">
                    <img
                      src={category.categoryImage}
                      alt={category.name}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEditParentCategory(category)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteParentCategory(category._id)}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">
              {editIndex !== null
                ? "Edit Product Category"
                : "Add Product Category"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category label
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={handleCategoryNameChange}
                  placeholder="Enter category name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <label className="block text-gray-700 text-sm font-bold mb-2">
                Parent Category
              </label>
              <select
                value={selectedParentCategory}
                onChange={(e) => setSelectedParentCategory(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Parent Category</option>
                {parentCategories.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.name}
                  </option>
                ))}
              </select>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={handleValueChange}
                  placeholder="Enter value added"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditIndex(null);
                    setCategoryName("");
                    setValue("");
                    setPreview(null);
                    setSelectedParentCategory(""); // Reset parent category selection
                  }}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="rounded-lg shadow-md mt-6 p-4 ">
          <h3 className="text-lg font-bold mb-4">Category List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">S.No</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Value</th>
                  <th className="px-4 py-2">Parent Category</th>

                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="border border-r">
                {categories.map((category, index) => (
                  <tr key={index} className="text-center">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{category.label}</td>
                    <td className="px-4 py-2">{category.value || "N/A"}</td>
                    <td className="px-4 py-2">
                      {category.parentCategory
                        ? category.parentCategory.name
                        : "N/A"}
                    </td>

                    <td className="px-4 py-2">
                      <img
                        src={category.categoryImage}
                        alt={category.label}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCategory;
