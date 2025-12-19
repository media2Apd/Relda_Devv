import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SummaryApi from '../common';
import VerticalCard from '../components/VerticalCard';

const SearchProduct = () => {
  const query = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);

    try {
      const response = await fetch(SummaryApi.searchProduct.url + query.search);
      const dataResponse = await response.json();

      if (dataResponse && dataResponse.data) {
        // Sort by isHidden: false first
        const sortedProducts = dataResponse.data.sort((a, b) => a.isHidden - b.isHidden);
        setData(sortedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [query]);

  return (
    <div className='container mx-auto px-2 md:px-4 mt-14'>
      {loading && <p className='text-lg text-center'>Loading ...</p>}

      <p className='text-lg font-semibold my-3'>Search Results: {data.length}</p>

      {!loading && data.length === 0 && (
        <p className='bg-white text-lg text-center p-4'>No Data Found....</p>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {!loading &&
          data.map((product, index) => (
            <VerticalCard key={product._id || index} loading={false} data={product} />
          ))}
      </div>
    </div>
  );
};

export default SearchProduct;
