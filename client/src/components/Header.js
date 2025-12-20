import React, { useContext, useState, useEffect, useRef } from "react";
import Logo from "../assest/Logo.png";
import { Helmet } from 'react-helmet';
import { GrSearch } from "react-icons/gr";
// import { FaRegCircleUser } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
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
import { ShoppingCart } from 'lucide-react';

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
  const [deliveryLocation, setDeliveryLocation] = useState({ district: "", state: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  
  // State for categories
  const [categories, setCategories] = useState([]);
  // console.log(categories);
  
  const [loading, setLoading] = useState(false);
  
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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(SummaryApi.getParentCategories.url, {
          // method: SummaryApi.getParentCategories.method,
        });
        const result = await response.json();
        console.log(result);
        
        if (result.success) {
          setCategories(result.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
            const addressData = Array.isArray(result.data.address)
              ? result.data.address
              : [result.data.address];

            setAddresses(
              addressData.map((address, index) => ({
                ...address,
                name: result.data.name || "Unknown User",
                isDefault: address?.isDefault || index === 0,
              }))
            );
            
            if (addressData[0]?.city && addressData[0]?.state) {
              setDeliveryLocation({district: addressData[0].city, state: addressData[0].state});
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
    const updatedAddresses = addresses.map((address) => 
      address.id === id
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
        const tamilNaduLocations = result.PostOffice.filter(
          (office) => office.State === "Tamil Nadu" && office.DeliveryStatus === "Delivery"
        );

        if (tamilNaduLocations.length > 0) {
          const district = tamilNaduLocations[0].District;
          const state = tamilNaduLocations[0].State;
          setDeliveryLocation({ district, state });
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
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      context.fetchUserAddToCart?.();
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

  // const handleLogin = () => {
  //   setMobileMenuDisplay(false);
  //   setShowMobileSearch(false);
  // };

  const handleUserProfileClick = () => {
    if (user?._id) {
      setMenuDisplay((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuDisplay(false);
        // setDropdownOpen(false);
        setShopDropdownOpen(false);
        setServicesDropdownOpen(false);
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

  // Group categories by parent
  const groupedCategories = categories.reduce((acc, category) => {
    const parent = category.category || "Other";
    if (!acc[parent]) {
      acc[parent] = [];
    }
    acc[parent].push(category);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <link rel="canonical" href={canonicalURL} />
        <title>Relda India | Smart Home & Electronic Appliances Store</title>
      </Helmet>

      <header className="bg-white fixed w-full z-50 top-0">
        {/* Top Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  onClick={() => navigate("/")}
                  src={Logo}
                  alt="Relda Logo"
                  className="cursor-pointer h-10 md:h-12 w-auto"
                />
              </div>

              {/* Search Bar - Desktop & Tablet */}
              <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="What are you looking for..."
                    className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-red-500 text-sm"
                    onChange={handleSearch}
                    value={search}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <GrSearch className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Right Section - Desktop & Tablet */}
              <div className="hidden lg:flex items-center space-x-6">
                {/* Delivery Location */}
                <div 
                  className="flex items-center space-x-2 cursor-pointer transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  <HiOutlineLocationMarker className="w-6 h-6" />
                  <div className="text-sm">
                    <div className="font-semibold">
                      {deliveryLocation.district || "Chennai"}, {deliveryLocation.state || "600040"}
                    </div>
                  </div>
                </div>

                {/* User Profile */}
                <div className="relative">
                  <div
                    className="cursor-pointer hover:opacity-80 transition"
                    onClick={handleUserProfileClick}
                  >
                    {user?._id && user?.profilePic ? (
                      <img
                        src={user?.profilePic}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                        alt={user?.name || "User Profile"}
                      />
                    ) : (
                      <FaRegUser className="w-6 h-6" />
                    )}
                  </div>

                  {/* User Dropdown */}
                  {menuDisplay && (
                    <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">
                      <button 
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        onClick={() => setMenuDisplay(false)}
                      >
                        <IoClose size={20} />
                      </button>
                      
                      <div className="pt-6">
                        {user?._id ? (
                          <>
                            {user?.role === ROLE.GENERAL && (
                              <>
                                <Link
                                  to="user-profile"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                  onClick={() => setMenuDisplay(false)}
                                >
                                  Account
                                </Link>
                                <Link
                                  to="order"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                  onClick={() => setMenuDisplay(false)}
                                >
                                  My Orders
                                </Link>
                              </>
                            )}
                            {user?.role === ROLE.ADMIN && (
                              <Link
                                to="/admin-panel/dashboard"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                onClick={() => setMenuDisplay(false)}
                              >
                                Admin Panel
                              </Link>
                            )}
                            {user?.role === ROLE.MANAGEBLOG && (
                              <Link
                                to="/adminBlog/upload-blogs"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                onClick={() => setMenuDisplay(false)}
                              >
                                Manage Blog
                              </Link>
                            )}
                            <button
                              onClick={() => {
                                handleLogout();
                                setMenuDisplay(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                            >
                              Logout
                            </button>
                          </>
                        ) : (
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                            onClick={() => setMenuDisplay(false)}
                          >
                            Login
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                {/* <Link to="/wishlist" className="relative hover:opacity-80 transition">
                  <FaRegHeart className="w-6 h-6 text-gray-700" />
                  {context?.wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {context?.wishlistCount}
                    </span>
                  )}
                </Link> */}

                {/* Cart */}
                <Link to="/cart" className="relative hover:opacity-80 transition">
                  <ShoppingCart className="w-6 h-6" />
                  {context?.cartProductCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {context?.cartProductCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Mobile Icons */}
              <div className="flex lg:hidden items-center space-x-4">
                {/* Mobile Search */}
                <button onClick={handleSearchButton} className="text-gray-700 md:hidden">
                  <GrSearch className="w-5 h-5" />
                </button>

                {/* Mobile User Profile */}
                <div className="cursor-pointer" onClick={handleUserProfileClick}>
                  {user?._id && user?.profilePic ? (
                    <img
                      src={user?.profilePic}
                      className="w-7 h-7 rounded-full object-cover"
                      alt={user?.name}
                    />
                  ) : (
                    <FaRegUser className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </div>

                {/* Mobile Wishlist */}
                {/* <Link to="/wishlist" className="relative">
                  <FaRegHeart className="w-6 h-6" />
                  {context?.wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {context?.wishlistCount}
                    </span>
                  )}
                </Link> */}

                {/* Mobile Cart */}
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  {context?.cartProductCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {context?.cartProductCount}
                    </span>
                  )}
                </Link>

                {/* Hamburger Menu */}
                <button
                  onClick={() => setMobileMenuDisplay(!mobileMenuDisplay)}
                  className=""
                >
                  {mobileMenuDisplay ? <IoClose className="w-5 h-5 md:w-6 md:h-6" /> : <GiHamburgerMenu className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div ref={searchRef} className="bg-white border-b border-gray-200 px-4 py-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="What are you looking for..."
                className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-red-500 text-sm"
                onChange={handleSearch}
                value={search}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <GrSearch className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Delivery Location */}
        <div className="md:hidden bg-gray-50 border-b border-gray-200 px-4 py-2">
          <div 
            className="flex items-center space-x-2 text-sm cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <HiOutlineLocationMarker className="w-5 h-5" />
            <span className="text-gray-600">Delivery to:</span>
            <span className="font-semibold text-gray-900">
              {deliveryLocation.district || "Chennai"}, {deliveryLocation.state || "600040"}
            </span>
          </div>
        </div>

        {/* Navigation Bar - Desktop */}
        <nav className="hidden lg:block bg-gradient-to-r from-[#7A0100] via-[#AA0000] to-[#7A0100]">
          <div className="container mx-auto">
            <ul className="flex items-center justify-center space-x-8 text-white font-medium">
              <li>
                <Link 
                  to="/" 
                  className="block py-4 px-2 hover:bg-white/10 transition-colors relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

            {/* Shop Dropdown - Fixed for Your Data Structure */}
            <li className="relative group">
              <button className="py-4 px-2 hover:bg-white/10 transition-colors relative">
                Shop
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              {/* Mega Dropdown - 4 Column Layout */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-screen max-w-7xl bg-white shadow-2xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="container mx-auto py-8 px-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Column 1 - Product Categories */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
                        Product Categories
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <Link 
                            to="/product-category" 
                            className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                          >
                            All Products
                          </Link>
                        </li>
                        
                        {loading ? (
                          <li className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                          </li>
                        ) : categories && categories.length > 0 ? (
                          <>
                            {/* Show first 2 categories */}
                            {categories.slice(0, 2).map((category) => (
                              <li key={category._id}>
                                <Link 
                                  to={`/product-category?category=${category.name}`}
                                  className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                                >
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </>
                        ) : (
                          <li className="text-sm text-gray-500 py-2">No categories available</li>
                        )}
                      </ul>
                    </div>

                    {/* Column 2 - Shopping + More Categories */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
                        Shopping
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <Link 
                            to="/Cart" 
                            className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                          >
                            Shopping Cart
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/wishlist" 
                            className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                          >
                            Wishlist
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/order" 
                            className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                          >
                            My Orders
                          </Link>
                        </li>
                        
                        {/* Show next 2 categories */}
                        {categories && categories.length > 2 && (
                          <>
                            <li className="pt-2 mt-2 border-t border-gray-200">
                              <span className="text-xs font-semibold text-gray-500 uppercase">
                                More Categories
                              </span>
                            </li>
                            {categories.slice(2, 4).map((category) => (
                              <li key={category._id}>
                                <Link 
                                  to={`/product-category?category=${category.name}`}
                                  className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                                >
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Column 3 - Featured + More Categories */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
                        Featured
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <Link 
                            to="/new-arrivals" 
                            className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                          >
                            New Arrivals
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/best-sellers" 
                            className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                          >
                            Best Sellers
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/special-offers" 
                            className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                          >
                            Special Offers
                          </Link>
                        </li>
                        
                        {/* Show remaining categories */}
                        {categories && categories.length > 4 && (
                          <>
                            <li className="pt-2 mt-2 border-t border-gray-200">
                              <span className="text-xs font-semibold text-gray-500 uppercase">
                                Explore More
                              </span>
                            </li>
                            {categories.slice(4, 6).map((category) => (
                              <li key={category._id}>
                                <Link 
                                  to={`/product-category?category=${category.name}`}
                                  className="text-gray-700 hover:text-red-600 transition text-sm block py-1"
                                >
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Column 4 - Image Banner */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                      <Link to="/special-offers" className="block h-full group/img">
                        <div className="relative h-full min-h-[300px] overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" 
                            alt="Shop Banner" 
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                          {/* Overlay with Text */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h4 className="text-xl font-bold mb-2">Special Offers</h4>
                            <p className="text-sm opacity-90 mb-3">Up to 50% off on selected items</p>
                            <span className="inline-block bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition">
                              Shop Now →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </li>

              <li>
                <Link 
                  to="/blog-page" 
                  className="block py-4 px-2 hover:bg-white/10 transition-colors relative group"
                >
                  Blog
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              <li>
                <Link 
                  to="/ContactUsPage" 
                  className="block py-4 px-2 hover:bg-white/10 transition-colors relative group"
                >
                  Contact Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              {/* Services & Supports Dropdown */}
              <li className="relative group">
                <button className="py-4 px-2 hover:bg-white/10 transition-colors relative">
                  Services & Supports
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </button>
                
                {/* Mega Dropdown */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-screen max-w-7xl bg-white shadow-2xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="container mx-auto py-8 px-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                      {/* Support Section */}
                      <div>
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 pb-2 border-b-2 border-red-600 mb-3">
                          Support
                        </h3>
                        <ul className="space-y-2">
                          <li>
                            <Link 
                              to="/CustomerSupport" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Customer Support
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/ProductRegistration" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Product Registration
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/warranty" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Warranty Information
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/faq" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              FAQs
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Company Section */}
                      <div>
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 pb-2 border-b-2 border-red-600 mb-3">
                          Company
                        </h3>
                        <ul className="space-y-2">
                          <li>
                            <Link 
                              to="/AboutUs" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              About Us
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/CareerPage" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Careers
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/AuthorizedDealer" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Authorized Dealers
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/press" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Press & Media
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Policies Section */}
                      <div>
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 pb-2 border-b-2 border-red-600 mb-3">
                          Policies
                        </h3>
                        <ul className="space-y-2">
                          <li>
                            <Link 
                              to="/privacy-policy" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Privacy Policy
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/terms" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Terms & Conditions
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/return-policy" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Return Policy
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/shipping-policy" 
                              className="text-gray-700 hover:text-red-600 transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-red-600"
                            >
                              Shipping Policy
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Banner/Image Section */}
                      <div className="space-y-4">
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 pb-2 border-b-2 border-red-600">
                          Need Help?
                        </h3>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg overflow-hidden shadow-md">
                          <div className="p-4">
                            <img 
                              src={Logo} 
                              alt="Customer Support" 
                              className="w-full h-24 object-contain mb-3"
                            />
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">24/7 Support</h4>
                            <p className="text-xs text-gray-600 mb-3">We're here to help you anytime</p>
                            <Link 
                              to="/ContactUsPage" 
                              className="block text-center bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700 transition"
                            >
                              Contact Us
                            </Link>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 shadow-md">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">Join Our Team</h4>
                          <p className="text-xs text-gray-600 mb-2">Explore career opportunities</p>
                          <Link 
                            to="/CareerPage" 
                            className="text-red-600 hover:text-red-700 text-xs font-medium"
                          >
                            View Openings →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuDisplay && (
          <div ref={menuRef} className="lg:hidden bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto">
            <nav className="py-2">
              <Link 
                to="/" 
                className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
                onClick={() => setMobileMenuDisplay(false)}
              >
                Home
              </Link>

              {/* Shop Dropdown Mobile */}
              <div className="border-b border-gray-100">
                <button
                  className="w-full flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                >
                  <span>Shop</span>
                  {shopDropdownOpen ? <RiArrowDropUpLine size={24} /> : <RiArrowDropDownLine size={24} />}
                </button>
                
                {shopDropdownOpen && (
                  <div className="bg-gray-50 px-6 py-2">
                    <Link 
                      to="/product-category" 
                      className="block py-2 text-sm text-gray-600 hover:text-red-600"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      All Products
                    </Link>
                    {Object.entries(groupedCategories).map(([parent, subcategories]) => (
                      <div key={parent} className="mt-3">
                        <p className="font-semibold text-gray-800 text-sm mb-1">{parent}</p>
                        {subcategories.slice(0, 5).map((subcat) => (
                          <Link
                            key={subcat._id}
                            to={`/product-category?category=${subcat.value}`}
                            className="block py-1 pl-3 text-sm text-gray-600 hover:text-red-600"
                            onClick={() => setMobileMenuDisplay(false)}
                          >
                            {subcat.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                to="/blog-page" 
                className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
                onClick={() => setMobileMenuDisplay(false)}
              >
                Blog
              </Link>

              <Link 
                to="/ContactUsPage" 
                className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
                onClick={() => setMobileMenuDisplay(false)}
              >
                Contact Us
              </Link>

              {/* Services Dropdown Mobile */}
              <div className="border-b border-gray-100">
                <button
                  className="w-full flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                >
                  <span>Services & Supports</span>
                  {servicesDropdownOpen ? <RiArrowDropUpLine size={24} /> : <RiArrowDropDownLine size={24} />}
                </button>
                
                {servicesDropdownOpen && (
                  <div className="bg-gray-50 px-6 py-2">
                    <Link 
                      to="/CustomerSupport" 
                      className="block py-2 text-sm text-gray-600 hover:text-red-600"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      Customer Support
                    </Link>
                    <Link 
                      to="/ProductRegistration" 
                      className="block py-2 text-sm text-gray-600 hover:text-red-600"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      Product Registration
                    </Link>
                    <Link 
                      to="/AuthorizedDealer" 
                      className="block py-2 text-sm text-gray-600 hover:text-red-600"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      Authorized Dealer
                    </Link>
                    <Link 
                      to="/CareerPage" 
                      className="block py-2 text-sm text-gray-600 hover:text-red-600"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      Career
                    </Link>
                    <Link 
                      to="/AboutUs" 
                      className="block py-2 text-sm text-gray-600 hover:text-red-600"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      About Us
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}

        {/* Address Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Select Delivery Address</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Select a delivery location to see product availability and delivery options.
                </p>

                <div className="space-y-3 mb-6">
                  {addresses && addresses.length > 0 ? (
                    addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                          selectedAddress === address.id
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddress === address.id}
                            onChange={() => handleAddressSelection(address.id)}
                            className="mt-1 mr-3 text-red-600 focus:ring-red-500"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{address.name}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.street}, {address.city}, {address.state}, {address.postalCode}
                            </p>
                            {address.isDefault && (
                              <span className="inline-block mt-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                                Default Address
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No addresses found.</p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <Link 
                    to="/user-profile" 
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                    onClick={() => setIsModalOpen(false)}
                  >
                    + Add a new address
                  </Link>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter pincode
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit pincode"
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-red-500 text-sm"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        maxLength={6}
                      />
                      <button
                        onClick={verifyPinCode}
                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition font-medium text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[81px] sm:[90px] lg:h-[138px]"></div>
    </>
  );
};

export default Header;



// import React, { useContext, useState, useEffect, useRef } from "react";
// //import Logo from "../assest/relda.svg";
// //import Logo from "../assest/reld.svg";
// // import Logo from "../assest/140 X 80-02.png";
// import Logo from "../assest/Logo.png";
// import { Helmet } from 'react-helmet';
// //import Logo from "../assest/banner/logo.png";
// import { GrSearch } from "react-icons/gr";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { FaShoppingCart, FaRegHeart } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import SummaryApi from "../common";
// import { toast } from "react-toastify";
// import { setUserDetails } from "../store/userSlice";
// import ROLE from "../common/role";
// import Context from "../context";
// import axios from "axios";
// import { HiOutlineLocationMarker } from "react-icons/hi";
// import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

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
  
//   const { pathname } = useLocation();
//   const canonicalURL = `${window.location.origin}${pathname}`;

//   const [pinCode, setPinCode] = useState("");
//   const [deliveryLocation, setDeliveryLocation] = useState(" ");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [addresses, setAddresses] = useState([]); // State to store fetched addresses
//   const [selectedAddress, setSelectedAddress] = useState(null); // Track selected address
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const menuRef = useRef(null);
//   const modalRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const searchRef = useRef(null);

//     // Helper function to get cookies
//      const getCookie = (name) => {
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
//       if (parts.length === 2) return parts.pop().split(";").shift();
//     };

//     useEffect(() => {
//       const fetchUserData = async () => {
//         if (user) {
//           try {
//             const token = getCookie("token");
//             const response = await fetch(SummaryApi.viewuser.url(user._id), {
//               method: SummaryApi.viewuser.method,
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }); 

//             const result = await response.json();
             
//             if (result.success) {
//               // Normalize address data
//               const addressData = Array.isArray(result.data.address)
//                 ? result.data.address
//                 : [result.data.address]; // Convert single object to array

//                 setAddresses(
//                   addressData.map((address, index) => ({
//                     ...address,
//                     name: result.data.name || "Unknown User", // Add user name
//                     isDefault: address?.isDefault || index === 0, // Optional: Set the first address as default
//                   }))
//                 );
//                 // Set delivery location based on the default address
//                 if (addressData[0]?.city && addressData[0]?.state) {
//                   setDeliveryLocation({district: addressData[0].city, state: addressData[0].state,});
//                 }
//               } else {
//                 toast.error(result.message);
//               }
//             } catch (error) {
//               console.error("Error fetching user data:", error);
//               toast.error("Failed to fetch user data. Please try again.");
//             }
//           }
//         };
      
//         fetchUserData();
//       }, [user]);

//     const handleAddressSelection = (id) => {
//       const updatedAddresses = addresses.map((address) => address.id === id
//           ? { ...address, isDefault: true}
//           : { ...address, isDefault: false}
//         );
//         setAddresses(updatedAddresses);
//         setSelectedAddress(id);
//     };
  

//   const verifyPinCode = async () => {
//     if (!pinCode || !/^\d{6}$/.test(pinCode)) {
//       toast.error("Please enter a valid 6-digit pin code.");
//       return;
//     }
//     try {
//       const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`);
//       const result = response.data?.[0];
  
//       if (result?.Status === "Success" && result.PostOffice?.length > 0) {
//         // Check if the pincode belongs to Tamil Nadu and is deliverable
//         const tamilNaduLocations = result.PostOffice.filter(
//           (office) => office.State === "Tamil Nadu" && office.DeliveryStatus === "Delivery"
//         );
  
//         if (tamilNaduLocations.length > 0) {
//           const district = tamilNaduLocations[0].District; // Fetch the district from the first matching PostOffice
//           const state = tamilNaduLocations[0].State;
//           setDeliveryLocation({district, state});
//           toast.success(`Pin code is serviceable! Delivery available in ${district}, ${state}`);
//         } else {
//           toast.error("We only provide services for Tamil Nadu pin codes with delivery.");
//         }
//       } else {
//         toast.error("Invalid pin code or no details available.");
//       }
//     } catch (error) {
//       console.error("Error verifying pin code:", error);
//       toast.error("An error occurred while verifying the pin code.");
//     }
//   };

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
//     if (!showMobileSearch) {
//       navigate(`/search`);
//     } else {
//       navigate(-1);
//     }
//   };

//   const handleLogin = () => {
//     setMobileMenuDisplay(false);
//     setShowMobileSearch(false);
//   };

//   const handleUserProfileClick = () => {
//     setMenuDisplay((prev) => !prev)
//   }

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMobileMenuDisplay(false);
//         setDropdownOpen(false);
//       }
//       if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsModalOpen(false);
//       }
//       if (menuDisplay && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setMenuDisplay(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowMobileSearch(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [isModalOpen, menuDisplay]);
  

//   return (
//     <>

//       <Helmet>
//         <link rel="canonical" href={canonicalURL} />
//         <title>Relda India | Smart Home & Electronic Appliances Store</title>
//       </Helmet>

      
//       <header className="bg-slate-200 h-18 fixed w-full z-40">
//           <div className="container mx-auto flex items-center justify-between px-4 md:px-8 py-2 md:py-4">
//             <div className="flex-shrink-0">
//              <img
//                 onClick = {() => navigate("/")}
//                 src={Logo}
//                 alt="Logo"
//                 className="logo cursor-pointer w-24 h-auto md:w-32" // Adjust width for mobile
//               />
//             </div>

//             <div className="hidden lg:flex items-center max-w-sm border rounded-full focus-within:shadow pl-2 bg-white flex-grow mx-4">
//               <input
//                 type="text"
//                 placeholder="search product here..."
//                 className="w-full outline-none p-1 ml-2 text-sm"
//                 onChange={handleSearch}
//                 value={search}
//               />
//               <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white"><GrSearch /></div>
//             </div>

//             {/* Delivery Location Section */}
//             <div className="hidden md:flex items-center space-x-4">
//               <div className="flex items-center space-x-2 text-sm">
//                 <span className="text-blue-600 text-lg flex items-center"><HiOutlineLocationMarker className="w-5 h-5"/></span>
//               <span
//                 className="font-bold truncate cursor-pointer"
//                 onClick={() => setIsModalOpen(true)}
//               >
//                 Delivery to: {deliveryLocation.district}, {deliveryLocation.state}
//               </span>
//               </div>
//             </div>

//             {/* Modal for Pin Code Input */}
//             {isModalOpen && (
//               <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//                 <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-4/5 md:w-[400px] max-w-md mx-auto">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-bold">Select Default Address</h3>
//                     <button
//                       onClick={() => setIsModalOpen(false)}
//                       className="w-fit ml-auto text-2xl hover:text-gray-800 cursor-pointer"
//                       aria-label="Close modal"
//                     >
//                       <IoClose />
//                     </button> 
//                   </div>

//                   <p className="text-sm text-gray-600 mb-4">
//                     Select a delivery location to see product availability and delivery options.
//                   </p>

//                 <div className="address-list-container p-4 border rounded overflow-auto max-h-60">
//                   {addresses && addresses.length > 0 ? (
//                     addresses.map((address) => (
//                       <label
//                         key={address.id} // Ensure a unique key for each address
//                         className={`block border rounded-lg p-4 mb-3 cursor-pointer ${selectedAddress === address.id
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-gray-300"
//                           }`}
//                       >
//                         <div className="flex items-start">
//                           <input
//                             type="radio"
//                             name="address"
//                             value={address.id}
//                             checked={selectedAddress === address.id}
//                             onChange={() => handleAddressSelection(address.id)} // Set selected address
//                             className="mr-3 mt-1"
//                             aria-labelledby={`address-${address.id}`}
//                           />
//                           <div>
//                             <p id={`address-${address.id}`} className="font-bold">
//                               {address.name}
//                             </p>
//                             <p className="text-gray-700">
//                               {address.street}, {address.city}, {address.state},{" "}
//                               {address.postalCode}, {address.country}
//                             </p>

//                             {address.isDefault && (
//                               <span className="text-green-600 text-sm font-semibold">
//                                 Default Address
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </label>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No addresses found.</p>
//                   )}
//                 </div>  

//                   {/* Add Address and Pincode Section */}
//                   <div className="mt-4">
//                     <h1 href="/user-Profile" className="text-blue-500 hover:underline text-sm">
//                       Add a new address
//                     </h1>
//                     <div className="flex items-center gap-2 mt-4 w-full">
//                       <input
//                         type="text"
//                         placeholder="Enter pincode"
//                         className="border border-gray-300 p-2 rounded flex-grow min-w-0"
//                         value={pinCode}
//                         onChange={(e) => setPinCode(e.target.value)}
//                       />
//                       <button
//                         onClick={verifyPinCode}
//                         className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex-shrink-0"
//                       >
//                         Apply
//                       </button>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center gap-5 md:gap-7 md:pl-10">
//               {/* Mobile View Search Icon */}
//               <div className="text-xl w-6 h-6 md:w-8 md:h-8 bg-red-600 flex items-center justify-center rounded-full text-white lg:hidden">
//                 <button onClick={handleSearchButton}><GrSearch className="text-sm" /></button>
//               </div>
              
//               <div className="relative flex justify-center items-center">
//                 {user?._id && (
//                   <div
//                     className="cursor-pointer flex justify-center items-center"
//                     onClick={handleUserProfileClick}
//                   >
//                     {user?.profilePic ? (
//                       <img
//                         src={user?.profilePic}
//                         className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
//                         alt={user?.name || "User Profile"}
//                       />
//                     ) : (
//                       <span className="text-2xl md:text-3xl lg:text-3xl"><FaRegCircleUser /></span>
//                     )}
//                   </div>
//                 )}


//                 {/* Dropdown menu */}
//                 {menuDisplay && (
//                   <div ref={dropdownRef} className="absolute top-full right-0 w-26 md:w-32 bg-white shadow-lg mt-2 p-4 rounded-lg border border-gray-200 z-50 whitespace-nowrap">
//                     {/* Close Button */}
//                     <div className="flex justify-end items-center">
//                       <button className="text-gray-500 hover:text-gray-700" onClick={() => setMenuDisplay(false)}><IoClose size={20} /></button>
//                     </div>
//                     <ul className="mt-2">
//                       {user?.role === ROLE.GENERAL && (
//                         <>
//                         <li
//                           className="py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
//                           onClick={() => {
//                             navigate("user-profile");
//                             setMenuDisplay(false);
//                           }}
//                         >
//                           Account
//                         </li>
//                         <li
//                           className="py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
//                           onClick={() => {
//                             navigate("order");
//                             setMenuDisplay(false);
//                           }}
//                         >
//                           My Orders
//                         </li>
//                       </>
//                     )}
//                     {user?.role === ROLE.ADMIN && (
//                       <li
//                         className="flex item-center justify-center py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
//                         onClick={() => {
//                           navigate("/admin-panel/dashboard");
//                           setMenuDisplay(false);
//                         }}
//                       >
//                         Admin Panel
//                       </li>
//                     )}
// 	 		{user?.role === ROLE.MANAGEBLOG && (
//                       <li
//                         className="flex item-center justify-center py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
//                         onClick={() => {
//                           navigate("/adminBlog/upload-blogs");
//                           setMenuDisplay(false);
//                         }}
//                       >
//                         Manage Blog
//                       </li>
//                     )}
//                   </ul>
//                   </div>
//                 )}
//               </div>
//               {user?._id && (
//                 <Link to={"/cart"} className="text-xl md:text-2xl relative">
//                   <span onClick={() => {
//                       setMenuDisplay(false);
//                       setMobileMenuDisplay(false);
//                     }}
//                   >
//                     <FaShoppingCart />
//                   </span>
//                   <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
//                     <p className="text-sm">{context?.cartProductCount}</p>
//                   </div>
//                 </Link>
//               )}
// 	<div className="relative hidden md:flex">
//       {/* Wishlist Button */}
//       <button
//         className="flex items-center gap-2 px-2 py-2 text-white transition relative "
//         onClick={() => navigate("/wishlist")}
//       >
//         <FaRegHeart className="text-2xl text-black" />
//         <span className="hidden md:inline"></span>
//       </button>
//       {/* Wishlist Count */}
//       {/* {wishlistCount > 0 && ( */}
//         <div className="absolute -top-0 -right-0 bg-red-600 text-white p-1 w-5 h-5 rounded-full flex items-center justify-center text-sm">
//           {context?.wishlistCount}
//         </div>
//       {/* )} */}
//     </div>
//               <div
//                 onClick={() => {
//                   setMenuDisplay(false);
//                 }}
//               >
//                 {user?._id ? (
//                   <button onClick={handleLogout} className="hidden lg:inline-block px-2 md:px-2 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700">
//                     Logout
//                   </button>
//                 ) : (
//                   <Link to={"/login"} onClick={handleLogin} className="px-2 md:px-2 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700">
//                     Login
//                   </Link>
//                 )}
//               </div>
//             </div>

//             {mobileMenuDisplay && (
//               <div ref={menuRef} className="lg:hidden bg-white shadow-lg absolute top-full left-0 w-full z-50">
//                 <nav className="flex flex-col gap-2 p-4">
//                   <Link to="/" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Home</Link>
//                   <Link to="/product-category" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Product Categories</Link>
//                   <Link to="/Cart" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Shopping Cart</Link>
//                   <Link to="/wishlist" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between" onClick={() => setMobileMenuDisplay(false)}>
//                     Wishlist
//                     {/* {wishlistCount > 0 && ( */}
//                       <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
//                         {context?.wishlistCount}
//                       </span>
//                     {/* )} */}
//                   </Link>
// 		<h1><Link to="/blog-page" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Blog</Link></h1>
//                   <Link to="/ContactUsPage" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Contact us</Link>

//                   <div className="relative">
//                     <button
//                     className="py-2 px-4 rounded flex justify-between items-center hover:bg-gray-100 w-full transition-colors duration-200"
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                     aria-expanded={dropdownOpen}
//                     >
//                       Services & Supports
//                       <span className="text-2xl md:text-3xl ml-5">{dropdownOpen ? <RiArrowDropDownLine /> : <RiArrowDropUpLine /> }</span>
//                     </button>
//                     {dropdownOpen && (
//                       <div className="pl-4 flex flex-col gap-2 bg-gray-50 rounded shadow-inner mt-2 transition-colors duration-200">
//                         <Link to="/CustomerSupport" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Customer Support</Link>
//                         <Link to="/ProductRegistration" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Product Registration</Link>
//                         <Link to="/AuthorizedDealer" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Authorized Dealer</Link>
//                         <Link to="/CareerPage" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Career</Link>
//                         <Link to="/AboutUs" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>About us</Link>
//                       </div>
//                     )}
//                   </div>
//        		  <div
//                     onClick={() => {
//                     setMenuDisplay(false);
//                     }}
//                     className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200 text-red-600"
//                   >
//                     {user?._id ? (
//                       <Link to={"/"} onClick={handleLogout} className="py-2 rounded hover:bg-gray-200 transition-colors duration-200">
//                         Logout
//                       </Link>
//                     ) : (
//                       <Link to={"/login"} onClick={handleLogin} className=" lg:block px-2 md:px-2 py-1 text-xs md:text-lg text-white flex text-center bg-red-600 hover:bg-red-700">
//                         Login
//                       </Link>
//                     )}
//                   </div>
//                 </nav>
//               </div>
//             )}
//             <button
//               onClick={() => setMobileMenuDisplay(!mobileMenuDisplay)}
//               className="lg:hidden bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors duration-200"
//             >
//               {mobileMenuDisplay ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
//             </button>
//           </div>
//           <hr className="border-gray-300 sm:hidden pb-1"/>
//           <div className="w-full flex justify-center sm:hidden mb-2">
//           <div className="flex items-center space-x-2 text-gray-700 text-sm">
//             <span className="text-blue-600 text-lg flex items-center">
//               <HiOutlineLocationMarker className="w-5 h-5" />
//             </span>
//             <span
//               className="font-bold cursor-pointer"
//               onClick={() => setIsModalOpen(true)}
//             >
//               Delivery to:
//             </span>
//             <span className="font-bold text-blue-600">
//               {deliveryLocation.district}, {deliveryLocation.state || " "}
//             </span>
//           </div>
//         </div>
          
//           <nav>
//             <div className="navbar mx-auto flex items-center justify-center space-x-4 text-sm font-medium text-gray-700 bg-white"
//               onClick={() => setMenuDisplay(false)}>
//               <Link to={""} className="hover-underline">Home</Link>
//               <div className="dropdown inline-block">
//                 <button className="dropbtn hover-underline">Shop</button>
//                 <div className="dropdown-content">
//                   <div className="row">
//                     <div className="column">
//                       <Link to={"product-category"} className="hover-underline">Product Categories</Link>
                      
//                       <Link to={"Cart"} className="hover-underline">Shopping Cart</Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <Link to={"blog-page"} className="hover-underline">Blog</Link>
//               <Link to={"ContactUsPage"} className="hover-underline">Contact us</Link>
//               <div className="dropdown inline-block">
//                 <button className="dropbtn hover-underline">Services & Supports</button>
//                 <div className="dropdown-content">
//                   <div className="row">
//                     <div className="column">
//                       {/* <Link to={"ServiceRequest"} className="hover-underline">ServiceRequest</Link> */}
//                       <Link to={"CustomerSupport"} className="hover-underline">Customer Support</Link>
//                       <Link to={"ProductRegistration"} className="hover-underline">Product Registration</Link>
//                       <Link to={"AuthorizedDealer"} className="hover-underline">Authorized Dealer</Link>
//                       <Link to={"CareerPage"} className="hover-underline">Career</Link>
//                       <Link to={"AboutUs"} className="hover-underline">About us</Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </nav>

//           {showMobileSearch && (
//             <div ref={searchRef} className="flex items-center mt-2 lg:hidden w-full">
//               <div className="w-full border rounded-full focus-within:shadow pl-2 bg-white">
//                 <input
//                   type="text"
//                   placeholder="search product here..."
//                   className="w-full outline-none p-1 ml-1"
//                   onChange={handleSearch}
//                   value={search}
//                 />
//               </div>
//               <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
//                 <GrSearch />
//               </div>
//             </div>
//           )}
//         </header>
//       </>
//   );
// };

// export default Header;


// import React, { useContext, useState, useEffect, useRef } from "react";
// //import Logo from "../assest/relda.svg";
// //import Logo from "../assest/reld.svg";
// // import Logo from "../assest/140 X 80-02.png";
// import Logo from "../assest/Logo.png";
// import { Helmet } from 'react-helmet';
// //import Logo from "../assest/banner/logo.png";
// import { GrSearch } from "react-icons/gr";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { FaShoppingCart, FaRegHeart } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import SummaryApi from "../common";
// import { toast } from "react-toastify";
// import { setUserDetails } from "../store/userSlice";
// import ROLE from "../common/role";
// import Context from "../context";
// import axios from "axios";
// import { HiOutlineLocationMarker } from "react-icons/hi";
// import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

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
  
//   const { pathname } = useLocation();
//   const canonicalURL = `${window.location.origin}${pathname}`;

//   const [pinCode, setPinCode] = useState("");
//   const [deliveryLocation, setDeliveryLocation] = useState(" ");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [addresses, setAddresses] = useState([]); // State to store fetched addresses
//   const [selectedAddress, setSelectedAddress] = useState(null); // Track selected address
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const menuRef = useRef(null);
//   const modalRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const searchRef = useRef(null);

//     // Helper function to get cookies
//      const getCookie = (name) => {
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
//       if (parts.length === 2) return parts.pop().split(";").shift();
//     };

//     useEffect(() => {
//       const fetchUserData = async () => {
//         if (user) {
//           try {
//             const token = getCookie("token");
//             const response = await fetch(SummaryApi.viewuser.url(user._id), {
//               method: SummaryApi.viewuser.method,
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }); 

//             const result = await response.json();
             
//             if (result.success) {
//               // Normalize address data
//               const addressData = Array.isArray(result.data.address)
//                 ? result.data.address
//                 : [result.data.address]; // Convert single object to array

//                 setAddresses(
//                   addressData.map((address, index) => ({
//                     ...address,
//                     name: result.data.name || "Unknown User", // Add user name
//                     isDefault: address?.isDefault || index === 0, // Optional: Set the first address as default
//                   }))
//                 );
//                 // Set delivery location based on the default address
//                 if (addressData[0]?.city && addressData[0]?.state) {
//                   setDeliveryLocation({district: addressData[0].city, state: addressData[0].state,});
//                 }
//               } else {
//                 toast.error(result.message);
//               }
//             } catch (error) {
//               console.error("Error fetching user data:", error);
//               toast.error("Failed to fetch user data. Please try again.");
//             }
//           }
//         };
      
//         fetchUserData();
//       }, [user]);

//     const handleAddressSelection = (id) => {
//       const updatedAddresses = addresses.map((address) => address.id === id
//           ? { ...address, isDefault: true}
//           : { ...address, isDefault: false}
//         );
//         setAddresses(updatedAddresses);
//         setSelectedAddress(id);
//     };
  

//   const verifyPinCode = async () => {
//     if (!pinCode || !/^\d{6}$/.test(pinCode)) {
//       toast.error("Please enter a valid 6-digit pin code.");
//       return;
//     }
//     try {
//       const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`);
//       const result = response.data?.[0];
  
//       if (result?.Status === "Success" && result.PostOffice?.length > 0) {
//         // Check if the pincode belongs to Tamil Nadu and is deliverable
//         const tamilNaduLocations = result.PostOffice.filter(
//           (office) => office.State === "Tamil Nadu" && office.DeliveryStatus === "Delivery"
//         );
  
//         if (tamilNaduLocations.length > 0) {
//           const district = tamilNaduLocations[0].District; // Fetch the district from the first matching PostOffice
//           const state = tamilNaduLocations[0].State;
//           setDeliveryLocation({district, state});
//           toast.success(`Pin code is serviceable! Delivery available in ${district}, ${state}`);
//         } else {
//           toast.error("We only provide services for Tamil Nadu pin codes with delivery.");
//         }
//       } else {
//         toast.error("Invalid pin code or no details available.");
//       }
//     } catch (error) {
//       console.error("Error verifying pin code:", error);
//       toast.error("An error occurred while verifying the pin code.");
//     }
//   };

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
//     if (!showMobileSearch) {
//       navigate(`/search`);
//     } else {
//       navigate(-1);
//     }
//   };

//   const handleLogin = () => {
//     setMobileMenuDisplay(false);
//     setShowMobileSearch(false);
//   };

//   const handleUserProfileClick = () => {
//     setMenuDisplay((prev) => !prev)
//   }

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMobileMenuDisplay(false);
//         setDropdownOpen(false);
//       }
//       if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsModalOpen(false);
//       }
//       if (menuDisplay && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setMenuDisplay(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowMobileSearch(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [isModalOpen, menuDisplay]);
  

//   return (
//     <>

//       <Helmet>
//         <link rel="canonical" href={canonicalURL} />
//         <title>Relda India | Smart Home & Electronic Appliances Store</title>
//       </Helmet>

      
//       <header className="bg-white shadow-sm h-18 fixed w-full z-40">
//           <div className="mx-auto flex items-center justify-between px-4 md:px-8 py-2 md:py-4">
//             <div className="flex-shrink-0">
//              <img
//                 onClick = {() => navigate("/")}
//                 src={Logo}
//                 alt="Logo"
//                 className="logo cursor-pointer w-24 h-auto md:w-32" // Adjust width for mobile
//               />
//             </div>

//             <div className="hidden lg:flex items-center max-w-sm border rounded-full focus-within:shadow pl-2 bg-white flex-grow mx-4">
//               <input
//                 type="text"
//                 placeholder="search product here..."
//                 className="w-full outline-none p-1 ml-2 text-sm"
//                 onChange={handleSearch}
//                 value={search}
//               />
//               <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white"><GrSearch /></div>
//             </div>

//             {/* Delivery Location Section */}
//             <div className="hidden md:flex items-center space-x-4">
//               <div className="flex items-center space-x-2 text-sm">
//                 <span className="text-blue-600 text-lg flex items-center"><HiOutlineLocationMarker className="w-5 h-5"/></span>
//               <span
//                 className="font-bold truncate cursor-pointer"
//                 onClick={() => setIsModalOpen(true)}
//               >
//                 Delivery to: {deliveryLocation.district}, {deliveryLocation.state}
//               </span>
//               </div>
//             </div>

//             {/* Modal for Pin Code Input */}
//             {isModalOpen && (
//               <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//                 <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-4/5 md:w-[400px] max-w-md mx-auto">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-bold">Select Default Address</h3>
//                     <button
//                       onClick={() => setIsModalOpen(false)}
//                       className="w-fit ml-auto text-2xl hover:text-gray-800 cursor-pointer"
//                       aria-label="Close modal"
//                     >
//                       <IoClose />
//                     </button> 
//                   </div>

//                   <p className="text-sm text-gray-600 mb-4">
//                     Select a delivery location to see product availability and delivery options.
//                   </p>

//                 <div className="address-list-container p-4 border rounded overflow-auto max-h-60">
//                   {addresses && addresses.length > 0 ? (
//                     addresses.map((address) => (
//                       <label
//                         key={address.id} // Ensure a unique key for each address
//                         className={`block border rounded-lg p-4 mb-3 cursor-pointer ${selectedAddress === address.id
//                           ? "border-blue-500 bg-blue-50"
//                           : "border-gray-300"
//                           }`}
//                       >
//                         <div className="flex items-start">
//                           <input
//                             type="radio"
//                             name="address"
//                             value={address.id}
//                             checked={selectedAddress === address.id}
//                             onChange={() => handleAddressSelection(address.id)} // Set selected address
//                             className="mr-3 mt-1"
//                             aria-labelledby={`address-${address.id}`}
//                           />
//                           <div>
//                             <p id={`address-${address.id}`} className="font-bold">
//                               {address.name}
//                             </p>
//                             <p className="text-gray-700">
//                               {address.street}, {address.city}, {address.state},{" "}
//                               {address.postalCode}, {address.country}
//                             </p>

//                             {address.isDefault && (
//                               <span className="text-green-600 text-sm font-semibold">
//                                 Default Address
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </label>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No addresses found.</p>
//                   )}
//                 </div>  

//                   {/* Add Address and Pincode Section */}
//                   <div className="mt-4">
//                     <h1 href="/user-Profile" className="text-blue-500 hover:underline text-sm">
//                       Add a new address
//                     </h1>
//                     <div className="flex items-center gap-2 mt-4 w-full">
//                       <input
//                         type="text"
//                         placeholder="Enter pincode"
//                         className="border border-gray-300 p-2 rounded flex-grow min-w-0"
//                         value={pinCode}
//                         onChange={(e) => setPinCode(e.target.value)}
//                       />
//                       <button
//                         onClick={verifyPinCode}
//                         className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex-shrink-0"
//                       >
//                         Apply
//                       </button>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center gap-5 md:gap-7 md:pl-10">
//               {/* Mobile View Search Icon */}
//               <div className="text-xl w-6 h-6 md:w-8 md:h-8 bg-red-600 flex items-center justify-center rounded-full text-white lg:hidden">
//                 <button onClick={handleSearchButton}><GrSearch className="text-sm" /></button>
//               </div>
              
//               <div className="relative flex justify-center items-center">
//                 {user?._id && (
//                   <div
//                     className="cursor-pointer flex justify-center items-center"
//                     onClick={handleUserProfileClick}
//                   >
//                     {user?.profilePic ? (
//                       <img
//                         src={user?.profilePic}
//                         className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
//                         alt={user?.name || "User Profile"}
//                       />
//                     ) : (
//                       <span className="text-2xl md:text-3xl lg:text-3xl"><FaRegCircleUser /></span>
//                     )}
//                   </div>
//                 )}


//                 {/* Dropdown menu */}
//                 {menuDisplay && (
//                   <div ref={dropdownRef} className="absolute top-full right-0 w-26 md:w-32 bg-white shadow-lg mt-2 p-4 rounded-lg border border-gray-200 z-50 whitespace-nowrap">
//                     {/* Close Button */}
//                     <div className="flex justify-end items-center">
//                       <button className="text-gray-500 hover:text-gray-700" onClick={() => setMenuDisplay(false)}><IoClose size={20} /></button>
//                     </div>
//                     <ul className="mt-2">
//                       {user?.role === ROLE.GENERAL && (
//                         <>
//                         <li
//                           className="py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
//                           onClick={() => {
//                             navigate("user-profile");
//                             setMenuDisplay(false);
//                           }}
//                         >
//                           Account
//                         </li>
//                         <li
//                           className="py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
//                           onClick={() => {
//                             navigate("order");
//                             setMenuDisplay(false);
//                           }}
//                         >
//                           My Orders
//                         </li>
//                       </>
//                     )}
//                     {user?.role === ROLE.ADMIN && (
//                       <li
//                         className="flex item-center justify-center py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
//                         onClick={() => {
//                           navigate("/admin-panel/dashboard");
//                           setMenuDisplay(false);
//                         }}
//                       >
//                         Admin Panel
//                       </li>
//                     )}
// 	 		{user?.role === ROLE.MANAGEBLOG && (
//                       <li
//                         className="flex item-center justify-center py-2 px-3 text-sm md:text-base hover:bg-gray-100 cursor-pointer rounded-lg"
//                         onClick={() => {
//                           navigate("/adminBlog/upload-blogs");
//                           setMenuDisplay(false);
//                         }}
//                       >
//                         Manage Blog
//                       </li>
//                     )}
//                   </ul>
//                   </div>
//                 )}
//               </div>
//               {user?._id && (
//                 <Link to={"/cart"} className="text-xl md:text-2xl relative">
//                   <span onClick={() => {
//                       setMenuDisplay(false);
//                       setMobileMenuDisplay(false);
//                     }}
//                   >
//                     <FaShoppingCart />
//                   </span>
//                   <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
//                     <p className="text-sm">{context?.cartProductCount}</p>
//                   </div>
//                 </Link>
//               )}
// 	<div className="relative hidden md:flex">
//       {/* Wishlist Button */}
//       <button
//         className="flex items-center gap-2 px-2 py-2 text-white transition relative "
//         onClick={() => navigate("/wishlist")}
//       >
//         <FaRegHeart className="text-2xl text-black" />
//         <span className="hidden md:inline"></span>
//       </button>
//       {/* Wishlist Count */}
//       {/* {wishlistCount > 0 && ( */}
//         <div className="absolute -top-0 -right-0 bg-red-600 text-white p-1 w-5 h-5 rounded-full flex items-center justify-center text-sm">
//           {context?.wishlistCount}
//         </div>
//       {/* )} */}
//     </div>
//               <div
//                 onClick={() => {
//                   setMenuDisplay(false);
//                 }}
//               >
//                 {user?._id ? (
//                   <button onClick={handleLogout} className="hidden lg:inline-block px-2 md:px-2 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700">
//                     Logout
//                   </button>
//                 ) : (
//                   <Link to={"/login"} onClick={handleLogin} className="px-2 md:px-2 py-1 text-xs md:text-lg rounded-full text-white bg-red-600 hover:bg-red-700">
//                     Login
//                   </Link>
//                 )}
//               </div>
//             </div>

//             {mobileMenuDisplay && (
//               <div ref={menuRef} className="lg:hidden bg-white shadow-lg absolute top-full left-0 w-full z-50">
//                 <nav className="flex flex-col gap-2 p-4">
//                   <Link to="/" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Home</Link>
//                   <Link to="/product-category" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Product Categories</Link>
//                   <Link to="/Cart" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Shopping Cart</Link>
//                   <Link to="/wishlist" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between" onClick={() => setMobileMenuDisplay(false)}>
//                     Wishlist
//                     {/* {wishlistCount > 0 && ( */}
//                       <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
//                         {context?.wishlistCount}
//                       </span>
//                     {/* )} */}
//                   </Link>
// 		<h1><Link to="/blog-page" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Blog</Link></h1>
//                   <Link to="/ContactUsPage" className="py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Contact us</Link>

//                   <div className="relative">
//                     <button
//                     className="py-2 px-4 rounded flex justify-between items-center hover:bg-gray-100 w-full transition-colors duration-200"
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                     aria-expanded={dropdownOpen}
//                     >
//                       Services & Supports
//                       <span className="text-2xl md:text-3xl ml-5">{dropdownOpen ? <RiArrowDropDownLine /> : <RiArrowDropUpLine /> }</span>
//                     </button>
//                     {dropdownOpen && (
//                       <div className="pl-4 flex flex-col gap-2 bg-gray-50 rounded shadow-inner mt-2 transition-colors duration-200">
//                         <Link to="/CustomerSupport" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Customer Support</Link>
//                         <Link to="/ProductRegistration" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Product Registration</Link>
//                         <Link to="/AuthorizedDealer" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Authorized Dealer</Link>
//                         <Link to="/CareerPage" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>Career</Link>
//                         <Link to="/AboutUs" className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200" onClick={() => setMobileMenuDisplay(false)}>About us</Link>
//                       </div>
//                     )}
//                   </div>
//        		  <div
//                     onClick={() => {
//                     setMenuDisplay(false);
//                     }}
//                     className="py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-200 text-red-600"
//                   >
//                     {user?._id ? (
//                       <Link to={"/"} onClick={handleLogout} className="py-2 rounded hover:bg-gray-200 transition-colors duration-200">
//                         Logout
//                       </Link>
//                     ) : (
//                       <Link to={"/login"} onClick={handleLogin} className="lg:block px-2 md:px-2 py-1 text-xs md:text-lg text-white flex text-center bg-red-600 hover:bg-red-700">
//                         Login
//                       </Link>
//                     )}
//                   </div>
//                 </nav>
//               </div>
//             )}
//             <button
//               onClick={() => setMobileMenuDisplay(!mobileMenuDisplay)}
//               className="lg:hidden p-1 rounded hover:bg-[#e60000] hover:text-white transition-colors duration-200"
//             >
//               {mobileMenuDisplay ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
//             </button>
//           </div>
//           <hr className=" sm:hidden pb-1"/>
//           <div className="w-full flex justify-center sm:hidden mb-2">
//           <div className="flex items-center space-x-2 text-gray-700 text-sm">
//             <span className="text-blue-600 text-lg flex items-center">
//               <HiOutlineLocationMarker className="w-5 h-5" />
//             </span>
//             <span
//               className="font-bold cursor-pointer"
//               onClick={() => setIsModalOpen(true)}
//             >
//               Delivery to:
//             </span>
//             <span className="font-bold text-blue-600">
//               {deliveryLocation.district}, {deliveryLocation.state || " "}
//             </span>
//           </div>
//         </div>
            
//           <nav>
//             <div className="navbar mx-auto flex items-center justify-center space-x-4 text-sm font-medium text-white bg-[linear-gradient(90deg,#7A0100_0%,#AA0000_50%,#7A0100_100%)]"
//               onClick={() => setMenuDisplay(false)}>
//               <Link to={""} className="hover-underline">Home</Link>
//               <div className="dropdown inline-block">
//                 <button className="dropbtn hover-underline">Shop</button>
//                 <div className="dropdown-content">
//                   <div className="row">
//                     <div className="column">
//                       <Link to={"product-category"} className="hover-underline">Product Categories</Link>
                      
//                       <Link to={"Cart"} className="hover-underline">Shopping Cart</Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <Link to={"blog-page"} className="hover-underline">Blog</Link>
//               <Link to={"ContactUsPage"} className="hover-underline">Contact us</Link>
//               <div className="dropdown inline-block">
//                 <button className="dropbtn hover-underline">Services & Supports</button>
//                 <div className="dropdown-content">
//                   <div className="row">
//                     <div className="column">
//                       {/* <Link to={"ServiceRequest"} className="hover-underline">ServiceRequest</Link> */}
//                       <Link to={"CustomerSupport"} className="hover-underline">Customer Support</Link>
//                       <Link to={"ProductRegistration"} className="hover-underline">Product Registration</Link>
//                       <Link to={"AuthorizedDealer"} className="hover-underline">Authorized Dealer</Link>
//                       <Link to={"CareerPage"} className="hover-underline">Career</Link>
//                       <Link to={"AboutUs"} className="hover-underline">About us</Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </nav>

//           {showMobileSearch && (
//             <div ref={searchRef} className="flex items-center mt-2 lg:hidden w-full">
//               <div className="w-full border rounded-full focus-within:shadow pl-2 bg-white">
//                 <input
//                   type="text"
//                   placeholder="search product here..."
//                   className="w-full outline-none p-1 ml-1"
//                   onChange={handleSearch}
//                   value={search}
//                 />
//               </div>
//               <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
//                 <GrSearch />
//               </div>
//             </div>
//           )}
//         </header>
//       </>
//   );
// };

// export default Header;


// import React, { useContext, useState, useEffect, useRef } from "react";
// import Logo from "../assest/Logo.png";
// import { Helmet } from 'react-helmet';
// import { GrSearch } from "react-icons/gr";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { FaShoppingCart, FaRegHeart } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import SummaryApi from "../common";
// import { toast } from "react-toastify";
// import { setUserDetails } from "../store/userSlice";
// import ROLE from "../common/role";
// import Context from "../context";
// import axios from "axios";
// import { HiOutlineLocationMarker } from "react-icons/hi";
// import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

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
  
//   const { pathname } = useLocation();
//   const canonicalURL = `${window.location.origin}${pathname}`;

//   const [pinCode, setPinCode] = useState("");
//   const [deliveryLocation, setDeliveryLocation] = useState({ district: "", state: "" });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
//   const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  
//   const menuRef = useRef(null);
//   const modalRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const searchRef = useRef(null);

//   // Helper function to get cookies
//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(";").shift();
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         try {
//           const token = getCookie("token");
//           const response = await fetch(SummaryApi.viewuser.url(user._id), {
//             method: SummaryApi.viewuser.method,
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }); 

//           const result = await response.json();
           
//           if (result.success) {
//             const addressData = Array.isArray(result.data.address)
//               ? result.data.address
//               : [result.data.address];

//             setAddresses(
//               addressData.map((address, index) => ({
//                 ...address,
//                 name: result.data.name || "Unknown User",
//                 isDefault: address?.isDefault || index === 0,
//               }))
//             );
            
//             if (addressData[0]?.city && addressData[0]?.state) {
//               setDeliveryLocation({district: addressData[0].city, state: addressData[0].state});
//             }
//           } else {
//             toast.error(result.message);
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           toast.error("Failed to fetch user data. Please try again.");
//         }
//       }
//     };
  
//     fetchUserData();
//   }, [user]);

//   const handleAddressSelection = (id) => {
//     const updatedAddresses = addresses.map((address) => 
//       address.id === id
//         ? { ...address, isDefault: true}
//         : { ...address, isDefault: false}
//     );
//     setAddresses(updatedAddresses);
//     setSelectedAddress(id);
//   };

//   const verifyPinCode = async () => {
//     if (!pinCode || !/^\d{6}$/.test(pinCode)) {
//       toast.error("Please enter a valid 6-digit pin code.");
//       return;
//     }
//     try {
//       const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`);
//       const result = response.data?.[0];
  
//       if (result?.Status === "Success" && result.PostOffice?.length > 0) {
//         const tamilNaduLocations = result.PostOffice.filter(
//           (office) => office.State === "Tamil Nadu" && office.DeliveryStatus === "Delivery"
//         );
  
//         if (tamilNaduLocations.length > 0) {
//           const district = tamilNaduLocations[0].District;
//           const state = tamilNaduLocations[0].State;
//           setDeliveryLocation({district, state});
//           toast.success(`Pin code is serviceable! Delivery available in ${district}, ${state}`);
//         } else {
//           toast.error("We only provide services for Tamil Nadu pin codes with delivery.");
//         }
//       } else {
//         toast.error("Invalid pin code or no details available.");
//       }
//     } catch (error) {
//       console.error("Error verifying pin code:", error);
//       toast.error("An error occurred while verifying the pin code.");
//     }
//   };

//   const handleLogout = async () => {
//     const fetchData = await fetch(SummaryApi.logout_user.url, {
//       method: SummaryApi.logout_user.method,
//       credentials: "include",
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
//     if (!showMobileSearch) {
//       navigate(`/search`);
//     } else {
//       navigate(-1);
//     }
//   };

//   const handleLogin = () => {
//     setMobileMenuDisplay(false);
//     setShowMobileSearch(false);
//   };

//   const handleUserProfileClick = () => {
//     if (user?._id) {
//       setMenuDisplay((prev) => !prev);
//     } else {
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMobileMenuDisplay(false);
//         setDropdownOpen(false);
//         setShopDropdownOpen(false);
//         setServicesDropdownOpen(false);
//       }
//       if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsModalOpen(false);
//       }
//       if (menuDisplay && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setMenuDisplay(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowMobileSearch(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [isModalOpen, menuDisplay]);

//   return (
//     <>
//       <Helmet>
//         <link rel="canonical" href={canonicalURL} />
//         <title>Relda India | Smart Home & Electronic Appliances Store</title>
//       </Helmet>

//       <header className="bg-white shadow-md fixed w-full z-50 top-0">
//         {/* Top Header Section */}
//         <div className="bg-white border-b border-gray-200">
//           <div className="container mx-auto px-4 py-3 md:py-4">
//             <div className="flex items-center justify-between">
//               {/* Logo */}
//               <div className="flex-shrink-0">
//                 <img
//                   onClick={() => navigate("/")}
//                   src={Logo}
//                   alt="Relda Logo"
//                   className="cursor-pointer h-10 md:h-12 w-auto"
//                 />
//               </div>

//               {/* Search Bar - Desktop & Tablet */}
//               <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
//                 <div className="relative w-full">
//                   <input
//                     type="text"
//                     placeholder="What are you looking for..."
//                     className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-red-500 text-sm"
//                     onChange={handleSearch}
//                     value={search}
//                   />
//                   <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                     <GrSearch className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Right Section - Desktop & Tablet */}
//               <div className="hidden md:flex items-center space-x-6">
//                 {/* Delivery Location */}
//                 <div 
//                   className="flex items-center space-x-2 cursor-pointer hover:text-red-600 transition"
//                   onClick={() => setIsModalOpen(true)}
//                 >
//                   <HiOutlineLocationMarker className="w-5 h-5 text-red-600" />
//                   <div className="text-sm">
//                     <div className="font-semibold">
//                       {deliveryLocation.district || "Chennai"}, {deliveryLocation.state || "600040"}
//                     </div>
//                   </div>
//                 </div>

//                 {/* User Profile */}
//                 <div className="relative">
//                   <div
//                     className="cursor-pointer hover:opacity-80 transition"
//                     onClick={handleUserProfileClick}
//                   >
//                     {user?._id && user?.profilePic ? (
//                       <img
//                         src={user?.profilePic}
//                         className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
//                         alt={user?.name || "User Profile"}
//                       />
//                     ) : (
//                       <FaRegCircleUser className="w-8 h-8 text-gray-700" />
//                     )}
//                   </div>

//                   {/* User Dropdown - Only show when logged in */}
//                   {menuDisplay && user?._id && (
//                     <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">
//                       <button 
//                         className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//                         onClick={() => setMenuDisplay(false)}
//                       >
//                         <IoClose size={20} />
//                       </button>
                      
//                       <div className="pt-6">
//                         {user?.role === ROLE.GENERAL && (
//                           <>
//                             <Link
//                               to="user-profile"
//                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
//                               onClick={() => setMenuDisplay(false)}
//                             >
//                               Account
//                             </Link>
//                             <Link
//                               to="order"
//                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
//                               onClick={() => setMenuDisplay(false)}
//                             >
//                               My Orders
//                             </Link>
//                           </>
//                         )}
//                         {user?.role === ROLE.ADMIN && (
//                           <Link
//                             to="/admin-panel/dashboard"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
//                             onClick={() => setMenuDisplay(false)}
//                           >
//                             Admin Panel
//                           </Link>
//                         )}
//                         {user?.role === ROLE.MANAGEBLOG && (
//                           <Link
//                             to="/adminBlog/upload-blogs"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
//                             onClick={() => setMenuDisplay(false)}
//                           >
//                             Manage Blog
//                           </Link>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Wishlist - Show for both logged in and not logged in */}
//                 <Link to="/wishlist" className="relative hover:opacity-80 transition">
//                   <FaRegHeart className="w-6 h-6 text-gray-700" />
//                   {context?.wishlistCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                       {context?.wishlistCount}
//                     </span>
//                   )}
//                 </Link>

//                 {/* Cart - Show for both logged in and not logged in */}
//                 <Link to="/cart" className="relative hover:opacity-80 transition">
//                   <FaShoppingCart className="w-6 h-6 text-gray-700" />
//                   {context?.cartProductCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                       {context?.cartProductCount}
//                     </span>
//                   )}
//                 </Link>

//                 {/* Login/Logout Button */}
//                 <div>
//                   {user?._id ? (
//                     <button
//                       onClick={handleLogout}
//                       className="hidden lg:block px-4 py-2 text-sm rounded-full text-white bg-red-600 hover:bg-red-700 transition"
//                     >
//                       Logout
//                     </button>
//                   ) : (
//                     <Link
//                       to="/login"
//                       className="px-4 py-2 text-sm rounded-full text-white bg-red-600 hover:bg-red-700 transition"
//                     >
//                       Login
//                     </Link>
//                   )}
//                 </div>
//               </div>

//               {/* Mobile Icons */}
//               <div className="flex md:hidden items-center space-x-4">
//                 {/* Mobile Search */}
//                 <button onClick={handleSearchButton} className="text-gray-700">
//                   <GrSearch className="w-5 h-5" />
//                 </button>

//                 {/* Mobile User Profile */}
//                 <div className="cursor-pointer" onClick={handleUserProfileClick}>
//                   {user?._id && user?.profilePic ? (
//                     <img
//                       src={user?.profilePic}
//                       className="w-7 h-7 rounded-full object-cover"
//                       alt={user?.name}
//                     />
//                   ) : (
//                     <FaRegCircleUser className="w-6 h-6" />
//                   )}
//                 </div>

//                 {/* Mobile Wishlist */}
//                 <Link to="/wishlist" className="relative">
//                   <FaRegHeart className="w-6 h-6" />
//                   {context?.wishlistCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                       {context?.wishlistCount}
//                     </span>
//                   )}
//                 </Link>

//                 {/* Mobile Cart */}
//                 <Link to="/cart" className="relative">
//                   <FaShoppingCart className="w-6 h-6" />
//                   {context?.cartProductCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                       {context?.cartProductCount}
//                     </span>
//                   )}
//                 </Link>

//                 {/* Hamburger Menu */}
//                 <button
//                   onClick={() => setMobileMenuDisplay(!mobileMenuDisplay)}
//                   className="text-gray-700 focus:outline-none"
//                 >
//                   {mobileMenuDisplay ? <IoClose size={28} /> : <GiHamburgerMenu size={28} />}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Search Bar */}
//         {showMobileSearch && (
//           <div ref={searchRef} className="bg-white border-b border-gray-200 px-4 py-3 md:hidden">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="What are you looking for..."
//                 className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-red-500 text-sm"
//                 onChange={handleSearch}
//                 value={search}
//               />
//               <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
//                 <GrSearch className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Mobile Delivery Location */}
//         <div className="md:hidden bg-gray-50 border-b border-gray-200 px-4 py-2">
//           <div 
//             className="flex items-center space-x-2 text-sm cursor-pointer"
//             onClick={() => setIsModalOpen(true)}
//           >
//             <HiOutlineLocationMarker className="w-4 h-4 text-red-600" />
//             <span className="text-gray-600">Delivery to:</span>
//             <span className="font-semibold text-gray-900">
//               {deliveryLocation.district || "Chennai"}, {deliveryLocation.state || "600040"}
//             </span>
//           </div>
//         </div>

//         {/* Navigation Bar - Desktop */}
//         <nav className="hidden lg:block bg-gradient-to-r from-[#7A0100] via-[#AA0000] to-[#7A0100]">
//           <div className="container mx-auto">
//             <ul className="flex items-center justify-center space-x-8 text-white font-medium">
//               <li>
//                 <Link 
//                   to="/" 
//                   className="block py-4 px-2 hover:bg-white/10 transition-colors relative group"
//                 >
//                   Home
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
//                 </Link>
//               </li>

//               {/* Shop Dropdown */}
//               <li className="relative group">
//                 <button className="py-4 px-2 hover:bg-white/10 transition-colors relative">
//                   Shop
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
//                 </button>
                
//                 {/* Mega Dropdown */}
//                 <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-screen bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
//                   <div className="container mx-auto py-8 px-8">
//                     <div className="grid grid-cols-4 gap-8">
//                       {/* Column 1 */}
//                       <div>
//                         <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">Saree</h3>
//                         <ul className="space-y-2">
//                           <li><Link to="/category/saree" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">T-shirts & Polos</Link></li>
//                           <li><Link to="/category/saree" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Shirts (Casual & Formal)</Link></li>
//                           <li><Link to="/category/saree" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Jeans & Trousers</Link></li>
//                         </ul>
//                       </div>

//                       {/* Column 2 */}
//                       <div>
//                         <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">Tops & Dresses</h3>
//                         <ul className="space-y-2">
//                           <li><Link to="/category/tops" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Dresses & Gowns</Link></li>
//                           <li><Link to="/category/tops" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Tops & T-Shirts</Link></li>
//                           <li><Link to="/category/tops" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Shirts & Blouses</Link></li>
//                         </ul>
//                       </div>

//                       {/* Column 3 */}
//                       <div>
//                         <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">Fancy Saree</h3>
//                         <ul className="space-y-2">
//                           <li><Link to="/category/fancy-saree" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Kids Accessories</Link></li>
//                           <li><Link to="/category/fancy-saree" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Backpacks & School Bags</Link></li>
//                           <li><Link to="/category/fancy-saree" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Caps & Hats</Link></li>
//                         </ul>
//                       </div>

//                       {/* Column 4 - Image */}
//                       <div className="space-y-4">
//                         <div className="bg-gray-100 rounded-lg overflow-hidden h-40">
//                           <img 
//                             src="https://via.placeholder.com/300x200" 
//                             alt="Shop Banner" 
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="bg-pink-100 rounded-lg overflow-hidden h-40">
//                           <img 
//                             src="https://via.placeholder.com/300x200" 
//                             alt="Shop Banner 2" 
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </li>

//               <li>
//                 <Link 
//                   to="/blog-page" 
//                   className="block py-4 px-2 hover:bg-white/10 transition-colors relative group"
//                 >
//                   Blog
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
//                 </Link>
//               </li>

//               <li>
//                 <Link 
//                   to="/ContactUsPage" 
//                   className="block py-4 px-2 hover:bg-white/10 transition-colors relative group"
//                 >
//                   Contact Us
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
//                 </Link>
//               </li>

//               {/* Services & Supports Dropdown */}
//               <li className="relative group">
//                 <button className="py-4 px-2 hover:bg-white/10 transition-colors relative">
//                   Services & Supports
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
//                 </button>
                
//                 {/* Dropdown */}
//                 <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-screen bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
//                   <div className="container mx-auto py-8 px-8">
//                     <div className="grid grid-cols-3 gap-8">
//                       <div>
//                         <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">Support</h3>
//                         <ul className="space-y-2">
//                           <li><Link to="/CustomerSupport" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Customer Support</Link></li>
//                           <li><Link to="/ProductRegistration" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Product Registration</Link></li>
//                         </ul>
//                       </div>
                      
//                       <div>
//                         <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">Company</h3>
//                         <ul className="space-y-2">
//                           <li><Link to="/AboutUs" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">About Us</Link></li>
//                           <li><Link to="/CareerPage" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Career</Link></li>
//                           <li><Link to="/AuthorizedDealer" className="text-gray-700 hover:text-red-600 transition text-sm block py-1">Authorized Dealer</Link></li>
//                         </ul>
//                       </div>

//                       <div className="bg-gray-100 rounded-lg overflow-hidden">
//                         <img 
//                           src="https://via.placeholder.com/300x200" 
//                           alt="Support Banner" 
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </nav>

//         {/* Mobile Menu */}
//         {mobileMenuDisplay && (
//           <div ref={menuRef} className="lg:hidden bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto">
//             <nav className="py-2">
//               <Link 
//                 to="/" 
//                 className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Home
//               </Link>

//               {/* Shop Dropdown Mobile */}
//               <div className="border-b border-gray-100">
//                 <button
//                   className="w-full flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
//                   onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
//                 >
//                   <span>Shop</span>
//                   {shopDropdownOpen ? <RiArrowDropUpLine size={24} /> : <RiArrowDropDownLine size={24} />}
//                 </button>
                
//                 {shopDropdownOpen && (
//                   <div className="bg-gray-50 px-6 py-2">
//                     <Link 
//                       to="/product-category" 
//                       className="block py-2 text-sm text-gray-600 hover:text-red-600"
//                       onClick={() => setMobileMenuDisplay(false)}
//                     >
//                       Product Categories
//                     </Link>
//                     <Link 
//                       to="/Cart" 
//                       className="block py-2 text-sm text-gray-600 hover:text-red-600"
//                       onClick={() => setMobileMenuDisplay(false)}
//                     >
//                       Shopping Cart
//                     </Link>
//                     <Link 
//                       to="/wishlist" 
//                       className="py-2 text-sm text-gray-600 hover:text-red-600 flex items-center justify-between"
//                       onClick={() => setMobileMenuDisplay(false)}
//                     >
//                       <span>Wishlist</span>
//                       {context?.wishlistCount > 0 && (
//                         <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
//                           {context?.wishlistCount}
//                         </span>
//                       )}
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               <Link 
//                 to="/blog-page" 
//                 className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Blog
//               </Link>

//               <Link 
//                 to="/ContactUsPage" 
//                 className="block px-6 py-3 text-gray-700 hover:bg-gray-100 transition border-b border-gray-100"
//                 onClick={() => setMobileMenuDisplay(false)}
//               >
//                 Contact Us
//               </Link>

//               {/* Services Dropdown Mobile */}
//               <div className="border-b border-gray-100">
//                 <button
//                   className="w-full flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
//                   onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
//                 >
//                   <span>Services & Supports</span>
//                   {servicesDropdownOpen ? <RiArrowDropUpLine size={24} /> : <RiArrowDropDownLine size={24} />}
//                 </button>
                
//                 {servicesDropdownOpen && (
//                   <div className="bg-gray-50 px-6 py-2">
//                     <Link 
//                       to="/CustomerSupport" 
//                       className="block py-2 text-sm text-gray-600 hover:text-red-600"
//                       onClick={() => setMobileMenuDisplay(false)}
//                     >
//                       Customer Support
//                     </Link>
//                     <Link 
//                       to="/ProductRegistration" 
//                       className="block py-2 text-sm text-gray-600 hover:text-red-600"
//                       onClick={() => setMobileMenuDisplay(false)}
//                     >
//                       Product Registration
//                     </Link>
//                     <Link 
//                       to="/AuthorizedDealer" 
//                       className="block py-2 text-sm text-gray-600 hover:text-red-600"
//                       onClick={() => setMobileMenuDisplay(false)}
//                     >
//                       Authorized Dealer
//                     </Link>
//                     <Link 
//                       to="/CareerPage" 
//                       className="block py-2 text-sm text-gray-600 hover:text-red-600"
//                       onClick={() => setMobileMenuDisplay(false)}
//                     >
//                       Career
//                     </Link>
//                     <Link 
//                       to="/AboutUs" 
//                       className="block py-2 text-sm text-gray-600 hover:text-red-600"
//                       onClick={() => setMobileMenuDisplay(false)}
//                     >
//                       About Us
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               {/* Login/Logout */}
//               <div className="px-6 py-4">
//                 {user?._id ? (
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMobileMenuDisplay(false);
//                     }}
//                     className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
//                   >
//                     Logout
//                   </button>
//                 ) : (
//                   <Link
//                     to="/login"
//                     onClick={() => setMobileMenuDisplay(false)}
//                     className="block w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition text-center"
//                   >
//                     Login
//                   </Link>
//                 )}
//               </div>
//             </nav>
//           </div>
//         )}

//         {/* Address Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//                 <h3 className="text-lg font-bold text-gray-900">Select Delivery Address</h3>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="text-gray-400 hover:text-gray-600 transition"
//                 >
//                   <IoClose size={24} />
//                 </button>
//               </div>

//               <div className="p-6">
//                 <p className="text-sm text-gray-600 mb-4">
//                   Select a delivery location to see product availability and delivery options.
//                 </p>

//                 <div className="space-y-3 mb-6">
//                   {addresses && addresses.length > 0 ? (
//                     addresses.map((address) => (
//                       <label
//                         key={address.id}
//                         className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
//                           selectedAddress === address.id
//                             ? "border-red-600 bg-red-50"
//                             : "border-gray-200 hover:border-gray-300"
//                         }`}
//                       >
//                         <div className="flex items-start">
//                           <input
//                             type="radio"
//                             name="address"
//                             value={address.id}
//                             checked={selectedAddress === address.id}
//                             onChange={() => handleAddressSelection(address.id)}
//                             className="mt-1 mr-3 text-red-600 focus:ring-red-500"
//                           />
//                           <div className="flex-1">
//                             <p className="font-semibold text-gray-900">{address.name}</p>
//                             <p className="text-sm text-gray-600 mt-1">
//                               {address.street}, {address.city}, {address.state}, {address.postalCode}
//                             </p>
//                             {address.isDefault && (
//                               <span className="inline-block mt-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
//                                 Default Address
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </label>
//                     ))
//                   ) : (
//                     <p className="text-gray-500 text-center py-4">No addresses found.</p>
//                   )}
//                 </div>

//                 <div className="border-t border-gray-200 pt-4">
//                   <Link 
//                     to="/user-profile" 
//                     className="text-red-600 hover:text-red-700 text-sm font-medium"
//                     onClick={() => setIsModalOpen(false)}
//                   >
//                     + Add a new address
//                   </Link>
                  
//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Or enter pincode
//                     </label>
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         placeholder="Enter 6-digit pincode"
//                         className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-red-500 text-sm"
//                         value={pinCode}
//                         onChange={(e) => setPinCode(e.target.value)}
//                         maxLength={6}
//                       />
//                       <button
//                         onClick={verifyPinCode}
//                         className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition font-medium text-sm"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Spacer to prevent content from hiding under fixed header */}
//       <div className="h-[120px] md:h-[140px]"></div>
//     </>
//   );
// };

// export default Header;
