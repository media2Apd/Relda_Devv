// import React, { useState, useEffect } from 'react';
// import { CgClose } from "react-icons/cg";
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';

// const UploadCoupon = ({ onClose, fetchData, editData }) => {
//     const [categories, setCategories] = useState([]);
//     // const [products, setProducts] = useState([]);
//     const [data, setData] = useState({
//         code: "",
//         discountType: "percentage",
//         discountValue: "",
//         minOrderAmount: 0,
//         maxDiscountAmount: "",
//         expiryDate: "",
//         usageLimit: "",
//         isActive: true,
//         parentCategory: "",
//         productCategory: "",
//         products: []
//     });

//     useEffect(() => {
//         if (editData) {
//             setData({
//                 ...editData,
//                 expiryDate: editData.expiryDate ? editData.expiryDate.split('T')[0] : "",
//                 parentCategory: editData.parentCategory?._id || "",
//                 productCategory: editData.productCategory?._id || "",
//                 products: editData.products?.map(p => p._id) || []
//             });
//         }
//         fetchCategories();
//         // fetchProducts();
//     }, [editData]);

//     const fetchCategories = async () => {
//         const response = await fetch(SummaryApi.getProductCategory.url);
//         const dataRes = await response.json();
//         if (dataRes.success) setCategories(dataRes.categories);
//     };

//     // const fetchProducts = async () => {
//     //     const response = await fetch(SummaryApi.allProduct.url);
//     //     const dataRes = await response.json();
//     //     if (dataRes.data) setProducts(dataRes.data);
//     // };

//     const handleOnChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const url = editData ? `${SummaryApi.updateCoupon.url}/${editData._id}` : SummaryApi.createCoupon.url;
//         const method = editData ? SummaryApi.updateCoupon.method : SummaryApi.createCoupon.method;

//         const response = await fetch(url, {
//             method: method,
//             headers: { "content-type": "application/json" },
//             body: JSON.stringify(data)
//         });

//         const responseData = await response.json();
//         if (responseData.success) {
//             toast.success(responseData.message);
//             onClose();
//             fetchData();
//         } else {
//             toast.error(responseData.message);
//         }
//     };

//     return (
//         <div className='fixed w-full h-full bg-slate-200 bg-opacity-50 top-0 left-0 flex justify-center items-center z-50'>
//             <div className='bg-white p-4 rounded w-full max-w-2xl max-h-[90%] overflow-y-auto'>
//                 <div className='flex justify-between items-center border-b pb-2'>
//                     <h2 className='font-bold text-lg'>{editData ? "Edit Coupon" : "Create Coupon"}</h2>
//                     <CgClose className='text-2xl cursor-pointer' onClick={onClose} />
//                 </div>

//                 <form className='grid gap-3 py-4' onSubmit={handleSubmit}>
//                     <div className='grid grid-cols-2 gap-4'>
//                         <div>
//                             <label>Coupon Code:</label>
//                             <input type='text' name='code' value={data.code} onChange={handleOnChange} className='w-full p-2 bg-slate-100 border rounded uppercase' required />
//                         </div>
//                         <div>
//                             <label>Discount Type:</label>
//                             <select name='discountType' value={data.discountType} onChange={handleOnChange} className='w-full p-2 bg-slate-100 border rounded'>
//                                 <option value="percentage">Percentage (%)</option>
//                                 <option value="flat">Flat Amount (₹)</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div className='grid grid-cols-2 gap-4'>
//                         <div>
//                             <label>Discount Value:</label>
//                             <input type='number' name='discountValue' value={data.discountValue} onChange={handleOnChange} className='w-full p-2 bg-slate-100 border rounded' required />
//                         </div>
//                         <div>
//                             <label>Min Order Amount:</label>
//                             <input type='number' name='minOrderAmount' value={data.minOrderAmount} onChange={handleOnChange} className='w-full p-2 bg-slate-100 border rounded' />
//                         </div>
//                     </div>

