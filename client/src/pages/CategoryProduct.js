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
          const filteredCategories = dataJson.categories.filter(category => category.productCount > 0 && category.zohoProductCount > 0);

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
                  className="w-full h-auto object-contain"
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