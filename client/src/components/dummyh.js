// import React, { useContext, useEffect, useState } from "react";
// import Logo from "../assest/banner/logo.png";
// import { GrSearch } from "react-icons/gr";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { FaShoppingCart } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import SummaryApi from "../common";
// import { toast } from "react-toastify";
// import { setUserDetails } from "../store/userSlice";
// import ROLE from "../common/role";
// import Context from "../context";

// const Header = () => {
//   const user = useSelector((state) => state?.user?.user);
//   const dispatch = useDispatch();
//   const [menuDisplay, setMenuDisplay] = useState(false);
//   const [mobileMenuDisplay, setMobileMenuDisplay] = useState(false);
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const context = useContext(Context);
//   const navigate = useNavigate();
//   const searchInput = useLocation();
//   const URLSearch = new URLSearchParams(searchInput?.search);
//   const searchQuery = URLSearch.getAll("q");
//   const [search, setSearch] = useState(searchQuery);

//   const handleLogout = async () => {
//     const fetchData = await fetch(SummaryApi.logout_user.url, {
//       method: SummaryApi.logout_user.method,
//       credentials: "include",
//       // Authourization: getToken,
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

//   const handleSearchButton = () => {
//     setShowMobileSearch(!showMobileSearch);
//     setMobileMenuDisplay(false);
//     setSearch("");
//     if (!showMobileSearch){
//       navigate(`/search`);
//     } else {
//       navigate(-1);
//     }
    
//   }

//   const handleHamburgerMenu = () => {
//     setMobileMenuDisplay(!mobileMenuDisplay);
//     setMenuDisplay(false);
//     setShowMobileSearch(false);
//   }

//   const handleLogin = () => {
//     setMobileMenuDisplay(false);
//     setShowMobileSearch(false);
//   }

//   return (
//     <header className="h-16 shadow-md bg-white fixed w-full z-40">
//       <div className="h-full container mx-auto flex items-center px-4 justify-between">
//       <div>
//       <img 
//         src={Logo} 
//         alt='Logo' 
//         className='logo cursor-pointer w-24 h-auto md:w-32' // Adjust width for mobile
//       />
//     </div>

//         <div className="hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow ">
//           <input
//             type="text"
//             placeholder="search product here..."
//             className="w-full outline-none"
//             onChange={handleSearch}
//             value={search}
//           />
//           <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
//             <GrSearch />
//           </div>
//         </div>

//         <div
//           className="navbar text-white space-x-4"
//           onClick={() => setMenuDisplay(false)}
//         >
//           <Link to={""} className="hover-underline">
//             Home
//           </Link>
//           <div className="dropdown inline-block">
//             <button className="dropbtn hover-underline">Shop</button>
//             <div className="dropdown-content">
//               <div className="row">
//                 <div className="column">
//                   <Link to={"product-category"} className="hover-underline">
//                     Product Categories
//                   </Link>
//                   <Link to={"Cart"} className="hover-underline">
//                     Shopping Cart
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Link to={"blog-page"} className="hover-underline">
//             Blog
//           </Link>
//           <Link to={"ContactUsPage"} className="hover-underline">
//             Contact us
//           </Link>
//           <div className="dropdown inline-block">
//             <button className="dropbtn hover-underline">
//               Services & Supports
//             </button>
//             <div className="dropdown-content">
//               <div className="row">
//                 <div className="column">
//                   {/* <Link to={"ServiceRequest"} className="hover-underline">ServiceRequest</Link> */}
//                   <Link to={"CustomerSupport"} className="hover-underline">
//                     Customer Support
//                   </Link>
//                   <Link to={"ProductRegistration"} className="hover-underline">
//                     Product Registration
//                   </Link>
//                   <Link to={"AuthorizedDealer"} className="hover-underline">
//                     Authorized Dealer
//                   </Link>
//                   <Link to={"CareerPage"} className="hover-underline">
//                     Career
//                   </Link>
//                   <Link to={"AboutUs"} className="hover-underline">
//                     About us
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

        