//                     <div className='grid grid-cols-2 gap-4'>
//                         <div>
//                             <label>Expiry Date:</label>
//                             <input type='date' name='expiryDate' value={data.expiryDate} onChange={handleOnChange} className='w-full p-2 bg-slate-100 border rounded' />
//                         </div>
//                         <div>
//                             <label>Usage Limit:</label>
//                             <input type='number' name='usageLimit' value={data.usageLimit} onChange={handleOnChange} className='w-full p-2 bg-slate-100 border rounded' placeholder='Total uses allowed' />
//                         </div>
//                     </div>

//                     <hr />
//                     <p className='text-sm font-semibold text-gray-500'>Applicability (Optional)</p>
                    
//                     <div className='grid grid-cols-2 gap-4'>
//                         <div>
//                             <label>Category:</label>
//                             <select name='productCategory' value={data.productCategory} onChange={handleOnChange} className='w-full p-2 bg-slate-100 border rounded'>
//                                 <option value="">All Categories</option>
//                                 {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.label}</option>)}
//                             </select>
//                         </div>
//                         <div className='flex items-center gap-2 mt-6'>
//                             <input type='checkbox' name='isActive' checked={data.isActive} onChange={handleOnChange} id='active' />
//                             <label htmlFor='active'>Coupon is Active</label>
//                         </div>
//                     </div>

//                     <button className='bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-4'>
//                         {editData ? "Update Coupon" : "Create Coupon"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UploadCoupon;


// import React, { useState, useEffect } from 'react';
// import { CgClose } from "react-icons/cg";
// import { MdDelete, MdSearch } from "react-icons/md";
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';

// const UploadCoupon = ({ onClose, fetchData, editData }) => {
//     const [allCategories, setAllCategories] = useState([]); // All fetched categories
//     const [subCategories, setSubCategories] = useState([]); // Filtered sub-categories
//     const [allProductsList, setAllProductsList] = useState([]); // All products for search
//     const [searchQuery, setSearchQuery] = useState("");
    
//     const [data, setData] = useState({
//         code: "",
//         discountType: "percentage",
//         discountValue: "",
//         minOrderAmount: 0,
//         maxDiscountAmount: "",
//         expiryDate: "",
//         usageLimit: "",
//         isActive: true,
//         parentCategory: "",
//         productCategory: "",
//         products: [] // Stores Array of Product IDs
//     });

//     const fetchCategories = async () => {
//         const response = await fetch(SummaryApi.getProductCategory.url);
//         const dataRes = await response.json();
//         if (dataRes.success) {
//             setAllCategories(dataRes.categories);
//         }
//     };

//     const fetchAllProducts = async () => {
//         const response = await fetch(SummaryApi.allProduct.url);
//         const dataRes = await response.json();
//         if (dataRes.data) {
//             setAllProductsList(dataRes.data);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//         fetchAllProducts();
//         if (editData) {
//             setData({
//                 ...editData,
//                 expiryDate: editData.expiryDate ? editData.expiryDate.split('T')[0] : "",
//                 parentCategory: editData.parentCategory?._id || editData.parentCategory || "",
//                 productCategory: editData.productCategory?._id || editData.productCategory || "",
//                 products: editData.products?.map(p => p._id || p) || []
//             });
//         }
//     }, [editData]);

//     // Handle Parent Category change to filter Sub-Categories
//     useEffect(() => {
//         if (data.parentCategory) {
//             // Assuming your category objects have a 'parent' field
//             const filtered = allCategories.filter(cat => cat.parent === data.parentCategory);
//             setSubCategories(filtered);
//         } else {
//             setSubCategories([]);
//         }
//     }, [data.parentCategory, allCategories]);

//     const handleOnChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     // Product Multi-select Logic
//     const toggleProductSelection = (productId) => {
//         setData(prev => {
//             const isSelected = prev.products.includes(productId);
//             return {
//                 ...prev,
//                 products: isSelected 
//                     ? prev.products.filter(id => id !== productId) 
//                     : [...prev.products, productId]
//             };
//         });
//     };

//     const removeProduct = (productId) => {
//         setData(prev => ({
//             ...prev,
//             products: prev.products.filter(id => id !== productId)
//         }));
//     };

