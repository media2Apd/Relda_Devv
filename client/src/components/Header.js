import React, { useContext, useState, useEffect, useRef } from "react";
import Logo from "../assest/Logo.png";
import { Helmet } from 'react-helmet';
import { Menu, ShoppingCart, CircleUser, MapPin, Search } from 'lucide-react';
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";
import axios from "axios";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import hob from "../assest/topSell/Hob1.png";

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
          <div className="mx-auto px-4 lg:px-12 py-3 md:py-4">
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
                    className="w-full border rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-brand-primary font-semibold text-sm"
                    onChange={handleSearch}
                    value={search}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Search strokeWidth={1} className="w-6 h-6" />
                  </button>
                </div>
              </div>
              {menuDisplay && (
                <div
                  ref={dropdownRef}
                  onClick={(e) => e.stopPropagation()}   // 🔥 prevents auto-close
                  className="
                    absolute right-4 top-16 md:top-20
                    w-52 bg-white
                    shadow-xl rounded-lg border
                    z-[9999]
                  "
                >
                  {/* Close Icon */}
                  <button
                    onClick={() => setMenuDisplay(false)}
                    className="absolute top-2 right-2 text-brand-primary-400 hover:text-brand-primaryHover"
                  >
                    <IoClose className="w-6 h-6 md:w-7 md:h-7" />
                  </button>

                  <div className="pt-8">
                    <Link
                      to="/user-profile"
                      onClick={() => setMenuDisplay(false)}
                      className="block px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                    >
                      Account
                    </Link>

                    <Link
                      to="/order"
                      onClick={() => setMenuDisplay(false)}
                      className="block px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    {user?.role === ROLE.ADMIN && (
                      <Link
                        to="/admin-panel/dashboard"
                        className="block px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuDisplay(false);   // 🔥 IMPORTANT
                      }}
                      className="block w-full text-left px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

              {/* Right Section - Desktop & Tablet */}
              <div className="hidden lg:flex items-center space-x-6">
                {/* Delivery Location */}
                <div 
                  className="flex items-center space-x-2 cursor-pointer transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  <MapPin strokeWidth={1} className="w-6 h-6" />
                  <div className="text-sm">
                    <div className="font-semibold">
                     {deliveryLocation.district || "Chennai"}, {deliveryLocation.state || "600040"}
                    </div>
                  </div>
                </div>

                {/* User Profile */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();          // 🔥 IMPORTANT
                    if (user?._id) {
                      setMenuDisplay(prev => !prev);
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="cursor-pointer hover:opacity-80 transition"
                >
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border"
                      alt="User"
                    />
                  ) : (
                    <CircleUser strokeWidth={1} className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </button>


                {/* Wishlist */}
                {/* <Link to="/wishlist" className="relative hover:opacity-80 transition">
                  <FaRegHeart className="w-6 h-6 text-gray-700" />
                  {context?.wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {context?.wishlistCount}
                    </span>
                  )}
                </Link> */}

                {/* Cart */}
              <Link to="/cart" className="relative inline-flex">
                <ShoppingCart strokeWidth={1} className="w-5 h-5 md:w-6 md:h-6" />

                {context?.cartProductCount > 0 && (
                  <span
                    className="
                      absolute top-0 right-0
                      translate-x-1/2 -translate-y-1/2
                      bg-brand-primary text-white
                      text-[10px] md:text-xs font-bold
                      min-w-[18px] h-[18px]
                      md:min-w-[20px] md:h-[20px]
                      px-1
                      rounded-full
                      flex items-center justify-center
                      leading-none
                      whitespace-nowrap
                    "
                  >
                    {context.cartProductCount > 99 ? "99+" : context.cartProductCount}
                  </span>
                )}
              </Link>
              </div>

              {/* Mobile Icons */}
              <div className="flex lg:hidden items-center space-x-4">
                {/* Mobile Search */}
                <button onClick={handleSearchButton} className=" md:hidden">
                  <Search strokeWidth={1} className="w-5 h-5" />
                </button>

                {/* Mobile User Profile */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();          // 🔥 IMPORTANT
                    if (user?._id) {
                      setMenuDisplay(prev => !prev);
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="cursor-pointer hover:opacity-80 transition"
                >
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border"
                      alt="User"
                    />
                  ) : (
                    <CircleUser strokeWidth={1} className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </button>


                {/* Mobile Wishlist */}
                {/* <Link to="/wishlist" className="relative">
                  <FaRegHeart className="w-6 h-6" />
                  {context?.wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {context?.wishlistCount}
                    </span>
                  )}
                </Link> */}

                {/* Mobile Cart */}
                <Link to="/cart" className="relative inline-flex">
                  <ShoppingCart strokeWidth={1}  className="w-5 h-5 md:w-6 md:h-6" />

                  {context?.cartProductCount > 0 && (
                    <span
                      className="
                        absolute top-0 right-0
                        translate-x-1/2 -translate-y-1/2
                        bg-brand-primary text-white
                        text-[10px] md:text-xs font-bold
                        min-w-[18px] h-[18px]
                        md:min-w-[20px] md:h-[20px]
                        px-1
                        rounded-full
                        flex items-center justify-center
                        leading-none
                        whitespace-nowrap
                      "
                    >
                      {context?.cartProductCount > 99 ? "99+" : context?.cartProductCount}
                    </span>
                  )}
                </Link>

                {/* Hamburger Menu */}
                <button
                  onClick={() => setMobileMenuDisplay(!mobileMenuDisplay)}
                  className=""
                >
                  {mobileMenuDisplay ? <IoClose className="w-6 h-6 md:w-7 md:h-7" /> : <Menu strokeWidth={1} className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div ref={searchRef} className="bg-white border-b px-4 py-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="What are you looking for..."
                className="w-full border rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-brand-primary font-semibold text-sm"
                onChange={handleSearch}
                value={search}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search strokeWidth={1} className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Delivery Location */}
        <div className="lg:hidden border-b border-gray-200 px-4 py-2">
          <div 
            className="flex items-center space-x-2 text-sm cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <MapPin strokeWidth={1} className="w-5 h-5" />
            <span className="font-medium">Delivery to:</span>
            <span className="font-semibold text-gray-800">
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
                  className="block py-4 px-2 transition-colors relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

            {/* Shop Dropdown - Fixed for Your Data Structure */}
            <li className="relative group">
              <button className="py-4 px-2 transition-colors relative">
                Shop
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              {/* Mega Dropdown - 4 Column Layout */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-[90vw] max-w-5xl bg-white shadow-2xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="container mx-auto py-8 px-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Column 1 - Product Categories */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-brand-primary">
                        Product Categories
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <Link 
                            to="/product-category" 
                            className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1"
                          >
                            All Products
                          </Link>
                        </li>
                        
                        {loading ? (
                          <li className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                          </li>
                        ) : categories && categories.length > 0 ? (
                          <>
                            {/* Show first 2 categories */}
                            {categories.slice(0, 2).map((category) => (
                              <li key={category._id}>
                                <Link
                                  to={`/product-category?category=${category.name}`}
                                  className="
                                    text-gray-700 hover:text-brand-primary transition
                                    text-sm block py-1
                                    hover:pl-2 hover:border-l-2 hover:border-brand-primary
                                  "
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
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-brand-primary">
                        Shopping
                      </h3>
                      <ul className="space-y-2">
                        <li>
                        <Link
                          to="/Cart"
                          className="
                            text-gray-700 hover:text-brand-primaryHover transition
                            text-sm block py-1
                            hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover
                          "
                        >

                            Shopping Cart
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/wishlist" 
                            className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1"
                          >
                            Wishlist
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/order" 
                            className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1"
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
                                  to="/new-arrivals"
                                  className="
                                    text-gray-700 hover:text-brand-primaryHover transition
                                    text-sm block py-1
                                    hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover
                                  "
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
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-brand-primary">
                        Featured
                      </h3>
                      <ul className="space-y-2">
                        <li>
                          <Link 
                            to="/new-arrivals" 
                            className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1"
                          >
                            New Arrivals
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/best-sellers" 
                            className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1"
                          >
                            Best Sellers
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/special-offers" 
                            className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1"
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
                                  className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1"
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
                            src={hob} 
                            alt="Shop Banner" 
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                          {/* Overlay with Text */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            {/* <h4 className="text-xl font-bold mb-2">Special Offers</h4> */}
                            {/* <p className="text-sm opacity-90 mb-3">Up to 50% off on selected items</p> */}
                            <span className="inline-block bg-brand-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-brand-primaryHover transition">
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
                  className="block py-4 px-2 transition-colors relative group"
                >
                  Blog
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              <li>
                <Link 
                  to="/ContactUsPage" 
                  className="block py-4 px-2 transition-colors relative group"
                >
                  Contact Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              {/* Services & Supports Dropdown */}
              <li className="relative group">
                <button className="py-4 px-2 transition-colors relative">
                  Services & Supports
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </button>
                
                {/* Mega Dropdown */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-[90vw] max-w-5xl bg-white shadow-2xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="container mx-auto py-8 px-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                      {/* Support Section */}
                      <div>
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 pb-2 border-b-2 border-brand-primary mb-3">
                          Support
                        </h3>
                        <ul className="space-y-2">
                          <li>
                            <Link 
                              to="/CustomerSupport" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Customer Support
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/ProductRegistration" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Product Registration
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/warranty" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Warranty Information
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/faq" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              FAQs
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Company Section */}
                      <div>
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 pb-2 border-b-2 border-brand-primary mb-3">
                          Company
                        </h3>
                        <ul className="space-y-2">
                          <li>
                            <Link 
                              to="/AboutUs" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              About Us
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/CareerPage" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Careers
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/AuthorizedDealer" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Authorized Dealers
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/press" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Press & Media
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Policies Section */}
                      <div>
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 pb-2 border-b-2 border-brand-primary mb-3">
                          Policies
                        </h3>
                        <ul className="space-y-2">
                          <li>
                            <Link 
                              to="/privacy-policy" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Privacy Policy
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/terms" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Terms & Conditions
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/return-policy" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Return Policy
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/shipping-policy" 
                              className="text-gray-700 hover:text-brand-primaryHover transition text-sm block py-1 hover:pl-2 hover:border-l-2 hover:border-brand-primaryHover"
                            >
                              Shipping Policy
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Banner/Image Section */}
                      <div className="space-y-4">
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 pb-2 border-b-2 border-brand-primary">
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
                              className="block text-center bg-brand-primary text-white text-sm py-2 rounded hover:bg-brand-primaryHover transition"
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
                            className="text-brand-primary hover:text-brand-primaryHover text-xs font-medium"
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
                      className="block py-2 text-sm text-gray-600 hover:text-brand-primaryHover"
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
                            className="block py-1 pl-3 text-sm text-gray-600 hover:text-brand-primaryHover"
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
                      className="block py-2 text-sm text-gray-600 hover:text-brand-primaryHover"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      Customer Support
                    </Link>
                    <Link 
                      to="/ProductRegistration" 
                      className="block py-2 text-sm text-gray-600 hover:text-brand-primaryHover"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      Product Registration
                    </Link>
                    <Link 
                      to="/AuthorizedDealer" 
                      className="block py-2 text-sm text-gray-600 hover:text-brand-primaryHover"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      Authorized Dealer
                    </Link>
                    <Link 
                      to="/CareerPage" 
                      className="block py-2 text-sm text-gray-600 hover:text-brand-primaryHover"
                      onClick={() => setMobileMenuDisplay(false)}
                    >
                      Career
                    </Link>
                    <Link 
                      to="/AboutUs" 
                      className="block py-2 text-sm text-gray-600 hover:text-brand-primaryHover"
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
                <h3 className="text-lg font-bold">Select Delivery Address</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="hover:text-brand-primaryHover transition"
                >
                  <IoClose className="w-6 h-6 md:w-7 md:h-7" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-[#6A7282] mb-4">
                  Select a delivery location to see product availability and delivery options.
                </p>

                <div className="space-y-3 mb-6">
                  {addresses && addresses.length > 0 ? (
                    addresses.map((address) => (
                    <label
                      onClick={() => handleAddressSelection(address.id)}
                      className={`
                        block cursor-pointer rounded-lg border-2 p-4 transition
                        ${selectedAddress === address.id
                          ? "border-brand-primary"
                          : "border-gray-200 hover:border-brand-primary"}
                      `}
                    >
                      {/* Hidden radio (for logic only) */}
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={() => handleAddressSelection(address.id)}
                        className="hidden"
                      />

                      <div className="flex items-start gap-3">
                        {/* Custom selected indicator */}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{address.name}</p>

                          <p className="text-sm text-[#6A7282] mt-1">
                            {address.street}, {address.city}, {address.state}, {address.postalCode}
                          </p>

                          {address.isDefault && (
                            <span className="inline-block mt-2 text-xs font-semibold text-white bg-[#4F9835] px-2 py-1 rounded">
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
                    className="text-brand-primary hover:text-brand-primaryHover text-sm font-medium"
                    onClick={() => setIsModalOpen(false)}
                  >
                    + Add a new address
                  </Link>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#6A7282] mb-2">
                      Or enter pincode
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit pincode"
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-brand-primary text-sm"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        maxLength={6}
                      />
                      <button
                        onClick={verifyPinCode}
                        className="bg-brand-primary text-white px-6 py-2 rounded-md hover:bg-brand-primaryHover transition font-medium text-sm"
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
      <div className="h-[100px] md:h-[105px] lg:h-[138px]"></div>
    </>
  );
};

export default Header;

