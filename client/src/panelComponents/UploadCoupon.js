
// import React, { useState, useEffect } from 'react';
// import { CgClose } from "react-icons/cg";
// import { MdSearch } from "react-icons/md";
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';

// const UploadCoupon = ({ onClose, fetchData, editData }) => {
//     const [parentCategories, setParentCategories] = useState([]);
//     const [allSubCategories, setAllSubCategories] = useState([]);
//     const [filteredSubCategories, setFilteredSubCategories] = useState([]);
//     const [allProductsList, setAllProductsList] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
    
//     const [data, setData] = useState({
//         code: "",
//         discountType: "percentage",
//         discountValue: "",
//         minOrderAmount: 0,
//         maxDiscountAmount: "",
//         startDate: new Date().toISOString().split('T')[0],
//         expiryDate: "",
//         usageLimit: "",    // Total Limit
//         perUserLimit: 1,   // Limit per User
//         isActive: true,
//         parentCategory: "",
//         productCategory: "", // This is the Sub-Category
//         products: []
//     });

//     useEffect(() => {
//         fetchParentCategories();
//         fetchSubCategories();
//         fetchAllProducts();

//         if (editData) {
//             setData({
//                 ...editData,
//                 startDate: editData.startDate ? editData.startDate.split('T')[0] : "",
//                 expiryDate: editData.expiryDate ? editData.expiryDate.split('T')[0] : "",
//                 parentCategory: editData.parentCategory?._id || editData.parentCategory || "",
//                 productCategory: editData.productCategory?._id || editData.productCategory || "",
//                 products: editData.products?.map(p => p._id || p) || []
//             });
//         }
//     }, [editData]);

//     const fetchParentCategories = async () => {
//         const response = await fetch(SummaryApi.getParentCategories.url);
//         const dataRes = await response.json();
//         if (dataRes.success) setParentCategories(dataRes.categories);
//     };

//     const fetchSubCategories = async () => {
//         const response = await fetch(SummaryApi.getProductCategory.url);
//         const dataRes = await response.json();
//         if (dataRes.success) setAllSubCategories(dataRes.categories);
//     };

//     const fetchAllProducts = async () => {
//         const response = await fetch(SummaryApi.allProduct.url);
//         const dataRes = await response.json();
//         if (dataRes.data) setAllProductsList(dataRes.data);
//     };

//     // Filter Sub-Categories when Parent Category changes
//     useEffect(() => {
//         if (data.parentCategory) {
//             const filtered = allSubCategories.filter(sub => 
//                 (sub.parentCategory?._id === data.parentCategory) || (sub.parentCategory === data.parentCategory)
//             );
//             setFilteredSubCategories(filtered);
//         } else {
//             setFilteredSubCategories([]);
//         }
//     }, [data.parentCategory, allSubCategories]);

//     const handleOnChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const toggleProductSelection = (productId) => {
//         setData(prev => ({
//             ...prev,
//             products: prev.products.includes(productId) 
//                 ? prev.products.filter(id => id !== productId) 
//                 : [...prev.products, productId]
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // FIX: Ensure correct URL construction for Update
//         const url = editData 
//             ? SummaryApi.updateCoupon.url(editData._id) 
//             : SummaryApi.createCoupon.url;
        
//         const method = editData ? "PUT" : "POST";

//         try {
//             const response = await fetch(url, {
//                 method: method,
//                 headers: { "content-type": "application/json" },
//                 body: JSON.stringify(data)
//             });

//             const responseData = await response.json();
//             if (responseData.success) {
//                 toast.success(responseData.message);
//                 onClose();
//                 fetchData(); // Refresh list
//             } else {
//                 toast.error(responseData.message);
//             }
//         } catch (error) {
//             toast.error("An error occurred");
//         }
//     };

//     return (
//         <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
//             <div className='bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl'>
//                 <div className='flex justify-between items-center border-b pb-3 mb-4'>
//                     <h2 className='font-bold text-xl'>{editData ? "Update Coupon" : "Create Coupon"}</h2>
//                     <CgClose className='text-2xl cursor-pointer hover:text-red-600' onClick={onClose} />
//                 </div>

//                 <form className='grid gap-4' onSubmit={handleSubmit}>
//                     <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Coupon Code</label>
//                             <input type='text' name='code' value={data.code} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded font-mono' required />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Type</label>
//                             <select name='discountType' value={data.discountType} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded'>
//                                 <option value="percentage">Percentage (%)</option>
//                                 <option value="flat">Flat Amount (₹)</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Value</label>
//                             <input type='number' name='discountValue' value={data.discountValue} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded' required />
//                         </div>
//                     </div>

