// import React, { useState, useEffect } from "react";
// import { CgClose } from "react-icons/cg";
// import axios from "axios";
// import SummaryApi from "../common";
// const UploadOfferPoster = ({ onClose, offerposter, onSuccess }) => {
//     const [image, setImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState("");
//     const [parentCategory, setParentCategory] = useState("");
//     const [childCategory, setChildCategory] = useState("");
//     const [message, setMessage] = useState("");
//       const [parentCategories, setParentCategories] = useState([]);
//       const [categories, setCategories] = useState([]);
//       const [editIndex, setEditIndex] = useState(null);


//     // Debugging: Check if offerposter is coming properly
//     console.log("Offer Poster Data:", offerposter);

//     // Effect to pre-fill form when editing
//     useEffect(() => {
//         if (offerposter && offerposter._id) {
//             setParentCategory(offerposter.parentCategory || "");
//             setChildCategory(offerposter.childCategory || "");
//             setImagePreview(offerposter.image || "");
//         }
//     }, [offerposter]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(file);
//             setImagePreview(URL.createObjectURL(file)); // Show new preview
//         }
//     };
//     useEffect(() => {
//         fetchCategories();
//         fetchParentCategories();
//       }, [editIndex]);
    
//       const fetchCategories = async () => {
//         try {
//           const response = await fetch(SummaryApi.getProductCategory.url);
//           const data = await response.json();
//           if (data.success) {
//             setCategories(data.categories);
//           } else {
//             console.error("Error fetching categories");
//           }
//         } catch (error) {
//           console.error("Error fetching categories:", error);
//         }
//       };
    
//       // const fetchParentCategory = async () => {
//       //   const response = await fetch(SummaryApi.getParentCategories.url);
//       //   const data = await response.json();
//       //   console.log("Fetched Parent Categories:", data);
//       //   setParentCategories(data.categories);
//       // };
    
//       const fetchParentCategories = async () => {
//         try {
//           const response = await fetch(SummaryApi.getParentCategories.url); // Replace with your actual API endpoint
//           const data = await response.json();
//           console.log("Fetched Parent Categories:", data);
    
//           if (data.success && data.categories && Array.isArray(data.categories)) {
//             setParentCategories(data.categories);
    
