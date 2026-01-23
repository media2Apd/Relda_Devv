// import React, { useEffect, useState, useMemo } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VerticalCard from '../components/VerticalCard';
// import SummaryApi from '../common';
// //categories
// const CategoryProduct = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Parse URL search params to get categories
//   const urlSearch = new URLSearchParams(location.search);
//   console.log(urlSearch);

//   const urlCategoryListingArray = urlSearch.getAll("category");
//   const urlParentCategory = urlSearch.get("parentCategory");

//   const validParentCategory = urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '';

//   const initialCategoryState = validParentCategory
//     ? {} // Start empty when parent category is specified
//     : urlCategoryListingArray.reduce((acc, el) => {
//       acc[el] = true;
//       return acc;
//     }, {});

//   const [selectCategory, setSelectCategory] = useState(initialCategoryState);
//   const [sortBy, setSortBy] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [childCategories, setChildCategories] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedParentCategoryName, setSelectedParentCategoryName] = useState("");
//   const [offerPosterIndex, setOfferPosterIndex] = useState(0);
//   const [initialLoad, setInitialLoad] = useState(true);
// useEffect(() => {
//   if (urlCategoryListingArray.length > 0) {
//     // Restore filters from URL
//     const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
//       acc[el] = true;
//       return acc;
//     }, {});
//     setSelectCategory(restoredCategories);
//   } else {
//     // No filter in URL → clear state (all products case will be handled by main useEffect)
//     setSelectCategory({});
//   }
// }, [location.search]);





//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(SummaryApi.getActiveProductCategory.url);
//         const data = await response.json();
//         if (data.success) {
//           const filteredCategories = data.categories.filter(category => category.productCount > 0);
//           setCategories(filteredCategories);

//           if (validParentCategory) {
//             const normalizedParentCategory = validParentCategory.toLowerCase().trim();
//             const parentCategory = filteredCategories.find(category => category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory);

//             if (parentCategory) {
//               setSelectedParentCategoryName(parentCategory.name);
//               const children = filteredCategories.filter(category =>
//                 category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
//               );
//               setChildCategories(children);
//               // Only fetch products from these child categories by default
//               const childCategoryValues = children.map(child => child.value);
//               const productsResponse = await fetchData(childCategoryValues);

//               if (productsResponse?.length === 0) {
//                 setData([]); // Explicitly set empty array for no products
//               }
//             } else {
//               // Parent category not found - show error
//               setData([]);
//             }
//           } else {
//             setChildCategories(filteredCategories);
//             if (!initialLoad) {
//               fetchData([]); // Only fetch all products if not initial load with parent category
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setData([]);
//       } finally {
//         setInitialLoad(false);
//       }
//     };
//     fetchCategories();
//   }, [validParentCategory]);

//   const fetchData = async (categories = []) => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.filterProduct.url, {
//         method: SummaryApi.filterProduct.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({
//           category: categories,
//           parentCategory: validParentCategory || undefined
//         })
//       });
//       const dataResponse = await response.json();
//       // Handle empty results differently based on context
//       if (dataResponse.data?.length === 0) {
//         if (validParentCategory) {
//           // No products for parent category
//           setData([]);
//           navigate(`/product-category?parentCategory=${encodeURIComponent(validParentCategory)}`, {
//             replace: true,
//             state: { noProducts: true } // Flag for empty state
//           });
//         } else {
//           // No products for selected filters
//           setData([]);
//         }
//       } else {
//         setData(dataResponse?.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Don't run until child categories are available
//     if (validParentCategory && initialLoad) return;

//     const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
//     const urlParams = new URLSearchParams();
//     selectedCategories.forEach(category => urlParams.append("category", category));
//     if (validParentCategory) urlParams.append("parentCategory", validParentCategory);

//     navigate("/product-category?" + urlParams.toString(), { replace: true });

//     if (validParentCategory) {
//       if (selectedCategories.length > 0) {
//         fetchData(selectedCategories);
//       } else if (childCategories.length > 0) {
//         const childCategoryValues = childCategories.map(child => child.value);
//         fetchData(childCategoryValues);
//       }
//     } else {
//       fetchData(selectedCategories.length > 0 ? selectedCategories : []);
//     }
//   }, [navigate, validParentCategory, selectCategory, childCategories, initialLoad]);


//   const handleSelectCategory = (e) => {
//     const { value, checked } = e.target;
//     setSelectCategory(prev => ({ ...prev, [value]: checked }));
//   };

//   const handleOnChangeSortBy = (e) => {
//     const { value } = e.target;
//     setSortBy(value);
//     setData(prev => {
//       const sortedData = [...prev].sort((a, b) =>
//         value === 'asc' ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
//       );
//       return sortedData;
//     });
//   };

//   const selectedCategoryOfferPosters = useMemo(() => {
//     // Return empty if no child categories loaded yet
//     if (childCategories.length === 0) return [];

//     const allPosters = childCategories.filter(c => c.offerPoster?.image);

//     // When parent category specified and nothing manually selected
//     if (validParentCategory && Object.keys(selectCategory).length === 0) {
//       return allPosters;
//     }

//     const selectedValues = Object.keys(selectCategory).filter(k => selectCategory[k]);
//     return selectedValues.length > 0
//       ? allPosters.filter(c => selectedValues.includes(c.value))
//       : allPosters;
//   }, [childCategories, selectCategory, validParentCategory]);

//   useEffect(() => {
//     setOfferPosterIndex(0);
//   }, [selectedCategoryOfferPosters.length]);

//   useEffect(() => {
//     if (selectedCategoryOfferPosters.length > 1) {
//       const interval = setInterval(() => {
//         setOfferPosterIndex(prev => (prev + 1) % selectedCategoryOfferPosters.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [selectedCategoryOfferPosters]);

//   return (
//     <div className='p-0 lg:p-0'>
//       <div className='flex justify-between items-center mt-2 lg:hidden p-4 bg-white shadow-md rounded-md'>
//         {/* Sort By Dropdown */}
//         <div className='relative'>
//           <select
//             className='border rounded-md px-4 py-2 text-xs shadow-sm focus:outline-none focus:ring focus:ring-blue-300'
//             value={sortBy}
//             onChange={handleOnChangeSortBy}
//           >
//             <option value='' disabled>
//               Sort By
//             </option>
//             <option value='asc'>Price - Low to High</option>
//             <option value='dsc'>Price - High to Low</option>
//           </select>
//         </div>

//         {/* Category Modal Toggle */}
//         <button
//           className='bg-blue-600 text-white text-xs px-4 py-2 rounded-md shadow-sm hover:bg-blue-700'
//           onClick={() => setShowModal(true)}
//         >
//           Filter Categories
//         </button>
//       </div>

//       {/* Category Modal */}
//       {showModal && (
//         <div className='fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-20'>
//           <div className='bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden'>
//             <h3 className='text-lg font-medium mb-4 px-4 pt-4'>Select Categories</h3>
//             <div className='flex flex-col gap-2 overflow-y-auto max-h-[60vh] px-4 pb-4'>
//               {childCategories.map((category) => (
//                 <div className='flex items-center gap-3' key={category.value}>
//                   <input
//                     type='checkbox'
//                     name='category'
//                     checked={selectCategory[category.value] || false}
//                     value={category.value}
//                     id={category.value}
//                     onChange={handleSelectCategory}
//                   />
//                   <label htmlFor={category.value}>{category.label}</label>
//                 </div>
//               ))}
//             </div>
//             <div className='mt-4 flex justify-end gap-2 px-4 pb-4'>
//               <button
//                 className='bg-gray-200 px-4 py-2 rounded-md'
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className='flex justify-between items-center h-screen bg-white'>
//         <div className='hidden lg:flex flex-col justify-start p-4 w-[230px] xl:w-[250px] h-full bg-white shadow-lg rounded-lg'>

//           <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-brand-productCardBorder'>Sort by</h3>
//           <form className='text-sm flex flex-col gap-2 py-2'>
//             <div className='flex items-center gap-3'>
//               <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"} id="asc" />
//               <label htmlFor='asc'>Price - Low to High</label>
//             </div>
//             <div className='flex items-center gap-3'>
//               <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"} id="dsc" />
//               <label htmlFor='dsc'>Price - High to Low</label>
//             </div>
//           </form>

//           <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-brand-productCardBorder'>Category</h3>
//           <form className='text-sm flex flex-col gap-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-productCardBorder scrollbar-track-transparent max-h-[50vh] sm:max-h-[60vh] md:max-h-[65vh] lg:max-h-[70vh] xl:max-h-[75vh] 2xl:max-h-[80vh] pr-2'>
//             {childCategories.map((category) => (
//               <div className='flex items-center gap-2' key={category.value}>
//                 <input
//                   type='checkbox'
//                   name="category"
//                   checked={selectCategory[category.value] || false}
//                   value={category.value}
//                   id={category.value}
//                   onChange={handleSelectCategory}
//                   className='w-4 h-4 accent-red-600 cursor-pointer'
//                 />
//                 <label htmlFor={category.value} className='cursor-pointer text-slate-700'>{category.label}</label>
//               </div>
//             ))}
//           </form>
//         </div>


//         <div className='flex flex-col justify-start p-4 w-full h-full lg:shadow-lg lg:rounded-lg overflow-hidden'>
//           <p className='font-medium text-slate-800 text-lg mb-2'>Search Results : {data.length}</p>

//           {/* Scrollable Content Wrapper */}
//           <div className='overflow-y-scroll scrollbar-none flex-1'>
//             <div>
//                {/* Offer Posters Section - inside scrollable area */}
//             {selectedCategoryOfferPosters.length > 0 && (
//               <div className='bg-white shadow-xl rounded-xl mb-4 w-full'>
//                 {selectedCategoryOfferPosters.map((category, index) => (
//                   <div key={category.value} className={`${index === offerPosterIndex ? 'block' : 'hidden'}`}>
//                     <img
//                       src={category.offerPoster.image}
//                       alt={category.label}
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Carousel Dots BELOW the Image */}
//               {selectedCategoryOfferPosters.length > 0 && (
//                 <div className="flex justify-center items-center space-x-2 mt-5 mb-4">
//                   {selectedCategoryOfferPosters.map((_, index) => {
//                     if (Math.abs(index - offerPosterIndex) > 1) return null; // Show only previous, current, next
//                     return (
//                       <button
//                         key={index}
//                         onClick={() => setOfferPosterIndex(index)}
//                         className={`h-2 rounded-full transition-all duration-300 ${
//                           offerPosterIndex === index ? 'bg-black w-8' : 'bg-gray-300 w-4'
//                         }`}
//                       />
//                     );
//                   })}
//                 </div>
//               )}
//             </div>


//             {/* Products Grid */}
//             <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
//               {loading ? (
//                 <p>Loading...</p>
//               ) : data.length > 0 ? (
//                 data.map((product) => (
//                   <VerticalCard key={product._id} data={product} className="w-full" />
//                 ))
//               ) : (
//                 <p className="col-span-full text-center py-10">
//                   {validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k])
//                     ? "No products found for this category"
//                     : "No products found for the selected categories"}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryProduct;



// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VerticalCard from './VerticalCard';
// import SummaryApi from '../common';

// const CategoryProduct = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [childCategories, setChildCategories] = useState([]);
//   const [selectCategory, setSelectCategory] = useState({});
//   const [sortBy, setSortBy] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedParentCategoryName, setSelectedParentCategoryName] = useState("");
//   const [offerPosterIndex, setOfferPosterIndex] = useState(0);
//   const [initialLoad, setInitialLoad] = useState(true);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Parse URL parameters
//   const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
//   const urlCategoryListingArray = useMemo(() => urlSearch.getAll("category"), [urlSearch]);
//   const urlParentCategory = useMemo(() => urlSearch.get("parentCategory"), [urlSearch]);

//   const validParentCategory = useMemo(() => 
//     urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '',
//     [urlParentCategory]
//   );

//   // Fetch data function
//   const fetchData = useCallback(async (categories = []) => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.filterProduct.url, {
//         method: SummaryApi.filterProduct.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({
//           category: categories,
//           parentCategory: validParentCategory || undefined
//         })
//       });
//       const dataResponse = await response.json();

//       if (dataResponse.data?.length === 0) {
//         setData([]);
//         if (validParentCategory) {
//           navigate(`/product-category?parentCategory=${encodeURIComponent(validParentCategory)}`, {
//             replace: true,
//             state: { noProducts: true }
//           });
//         }
//       } else {
//         setData(dataResponse?.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [validParentCategory, navigate]);

//   // Restore filters from URL on mount
//   useEffect(() => {
//     if (urlCategoryListingArray.length > 0) {
//       const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
//         acc[el] = true;
//         return acc;
//       }, {});
//       setSelectCategory(restoredCategories);
//     } else {
//       setSelectCategory({});
//     }
//   }, [location.search, urlCategoryListingArray]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(SummaryApi.getActiveProductCategory.url);
//         const data = await response.json();

//         if (data.success) {
//           const filteredCategories = data.categories.filter(category => category.productCount > 0);
//           setCategories(filteredCategories);

//           if (validParentCategory) {
//             const normalizedParentCategory = validParentCategory.toLowerCase().trim();
//             const parentCategory = filteredCategories.find(category => 
//               category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
//             );

//             if (parentCategory) {
//               setSelectedParentCategoryName(parentCategory.name);
//               const children = filteredCategories.filter(category =>
//                 category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
//               );
//               setChildCategories(children);

//               const childCategoryValues = children.map(child => child.value);
//               await fetchData(childCategoryValues);
//             } else {
//               setData([]);
//             }
//           } else {
//             setChildCategories(filteredCategories);
//             if (!initialLoad) {
//               await fetchData([]);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setData([]);
//       } finally {
//         setInitialLoad(false);
//       }
//     };

//     fetchCategories();
//   }, [validParentCategory, fetchData, initialLoad]);

//   // Update URL and fetch data when category selection changes
//   useEffect(() => {
//     if (validParentCategory && initialLoad) return;

//     const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
//     const urlParams = new URLSearchParams();

//     selectedCategories.forEach(category => urlParams.append("category", category));
//     if (validParentCategory) urlParams.append("parentCategory", validParentCategory);

//     navigate("/product-category?" + urlParams.toString(), { replace: true });

//     if (validParentCategory) {
//       if (selectedCategories.length > 0) {
//         fetchData(selectedCategories);
//       } else if (childCategories.length > 0) {
//         const childCategoryValues = childCategories.map(child => child.value);
//         fetchData(childCategoryValues);
//       }
//     } else {
//       fetchData(selectedCategories.length > 0 ? selectedCategories : []);
//     }
//   }, [selectCategory, validParentCategory, childCategories, initialLoad, fetchData, navigate]);

//   // Handle category selection
//   const handleSelectCategory = useCallback((e) => {
//     const { value, checked } = e.target;
//     setSelectCategory(prev => ({ ...prev, [value]: checked }));
//   }, []);

//   // Handle sort change
//   const handleOnChangeSortBy = useCallback((e) => {
//     const { value } = e.target;
//     setSortBy(value);
//     setData(prev => {
//       const sortedData = [...prev].sort((a, b) =>
//         value === 'asc' ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
//       );
//       return sortedData;
//     });
//   }, []);

//   // Selected category offer posters
//   const selectedCategoryOfferPosters = useMemo(() => {
//     if (childCategories.length === 0) return [];

//     const allPosters = childCategories.filter(c => c.offerPoster?.image);

//     if (validParentCategory && Object.keys(selectCategory).length === 0) {
//       return allPosters;
//     }

//     const selectedValues = Object.keys(selectCategory).filter(k => selectCategory[k]);
//     return selectedValues.length > 0
//       ? allPosters.filter(c => selectedValues.includes(c.value))
//       : allPosters;
//   }, [childCategories, selectCategory, validParentCategory]);

//   // Reset poster index when posters change
//   useEffect(() => {
//     setOfferPosterIndex(0);
//   }, [selectedCategoryOfferPosters.length]);

//   // Auto-rotate offer posters
//   useEffect(() => {
//     if (selectedCategoryOfferPosters.length > 1) {
//       const interval = setInterval(() => {
//         setOfferPosterIndex(prev => (prev + 1) % selectedCategoryOfferPosters.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [selectedCategoryOfferPosters.length]);

//   // Handle Add to Cart
//   const handleAddToCart = useCallback(async (e, productId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       // Your add to cart logic here
//       console.log("Adding to cart:", productId);
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   }, []);

//   return (
//     <div className='p-0 lg:p-0'>
//       {/* Mobile Header */}
//       <div className='flex justify-between items-center mt-2 lg:hidden p-4 bg-white shadow-md rounded-md'>
//         <div className='relative'>
//           <select
//             className='border rounded-md px-4 py-2 text-xs shadow-sm focus:outline-none focus:ring focus:ring-blue-300'
//             value={sortBy}
//             onChange={handleOnChangeSortBy}
//           >
//             <option value=''>Sort By</option>
//             <option value='asc'>Price - Low to High</option>
//             <option value='dsc'>Price - High to Low</option>
//           </select>
//         </div>

//         <button
//           className='bg-blue-600 text-white text-xs px-4 py-2 rounded-md shadow-sm hover:bg-blue-700'
//           onClick={() => setShowModal(true)}
//         >
//           Filter Categories
//         </button>
//       </div>