//     const filteredProducts = allProductsList.filter(p => 
//         p.productName.toLowerCase().includes(searchQuery.toLowerCase()) && 
//         !data.products.includes(p._id)
//     ).slice(0, 5); // Limit search results for performance

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const url = editData ? `${SummaryApi.updateCoupon.url}/${editData._id}` : SummaryApi.createCoupon.url;
//         const method = editData ? SummaryApi.updateCoupon.method : SummaryApi.createCoupon.method;

//         const response = await fetch(url, {
//             method: method,
//             headers: { "content-type": "application/json" },
//             body: JSON.stringify(data)
//         });

//         const responseData = await response.json();
//         if (responseData.success) {
//             toast.success(responseData.message);
//             onClose();
//             fetchData();
//         } else {
//             toast.error(responseData.message);
//         }
//     };

//     return (
//         <div className='fixed w-full h-full bg-slate-200 bg-opacity-50 top-0 left-0 flex justify-center items-center z-50 p-4'>
//             <div className='bg-white p-6 rounded-lg w-full max-w-3xl max-h-[95%] overflow-y-auto shadow-2xl'>
//                 <div className='flex justify-between items-center border-b pb-3 mb-4'>
//                     <h2 className='font-bold text-xl text-gray-800'>{editData ? "Edit Coupon" : "Create New Coupon"}</h2>
//                     <CgClose className='text-2xl cursor-pointer hover:text-red-600' onClick={onClose} />
//                 </div>

//                 <form className='grid gap-4' onSubmit={handleSubmit}>
//                     {/* Basic Info Row */}
//                     <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                         <div>
//                             <label className='text-sm font-semibold'>Coupon Code</label>
//                             <input type='text' name='code' value={data.code} onChange={handleOnChange} className='w-full p-2 bg-slate-50 border rounded uppercase font-mono text-red-600' placeholder="SUMMER50" required />
//                         </div>
//                         <div>
//                             <label className='text-sm font-semibold'>Type</label>
//                             <select name='discountType' value={data.discountType} onChange={handleOnChange} className='w-full p-2 bg-slate-50 border rounded'>
//                                 <option value="percentage">Percentage (%)</option>
//                                 <option value="flat">Flat Amount (₹)</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className='text-sm font-semibold'>Value</label>
//                             <input type='number' name='discountValue' value={data.discountValue} onChange={handleOnChange} className='w-full p-2 bg-slate-50 border rounded' required />
//                         </div>
//                     </div>

//                     {/* Hierarchy Category Section */}
//                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded'>
//                         <div>
//                             <label className='text-sm font-semibold'>Parent Category (Optional)</label>
//                             <select name='parentCategory' value={data.parentCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded'>
//                                 <option value="">Select Parent</option>
//                                 {allCategories.filter(c => !c.parent).map(cat => (
//                                     <option key={cat._id} value={cat._id}>{cat.label}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label className='text-sm font-semibold'>Sub-Category (Optional)</label>
//                             <select name='productCategory' value={data.productCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded' disabled={!data.parentCategory}>
//                                 <option value="">Select Sub-Category</option>
//                                 {subCategories.map(cat => (
//                                     <option key={cat._id} value={cat._id}>{cat.label}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Product Multi-Selection Section */}
//                     <div className='border p-3 rounded'>
//                         <label className='text-sm font-semibold flex items-center gap-2'>
//                             Apply to Specific Products <span className='text-xs font-normal text-gray-400'>(Leave empty for site-wide)</span>
//                         </label>
                        
