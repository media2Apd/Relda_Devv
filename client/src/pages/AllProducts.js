// import React, { useEffect, useState } from 'react'
// import UploadProduct from '../components/UploadProduct'
// import SummaryApi from '../common'
// import AdminProductCard from '../components/AdminProductCard'

// const AllProducts = () => {
//   const [openUploadProduct, setOpenUploadProduct] = useState(false)
//   const [allProduct, setAllProduct] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const fetchAllProduct = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(SummaryApi.allProduct.url)
//       const dataResponse = await response.json()
//       setAllProduct(dataResponse?.data || []);
//     } catch (err) {
//       setError('Failed to fetch product data.');
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchAllProduct()
//   }, [])

//   return (
//     <div className="min-h-screen p-1 md:p-4">
//       <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
//         <h2 className='font-bold text-xl text-gray-900'>All Product</h2>
//         <button className='border-2 border-brand-primary text-brand-primary hover:bg-brand-primaryHover hover:text-white transition-all py-2 px-4 rounded-full ' onClick={() => setOpenUploadProduct(true)}>Upload Product</button>
//       </div>

//       {/**Product Grid Section */}
//       <div className="bg-gray-100 p-6">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-[calc(100vh-190px)]">
//             <p className="text-brand-textMuted">Loading products...</p>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center h-[calc(100vh-190px)]">
//             <p className="text-brand-primary">{error}</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {allProduct.map((product, index) => (
//               <AdminProductCard
//                 data={product}
//                 key={index + "allProduct"}
//                 fetchdata={fetchAllProduct}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Upload Product Modal */}
//       {openUploadProduct && (
//         <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
//       )}

//     </div>
//   )
// }

// export default AllProducts

import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allProduct, setAllProduct] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const fetchAllProduct = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(SummaryApi.allProduct.url)
      const dataResponse = await response.json()
      setAllProduct(dataResponse?.data || [])
    } catch (err) {
      setError('Failed to fetch product data.')
    } finally {
      setIsLoading(false)
    }
  }

  /* 🔥 ZOHO SYNC BUTTON HANDLER */
  const handleZohoSync = async () => {
    try {
      setIsSyncing(true)

      const res = await fetch('http://localhost:8080/api/sync-zoho-variants', {
        method: 'POST'
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.message || 'Zoho sync failed')
      }

      alert('Zoho product sync started successfully')

      // Optional: refresh product list after few seconds
      setTimeout(() => {
        fetchAllProduct()
      }, 3000)

    } catch (err) {
      alert(err.message)
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    fetchAllProduct()
  }, [])

  return (
    <div className="min-h-screen p-1 md:p-4">
      <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
        <h2 className='font-bold text-xl text-gray-900'>All Product</h2>

        <div className="flex gap-3">
          {/* 🔄 ZOHO SYNC BUTTON */}
          <button
            onClick={handleZohoSync}
            disabled={isSyncing}
            className={`border-2 px-4 py-2 rounded-full transition-all
              ${isSyncing
                ? 'border-gray-400 text-gray-400 cursor-not-allowed'
                : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
              }`}
          >
            {isSyncing ? 'Syncing…' : 'Sync Zoho Products'}
          </button>

          {/* ➕ UPLOAD PRODUCT */}
          <button
            className='border-2 border-brand-primary text-brand-primary hover:bg-brand-primaryHover hover:text-white transition-all py-2 px-4 rounded-full'
            onClick={() => setOpenUploadProduct(true)}
          >
            Upload Product
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="bg-gray-100 p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-[calc(100vh-190px)]">
            <p className="text-brand-textMuted">Loading products...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[calc(100vh-190px)]">
            <p className="text-brand-primary">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProduct.map((product, index) => (
              <AdminProductCard
                data={product}
                key={index + "allProduct"}
                fetchdata={fetchAllProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  )
}

export default AllProducts