//                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg'>
//                         <div>
//                             <label className='text-xs font-bold text-blue-600 uppercase'>Parent Category</label>
//                             <select name='parentCategory' value={data.parentCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded'>
//                                 <option value="">Apply to All Parents</option>
//                                 {parentCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-blue-600 uppercase'>Sub Category</label>
//                             <select name='productCategory' value={data.productCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded' disabled={!data.parentCategory}>
//                                 <option value="">Apply to All Sub-Cats</option>
//                                 {filteredSubCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.label}</option>)}
//                             </select>
//                         </div>
//                     </div>

//                     <div className='border p-3 rounded-lg'>
//                         <label className='text-xs font-bold text-gray-500 uppercase'>Apply to Specific Products</label>
//                         <div className='flex flex-wrap gap-2 my-2'>
//                             {data.products.map(id => {
//                                 const prod = allProductsList.find(p => p._id === id);
//                                 return (
//                                     <span key={id} className='bg-red-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1'>
//                                         {prod?.productName.substring(0,20)}...
//                                         <CgClose className='cursor-pointer' onClick={() => toggleProductSelection(id)} />
//                                     </span>
//                                 )
//                             })}
//                         </div>
//                         <div className='relative'>
//                             <input 
//                                 type='text' 
//                                 placeholder='Search and add products...' 
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className='w-full p-2 pl-8 border rounded text-sm'
//                             />
//                             <MdSearch className='absolute left-2 top-3 text-gray-400' />
//                             {searchQuery && (
//                                 <div className='absolute w-full bg-white border z-10 shadow-lg max-h-40 overflow-y-auto'>
//                                     {allProductsList.filter(p => p.productName.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
//                                         <div key={p._id} onClick={() => {toggleProductSelection(p._id); setSearchQuery("")}} className='p-2 hover:bg-gray-100 cursor-pointer text-sm'>
//                                             {p.productName}
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Start Date</label>
//                             <input type='date' name='startDate' value={data.startDate} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Expiry Date</label>
//                             <input type='date' name='expiryDate' value={data.expiryDate} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Total Limit</label>
//                             <input type='number' name='usageLimit' value={data.usageLimit} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' placeholder='Total' />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Per User Limit</label>
//                             <input type='number' name='perUserLimit' value={data.perUserLimit} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-2'>
//                         <input type='checkbox' name='isActive' checked={data.isActive} onChange={handleOnChange} id='active' />
//                         <label htmlFor='active' className='text-sm font-medium'>Active Coupon</label>
//                     </div>

//                     <div className='flex gap-3 mt-4'>
//                         <button type='button' onClick={onClose} className='flex-1 py-2 border rounded font-bold hover:bg-gray-50'>Cancel</button>
//                         <button type='submit' className='flex-1 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-all'>
//                             {editData ? "Update Coupon" : "Create Coupon"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UploadCoupon;

// import React, { useState, useEffect } from 'react';
// import { CgClose } from "react-icons/cg";
// import { MdSearch } from "react-icons/md";
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';

// const UploadCoupon = ({ onClose, fetchData, editData }) => {
//     const [parentCategories, setParentCategories] = useState([]);
//     const [allSubCategories, setAllSubCategories] = useState([]);
//     const [filteredSubCategories, setFilteredSubCategories] = useState([]);
//     const [availableProducts, setAvailableProducts] = useState([]); // Products filtered by Sub-Category
//     const [searchQuery, setSearchQuery] = useState("");
//     const [loadingProducts, setLoadingProducts] = useState(false);
    
//     const [data, setData] = useState({
//         code: "",
//         discountType: "percentage",
//         discountValue: "",
//         minOrderAmount: 0,
//         maxDiscountAmount: "",
//         startDate: new Date().toISOString().split('T')[0],
//         expiryDate: "",
//         usageLimit: "",
//         perUserLimit: 1,
//         isActive: true,
//         parentCategory: "",
//         productCategory: "", 
//         products: [] // Stores IDs
//     });

//     console.log(data);
    

