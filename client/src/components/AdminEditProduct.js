import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const AdminEditProduct = ({
    onClose,
    productData,
    fetchdata
}) => {
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [data, setData] = useState({
        ...productData,
        productName: productData?.productName,
        brandName: productData?.brandName,
        category: productData?.category,
        productImage: productData?.productImage || [],
        description: productData?.description,
        price: productData?.price,
        sellingPrice: productData?.sellingPrice,
        isHidden: productData?.isHidden || false,
        specifications: productData?.specifications|| [],// Add specifications field to state
        availability: productData?.availability || 0,
        altTitle: productData?.altTitle || "", // Add altTitle field to state
        // offer: '', // Add offer field to state
        // userId: '', // Add userId field to state
    });

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    useEffect(() => {
        // Fetch categories or any other necessary data here
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(SummaryApi.allUser.url);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        }
    };
    
    const handleOnChange = (e) => {
        const { name, value, type, checked } = e.target;

        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle uploading product images
    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        const uploadImageCloudinary = await uploadImage(file);

        setData(prev => ({
            ...prev,
            productImage: [...prev.productImage, uploadImageCloudinary.url]
        }));
    };

    const handleDeleteProductImage = async (index) => {
        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);

        setData(prev => ({
            ...prev,
            productImage: [...newProductImage]
        }));
    };

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

    // Handle adding/removing specifications
    const handleSpecificationChange = (index, e) => {
        const { name, value } = e.target;

        const updatedSpecifications = [...data.specifications];
        updatedSpecifications[index][name] = value;

        setData(prev => ({
            ...prev,
            specifications: updatedSpecifications
        }));
    };

    const addSpecification = () => {
        setData(prev => ({
            ...prev,
            specifications: [...prev.specifications, { key: "", value: "" }]
        }));
    };

    const removeSpecification = (index) => {
        const updatedSpecifications = [...data.specifications];
        updatedSpecifications.splice(index, 1);
        setData(prev => ({
            ...prev,
            specifications: updatedSpecifications
        }));
    };

    // Handle form submission (update product)
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Remove empty specifications
        const filteredSpecifications = data.specifications.filter(spec => spec.key && spec.value);
        const payload = {
            ...data,
            specifications: filteredSpecifications  // Ensure only valid specifications are sent
        };
    
        console.log('Request payload:', JSON.stringify(payload));  // Log data for debugging
    
        try {
            const response = await fetch(SummaryApi.updateProduct.url, {
                method: SummaryApi.updateProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(payload)
            });
    
            const responseData = await response.json();
    
            if (responseData.success) {
                toast.success(responseData?.message);
                onClose();
                fetchdata();
            } else {
                toast.error(responseData?.message || "Failed to update product");
                console.error(responseData);  // Log error for debugging
            }
    
        } catch (err) {
            toast.error(err.message || "An error occurred");
            console.error(err);  // Log any errors for debugging
        }
    };
    

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center lg:pt-24'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Edit Product</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    <label htmlFor='productName'>Product Name :</label>
                    <input
                        type='text'
                        id='productName'
                        placeholder='enter product name'
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
                        placeholder='enter brand name'
                        value={data.brandName}
                        name='brandName'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='category' className='mt-3'>Category :</label>
                    <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
                        <option value={""}>Select Category</option>
                        {
                            categories.map((el, index) => {
                                return (
                                    <option value={el.value} key={el.value + index}>{el.label}</option>
                                )
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
                    <div>
                        {
                            data?.productImage[0] ? (
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
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <p className='text-red-600 text-xs'>*Please upload product image</p>
                            )
                        }
                    </div>
		   <label htmlFor='altTitle' className='mt-3'>Alt Title :</label>
                    <input
                        type='text'
                        id='altTitle'
                        placeholder='Enter alt title'
                        value={data.altTitle}
                        name='altTitle'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
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
                        placeholder='enter price'
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
                        placeholder='enter selling price'
                        value={data.sellingPrice}
                        name='sellingPrice'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='description' className='mt-3'>Description :</label>
                    <textarea
                        className='h-28 bg-slate-100 border resize-none p-1'
                        placeholder='enter product description'
                        rows={3}
                        onChange={handleOnChange}
                        name='description'
                        value={data.description}
                    >
                    </textarea>
                    


                    {/* Specifications Section */}
                    <label className='mt-3'>Specifications:</label>
                    {data.specifications.map((spec, index) => (
                        <div className='flex gap-2' key={index}>
                            <input
                                type='text'
                                name='key'
                                placeholder='Specification Name'
                                value={spec.key}
                                onChange={(e) => handleSpecificationChange(index, e)}
                                className='p-2 bg-slate-100 border rounded'
                            />
                            <input
                                type='text'
                                name='value'
                                placeholder='Specification Value'
                                value={spec.value}
                                onChange={(e) => handleSpecificationChange(index, e)}
                                className='p-2 bg-slate-100 border rounded'
                            />
                            <button
                                type='button'
                                onClick={() => removeSpecification(index)}
                                className='text-red-600'
                            >
                                <MdDelete />
                            </button>
                        </div>
                    ))}
                    <button
                        type='button'
                        onClick={addSpecification}
                        aria-label='Add a new specification'
                        className='mt-2 text-blue-600'
                    >
                        Add Specification
                    </button>

                    <div className='mt-3 flex items-center'>
                        <input
                            type='checkbox'
                            id='isHidden'
                            name='isHidden'
                            checked={data.isHidden}
                            onChange={handleOnChange}
                            className='mr-2'
                        />
                        <label htmlFor='isHidden'>Hide Product</label>
                    </div>

                    <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Update Product</button>
                </form>

            </div>

            {/***display image full screen */}
            {
                openFullScreenImage && (
                    <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
                )
            }

        </div>
    );
}

export default AdminEditProduct;