//         <div className="flex items-center gap-5 md:gap-7">
//           {/* Mobile View Search Icon */}
//         <div className="text-xl w-6 h-6 bg-red-600 flex items-center justify-center rounded-full text-white md:hidden">
//           <button onClick={handleSearchButton} ><GrSearch className="text-sm" /></button>
//         </div>
//           <div className="relative flex justify-center">
//             {user?._id && (
//               <div
//                 className="text-2xl md:text-3xl cursor-pointer flex justify-center"
//                 onClick={() => setMenuDisplay((prev) => !prev)}
//               >
//                 {user?.profilePic ? (
//                   <img
//                     src={user?.profilePic}
//                     className=" ml-2 w-4 h-4 md:w-10 md:h-10 rounded-full"
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
//                     <IoClose size={0} />
//                   </button>
//                 </div>
//                 {user?.role === ROLE.GENERAL && (
//                   <ul>
//                     <li
//                       className="py-2 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
//                       onClick={() => {
//                         navigate("user-profile");
//                         setMenuDisplay(false);
//                         setMobileMenuDisplay(false);
//                       }}
//                     >
//                       Account
//                     </li>
//                     {/* preve => !preve */}
//                     <li
//                       className="py-2 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
//                       onClick={() => {
//                         navigate("order");
//                         setMenuDisplay((preve) => !preve);
//                       }}
//                     >
//                       Orders
//                     </li>
//                   </ul>
//                 )}
//               </div>
//             )}

//             {menuDisplay && (
//               <div className="absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded">
//                 <nav>
//                   {user?.role === ROLE.ADMIN && (
//                     <Link
//                       to={"/admin-panel/all-products"}
//                       className="whitespace-nowrap hidden md:block hover:bg-slate-100 p-2"
//                       onClick={() => setMenuDisplay((preve) => !preve)}
//                     >
//                       Admin Panel
//                     </Link>
//                   )}
//                 </nav>
//               </div>
//             )}
//           </div>

//           {user?._id && (
//             <Link to={"/cart"} className="text-xl md:text-2xl relative">
//               <span
//                 onClick={() => {
//                   setMenuDisplay(false);
//                   setMobileMenuDisplay(false);
//                 }}
//               >
//                 <FaShoppingCart />
//               </span>

//               <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
//                 <p className="text-sm">{context?.cartProductCount}</p>
//               </div>
//             </Link>
//           )}

//           <div
//             onClick={() => {
//               setMenuDisplay(false);
//             }}
//           >
//             {user?._id ? (
//               <button
//                 onClick={handleLogout}
//                 className="px-1 md:px-3 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700"
//               >
//                 Logout
//               </button>
//             ) : (
//               <Link
//                 to={"/login"}
//                 onClick={handleLogin}
//                 className="px-2 md:px-3 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700"
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//         <div className="md:hidden flex items-center">
//           <button
//             onClick={handleHamburgerMenu}
//             className="text-xl md:text-3xl ml-5"
//           >
//             <GiHamburgerMenu />
//           </button>
//         </div>
//         {mobileMenuDisplay && (
//           <div className="lg:hidden bg-white p-4 shadow-lg absolute top-16 left-0 w-full">
//             <nav className="flex flex-col gap-2">
//               <Link
//                 to="/"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Home
//               </Link>
//               <Link
//                 to="/product-category"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Product Categories
//               </Link>
//               <Link
//                 to="/Cart"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Shopping Cart
//               </Link>
//               {/* <Link to="/checkout" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Product Checkout</Link> */}
//               <Link
//                 to="/confirmation"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Confirmation
//               </Link>
//               <Link
//                 to="/blog-page"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Blog
//               </Link>
//               <Link
//                 to="/ContactUsPage"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Contact us
//               </Link>
//               {/* <Link to="/ServiceRequest" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Service Request</Link> */}
//               <Link
//                 to="/CustomerSupport"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Customer Support
//               </Link>
//               <Link
//                 to="/ProductRegistration"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Product Registration
//               </Link>
//               <Link
//                 to="/AuthorizedDealer"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Authorized Dealer
//               </Link>
//               {/* <Link to="/AuthorizedServiceCenter" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Authorized Service Center</Link>
//                 <Link to="/MemberShip" className="py-1" onClick={() => setMobileMenuDisplay(false)}>Membership</Link> */}
//               <Link
//                 to="/CareerPage"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Career
//               </Link>
//               <Link
//                 to="/AboutUs"
//                 className="py-1"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 About us
//               </Link>
//               {/* {
//                   user?.role === ROLE.ADMIN && (
//                    <Link to="/admin-panel/all-products" className='py-1' onClick={() => setMobileMenuDisplay(true)}>Admin Panel</Link>
//                   )
//                 } */}
//             </nav>
//           </div>
//         )}
//       </div>
//       {showMobileSearch && (
//         <div className="flex items-center mt-1 md:hidden w-full">
//         <div className="w-full border rounded-full focus-within:shadow pl-2 bg-white">
//           <input
//             type="text"
//             placeholder="search product here..."
//             className="w-full outline-none p-1 ml-1"
//             onChange={handleSearch}
//             value={search}
//           />
//         </div>
//         <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
//           <GrSearch />
//         </div>
//       </div>
//     )}
//     </header>
//   );
// };

// export default Header;




import React, { useContext, useEffect, useState } from "react";
import Logo from "../assest/banner/logo.png";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [mobileMenuDisplay, setMobileMenuDisplay] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);

  // Location States
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationData, setLocationData] = useState({ city: "", pincode: "" });

  // Request Location Permission and fetch user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
    } else {
      setLocationPermission(false);
    }
  };

  // Success handler for geolocation
  const handleLocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    // Use Google Maps Geocoding API to get the city and pincode
    const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_API_KEY`;

    fetch(googleMapsUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const city = data.results[0]?.address_components.find(component => component.types.includes("locality"))?.long_name || 'Unknown City';
          const pincode = data.results[0]?.address_components.find(component => component.types.includes("postal_code"))?.long_name || 'Unknown Pincode';
          setLocationData({ city, pincode });
          setLocationPermission(true);
        } else {
          setLocationPermission(false);
        }
      })
      .catch(() => setLocationPermission(false));
  };

  // Error handler for geolocation
  const handleLocationError = () => {
    setLocationPermission(false);
  };

  // Call getLocation when the component mounts
  useEffect(() => {
    getLocation();
  }, []);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
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

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  const handleSearchButton = () => {
    setShowMobileSearch(!showMobileSearch);
    setMobileMenuDisplay(false);
    setSearch("");
    if (!showMobileSearch) {
      navigate(`/search`);
    } else {
      navigate(-1);
    }
  };

  const handleHamburgerMenu = () => {
    setMobileMenuDisplay(!mobileMenuDisplay);
    setMenuDisplay(false);
    setShowMobileSearch(false);
  };

  const handleLogin = () => {
    setMobileMenuDisplay(false);
    setShowMobileSearch(false);
  };

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        {/* Logo */}
        <div>
          <img 
            src={Logo} 
            alt='Logo' 
            className='logo cursor-pointer w-24 h-auto md:w-32' 
          />
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow ">
          <input
            type="text"
            placeholder="search product here..."
            className="w-full outline-none"
            onChange={handleSearch}
            value={search}
          />
          <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
            <GrSearch />
          </div>
        </div>

        {/* Navbar Links */}
        <div className="navbar text-white space-x-4" onClick={() => setMenuDisplay(false)}>
          <Link to={""} className="hover-underline">Home</Link>
          <Link to={"product-category"} className="hover-underline">Shop</Link>
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

        {/* Location Display */}
        <div className="flex items-center gap-3">
          {locationPermission !== null && (
            <div className="flex items-center gap-2">
              <div className="text-xl text-gray-700 cursor-pointer">
                <span className="material-icons">location_on</span>
              </div>
              <div className="text-sm text-gray-600">
                {locationPermission ? (
                  <>
                    <span>{locationData.city}, </span>
                    <span>{locationData.pincode}</span>
                  </>
                ) : (
                  <span>Location Not Available</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile and Cart */}
        <div className="flex items-center gap-5 md:gap-7">
          <div className="text-xl w-6 h-6 bg-red-600 flex items-center justify-center rounded-full text-white md:hidden">
            <button onClick={handleSearchButton}><GrSearch className="text-sm" /></button>
          </div>
          <div className="relative flex justify-center">
            {user?._id && (
              <div
                className="text-2xl md:text-3xl cursor-pointer flex justify-center"
                onClick={() => setMenuDisplay((prev) => !prev)}
              >
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className=" ml-2 w-4 h-4 md:w-10 md:h-10 rounded-full"
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
                <ul>
                  <li
                    className="py-2 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    onClick={() => {
                      navigate("user-profile");
                      setMenuDisplay(false);
                    }}
                  >
                    Account
                  </li>
                  <li
                    className="py-2 px-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                    onClick={() => {
                      navigate("order");
                      setMenuDisplay(false);
                    }}
                  >
                    Orders
                  </li>
                </ul>
              </div>
            )}
          </div>

          {user?._id && (
            <Link to={"/cart"} className="text-xl md:text-2xl relative">
              <FaShoppingCart />
              <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                <p className="text-sm">{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-1 md:px-3 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                onClick={handleLogin}
                className="px-2 md:px-3 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button
            onClick={handleHamburgerMenu}
            className="text-xl md:text-3xl ml-5"
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
