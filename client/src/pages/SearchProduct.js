// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import SummaryApi from '../common';
// import VerticalCard from '../components/VerticalCard';

// const SearchProduct = () => {
//   const query = useLocation();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchProduct = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(SummaryApi.searchProduct.url + query.search);
//       const dataResponse = await response.json();

//       if (dataResponse && dataResponse.data) {
//         // Sort by isHidden: false first
//         const sortedProducts = dataResponse.data.sort((a, b) => a.isHidden - b.isHidden);
//         setData(sortedProducts);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [query]);

//   return (
//     <div className='container mx-auto px-2 md:px-4 mt-14'>
//       {loading && <p className='text-lg text-center'>Loading ...</p>}

//       <p className='text-lg font-semibold my-3'>Search Results: {data.length}</p>

//       {!loading && data.length === 0 && (
//         <p className='bg-white text-lg text-center p-4'>No Data Found....</p>
//       )}

//       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
//         {!loading &&
//           data.map((product, index) => (
//             <VerticalCard key={product._id || index} loading={false} data={product} />
//           ))}
//       </div>
//     </div>
//   );
// };

// export default SearchProduct;

// import React, { useEffect, useState, useCallback, useContext } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import SummaryApi from '../common';
// import Context from '../context';
// import addToCart from '../helpers/addToCart';
// import VerticalCard from '../components/VerticalCard';

// const SearchProduct = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { fetchUserAddToCart } = useContext(Context);
  
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sortBy, setSortBy] = useState('relevance');

//   // Get search query from URL
//   const searchQuery = location.search;

//   // Extract search term from query
//   const getSearchTerm = useCallback(() => {
//     const params = new URLSearchParams(searchQuery);
//     return params.get('q') || '';
//   }, [searchQuery]);

//   const searchTerm = getSearchTerm();

//   // Fetch all products (when search is empty)
//   const fetchAllProducts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.allProduct.url);
//       const dataResponse = await response.json();

//       if (dataResponse && dataResponse.data) {
//         // Sort by availability (not hidden first)
//         const sortedProducts = dataResponse.data.sort((a, b) => {
//           if (a.isHidden !== b.isHidden) {
//             return a.isHidden - b.isHidden;
//           }
//           if (a.availability !== b.availability) {
//             return b.availability - a.availability;
//           }
//           return 0;
//         });
//         setData(sortedProducts);
//       } else {
//         setData([]);
//       }
//     } catch (error) {
//       console.error('Error fetching all products:', error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch products based on search query
//   const fetchSearchProducts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(SummaryApi.searchProduct.url + searchQuery);
//       const dataResponse = await response.json();

//       if (dataResponse && dataResponse.data) {
//         // Sort by isHidden: false first (available products)
//         const sortedProducts = dataResponse.data.sort((a, b) => {
//           if (a.isHidden !== b.isHidden) {
//             return a.isHidden - b.isHidden;
//           }
//           if (a.availability !== b.availability) {
//             return b.availability - a.availability;
//           }
//           return 0;
//         });
//         setData(sortedProducts);
//       } else {
//         setData([]);
//       }
//     } catch (error) {
//       console.error('Error fetching search products:', error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchQuery]);

//   // Fetch products when search query changes
//   useEffect(() => {
//     if (!searchTerm || searchTerm.trim() === '') {
//       // If search is empty, fetch all products
//       fetchAllProducts();
//     } else {
//       // If search has value, fetch search results
//       fetchSearchProducts();
//     }
//   }, [searchTerm, fetchAllProducts, fetchSearchProducts]);

//   // Handle sort change
//   const handleSortChange = useCallback((e) => {
//     const value = e.target.value;
//     setSortBy(value);

//     setData((prevData) => {
//       const sortedData = [...prevData];
      
//       switch (value) {
//         case 'price-asc':
//           return sortedData.sort((a, b) => a.sellingPrice - b.sellingPrice);
//         case 'price-desc':
//           return sortedData.sort((a, b) => b.sellingPrice - a.sellingPrice);
//         case 'name-asc':
//           return sortedData.sort((a, b) => 
//             a.productName.localeCompare(b.productName)
//           );
//         case 'name-desc':
//           return sortedData.sort((a, b) => 
//             b.productName.localeCompare(a.productName)
//           );
//         case 'relevance':
//         default:
//           return sortedData.sort((a, b) => a.isHidden - b.isHidden);
//       }
//     });
//   }, []);

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

//   return (
//     <div className='mx-auto px-2 md:px-4 py-4 mt-12 md:mt-0 min-h-screen'>
//       {/* Header Section */}
//       <div className='bg-white rounded-lg mb-6'>
//         <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
//           <div>
//             {searchTerm ? (
//               <h1 className='text-xl md:text-2xl font-semibold text-slate-800'>
//                 Search results for "{searchTerm}"
//               </h1>
//             ) : (
//               <h1 className='text-xl md:text-2xl font-semibold text-slate-800'>
//                 All Products
//               </h1>
//             )}
//             <p className='text-sm md:text-base text-slate-600 mt-1'>
//               {loading ? 'Loading...' : `${data.length} product${data.length !== 1 ? 's' : ''} found`}
//             </p>
//           </div>

//           {/* Sort Dropdown */}
//           {!loading && data.length > 0 && (
//             <div className='flex items-center gap-2'>
//               <label htmlFor='sort' className='text-sm font-medium text-slate-600 whitespace-nowrap'>
//                 Sort by:
//               </label>
//               <select
//                 id='sort'
//                 value={sortBy}
//                 onChange={handleSortChange}
//                 className='border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//               >
//                 <option value='relevance'>Relevance</option>
//                 <option value='price-asc'>Price: Low to High</option>
//                 <option value='price-desc'>Price: High to Low</option>
//                 <option value='name-asc'>Name: A to Z</option>
//                 <option value='name-desc'>Name: Z to A</option>
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className='flex justify-center items-center py-20'>
//           <div className='text-center'>
//             <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4'></div>
//             <p className='text-lg text-slate-600'>
//               {searchTerm ? 'Searching for products...' : 'Loading products...'}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* No Results - Only show when there's a search term */}
//       {!loading && data.length === 0 && searchTerm && (
//         <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
//           <svg
//             className='mx-auto h-24 w-24 text-slate-300 mb-4'
//             fill='none'
//             viewBox='0 0 24 24'
//             stroke='currentColor'
//           >
//             <path
//               strokeLinecap='round'
//               strokeLinejoin='round'
//               strokeWidth={1.5}
//               d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
//             />
//           </svg>
//           <h3 className='text-xl font-semibold text-slate-800 mb-2'>No products found</h3>
//           <p className='text-slate-600 mb-4'>
//             We couldn't find any products matching "{searchTerm}"
//           </p>
//           <ul className='text-sm text-slate-500 text-left max-w-md mx-auto space-y-2 mb-6'>
//             <li>• Try different keywords</li>
//             <li>• Check your spelling</li>
//             <li>• Use more general terms</li>
//             <li>• Browse our categories instead</li>
//           </ul>
//           <button
//             onClick={() => navigate('/product-category')}
//             className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors'
//           >
//             Browse All Products
//           </button>
//         </div>
//       )}

//       {/* Products Grid */}
//       {!loading && data.length > 0 && (
//         <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
//           {data.map((product, index) => (
//             <VerticalCard
//               key={product._id || `product-${index}`}
//               product={product}
//               actionSlot={
//                 product?.isHidden || product?.availability === 0 ? (
//                   <button
//                     className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-semibold'
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       // Handle enquiry
//                       console.log('Enquiry for:', product._id);
//                     }}
//                   >
//                     Enquiry Now
//                   </button>
//                 ) : (
//                   <button
//                     className='w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded-md text-sm font-semibold'
//                     onClick={(e) => handleAddToCart(e, product._id)}
//                   >
//                     Add to Cart
//                   </button>
//                 )
//               }
//             />
//           ))}
//         </div>
//       )}

//     </div>
//   );
// };

// export default SearchProduct;


import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import Context from '../context';
import addToCart from '../helpers/addToCart';
import VerticalCard from '../components/VerticalCard';
import { useDebounce } from 'use-debounce';

const SearchProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUserAddToCart } = useContext(Context);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  /* ---------------- GET SEARCH TERM FROM URL ---------------- */
  const searchTerm = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  }, [location.search]);

  /* ---------------- DEBOUNCE SEARCH TERM ---------------- */
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  /* ---------------- FETCH ALL PRODUCTS ---------------- */
  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(SummaryApi.allProduct.url);
      const json = await res.json();

      if (json?.data) {
        const sorted = json.data.sort((a, b) => {
          if (a.isHidden !== b.isHidden) return a.isHidden - b.isHidden;
          if (a.availability !== b.availability) return b.availability - a.availability;
          return 0;
        });
        setData(sorted);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- FETCH SEARCH PRODUCTS ---------------- */
  const fetchSearchProducts = useCallback(async (term) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${SummaryApi.searchProduct.url}?q=${encodeURIComponent(term)}`
      );
      const json = await res.json();

      if (json?.data) {
        const sorted = json.data.sort((a, b) => {
          if (a.isHidden !== b.isHidden) return a.isHidden - b.isHidden;
          if (a.availability !== b.availability) return b.availability - a.availability;
          return 0;
        });
        setData(sorted);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- MAIN EFFECT (DEBOUNCED) ---------------- */
  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.trim() === '') {
      fetchAllProducts();
    } else {
      fetchSearchProducts(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, fetchAllProducts, fetchSearchProducts]);

  /* ---------------- SORT ---------------- */
  const handleSortChange = useCallback((e) => {
    const value = e.target.value;
    setSortBy(value);

    setData((prev) => {
      const sorted = [...prev];
      switch (value) {
        case 'price-asc':
          return sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
        case 'price-desc':
          return sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);
        case 'name-asc':
          return sorted.sort((a, b) =>
            a.productName.localeCompare(b.productName)
          );
        case 'name-desc':
          return sorted.sort((a, b) =>
            b.productName.localeCompare(a.productName)
          );
        default:
          return sorted.sort((a, b) => a.isHidden - b.isHidden);
      }
    });
  }, []);

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = useCallback(async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e, id);
    fetchUserAddToCart();
  }, [fetchUserAddToCart]);

  /* ======================= UI ======================= */
  return (
    <div className="mx-auto px-2 md:px-4 py-4 mt-12 md:mt-0 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              {searchTerm
                ? `Search results for "${searchTerm}"`
                : 'All Products'}
            </h1>
            <p className="text-sm text-brand-textMuted mt-1">
              {loading ? 'Loading...' : `${data.length} products found`}
            </p>
          </div>

          {!loading && data.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-brand-textMuted">Sort by:</span>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <VerticalCard key={i} loading />
          ))}
        </div>
      )}

      {/* NO RESULTS */}
      {!loading && data.length === 0 && searchTerm && (
        <div className="bg-white p-8 text-center">
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
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-brand-textMuted mb-4">
            We couldn't find any products matching "{searchTerm}"
          </p>

          <button
            onClick={() => navigate('/product-category')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Browse All Products
          </button>
        </div>
      )}

      {/* PRODUCTS */}
      {!loading && data.length > 0 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {data.map((product) => (
            <VerticalCard
              key={product._id}
              product={product}
              actionSlot={
                product?.isHidden || product?.availability === 0 ? (
                  <button className="w-full bg-brand-primary text-white py-2 rounded-md">
                    Enquiry Now
                  </button>
                ) : (
                  <button
                    className="w-full bg-brand-primary text-white py-2 rounded-md"
                    onClick={(e) => handleAddToCart(e, product._id)}
                  >
                    Add to Cart
                  </button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