//       {/* Category Modal */}
//       {showModal && (
//         <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'>
//           <div className='bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden'>
//             <h3 className='text-lg font-medium mb-4 px-4 pt-4'>Select Categories</h3>
//             <div className='flex flex-col gap-2 overflow-y-auto max-h-[60vh] px-4 pb-4'>
//               {childCategories.map((category) => (
//                 <div className='flex items-center gap-3' key={category.value}>
//                   <input
//                     type='checkbox'
//                     name='category'
//                     checked={selectCategory[category.value] || false}
//                     value={category.value}
//                     id={`modal-${category.value}`}
//                     onChange={handleSelectCategory}
//                   />
//                   <label htmlFor={`modal-${category.value}`}>{category.label}</label>
//                 </div>
//               ))}
//             </div>
//             <div className='mt-4 flex justify-end gap-2 px-4 pb-4'>
//               <button
//                 className='bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300'
//                 onClick={() => setShowModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className='flex justify-between items-start min-h-screen bg-white gap-4'>
//         {/* Desktop Sidebar */}
//         <div className='hidden lg:flex flex-col justify-start p-4 w-[230px] xl:w-[250px] bg-white shadow-lg rounded-lg sticky top-4 h-[calc(100vh-2rem)]'>
//           <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-brand-productCardBorder'>Sort by</h3>
//           <form className='text-sm flex flex-col gap-2 py-2'>
//             <div className='flex items-center gap-3'>
//               <input 
//                 type='radio' 
//                 name='sortBy' 
//                 checked={sortBy === 'asc'} 
//                 onChange={handleOnChangeSortBy} 
//                 value="asc" 
//                 id="asc" 
//               />
//               <label htmlFor='asc'>Price - Low to High</label>
//             </div>
//             <div className='flex items-center gap-3'>
//               <input 
//                 type='radio' 
//                 name='sortBy' 
//                 checked={sortBy === 'dsc'} 
//                 onChange={handleOnChangeSortBy} 
//                 value="dsc" 
//                 id="dsc" 
//               />
//               <label htmlFor='dsc'>Price - High to Low</label>
//             </div>
//           </form>

//           <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-brand-productCardBorder mt-4'>Category</h3>
//           <form className='text-sm flex flex-col gap-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-productCardBorder scrollbar-track-transparent flex-1 pr-2'>
//             {childCategories.map((category) => (
//               <div className='flex items-center gap-2' key={category.value}>
//                 <input
//                   type='checkbox'
//                   name="category"
//                   checked={selectCategory[category.value] || false}
//                   value={category.value}
//                   id={category.value}
//                   onChange={handleSelectCategory}
//                   className='w-4 h-4 accent-red-600 cursor-pointer'
//                 />
//                 <label htmlFor={category.value} className='cursor-pointer text-slate-700'>
//                   {category.label}
//                 </label>
//               </div>
//             ))}
//           </form>
//         </div>

//         {/* Main Content */}
//         <div className='flex flex-col justify-start p-4 w-full'>
//           <p className='font-medium text-slate-800 text-lg mb-4'>
//             Search Results: {data.length}
//           </p>

//           <div className='overflow-y-auto'>
//             {/* Offer Posters */}
//             {selectedCategoryOfferPosters.length > 0 && (
//               <>
//                 <div className='bg-white shadow-xl rounded-xl mb-4 w-full overflow-hidden'>
//                   {selectedCategoryOfferPosters.map((category, index) => (
//                     <div 
//                       key={category.value} 
//                       className={`${index === offerPosterIndex ? 'block' : 'hidden'}`}
//                     >
//                       <img
//                         src={category.offerPoster.image}
//                         alt={category.label}
//                         className="w-full h-full object-cover rounded-lg"
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Carousel Dots */}
//                 {selectedCategoryOfferPosters.length > 1 && (
//                   <div className="flex justify-center items-center space-x-2 mb-6">
//                     {selectedCategoryOfferPosters.map((_, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setOfferPosterIndex(index)}
//                         className={`h-2 rounded-full transition-all duration-300 ${
//                           offerPosterIndex === index ? 'bg-black w-8' : 'bg-gray-300 w-4'
//                         }`}
//                         aria-label={`Go to slide ${index + 1}`}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}

//             {/* Products Grid */}
//             <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
//               {loading ? (
//                 Array.from({ length: 8 }).map((_, index) => (
//                   <VerticalCard key={index} product={{}} loading={true} />
//                 ))
//               ) : data.length > 0 ? (
//                 data.map((product) => (
//                   <VerticalCard 
//                     key={product._id} 
//                     product={product}
//                     actionSlot={
//                       product?.isHidden || product?.availability === 0 ? (
//                         <button 
//                           className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-medium'
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             // Handle enquiry
//                           }}
//                         >
//                           Enquire Now
//                         </button>
//                       ) : (
//                         <button 
//                           className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-medium'
//                           onClick={(e) => handleAddToCart(e, product._id)}
//                         >
//                           Add to Cart
//                         </button>
//                       )
//                     }
//                   />
//                 ))
//               ) : (
//                 <p className="col-span-full text-center py-10 text-slate-500">
//                   {validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k])
//                     ? "No products found for this category"
//                     : "No products found for the selected categories"}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryProduct;

// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VerticalCard from './VerticalCard';
// import SummaryApi from '../common';

// const CategoryProduct = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [childCategories, setChildCategories] = useState([]);
//   const [selectCategory, setSelectCategory] = useState({});
//   const [sortBy, setSortBy] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [offerPosterIndex, setOfferPosterIndex] = useState(0);
//   const [initialLoad, setInitialLoad] = useState(true);

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Parse URL parameters
//   const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
//   const urlCategoryListingArray = useMemo(() => urlSearch.getAll("category"), [urlSearch]);
//   const urlParentCategory = useMemo(() => urlSearch.get("parentCategory"), [urlSearch]);

//   const validParentCategory = useMemo(() => 
//     urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '',
//     [urlParentCategory]
//   );

//   // Fetch data function
//   const fetchData = useCallback(async (categories = []) => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.filterProduct.url, {
//         method: SummaryApi.filterProduct.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({
//           category: categories,
//           parentCategory: validParentCategory || undefined
//         })
//       });
//       const dataResponse = await response.json();

//       if (dataResponse.data?.length === 0) {
//         setData([]);
//         if (validParentCategory) {
//           navigate(`/product-category?parentCategory=${encodeURIComponent(validParentCategory)}`, {
//             replace: true,
//             state: { noProducts: true }
//           });
//         }
//       } else {
//         setData(dataResponse?.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [validParentCategory, navigate]);

//   // Restore filters from URL on mount
//   useEffect(() => {
//     if (urlCategoryListingArray.length > 0) {
//       const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
//         acc[el] = true;
//         return acc;
//       }, {});
//       setSelectCategory(restoredCategories);
//     } else {
//       setSelectCategory({});
//     }
//   }, [location.search, urlCategoryListingArray]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(SummaryApi.getActiveProductCategory.url);
//         const data = await response.json();

//         if (data.success) {
//           const filteredCategories = data.categories.filter(category => category.productCount > 0);

//           if (validParentCategory) {
//             const normalizedParentCategory = validParentCategory.toLowerCase().trim();
//             const parentCategory = filteredCategories.find(category => 
//               category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
//             );

//             if (parentCategory) {
//               const children = filteredCategories.filter(category =>
//                 category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
//               );
//               setChildCategories(children);

//               const childCategoryValues = children.map(child => child.value);
//               await fetchData(childCategoryValues);
//             } else {
//               setData([]);
//             }
//           } else {
//             setChildCategories(filteredCategories);
//             if (!initialLoad) {
//               await fetchData([]);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setData([]);
//       } finally {
//         setInitialLoad(false);
//       }
//     };

//     fetchCategories();
//   }, [validParentCategory, fetchData, initialLoad]);

//   // Update URL and fetch data when category selection changes
//   useEffect(() => {
//     if (validParentCategory && initialLoad) return;

//     const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
//     const urlParams = new URLSearchParams();

//     selectedCategories.forEach(category => urlParams.append("category", category));
//     if (validParentCategory) urlParams.append("parentCategory", validParentCategory);

//     navigate("/product-category?" + urlParams.toString(), { replace: true });

//     if (validParentCategory) {
//       if (selectedCategories.length > 0) {
//         fetchData(selectedCategories);
//       } else if (childCategories.length > 0) {
//         const childCategoryValues = childCategories.map(child => child.value);
//         fetchData(childCategoryValues);
//       }
//     } else {
//       fetchData(selectedCategories.length > 0 ? selectedCategories : []);
//     }
//   }, [selectCategory, validParentCategory, childCategories, initialLoad, fetchData, navigate]);

//   // Handle category selection
//   const handleSelectCategory = useCallback((e) => {
//     const { value, checked } = e.target;
//     setSelectCategory(prev => ({ ...prev, [value]: checked }));
//   }, []);

//   // Handle sort change
//   const handleOnChangeSortBy = useCallback((e) => {
//     const { value } = e.target;
//     setSortBy(value);
//     setData(prev => {
//       const sortedData = [...prev].sort((a, b) =>
//         value === 'asc' ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
//       );
//       return sortedData;
//     });
//   }, []);

//   // Selected category offer posters
//   const selectedCategoryOfferPosters = useMemo(() => {
//     if (childCategories.length === 0) return [];

//     const allPosters = childCategories.filter(c => c.offerPoster?.image);

//     if (validParentCategory && Object.keys(selectCategory).length === 0) {
//       return allPosters;
//     }

//     const selectedValues = Object.keys(selectCategory).filter(k => selectCategory[k]);
//     return selectedValues.length > 0
//       ? allPosters.filter(c => selectedValues.includes(c.value))
//       : allPosters;
//   }, [childCategories, selectCategory, validParentCategory]);

//   // Reset poster index when posters change
//   useEffect(() => {
//     setOfferPosterIndex(0);
//   }, [selectedCategoryOfferPosters.length]);

//   // Auto-rotate offer posters
//   useEffect(() => {
//     if (selectedCategoryOfferPosters.length > 1) {
//       const interval = setInterval(() => {
//         setOfferPosterIndex(prev => (prev + 1) % selectedCategoryOfferPosters.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [selectedCategoryOfferPosters.length]);

//   // Handle Add to Cart
//   const handleAddToCart = useCallback(async (e, productId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       // Your add to cart logic here
//       console.log("Adding to cart:", productId);
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   }, []);

//   return (
//     <div className='p-0 lg:p-0 min-h-screen'>
//       {/* Mobile Header */}
//       <div className='flex justify-between items-center mt-2 lg:hidden p-4 bg-white shadow-md rounded-md mx-2'>
//         <div className='relative'>
//           <select
//             className='border rounded-md px-4 py-2 text-xs shadow-sm focus:outline-none focus:ring focus:ring-blue-300'
//             value={sortBy}
//             onChange={handleOnChangeSortBy}
//           >
//             <option value=''>Sort By</option>
//             <option value='asc'>Price - Low to High</option>
//             <option value='dsc'>Price - High to Low</option>
//           </select>
//         </div>

//         <button
//           className='bg-blue-600 text-white text-xs px-4 py-2 rounded-md shadow-sm hover:bg-blue-700'
//           onClick={() => setShowModal(true)}
//         >
//           Filter Categories
//         </button>
//       </div>

//       {/* Category Modal */}
//       {showModal && (
//         <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'>
//           <div className='bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden'>
//             <h3 className='text-lg font-medium mb-4 px-4 pt-4'>Select Categories</h3>
//             <div className='flex flex-col gap-2 overflow-y-auto max-h-[60vh] px-4 pb-4'>
//               {childCategories.map((category) => (
//                 <div className='flex items-center gap-3' key={category.value}>
//                   <input
//                     type='checkbox'
//                     name='category'
//                     checked={selectCategory[category.value] || false}
//                     value={category.value}
//                     id={`modal-${category.value}`}
//                     onChange={handleSelectCategory}
//                   />
//                   <label htmlFor={`modal-${category.value}`}>{category.label}</label>
//                 </div>
//               ))}
//             </div>
//             <div className='mt-4 flex justify-end gap-2 px-4 pb-4'>
//               <button
//                 className='bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300'
//                 onClick={() => setShowModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className='lg:mx-auto lg:flex lg:gap-4 lg:p-4'>
//         {/* Desktop Sidebar - FIXED POSITION */}
//         <aside className='hidden lg:block w-[250px] flex-shrink-0'>
//           <div className='sticky top-4 bg-white shadow-lg rounded-lg p-4 max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col'>
//             {/* Sort Section */}
//             <div className='mb-4'>
//               <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-2 border-brand-productCardBorder'>
//                 Sort by
//               </h3>
//               <div className='text-sm flex flex-col gap-2 py-3'>
//                 <label className='flex items-center gap-3 cursor-pointer'>
//                   <input 
//                     type='radio' 
//                     name='sortBy' 
//                     checked={sortBy === 'asc'} 
//                     onChange={handleOnChangeSortBy} 
//                     value="asc" 
//                     className='w-4 h-4 accent-blue-600'
//                   />
//                   <span>Price - Low to High</span>
//                 </label>
//                 <label className='flex items-center gap-3 cursor-pointer'>
//                   <input 
//                     type='radio' 
//                     name='sortBy' 
//                     checked={sortBy === 'dsc'} 
//                     onChange={handleOnChangeSortBy} 
//                     value="dsc" 
//                     className='w-4 h-4 accent-blue-600'
//                   />
//                   <span>Price - High to Low</span>
//                 </label>
//               </div>
//             </div>

//             {/* Category Section - SCROLLABLE */}
//             <div className='flex flex-col flex-1 min-h-0'>
//               <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-2 border-brand-productCardBorder'>
//                 Category
//               </h3>
//               <div className='overflow-y-auto flex-1 py-3 pr-2 scrollbar-thin scrollbar-thumb-brand-productCardBorder scrollbar-track-transparent'>
//                 <div className='flex flex-col gap-3 text-sm'>
//                   {childCategories.map((category) => (
//                     <label 
//                       key={category.value}
//                       className='flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors'
//                     >
//                       <input
//                         type='checkbox'
//                         name="category"
//                         checked={selectCategory[category.value] || false}
//                         value={category.value}
//                         onChange={handleSelectCategory}
//                         className='w-4 h-4 accent-red-600 cursor-pointer'
//                       />
//                       <span className='text-slate-700'>{category.label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className='flex-1 min-w-0'>
//           {/* Offer Posters */}
//           {selectedCategoryOfferPosters.length > 0 && (
//             <div className='mb-6'>
//               <div className='bg-white shadow-lg rounded-xl overflow-hidden'>
//                 {selectedCategoryOfferPosters.map((category, index) => (
//                   <div 
//                     key={category.value} 
//                     className={`${index === offerPosterIndex ? 'block' : 'hidden'}`}
//                   >
//                     <img
//                       src={category.offerPoster.image}
//                       alt={category.label}
//                       className="w-full h-auto object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* Carousel Dots */}
//               {selectedCategoryOfferPosters.length > 1 && (
//                 <div className="flex justify-center items-center space-x-2 mt-4">
//                   {selectedCategoryOfferPosters.map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setOfferPosterIndex(index)}
//                       className={`h-2 rounded-full transition-all duration-300 ${
//                         offerPosterIndex === index ? 'bg-black w-8' : 'bg-gray-300 w-4'
//                       }`}
//                       aria-label={`Go to slide ${index + 1}`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Products Grid */}
//           <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 md:gap-6'>
//             {loading ? (
//               Array.from({ length: 8 }).map((_, index) => (
//                 <VerticalCard key={index} product={{}} loading={true} />
//               ))
//             ) : data.length > 0 ? (
//               data.map((product) => (
//                 <VerticalCard 
//                   key={product._id} 
//                   product={product}
//                   actionSlot={
//                     product?.isHidden || product?.availability === 0 ? (
//                       <button 
//                         className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-semibold'
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           // console.log('Enquiry for:', product._id);
//                         }}
//                       >
//                         Enquire Now
//                       </button>
//                     ) : (
//                       <button 
//                         className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-semibold'
//                         onClick={(e) => handleAddToCart(e, product._id)}
//                       >
//                         Add to Cart
//                       </button>
//                     )
//                   }
//                 />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-20">
//                 <svg
//                   className='mx-auto h-24 w-24 text-brand-productCardBorder mb-4'
//                   fill='none'
//                   viewBox='0 0 24 24'
//                   stroke='currentColor'
//                 >
//                   <path
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     strokeWidth={1.5}
//                     d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
//                   />
//                 </svg>
//                 <p className="text-slate-500 text-lg">
//                   {validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k])
//                     ? "No products found for this category"
//                     : "No products found for the selected categories"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CategoryProduct;

// import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VerticalCard from '../components/VerticalCard';
// import SummaryApi from '../common';
// import Context from '../context';
// import addToCart from '../helpers/addToCart';

// const CategoryProduct = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [childCategories, setChildCategories] = useState([]);
//   const [selectCategory, setSelectCategory] = useState({});
//   const [sortBy, setSortBy] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [offerPosterIndex, setOfferPosterIndex] = useState(0);
//   const [initialLoad, setInitialLoad] = useState(true);
// console.log(data);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { fetchUserAddToCart } = useContext(Context);

//   // Parse URL parameters
//   const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
//   const urlCategoryListingArray = useMemo(() => urlSearch.getAll("category"), [urlSearch]);
//   const urlParentCategory = useMemo(() => urlSearch.get("parentCategory"), [urlSearch]);

//   const validParentCategory = useMemo(() => 
//     urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '',
//     [urlParentCategory]
//   );

//   // Fetch data function
//   const fetchData = useCallback(async (categories = []) => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.filterProduct.url, {
//         method: SummaryApi.filterProduct.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({
//           category: categories,
//           parentCategory: validParentCategory || undefined
//         })
//       });
//       const dataResponse = await response.json();

//       if (dataResponse.data?.length === 0) {
//         setData([]);
//       } else {
//         setData(dataResponse?.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [validParentCategory]);

//   // Restore filters from URL on mount
//   useEffect(() => {
//     if (urlCategoryListingArray.length > 0) {
//       const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
//         acc[el] = true;
//         return acc;
//       }, {});
//       setSelectCategory(restoredCategories);
//     } else {
//       setSelectCategory({});
//     }
//   }, [location.search, urlCategoryListingArray]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(SummaryApi.getActiveProductCategory.url);
//         const data = await response.json();

//         if (data.success) {
//           const filteredCategories = data.categories.filter(category => category.productCount > 0);

//           if (validParentCategory) {
//             const normalizedParentCategory = validParentCategory.toLowerCase().trim();
//             const children = filteredCategories.filter(category =>
//               category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
//             );
//             setChildCategories(children);

//             const childCategoryValues = children.map(child => child.value);
//             await fetchData(childCategoryValues);
//           } else {
//             setChildCategories(filteredCategories);
//             if (!initialLoad) {
//               await fetchData([]);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setData([]);
//       } finally {
//         setInitialLoad(false);
//       }
//     };

//     fetchCategories();
//   }, [validParentCategory, fetchData, initialLoad]);

//   // Update URL and fetch data when category selection changes
//   useEffect(() => {
//     if (validParentCategory && initialLoad) return;

//     const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
//     const urlParams = new URLSearchParams();

//     selectedCategories.forEach(category => urlParams.append("category", category));
//     if (validParentCategory) urlParams.append("parentCategory", validParentCategory);

//     navigate("/product-category?" + urlParams.toString(), { replace: true });

//     if (validParentCategory) {
//       if (selectedCategories.length > 0) {
//         fetchData(selectedCategories);
//       } else if (childCategories.length > 0) {
//         const childCategoryValues = childCategories.map(child => child.value);
//         fetchData(childCategoryValues);
//       }
//     } else {
//       fetchData(selectedCategories.length > 0 ? selectedCategories : []);
//     }
//   }, [selectCategory, validParentCategory, childCategories, initialLoad, fetchData, navigate]);

//   // Handle category selection
//   const handleSelectCategory = useCallback((e) => {
//     const { value, checked } = e.target;
//     setSelectCategory(prev => ({ ...prev, [value]: checked }));
//   }, []);

//   // Handle sort change
//   const handleOnChangeSortBy = useCallback((e) => {
//     const { value } = e.target;
//     setSortBy(value);
//     setData(prev => {
//       const sortedData = [...prev].sort((a, b) =>
//         value === 'asc' ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
//       );
//       return sortedData;
//     });
//   }, []);

//   // Selected category offer posters
//   const selectedCategoryOfferPosters = useMemo(() => {
//     if (childCategories.length === 0) return [];

//     const allPosters = childCategories.filter(c => c.offerPoster?.image);

//     if (validParentCategory && Object.keys(selectCategory).length === 0) {
//       return allPosters;
//     }

//     const selectedValues = Object.keys(selectCategory).filter(k => selectCategory[k]);
//     return selectedValues.length > 0
//       ? allPosters.filter(c => selectedValues.includes(c.value))
//       : allPosters;
//   }, [childCategories, selectCategory, validParentCategory]);

//   // Reset poster index when posters change
//   useEffect(() => {
//     setOfferPosterIndex(0);
//   }, [selectedCategoryOfferPosters.length]);

//   // Auto-rotate offer posters
//   useEffect(() => {
//     if (selectedCategoryOfferPosters.length > 1) {
//       const interval = setInterval(() => {
//         setOfferPosterIndex(prev => (prev + 1) % selectedCategoryOfferPosters.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [selectedCategoryOfferPosters.length]);

//   // Handle Add to Cart
//   const handleAddToCart = useCallback(async (e, productId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       await addToCart(e, productId);
//       fetchUserAddToCart();
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   }, [fetchUserAddToCart]);

//   // Count selected categories
//   const selectedCount = Object.values(selectCategory).filter(Boolean).length;

//   return (
//     <div className='h-screen'>
//       {/* Mobile Header */}
//       <div className='lg:hidden sticky top-0 z-10 bg-white shadow-md'>
//         <div className='flex justify-between items-center p-4'>
//           <select
//             className='border border-brand-productCardBorder rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
//             value={sortBy}
//             onChange={handleOnChangeSortBy}
//           >
//             <option value=''>Sort By</option>
//             <option value='asc'>Price: Low to High</option>
//             <option value='dsc'>Price: High to Low</option>
//           </select>

//           <button
//             className='bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
//             onClick={() => setShowModal(true)}
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//             </svg>
//             Filters {selectedCount > 0 && `(${selectedCount})`}
//           </button>
//         </div>
//       </div>

//       {/* Category Modal */}
//       {showModal && (
//         <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4' onClick={() => setShowModal(false)}>
//           <div className='bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden' onClick={(e) => e.stopPropagation()}>
//             <div className='p-4 border-b flex justify-between items-center'>
//               <h3 className='text-lg font-semibold'>Filter Categories</h3>
//               <button onClick={() => setShowModal(false)} className='text-slate-400 hover:text-slate-600'>
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className='overflow-y-auto max-h-[calc(80vh-140px)] p-4'>
//               <div className='space-y-2'>
//                 {childCategories.map((category) => (
//                   <label 
//                     key={category.value}
//                     className='flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors'
//                   >
//                     <input
//                       type='checkbox'
//                       checked={selectCategory[category.value] || false}
//                       value={category.value}
//                       onChange={handleSelectCategory}
//                       className='w-5 h-5 rounded border-brand-productCardBorder text-blue-600 focus:ring-blue-500'
//                     />
//                     <span className='text-sm font-medium'>{category.label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className='p-4 border-t flex gap-2'>
//               <button
//                 className='flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors'
//                 onClick={() => {
//                   setSelectCategory({});
//                   setShowModal(false);
//                 }}
//               >
//                 Clear All
//               </button>
//               <button
//                 className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
//                 onClick={() => setShowModal(false)}
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Container */}
//       <div className='mx-auto px-4 py-4'>
//         <div className='flex gap-4'>
//           {/* Desktop Sidebar */}
//           <aside className="hidden lg:block w-[260px] h-[calc(100vh-80px)]">
//           <div className="h-full bg-white rounded-md pl-4 lg:pl-6 xl:pl-8 flex flex-col">

//               {/* Sort Section */}
//               <div className='pb-6 border-b '>
//                 <h3 className='text-lg font-bold text-slate-800 mb-4 flex items-center gap-2'>
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
//                   </svg>
//                   Sort By
//                 </h3>
//                 <div className='space-y-3'>
//                   <label className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors'>
//                     <input 
//                       type='radio' 
//                       name='sortBy' 
//                       checked={sortBy === 'asc'} 
//                       onChange={handleOnChangeSortBy} 
//                       value="asc" 
//                       className='w-4 h-4 text-blue-600 focus:ring-blue-500'
//                     />
//                     <span className='text-sm'>Price: Low to High</span>
//                   </label>
//                   <label className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors'>
//                     <input 
//                       type='radio' 
//                       name='sortBy' 
//                       checked={sortBy === 'dsc'} 
//                       onChange={handleOnChangeSortBy} 
//                       value="dsc" 
//                       className='w-4 h-4 text-blue-600 focus:ring-blue-500'
//                     />
//                     <span className='text-sm'>Price: High to Low</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Category Section - With overflow-auto to make it scrollable */}
//               <div className='flex flex-col flex-1 min-h-0 pt-6'>
//                 <div className='flex items-center justify-between mb-2 pr-4'>
//                   <h3 className='text-lg font-bold text-slate-800 flex items-center gap-2'>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                     </svg>
//                     Categories
//                   </h3>
//                   {selectedCount > 0 && (
//                     <button
//                       onClick={() => setSelectCategory({})}
//                       className='text-xs text-blue-600 hover:text-blue-700 font-medium'
//                     >
//                       Clear All
//                     </button>
//                   )}
//                 </div>

//                 {/* This div is scrollable */}
//               <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-brand-productCardBorder">
//                 <div className="space-y-2">
//                   {childCategories.map((category) => (
//                     <label key={category.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
//                       <input
//                         type="checkbox"
//                         checked={selectCategory[category.value] || false}
//                         value={category.value}
//                         onChange={handleSelectCategory}
//                       />
//                       <span className="text-sm">{category.label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               </div>
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main className='flex-1 h-[calc(100vh-80px)] overflow-y-auto pr-2'>

//             {/* Offer Posters */}
//             {selectedCategoryOfferPosters.length > 0 && (
//               <div className='mb-6'>
//                 <div className='bg-white shadow-lg rounded-xl overflow-hidden'>
//                   {selectedCategoryOfferPosters.map((category, index) => (
//                     <div 
//                       key={category.value} 
//                       className={`${index === offerPosterIndex ? 'block' : 'hidden'}`}
//                     >
//                       <img
//                         src={category.offerPoster.image}
//                         alt={category.label}
//                         className="w-full h-auto object-cover"
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 {selectedCategoryOfferPosters.length > 1 && (
//                   <div className="flex justify-center items-center space-x-2 mt-4">
//                     {selectedCategoryOfferPosters.map((_, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setOfferPosterIndex(index)}
//                         className={`h-2 rounded-full transition-all duration-300 ${
//                           offerPosterIndex === index ? 'bg-blue-600 w-8' : 'bg-brand-productCardBorder w-2'
//                         }`}
//                         aria-label={`Go to slide ${index + 1}`}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Products Grid */}
//             <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
//               {loading ? (
//                 Array.from({ length: 8 }).map((_, index) => (
//                   <VerticalCard key={index} loading={true} />
//                 ))
//               ) : data.length > 0 ? (
//                 data.map((product) => (
//                   <VerticalCard 
//                     key={product._id} 
//                     product={product}
//                     actionSlot={
//                       product?.isHidden || product?.availability === 0 ? (
//                         <button 
//                           className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-semibold'
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/product/${product._id}`);
//                           }}
//                         >
//                           Enquire Now
//                         </button>
//                       ) : (
//                         <button 
//                           className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-semibold'
//                           onClick={(e) => handleAddToCart(e, product._id)}
//                         >
//                           Add to Cart
//                         </button>
//                       )
//                     }
//                   />
//                 ))
//               ) : (
//                 <div className="col-span-full text-center py-20">
//                   <svg
//                     className='mx-auto h-24 w-24 text-brand-textMuted mb-4'
//                     fill='none'
//                     viewBox='0 0 24 24'
//                     stroke='currentColor'
//                   >
//                     <path
//                       strokeLinecap='round'
//                       strokeLinejoin='round'
//                       strokeWidth={1.5}
//                       d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
//                     />
//                   </svg>
//                   <p className="text-brand-primaryTextMuted text-lg">
//                     {validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k])
//                       ? "No products found for this category"
//                       : "No products found for the selected categories"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryProduct;

// import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VerticalCard from '../components/VerticalCard';
// import SummaryApi from '../common';
// import Context from '../context';
// import addToCart from '../helpers/addToCart';

// const CategoryProduct = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [childCategories, setChildCategories] = useState([]);
//   const [selectCategory, setSelectCategory] = useState({});
//   const [sortBy, setSortBy] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [offerPosterIndex, setOfferPosterIndex] = useState(0);
//   const [initialLoad, setInitialLoad] = useState(true);

//   // Filter section toggle states
//   const [isCategoryOpen, setIsCategoryOpen] = useState(true);
//   const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
//   const [isScreenSizeOpen, setIsScreenSizeOpen] = useState(true);

//   // Price range state
//   const [priceRange, setPriceRange] = useState([0, 100000]);
//   const [maxPrice, setMaxPrice] = useState(100000);

//   // Screen size state
//   const [selectScreenSize, setSelectScreenSize] = useState({});
//   const [availableScreenSizes, setAvailableScreenSizes] = useState([]);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { fetchUserAddToCart } = useContext(Context);

//   // Parse URL parameters
//   const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
//   const urlCategoryListingArray = useMemo(() => urlSearch.getAll("category"), [urlSearch]);
//   const urlParentCategory = useMemo(() => urlSearch.get("parentCategory"), [urlSearch]);

//   const validParentCategory = useMemo(() => 
//     urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '',
//     [urlParentCategory]
//   );

//   // Check if category has screen sizes (like TV)
//   const hasScreenSizeFilter = useMemo(() => {
//     if (!validParentCategory) return false;
//     const tvCategories = ['tv', 'television', 'smart tv'];
//     return tvCategories.some(cat => 
//       validParentCategory.toLowerCase().includes(cat)
//     );
//   }, [validParentCategory]);

//   // Fetch data function
//   const fetchData = useCallback(async (categories = [], screenSizes = [], priceRng = null) => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.filterProduct.url, {
//         method: SummaryApi.filterProduct.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({
//           category: categories,
//           parentCategory: validParentCategory || undefined,
//           screenSize: screenSizes.length > 0 ? screenSizes : undefined,
//           minPrice: priceRng ? priceRng[0] : undefined,
//           maxPrice: priceRng ? priceRng[1] : undefined
//         })
//       });
//       const dataResponse = await response.json();

//       if (dataResponse.data?.length === 0) {
//         setData([]);
//       } else {
//         const products = dataResponse?.data || [];
//         setData(products);

//         // Calculate max price from products
//         if (products.length > 0) {
//           const max = Math.max(...products.map(p => p.sellingPrice || 0));
//           setMaxPrice(Math.ceil(max / 1000) * 1000);
//           if (!priceRng) {
//             setPriceRange([0, Math.ceil(max / 1000) * 1000]);
//           }
//         }

//         // Extract unique screen sizes if applicable
//         if (hasScreenSizeFilter) {
//           const sizes = [...new Set(products
//             .map(p => p.screenSize)
//             .filter(Boolean)
//           )].sort((a, b) => {
//             const numA = parseInt(a);
//             const numB = parseInt(b);
//             return numA - numB;
//           });
//           setAvailableScreenSizes(sizes);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [validParentCategory, hasScreenSizeFilter]);

//   // Restore filters from URL on mount
//   useEffect(() => {
//     if (urlCategoryListingArray.length > 0) {
//       const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
//         acc[el] = true;
//         return acc;
//       }, {});
//       setSelectCategory(restoredCategories);
//     } else {
//       setSelectCategory({});
//     }
//   }, [location.search, urlCategoryListingArray]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(SummaryApi.getActiveProductCategory.url);
//         const data = await response.json();

//         if (data.success) {
//           const filteredCategories = data.categories.filter(category => category.productCount > 0);

//           if (validParentCategory) {
//             const normalizedParentCategory = validParentCategory.toLowerCase().trim();
//             const children = filteredCategories.filter(category =>
//               category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
//             );
//             setChildCategories(children);

//             const childCategoryValues = children.map(child => child.value);
//             await fetchData(childCategoryValues);
//           } else {
//             setChildCategories(filteredCategories);
//             if (!initialLoad) {
//               await fetchData([]);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setData([]);
//       } finally {
//         setInitialLoad(false);
//       }
//     };

//     fetchCategories();
//   }, [validParentCategory, fetchData, initialLoad]);

//   // Update URL and fetch data when filters change
//   useEffect(() => {
//     if (validParentCategory && initialLoad) return;

//     const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
//     const selectedScreenSizes = Object.keys(selectScreenSize).filter(size => selectScreenSize[size]);

//     const urlParams = new URLSearchParams();

//     selectedCategories.forEach(category => urlParams.append("category", category));
//     if (validParentCategory) urlParams.append("parentCategory", validParentCategory);

//     navigate("/product-category?" + urlParams.toString(), { replace: true });

//     if (validParentCategory) {
//       if (selectedCategories.length > 0) {
//         fetchData(selectedCategories, selectedScreenSizes, priceRange);
//       } else if (childCategories.length > 0) {
//         const childCategoryValues = childCategories.map(child => child.value);
//         fetchData(childCategoryValues, selectedScreenSizes, priceRange);
//       }
//     } else {
//       fetchData(
//         selectedCategories.length > 0 ? selectedCategories : [], 
//         selectedScreenSizes,
//         priceRange
//       );
//     }
//   }, [selectCategory, selectScreenSize, validParentCategory, childCategories, initialLoad, fetchData, navigate]);

//   // Handle category selection
//   const handleSelectCategory = useCallback((e) => {
//     const { value, checked } = e.target;
//     setSelectCategory(prev => ({ ...prev, [value]: checked }));
//   }, []);

//   // Handle screen size selection
//   const handleSelectScreenSize = useCallback((e) => {
//     const { value, checked } = e.target;
//     setSelectScreenSize(prev => ({ ...prev, [value]: checked }));
//   }, []);

//   // Handle price range change
//   const handlePriceRangeChange = useCallback((e, index) => {
//     const value = parseInt(e.target.value);
//     setPriceRange(prev => {
//       const newRange = [...prev];
//       newRange[index] = value;
//       return newRange;
//     });
//   }, []);

//   // Apply price filter
//   const applyPriceFilter = useCallback(() => {
//     const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
//     const selectedScreenSizes = Object.keys(selectScreenSize).filter(size => selectScreenSize[size]);

//     if (validParentCategory) {
//       if (selectedCategories.length > 0) {
//         fetchData(selectedCategories, selectedScreenSizes, priceRange);
//       } else if (childCategories.length > 0) {
//         const childCategoryValues = childCategories.map(child => child.value);
//         fetchData(childCategoryValues, selectedScreenSizes, priceRange);
//       }
//     } else {
//       fetchData(
//         selectedCategories.length > 0 ? selectedCategories : [],
//         selectedScreenSizes,
//         priceRange
//       );
//     }
//   }, [selectCategory, selectScreenSize, priceRange, validParentCategory, childCategories, fetchData]);

//   // Handle sort change
//   const handleOnChangeSortBy = useCallback((e) => {
//     const { value } = e.target;
//     setSortBy(value);
//     setData(prev => {
//       const sortedData = [...prev].sort((a, b) =>
//         value === 'asc' ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
//       );
//       return sortedData;
//     });
//   }, []);

//   // Selected category offer posters
//   const selectedCategoryOfferPosters = useMemo(() => {
//     if (childCategories.length === 0) return [];

//     const allPosters = childCategories.filter(c => c.offerPoster?.image);

//     if (validParentCategory && Object.keys(selectCategory).length === 0) {
//       return allPosters;
//     }

//     const selectedValues = Object.keys(selectCategory).filter(k => selectCategory[k]);
//     return selectedValues.length > 0
//       ? allPosters.filter(c => selectedValues.includes(c.value))
//       : allPosters;
//   }, [childCategories, selectCategory, validParentCategory]);

//   // Reset poster index when posters change
//   useEffect(() => {
//     setOfferPosterIndex(0);
//   }, [selectedCategoryOfferPosters.length]);

//   // Auto-rotate offer posters
//   useEffect(() => {
//     if (selectedCategoryOfferPosters.length > 1) {
//       const interval = setInterval(() => {
//         setOfferPosterIndex(prev => (prev + 1) % selectedCategoryOfferPosters.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [selectedCategoryOfferPosters.length]);

//   // Handle Add to Cart
//   const handleAddToCart = useCallback(async (e, productId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       await addToCart(e, productId);
//       fetchUserAddToCart();
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   }, [fetchUserAddToCart]);

//   // Count selected filters
//   const selectedCount = Object.values(selectCategory).filter(Boolean).length + 
//                         Object.values(selectScreenSize).filter(Boolean).length;

//   // Reset all filters
//   const resetAllFilters = () => {
//     setSelectCategory({});
//     setSelectScreenSize({});
//     setPriceRange([0, maxPrice]);
//   };

//   return (
//     <div className='min-h-screen bg-white'>
//       {/* Top Banner Poster - Full Width */}
//       {selectedCategoryOfferPosters.length > 0 && (
//         <div className='w-full mb-4'>
//           <div className='relative w-full h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden'>
//             {selectedCategoryOfferPosters.map((category, index) => (
//               <div 
//                 key={category.value} 
//                 className={`absolute inset-0 transition-opacity duration-500 ${
//                   index === offerPosterIndex ? 'opacity-100' : 'opacity-0'
//                 }`}
//               >
//                 <img
//                   src={category.offerPoster.image}
//                   alt={category.label}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Carousel Dots */}
//           {selectedCategoryOfferPosters.length > 1 && (
//             <div className="flex justify-center items-center space-x-2 mt-4">
//               {selectedCategoryOfferPosters.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setOfferPosterIndex(index)}
//                   className={`h-2 rounded-full transition-all duration-300 ${
//                     offerPosterIndex === index ? 'bg-red-600 w-8' : 'bg-gray-300 w-2'
//                   }`}
//                   aria-label={`Go to slide ${index + 1}`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Mobile Header */}
//       <div className='lg:hidden sticky top-0 z-10 bg-white border-b'>
//         <div className='flex justify-between items-center p-4'>
//           <div className='flex items-center gap-2'>
//             <span className='text-sm text-slate-600'>Showing {data.length} results</span>
//           </div>

//           <div className='flex items-center gap-2'>
//             <select
//               className='border border-brand-productCardBorder rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
//               value={sortBy}
//               onChange={handleOnChangeSortBy}
//             >
//               <option value=''>Sort By</option>
//               <option value='asc'>Price: Low to High</option>
//               <option value='dsc'>Price: High to Low</option>
//             </select>

//             <button
//               className='flex items-center gap-2 border border-brand-productCardBorder rounded px-3 py-1.5 text-sm hover:bg-slate-50'
//               onClick={() => setShowModal(true)}
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//               </svg>
//               Filter
//               {selectedCount > 0 && (
//                 <span className='bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
//                   {selectedCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Filter Modal */}
//       {showModal && (
//         <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end' onClick={() => setShowModal(false)}>
//           <div className='bg-white rounded-t-2xl w-full max-h-[85vh] overflow-hidden' onClick={(e) => e.stopPropagation()}>
//             <div className='p-4 border-b flex justify-between items-center sticky top-0 bg-white'>
//               <h3 className='text-lg font-semibold'>Filters</h3>
//               <button onClick={() => setShowModal(false)} className='text-slate-400 hover:text-slate-600'>
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className='overflow-y-auto max-h-[calc(85vh-140px)] p-4'>
//               {/* Category Section */}
//               <div className='mb-4'>
//                 <button
//                   onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                   className='flex justify-between items-center w-full py-2 text-left font-medium'
//                 >
//                   <span>Category</span>
//                   <svg
//                     className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
//                 {isCategoryOpen && (
//                   <div className='space-y-2 mt-2'>
//                     {childCategories.map((category) => (
//                       <label 
//                         key={category.value}
//                         className='flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer'
//                       >
//                         <input
//                           type='checkbox'
//                           checked={selectCategory[category.value] || false}
//                           value={category.value}
//                           onChange={handleSelectCategory}
//                           className='w-4 h-4 accent-red-600'
//                         />
//                         <span className='text-sm'>{category.label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Price Range Section */}
//               <div className='mb-4 border-t pt-4'>
//                 <button
//                   onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
//                   className='flex justify-between items-center w-full py-2 text-left font-medium'
//                 >
//                   <span>Price Range</span>
//                   <svg
//                     className={`w-5 h-5 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
//                 {isPriceRangeOpen && (
//                   <div className='mt-4 px-2'>
//                     <div className='flex justify-between mb-2'>
//                       <span className='text-sm'>₹{priceRange[0]}</span>
//                       <span className='text-sm'>₹{priceRange[1]}</span>
//                     </div>
//                     <div className='relative pt-1'>
//                       <input
//                         type='range'
//                         min='0'
//                         max={maxPrice}
//                         value={priceRange[0]}
//                         onChange={(e) => handlePriceRangeChange(e, 0)}
//                         className='w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600'
//                       />
//                       <input
//                         type='range'
//                         min='0'
//                         max={maxPrice}
//                         value={priceRange[1]}
//                         onChange={(e) => handlePriceRangeChange(e, 1)}
//                         className='w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600 mt-2'
//                       />
//                     </div>
//                     <button
//                       onClick={applyPriceFilter}
//                       className='w-full mt-3 bg-red-600 text-white py-2 rounded text-sm font-semibold hover:bg-red-700'
//                     >
//                       Apply Price Filter
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Screen Size Section (Only for TV) */}
//               {hasScreenSizeFilter && availableScreenSizes.length > 0 && (
//                 <div className='mb-4 border-t pt-4'>
//                   <button
//                     onClick={() => setIsScreenSizeOpen(!isScreenSizeOpen)}
//                     className='flex justify-between items-center w-full py-2 text-left font-medium'
//                   >
//                     <span>Screen Size</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isScreenSizeOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {isScreenSizeOpen && (
//                     <div className='space-y-2 mt-2'>
//                       {availableScreenSizes.map((size) => (
//                         <label 
//                           key={size}
//                           className='flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer'
//                         >
//                           <input
//                             type='checkbox'
//                             checked={selectScreenSize[size] || false}
//                             value={size}
//                             onChange={handleSelectScreenSize}
//                             className='w-4 h-4 accent-red-600'
//                           />
//                           <span className='text-sm'>{size}</span>
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className='p-4 border-t flex gap-2 bg-white'>
//               <button
//                 className='flex-1 bg-slate-100 text-slate-700 px-4 py-3 rounded font-semibold hover:bg-slate-200'
//                 onClick={() => {
//                   resetAllFilters();
//                   setShowModal(false);
//                 }}
//               >
//                 Clear All
//               </button>
//               <button
//                 className='flex-1 bg-red-600 text-white px-4 py-3 rounded font-semibold hover:bg-red-700'
//                 onClick={() => setShowModal(false)}
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Container */}
//       <div className='mx-auto px-4 lg:px-12 py-4'>
//         <div className='flex gap-4'>
//           {/* Desktop Sidebar */}
//           <aside className="hidden lg:block w-[260px] sticky top-4 h-fit">
//             <div className="bg-white border rounded-lg">
//               {/* Filter Header */}
//               <div className='p-4 border-b flex justify-between items-center'>
//                 <div className='flex items-center gap-2'>
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                   </svg>
//                   <h3 className='font-semibold'>Filter</h3>
//                 </div>
//                 {selectedCount > 0 && (
//                   <button
//                     onClick={resetAllFilters}
//                     className='text-xs text-red-600 hover:text-red-700 font-medium'
//                   >
//                     Reset Filter
//                   </button>
//                 )}
//               </div>

//               <div className='max-h-[calc(100vh-200px)] overflow-y-auto'>
//                 {/* Category Section */}
//                 <div className='border-b'>
//                   <button
//                     onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                     className='flex justify-between items-center w-full p-4 hover:bg-slate-50'
//                   >
//                     <span className='font-medium text-sm'>Category</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {isCategoryOpen && (
//                     <div className='px-4 pb-4 space-y-2 max-h-[300px] overflow-y-auto'>
//                       {childCategories.map((category) => (
//                         <label 
//                           key={category.value}
//                           className='flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer'
//                         >
//                           <input
//                             type='checkbox'
//                             checked={selectCategory[category.value] || false}
//                             value={category.value}
//                             onChange={handleSelectCategory}
//                             className='w-4 h-4 accent-red-600'
//                           />
//                           <span className='text-sm'>{category.label}</span>
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Price Range Section */}
//                 <div className='border-b'>
//                   <button
//                     onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
//                     className='flex justify-between items-center w-full p-4 hover:bg-slate-50'
//                   >
//                     <span className='font-medium text-sm'>Price Range</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {isPriceRangeOpen && (
//                     <div className='px-4 pb-4'>
//                       <div className='flex justify-between mb-2'>
//                         <span className='text-xs text-slate-600'>₹{priceRange[0]}</span>
//                         <span className='text-xs text-slate-600'>₹{priceRange[1]}</span>
//                       </div>
//                       <div className='space-y-2'>
//                         <input
//                           type='range'
//                           min='0'
//                           max={maxPrice}
//                           value={priceRange[0]}
//                           onChange={(e) => handlePriceRangeChange(e, 0)}
//                           className='w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600'
//                         />
//                         <input
//                           type='range'
//                           min='0'
//                           max={maxPrice}
//                           value={priceRange[1]}
//                           onChange={(e) => handlePriceRangeChange(e, 1)}
//                           className='w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600'
//                         />
//                       </div>
//                       <button
//                         onClick={applyPriceFilter}
//                         className='w-full mt-3 bg-red-600 text-white py-2 rounded text-sm font-semibold hover:bg-red-700'
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Screen Size Section (Only for TV) */}
//                 {hasScreenSizeFilter && availableScreenSizes.length > 0 && (
//                   <div className='border-b'>
//                     <button
//                       onClick={() => setIsScreenSizeOpen(!isScreenSizeOpen)}
//                       className='flex justify-between items-center w-full p-4 hover:bg-slate-50'
//                     >
//                       <span className='font-medium text-sm'>Screen Size</span>
//                       <svg
//                         className={`w-5 h-5 transition-transform ${isScreenSizeOpen ? 'rotate-180' : ''}`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </button>
//                     {isScreenSizeOpen && (
//                       <div className='px-4 pb-4 space-y-2 max-h-[200px] overflow-y-auto'>
//                         {availableScreenSizes.map((size) => (
//                           <label 
//                             key={size}
//                             className='flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer'
//                           >
//                             <input
//                               type='checkbox'
//                               checked={selectScreenSize[size] || false}
//                               value={size}
//                               onChange={handleSelectScreenSize}
//                               className='w-4 h-4 accent-red-600'
//                             />
//                             <span className='text-sm'>{size}</span>
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main className='flex-1'>
//             {/* Header with Results Count and Sort */}
//             <div className='hidden lg:flex justify-between items-center mb-4 bg-white border rounded-lg p-4'>
//               <p className='text-slate-600'>
//                 Showing <span className='font-semibold text-slate-900'>{data.length}</span> results
//               </p>

//               <div className='flex items-center gap-2'>
//                 <span className='text-sm text-slate-600'>Sort by</span>
//                 <select
//                   className='border border-brand-productCardBorder rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500'
//                   value={sortBy}
//                   onChange={handleOnChangeSortBy}
//                 >
//                   <option value=''>Price - Low to High</option>
//                   <option value='asc'>Price: Low to High</option>
//                   <option value='dsc'>Price: High to Low</option>
//                 </select>
//               </div>
//             </div>

//             {/* Products Grid */}
//             <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
//               {loading ? (
//                 Array.from({ length: 8 }).map((_, index) => (
//                   <VerticalCard key={index} loading={true} />
//                 ))
//               ) : data.length > 0 ? (
//                 data.map((product) => (
//                   <VerticalCard 
//                     key={product._id} 
//                     product={product}
//                     actionSlot={
//                       product?.isHidden || product?.availability === 0 ? (
//                         <button 
//                           className='w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold'
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/product/${product._id}`);
//                           }}
//                         >
//                           Enquire Now
//                         </button>
//                       ) : (
//                         <button 
//                           className='w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold'
//                           onClick={(e) => handleAddToCart(e, product._id)}
//                         >
//                           View Product
//                         </button>
//                       )
//                     }
//                   />
//                 ))
//               ) : (
//                 <div className="col-span-full text-center py-20">
//                   <svg
//                     className='mx-auto h-24 w-24 text-brand-productCardBorder mb-4'
//                     fill='none'
//                     viewBox='0 0 24 24'
//                     stroke='currentColor'
//                   >
//                     <path
//                       strokeLinecap='round'
//                       strokeLinejoin='round'
//                       strokeWidth={1.5}
//                       d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
//                     />
//                   </svg>
//                   <p className="text-slate-500 text-lg">
//                     {validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k])
//                       ? "No products found for this category"
//                       : "No products found for the selected filters"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryProduct;

// import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VerticalCard from '../components/VerticalCard';
// import SummaryApi from '../common';
// import Context from '../context';
// import addToCart from '../helpers/addToCart';

// const CategoryProduct = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [childCategories, setChildCategories] = useState([]);
//   const [selectCategory, setSelectCategory] = useState({});
//   const [sortBy, setSortBy] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [offerPosterIndex, setOfferPosterIndex] = useState(0);
//   const [initialLoad, setInitialLoad] = useState(true);

//   // Filter section toggle states
//   const [isCategoryOpen, setIsCategoryOpen] = useState(true);
//   const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
//   const [isScreenSizeOpen, setIsScreenSizeOpen] = useState(true);

//   // Price range state
//   const [priceRange, setPriceRange] = useState([0, 100000]);
//   const [maxPrice, setMaxPrice] = useState(100000);
//   const [minPrice, setMinPrice] = useState(0);

//   // Screen size state
//   const [selectScreenSize, setSelectScreenSize] = useState({});
//   const [availableScreenSizes, setAvailableScreenSizes] = useState([]);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { fetchUserAddToCart } = useContext(Context);

//   // Parse URL parameters
//   const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
//   const urlCategoryListingArray = useMemo(() => urlSearch.getAll("category"), [urlSearch]);
//   const urlParentCategory = useMemo(() => urlSearch.get("parentCategory"), [urlSearch]);

//   const validParentCategory = useMemo(() => 
//     urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '',
//     [urlParentCategory]
//   );

//   // Check if category has screen sizes (like TV)
//   const hasScreenSizeFilter = useMemo(() => {
//     if (!validParentCategory) return false;
//     const tvCategories = ['tv', 'television', 'smart tv'];
//     return tvCategories.some(cat => 
//       validParentCategory.toLowerCase().includes(cat)
//     );
//   }, [validParentCategory]);

//   // Fetch data function
//   const fetchData = useCallback(async (categories = [], screenSizes = [], priceRng = null) => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.filterProduct.url, {
//         method: SummaryApi.filterProduct.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({
//           category: categories,
//           parentCategory: validParentCategory || undefined,
//           screenSize: screenSizes.length > 0 ? screenSizes : undefined,
//           minPrice: priceRng ? priceRng[0] : undefined,
//           maxPrice: priceRng ? priceRng[1] : undefined
//         })
//       });
//       const dataResponse = await response.json();

//       if (dataResponse.data?.length === 0) {
//         setData([]);
//       } else {
//         const products = dataResponse?.data || [];
//         setData(products);

//         // Calculate max and min price from products
//         if (products.length > 0) {
//           const prices = products.map(p => p.sellingPrice || 0);
//           const max = Math.max(...prices);
//           const min = Math.min(...prices);
//           setMaxPrice(Math.ceil(max / 1000) * 1000);
//           setMinPrice(Math.floor(min / 1000) * 1000);
//           if (!priceRng) {
//             setPriceRange([Math.floor(min / 1000) * 1000, Math.ceil(max / 1000) * 1000]);
//           }
//         }

//         // Extract unique screen sizes if applicable
//         if (hasScreenSizeFilter) {
//           const sizes = [...new Set(products
//             .map(p => p.screenSize)
//             .filter(Boolean)
//           )].sort((a, b) => {
//             const numA = parseInt(a);
//             const numB = parseInt(b);
//             return numA - numB;
//           });
//           setAvailableScreenSizes(sizes);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [validParentCategory, hasScreenSizeFilter]);

//   // Restore filters from URL on mount
//   useEffect(() => {
//     if (urlCategoryListingArray.length > 0) {
//       const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
//         acc[el] = true;
//         return acc;
//       }, {});
//       setSelectCategory(restoredCategories);
//     } else {
//       setSelectCategory({});
//     }
//   }, [location.search, urlCategoryListingArray]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(SummaryApi.getActiveProductCategory.url);
//         const data = await response.json();

//         if (data.success) {
//           const filteredCategories = data.categories.filter(category => category.productCount > 0);

//           if (validParentCategory) {
//             const normalizedParentCategory = validParentCategory.toLowerCase().trim();
//             const children = filteredCategories.filter(category =>
//               category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
//             );
//             setChildCategories(children);

//             const childCategoryValues = children.map(child => child.value);
//             await fetchData(childCategoryValues);
//           } else {
//             setChildCategories(filteredCategories);
//             if (!initialLoad) {
//               await fetchData([]);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setData([]);
//       } finally {
//         setInitialLoad(false);
//       }
//     };

//     fetchCategories();
//   }, [validParentCategory, fetchData, initialLoad]);

//   // Update URL and fetch data when filters change
//   useEffect(() => {
//     if (validParentCategory && initialLoad) return;

//     const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
//     const selectedScreenSizes = Object.keys(selectScreenSize).filter(size => selectScreenSize[size]);

//     const urlParams = new URLSearchParams();

//     selectedCategories.forEach(category => urlParams.append("category", category));
//     if (validParentCategory) urlParams.append("parentCategory", validParentCategory);

//     navigate("/product-category?" + urlParams.toString(), { replace: true });

//     if (validParentCategory) {
//       if (selectedCategories.length > 0) {
//         fetchData(selectedCategories, selectedScreenSizes, priceRange);
//       } else if (childCategories.length > 0) {
//         const childCategoryValues = childCategories.map(child => child.value);
//         fetchData(childCategoryValues, selectedScreenSizes, priceRange);
//       }
//     } else {
//       fetchData(
//         selectedCategories.length > 0 ? selectedCategories : [], 
//         selectedScreenSizes,
//         priceRange
//       );
//     }
//   }, [selectCategory, selectScreenSize, validParentCategory, childCategories, initialLoad, fetchData, navigate]);

//   // Handle category selection
//   const handleSelectCategory = useCallback((e) => {
//     const { value, checked } = e.target;
//     setSelectCategory(prev => ({ ...prev, [value]: checked }));
//   }, []);

//   // Handle screen size selection
//   const handleSelectScreenSize = useCallback((e) => {
//     const { value, checked } = e.target;
//     setSelectScreenSize(prev => ({ ...prev, [value]: checked }));
//   }, []);

//   // Handle price range change with auto-apply
//   const handlePriceRangeChange = useCallback((e) => {
//     const value = parseInt(e.target.value);
//     setPriceRange([minPrice, value]);

//     // Auto-apply filter
//     const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
//     const selectedScreenSizes = Object.keys(selectScreenSize).filter(size => selectScreenSize[size]);

//     if (validParentCategory) {
//       if (selectedCategories.length > 0) {
//         fetchData(selectedCategories, selectedScreenSizes, [minPrice, value]);
//       } else if (childCategories.length > 0) {
//         const childCategoryValues = childCategories.map(child => child.value);
//         fetchData(childCategoryValues, selectedScreenSizes, [minPrice, value]);
//       }
//     } else {
//       fetchData(
//         selectedCategories.length > 0 ? selectedCategories : [],
//         selectedScreenSizes,
//         [minPrice, value]
//       );
//     }
//   }, [minPrice, selectCategory, selectScreenSize, validParentCategory, childCategories, fetchData]);

//   // Handle sort change
//   const handleOnChangeSortBy = useCallback((e) => {
//     const { value } = e.target;
//     setSortBy(value);
//     setData(prev => {
//       const sortedData = [...prev].sort((a, b) =>
//         value === 'asc' ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
//       );
//       return sortedData;
//     });
//   }, []);

//   // Selected category offer posters
//   const selectedCategoryOfferPosters = useMemo(() => {
//     if (childCategories.length === 0) return [];

//     const allPosters = childCategories.filter(c => c.offerPoster?.image);

//     if (validParentCategory && Object.keys(selectCategory).length === 0) {
//       return allPosters;
//     }

//     const selectedValues = Object.keys(selectCategory).filter(k => selectCategory[k]);
//     return selectedValues.length > 0
//       ? allPosters.filter(c => selectedValues.includes(c.value))
//       : allPosters;
//   }, [childCategories, selectCategory, validParentCategory]);

//   // Reset poster index when posters change
//   useEffect(() => {
//     setOfferPosterIndex(0);
//   }, [selectedCategoryOfferPosters.length]);

//   // Auto-rotate offer posters
//   useEffect(() => {
//     if (selectedCategoryOfferPosters.length > 1) {
//       const interval = setInterval(() => {
//         setOfferPosterIndex(prev => (prev + 1) % selectedCategoryOfferPosters.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [selectedCategoryOfferPosters.length]);

//   // Handle Add to Cart
//   const handleAddToCart = useCallback(async (e, productId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       await addToCart(e, productId);
//       fetchUserAddToCart();
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   }, [fetchUserAddToCart]);

//   // Count selected filters
//   const selectedCount = Object.values(selectCategory).filter(Boolean).length + 
//                         Object.values(selectScreenSize).filter(Boolean).length;

//   // Reset all filters
//   const resetAllFilters = () => {
//     setSelectCategory({});
//     setSelectScreenSize({});
//     setPriceRange([minPrice, maxPrice]);

//     // Refetch with no filters
//     if (validParentCategory && childCategories.length > 0) {
//       const childCategoryValues = childCategories.map(child => child.value);
//       fetchData(childCategoryValues, [], null);
//     } else {
//       fetchData([], [], null);
//     }
//   };

//   return (
//     <div className='min-h-screen bg-white'>
//       {/* Top Banner Poster - Full Width */}
//       {selectedCategoryOfferPosters.length > 0 && (
//         <div className='w-full mb-4'>
//           <div className='relative w-full h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden'>
//             {selectedCategoryOfferPosters.map((category, index) => (
//               <div 
//                 key={category.value} 
//                 className={`absolute inset-0 transition-opacity duration-500 ${
//                   index === offerPosterIndex ? 'opacity-100' : 'opacity-0'
//                 }`}
//               >
//                 <img
//                   src={category.offerPoster.image}
//                   alt={category.label}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Carousel Dots */}
//           {selectedCategoryOfferPosters.length > 1 && (
//             <div className="flex justify-center items-center space-x-2 mt-4">
//               {selectedCategoryOfferPosters.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setOfferPosterIndex(index)}
//                   className={`h-2 rounded-full transition-all duration-300 ${
//                     offerPosterIndex === index ? 'bg-red-600 w-8' : 'bg-gray-300 w-2'
//                   }`}
//                   aria-label={`Go to slide ${index + 1}`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Mobile Header */}
//       <div className='lg:hidden sticky top-0 z-10 bg-white border-b'>
//         <div className='flex justify-between items-center p-4'>
//           <div className='flex items-center gap-2'>
//             <span className='text-sm text-slate-600'>Showing {data.length} results</span>
//           </div>

//           <div className='flex items-center gap-2'>
//             <select
//               className='border border-brand-productCardBorder rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
//               value={sortBy}
//               onChange={handleOnChangeSortBy}
//             >
//               <option value=''>Sort By</option>
//               <option value='asc'>Price: Low to High</option>
//               <option value='dsc'>Price: High to Low</option>
//             </select>

//             <button
//               className='flex items-center gap-2 border border-brand-productCardBorder rounded px-3 py-1.5 text-sm hover:bg-slate-50'
//               onClick={() => setShowModal(true)}
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//               </svg>
//               Filter
//               {selectedCount > 0 && (
//                 <span className='bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
//                   {selectedCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Filter Modal */}
//       {showModal && (
//         <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end' onClick={() => setShowModal(false)}>
//           <div className='bg-white rounded-t-2xl w-full max-h-[85vh] overflow-hidden' onClick={(e) => e.stopPropagation()}>
//             <div className='p-4 border-b flex justify-between items-center sticky top-0 bg-white'>
//               <h3 className='text-lg font-semibold'>Filters</h3>
//               <button onClick={() => setShowModal(false)} className='text-slate-400 hover:text-slate-600'>
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className='overflow-y-auto' style={{ maxHeight: 'calc(85vh - 180px)' }}>
//               <div className='p-4'>
//                 {/* Category Section */}
//                 <div className='mb-4'>
//                   <button
//                     onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                     className='flex justify-between items-center w-full py-2 text-left font-medium'
//                   >
//                     <span>Category</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {isCategoryOpen && (
//                     <div className='space-y-2 mt-2'>
//                       {childCategories.map((category) => (
//                         <label 
//                           key={category.value}
//                           className='flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer'
//                         >
//                           <input
//                             type='checkbox'
//                             checked={selectCategory[category.value] || false}
//                             value={category.value}
//                             onChange={handleSelectCategory}
//                             className='w-4 h-4 accent-red-600'
//                           />
//                           <span className='text-sm'>{category.label}</span>
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Price Range Section */}
//                 <div className='mb-4 border-t pt-4'>
//                   <button
//                     onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
//                     className='flex justify-between items-center w-full py-2 text-left font-medium'
//                   >
//                     <span>Price Range</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {isPriceRangeOpen && (
//                     <div className='mt-4 px-2'>
//                       <div className='flex justify-between mb-2'>
//                         <span className='text-sm font-medium'>₹{priceRange[0]}</span>
//                         <span className='text-sm font-medium'>₹{priceRange[1]}</span>
//                       </div>
//                       <input
//                         type='range'
//                         min={minPrice}
//                         max={maxPrice}
//                         value={priceRange[1]}
//                         onChange={handlePriceRangeChange}
//                         className='w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600'
//                         style={{
//                           background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%, #fecaca ${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%, #fecaca 100%)`
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Screen Size Section (Only for TV) */}
//                 {hasScreenSizeFilter && availableScreenSizes.length > 0 && (
//                   <div className='mb-4 border-t pt-4'>
//                     <button
//                       onClick={() => setIsScreenSizeOpen(!isScreenSizeOpen)}
//                       className='flex justify-between items-center w-full py-2 text-left font-medium'
//                     >
//                       <span>Screen Size</span>
//                       <svg
//                         className={`w-5 h-5 transition-transform ${isScreenSizeOpen ? 'rotate-180' : ''}`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </button>
//                     {isScreenSizeOpen && (
//                       <div className='space-y-2 mt-2'>
//                         {availableScreenSizes.map((size) => (
//                           <label 
//                             key={size}
//                             className='flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer'
//                           >
//                             <input
//                               type='checkbox'
//                               checked={selectScreenSize[size] || false}
//                               value={size}
//                               onChange={handleSelectScreenSize}
//                               className='w-4 h-4 accent-red-600'
//                             />
//                             <span className='text-sm'>{size}</span>
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className='p-4 border-t flex gap-2 bg-white'>
//               <button
//                 className='flex-1 bg-slate-100 text-slate-700 px-4 py-3 rounded font-semibold hover:bg-slate-200'
//                 onClick={() => {
//                   resetAllFilters();
//                   setShowModal(false);
//                 }}
//               >
//                 Clear All
//               </button>
//               <button
//                 className='flex-1 bg-red-600 text-white px-4 py-3 rounded font-semibold hover:bg-red-700'
//                 onClick={() => setShowModal(false)}
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Container */}
//       <div className='mx-auto px-4 lg:px-12 py-4'>
//         <div className='flex gap-4 relative'>
//           {/* Desktop Sidebar - Fixed with independent scroll */}
//           <aside className="hidden lg:block w-[260px] sticky top-4 self-start" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
//             <div className="bg-white border rounded-lg flex flex-col h-full">
//               {/* Filter Header - Fixed */}
//               <div className='p-4 border-b flex justify-between items-center flex-shrink-0'>
//                 <div className='flex items-center gap-2'>
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                   </svg>
//                   <h3 className='font-semibold'>Filter</h3>
//                 </div>
//               </div>

//               {/* Scrollable Filter Content */}
//               <div className='overflow-y-auto flex-1'>
//                 {/* Category Section */}
//                 <div className='border-b'>
//                   <button
//                     onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                     className='flex justify-between items-center w-full p-4 hover:bg-slate-50'
//                   >
//                     <span className='font-medium text-sm'>Category</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {isCategoryOpen && (
//                     <div className='px-4 pb-4 space-y-2'>
//                       {childCategories.map((category) => (
//                         <label 
//                           key={category.value}
//                           className='flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer'
//                         >
//                           <input
//                             type='checkbox'
//                             checked={selectCategory[category.value] || false}
//                             value={category.value}
//                             onChange={handleSelectCategory}
//                             className='w-4 h-4 accent-red-600'
//                           />
//                           <span className='text-sm'>{category.label}</span>
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Price Range Section */}
//                 <div className='border-b'>
//                   <button
//                     onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
//                     className='flex justify-between items-center w-full p-4 hover:bg-slate-50'
//                   >
//                     <span className='font-medium text-sm'>Price Range</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {isPriceRangeOpen && (
//                     <div className='px-4 pb-4'>
//                       <div className='flex justify-between mb-3'>
//                         <span className='text-xs text-slate-600'>₹{priceRange[0]}</span>
//                         <span className='text-xs text-slate-900 font-semibold'>₹{priceRange[1]}</span>
//                       </div>
//                       <input
//                         type='range'
//                         min={minPrice}
//                         max={maxPrice}
//                         value={priceRange[1]}
//                         onChange={handlePriceRangeChange}
//                         className='w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600'
//                         style={{
//                           background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%, #fecaca ${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%, #fecaca 100%)`
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Screen Size Section (Only for TV) */}
//                 {hasScreenSizeFilter && availableScreenSizes.length > 0 && (
//                   <div className='border-b'>
//                     <button
//                       onClick={() => setIsScreenSizeOpen(!isScreenSizeOpen)}
//                       className='flex justify-between items-center w-full p-4 hover:bg-slate-50'
//                     >
//                       <span className='font-medium text-sm'>Screen Size</span>
//                       <svg
//                         className={`w-5 h-5 transition-transform ${isScreenSizeOpen ? 'rotate-180' : ''}`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </button>
//                     {isScreenSizeOpen && (
//                       <div className='px-4 pb-4 space-y-2'>
//                         {availableScreenSizes.map((size) => (
//                           <label 
//                             key={size}
//                             className='flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer'
//                           >
//                             <input
//                               type='checkbox'
//                               checked={selectScreenSize[size] || false}
//                               value={size}
//                               onChange={handleSelectScreenSize}
//                               className='w-4 h-4 accent-red-600'
//                             />
//                             <span className='text-sm'>{size}</span>
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Reset Filter Button - Fixed at bottom */}
//               <div className='p-4 border-t flex-shrink-0'>
//                 <button
//                   onClick={resetAllFilters}
//                   className='w-full bg-white border-2 border-red-600 text-red-600 px-4 py-2 rounded font-semibold hover:bg-red-50 transition-colors'
//                 >
//                   Reset Filter
//                 </button>
//               </div>
//             </div>
//           </aside>

//           {/* Main Content - Independent scroll */}
//           <main className='flex-1 min-w-0'>
//             {/* Header with Results Count and Sort */}
//             <div className='hidden lg:flex justify-between items-center mb-4 bg-white border rounded-lg p-4'>
//               <p className='text-slate-600'>
//                 Showing <span className='font-semibold text-slate-900'>{data.length}</span> results
//               </p>

//               <div className='flex items-center gap-2'>
//                 <span className='text-sm text-slate-600'>Sort by</span>
//                 <select
//                   className='border border-brand-productCardBorder rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500'
//                   value={sortBy}
//                   onChange={handleOnChangeSortBy}
//                 >
//                   <option value=''>Price - Low to High</option>
//                   <option value='asc'>Price: Low to High</option>
//                   <option value='dsc'>Price: High to Low</option>
//                 </select>
//               </div>
//             </div>

//             {/* Products Grid */}
//             <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
//               {loading ? (
//                 Array.from({ length: 8 }).map((_, index) => (
//                   <VerticalCard key={index} loading={true} />
//                 ))
//               ) : data.length > 0 ? (
//                 data.map((product) => (
//                   <VerticalCard 
//                     key={product._id} 
//                     product={product}
//                     actionSlot={
//                       product?.isHidden || product?.availability === 0 ? (
//                         <button 
//                           className='w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold'
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/product/${product._id}`);
//                           }}
//                         >
//                           View Product
//                         </button>
//                       ) : (
//                         <button 
//                           className='w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-semibold'
//                           onClick={(e) => handleAddToCart(e, product._id)}
//                         >
//                           Add to Cart
//                         </button>
//                       )
//                     }
//                   />
//                 ))
//               ) : (
//                 <div className="col-span-full text-center py-20">
//                   <svg
//                     className='mx-auto h-24 w-24 text-brand-productCardBorder mb-4'
//                     fill='none'
//                     viewBox='0 0 24 24'
//                     stroke='currentColor'
//                   >
//                     <path
//                       strokeLinecap='round'
//                       strokeLinejoin='round'
//                       strokeWidth={1.5}
//                       d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
//                     />
//                   </svg>
//                   <p className="text-slate-500 text-lg">
//                     {validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k])
//                       ? "No products found for this category"
//                       : "No products found for the selected filters"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategoryProduct;

// import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VerticalCard from '../components/VerticalCard';
// import SummaryApi from '../common';
// import Context from '../context';
// import addToCart from '../helpers/addToCart';
// import { SlidersHorizontal } from 'lucide-react';
// import SelectDropdown from '../customStyles/SelectDropdown';
// import offer1 from '../assest/offer/Offer1.jpg';
// import offer2 from '../assest/offer/Offer2.jpg';
// import offer3 from '../assest/offer/Offer3.jpg';

// const CategoryProduct = () => {
//   const [data, setData] = useState([]);
//   const [allProducts, setAllProducts] = useState([]); // Store all products for frontend filtering
//   const [loading, setLoading] = useState(false);
//   const [childCategories, setChildCategories] = useState([]);
//   const [selectCategory, setSelectCategory] = useState({});
//   const [sortBy, setSortBy] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [offerPosterIndex, setOfferPosterIndex] = useState(0);
//   const [initialLoad, setInitialLoad] = useState(true);
//   const [isFilterVisible, setIsFilterVisible] = useState(true); // Toggle filter visibility
//   const USE_TEMP_BANNER = true;

//   const tempOfferPosters = [
//   { id: 1, image: offer1 },
//   { id: 2, image: offer2 },
//   { id: 3, image: offer3 },
//   ];
//   useEffect(() => {
//     if (!USE_TEMP_BANNER || tempOfferPosters.length === 0) return;

//     const timer = setInterval(() => {
//       setOfferPosterIndex((prev) => (prev + 1) % tempOfferPosters.length);
//     }, 4000);

//     return () => clearInterval(timer);
//   }, [USE_TEMP_BANNER, tempOfferPosters.length]);



//   // Filter section toggle states
//   const [isCategoryOpen, setIsCategoryOpen] = useState(true);
//   const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
//   const [isScreenSizeOpen, setIsScreenSizeOpen] = useState(true);

//   // Price range state
//   const [priceRange, setPriceRange] = useState([0, 100000]);
//   const [maxPrice, setMaxPrice] = useState(100000);
//   const [minPrice, setMinPrice] = useState(0);

//   // Screen size state
//   const [selectScreenSize, setSelectScreenSize] = useState({});
//   const [availableScreenSizes, setAvailableScreenSizes] = useState([]);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { fetchUserAddToCart } = useContext(Context);

//   const sortOptions = [
//   { value: "asc", label: "Price: Low to High" },
//   { value: "dsc", label: "Price: High to Low" },
//   { value: "name-asc", label: "Name: A to Z" },
//   { value: "name-desc", label: "Name: Z to A" },
//   ];

//   // Parse URL parameters
//   const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
//   const urlCategoryListingArray = useMemo(() => urlSearch.getAll("category"), [urlSearch]);
//   const urlParentCategory = useMemo(() => urlSearch.get("parentCategory"), [urlSearch]);

//   const validParentCategory = useMemo(() =>
//     urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '',
//     [urlParentCategory]
//   );

//   // Check if category has screen sizes (like TV)
//   const hasScreenSizeFilter = useMemo(() => {
//     if (!validParentCategory) return false;
//     const tvCategories = ['tv', 'television', 'smart tv'];
//     return tvCategories.some(cat =>
//       validParentCategory.toLowerCase().includes(cat)
//     );
//   }, [validParentCategory]);

//   // Fetch data function
//   const fetchData = useCallback(async (categories = [], screenSizes = []) => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.filterProduct.url, {
//         method: SummaryApi.filterProduct.method,
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify({
//           category: categories,
//           parentCategory: validParentCategory || undefined,
//           screenSize: screenSizes.length > 0 ? screenSizes : undefined
//         })
//       });
//       const dataResponse = await response.json();

//       if (dataResponse.data?.length === 0) {
//         setData([]);
//         setAllProducts([]);
//       } else {
//         const products = dataResponse?.data || [];
//         setAllProducts(products); // Store all products
//         setData(products);

//         // Calculate max and min price from products
//         if (products.length > 0) {
//           const prices = products.map(p => p.sellingPrice || 0);
//           const max = Math.max(...prices);
//           const min = Math.min(...prices);
//           setMaxPrice(Math.ceil(max / 1000) * 1000);
//           setMinPrice(Math.floor(min / 1000) * 1000);
//           setPriceRange([Math.floor(min / 1000) * 1000, Math.ceil(max / 1000) * 1000]);
//         }

//         // Extract unique screen sizes if applicable
//         if (hasScreenSizeFilter) {
//           const sizes = [...new Set(products
//             .map(p => p.screenSize)
//             .filter(Boolean)
//           )].sort((a, b) => {
//             const numA = parseInt(a);
//             const numB = parseInt(b);
//             return numA - numB;
//           });
//           setAvailableScreenSizes(sizes);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//       setAllProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [validParentCategory, hasScreenSizeFilter]);

//   // Frontend price filter
//   useEffect(() => {
//     const filteredProducts = allProducts.filter(product => {
//       const price = product.sellingPrice || 0;
//       return price >= priceRange[0] && price <= priceRange[1];
//     });
//     setData(filteredProducts);
//   }, [priceRange, allProducts]);

//   // Restore filters from URL on mount
//   useEffect(() => {
//     if (urlCategoryListingArray.length > 0) {
//       const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
//         acc[el] = true;
//         return acc;
//       }, {});
//       setSelectCategory(restoredCategories);
//     } else {
//       setSelectCategory({});
//     }
//   }, [location.search, urlCategoryListingArray]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(SummaryApi.getActiveProductCategory.url);
//         const data = await response.json();

//         if (data.success) {
//           const filteredCategories = data.categories.filter(category => category.productCount > 0);

//           if (validParentCategory) {
//             const normalizedParentCategory = validParentCategory.toLowerCase().trim();
//             const children = filteredCategories.filter(category =>
//               category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
//             );
//             setChildCategories(children);

//             const childCategoryValues = children.map(child => child.value);
//             await fetchData(childCategoryValues);
//           } else {
//             setChildCategories(filteredCategories);
//             if (!initialLoad) {
//               await fetchData([]);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setData([]);
//       } finally {
//         setInitialLoad(false);
//       }
//     };

//     fetchCategories();
//   }, [validParentCategory, fetchData, initialLoad]);

//   // Update URL and fetch data when filters change
//   useEffect(() => {
//     if (validParentCategory && initialLoad) return;

//     const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
//     const selectedScreenSizes = Object.keys(selectScreenSize).filter(size => selectScreenSize[size]);

//     const urlParams = new URLSearchParams();

//     selectedCategories.forEach(category => urlParams.append("category", category));
//     if (validParentCategory) urlParams.append("parentCategory", validParentCategory);

//     navigate("/product-category?" + urlParams.toString(), { replace: true });

//     if (validParentCategory) {
//       if (selectedCategories.length > 0) {
//         fetchData(selectedCategories, selectedScreenSizes);
//       } else if (childCategories.length > 0) {
//         const childCategoryValues = childCategories.map(child => child.value);
//         fetchData(childCategoryValues, selectedScreenSizes);
//       }
//     } else {
//       fetchData(
//         selectedCategories.length > 0 ? selectedCategories : [],
//         selectedScreenSizes
//       );
//     }
//   }, [selectCategory, selectScreenSize, validParentCategory, childCategories, initialLoad, fetchData, navigate]);

//   // Handle category selection
//   const handleSelectCategory = useCallback((e) => {
//     const { value, checked } = e.target;
//     setSelectCategory(prev => ({ ...prev, [value]: checked }));
//   }, []);

//   // Handle screen size selection
//   const handleSelectScreenSize = useCallback((e) => {
//     const { value, checked } = e.target;
//     setSelectScreenSize(prev => ({ ...prev, [value]: checked }));
//   }, []);

//   const handleMinPriceChange = (e) => {
//     const value = Math.min(Number(e.target.value), priceRange[1] - 100);
//     setPriceRange([value, priceRange[1]]);
//   };

//   const handleMaxPriceChange = (e) => {
//     const value = Math.max(Number(e.target.value), priceRange[0] + 100);
//     setPriceRange([priceRange[0], value]);
//   };


//   // Handle sort change
// const handleOnChangeSortBy = useCallback((value) => {
//   setSortBy(value);

//   setData(prev => {
//     if (!value) return prev;

//     const sortedData = [...prev].sort((a, b) => {
//       if (value === "asc") return a.sellingPrice - b.sellingPrice;
//       if (value === "dsc") return b.sellingPrice - a.sellingPrice;
//       if (value === "name-asc") return a.productName.localeCompare(b.productName);
//       if (value === "name-desc") return b.productName.localeCompare(a.productName);
//       return 0;
//     });

//     return sortedData;
//   });
// }, []);


//   // Selected category offer posters
//   const selectedCategoryOfferPosters = useMemo(() => {
//     if (childCategories.length === 0) return [];

//     const allPosters = childCategories.filter(c => c.offerPoster?.image);

//     if (validParentCategory && Object.keys(selectCategory).length === 0) {
//       return allPosters;
//     }

//     const selectedValues = Object.keys(selectCategory).filter(k => selectCategory[k]);
//     return selectedValues.length > 0
//       ? allPosters.filter(c => selectedValues.includes(c.value))
//       : allPosters;
//   }, [childCategories, selectCategory, validParentCategory]);

//   // Reset poster index when posters change
// useEffect(() => {
//   setOfferPosterIndex(0);
// }, [USE_TEMP_BANNER]);


//   // Auto-rotate offer posters
// useEffect(() => {
//   if (USE_TEMP_BANNER) return; // ⛔ stop category slider

//   if (selectedCategoryOfferPosters.length > 1) {
//     const interval = setInterval(() => {
//       setOfferPosterIndex((prev) =>
//         (prev + 1) % selectedCategoryOfferPosters.length
//       );
//     }, 4000);

//     return () => clearInterval(interval);
//   }
// }, [USE_TEMP_BANNER, selectedCategoryOfferPosters.length]);



//   // Handle Add to Cart
//   const handleAddToCart = useCallback(async (e, productId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       await addToCart(e, productId);
//       fetchUserAddToCart();
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   }, [fetchUserAddToCart]);

//   // Count selected filters
//   const selectedCount = Object.values(selectCategory).filter(Boolean).length +
//     Object.values(selectScreenSize).filter(Boolean).length;

//   // Reset all filters
//   const resetAllFilters = () => {
//     setSelectCategory({});
//     setSelectScreenSize({});
//     setPriceRange([minPrice, maxPrice]);

//     // Refetch with no filters
//     if (validParentCategory && childCategories.length > 0) {
//       const childCategoryValues = childCategories.map(child => child.value);
//       fetchData(childCategoryValues, []);
//     } else {
//       fetchData([], []);
//     }
//   };

//   return (
//     <div className='min-h-screen bg-white'>
//       {/* Top Banner Poster - Full Width */}
// {/* {selectedCategoryOfferPosters.length > 0 && (
//   <div className="relative w-full mb-6">

//     <div className="relative w-full h-[200px] sm:h-[240px] md:h-[400px] overflow-hidden">

//       <div
//         className="flex h-full transition-transform duration-700 ease-in-out"
//         style={{
//           width: `${selectedCategoryOfferPosters.length * 100}%`,
//           transform: `translateX(-${offerPosterIndex * (100 / selectedCategoryOfferPosters.length)}%)`
//         }}
//       >
//         {selectedCategoryOfferPosters.map((category) => (
//           <div
//             key={category.value}
//             className="flex-shrink-0"
//             style={{ width: `${100 / selectedCategoryOfferPosters.length}%` }}
//           >
//             <img
//               src={category.offerPoster.image}
//               alt={category.label}
//               className="w-full h-full object-cover md:object-contain"
//             />
//           </div>
//         ))}
//       </div>

//       {selectedCategoryOfferPosters.length > 1 && (
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
//           {selectedCategoryOfferPosters.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setOfferPosterIndex(index)}
//               className="relative w-6 md:w-8 lg:w-10 h-[3px] bg-white overflow-hidden"
//             >
//               {offerPosterIndex === index && (
//                 <div className="absolute inset-0 bg-brand-primary animate-progress" />
//               )}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   </div>
// )} */}

// {USE_TEMP_BANNER ? (
//   <div className="relative w-full mb-6">
//     <div className="relative w-full h-[200px] md:h-[350px] lg:h-[400px] xl:h-[550px] 2xl:h-[650px] overflow-hidden">

//       {/* SLIDER */}
//       <div
//         className="flex h-full transition-transform duration-700 ease-in-out"
//         style={{
//           width: `${tempOfferPosters.length * 100}%`,
//           transform: `translateX(-${offerPosterIndex * (100 / tempOfferPosters.length)}%)`,
//         }}
//       >
//         {tempOfferPosters.map((poster) => (
//           <div
//             key={poster.id}
//             className="flex-shrink-0 w-full"
//             style={{ width: `${100 / tempOfferPosters.length}%` }}
//           >
//             <img
//               src={poster.image}
//               alt="Offer Banner"
//               className="w-full h-full object-fill"
//             />
//           </div>
//         ))}
//       </div>

//       {/* INDICATORS */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
//         {tempOfferPosters.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setOfferPosterIndex(index)}
//             className="relative w-6 md:w-8 lg:w-10 h-[3px] bg-white/60 overflow-hidden"
//           >
//             {offerPosterIndex === index && (
//               <div className="absolute inset-0 bg-brand-primary animate-progress" />
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   </div>
// ) : (
//   selectedCategoryOfferPosters.length > 0 && (
//     <div className="relative w-full mb-6">
//       <div className="relative w-full h-[200px] sm:h-[240px] md:h-[400px] overflow-hidden">

//         <div
//           className="flex h-full transition-transform duration-700 ease-in-out"
//           style={{
//             width: `${selectedCategoryOfferPosters.length * 100}%`,
//             transform: `translateX(-${offerPosterIndex * (100 / selectedCategoryOfferPosters.length)}%)`
//           }}
//         >
//           {selectedCategoryOfferPosters.map((category) => (
//             <div
//               key={category.value}
//               className="flex-shrink-0"
//               style={{ width: `${100 / selectedCategoryOfferPosters.length}%` }}
//             >
//               <img
//                 src={category.offerPoster.image}
//                 alt={category.label}
//                 className="w-full h-full object-cover md:object-contain"
//               />
//             </div>
//           ))}
//         </div>

//         {/* INDICATORS */}
//         {selectedCategoryOfferPosters.length > 1 && (
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
//             {selectedCategoryOfferPosters.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setOfferPosterIndex(index)}
//                 className="relative w-6 md:w-8 lg:w-10 h-[3px] bg-white overflow-hidden"
//               >
//                 {offerPosterIndex === index && (
//                   <div className="absolute inset-0 bg-brand-primary animate-progress" />
//                 )}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// )}


//       {/* Mobile Header */}
//       <div className='lg:hidden sticky top-0 z-10 bg-white border-b'>
//         <div className='flex justify-between items-center p-4'>
//           <div className="flex items-center gap-2">
//             <span className="hidden md:block text-sm font-medium text-brand-textMuted">
//               Showing {data.length} results
//             </span>

//             <span className="block md:hidden text-sm font-medium text-brand-textMuted">
//               {data.length} results
//             </span>
//           </div>

//           <div className="flex items-center gap-2">
//           <SelectDropdown
//             value={sortBy}
//             valueKey="value"
//             labelKey="label"
//             onChange={handleOnChangeSortBy}
//             options={sortOptions}
//             placeholder="Default"
//             parentClassName="w-[190px]"
//             error={!!sortBy}
//             ChildClassName="
//               border rounded px-3 py-1.5 text-sm h-[38px]
//               bg-white
//             "
//           />
//           <button
//             className="flex items-center gap-2 border border-brand-productCardBorder rounded-md px-3 py-1.5 text-sm hover:bg-slate-50"
//             onClick={() => setShowModal(true)}
//           >
//             <SlidersHorizontal size={20} />
//             Filter
//             {selectedCount > 0 && (
//               <span className="bg-brand-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {selectedCount}
//               </span>
//             )}
//           </button>
//         </div>
//         </div>
//       </div>

//       {/* Mobile Filter Modal */}
//       {showModal && (
//         <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end' onClick={() => setShowModal(false)}>
//           <div className='bg-white rounded-t-2xl w-full max-h-[85vh] overflow-hidden' onClick={(e) => e.stopPropagation()}>
//             <div className='p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10'>
//               <h3 className='text-lg font-semibold'>Filters</h3>
//               <button onClick={() => setShowModal(false)} className=' hover:text-brand-primaryHover'>
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className='overflow-y-auto' style={{ maxHeight: 'calc(85vh - 180px)' }}>
//               <div className='p-4'>
//                 {/* Category Section */}
//                 <div className='mb-4'>
//                   <button
//                     onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                     className='flex justify-between items-center w-full py-2 text-left font-medium'
//                   >
//                     <span>Category</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {isCategoryOpen && (
//                     <div className='space-y-2 mt-2 max-h-60 overflow-y-auto'>
//                       {childCategories.map((category) => (
//                         <label className="flex items-center gap-4 py-2 cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={selectCategory[category.value] || false}
//                             onChange={handleSelectCategory}
//                             value={category.value}
//                             className="hidden"
//                           />

//                           {/* Custom round checkbox */}
//                           <span
//                             className={`w-4 h-4 flex items-center justify-center rounded-full border-2 transition-all
//                               ${selectCategory[category.value]
//                                 ? "bg-brand-primary border-brand-primary"
//                                 : "border-brand-primary"
//                               }`}
//                           >
//                             {selectCategory[category.value] && (
//                               <svg
//                                 className="w-3 h-3 text-white"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="3"
//                               >
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                               </svg>
//                             )}
//                           </span>

//                           <span className="text-[15px] leading-tight">
//                             {category.label}
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Price Range Section */}
//                 <div className='mb-4 border-t pt-4'>
//                   <button
//                     onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
//                     className='flex justify-between items-center w-full py-2 text-left font-medium'
//                   >
//                     <span>Price Range</span>
//                     <svg
//                       className={`w-5 h-5 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>
//                   {isPriceRangeOpen && (
//                     <div className="px-4 pb-6 mt-4">
//                       <div className="flex justify-between mb-3">
//                         <span className="text-sm font-medium">₹{priceRange[0]}</span>
//                         <span className="text-sm font-medium">₹{priceRange[1]}</span>
//                       </div>

//                       <div className="relative h-3">
//                         {/* Gray background track */}
//                         <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-brand-productCardImageBg rounded-full" />

//                         {/* Active red range */}
//                         <div
//                           className="absolute top-1/2 -translate-y-1/2 h-2 bg-brand-primary rounded-full"
//                           style={{
//                             left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
//                             right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
//                           }}
//                         />

//                         {/* Min handle */}
//                         <input
//                           type="range"
//                           min={minPrice}
//                           max={maxPrice}
//                           value={priceRange[0]}
//                           onChange={handleMinPriceChange}
//                           className="price-range absolute w-full appearance-none bg-transparent pointer-events-none -mt-1"
//                         />

//                         {/* Max handle */}
//                         <input
//                           type="range"
//                           min={minPrice}
//                           max={maxPrice}
//                           value={priceRange[1]}
//                           onChange={handleMaxPriceChange}
//                           className="price-range absolute w-full appearance-none bg-transparent pointer-events-none -mt-1"
//                         />
//                       </div>
//                     </div>


//                   )}
//                 </div>

//                 {/* Screen Size Section (Only for TV) */}
//                 {hasScreenSizeFilter && availableScreenSizes.length > 0 && (
//                   <div className='mb-4 border-t pt-4'>
//                     <button
//                       onClick={() => setIsScreenSizeOpen(!isScreenSizeOpen)}
//                       className='flex justify-between items-center w-full py-2 text-left font-medium'
//                     >
//                       <span>Screen Size</span>
//                       <svg
//                         className={`w-5 h-5 transition-transform ${isScreenSizeOpen ? 'rotate-180' : ''}`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </button>
//                     {isScreenSizeOpen && (
//                       <div className='space-y-2 mt-2 max-h-40 overflow-y-auto'>
//                         {availableScreenSizes.map((size) => (
//                           <label className="flex items-center gap-3 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={selectScreenSize[size] || false}
//                               onChange={handleSelectScreenSize}
//                               value={size}
//                               className="hidden"
//                             />

//                             <span
//                               className={`w-5 h-5 border-2 flex items-center justify-center ${selectScreenSize[size]
//                                   ? "bg-brand-primary border-brand-primary"
//                                   : "border-brand-primary"
//                                 }`}
//                             >
//                               {selectScreenSize[size] && (
//                                 <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
//                                   <path
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="3"
//                                     d="M5 13l4 4L19 7"
//                                   />
//                                 </svg>
//                               )}
//                             </span>

//                             <span className="text-sm">{size}</span>
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className='p-4 border-t flex gap-2 bg-white sticky bottom-0'>
//               <button
//                 className='flex-1 bg-slate-100 text-brand-textMuted px-4 py-3 rounded font-semibold hover:bg-slate-200'
//                 onClick={() => {
//                   resetAllFilters();
//                   setShowModal(false);
//                 }}
//               >
//                 Clear All
//               </button>
//               <button
//                 className='flex-1 bg-brand-primary text-white px-4 py-3 rounded font-semibold hover:bg-brand-primaryHover'
//                 onClick={() => setShowModal(false)}
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Container */}
//       <div className='mx-auto px-4 lg:px-12 py-4'>
//         <div className='flex gap-4 relative'>
//           {/* Desktop Sidebar - Fixed with independent scroll and toggle */}
//           {isFilterVisible && (
//             <aside className="hidden lg:block w-[280px] sticky top-4 self-start transition-all duration-300" style={{ height: 'calc(88vh - 2rem)' }}>
//               <div className="bg-white border border-color-brand-productCardBorder rounded-lg flex flex-col h-full">
//                 {/* Filter Header - Fixed */}
//                 <div className='p-4 flex justify-between items-center flex-shrink-0'>
//                   <div className='flex items-center gap-2'>
//                     {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                     </svg> */}
//                     <SlidersHorizontal size={20} />
//                     <h3 className='font-semibold'>Filter</h3>
//                   </div>
//                   <button
//                     onClick={() => setIsFilterVisible(false)}
//                     className='hover:text-brand-primaryHover'
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Scrollable Filter Content */}
//                 <div className='overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-brand-productCardBorder scrollbar-track-transparent px-2 py-2'>
//                   {/* Category Section */}
//                   <div className='py-1'>
//                     <button
//                       onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                       className='flex justify-between items-center w-full rounded-md p-4 bg-brand-productCardImageBg'
//                     >
//                       <span className='font-medium text-sm'>Category</span>
//                       <svg
//                         className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </button>
//                     {isCategoryOpen && (
//                       <div className='px-4 pb-4 space-y-2 max-h-80 overflow-y-auto'>
//                         {childCategories.map((category) => (
//                           <label key={category._id} className="flex items-center gap-4 py-2 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={selectCategory[category.value] || false}
//                               onChange={handleSelectCategory}
//                               value={category.value}
//                               className="hidden"
//                             />

//                             {/* Custom round checkbox */}
//                             <span
//                               className={`w-4 h-4 flex items-center justify-center rounded-full border-2 transition-all
//       ${selectCategory[category.value]
//                                   ? "bg-brand-primary border-brand-primary"
//                                   : "border-brand-primary"
//                                 }`}
//                             >
//                               {selectCategory[category.value] && (
//                                 <svg
//                                   className="w-3 h-3 text-white"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   strokeWidth="3"
//                                 >
//                                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                                 </svg>
//                               )}
//                             </span>

//                             <span className="text-[15px] leading-tight">
//                               {category.label}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Price Range Section */}
//                   <div className='py-1'>
//                     <button
//                       onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
//                       className='flex justify-between items-center w-full rounded-md p-4 bg-brand-productCardImageBg'
//                     >
//                       <span className='font-medium text-sm'>Price Range</span>
//                       <svg
//                         className={`w-5 h-5 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </button>
//                     {isPriceRangeOpen && (
//                       <div className="px-4 pb-6 mt-4">
//                         <div className="flex justify-between mb-3">
//                           <span className="text-sm font-medium">₹{priceRange[0]}</span>
//                           <span className="text-sm font-medium">₹{priceRange[1]}</span>
//                         </div>

//                         <div className="relative h-3">
//                           {/* Gray background track */}
//                           <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-brand-productCardImageBg rounded-full" />

//                           {/* Active red range */}
//                           <div
//                             className="absolute top-1/2 -translate-y-1/2 h-2 bg-brand-primary rounded-full"
//                             style={{
//                               left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
//                               right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
//                             }}
//                           />

//                           {/* Min handle */}
//                           <input
//                             type="range"
//                             min={minPrice}
//                             max={maxPrice}
//                             value={priceRange[0]}
//                             onChange={handleMinPriceChange}
//                             className="price-range absolute w-full appearance-none bg-transparent pointer-events-none -mt-1"
//                           />

//                           {/* Max handle */}
//                           <input
//                             type="range"
//                             min={minPrice}
//                             max={maxPrice}
//                             value={priceRange[1]}
//                             onChange={handleMaxPriceChange}
//                             className="price-range absolute w-full appearance-none bg-transparent pointer-events-none -mt-1"
//                           />
//                         </div>
//                       </div>


//                     )}
//                   </div>

//                   {/* Screen Size Section (Only for TV) */}
//                   {hasScreenSizeFilter && availableScreenSizes.length > 0 && (
//                     <div className='border-b'>
//                       <button
//                         onClick={() => setIsScreenSizeOpen(!isScreenSizeOpen)}
//                         className='flex justify-between items-center w-full p-4 hover:bg-slate-50'
//                       >
//                         <span className='font-medium text-sm'>Screen Size</span>
//                         <svg
//                           className={`w-5 h-5 transition-transform ${isScreenSizeOpen ? 'rotate-180' : ''}`}
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </button>
//                       {isScreenSizeOpen && (
//                         <div className='px-4 pb-4 space-y-2 max-h-60 overflow-y-auto'>
//                           {availableScreenSizes.map((size) => (
//                             <label className="flex items-center gap-3 cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 checked={selectScreenSize[size] || false}
//                                 onChange={handleSelectScreenSize}
//                                 value={size}
//                                 className="hidden"
//                               />

//                               <span
//                                 className={`w-5 h-5 border-2 flex items-center justify-center ${selectScreenSize[size]
//                                     ? "bg-brand-primary border-brand-primary"
//                                     : "border-brand-primary"
//                                   }`}
//                               >
//                                 {selectScreenSize[size] && (
//                                   <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
//                                     <path
//                                       fill="none"
//                                       stroke="currentColor"
//                                       strokeWidth="3"
//                                       d="M5 13l4 4L19 7"
//                                     />
//                                   </svg>
//                                 )}
//                               </span>

//                               <span className="text-sm">{size}</span>
//                             </label>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Reset Filter Button - Fixed at bottom */}
//                 <div className='p-4 flex-shrink-0'>
//                   <button
//                     onClick={resetAllFilters}
//                     className='w-full bg-white border border-brand-primary text-brand-primary px-4 py-2 rounded font-semibold hover:bg-brand-primary hover:text-white transition-colors'
//                   >
//                     Reset Filter
//                   </button>
//                 </div>
//               </div>
//             </aside>
//           )}

//           {/* Main Content - Independent scroll */}
//           <main className={`flex-1 min-w-0 transition-all duration-300 ${!isFilterVisible ? 'ml-0' : ''}`}>
//             {/* Header with Results Count and Sort */}
//             <div className='hidden lg:flex justify-between items-center mb-4 pb-4'>
//               <div className='flex items-center gap-4'>
//                 {!isFilterVisible && (
//                   <button
//                     onClick={() => setIsFilterVisible(true)}
//                     className='flex items-center gap-2 border border-brand-productCardBorder rounded px-3 py-2 text-sm hover:bg-slate-50'
//                   >
//                     <SlidersHorizontal size={20} />
//                     Show Filters
//                   </button>
//                 )}
//                 <p className='text-sm md:text-base font-medium text-brand-textMuted'>
//                   Showing <span className='font-semibold'>{data.length}</span> results
//                 </p>
//               </div>

//             <div className="flex items-center gap-2">
//               <span className="text-sm lg:text-base font-medium whitespace-nowrap">
//                 Sort By
//               </span>

//             <SelectDropdown
//               value={sortBy}
//               valueKey="value"
//               labelKey="label"
//               onChange={handleOnChangeSortBy}
//               options={sortOptions}
//               placeholder="Default"
//               parentClassName="w-[190px]"
//               error={!!sortBy}
//               ChildClassName="
//                 border rounded px-3 py-1.5 text-sm h-[38px]
//                 bg-white
//               "
//             />



//             </div>
//             </div>

//             {/* Products Grid with scroll */}
//             <div className='overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
//               <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
//                 {loading ? (
//                   Array.from({ length: 8 }).map((_, index) => (
//                     <VerticalCard key={index} loading={true} />
//                   ))
//                 ) : data.length > 0 ? (
//                   data.map((product) => (
//                     <VerticalCard
//                       key={product._id}
//                       product={product}
//                       actionSlot={
//                         product?.isHidden || product?.availability === 0 ? (
//                           <button
//                             className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded text-sm font-semibold'
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               navigate(`/product/${product._id}`);
//                             }}
//                           >
//                             Enquire Now
//                           </button>
//                         ) : (
//                           <button
//                             className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded text-sm font-semibold'
//                             onClick={(e) => handleAddToCart(e, product._id)}
//                           >
//                             Add to Cart
//                           </button>
//                         )
//                       }
//                     />
//                   ))
//                 ) : (
//                   <div className="col-span-full text-center py-20">
//                     <svg
//                       className='mx-auto h-24 w-24 text-brand-textMuted mb-4'
//                       fill='none'
//                       viewBox='0 0 24 24'
//                       stroke='currentColor'
//                     >
//                       <path
//                         strokeLinecap='round'
//                         strokeLinejoin='round'
//                         strokeWidth={1.5}
//                         d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
//                       />
//                     </svg>
//                     <p className="text-brand-textMuted text-lg">
//                       {validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k])
//                         ? "No products found for this category"
//                         : "No products found for the selected filters"}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//       <style>
//         {`
//   .price-range::-webkit-slider-thumb {
//     pointer-events: all;
//     width: 20px;
//     height: 20px;
//     border-radius: 50%;
//     background: #ffffff;
//     border: 3px solid #dc2626;
//     cursor: pointer;
//     -webkit-appearance: none;
//   }

//   .price-range::-moz-range-thumb {
//     pointer-events: all;
//     width: 20px;
//     height: 20px;
//     border-radius: 50%;
//     background: #ffffff;
//     border: 3px solid #dc2626;
//     cursor: pointer;
//   }

//   .price-range::-webkit-slider-runnable-track {
//     background: transparent;
//   }

//   .price-range::-moz-range-track {
//     background: transparent;
//   }
// `}
//       </style>

//     </div>

//   );
// };

// export default CategoryProduct;


