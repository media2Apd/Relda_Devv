// import React from 'react'
// import { CgClose } from 'react-icons/cg'

// const DisplayImage = ({
//     imgUrl,
//     onClose
// }) => {
//   return (
//     <div className='fixed bottom-0 top-0 right-0 left-0 flex justify-center items-center'>

//         <div className='bg-white shadow-lg rounded max-w-5xl mx-auto p-4'>
//                 <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
//                     <CgClose/>
//                 </div>


//                 <div className='flex justify-center p-4 max-w-[80vh] max-h-[80vh]'>
//                 <img src={imgUrl} alt="product" className='w-full h-full'/>
//                 </div>
//         </div>
  


//     </div>
//   )
// }

// export default DisplayImage

// import React from 'react'
// import { CgClose } from 'react-icons/cg'

// const DisplayImage = ({
//     imgUrl,
//     onClose
// }) => {
  
//   // Detect if the URL is a video based on Cloudinary's URL structure
//   // Usually video URLs contain "/video/upload/"
//   const isVideo = imgUrl?.includes("/video/");

//   return (
//     <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4'>

//         <div className='bg-white shadow-lg rounded-lg max-w-5xl w-full mx-auto p-2 relative'>
                
//                 {/* Close Button */}
//                 <div 
//                     className='absolute -top-10 right-0 md:-right-10 text-3xl text-white hover:text-red-500 cursor-pointer transition-colors' 
//                     onClick={onClose}
//                 >
//                     <CgClose/>
//                 </div>

//                 <div className='flex justify-center items-center overflow-hidden bg-gray-100 rounded-md'>
//                     {
//                         isVideo ? (
//                             <video 
//                                 src={imgUrl} 
//                                 controls 
//                                 autoPlay 
//                                 className='max-w-full max-h-[80vh] object-contain'
//                             />
//                         ) : (
//                             <img 
//                                 src={imgUrl} 
//                                 alt="Product Preview" 
//                                 className='max-w-full max-h-[80vh] object-contain'
//                             />
//                         )
//                     }
//                 </div>
//         </div>
//     </div>
//   )
// }

// export default DisplayImage

import React from 'react'
import { CgClose } from 'react-icons/cg'

const DisplayImage = ({
    imgUrl,
    onClose
}) => {
  
  // Video check
  const isVideo = imgUrl?.includes("/video/");

  return (
    <div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[1000] p-4'>

        <div className='bg-white shadow-2xl rounded-lg max-w-[90%] md:max-w-4xl w-fit mx-auto relative overflow-hidden'>
                
                <div 
                    className='absolute top-2 right-2 text-2xl bg-white bg-opacity-80 rounded-full p-1 hover:text-red-600 cursor-pointer transition-all z-10' 
                    onClick={onClose}
                >
                    <CgClose/>
                </div>

                {/* Main Media Section */}
                <div className='flex justify-center items-center p-2 bg-gray-50'>
                    {
                        isVideo ? (
                            <video 
                                src={imgUrl} 
                                controls 
                                autoPlay 
                                className='max-w-full max-h-[50vh] object-contain'
                            />
                        ) : (
                            <img 
                                src={imgUrl} 
                                alt="Product Preview" 
                                className='max-w-full max-h-[45vh] object-contain'
                            />
                        )
                    }
                </div>
        </div>
    </div>
  )
}

export default DisplayImage