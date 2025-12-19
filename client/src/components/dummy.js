// import React, { useContext, useEffect, useState } from 'react';
// import Logo from '../assest/banner/logo.png';
// import { GrSearch } from "react-icons/gr";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { GiHamburgerMenu } from 'react-icons/gi';
// import { FaShoppingCart } from "react-icons/fa";
// import { IoClose } from 'react-icons/io5';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';
// import { setUserDetails } from '../store/userSlice';
// import ROLE from '../common/role';
// import Context from '../context';

// const Header = () => {
//   const user = useSelector(state => state?.user?.user);
//   const dispatch = useDispatch();
//   const [menuDisplay, setMenuDisplay] = useState(false);
//   const [mobileMenuDisplay, setMobileMenuDisplay] = useState(false);
//   const context = useContext(Context);
//   const navigate = useNavigate();
//   const searchInput = useLocation();
//   const URLSearch = new URLSearchParams(searchInput?.search);
//   const searchQuery = URLSearch.getAll("q");
//   const [search, setSearch] = useState(searchQuery);

//   const handleLogout = async () => {
//     const fetchData = await fetch(SummaryApi.logout_user.url, {
//       method: SummaryApi.logout_user.method,
//       credentials: 'include',
//     });

//     const data = await fetchData.json();

//     if (data.success) {
//       toast.success(data.message);
//       dispatch(setUserDetails(null));
//       navigate("/");
//     }

//     if (data.error) {
//       toast.error(data.message);
//     }
//   };

//   const handleSearch = (e) => {
//     const { value } = e.target;
//     setSearch(value);

//     if (value) {
//       navigate(`/search?q=${value}`);
//     } else {
//       navigate("/search");
//     }
//   };

//   // Effect to handle body overflow
//   useEffect(() => {
//     if (mobileMenuDisplay) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//     return () => {
//       document.body.style.overflow = 'auto'; // Cleanup on component unmount
//     };
//   }, [mobileMenuDisplay]);

//   return (
//     <header className='h-16 shadow-md bg-white fixed w-full z-40'>
//       <div className='h-full container mx-auto flex items-center px-4 justify-between'>
//         <div className='' onClick={() => (navigate('/'))}>
//           <img src={Logo} alt='Logo' className='logo cursor-pointer' />
//         </div>

//         {/* Desktop Search Bar */}
//         <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
//           <input
//             type='text'
//             placeholder='search product here...'
//             className='w-full outline-none'
//             onChange={handleSearch}
//             value={search}
//           />
//           <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
//             <GrSearch />
//           </div>
//         </div>

//         <div className="navbar text-white space-x-4" onClick={() => (setMenuDisplay(false))}>
//           <Link to={""} className="hover-underline">Home</Link>
//           <div className="dropdown inline-block">
//             <button className="dropbtn hover-underline">Shop</button>
//             <div className="dropdown-content">
//               <div className="row">
//                 <div className="column">
//                   <Link to={"product-category"} className="hover-underline">Product Categories</Link>
//                   <Link to={"Cart"} className="hover-underline">Shopping Cart</Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Link to={"blog-page"} className="hover-underline">Blog</Link>
//           <Link to={"ContactUsPage"} className="hover-underline">Contact us</Link>
//           <div className="dropdown inline-block">
//             <button className="dropbtn hover-underline">Services & Supports</button>
//             <div className="dropdown-content">
//               <div className="row">
//                 <div className="column">
//                   <Link to={"CustomerSupport"} className="hover-underline">Customer Support</Link>
//                   <Link to={"ProductRegistration"} className="hover-underline">Product Registration</Link>
//                   <Link to={"AuthorizedDealer"} className="hover-underline">Authorized Dealer</Link>
//                   <Link to={"CareerPage"} className="hover-underline">Career</Link>
//                   <Link to={"AboutUs"} className="hover-underline">About us</Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className='flex items-center gap-7'>
//           <div className='relative flex justify-center'>
//             {user?._id && (
//               <div
//                 className="text-3xl cursor-pointer flex justify-center"
//                 onClick={() => setMenuDisplay(prev => !prev)}
//               >
//                 {user?.profilePic ? (
//                   <img
//                     src={user?.profilePic}
//                     className="w-10 h-10 rounded-full"
//                     alt={user?.name}
//                   />
//                 ) : (
//                   <FaRegCircleUser />
//                 )}
//               </div>
//             )}
//             {/* Dropdown menu */}
//             {menuDisplay && (
//               <div className="absolute top-full right-0 bg-white shadow-lg mt-2 p-4 rounded-lg ">
//                 {/* Close Button */}
//                 <div className="flex justify-end">
//                   <button
//                     className="text-gray-500 hover:text-gray-700"
//                     onClick={() => setMenuDisplay(false)}
//                   >
//                     <IoClose size={20} />
//                   </button>
//                 </div>
//                 {user?.role === ROLE.GENERAL && (
//                   <ul>
//                     <li className="py-2 px-2  hover:bg-gray-100 cursor-pointer rounded-lg" onClick={() => { navigate('user-profile'); setMenuDisplay(false); setMobileMenuDisplay(false) }}>Account</li>
//                     <li className="py-2 px-2  hover:bg-gray-100 cursor-pointer rounded-lg" onClick={() => { navigate('order'); setMenuDisplay(prev => !prev) }}>Orders</li>
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>

//           {user?._id && (
//             <Link to={"/cart"} className='text-2xl relative'>
//               <span onClick={() => { setMenuDisplay(false); setMobileMenuDisplay(false) }}><FaShoppingCart /></span>
//               <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
//                 <p className='text-sm'>{context?.cartProductCount}</p>
//               </div>
//             </Link>
//           )}

//           <div onClick={() => { setMenuDisplay(false) }}>
//             {user?._id ? (
//               <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
//             ) : (
//               <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
//             )}
//           </div>
//         </div>

//         <div className='md:hidden flex items-center'>
//           <button onClick={() => { setMobileMenuDisplay(!mobileMenuDisplay); setMenuDisplay(false); }} className='text-3xl'>
//             <GiHamburgerMenu />
//           </button>
//         </div>

//         {mobileMenuDisplay && (
//           <div className='lg:hidden bg-white p-4 shadow-lg absolute top-16 left-0 w-full'>
//             <nav className="flex flex-col gap-2">
//               <Link to="/" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Home</Link>
//               <Link to="/product-category" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Product Categories</Link>
//               <Link to="/Cart" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Shopping Cart</Link>
//               <Link to="/confirmation" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Confirmation</Link>
//               <Link to="/blog-page" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Blog</Link>
//               <Link to="/ContactUsPage" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Contact us</Link>
//               <Link to="/CustomerSupport" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Customer Support</Link>
//               <Link to="/ProductRegistration" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Product Registration</Link>
//               <Link to="/AuthorizedDealer" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Authorized Dealer</Link>
//               <Link to="/CareerPage" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Career</Link>
//               <Link to="/AboutUs" className="py-1" onClick={() => setMobileMenuDisplay(false)}>About us</Link>
//             </nav>
//             <div className='flex items-center mt-4'>
//               <div className='w-full border rounded-full focus-within:shadow pl-2'>
//                 <input
//                   type='text'
//                   placeholder='search product here...'
//                   className='w-full outline-none'
//                   onChange={handleSearch}
//                   value={search}
//                 />
//               </div>
//               <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
//                 <GrSearch />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useContext, useEffect, useState } from 'react';
import Logo from '../assest/banner/logo.png';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [mobileMenuDisplay, setMobileMenuDisplay] = useState(false);
  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include',
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setSearchDropdownVisible(false);
      navigate(`/search?q=${search}`);
    }
  };

  // Effect to handle body overflow
  useEffect(() => {
    if (mobileMenuDisplay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on component unmount
    };
  }, [mobileMenuDisplay]);

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div className='' onClick={() => (navigate('/'))}>
          <img src={Logo} alt='Logo' className='logo cursor-pointer' />
        </div>

        {/* Desktop Search Bar */}
        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
          <input
            type='text'
            placeholder='search product here...'
            className='w-full outline-none'
            onChange={handleSearch}
            value={search}
          />
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
            <GrSearch />
          </div>
        </div>

        <div className="navbar text-white space-x-4" onClick={() => (setMenuDisplay(false))}>
          <Link to={""} className="hover-underline">Home</Link>
          <div className="dropdown inline-block">
            <button className="dropbtn hover-underline">Shop</button>
            <div className="dropdown-content">
              <div className="row">
                <div className="column">
                  <Link to={"product-category"} className="hover-underline">Product Categories</Link>
                  <Link to={"Cart"} className="hover-underline">Shopping Cart</Link>
                </div>
              </div>
            </div>
          </div>
          <Link to={"blog-page"} className="hover-underline">Blog</Link>
          <Link to={"ContactUsPage"} className="hover-underline">Contact us</Link>
          <div className="dropdown inline-block">
            <button className="dropbtn hover-underline">Services & Supports</button>
            <div className="dropdown-content">
              <div className="row">
                <div className="column">
                  <Link to={"CustomerSupport"} className="hover-underline">Customer Support</Link>
                  <Link to={"ProductRegistration"} className="hover-underline">Product Registration</Link>
                  <Link to={"AuthorizedDealer"} className="hover-underline">Authorized Dealer</Link>
                  <Link to={"CareerPage"} className="hover-underline">Career</Link>
                  <Link to={"AboutUs"} className="hover-underline">About us</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-7'>
          <div className='relative flex justify-center'>
            {user?._id && (
              <div
                className="text-3xl cursor-pointer flex justify-center"
                onClick={() => setMenuDisplay(prev => !prev)}
              >
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className="w-10 h-10 rounded-full"
                    alt={user?.name}
                  />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
            )}
            {/* Dropdown menu */}
            {menuDisplay && (
              <div className="absolute top-full right-0 bg-white shadow-lg mt-2 p-4 rounded-lg ">
                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setMenuDisplay(false)}
                  >
                    <IoClose size={20} />
                  </button>
                </div>
                {user?.role === ROLE.GENERAL && (
                  <ul>
                    <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer rounded-lg" onClick={() => { navigate('user-profile'); setMenuDisplay(false); setMobileMenuDisplay(false) }}>Account</li>
                    <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer rounded-lg" onClick={() => { navigate('order'); setMenuDisplay(prev => !prev) }}>Orders</li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {user?._id && (
            <Link to={"/cart"} className='text-2xl relative'>
              <span onClick={() => { setMenuDisplay(false); setMobileMenuDisplay(false) }}><FaShoppingCart /></span>
              <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                <p className='text-sm'>{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          <div onClick={() => { setMenuDisplay(false) }}>
            {user?._id ? (
              <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
            ) : (
              <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
            )}
          </div>
        </div>

        <div className='md:hidden flex items-center'>
          <button onClick={() => { setMobileMenuDisplay(!mobileMenuDisplay); setMenuDisplay(false); }} className='text-3xl'>
            <GiHamburgerMenu />
          </button>
        </div>

        {mobileMenuDisplay && (
          <div className='lg:hidden bg-white p-4 shadow-lg absolute top-16 left-0 w-full'>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Home</Link>
              <Link to="/product-category" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Product Categories</Link>
              <Link to="/Cart" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Shopping Cart</Link>
              <Link to="/confirmation" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Confirmation</Link>
              <Link to="/blog-page" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Blog</Link>
              <Link to="/ContactUsPage" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Contact us</Link>
              <Link to="/CustomerSupport" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Customer Support</Link>
              <Link to="/ProductRegistration" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Product Registration</Link>
              <Link to="/AuthorizedDealer" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Authorized Dealer</Link>
              <Link to="/CareerPage" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Career</Link>
              <Link to="/AboutUs" className="py-1" onClick={() => setMobileMenuDisplay(false)}>About us</Link>
            </nav>

            <div className='flex items-center mt-4'>
              <div className='w-full border rounded-full focus-within:shadow pl-2 relative'>
                <input
                  type='text'
                  placeholder='search product here...'
                  className='w-full outline-none'
                  onChange={handleSearch}
                  value={search}
                  onFocus={() => setSearchDropdownVisible(true)}
                  onBlur={() => setSearchDropdownVisible(false)} // Optional: close on blur
                  onKeyDown={handleSearchSubmit}
                />
                <div 
                  className={`absolute top-full left-0 w-full bg-white shadow-lg ${searchDropdownVisible ? 'block' : 'hidden'}`}
                >
                  <div className='p-2 cursor-pointer' onClick={() => { setSearchDropdownVisible(false); navigate(`/search?q=${search}`); }}>
                    Search
                  </div>
                </div>
              </div>
              <div 
                className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white cursor-pointer'
                onClick={() => { setSearchDropdownVisible(false); navigate(`/search?q=${search}`); }}
              >
                <GrSearch />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
