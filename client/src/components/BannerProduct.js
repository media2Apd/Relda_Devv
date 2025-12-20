    


// import React, { useEffect, useState } from 'react';
// import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';

// const BannerProduct = () => {
//     const [currentImage, setCurrentImage] = useState(0);
//     const [desktopImages, setDesktopImages] = useState([]);
//     const [mobileImages, setMobileImages] = useState([]);

//     const fetchImages = async () => {
//         try {
//             const response = await fetch('/api/images');
//             const data = await response.json();
//             setDesktopImages(data.desktopImages);
//             setMobileImages(data.mobileImages);
//         } catch (error) {
//             console.error('Error fetching images:', error);
//         }
//     };

//     useEffect(() => {
//         fetchImages();
//     }, []);

//     const nextImage = () => {
//         if (desktopImages.length - 1 > currentImage) {
//             setCurrentImage((prev) => prev + 1);
//         }
//     };

//     const prevImage = () => {
//         if (currentImage !== 0) {
//             setCurrentImage((prev) => prev - 1);
//         }
//     };

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (desktopImages.length - 1 > currentImage) {
//                 nextImage();
//             } else {
//                 setCurrentImage(0);
//             }
//         }, 5000);

//         return () => clearInterval(interval);
//     }, [currentImage]);

//     return (
//         <div className="container mx-auto px-4 rounded">
//             <div className="h-56 md:h-72 w-full bg-slate-200 relative">
//                 <div className="absolute z-10 h-full w-full md:flex items-center hidden">
//                     <div className="flex justify-between w-full text-2xl">
//                         <button onClick={prevImage} className="bg-white shadow-md rounded-full p-1"><FaAngleLeft /></button>
//                         <button onClick={nextImage} className="bg-white shadow-md rounded-full p-1"><FaAngleRight /></button>
//                     </div>
//                 </div>

//                 <div className="hidden md:flex h-full w-full overflow-hidden">
//                     {desktopImages.map((imageURL, index) => (
//                         <div className="w-full h-full min-w-full min-h-full transition-all" key={index} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
//                             <img src={imageURL} className="w-full h-full" alt={`Banner ${index + 1}`} />
//                         </div>
//                     ))}
//                 </div>

//                 <div className="flex h-full w-full overflow-hidden md:hidden">
//                     {mobileImages.map((imageURL, index) => (
//                         <div className="w-full h-full min-w-full min-h-full transition-all" key={index} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
//                             <img src={imageURL} className="w-full h-full object-cover" alt={`Banner ${index + 1}`} />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BannerProduct;
// import React, { useEffect, useState } from 'react'

// import image1 from '../assest/banner/bandesk.png'
// import image2 from '../assest/banner/bandesk1.png'
// import image4 from '../assest/banner/bandesk2.png'
// import image3 from '../assest/banner/bandesk3.png'
// import image5 from '../assest/banner/bandesk4.png'


// import image1Mobile from '../assest/banner/banmob.png'
// import image2Mobile from '../assest/banner/banmob1.png'
// import image3Mobile from '../assest/banner/banmob2.png'
// import image4Mobile from '../assest/banner/banmob3.png'
// import image5Mobile from '../assest/banner/banmob4.png'

// import { FaAngleRight } from "react-icons/fa6";
// import { FaAngleLeft } from "react-icons/fa6";


// const BannerProduct = () => {
//     const [currentImage,setCurrentImage] = useState(0)

//     const desktopImages = [
//         image1,
//         image2,
//         image3,
//         image4,
//         image5
//     ]

//     const mobileImages = [
//         image1Mobile,
//         image2Mobile,
//         image3Mobile,
//         image4Mobile,
//         image5Mobile
//     ]

//     const nextImage = () =>{
//         if(desktopImages.length - 1 > currentImage){
//             setCurrentImage(preve => preve + 1)
//         }
//     }

//     const preveImage = () =>{
//         if(currentImage != 0){
//             setCurrentImage(preve => preve - 1)
//         }
//     }


//     useEffect(()=>{
//         const interval = setInterval(()=>{
//             if(desktopImages.length - 1 > currentImage){
//                 nextImage()
//             }else{
//                 setCurrentImage(0)
//             }
//         },5000)

//         return ()=> clearInterval(interval)
//     },[currentImage])

//   return (
//     <div className='container mx-auto px-4 rounded '>
//         <div className='h-full w-full bg-slate-200 relative'>

//                 <div className='absolute z-10 h-full w-full md:flex items-center hidden '>
//                     <div className=' flex justify-between w-full text-2xl'>
//                         <button onClick={preveImage} className='bg-white shadow-md rounded-full p-1'><FaAngleLeft/></button>
//                         <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1'><FaAngleRight/></button> 
//                     </div>
//                 </div>

//                 {/**desktop and tablet version */}
//               <div className='hidden md:flex h-full w-full overflow-hidden'>
//                 {
//                         desktopImages.map((imageURl,index)=>{
//                             return(
//                             <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
//                                 <img src={imageURl} className='w-full h-full' alt='banimages'/>
//                             </div>
//                             )
//                         })
//                 }
//               </div>
//              {/* Desktop & Tablet Indicators */}
// {/* <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 space-x-2 hidden md:flex">
//   {desktopImages.map((_, index) => (
//     <button
//       key={index}
//       onClick={() => setCurrentImage(index)}
//       className={`w-2 h-2 rounded-full transition-all duration-300 ${
//         currentImage === index ? "bg-white" : "bg-gray-400"
//       }`}
//     ></button>
//   ))}
// </div>

// {/* Mobile Indicators */}
// {/* <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 space-x-2 flex md:hidden z-10">


//   {mobileImages.map((_, index) => (
//     <button
//       key={index}
//       onClick={() => setCurrentImage(index)}
//       className={`w-1 h-1 rounded-full transition-all duration-300 ${
//         currentImage === index ? "bg-white" : "bg-gray-400"
//       }`}
//     ></button>
//   ))}
// </div>  */}

// {/* Carousel Thumbnails */}
// {/* Carousel Dots – works on all screens */}
// {/* Carousel Dots Under the Image */}
// <div className="flex justify-center items-center mt-4 space-x-2">
//   {(window.innerWidth < 768 ? mobileImages : desktopImages).map((_, index) => (
//     <button
//       key={index}
//       onClick={() => setCurrentImage(index)}
//       className={`w-3 h-3 rounded-full transition-all duration-300 ${
//         currentImage === index ? 'bg-red-600' : 'bg-gray-400'
//       }`}
//     ></button>
//   ))}
// </div>





//                 {/**mobile version */}
//                 <div className='flex h-full w-full overflow-hidden md:hidden'>
//                 {
//                         mobileImages.map((imageURl,index)=>{
//                             return(
//                             <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
//                                 <img src={imageURl} className='w-full h-full object-cover' alt='banimages'/>
//                             </div>
//                             )
//                         })
//                 }
//               </div>


//         </div>
//     </div>
//   )
// }

// // export default BannerProduct
// import React, { useEffect, useState } from 'react'

// import image1 from '../assest/banner/bandesk.png'
// import image2 from '../assest/banner/bandesk1.png'
// import image3 from '../assest/banner/bandesk2.png'
// import image4 from '../assest/banner/bandesk3.png'
// import image5 from '../assest/banner/bandesk4.png'

// import image1Mobile from '../assest/banner/banmob.png'
// import image2Mobile from '../assest/banner/banmob1.png'
// import image3Mobile from '../assest/banner/banmob2.png'
// import image4Mobile from '../assest/banner/banmob3.png'
// import image5Mobile from '../assest/banner/banmob4.png'

// import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

// const BannerProduct = () => {
//   const [currentImage, setCurrentImage] = useState(0);

//   const desktopImages = [image1, image2, image3, image4, image5];
//   const mobileImages = [image1Mobile, image2Mobile, image3Mobile, image4Mobile, image5Mobile];

//   const nextImage = () => {
//     setCurrentImage((prev) => (prev + 1) % desktopImages.length);
//   };

//   const prevImage = () => {
//     setCurrentImage((prev) => (prev - 1 + desktopImages.length) % desktopImages.length);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextImage();
//     }, 5000); // 5 seconds

//     return () => clearInterval(interval);
//   }, [currentImage]);

//   const images = window.innerWidth < 768 ? mobileImages : desktopImages;

//   return (
//     <div className="container mx-auto px-4 rounded">
      
//       <div className="relative h-full w-full bg-slate-200 overflow-hidden">

//         {/* Navigation Arrows (for desktop only) */}
//         <div className="absolute z-10 h-full w-full md:flex items-center hidden">
//           <div className="flex justify-between w-full text-2xl px-4">
//             <button onClick={prevImage} className="bg-white shadow-md rounded-full p-1">
//               <FaAngleLeft />
//             </button>
//             <button onClick={nextImage} className="bg-white shadow-md rounded-full p-1">
//               <FaAngleRight />
//             </button>
//           </div>
//         </div>

//         {/* Desktop Images */}
//         <div className="hidden md:flex h-full w-full">
//           {desktopImages.map((imageUrl, index) => (
//             <div
//               key={index}
//               className="w-full h-full min-w-full transition-all duration-500"
//               style={{ transform: `translateX(-${currentImage * 100}%)` }}
//             >
//               <img src={imageUrl} className="w-full h-full object-cover" alt="banner" />
//             </div>
//           ))}
//         </div>

//         {/* Mobile Images */}
//         <div className="flex md:hidden h-full w-full">
//           {mobileImages.map((imageUrl, index) => (
//             <div
//               key={index}
//               className="w-full h-full min-w-full transition-all duration-500"
//               style={{ transform: `translateX(-${currentImage * 100}%)` }}
//             >
//               <img src={imageUrl} className="w-full h-full object-cover" alt="banner" />
//             </div>
//           ))}
//         </div>

//       </div>

//       {/* Dots placed OUTSIDE under image */}
//       <div className="flex justify-center items-center space-x-2 mt-4">
//         {images.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentImage(index)}
//             className={`
//               h-2 rounded-full transition-all duration-500
//               ${currentImage === index ? 'w-8 bg-red-600' : 'w-2 bg-gray-300'}
//             `}
//           ></button>
//         ))}
//       </div>

//     </div>
//   );
// }

// export default BannerProduct;

import React, { useEffect, useState } from "react";
import useBannerImages from "../hooks/useBannerImages";

const BannerProduct = () => {
  const { banners, loading } = useBannerImages();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [banners]);

  if (loading) {
    return (
      <div className="w-full h-[300px] bg-gray-100 animate-pulse" />
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-black">

      {/* Slider */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((item, index) => (
          <div key={item.id || index} className="w-full flex-shrink-0">
            <img
              src={item.imageUrl}
              alt="banner"
              className="
                w-full
                max-h-[520px]
                mx-auto
              "
            />
                        {/* <img
              src={item.imageUrl}
              alt="banner"
              className="
                w-full
                h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px]
                object-cover md:object-contain
                mx-auto
              "
            /> */}
          </div>
        ))}
      </div>

      {/* Indicator line (inside image) */}
      {/* {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`
                h-[3px] transition-all duration-500
                ${current === index ? "w-10 bg-[#e60000]" : "w-10 bg-white"}
              `}
            />
          ))}
        </div>
      )} */}
{banners.length > 1 && (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
    {banners.map((_, index) => (
      <div
        key={index}
        className="relative w-10 h-[3px] bg-white overflow-hidden"
      >
        {current === index && (
          <div
            key={current} // reset animation
            className="
              absolute left-0 top-0
              h-full w-full
              bg-[#e60000]
              origin-left
              animate-progress
            "
          />
        )}
      </div>
    ))}
  </div>
)}


    </div>
  );
};

export default BannerProduct;