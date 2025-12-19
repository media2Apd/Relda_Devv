import React, { useState } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import loginIcons from '../assest/signin.gif';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSubmit = async(e) =>{
      e.preventDefault()

      try{

      // if(data.password === data.confirmPassword){

        const dataResponse = await fetch(SummaryApi.signUP.url,{
            method : SummaryApi.signUP.method,
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(data)
          })
    
          const result = await dataResponse.json()

      //     if(dataApi.success){
      //       toast.success(dataApi.message)
      //       navigate("/login")
      //     }

      //     if(dataApi.error){
      //       toast.error(dataApi.message)
      //     }
    
      // }else{
      //   toast.error("Please check password and confirm password")
      // }

            if (result.success) {
              toast.success(result.message);
              navigate('/login');
            } else {
              if (result.details) {
                const fieldErrors = {};
                result.details.forEach((detail) => {
                  fieldErrors[detail.field] = detail.message;
                });
                setErrors(fieldErrors);
              } else {
                toast.error(result.message);
              }
            }
          } catch (error) {
            toast.error('Something went wrong!');
          }
        }
 

  return (
    <section id='signup'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
            <img src={data.profilePic || loginIcons} alt='login icons' />
          </div>

          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='grid'>
              <label className='block text-sm font-medium mb-1'>Name:</label>
              <div className='bg-slate-100 border rounded p-2 focus-within:border-red-600'>
                <input
                  type='text'
                  placeholder='Enter your name'
                  name='name'
                  value={data.name}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'
                  autoComplete='username'
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

            </div>
            <div className='grid'>
              <label className='block text-sm font-medium mb-1'>Email:</label>
              <div className='bg-slate-100 border rounded p-2 focus-within:border-red-600'>
                <input
                  type='email'
                  placeholder='Enter email'
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'
                />

              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

            </div>
            <div>
            <label className="block text-sm font-medium mb-1">Mobile:</label>

            <div className="flex items-center border rounded px-3 py-2 bg-slate-100 focus-within:border-red-600">
                <ReactPhoneInput
                    country="in"
                    value={data.mobile}
                    onChange={(phone) => handleOnChange({ target: { name: 'mobile', value: phone } })}
                    inputClass="flex-1 outline-none bg-transparent border-none"
                    buttonClass="bg-transparent border-none"
                    containerClass="flex w-full items-center"
                    dropdownClass="bg-white"
                />

            </div>
            {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}

            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Password:</label>
              <div className='bg-slate-100 border rounded p-2 flex focus-within:border-red-600'>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter password'
                  value={data.password}
                  name='password'
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'
                  autoComplete='password'
                />
                <div
                  className='cursor-pointer text-xl'
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Confirm Password:</label>
              <div className='bg-slate-100 border rounded p-2 flex focus-within:border-red-600'>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder='Enter confirm password'
                  value={data.confirmPassword}
                  name='confirmPassword'
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'
                  autoComplete='confirm-password'
                />
                <div
                  className='cursor-pointer text-xl'
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}

            </div>

            <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>
              Sign Up
            </button>
          </form>

          <p className='my-5'>
            Already have an account?{" "}
            <Link to={"/login"} className='text-red-600 hover:text-red-700 hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;