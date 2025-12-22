import React, { useState, useEffect } from 'react'
import { CgClose } from "react-icons/cg";
// import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import uploadMedia from '../helpers/uploadImage';

const UploadProduct = ({
    onClose,
    fetchData
}) => {
  const [categories, setCategories] = useState([]);

    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [], // now stores { url, type }

        description: "",
        price: "",
        sellingPrice: "",
        specifications: [],// Store specifications as an array of objects (key-value pairs)
        availability:0,
        altTitle: "", // New field for alt text

    });

   
      const fetchCategories = async () => {
        try {
          const response = await fetch(SummaryApi.getProductCategory.url);
          const data = await response.json();
    
          if (data.success) {
            setCategories(data.categories);
          } else {
            console.error("Error fetching categories");
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      useEffect(() => {
        fetchCategories();
      }, []);

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleUploadProduct = async (e) => {
    //     const file = e.target.files[0];
    //     const uploadImageCloudinary = await uploadImage(file);
    //     const secureUrl = uploadImageCloudinary.url.replace('http://', 'https://');

    //     setData((prev) => ({
    //         ...prev,
    //         productImage: [...prev.productImage, secureUrl]
    //     }));
    // };
    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
      
        try {
          const uploadResult = await uploadMedia(file);
      
          setData((prev) => ({
            ...prev,
            productImage: [...prev.productImage, uploadResult]
          }));
        } catch (error) {
          toast.error("Upload failed. Try again.");
        }
      };
      
    const handleDeleteProductImage = async (index) => {
        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);

        setData((prev) => ({
            ...prev,
            productImage: [...newProductImage]
        }));
    };

    // Add a new specification (key-value pair)
    const handleAddSpecification = () => {
        setData((prev) => ({
            ...prev,
            specifications: [...prev.specifications, { key: "", value: "" }]
        }));
    };

    // Handle specification input changes (key or value)
    const handleSpecificationChange = (index, field, value) => {
        const updatedSpecifications = [...data.specifications];
        updatedSpecifications[index][field] = value;

        setData((prev) => ({
            ...prev,
            specifications: updatedSpecifications
        }));
    };

    // Delete a specific specification (key-value pair)
    const handleDeleteSpecification = (index) => {
        const updatedSpecifications = [...data.specifications];
        updatedSpecifications.splice(index, 1);

        setData((prev) => ({
            ...prev,
            specifications: updatedSpecifications
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(SummaryApi.uploadProduct.url, {
            method: SummaryApi.uploadProduct.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData?.message);
            onClose();
            fetchData();
        }

        if (responseData.error) {
            toast.error(responseData?.message);
        }
    };

    return (
        <div className='fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center lg:pt-24'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Upload Product</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    <label htmlFor='productName'>Product Name :</label>
                    <input
                        type='text'
                        id='productName'
                        placeholder='Enter product name'
                        name='productName'
                        value={data.productName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
                    <input
                        type='text'
                        id='brandName'
                        placeholder='Enter brand name'
                        value={data.brandName}
                        name='brandName'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='category' className='mt-3'>Category :</label>
                    <select
                        required
                        value={data.category}
                        name='category'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'>
                        <option value={""}>Select Category</option>
                        {
                            categories.map((el, index) => {
                                return (
                                    <option value={el.value} key={el.value + index}>{el.label}</option>
                                );
                            })
                        }
                    </select>

                    <label htmlFor='productImage' className='mt-3'>Product Image :</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Upload Product Image</p>
                                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
                            </div>
                        </div>
                    </label>
                    {/* <div> */}
                        {/* { */}
                            {/* data?.productImage[0] ? (
                                <div className='flex items-center gap-2'>
                                    {
                                        data.productImage.map((el, index) => {
                                            return (
                                                <div className='relative group' key={index}>
                                                    <img
                                                        src={el}
                                                        alt={el}
                                                        width={80}
                                                        height={80}
                                                        className='bg-slate-100 border cursor-pointer'
                                                        onClick={() => {
                                                            setOpenFullScreenImage(true);
                                                            setFullScreenImage(el);
                                                        }} />
                                                    <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteProductImage(index)}>
                                                        <MdDelete />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            ) : (
                                <p className='text-red-600 text-xs'>*Please upload product image</p>
                            )
                        } */}
                        <div>
                        {
  data?.productImage.length > 0 ? (
    <div className='flex items-center gap-2 flex-wrap'>
      {
        data.productImage.map((el, index) => (
          <div className='relative group' key={index}>
            {el.type === 'video' ? (
              <video
                src={el.url}
                width={80}
                height={80}
                controls
                className='bg-slate-100 border cursor-pointer'
                onClick={() => {
                  setOpenFullScreenImage(true);
                  setFullScreenImage(el.url);
                }}
              />
            ) : (
              <img
                src={el.url}
                alt={`media-${index}`}
                width={80}
                height={80}
                className='bg-slate-100 border cursor-pointer'
                onClick={() => {
                  setOpenFullScreenImage(true);
                  setFullScreenImage(el.url);
                }}
              />
            )}
            <div
              className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer'
              onClick={() => handleDeleteProductImage(index)}
            >
              <MdDelete />
            </div>
          </div>
        ))
      }
    </div>
  ) : (
    <p className='text-red-600 text-xs'>*Please upload product image</p>
  )
}

                    </div>
		    <label htmlFor='altTitle' className='mt-3'>Alt Text for Image:</label>
                    <input
                        type='text'
                        id='altTitle'
                        placeholder='Enter alt text for image'
                        value={data.altTitle}
                        name='altTitle'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />        

                    <label htmlFor='availability' className='mt-3'>Availability:</label>
                    <input
                        type='number'
                        id='availability'
                        placeholder='Enter available quantity'
                        value={data.availability}
                        name='availability'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='price' className='mt-3'>Price :</label>
                    <input
                        type='number'
                        id='price'
                        placeholder='Enter price'
                        value={data.price}
                        name='price'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
                    <input
                        type='number'
                        id='sellingPrice'
                        placeholder='Enter selling price'
                        value={data.sellingPrice}
                        name='sellingPrice'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='description' className='mt-3'>Description :</label>
                    <textarea
                        className='h-28 bg-slate-100 border resize-none p-1'
                        placeholder='Enter product description'
                        rows={3}
                        onChange={handleOnChange}
                        name='description'
                        value={data.description}
                    >
                    </textarea>

                    {/* Specifications Section */}
                    <label htmlFor='specifications' className='mt-3'>Specifications:</label>
                    <div>
                        {data.specifications.map((spec, index) => (
                            <div key={index} className='flex gap-2 mb-2'>
                                <input
                                    type='text'
                                    className='p-2 bg-slate-100 border rounded w-1/2'
                                    placeholder='Key'
                                    value={spec.key}
                                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                                />
                                <input
                                    type='text'
                                    className='p-2 bg-slate-100 border rounded w-1/2'
                                    placeholder='Value'
                                    value={spec.value}
                                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                                />
                                <button
                                    type='button'
                                    className='text-red-600'
                                    onClick={() => handleDeleteSpecification(index)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        ))}
                        <button
                            type='button'
                            className='px-2 py-1 bg-green-600 text-white rounded'
                            onClick={handleAddSpecification}
                        >
                            Add Specification
                        </button>
                    </div>

                    <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Upload Product</button>
                </form>
            </div>

            {/* Display Image Full Screen */}
            {
                openFullScreenImage && (
                    <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
                )
            }

        </div>
    );
};

export default UploadProduct;