//                         {/* Selected Products Pills */}
//                         <div className='flex flex-wrap gap-2 my-2'>
//                             {data.products.map(id => {
//                                 const product = allProductsList.find(p => p._id === id);
//                                 return (
//                                     <div key={id} className='bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-2'>
//                                         {product?.productName || "Loading..."}
//                                         <CgClose className='cursor-pointer' onClick={() => removeProduct(id)} />
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         {/* Product Search Input */}
//                         <div className='relative'>
//                             <div className='absolute left-2 top-3 text-gray-400'><MdSearch /></div>
//                             <input 
//                                 type='text' 
//                                 placeholder='Search products to add...' 
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className='w-full pl-8 p-2 border rounded-md text-sm'
//                             />
//                             {searchQuery && (
//                                 <div className='absolute w-full bg-white border shadow-lg z-10 rounded-b-md'>
//                                     {filteredProducts.length > 0 ? filteredProducts.map(p => (
//                                         <div 
//                                             key={p._id} 
//                                             className='p-2 hover:bg-slate-100 cursor-pointer text-sm border-b'
//                                             onClick={() => {
//                                                 toggleProductSelection(p._id);
//                                                 setSearchQuery("");
//                                             }}
//                                         >
//                                             {p.productName}
//                                         </div>
//                                     )) : <div className='p-2 text-xs text-gray-400'>No products found</div>}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Limits & Expiry */}
//                     <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                         <div>
//                             <label className='text-sm font-semibold'>Expiry Date</label>
//                             <input type='date' name='expiryDate' value={data.expiryDate} onChange={handleOnChange} className='w-full p-2 bg-slate-50 border rounded' />
//                         </div>
//                         <div>
//                             <label className='text-sm font-semibold'>Min Order (₹)</label>
//                             <input type='number' name='minOrderAmount' value={data.minOrderAmount} onChange={handleOnChange} className='w-full p-2 bg-slate-50 border rounded' />
//                         </div>
//                         <div>
//                             <label className='text-sm font-semibold'>Usage Limit</label>
//                             <input type='number' name='usageLimit' value={data.usageLimit} onChange={handleOnChange} className='w-full p-2 bg-slate-50 border rounded' placeholder='e.g. 100' />
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-2'>
//                         <input type='checkbox' name='isActive' checked={data.isActive} onChange={handleOnChange} id='active' className='w-4 h-4 cursor-pointer' />
//                         <label htmlFor='active' className='text-sm cursor-pointer'>Make this coupon active immediately</label>
//                     </div>

//                     <button className='bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all shadow-md mt-2'>
//                         {editData ? "Update Coupon" : "Create Coupon"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UploadCoupon;

import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { MdSearch } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const UploadCoupon = ({ onClose, fetchData, editData }) => {
    const [parentCategories, setParentCategories] = useState([]);
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [allProductsList, setAllProductsList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    const [data, setData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: 0,
        maxDiscountAmount: "",
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: "",
        usageLimit: "",    // Total Limit
        perUserLimit: 1,   // Limit per User
        isActive: true,
        parentCategory: "",
        productCategory: "", // This is the Sub-Category
        products: []
    });

    useEffect(() => {
        fetchParentCategories();
        fetchSubCategories();
        fetchAllProducts();

        if (editData) {
            setData({
                ...editData,
                startDate: editData.startDate ? editData.startDate.split('T')[0] : "",
                expiryDate: editData.expiryDate ? editData.expiryDate.split('T')[0] : "",
                parentCategory: editData.parentCategory?._id || editData.parentCategory || "",
                productCategory: editData.productCategory?._id || editData.productCategory || "",
                products: editData.products?.map(p => p._id || p) || []
            });
        }
    }, [editData]);

    const fetchParentCategories = async () => {
        const response = await fetch(SummaryApi.getParentCategories.url);
        const dataRes = await response.json();
        if (dataRes.success) setParentCategories(dataRes.categories);
    };

    const fetchSubCategories = async () => {
        const response = await fetch(SummaryApi.getProductCategory.url);
        const dataRes = await response.json();
        if (dataRes.success) setAllSubCategories(dataRes.categories);
    };

    const fetchAllProducts = async () => {
        const response = await fetch(SummaryApi.allProduct.url);
        const dataRes = await response.json();
        if (dataRes.data) setAllProductsList(dataRes.data);
    };

    // Filter Sub-Categories when Parent Category changes
    useEffect(() => {
        if (data.parentCategory) {
            const filtered = allSubCategories.filter(sub => 
                (sub.parentCategory?._id === data.parentCategory) || (sub.parentCategory === data.parentCategory)
            );
            setFilteredSubCategories(filtered);
        } else {
            setFilteredSubCategories([]);
        }
    }, [data.parentCategory, allSubCategories]);

    const handleOnChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleProductSelection = (productId) => {
        setData(prev => ({
            ...prev,
            products: prev.products.includes(productId) 
                ? prev.products.filter(id => id !== productId) 
                : [...prev.products, productId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // FIX: Ensure correct URL construction for Update
        const url = editData 
            ? SummaryApi.updateCoupon.url.replace(":id", editData._id) 
            : SummaryApi.createCoupon.url;
        
        const method = editData ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (responseData.success) {
                toast.success(responseData.message);
                onClose();
                fetchData(); // Refresh list
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
            <div className='bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl'>
                <div className='flex justify-between items-center border-b pb-3 mb-4'>
                    <h2 className='font-bold text-xl'>{editData ? "Update Coupon" : "Create Coupon"}</h2>
                    <CgClose className='text-2xl cursor-pointer hover:text-red-600' onClick={onClose} />
                </div>

                <form className='grid gap-4' onSubmit={handleSubmit}>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Coupon Code</label>
                            <input type='text' name='code' value={data.code} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded font-mono' required />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Type</label>
                            <select name='discountType' value={data.discountType} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded'>
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Value</label>
                            <input type='number' name='discountValue' value={data.discountValue} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded' required />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg'>
                        <div>
                            <label className='text-xs font-bold text-blue-600 uppercase'>Parent Category</label>
                            <select name='parentCategory' value={data.parentCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded'>
                                <option value="">Apply to All Parents</option>
                                {parentCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className='text-xs font-bold text-blue-600 uppercase'>Sub Category</label>
                            <select name='productCategory' value={data.productCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded' disabled={!data.parentCategory}>
                                <option value="">Apply to All Sub-Cats</option>
                                {filteredSubCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className='border p-3 rounded-lg'>
                        <label className='text-xs font-bold text-gray-500 uppercase'>Apply to Specific Products</label>
                        <div className='flex flex-wrap gap-2 my-2'>
                            {data.products.map(id => {
                                const prod = allProductsList.find(p => p._id === id);
                                return (
                                    <span key={id} className='bg-red-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1'>
                                        {prod?.productName.substring(0,20)}...
                                        <CgClose className='cursor-pointer' onClick={() => toggleProductSelection(id)} />
                                    </span>
                                )
                            })}
                        </div>
                        <div className='relative'>
                            <input 
                                type='text' 
                                placeholder='Search and add products...' 
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full p-2 pl-8 border rounded text-sm'
                            />
                            <MdSearch className='absolute left-2 top-3 text-gray-400' />
                            {searchQuery && (
                                <div className='absolute w-full bg-white border z-10 shadow-lg max-h-40 overflow-y-auto'>
                                    {allProductsList.filter(p => p.productName.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                                        <div key={p._id} onClick={() => {toggleProductSelection(p._id); setSearchQuery("")}} className='p-2 hover:bg-gray-100 cursor-pointer text-sm'>
                                            {p.productName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Start Date</label>
                            <input type='date' name='startDate' value={data.startDate} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Expiry Date</label>
                            <input type='date' name='expiryDate' value={data.expiryDate} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Total Limit</label>
                            <input type='number' name='usageLimit' value={data.usageLimit} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' placeholder='Total' />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Per User Limit</label>
                            <input type='number' name='perUserLimit' value={data.perUserLimit} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type='checkbox' name='isActive' checked={data.isActive} onChange={handleOnChange} id='active' />
                        <label htmlFor='active' className='text-sm font-medium'>Active Coupon</label>
                    </div>

                    <div className='flex gap-3 mt-4'>
                        <button type='button' onClick={onClose} className='flex-1 py-2 border rounded font-bold hover:bg-gray-50'>Cancel</button>
                        <button type='submit' className='flex-1 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-all'>
                            {editData ? "Update Coupon" : "Create Coupon"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadCoupon;