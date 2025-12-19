// import React, { useState } from 'react'
// import { MdModeEditOutline } from "react-icons/md";
// import AdminEditProduct from './AdminEditProduct';
// import displayINRCurrency from '../helpers/displayCurrency';

// const AdminProductCard = ({ data, fetchdata }) => {
//   const [editProduct, setEditProduct] = useState(false)

//   return (
//     <div className='bg-white p-4 rounded shadow-lg flex flex-col items-center'>
//       <div className='w-32 h-32 flex justify-center items-center'>
//         <img
//           src={data?.productImage[0]}
//           alt={data?.productName}
//           className='max-h-full max-w-full object-contain'
//         />
//       </div>

//       <h1 className='text-center text-sm font-medium mt-3 line-clamp-2'>
//         {data.productName}
//       </h1>

//       <div className="w-full flex justify-between items-center mt-3">
//         <p className='font-semibold text-red-500 text-base'>
//           {displayINRCurrency(data.sellingPrice)}
//         </p>

//         <button
//           className="p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
//           onClick={() => setEditProduct(true)}
//         >
//           <MdModeEditOutline size={20} />
//         </button>

//       </div>

//       {editProduct && (
//         <AdminEditProduct
//           productData={data}
//           onClose={() => setEditProduct(false)}
//           fetchdata={fetchdata}
//         />
//       )}

//     </div>
//   )
// }

// export default AdminProductCard

import React, { useState } from 'react';
import { MdModeEditOutline } from 'react-icons/md';
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false);

  return (
    <div className="bg-white p-4 rounded shadow-lg flex flex-col items-center">
      <div className="w-32 h-32 flex justify-center items-center">
        {(() => {
          // Check if productImage is an array of objects or a simple array of strings
          if (Array.isArray(data.productImage)) {
            // Handle the case where productImage is an array of objects
            if (typeof data.productImage[0] === "object") {
              const firstImage = data.productImage.find((media) => media.type === "image");
              const firstVideo = data.productImage.find((media) => media.type === "video");

              if (firstImage) {
                return (
                  <img
                    src={firstImage.url}
                    alt={data?.altTitle || 'product'}
                    title={data?.altTitle || 'product'}
                    className="max-h-full max-w-full object-contain bg-slate-100 border rounded"
                  />
                );
              } else if (firstVideo) {
                return (
                  <video
                    src={firstVideo.url}
                    width={128}
                    height={128}
                    controls
                    className="max-h-full max-w-full object-contain bg-slate-100 border rounded"
                  />
                );
              } else {
                return <div className="text-xs text-gray-500">No preview available</div>;
              }
            } else {
              // Handle the case where productImage is an array of strings
              return (
                <img
                  src={data.productImage[0]}
                  alt={data?.altTitle || 'product'}
                  title={data?.altTitle || 'product'}
                  className="max-h-full max-w-full object-contain bg-slate-100 border rounded"
                />
              );
            }
          } else {
            return <div className="text-xs text-gray-500">No preview available</div>;
          }
        })()}
      </div>

      <h1 className="text-center text-sm font-medium mt-3 line-clamp-2">
        {data.productName}
      </h1>

      <div className="w-full flex justify-between items-center mt-3">
        <p className="font-semibold text-red-500 text-base">
          {displayINRCurrency(data.sellingPrice)}
        </p>

        <button
          className="p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
          onClick={() => setEditProduct(true)}
        >
          <MdModeEditOutline size={20} />
        </button>
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
