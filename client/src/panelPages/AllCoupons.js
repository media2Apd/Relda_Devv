import React, { useEffect, useState } from 'react'
import UploadCoupon from '../panelComponents/UploadCoupon';
import SummaryApi from '../common';
import AdminCouponCard from '../panelComponents/AdminCouponCard';

const AllCoupons = () => {
  const [openUpload, setOpenUpload] = useState(false)
  const [allCoupons, setAllCoupons] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAllCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.allCoupons.url)
      const dataResponse = await response.json()
      setAllCoupons(dataResponse?.data || []);
    } catch (err) {
      console.error('Failed to fetch coupons');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllCoupons()
  }, [])

  return (
    <div className="min-h-screen p-4">
      <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
        <h2 className='font-bold text-xl text-gray-900'>All Coupons</h2>
        <button 
          className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-2 px-4 rounded-full' 
          onClick={() => setOpenUpload(true)}
        >
          Add New Coupon
        </button>
      </div>

      <div className="bg-gray-100 p-6 mt-4 rounded-lg">
        {isLoading ? (
          <p className="text-center py-10">Loading coupons...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCoupons.map((coupon) => (
              <AdminCouponCard
                key={coupon._id}
                data={coupon}
                fetchData={fetchAllCoupons}
              />
            ))}
          </div>
        )}
      </div>

      {openUpload && (
        <UploadCoupon onClose={() => setOpenUpload(false)} fetchData={fetchAllCoupons} />
      )}
    </div>
  )
}

export default AllCoupons