import React, { useEffect, useState, useMemo, useCallback, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';
import Context from '../context';
import addToCart from '../helpers/addToCart';
import { SlidersHorizontal } from 'lucide-react';
import SelectDropdown from '../customStyles/SelectDropdown';
import offer1 from '../assest/offer/Offer1.png';
import offer2 from '../assest/offer/Offer2.png';
import offer3 from '../assest/offer/Offer3.png';
import offerMobile1 from '../assest/offer/OfferMobile1.png';
import offerMobile2 from '../assest/offer/OfferMobile2.png';
import offerMobile3 from '../assest/offer/OfferMobile3.png';
const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products for frontend filtering
  const [loading, setLoading] = useState(false);
  const [childCategories, setChildCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [offerPosterIndex, setOfferPosterIndex] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(true); // Toggle filter visibility
  const USE_TEMP_BANNER = true;

  // Ref to track if the state update came from a URL change to prevent infinite loops
  const isUpdatingFromUrl = useRef(false);

  const tempOfferPosters = [
    {
      id: 1,
      desktop: offer1,
      mobile: offerMobile1,
    },
    {
      id: 2,
      desktop: offer2,
      mobile: offerMobile2,
    },
    {
      id: 3,
      desktop: offer3,
      mobile: offerMobile3,
    },
  ];


  // Banner Auto-rotate logic
  useEffect(() => {
    if (!USE_TEMP_BANNER || tempOfferPosters.length === 0) return;

    const timer = setInterval(() => {
      setOfferPosterIndex((prev) => (prev + 1) % tempOfferPosters.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [USE_TEMP_BANNER, tempOfferPosters.length]);

  // Filter section toggle states
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
  const [isScreenSizeOpen, setIsScreenSizeOpen] = useState(true);

  // Price range state
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minPrice, setMinPrice] = useState(0);

  // Screen size state
  const [selectScreenSize, setSelectScreenSize] = useState({});
  const [availableScreenSizes, setAvailableScreenSizes] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserAddToCart } = useContext(Context);

  const sortOptions = [
    { value: "asc", label: "Price: Low to High" },
    { value: "dsc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  // Parse URL parameters with useMemo to keep references stable
  const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const urlCategoryListingArray = useMemo(() => urlSearch.getAll("category"), [urlSearch]);
  const urlParentCategory = useMemo(() => urlSearch.get("parentCategory"), [urlSearch]);

  const validParentCategory = useMemo(() =>
    urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '',
    [urlParentCategory]
  );

  // Check if category has screen sizes
  const hasScreenSizeFilter = useMemo(() => {
    if (!validParentCategory) return false;
    const tvCategories = ['tv', 'television', 'smart tv'];
    return tvCategories.some(cat =>
      validParentCategory.toLowerCase().includes(cat)
    );
  }, [validParentCategory]);

  /**
   * Fetch data function
   * Wrapped in useCallback to prevent re-creation on every render
   */
  const fetchData = useCallback(async (categories = [], screenSizes = []) => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          category: categories,
          parentCategory: validParentCategory || undefined,
          screenSize: screenSizes.length > 0 ? screenSizes : undefined
        })
      });
      const dataResponse = await response.json();

      if (dataResponse.data?.length === 0) {
        setData([]);
        setAllProducts([]);
      } else {
        const products = dataResponse?.data || [];
        setAllProducts(products); 
        setData(products);

        if (products.length > 0) {
          const prices = products.map(p => p.sellingPrice || 0);
          const max = Math.max(...prices);
          const min = Math.min(...prices);
          const calculatedMax = Math.ceil(max / 1000) * 1000;
          const calculatedMin = Math.floor(min / 1000) * 1000;
          setMaxPrice(calculatedMax);
          setMinPrice(calculatedMin);
          setPriceRange([calculatedMin, calculatedMax]);
        }

        if (hasScreenSizeFilter) {
          const sizes = [...new Set(products
            .map(p => p.screenSize)
            .filter(Boolean)
          )].sort((a, b) => parseInt(a) - parseInt(b));
          setAvailableScreenSizes(sizes);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, [validParentCategory, hasScreenSizeFilter]);

  /**
   * Frontend price filter logic
   * Runs only when priceRange or allProducts changes (No API call)
   */
  useEffect(() => {
    const filteredProducts = allProducts.filter(product => {
      const price = product.sellingPrice || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    setData(filteredProducts);
  }, [priceRange, allProducts]);

  /**
   * Sync URL to State
   * Logic: If URL changes, update selectCategory state. 
   * Uses JSON comparison to prevent redundant state updates that cause blinking.
   */
  useEffect(() => {
    const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
      acc[el] = true;
      return acc;
    }, {});

    if (JSON.stringify(restoredCategories) !== JSON.stringify(selectCategory)) {
      isUpdatingFromUrl.current = true;
      setSelectCategory(restoredCategories);
    }
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCategoryListingArray,]); // Only depends on the array parsed from URL

  /**
   * Fetch Active Categories on mount
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(SummaryApi.getActiveProductCategory.url);
        const dataJson = await response.json();

        if (dataJson.success) {
          const filteredCategories = dataJson.categories.filter(category => category.productCount > 0);

          if (validParentCategory) {
            const normalizedParentCategory = validParentCategory.toLowerCase().trim();
            const children = filteredCategories.filter(category =>
              category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
            );
            setChildCategories(children);
          } else {
            setChildCategories(filteredCategories);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchCategories();
  }, [validParentCategory]);

  /**
   * Sync State to URL & Trigger Data Fetch
   * Logic: When user selects a filter, update URL and call API.
   * If the state was updated from URL (isUpdatingFromUrl), it only fetches data without navigating again.
   */
  useEffect(() => {
    if (initialLoad) return;

    const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
    const selectedScreenSizes = Object.keys(selectScreenSize).filter(size => selectScreenSize[size]);

    // Construct new URL params
    const urlParams = new URLSearchParams();
    selectedCategories.forEach(category => urlParams.append("category", category));
    if (validParentCategory) urlParams.append("parentCategory", validParentCategory);

    const newSearchString = urlParams.toString();
    const currentSearchString = location.search.startsWith('?') ? location.search.substring(1) : location.search;

    // Only navigate if the URL is actually different and we are NOT currently syncing from URL
    if (!isUpdatingFromUrl.current && newSearchString !== currentSearchString) {
      navigate("/product-category?" + newSearchString, { replace: true });
    }

    // Reset the flag
    isUpdatingFromUrl.current = false;

    // Fetch data logic
    if (validParentCategory) {
      if (selectedCategories.length > 0) {
        fetchData(selectedCategories, selectedScreenSizes);
      } else if (childCategories.length > 0) {
        const childCategoryValues = childCategories.map(child => child.value);
        fetchData(childCategoryValues, selectedScreenSizes);
      }
    } else {
      fetchData(selectedCategories, selectedScreenSizes);
    }
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectCategory, selectScreenSize, validParentCategory, childCategories, initialLoad, fetchData, navigate]);

  // Handle category selection
  const handleSelectCategory = useCallback((e) => {
    const { value, checked } = e.target;
    setSelectCategory(prev => ({ ...prev, [value]: checked }));
  }, []);

  // Handle screen size selection
  const handleSelectScreenSize = useCallback((e) => {
    const { value, checked } = e.target;
    setSelectScreenSize(prev => ({ ...prev, [value]: checked }));
  }, []);

  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 100);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 100);
    setPriceRange([priceRange[0], value]);
  };

  // Handle sort change
  const handleOnChangeSortBy = useCallback((value) => {
    setSortBy(value);
    setData(prev => {
      if (!value) return prev;
      const sortedData = [...prev].sort((a, b) => {
        if (value === "asc") return a.sellingPrice - b.sellingPrice;
        if (value === "dsc") return b.sellingPrice - a.sellingPrice;
        if (value === "name-asc") return a.productName.localeCompare(b.productName);
        if (value === "name-desc") return b.productName.localeCompare(a.productName);
        return 0;
      });
      return sortedData;
    });
  }, []);

  // Selected category offer posters
  const selectedCategoryOfferPosters = useMemo(() => {
    if (childCategories.length === 0) return [];
    const allPosters = childCategories.filter(c => c.offerPoster?.image);
    if (validParentCategory && Object.keys(selectCategory).length === 0) {
      return allPosters;
    }
    const selectedValues = Object.keys(selectCategory).filter(k => selectCategory[k]);
    return selectedValues.length > 0
      ? allPosters.filter(c => selectedValues.includes(c.value))
      : allPosters;
  }, [childCategories, selectCategory, validParentCategory]);

  // Reset poster index when posters change
  useEffect(() => {
    setOfferPosterIndex(0);
  }, [USE_TEMP_BANNER, selectedCategoryOfferPosters.length]);

  // Handle Add to Cart
  const handleAddToCart = useCallback(async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(e, productId);
      fetchUserAddToCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }, [fetchUserAddToCart]);

  // Count selected filters
  const selectedCount = Object.values(selectCategory).filter(Boolean).length +
    Object.values(selectScreenSize).filter(Boolean).length;

  // Reset all filters
  const resetAllFilters = () => {
    setSelectCategory({});
    setSelectScreenSize({});
    setPriceRange([minPrice, maxPrice]);
    if (validParentCategory && childCategories.length > 0) {
      const childCategoryValues = childCategories.map(child => child.value);
      fetchData(childCategoryValues, []);
    } else {
      fetchData([], []);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Top Banner Poster - Using USE_TEMP_BANNER logic */}
      {USE_TEMP_BANNER ? (
        <div className="relative w-full mb-6">
          <div className="relative w-full h-full overflow-hidden">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{
                width: `${tempOfferPosters.length * 100}%`,
                transform: `translateX(-${offerPosterIndex * (100 / tempOfferPosters.length)}%)`,
              }}
            >
              {tempOfferPosters.map((poster) => (
                <div
                  key={poster.id}
                  className="flex-shrink-0 w-full"
                  style={{ width: `${100 / tempOfferPosters.length}%` }}
                >
                <picture className="block w-full h-full">
                {/* Mobile */}
                <source
                  media="(max-width: 768px)"
                  srcSet={poster.mobile}
                />

                {/* Tablet + Desktop */}
                <source
                  media="(min-width: 769px)"
                  srcSet={poster.desktop}
                />

                <img
                  src={poster.desktop} // fallback
                  alt={poster.title || "banner"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                </picture>
                </div>
              ))}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {tempOfferPosters.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setOfferPosterIndex(index)}
                  className="relative w-6 md:w-8 lg:w-10 h-[3px] bg-white/60 overflow-hidden"
                >
                  {offerPosterIndex === index && (
                    <div className="absolute inset-0 bg-brand-primary animate-progress" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        selectedCategoryOfferPosters.length > 0 && (
          <div className="relative w-full mb-6">
            <div className="relative w-full h-[200px] sm:h-[240px] md:h-[400px] overflow-hidden">
              <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{
                  width: `${selectedCategoryOfferPosters.length * 100}%`,
                  transform: `translateX(-${offerPosterIndex * (100 / selectedCategoryOfferPosters.length)}%)`
                }}
              >
                {selectedCategoryOfferPosters.map((category) => (
                  <div
                    key={category.value}
                    className="flex-shrink-0"
                    style={{ width: `${100 / selectedCategoryOfferPosters.length}%` }}
                  >
                    <img src={category.offerPoster.image} alt={category.label} className="w-full h-full object-cover md:object-contain" />
                  </div>
                ))}
              </div>
              {selectedCategoryOfferPosters.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                  {selectedCategoryOfferPosters.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setOfferPosterIndex(index)}
                      className="relative w-6 md:w-8 lg:w-10 h-[3px] bg-white overflow-hidden"
                    >
                      {offerPosterIndex === index && (
                        <div className="absolute inset-0 bg-brand-primary animate-progress" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Mobile Header */}
      <div className='lg:hidden sticky top-0 z-10 bg-white border-b'>
        <div className='flex justify-between items-center p-4'>
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-sm font-medium text-brand-textMuted">Showing {data.length} results</span>
            <span className="block md:hidden text-sm font-medium text-brand-textMuted">{data.length} results</span>
          </div>
          <div className="flex items-center gap-2">
            <SelectDropdown
              value={sortBy}
              valueKey="value"
              labelKey="label"
              onChange={handleOnChangeSortBy}
              options={sortOptions}
              placeholder="Default"
              parentClassName="sm:min-w-[170px]"
              dropdownClassName="min-w-[170px]"
              error={!!sortBy}
              ChildClassName="border rounded px-3 py-1.5 text-sm h-[38px] bg-white"
            />
            <button
              className="flex items-center gap-2 border border-brand-productCardBorder rounded-md px-3 py-1.5 text-sm hover:bg-slate-50"
              onClick={() => setShowModal(true)}
            >
              <SlidersHorizontal size={20} />
              Filter
              {selectedCount > 0 && (
                <span className="bg-brand-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end' onClick={() => setShowModal(false)}>
          <div className='bg-white rounded-t-2xl w-full max-h-[85vh] overflow-hidden' onClick={(e) => e.stopPropagation()}>
            <div className='p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10'>
              <h3 className='text-lg font-semibold'>Filters</h3>
              <button onClick={() => setShowModal(false)} className=' hover:text-brand-primaryHover'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className='overflow-y-auto' style={{ maxHeight: 'calc(85vh - 180px)' }}>
              <div className='p-4'>
                <div className='mb-4'>
                  <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className='flex justify-between items-center w-full py-2 text-left font-medium'>
                    <span>Category</span>
                    <svg className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isCategoryOpen && (
                    <div className='space-y-2 mt-2 max-h-60 overflow-y-auto'>
                      {childCategories.map((category) => (
                        <label key={category.value} className="flex items-center gap-4 py-2 cursor-pointer">
                          <input type="checkbox" checked={selectCategory[category.value] || false} onChange={handleSelectCategory} value={category.value} className="hidden" />
                          <span className={`w-4 h-4 flex items-center justify-center rounded-full border-2 transition-all ${selectCategory[category.value] ? "bg-brand-primary border-brand-primary" : "border-brand-primary"}`}>
                            {selectCategory[category.value] && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <span className="text-[15px] leading-tight">{category.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className='mb-4 border-t pt-4'>
                  <button onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)} className='flex justify-between items-center w-full py-2 text-left font-medium'>
                    <span>Price Range</span>
                    <svg className={`w-5 h-5 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isPriceRangeOpen && (
                    <div className="px-4 pb-6 mt-4">
                      <div className="flex justify-between mb-3">
                        <span className="text-sm font-medium">₹{priceRange[0]}</span>
                        <span className="text-sm font-medium">₹{priceRange[1]}</span>
                      </div>
                      <div className="relative h-3">
                        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-brand-productCardImageBg rounded-full" />
                        <div className="absolute top-1/2 -translate-y-1/2 h-2 bg-brand-primary rounded-full" style={{ left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`, right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%` }} />
                        <input type="range" min={minPrice} max={maxPrice} value={priceRange[0]} onChange={handleMinPriceChange} className="price-range absolute w-full appearance-none bg-transparent pointer-events-none -mt-1" />
                        <input type="range" min={minPrice} max={maxPrice} value={priceRange[1]} onChange={handleMaxPriceChange} className="price-range absolute w-full appearance-none bg-transparent pointer-events-none -mt-1" />
                      </div>
                    </div>
                  )}
                </div>
                {hasScreenSizeFilter && availableScreenSizes.length > 0 && (
                  <div className='mb-4 border-t pt-4'>
                    <button onClick={() => setIsScreenSizeOpen(!isScreenSizeOpen)} className='flex justify-between items-center w-full py-2 text-left font-medium'>
                      <span>Screen Size</span>
                      <svg className={`w-5 h-5 transition-transform ${isScreenSizeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isScreenSizeOpen && (
                      <div className='space-y-2 mt-2 max-h-40 overflow-y-auto'>
                        {availableScreenSizes.map((size) => (
                          <label key={size} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={selectScreenSize[size] || false} onChange={handleSelectScreenSize} value={size} className="hidden" />
                            <span className={`w-5 h-5 border-2 flex items-center justify-center ${selectScreenSize[size] ? "bg-brand-primary border-brand-primary" : "border-brand-primary"}`}>
                              {selectScreenSize[size] && (
                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
                                  <path fill="none" stroke="currentColor" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            <span className="text-sm">{size}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className='p-4 border-t flex gap-2 bg-white sticky bottom-0'>
              <button className='flex-1 bg-slate-100 text-brand-textMuted px-4 py-3 rounded font-semibold hover:bg-slate-200' onClick={() => { resetAllFilters(); setShowModal(false); }}>Clear All</button>
              <button className='flex-1 bg-brand-primary text-white px-4 py-3 rounded font-semibold hover:bg-brand-primaryHover' onClick={() => setShowModal(false)}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className='mx-auto px-4 lg:px-12 py-4'>
        <div className='flex gap-4 relative'>
          {isFilterVisible && (
            <aside className="hidden lg:block w-[280px] sticky top-4 self-start transition-all duration-300" style={{ height: 'calc(88vh - 2rem)' }}>
              <div className="bg-white border border-color-brand-productCardBorder rounded-lg flex flex-col h-full">
                <div className='p-4 flex justify-between items-center flex-shrink-0'>
                  <div className='flex items-center gap-2'>
                    <SlidersHorizontal size={20} />
                    <h3 className='font-semibold'>Filter</h3>
                  </div>
                  <button onClick={() => setIsFilterVisible(false)} className='hover:text-brand-primaryHover'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className='overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-brand-productCardBorder scrollbar-track-transparent px-2 py-2'>
                  <div className='py-1'>
                    <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className='flex justify-between items-center w-full rounded-md p-4 bg-brand-productCardImageBg'>
                      <span className='font-medium text-sm'>Category</span>
                      <svg className={`w-5 h-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isCategoryOpen && (
                      <div className='px-4 pb-4 space-y-2 max-h-80 overflow-y-auto'>
                        {childCategories.map((category) => (
                          <label key={category._id} className="flex items-center gap-4 py-2 cursor-pointer">
                            <input type="checkbox" checked={selectCategory[category.value] || false} onChange={handleSelectCategory} value={category.value} className="hidden" />
                            <span className={`w-4 h-4 flex items-center justify-center rounded-full border-2 transition-all ${selectCategory[category.value] ? "bg-brand-primary border-brand-primary" : "border-brand-primary"}`}>
                              {selectCategory[category.value] && (
                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            <span className="text-[15px] leading-tight">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className='py-1'>
                    <button onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)} className='flex justify-between items-center w-full rounded-md p-4 bg-brand-productCardImageBg'>
                      <span className='font-medium text-sm'>Price Range</span>
                      <svg className={`w-5 h-5 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isPriceRangeOpen && (
                      <div className="px-4 pb-6 mt-4">
                        <div className="flex justify-between mb-3">
                          <span className="text-sm font-medium">₹{priceRange[0]}</span>
                          <span className="text-sm font-medium">₹{priceRange[1]}</span>
                        </div>
                        <div className="relative h-3">
                          <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-brand-productCardImageBg rounded-full" />
                          <div className="absolute top-1/2 -translate-y-1/2 h-2 bg-brand-primary rounded-full" style={{ left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`, right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%` }} />
                          <input type="range" min={minPrice} max={maxPrice} value={priceRange[0]} onChange={handleMinPriceChange} className="price-range absolute w-full appearance-none bg-transparent pointer-events-none -mt-1" />
                          <input type="range" min={minPrice} max={maxPrice} value={priceRange[1]} onChange={handleMaxPriceChange} className="price-range absolute w-full appearance-none bg-transparent pointer-events-none -mt-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  {hasScreenSizeFilter && availableScreenSizes.length > 0 && (
                    <div className='border-b'>
                      <button onClick={() => setIsScreenSizeOpen(!isScreenSizeOpen)} className='flex justify-between items-center w-full p-4 hover:bg-slate-50'>
                        <span className='font-medium text-sm'>Screen Size</span>
                        <svg className={`w-5 h-5 transition-transform ${isScreenSizeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isScreenSizeOpen && (
                        <div className='px-4 pb-4 space-y-2 max-h-60 overflow-y-auto'>
                          {availableScreenSizes.map((size) => (
                            <label key={size} className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" checked={selectScreenSize[size] || false} onChange={handleSelectScreenSize} value={size} className="hidden" />
                              <span className={`w-5 h-5 border-2 flex items-center justify-center ${selectScreenSize[size] ? "bg-brand-primary border-brand-primary" : "border-brand-primary"}`}>
                                {selectScreenSize[size] && (
                                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </span>
                              <span className="text-sm">{size}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className='p-4 flex-shrink-0'>
                  <button onClick={resetAllFilters} className='w-full bg-white border border-brand-primary text-brand-primary px-4 py-2 rounded font-semibold hover:bg-brand-primary hover:text-white transition-colors'>Reset Filter</button>
                </div>
              </div>
            </aside>
          )}

          <main className={`flex-1 min-w-0 transition-all duration-300 ${!isFilterVisible ? 'ml-0' : ''}`}>
            <div className='hidden lg:flex justify-between items-center mb-4 pb-4'>
              <div className='flex items-center gap-4'>
                {!isFilterVisible && (
                  <button onClick={() => setIsFilterVisible(true)} className='flex items-center gap-2 border border-brand-productCardBorder rounded px-3 py-2 text-sm hover:bg-slate-50'>
                    <SlidersHorizontal size={20} />
                    Show Filters
                  </button>
                )}
                <p className='text-sm md:text-base font-medium text-brand-textMuted'>Showing <span className='font-semibold'>{data.length}</span> results</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm lg:text-base font-medium whitespace-nowrap">Sort By</span>
                <SelectDropdown value={sortBy} valueKey="value" labelKey="label" onChange={handleOnChangeSortBy} options={sortOptions} placeholder="Default" parentClassName="min-w-[120px] sm:min-w-[170px]" error={!!sortBy} ChildClassName="border rounded px-3 py-1.5 text-sm h-[38px] bg-white" />
              </div>
            </div>

            <div className='overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) => <VerticalCard key={index} loading={true} />)
                ) : data.length > 0 ? (
                  data.map((product) => (
                    <VerticalCard
                      key={product._id}
                      product={product}
                      actionSlot={
                        product?.isHidden || product?.availability === 0 ? (
                          <button className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded text-sm font-semibold' onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}>Enquire Now</button>
                        ) : (
                          <button className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded text-sm font-semibold' onClick={(e) => handleAddToCart(e, product._id)}>Add to Cart</button>
                        )
                      }
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <svg className='mx-auto h-24 w-24 text-brand-textMuted mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                    </svg>
                    <p className="text-brand-textMuted text-lg">{validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k]) ? "No products found for this category" : "No products found for the selected filters"}</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <style>{`
        .price-range::-webkit-slider-thumb { pointer-events: all; width: 20px; height: 20px; border-radius: 50%; background: #ffffff; border: 3px solid #dc2626; cursor: pointer; -webkit-appearance: none; }
        .price-range::-moz-range-thumb { pointer-events: all; width: 20px; height: 20px; border-radius: 50%; background: #ffffff; border: 3px solid #dc2626; cursor: pointer; }
        .price-range::-webkit-slider-runnable-track { background: transparent; }
        .price-range::-moz-range-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default CategoryProduct;