//           } else {
//             console.error("Error: Parent categories not found or invalid response structure");
//           }
//         } catch (error) {
//           console.error("Error fetching parent categories:", error);
//         }
//       };
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!parentCategory || !childCategory || (!image && !offerposter.image)) {
//             setMessage("All fields are required!");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("parentCategory", parentCategory);
//         formData.append("childCategory", childCategory);
//         if (image) {
//             formData.append("image", image);
//         }

//         try {
//             const response = await axios({
//                 method: offerposter ? "put" : "post",
//                 url: offerposter
//                     ? `http://localhost:8080/api/update-offerposter/${offerposter._id}`
//                     : "http://localhost:8080/api/add-offerposter",
//                 data: formData,
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             if (response.data.success) {
//                 setMessage("Offer poster updated successfully!");
                
//                 // Reset form state
//                 setParentCategory("");
//                 setChildCategory("");
//                 setImage(null);
//                 setImagePreview(null);

//                 onClose();
//                 onSuccess(); // Call callback to update parent
//             }
//         } catch (error) {
//             console.error("Error uploading offer poster:", error);
//             setMessage("Upload failed. Try again.");
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-10">
//             <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] shadow-lg relative">
//                 <div className="flex justify-between items-center pb-3">
//                     <h2 className="font-bold text-lg">
//                         {offerposter ? "Edit Offer Poster" : "Upload Offer Poster"}
//                     </h2>
//                     <button className="text-2xl hover:text-red-600 transition" onClick={onClose}>
//                         <CgClose />
//                     </button>
//                 </div>

//                 {message && <p className="text-red-500 text-md mb-3">{message}</p>}

//                 <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[60vh] px-2">
//                     <div className="relative mb-4 mt-2">
//                         <input
//                             type="text"
//                             placeholder=" "
//                             className="peer h-12 w-full border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:border-red-500 focus:outline-none transition"
//                             value={parentCategory}
//                             onChange={(e) => setParentCategory(e.target.value)}
//                         />
//                         <label
//                             className="absolute left-4 -top-2 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-red-500"
//                         >
//                             Enter Parent Category*
//                         </label>
//                     </div>

//                     <div className="relative mb-4 mt-2">
//                         <input
//                             type="text"
//                             placeholder=" "
//                             className="peer h-12 w-full border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:border-red-500 focus:outline-none transition"
//                             value={childCategory}
//                             onChange={(e) => setChildCategory(e.target.value)}
//                         />
//                         <label
//                             className="absolute left-4 -top-2 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-red-500"
//                         >
//                             Enter Sub Category*
//                         </label>
//                     </div>

//                     <label className="mb-4 flex items-center border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
//                         <input type="file" onChange={handleImageChange} className="hidden" />
//                         <span className="text-sm text-gray-700">
//                             {image ? image.name : "Choose an image"}
//                         </span>
//                     </label>

//                     {imagePreview && (
//                         <div className="mb-4">
//                             <img
//                                 src={imagePreview}
//                                 alt="Offer Poster"
//                                 className="w-full h-auto rounded-md"
//                             />
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         className="w-full px-6 py-2 border border-red-600 text-red-600 font-bold rounded hover:bg-red-600 hover:text-white transition"
//                     >
//                         {offerposter ? "Update Offer Poster" : "Upload Offer Poster"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UploadOfferPoster;

import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import axios from "axios";
import SummaryApi from "../common";

const UploadOfferPoster = ({ onClose, offerposter, onSuccess }) => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [parentCategory, setParentCategory] = useState("");
    const [childCategory, setChildCategory] = useState("");
    const [message, setMessage] = useState("");
    const [parentCategories, setParentCategories] = useState([]);
    const [categories, setCategories] = useState([]); // Store all categories to filter by parent
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Effect to pre-fill form when editing
    useEffect(() => {
        if (offerposter && offerposter._id) {
            setParentCategory(offerposter.parentCategory?._id || "");
            setChildCategory(offerposter.childCategory || "");
            setImagePreview(offerposter.image || "");
        }
    }, [offerposter]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Show new preview
        }
    };

    // Fetch parent categories on component mount
    useEffect(() => {
        fetchParentCategories();
    }, []);

    // Fetch all categories when the parent category is selected
    useEffect(() => {
        if (parentCategory) {
            fetchCategories(parentCategory); // Fetch child categories for the selected parent category
        }
    }, [parentCategory]);

    const fetchCategories = async (parentId) => {
        try {
            const response = await fetch(SummaryApi.getProductCategory.url);
            const data = await response.json();
            if (data.success && Array.isArray(data.categories)) {
                console.log("Fetched Categories:", data.categories); // Debugging
                const filteredCategories = data.categories.filter(
                    (category) => category.parentCategory && category.parentCategory._id === parentId
                );
                console.log("Filtered Categories:", filteredCategories);
                setCategories(filteredCategories); // Set filtered categories based on parentId
            } else {
                console.error("Error: Categories not found or invalid response structure");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchParentCategories = async () => {
        try {
            const response = await fetch(SummaryApi.getParentCategories.url); // Replace with your actual API endpoint
            const data = await response.json();
            console.log("Fetched Parent Categories:", data);

            if (data.success && data.categories && Array.isArray(data.categories)) {
                setParentCategories(data.categories);
            } else {
                console.error("Error: Parent categories not found or invalid response structure");
            }
        } catch (error) {
            console.error("Error fetching parent categories:", error);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!parentCategory || !childCategory || (!image && !offerposter.image)) {
        setMessage("All fields are required!");
        return;
    }

    const formData = new FormData();
    formData.append("parentCategory", parentCategory);
    formData.append("childCategory", childCategory);
    if (image) {
        formData.append("image", image);
    } else if (offerposter?.image) {
        formData.append("image", offerposter.image); // Keep the existing image if no new one is uploaded
    }

    try {
        const isEdit = offerposter && offerposter._id; // Check if editing or adding new
        const response = await axios({
            method: isEdit ? "put" : "post",
            url: isEdit
                ? SummaryApi.updateOfferPoster(offerposter._id).url
                : SummaryApi.UploadOfferPoster.url,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        });

    
        // // Perform the API request
        //  response = await axios({
        //     method: offerposter ? "put" : "post",
        //     url: offerposter
        //         ? `http://localhost:8080/api/update-offerposter/${offerposter._id}`
        //         : "http://localhost:8080/api/add-offerposter",
        //     data: formData,
        //     headers: { "Content-Type": "multipart/form-data" },
        // });

         // Handle both "add" and "update" success messages
         if (response.data && (response.data.message === 'Offer Poster added successfully.' || 
            response.data.message === 'Offer Poster updated successfully.')) {
            setMessage("Offer poster uploaded successfully!");

            // Reset form only if adding new
            if (!isEdit) {
                setParentCategory("");
                setChildCategory("");
                setImage(null);
                setImagePreview(null);
            }

            // Call onSuccess callback to refresh the parent component
            onSuccess(response.data.offerPoster);

            // Close modal after a successful submit
            onClose();
            console.log("Upload successful, modal should now close.");
        } else {
            setMessage("Failed to upload poster. Try again.");
            console.error("Error uploading poster:", response.data);
        }
    } catch (error) {
        // Catch any errors during the API request
        console.error("Error uploading offer poster:", error);
        setMessage("Upload failed. Please try again.");
    }
};
const handleCloseModal = () => {
    setIsModalOpen(false); // This will close the modal
};

const handleOpenModal = () => {
    setIsModalOpen(true); // This will open the modal
};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-10">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] shadow-lg relative">
                <div className="flex justify-between items-center pb-3">
                    <h2 className="font-bold text-lg">
                        {offerposter ? "Edit Offer Poster" : "Upload Offer Poster"}
                    </h2>
                    <button className="text-2xl hover:text-red-600 transition" onClick={onClose}>
                        <CgClose />
                    </button>
                </div>

                {message && <p className="text-red-500 text-md mb-3">{message}</p>}

                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[60vh] px-2">
                    {/* Parent Category Dropdown */}
                    <div className="relative mb-4 mt-2">
                        <select
                            className="peer h-12 w-full border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:border-red-500 focus:outline-none transition"
                            value={parentCategory}
                            onChange={(e) => {
                                setParentCategory(e.target.value);
                                setChildCategory(""); // Reset child category when parent changes
                            }}
                        >
                            <option value="">Select Parent Category</option>
                            {parentCategories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <label
                            className="absolute left-4 -top-2 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-red-500"
                        >
                            Select Parent Category*
                        </label>
                    </div>

                    {/* Child Category Dropdown */}
                    <div className="relative mb-4 mt-2">
                        <select
                            className="peer h-12 w-full border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:border-red-500 focus:outline-none transition"
                            value={childCategory}
                            onChange={(e) => setChildCategory(e.target.value)}
                            disabled={!parentCategory} // Disable if no parent category selected
                        >
                            <option value="">Select Child Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category.value}>
                                    {category.value}
                                </option>
                            ))}
                        </select>
                        <label
                            className="absolute left-4 -top-2 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-red-500"
                        >
                            Select Sub Category*
                        </label>
                    </div>

                    {/* Image Upload */}
                    <label className="mb-4 flex items-center border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
                        <input type="file" onChange={handleImageChange} className="hidden" />
                        <span className="text-sm text-gray-700">
                            {image ? image.name : "Choose an image"}
                        </span>
                    </label>

                    {imagePreview && (
                        <div className="mb-4">
                            <img
                                src={imagePreview}
                                alt="Offer Poster"
                                className="w-full h-auto rounded-md"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full px-6 py-2 border border-red-600 text-red-600 font-bold rounded hover:bg-red-600 hover:text-white transition"
                    >
                        {offerposter ? "Update Offer Poster" : "Upload Offer Poster"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadOfferPoster;