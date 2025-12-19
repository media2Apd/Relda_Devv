import React, { useContext, useState, useEffect, useRef } from "react";
//import Logo from "../assest/relda.svg";
//import Logo from "../assest/reld.svg";
import Logo from "../assest/140 X 80-02.png";
import { Helmet } from 'react-helmet';
//import Logo from "../assest/banner/logo.png";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaShoppingCart, FaRegHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";
import axios from "axios";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

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
  
  const { pathname } = useLocation();
  const canonicalURL = `${window.location.origin}${pathname}`;

  const [pinCode, setPinCode] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState(" ");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]); // State to store fetched addresses
  const [selectedAddress, setSelectedAddress] = useState(null); // Track selected address
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

    // Helper function to get cookies
     const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    useEffect(() => {
      const fetchUserData = async () => {
        if (user) {
          try {
            const token = getCookie("token");
            const response = await fetch(SummaryApi.viewuser.url(user._id), {
              method: SummaryApi.viewuser.method,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }); 

            const result = await response.json();
             
            if (result.success) {
              // Normalize address data
              const addressData = Array.isArray(result.data.address)
                ? result.data.address
                : [result.data.address]; // Convert single object to array

                setAddresses(
                  addressData.map((address, index) => ({
                    ...address,
                    name: result.data.name || "Unknown User", // Add user name
                    isDefault: address?.isDefault || index === 0, // Optional: Set the first address as default
                  }))
                );
                // Set delivery location based on the default address
                if (addressData[0]?.city && addressData[0]?.state) {
                  setDeliveryLocation({district: addressData[0].city, state: addressData[0].state,});
                }
              } else {
                toast.error(result.message);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              toast.error("Failed to fetch user data. Please try again.");
            }
          }
        };
      
        fetchUserData();
      }, [user]);

    const handleAddressSelection = (id) => {
      const updatedAddresses = addresses.map((address) => address.id === id
          ? { ...address, isDefault: true}
          : { ...address, isDefault: false}
        );
        setAddresses(updatedAddresses);
        setSelectedAddress(id);
    };
  

  const verifyPinCode = async () => {
    if (!pinCode || !/^\d{6}$/.test(pinCode)) {
      toast.error("Please enter a valid 6-digit pin code.");
      return;
    }
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`);
      const result = response.data?.[0];
  
      if (result?.Status === "Success" && result.PostOffice?.length > 0) {
        // Check if the pincode belongs to Tamil Nadu and is deliverable
        const tamilNaduLocations = result.PostOffice.filter(
          (office) => office.State === "Tamil Nadu" && office.DeliveryStatus === "Delivery"
        );
  
        if (tamilNaduLocations.length > 0) {
          const district = tamilNaduLocations[0].District; // Fetch the district from the first matching PostOffice
          const state = tamilNaduLocations[0].State;
          setDeliveryLocation({district, state});
          toast.success(`Pin code is serviceable! Delivery available in ${district}, ${state}`);
        } else {
          toast.error("We only provide services for Tamil Nadu pin codes with delivery.");
        }
      } else {
        toast.error("Invalid pin code or no details available.");
      }
    } catch (error) {
      console.error("Error verifying pin code:", error);
      toast.error("An error occurred while verifying the pin code.");
    }
  };

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
      // Authourization: getToken,
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

  const handleLogin = () => {
    setMobileMenuDisplay(false);
    setShowMobileSearch(false);
  };

  const handleUserProfileClick = () => {
    setMenuDisplay((prev) => !prev)
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuDisplay(false);
        setDropdownOpen(false);
      }
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
      if (menuDisplay && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuDisplay(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowMobileSearch(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen, menuDisplay]);
  

  return (
    <>

      <Helmet>
        <link rel="canonical" href={canonicalURL} />
        <title>Relda India | Smart Home & Electronic Appliances Store</title>
      </Helmet>

      
      <header className="bg-slate-200 h-18 shadow-md fixed w-full z-40">
          <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
            <div className="flex-shrink-0">
             <img
                onClick = {() => navigate("/")}
                src={Logo}
                alt="Logo"
                className="logo cursor-pointer w-24 h-auto md:w-32" // Adjust width for mobile
              />
            </div>

            <div className="hidden lg:flex items-center max-w-sm border rounded-full focus-within:shadow pl-2 bg-white flex-grow mx-4">
              <input
                type="text"
                placeholder="search product here..."
                className="w-full outline-none p-1 ml-2 text-sm"
                onChange={handleSearch}
                value={search}
              />
              <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white"><GrSearch /></div>
            </div>

            {/* Delivery Location Section */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-blue-600 text-lg flex items-center"><HiOutlineLocationMarker className="w-5 h-5"/></span>
              <span
                className="font-bold truncate cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                Delivery to: {deliveryLocation.district}, {deliveryLocation.state}
              </span>
              </div>
            </div>

            {/* Modal for Pin Code Input */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-4/5 md:w-[400px] max-w-md mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Select Default Address</h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-fit ml-auto text-2xl hover:text-gray-800 cursor-pointer"
                      aria-label="Close modal"
                    >
                      <IoClose />
                    </button> 
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    Select a delivery location to see product availability and delivery options.
                  </p>

                <div className="address-list-container p-4 border rounded overflow-auto max-h-60">
                  {addresses && addresses.length > 0 ? (
                    addresses.map((address) => (
                      <label
                        key={address.id} // Ensure a unique key for each address
                        className={`block border rounded-lg p-4 mb-3 cursor-pointer ${selectedAddress === address.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                          }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddress === address.id}
                            onChange={() => handleAddressSelection(address.id)} // Set selected address
                            className="mr-3 mt-1"
                            aria-labelledby={`address-${address.id}`}
                          />
                          <div>
                            <p id={`address-${address.id}`} className="font-bold">
                              {address.name}
                            </p>
                            <p className="text-gray-700">
                              {address.street}, {address.city}, {address.state},{" "}
                              {address.postalCode}, {address.country}
                            </p>

                            {address.isDefault && (
                              <span className="text-green-600 text-sm font-semibold">
                                Default Address
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500">No addresses found.</p>
                  )}
                </div>  

                  {/* Add Address and Pincode Section */}
                  <div className="mt-4">
                    <h1 href="/user-Profile" className="text-blue-500 hover:underline text-sm">
                      Add a new address
                    </h1>
                    <div className="flex items-center gap-2 mt-4 w-full">
                      <input
                        type="text"
                        placeholder="Enter pincode"
                        className="border border-gray-300 p-2 rounded flex-grow min-w-0"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                      />
                      <button
                        onClick={verifyPinCode}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex-shrink-0"
                      >
                        Apply
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-5 md:gap-7 md:pl-10">
              {/* Mobile View Search Icon */}
              <div className="text-xl w-6 h-6 md:w-8 md:h-8 bg-red-600 flex items-center justify-center rounded-full text-white lg:hidden">
                <button onClick={handleSearchButton}><GrSearch className="text-sm" /></button>
              </div>
              
              <div className="relative flex justify-center items-center">
                {user?._id && (
                  <div
                    className="cursor-pointer flex justify-center items-center"
                    onClick={handleUserProfileClick}
                  >
                    {user?.profilePic ? (
                      <img
                        src={user?.profilePic}
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                        alt={user?.name || "User Profile"}
                      />
                    ) : (
                      <span className="text-2xl md:text-3xl lg:text-3xl"><FaRegCircleUser /></span>
                    )}
                  </div>
                )}


                {/* Dropdown menu */}
                {menuDisplay && (
                  <div ref={dropdownRef} className="absolute top-full right-0 w-26 md:w-32 bg-white shadow-lg mt-2 p-4 rounded-lg border border-gray-200 z-50 whitespace-nowrap">
                    {/* Close Button */}
                    <div className="flex justify-end items-center">
                      <button className="text-gray-500 hover:text-gray-700" onClick={() => setMenuDisplay(false)}><IoClose size={20} /></button>
                    </div>
                    <ul className="mt-2">
                      {user?.role === ROLE.GENERAL && (
                        <>
                        <li
                          className="py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
                          onClick={() => {
                            navigate("user-profile");
                            setMenuDisplay(false);
                          }}
                        >
                          Account
                        </li>
                        <li
                          className="py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
                          onClick={() => {
                            navigate("order");
                            setMenuDisplay(false);
                          }}
                        >
                          My Orders
                        </li>
                      </>
                    )}
                    {user?.role === ROLE.ADMIN && (
                      <li
                        className="flex item-center justify-center py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
                        onClick={() => {
                          navigate("/admin-panel/dashboard");
                          setMenuDisplay(false);
                        }}
                      >
                        Admin Panel
                      </li>
                    )}
	 		{user?.role === ROLE.MANAGEBLOG && (
                      <li
                        className="flex item-center justify-center py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
                        onClick={() => {
                          navigate("/adminBlog/upload-blogs");
                          setMenuDisplay(false);
                        }}
                      >
                        Manage Blog
                      </li>
                    )}
                  </ul>
                  </div>
                )}
              </div>
              {user?._id && (
                <Link to={"/cart"} className="text-xl md:text-2xl relative">
                  <span onClick={() => {
                      setMenuDisplay(false);
                      setMobileMenuDisplay(false);
                    }}
                  >
                    <FaShoppingCart />
                  </span>
                  <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                    <p className="text-sm">{context?.cartProductCount}</p>
                  </div>
                </Link>
              )}
	<div className="relative hidden md:flex">
      {/* Wishlist Button */}
      <button
        className="flex items-center gap-2 px-2 py-2 text-white transition relative "
        onClick={() => navigate("/wishlist")}
      >
        <FaRegHeart className="text-2xl text-black" />
        <span className="hidden md:inline"></span>
      </button>
      {/* Wishlist Count */}
      {/* {wishlistCount > 0 && ( */}
        <div className="absolute -top-0 -right-0 bg-red-600 text-white p-1 w-5 h-5 rounded-full flex items-center justify-center text-sm">
          {context?.wishlistCount}
        </div>
      {/* )} */}
    </div>
              <div
                onClick={() => {
                  setMenuDisplay(false);
                }}
              >
                {user?._id ? (
                  <button onClick={handleLogout} className="hidden lg:inline-block px-2 md:px-2 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700">
                    Logout
                  </button>
                ) : (
                  <Link to={"/login"} onClick={handleLogin} className="px-2 md:px-2 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700">
                    Login
                  </Link>
                )}
              </div>
            </div>

            {mobileMenuDisplay && (
              <div ref={menuRef} className="lg:hidden bg-white shadow-lg absolute top-full left-0 w-full z-50">
                <nav className="flex flex-col gap-2 p-4">
                  <Link to="/" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Home</Link>
                  <Link to="/product-category" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Product Categories</Link>
                  <Link to="/Cart" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Shopping Cart</Link>
                  <Link to="/wishlist" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between" onClick={() => setMobileMenuDisplay(false)}>
                    Wishlist
                    {/* {wishlistCount > 0 && ( */}
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {context?.wishlistCount}
                      </span>
                    {/* )} */}
                  </Link>
		<h1><Link to="/blog-page" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Blog</Link></h1>
                  <Link to="/ContactUsPage" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Contact us</Link>

                  <div className="relative">
                    <button
                    className="py-2 px-4 rounded flex justify-between items-center hover:bg-gray-100 w-full transition-colors duration-200"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    >
                      Services & Supports
                      <span className="text-2xl md:text-3xl ml-5">{dropdownOpen ? <RiArrowDropDownLine /> : <RiArrowDropUpLine /> }</span>
                    </button>
                    {dropdownOpen && (
                      <div className="pl-4 flex flex-col gap-2 bg-gray-50 rounded shadow-inner mt-2 transition-colors duration-200">
                        <Link to="/CustomerSupport" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Customer Support</Link>
                        <Link to="/ProductRegistration" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Product Registration</Link>
                        <Link to="/AuthorizedDealer" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Authorized Dealer</Link>
                        <Link to="/CareerPage" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Career</Link>
                        <Link to="/AboutUs" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>About us</Link>
                      </div>
                    )}
                  </div>
       		  <div
                    onClick={() => {
                    setMenuDisplay(false);
                    }}
                    className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200 text-red-600"
                  >
                    {user?._id ? (
                      <Link to={"/"} onClick={handleLogout} className="py-2 rounded hover:bg-gray-200 transition-colors duration-200">
                        Logout
                      </Link>
                    ) : (
                      <Link to={"/login"} onClick={handleLogin} className="hidden lg:block px-2 md:px-2 py-1 text-xs md:text-lg text-white flex text-center bg-red-600 hover:bg-red-700">
                        Login
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            )}
            <button
              onClick={() => setMobileMenuDisplay(!mobileMenuDisplay)}
              className="lg:hidden bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors duration-200"
            >
              {mobileMenuDisplay ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
            </button>
          </div>
          <hr className="border-gray-300 sm:hidden pb-1"/>
          <div className="w-full flex justify-center sm:hidden mb-2">
          <div className="flex items-center space-x-2 text-gray-700 text-sm">
            <span className="text-blue-600 text-lg flex items-center">
              <HiOutlineLocationMarker className="w-5 h-5" />
            </span>
            <span
              className="font-bold cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Delivery to:
            </span>
            <span className="font-bold text-blue-600">
              {deliveryLocation.district}, {deliveryLocation.state || " "}
            </span>
          </div>
        </div>
          
          <nav>
            <div className="navbar mx-auto flex items-center justify-center space-x-4 text-sm font-medium text-gray-700 bg-white"
              onClick={() => setMenuDisplay(false)}>
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
                      {/* <Link to={"ServiceRequest"} className="hover-underline">ServiceRequest</Link> */}
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
          </nav>

          {showMobileSearch && (
            <div ref={searchRef} className="flex items-center mt-2 lg:hidden w-full">
              <div className="w-full border rounded-full focus-within:shadow pl-2 bg-white">
                <input
                  type="text"
                  placeholder="search product here..."
                  className="w-full outline-none p-1 ml-1"
                  onChange={handleSearch}
                  value={search}
                />
              </div>
              <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
                <GrSearch />
              </div>
            </div>
          )}
        </header>
      </>
  );
};

export default Header;