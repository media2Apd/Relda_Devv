import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';
//categories
const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL search params to get categories
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListingArray = urlSearch.getAll("category");
  const urlParentCategory = urlSearch.get("parentCategory");

  const validParentCategory = urlParentCategory && urlParentCategory !== 'undefined' ? urlParentCategory : '';

  const initialCategoryState = validParentCategory
    ? {} // Start empty when parent category is specified
    : urlCategoryListingArray.reduce((acc, el) => {
      acc[el] = true;
      return acc;
    }, {});

  const [selectCategory, setSelectCategory] = useState(initialCategoryState);
  const [sortBy, setSortBy] = useState("");
  const [categories, setCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedParentCategoryName, setSelectedParentCategoryName] = useState("");
  const [offerPosterIndex, setOfferPosterIndex] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
useEffect(() => {
  if (urlCategoryListingArray.length > 0) {
    // Restore filters from URL
    const restoredCategories = urlCategoryListingArray.reduce((acc, el) => {
      acc[el] = true;
      return acc;
    }, {});
    setSelectCategory(restoredCategories);
  } else {
    // No filter in URL → clear state (all products case will be handled by main useEffect)
    setSelectCategory({});
  }
}, [location.search]);





  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(SummaryApi.getActiveProductCategory.url);
        const data = await response.json();
        if (data.success) {
          const filteredCategories = data.categories.filter(category => category.productCount > 0);
          setCategories(filteredCategories);

          if (validParentCategory) {
            const normalizedParentCategory = validParentCategory.toLowerCase().trim();
            const parentCategory = filteredCategories.find(category => category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory);

            if (parentCategory) {
              setSelectedParentCategoryName(parentCategory.name);
              const children = filteredCategories.filter(category =>
                category.parentCategory?.name?.toLowerCase().trim() === normalizedParentCategory
              );
              setChildCategories(children);
              // Only fetch products from these child categories by default
              const childCategoryValues = children.map(child => child.value);
              const productsResponse = await fetchData(childCategoryValues);

              if (productsResponse?.length === 0) {
                setData([]); // Explicitly set empty array for no products
              }
            } else {
              // Parent category not found - show error
              setData([]);
            }
          } else {
            setChildCategories(filteredCategories);
            if (!initialLoad) {
              fetchData([]); // Only fetch all products if not initial load with parent category
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
  }, [validParentCategory]);

  const fetchData = async (categories = []) => {
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
      // Handle empty results differently based on context
      if (dataResponse.data?.length === 0) {
        if (validParentCategory) {
          // No products for parent category
          setData([]);
          navigate(`/product-category?parentCategory=${encodeURIComponent(validParentCategory)}`, {
            replace: true,
            state: { noProducts: true } // Flag for empty state
          });
        } else {
          // No products for selected filters
          setData([]);
        }
      } else {
        setData(dataResponse?.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Don't run until child categories are available
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
  }, [navigate, validParentCategory, selectCategory, childCategories, initialLoad]);


  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory(prev => ({ ...prev, [value]: checked }));
  };

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;
    setSortBy(value);
    setData(prev => {
      const sortedData = [...prev].sort((a, b) =>
        value === 'asc' ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
      );
      return sortedData;
    });
  };

  const selectedCategoryOfferPosters = useMemo(() => {
    // Return empty if no child categories loaded yet
    if (childCategories.length === 0) return [];

    const allPosters = childCategories.filter(c => c.offerPoster?.image);

    // When parent category specified and nothing manually selected
    if (validParentCategory && Object.keys(selectCategory).length === 0) {
      return allPosters;
    }

    const selectedValues = Object.keys(selectCategory).filter(k => selectCategory[k]);
    return selectedValues.length > 0
      ? allPosters.filter(c => selectedValues.includes(c.value))
      : allPosters;
  }, [childCategories, selectCategory, validParentCategory]);

  useEffect(() => {
    setOfferPosterIndex(0);
  }, [selectedCategoryOfferPosters.length]);

  useEffect(() => {
    if (selectedCategoryOfferPosters.length > 1) {
      const interval = setInterval(() => {
        setOfferPosterIndex(prev => (prev + 1) % selectedCategoryOfferPosters.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedCategoryOfferPosters]);

  return (
    <div className='p-0 lg:p-0'>
      <div className='flex justify-between items-center mt-2 lg:hidden p-4 bg-white shadow-md rounded-md'>
        {/* Sort By Dropdown */}
        <div className='relative'>
          <select
            className='border rounded-md px-4 py-2 text-xs shadow-sm focus:outline-none focus:ring focus:ring-blue-300'
            value={sortBy}
            onChange={handleOnChangeSortBy}
          >
            <option value='' disabled>
              Sort By
            </option>
            <option value='asc'>Price - Low to High</option>
            <option value='dsc'>Price - High to Low</option>
          </select>
        </div>

        {/* Category Modal Toggle */}
        <button
          className='bg-blue-600 text-white text-xs px-4 py-2 rounded-md shadow-sm hover:bg-blue-700'
          onClick={() => setShowModal(true)}
        >
          Filter Categories
        </button>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className='fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-20'>
          <div className='bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden'>
            <h3 className='text-lg font-medium mb-4 px-4 pt-4'>Select Categories</h3>
            <div className='flex flex-col gap-2 overflow-y-auto max-h-[60vh] px-4 pb-4'>
              {childCategories.map((category) => (
                <div className='flex items-center gap-3' key={category.value}>
                  <input
                    type='checkbox'
                    name='category'
                    checked={selectCategory[category.value] || false}
                    value={category.value}
                    id={category.value}
                    onChange={handleSelectCategory}
                  />
                  <label htmlFor={category.value}>{category.label}</label>
                </div>
              ))}
            </div>
            <div className='mt-4 flex justify-end gap-2 px-4 pb-4'>
              <button
                className='bg-gray-200 px-4 py-2 rounded-md'
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='flex justify-between items-center h-screen bg-white'>
        <div className='hidden lg:flex flex-col justify-start p-4 w-[230px] xl:w-[250px] h-full bg-white shadow-lg rounded-lg'>

          <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
          <form className='text-sm flex flex-col gap-2 py-2'>
            <div className='flex items-center gap-3'>
              <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"} id="asc" />
              <label htmlFor='asc'>Price - Low to High</label>
            </div>
            <div className='flex items-center gap-3'>
              <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"} id="dsc" />
              <label htmlFor='dsc'>Price - High to Low</label>
            </div>
          </form>

          <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
          <form className='text-sm flex flex-col gap-3 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent max-h-[50vh] sm:max-h-[60vh] md:max-h-[65vh] lg:max-h-[70vh] xl:max-h-[75vh] 2xl:max-h-[80vh] pr-2'>
            {childCategories.map((category) => (
              <div className='flex items-center gap-2' key={category.value}>
                <input
                  type='checkbox'
                  name="category"
                  checked={selectCategory[category.value] || false}
                  value={category.value}
                  id={category.value}
                  onChange={handleSelectCategory}
                  className='w-4 h-4 accent-red-600 cursor-pointer'
                />
                <label htmlFor={category.value} className='cursor-pointer text-slate-700'>{category.label}</label>
              </div>
            ))}
          </form>
        </div>

        
        <div className='flex flex-col justify-start p-4 w-full h-full lg:shadow-lg lg:rounded-lg overflow-hidden'>
          <p className='font-medium text-slate-800 text-lg mb-2'>Search Results : {data.length}</p>
          
          {/* Scrollable Content Wrapper */}
          <div className='overflow-y-scroll scrollbar-none flex-1'>
            <div>
               {/* Offer Posters Section - inside scrollable area */}
            {selectedCategoryOfferPosters.length > 0 && (
              <div className='bg-white shadow-xl rounded-xl mb-4 w-full'>
                {selectedCategoryOfferPosters.map((category, index) => (
                  <div key={category.value} className={`${index === offerPosterIndex ? 'block' : 'hidden'}`}>
                    <img
                      src={category.offerPoster.image}
                      alt={category.label}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Carousel Dots BELOW the Image */}
              {selectedCategoryOfferPosters.length > 0 && (
                <div className="flex justify-center items-center space-x-2 mt-5 mb-4">
                  {selectedCategoryOfferPosters.map((_, index) => {
                    if (Math.abs(index - offerPosterIndex) > 1) return null; // Show only previous, current, next
                    return (
                      <button
                        key={index}
                        onClick={() => setOfferPosterIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          offerPosterIndex === index ? 'bg-black w-8' : 'bg-gray-300 w-4'
                        }`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
           

            {/* Products Grid */}
            <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
              {loading ? (
                <p>Loading...</p>
              ) : data.length > 0 ? (
                data.map((product) => (
                  <VerticalCard key={product._id} data={product} className="w-full" />
                ))
              ) : (
                <p className="col-span-full text-center py-10">
                  {validParentCategory && !Object.keys(selectCategory).some(k => selectCategory[k])
                    ? "No products found for this category"
                    : "No products found for the selected categories"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;