//     // 1. Initial Fetch for Categories only
//     useEffect(() => {
//         const fetchInitialData = async () => {
//             try {
//                 const [parentRes, subRes] = await Promise.all([
//                     fetch(SummaryApi.getParentCategories.url).then(r => r.json()),
//                     fetch(SummaryApi.getProductCategory.url).then(r => r.json())
//                 ]);
//                 if (parentRes.success) setParentCategories(parentRes.categories);
//                 if (subRes.success) setAllSubCategories(subRes.categories);
//             } catch (err) {
//                 toast.error("Error loading categories");
//             }
//         };
//         fetchInitialData();
//     }, []);

//     // 2. Load Edit Data Defaults
//     useEffect(() => {
//         if (editData) {
//             setData({
//                 ...editData,
//                 startDate: editData.startDate ? editData.startDate.split('T')[0] : "",
//                 expiryDate: editData.expiryDate ? editData.expiryDate.split('T')[0] : "",
//                 parentCategory: editData.parentCategory?._id || editData.parentCategory || "",
//                 productCategory: editData.productCategory?._id || editData.productCategory || "",
//                 products: editData.products?.map(p => p._id || p) || []
//             });
//         }
//     }, [editData]);

//     // 3. Filter Sub-Categories when Parent changes
//     useEffect(() => {
//         if (data.parentCategory) {
//             const filtered = allSubCategories.filter(sub => 
//                 (sub.parentCategory?._id === data.parentCategory) || (sub.parentCategory === data.parentCategory)
//             );
//             setFilteredSubCategories(filtered);
//         } else {
//             setFilteredSubCategories([]);
//         }
//     }, [data.parentCategory, allSubCategories]);

//     // 4. Fetch Products ONLY when Sub-Category is selected (Efficient)
//     useEffect(() => {
//         const fetchScopedProducts = async () => {
//             if (!data.productCategory) {
//                 setAvailableProducts([]);
//                 return;
//             }
//             setLoadingProducts(true);
//             try {
//                 // Fetch all products, but we will filter them by the selected sub-category
//                 // If your backend supports filtering by category in the URL, use: SummaryApi.allProduct.url + `?category=${data.productCategory}`
//                 const response = await fetch(SummaryApi.allProduct.url);
//                 const resData = await response.json();
//                 if (resData.data) {
//                     const scoped = resData.data.filter(p => p.category === data.productCategory || p.category?._id === data.productCategory);
//                     setAvailableProducts(scoped);
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch products");
//             } finally {
//                 setLoadingProducts(false);
//             }
//         };

//         fetchScopedProducts();
//     }, [data.productCategory]);

//     const handleOnChange = (e) => {
//         const { name, value, type, checked } = e.target;
        
//         setData(prev => {
//             const newState = { ...prev, [name]: type === 'checkbox' ? checked : value };
            
//             // Reset hierarchy if parent changes
//             if (name === "parentCategory") {
//                 newState.productCategory = "";
//                 newState.products = [];
//             }
//             // Reset products if sub-category changes
//             if (name === "productCategory") {
//                 newState.products = [];
//             }
//             return newState;
//         });
//     };

//     const toggleProductSelection = (productId) => {
//         setData(prev => ({
//             ...prev,
//             products: prev.products.includes(productId) 
//                 ? prev.products.filter(id => id !== productId) 
//                 : [...prev.products, productId]
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const url = editData ? SummaryApi.updateCoupon.url(editData._id) : SummaryApi.createCoupon.url;
//         const method = editData ? "PUT" : "POST";

//         const response = await fetch(url, {
//             method,
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

//     // Filter the already scoped products based on search query
//     const searchableProducts = availableProducts.filter(p => 
//         p.productName.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
//             <div className='bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl'>
//                 <div className='flex justify-between items-center border-b pb-3 mb-4'>
//                     <h2 className='font-bold text-xl'>{editData ? "Update Coupon" : "Create Coupon"}</h2>
//                     <CgClose className='text-2xl cursor-pointer hover:text-red-600' onClick={onClose} />
//                 </div>

//                 <form className='grid gap-4' onSubmit={handleSubmit}>
//                     {/* Code and Value */}
//                     <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Coupon Code</label>
//                             <input type='text' name='code' value={data.code} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded font-mono' required />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Type</label>
//                             <select name='discountType' value={data.discountType} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded'>
//                                 <option value="percentage">Percentage (%)</option>
//                                 <option value="flat">Flat Amount (₹)</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Value</label>
//                             <input type='number' name='discountValue' value={data.discountValue} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded' required />
//                         </div>
//                     </div>

//                     {/* Hierarchy Selection */}
//                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg'>
//                         <div>
//                             <label className='text-xs font-bold text-blue-600 uppercase'>1. Select Parent Category</label>
//                             <select name='parentCategory' value={data.parentCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded'>
//                                 <option value="">Select Parent</option>
//                                 {parentCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-blue-600 uppercase'>2. Select Sub Category</label>
//                             <select name='productCategory' value={data.productCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded' disabled={!data.parentCategory}>
//                                 <option value="">Select Sub-Category</option>
//                                 {filteredSubCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.label}</option>)}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Scoped Product Selection */}
//                     <div className='border p-3 rounded-lg'>
//                         <label className='text-xs font-bold text-gray-500 uppercase'>3. Select Products (Only from selected Sub-Category)</label>
                        
//                         {!data.productCategory ? (
//                             <p className='text-xs text-orange-500 mt-1'>Please select a Sub-Category first to see products.</p>
//                         ) : (
//                             <>
//                                 <div className='flex flex-wrap gap-2 my-2'>
//                                     {data.products.map(id => {
//                                         // Find name in availableProducts or check editData.products
//                                         const prod = availableProducts.find(p => p._id === id) || editData?.products?.find(p => p._id === id);
//                                         return (
//                                             <span key={id} className='bg-red-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1'>
//                                                 {prod?.productName?.substring(0,25)}...
//                                                 <CgClose className='cursor-pointer' onClick={() => toggleProductSelection(id)} />
//                                             </span>
//                                         )
//                                     })}
//                                 </div>
//                                 <div className='relative'>
//                                     <input 
//                                         type='text' 
//                                         placeholder={loadingProducts ? 'Loading products...' : 'Search products in this category...'} 
//                                         disabled={loadingProducts}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                         className='w-full p-2 pl-8 border rounded text-sm bg-white'
//                                     />
//                                     <MdSearch className='absolute left-2 top-3 text-gray-400' />
                                    
//                                     {searchQuery && (
//                                         <div className='absolute w-full bg-white border z-10 shadow-lg max-h-40 overflow-y-auto rounded-b'>
//                                             {searchableProducts.length > 0 ? searchableProducts.map(p => (
//                                                 <div 
//                                                     key={p._id} 
//                                                     onClick={() => {toggleProductSelection(p._id); setSearchQuery("")}} 
//                                                     className={`p-2 hover:bg-gray-100 cursor-pointer text-sm border-b ${data.products.includes(p._id) ? 'bg-green-50' : ''}`}
//                                                 >
//                                                     {p.productName} {data.products.includes(p._id) && "✓"}
//                                                 </div>
//                                             )) : <div className='p-2 text-xs text-gray-400'>No products found in this category.</div>}
//                                         </div>
//                                     )}
//                                 </div>
//                             </>
//                         )}
//                     </div>

//                     {/* Limits and Dates */}
//                     <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Start Date</label>
//                             <input type='date' name='startDate' value={data.startDate} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Expiry Date</label>
//                             <input type='date' name='expiryDate' value={data.expiryDate} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Total Limit</label>
//                             <input type='number' name='usageLimit' value={data.usageLimit} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Per User Limit</label>
//                             <input type='number' name='perUserLimit' value={data.perUserLimit} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-2 mt-2'>
//                         <input type='checkbox' name='isActive' checked={data.isActive} onChange={handleOnChange} id='active' />
//                         <label htmlFor='active' className='text-sm font-medium'>Enable Coupon</label>
//                     </div>

//                     <div className='flex gap-3 mt-4 border-t pt-4'>
//                         <button type='button' onClick={onClose} className='flex-1 py-2 border rounded font-bold hover:bg-gray-50'>Cancel</button>
//                         <button type='submit' className='flex-1 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-all'>
//                             {editData ? "Update Coupon" : "Create Coupon"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UploadCoupon;


// import React, { useState, useEffect } from 'react';
// import { CgClose } from "react-icons/cg";
// import { MdSearch } from "react-icons/md";
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';
// import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'; // Your helper

// const UploadCoupon = ({ onClose, fetchData, editData }) => {
//     const [parentCategories, setParentCategories] = useState([]);
//     const [allSubCategories, setAllSubCategories] = useState([]);
//     const [filteredSubCategories, setFilteredSubCategories] = useState([]);
//     const [availableProducts, setAvailableProducts] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [loadingProducts, setLoadingProducts] = useState(false);
//     const [showProductDropdown, setShowProductDropdown] = useState(false);
    
//     const [data, setData] = useState({
//         code: "",
//         discountType: "percentage",
//         discountValue: "",
//         minOrderAmount: 0,
//         maxDiscountAmount: "",
//         startDate: new Date().toISOString().split('T')[0],
//         expiryDate: "",
//         usageLimit: "",
//         perUserLimit: 1,
//         isActive: true,
//         parentCategory: "",
//         productCategory: "", // This is the Sub-Category value
//         products: [] // Array of IDs
//     });

//     // 1. Initial Load: Fetch categories once
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const [pRes, sRes] = await Promise.all([
//                     fetch(SummaryApi.getParentCategories.url).then(res => res.json()),
//                     fetch(SummaryApi.getProductCategory.url).then(res => res.json())
//                 ]);
//                 if (pRes.success) setParentCategories(pRes.categories);
//                 if (sRes.success) setAllSubCategories(sRes.categories);
//             } catch (err) {
//                 toast.error("Failed to load categories");
//             }
//         };
//         fetchCategories();
//     }, []);

//     // 2. Setup Edit Data and Trigger Product Fetch
//     useEffect(() => {
//         if (editData && allSubCategories.length > 0) {
//             const initialData = {
//                 ...editData,
//                 startDate: editData.startDate ? editData.startDate.split('T')[0] : "",
//                 expiryDate: editData.expiryDate ? editData.expiryDate.split('T')[0] : "",
//                 parentCategory: editData.parentCategory?._id || editData.parentCategory || "",
//                 productCategory: editData.productCategory?._id || editData.productCategory || "",
//                 products: editData.products?.map(p => p._id || p) || []
//             };
//             setData(initialData);

//             // Fetch products for the already selected category in Edit mode
//             if (initialData.productCategory) {
//                 fetchProductsByCategory(initialData.productCategory);
//             }
//         }
//     }, [editData, allSubCategories]);

//     // 3. Filter Sub-Categories based on Parent
//     useEffect(() => {
//         if (data.parentCategory) {
//             const filtered = allSubCategories.filter(sub => 
//                 (sub.parentCategory?._id === data.parentCategory) || (sub.parentCategory === data.parentCategory)
//             );
//             setFilteredSubCategories(filtered);
//         } else {
//             setFilteredSubCategories([]);
//         }
//     }, [data.parentCategory, allSubCategories]);

//     // 4. Fetch Products Helper
//     const fetchProductsByCategory = async (categoryValue) => {
//         setLoadingProducts(true);
//         try {
//             const res = await fetchCategoryWiseProduct(categoryValue);
//             if (res.success) {
//                 setAvailableProducts(res.data);
//             }
//         } catch (err) {
//             toast.error("Error fetching products");
//         } finally {
//             setLoadingProducts(false);
//         }
//     };

//     const handleOnChange = (e) => {
//         const { name, value, type, checked } = e.target;
        
//         setData(prev => {
//             const update = { ...prev, [name]: type === 'checkbox' ? checked : value };
            
//             // If Parent changes, reset Sub and Products
//             if (name === "parentCategory") {
//                 update.productCategory = "";
//                 update.products = [];
//                 setAvailableProducts([]);
//             }

//             // If Sub-Category changes, fetch its products
//             if (name === "productCategory") {
//                 update.products = [];
//                 if (value) {
//                     fetchProductsByCategory(value);
//                 } else {
//                     setAvailableProducts([]);
//                 }
//             }
//             return update;
//         });
//     };

//     const toggleProductSelection = (productId) => {
//         setData(prev => ({
//             ...prev,
//             products: prev.products.includes(productId) 
//                 ? prev.products.filter(id => id !== productId) 
//                 : [...prev.products, productId]
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const url = editData ? SummaryApi.updateCoupon.url(editData._id) : SummaryApi.createCoupon.url;
//         const method = editData ? "PUT" : "POST";

//         const response = await fetch(url, {
//             method,
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

//     const filteredProductList = availableProducts.filter(p => 
//         p.productName.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
//             <div className='bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl'>
//                 <div className='flex justify-between items-center border-b pb-3 mb-4'>
//                     <h2 className='font-bold text-xl'>{editData ? "Update Coupon" : "Create Coupon"}</h2>
//                     <CgClose className='text-2xl cursor-pointer hover:text-red-600' onClick={onClose} />
//                 </div>

//                 <form className='grid gap-4' onSubmit={handleSubmit}>
//                     {/* Code and Discount Info */}
//                     <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Coupon Code</label>
//                             <input type='text' name='code' value={data.code} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded font-mono' required />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Type</label>
//                             <select name='discountType' value={data.discountType} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded'>
//                                 <option value="percentage">Percentage (%)</option>
//                                 <option value="flat">Flat Amount (₹)</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Discount Value</label>
//                             <input type='number' name='discountValue' value={data.discountValue} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded' required />
//                         </div>
//                     </div>

//                     {/* Hierarchy Logic */}
//                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg'>
//                         <div>
//                             <label className='text-xs font-bold text-blue-600 uppercase'>1. Parent Category</label>
//                             <select name='parentCategory' value={data.parentCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded'>
//                                 <option value="">Select Parent</option>
//                                 {parentCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
//                             </select>
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-blue-600 uppercase'>2. Sub Category</label>
//                             <select name='productCategory' value={data.productCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded' disabled={!data.parentCategory}>
//                                 <option value="">Select Sub-Category</option>
//                                 {filteredSubCategories.map(cat => <option key={cat._id} value={cat.value}>{cat.label}</option>)}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Product Selection List */}
//                     <div className='border p-3 rounded-lg relative'>
//                         <label className='text-xs font-bold text-gray-500 uppercase'>3. Select Products (Site-wide if empty)</label>
                        
//                         <div className='flex flex-wrap gap-2 my-2'>
//                             {data.products.map(id => {
//                                 // Checking both locally fetched list and editData list for labels
//                                 const prod = availableProducts.find(p => p._id === id) || (editData?.products?.find(p => p._id === id));
//                                 return (
//                                     <span key={id} className='bg-red-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1'>
//                                         {prod?.productName?.substring(0,25)}...
//                                         <CgClose className='cursor-pointer' onClick={() => toggleProductSelection(id)} />
//                                     </span>
//                                 )
//                             })}
//                         </div>

//                         <div className='relative'>
//                             <input 
//                                 type='text' 
//                                 placeholder={!data.productCategory ? 'Select a Sub-Category first...' : 'Search in this category...'} 
//                                 disabled={!data.productCategory}
//                                 onFocus={() => setShowProductDropdown(true)}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className='w-full p-2 pl-8 border rounded text-sm bg-white'
//                             />
//                             <MdSearch className='absolute left-2 top-3 text-gray-400' />
                            
//                             {showProductDropdown && data.productCategory && (
//                                 <div className='absolute w-full bg-white border z-20 shadow-xl max-h-52 overflow-y-auto rounded-b mt-1'>
//                                     <div className='flex justify-between p-2 bg-gray-100 sticky top-0'>
//                                         <span className='text-[10px] font-bold text-gray-500 uppercase'>Available Products</span>
//                                         <CgClose className='cursor-pointer' onClick={() => setShowProductDropdown(false)} />
//                                     </div>
//                                     {loadingProducts ? (
//                                         <p className='p-4 text-xs text-center'>Loading...</p>
//                                     ) : filteredProductList.length > 0 ? (
//                                         filteredProductList.map(p => (
//                                             <div 
//                                                 key={p._id} 
//                                                 onClick={() => toggleProductSelection(p._id)} 
//                                                 className={`p-2 hover:bg-gray-100 cursor-pointer text-sm border-b flex items-center justify-between ${data.products.includes(p._id) ? 'bg-green-50' : ''}`}
//                                             >
//                                                 <span>{p.productName}</span>
//                                                 {data.products.includes(p._id) && <span className='text-green-600 font-bold'>✓</span>}
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p className='p-4 text-xs text-center text-gray-400'>No products found.</p>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* New Fields: Min Order and Max Discount */}
//                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Min Order Amount (₹)</label>
//                             <input type='number' name='minOrderAmount' value={data.minOrderAmount} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' placeholder="e.g. 20000" />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Max Discount Amount (₹)</label>
//                             <input type='number' name='maxDiscountAmount' value={data.maxDiscountAmount} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' placeholder="e.g. 2000" />
//                         </div>
//                     </div>

//                     {/* Limits and Dates */}
//                     <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Start Date</label>
//                             <input type='date' name='startDate' value={data.startDate} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Expiry Date</label>
//                             <input type='date' name='expiryDate' value={data.expiryDate} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Total Limit</label>
//                             <input type='number' name='usageLimit' value={data.usageLimit} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                         <div>
//                             <label className='text-xs font-bold text-gray-500 uppercase'>Per User Limit</label>
//                             <input type='number' name='perUserLimit' value={data.perUserLimit} onChange={handleOnChange} className='w-full p-2 bg-gray-50 border rounded text-sm' />
//                         </div>
//                     </div>

//                     <div className='flex items-center gap-2 mt-2'>
//                         <input type='checkbox' name='isActive' checked={data.isActive} onChange={handleOnChange} id='active' className='w-4 h-4' />
//                         <label htmlFor='active' className='text-sm font-medium cursor-pointer'>Enabled</label>
//                     </div>

//                     <div className='flex gap-3 mt-4 border-t pt-4'>
//                         <button type='button' onClick={onClose} className='flex-1 py-2 border rounded font-bold hover:bg-gray-50'>Cancel</button>
//                         <button type='submit' className='flex-1 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-all shadow-md'>
//                             {editData ? "Update Coupon" : "Create Coupon"}
//                         </button>
//                     </div>
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
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';

const UploadCoupon = ({ onClose, fetchData, editData }) => {
    const [parentCategories, setParentCategories] = useState([]);
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    
    const [data, setData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: 0,
        maxDiscountAmount: "",
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: "",
        usageLimit: "",
        perUserLimit: 1,
        isActive: true,
        parentCategory: "",
        productCategory: "", // This will store the _id
        products: [] // This will store the array of product _ids
    });

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [pRes, sRes] = await Promise.all([
                    fetch(SummaryApi.getParentCategories.url).then(res => res.json()),
                    fetch(SummaryApi.getProductCategory.url).then(res => res.json())
                ]);
                if (pRes.success) setParentCategories(pRes.categories);
                if (sRes.success) setAllSubCategories(sRes.categories);
            } catch (err) {
                toast.error("Failed to load categories");
            }
        };
        fetchCategories();
    }, []);

    // Load edit data
    useEffect(() => {
        if (editData && allSubCategories.length > 0) {
            const initialData = {
                ...editData,
                startDate: editData.startDate ? editData.startDate.split('T')[0] : "",
                expiryDate: editData.expiryDate ? editData.expiryDate.split('T')[0] : "",
                parentCategory: editData.parentCategory?._id || editData.parentCategory || "",
                productCategory: editData.productCategory?._id || editData.productCategory || "",
                products: editData.products?.map(p => p._id || p) || []
            };
            setData(initialData);

            // If editing, find the category name to fetch products
            const subCatObj = allSubCategories.find(c => c._id === initialData.productCategory);
            if (subCatObj) {
                fetchProducts(subCatObj.value); // Use Name/Value for API
            }
        }
    }, [editData, allSubCategories]);

    // Filter sub-categories based on parent
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

    const fetchProducts = async (categoryName) => {
        setLoadingProducts(true);
        try {
            const res = await fetchCategoryWiseProduct(categoryName);
            if (res.success) {
                setAvailableProducts(res.data);
            }
        } catch (err) {
            toast.error("Error fetching products");
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleOnChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === "productCategory") {
            // Find the object to get the NAME for fetching
            const selectedSub = allSubCategories.find(cat => cat._id === value);
            
            setData(prev => ({
                ...prev,
                productCategory: value, // Store the _id
                products: [] // Reset products
            }));

            if (selectedSub) {
                fetchProducts(selectedSub.value); // Pass Name to helper
                setShowProductDropdown(true);
            } else {
                setAvailableProducts([]);
            }
            return;
        }

        setData(prev => {
            const update = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === "parentCategory") {
                update.productCategory = "";
                update.products = [];
                setAvailableProducts([]);
            }
            return update;
        });
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
        const url = editData ? SummaryApi.updateCoupon.url(editData._id) : SummaryApi.createCoupon.url;
        const method = editData ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            fetchData();
        } else {
            toast.error(responseData.message);
        }
    };

    const filteredProductList = availableProducts.filter(p => 
        p.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <label className='text-xs font-bold text-gray-500 uppercase'>Code</label>
                            <input type='text' name='code' value={data.code} onChange={handleOnChange} className='w-full p-2 border rounded font-mono' required />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Discount Type</label>
                            <select name='discountType' value={data.discountType} onChange={handleOnChange} className='w-full p-2 border rounded'>
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Discount Value</label>
                            <input type='number' name='discountValue' value={data.discountValue} onChange={handleOnChange} className='w-full p-2 border rounded' required />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg'>
                        <div>
                            <label className='text-xs font-bold text-blue-600 uppercase'>1. Parent Category</label>
                            <select name='parentCategory' value={data.parentCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded'>
                                <option value="">Select Parent</option>
                                {parentCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className='text-xs font-bold text-blue-600 uppercase'>2. Sub Category</label>
                            <select name='productCategory' value={data.productCategory} onChange={handleOnChange} className='w-full p-2 bg-white border rounded' disabled={!data.parentCategory}>
                                <option value="">Select Sub-Category</option>
                                {filteredSubCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className='border p-3 rounded-lg'>
                        <label className='text-xs font-bold text-gray-500 uppercase'>3. Select Products</label>
                        <div className='flex flex-wrap gap-2 my-2'>
                            {data.products.map(id => {
                                const prod = availableProducts.find(p => p._id === id) || (editData?.products?.find(p => p._id === id));
                                return (
                                    <span key={id} className='bg-red-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1'>
                                        {prod?.productName?.substring(0,25)}...
                                        <CgClose className='cursor-pointer' onClick={() => toggleProductSelection(id)} />
                                    </span>
                                )
                            })}
                        </div>
                        <div className='relative'>
                            <input 
                                type='text' 
                                placeholder={!data.productCategory ? 'Select category first...' : 'Search in this category...'} 
                                disabled={!data.productCategory}
                                onFocus={() => setShowProductDropdown(true)}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full p-2 pl-8 border rounded text-sm bg-white'
                            />
                            <MdSearch className='absolute left-2 top-3 text-gray-400' />
                            {showProductDropdown && data.productCategory && (
                                <div className='absolute w-full bg-white border z-20 shadow-xl max-h-52 overflow-y-auto rounded-b mt-1'>
                                    <div className='flex justify-between p-2 bg-gray-100 sticky top-0'>
                                        <span className='text-[10px] font-bold text-gray-500'>Available Products</span>
                                        <CgClose className='cursor-pointer' onClick={() => setShowProductDropdown(false)} />
                                    </div>
                                    {loadingProducts ? <p className='p-4 text-xs text-center'>Loading...</p> : 
                                     filteredProductList.length > 0 ? filteredProductList.map(p => (
                                        <div key={p._id} onClick={() => toggleProductSelection(p._id)} className={`p-2 hover:bg-gray-100 cursor-pointer text-sm border-b flex justify-between ${data.products.includes(p._id) ? 'bg-green-50' : ''}`}>
                                            <span>{p.productName}</span>
                                            {data.products.includes(p._id) && <span className='text-green-600'>✓</span>}
                                        </div>
                                    )) : <p className='p-4 text-xs text-center'>No products found.</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Min Order Amount (₹)</label>
                            <input type='number' name='minOrderAmount' value={data.minOrderAmount} onChange={handleOnChange} className='w-full p-2 border rounded text-sm' />
                        </div>
                        <div>
                            <label className='text-xs font-bold text-gray-500 uppercase'>Max Discount Amount (₹)</label>
                            <input type='number' name='maxDiscountAmount' value={data.maxDiscountAmount} onChange={handleOnChange} className='w-full p-2 border rounded text-sm' />
                        </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div><label className='text-xs font-bold text-gray-500 uppercase'>Start Date</label><input type='date' name='startDate' value={data.startDate} onChange={handleOnChange} className='w-full p-2 border rounded text-sm' /></div>
                        <div><label className='text-xs font-bold text-gray-500 uppercase'>Expiry Date</label><input type='date' name='expiryDate' value={data.expiryDate} onChange={handleOnChange} className='w-full p-2 border rounded text-sm' /></div>
                        <div><label className='text-xs font-bold text-gray-500 uppercase'>Total Limit</label><input type='number' name='usageLimit' value={data.usageLimit} onChange={handleOnChange} className='w-full p-2 border rounded text-sm' /></div>
                        <div><label className='text-xs font-bold text-gray-500 uppercase'>Per User Limit</label><input type='number' name='perUserLimit' value={data.perUserLimit} onChange={handleOnChange} className='w-full p-2 border rounded text-sm' /></div>
                    </div>

                                         <div className='flex items-center gap-2 mt-2'>
                         <input type='checkbox' name='isActive' checked={data.isActive} onChange={handleOnChange} id='active' className='w-4 h-4' />
                         <label htmlFor='active' className='text-sm font-medium cursor-pointer'>Enabled</label>
                     </div>

                    <div className='flex gap-3 mt-4 border-t pt-4'>
                        <button type='button' onClick={onClose} className='flex-1 py-2 border rounded font-bold'>Cancel</button>
                        <button type='submit' className='flex-1 py-2 bg-red-600 text-white rounded font-bold'>
                            {editData ? "Update Coupon" : "Create Coupon"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadCoupon;