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

//           <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
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

//           <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
//           <form className='text-sm flex flex-col gap-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent max-h-[50vh] sm:max-h-[60vh] md:max-h-[65vh] lg:max-h-[70vh] xl:max-h-[75vh] 2xl:max-h-[80vh] pr-2'>
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
//           <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
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

//           <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300 mt-4'>Category</h3>
//           <form className='text-sm flex flex-col gap-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent flex-1 pr-2'>
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
//                           Enquiry Now
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
//               <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-2 border-slate-300'>
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
//               <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-2 border-slate-300'>
//                 Category
//               </h3>
//               <div className='overflow-y-auto flex-1 py-3 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent'>
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
//                         Enquiry Now
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
//                   className='mx-auto h-24 w-24 text-slate-300 mb-4'
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

import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';
import Context from '../context';
import addToCart from '../helpers/addToCart';

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [childCategories, setChildCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [offerPosterIndex, setOfferPosterIndex] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserAddToCart } = useContext(Context);

  // Parse URL parameters
  const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const urlCategoryListingArray = useMemo(() => urlSearch.getAll("category"), [urlSearch]);
  const urlParentCategory = useMemo(() => urlSearch.get("parentCategory"), [urlSearch]);
  
  const validParentCategory = useMemo(() => 
    urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '',
    [urlParentCategory]
  );

  // Fetch data function
  const fetchData = useCallback(async (categories = []) => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          category: categories,
          parentCategory: validParentCategory || undefined
        })
      });
      const dataResponse = await response.json();
      
      if (dataResponse.data?.length === 0) {
        setData([]);
      } else {
        setData(dataResponse?.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [validParentCategory]);

  // Restore filters from URL on mount
  useEffect(() => {
    if (urlCategoryListingArray.length > 0) {
      const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
        acc[el] = true;
        return acc;
      }, {});
      setSelectCategory(restoredCategories);
    } else {
      setSelectCategory({});
    }
  }, [location.search, urlCategoryListingArray]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(SummaryApi.getActiveProductCategory.url);
        const data = await response.json();
        
        if (data.success) {
          const filteredCategories = data.categories.filter(category => category.productCount > 0);

          if (validParentCategory) {
            const normalizedParentCategory = validParentCategory.toLowerCase().trim();
            const children = filteredCategories.filter(category =>
              category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
            );
            setChildCategories(children);
            
            const childCategoryValues = children.map(child => child.value);
            await fetchData(childCategoryValues);
          } else {
            setChildCategories(filteredCategories);
            if (!initialLoad) {
              await fetchData([]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setData([]);
      } finally {
        setInitialLoad(false);
      }
    };
    
    fetchCategories();
  }, [validParentCategory, fetchData, initialLoad]);

  // Update URL and fetch data when category selection changes
  useEffect(() => {
    if (validParentCategory && initialLoad) return;

    const selectedCategories = Object.keys(selectCategory).filter(category => selectCategory[category]);
    const urlParams = new URLSearchParams();
    
    selectedCategories.forEach(category => urlParams.append("category", category));
    if (validParentCategory) urlParams.append("parentCategory", validParentCategory);

    navigate("/product-category?" + urlParams.toString(), { replace: true });

    if (validParentCategory) {
      if (selectedCategories.length > 0) {
        fetchData(selectedCategories);
      } else if (childCategories.length > 0) {
        const childCategoryValues = childCategories.map(child => child.value);
        fetchData(childCategoryValues);
      }
    } else {
      fetchData(selectedCategories.length > 0 ? selectedCategories : []);
    }
  }, [selectCategory, validParentCategory, childCategories, initialLoad, fetchData, navigate]);

  // Handle category selection
  const handleSelectCategory = useCallback((e) => {
    const { value, checked } = e.target;
    setSelectCategory(prev => ({ ...prev, [value]: checked }));
  }, []);

  // Handle sort change
  const handleOnChangeSortBy = useCallback((e) => {
    const { value } = e.target;
    setSortBy(value);
    setData(prev => {
      const sortedData = [...prev].sort((a, b) =>
        value === 'asc' ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
      );
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
  }, [selectedCategoryOfferPosters.length]);

  // Auto-rotate offer posters
  useEffect(() => {
    if (selectedCategoryOfferPosters.length > 1) {
      const interval = setInterval(() => {
        setOfferPosterIndex(prev => (prev + 1) % selectedCategoryOfferPosters.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedCategoryOfferPosters.length]);

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

  // Count selected categories
  const selectedCount = Object.values(selectCategory).filter(Boolean).length;

  return (
    <div className='h-screen'>
      {/* Mobile Header */}
      <div className='lg:hidden sticky top-0 z-10 bg-white shadow-md'>
        <div className='flex justify-between items-center p-4'>
          <select
            className='border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={sortBy}
            onChange={handleOnChangeSortBy}
          >
            <option value=''>Sort By</option>
            <option value='asc'>Price: Low to High</option>
            <option value='dsc'>Price: High to Low</option>
          </select>

          <button
            className='bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
            onClick={() => setShowModal(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters {selectedCount > 0 && `(${selectedCount})`}
          </button>
        </div>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4' onClick={() => setShowModal(false)}>
          <div className='bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden' onClick={(e) => e.stopPropagation()}>
            <div className='p-4 border-b flex justify-between items-center'>
              <h3 className='text-lg font-semibold'>Filter Categories</h3>
              <button onClick={() => setShowModal(false)} className='text-slate-400 hover:text-slate-600'>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className='overflow-y-auto max-h-[calc(80vh-140px)] p-4'>
              <div className='space-y-2'>
                {childCategories.map((category) => (
                  <label 
                    key={category.value}
                    className='flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors'
                  >
                    <input
                      type='checkbox'
                      checked={selectCategory[category.value] || false}
                      value={category.value}
                      onChange={handleSelectCategory}
                      className='w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium'>{category.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className='p-4 border-t flex gap-2'>
              <button
                className='flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors'
                onClick={() => {
                  setSelectCategory({});
                  setShowModal(false);
                }}
              >
                Clear All
              </button>
              <button
                className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                onClick={() => setShowModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className='mx-auto px-4 py-4'>
        <div className='flex gap-4'>
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] h-[calc(100vh-80px)]">
          <div className="h-full bg-white rounded-md pl-4 lg:pl-6 xl:pl-8 flex flex-col">

              {/* Sort Section */}
              <div className='pb-6 border-b '>
                <h3 className='text-lg font-bold text-slate-800 mb-4 flex items-center gap-2'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Sort By
                </h3>
                <div className='space-y-3'>
                  <label className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors'>
                    <input 
                      type='radio' 
                      name='sortBy' 
                      checked={sortBy === 'asc'} 
                      onChange={handleOnChangeSortBy} 
                      value="asc" 
                      className='w-4 h-4 text-blue-600 focus:ring-blue-500'
                    />
                    <span className='text-sm'>Price: Low to High</span>
                  </label>
                  <label className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors'>
                    <input 
                      type='radio' 
                      name='sortBy' 
                      checked={sortBy === 'dsc'} 
                      onChange={handleOnChangeSortBy} 
                      value="dsc" 
                      className='w-4 h-4 text-blue-600 focus:ring-blue-500'
                    />
                    <span className='text-sm'>Price: High to Low</span>
                  </label>
                </div>
              </div>

              {/* Category Section - With overflow-auto to make it scrollable */}
              <div className='flex flex-col flex-1 min-h-0 pt-6'>
                <div className='flex items-center justify-between mb-2 pr-4'>
                  <h3 className='text-lg font-bold text-slate-800 flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Categories
                  </h3>
                  {selectedCount > 0 && (
                    <button
                      onClick={() => setSelectCategory({})}
                      className='text-xs text-blue-600 hover:text-blue-700 font-medium'
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                {/* This div is scrollable */}
<div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-300">
  <div className="space-y-2">
    {childCategories.map((category) => (
      <label key={category.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
        <input
          type="checkbox"
          checked={selectCategory[category.value] || false}
          value={category.value}
          onChange={handleSelectCategory}
        />
        <span className="text-sm">{category.label}</span>
      </label>
    ))}
  </div>
</div>

              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className='flex-1 h-[calc(100vh-80px)] overflow-y-auto pr-2'>

            {/* Offer Posters */}
            {selectedCategoryOfferPosters.length > 0 && (
              <div className='mb-6'>
                <div className='bg-white shadow-lg rounded-xl overflow-hidden'>
                  {selectedCategoryOfferPosters.map((category, index) => (
                    <div 
                      key={category.value} 
                      className={`${index === offerPosterIndex ? 'block' : 'hidden'}`}
                    >
                      <img
                        src={category.offerPoster.image}
                        alt={category.label}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>

                {selectedCategoryOfferPosters.length > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    {selectedCategoryOfferPosters.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setOfferPosterIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          offerPosterIndex === index ? 'bg-blue-600 w-8' : 'bg-slate-300 w-2'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <VerticalCard key={index} loading={true} />
                ))
              ) : data.length > 0 ? (
                data.map((product) => (
                  <VerticalCard 
                    key={product._id} 
                    product={product}
                    actionSlot={
                      product?.isHidden || product?.availability === 0 ? (
                        <button 
                          className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-semibold'
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Enquiry for:', product._id);
                          }}
                        >
                          Enquiry Now
                        </button>
                      ) : (
                        <button 
                          className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-semibold'
                          onClick={(e) => handleAddToCart(e, product._id)}
                        >
                          Add to Cart
                        </button>
                      )
                    }
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <svg
                    className='mx-auto h-24 w-24 text-brand-textMuted mb-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                    />
                  </svg>
                  <p className="text-brand-primaryTextMuted text-lg">
                    {validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k])
                      ? "No products found for this category"
                      : "No products found for the selected categories"}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
