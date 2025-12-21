import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryLoading = new Array(5).fill(null); // Placeholder for loading states

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getActiveParentCategories.url);
      const data = await response.json();
      
      // Validate if data contains categories and is an array
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories); // Directly set categories without filtering
      } else {
        console.error("Error: Invalid category data structure");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className='mx-auto px-2 py-4'>
      <div className='flex items-center gap-4 overflow-x-auto scrollbar-none scroll-pl-4 pl-2 sm:pl-0 md:justify-center '>
        {loading
          ? categoryLoading.map((_, index) => (
              <div
                className='h-16 w-16 md:w-20 md:h-20 rounded-md bg-white animate-pulse min-w-[80px] snap-start'
                key={`categoryLoading${index}`}
              ></div>
            ))
          : categories.length > 0 ? (
              categories.map((category) => {
                // Ensure category.name and category._id are defined
                if (category?.name && category._id) {
                  return (
                    <Link
                      to={`/product-category?parentCategory=${encodeURIComponent(category.name)}&category=${encodeURIComponent(category._id)}`} // Use category.name as parentCategory in the URL
                      className='cursor-pointer flex flex-col items-center min-w-[80px] snap-start'
                      key={category?._id} // Use category _id as the unique key
                    >
                      <div className='w-14 h-14 md:w-16 md:h-16 overflow-hidden flex items-center justify-center mt-2 lg:mt-0 position-relative'>
                        <img
                          src={category?.categoryImage}
                          alt={category?.name} // Use category name for alt text
                          className='w-12 h-12 object-cover'
                        />
                      </div>
                      <div className='text-xs md:text-sm lg:text-md font-medium text-center max-w-60 mt-2 lg:mt-0'>
                        {category?.name} {/* Use name for displaying the category label */}
                      </div>
                    </Link>
                  );
                } else {
                  console.error('Category data is incomplete', category);
                  return null;
                }
              })
            ) : (
              <p className='text-center font-medium text-[#6A7282]'>No categories available.</p> // Fallback message if no categories
            )}
      </div>
    </div>
  );
};

export default CategoryList;