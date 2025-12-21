import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SummaryApi from "../common";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  FaStar,
  FaStarHalfAlt,
  FaFacebookF,
  FaWhatsapp,
  FaTruck,
  FaUndoAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { GrInstagram } from "react-icons/gr";
import { FaXTwitter } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { LuDot } from "react-icons/lu";

import displayINRCurrency from "../helpers/displayCurrency";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import { saveViewedProduct } from "../utils/saveViewedProduct";

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    specifications: [], // Add specifications field
  });

  const [warranty, setWarranty] = useState("");
  const [orderList, setOrderList] = useState([]);

  const [rating, setRating] = useState(0); // To store the rating out of 5
  const [review, setReview] = useState(""); // To store the review text
  const [reviews, setReviews] = useState([]); // To store the list of reviews
  const [showForm, setShowForm] = useState(false); // Toggle review form visibility

  const params = useParams();
  const [loading, setLoading] = useState(true);
  // const productImageListLoading = new Array(4).fill(null);
  // const [activeImage, setActiveImage] = useState("");
  const [activeMedia, setActiveMedia] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);
  const { fetchUserAddToCart, fetchWishlistCount } = useContext(Context);
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const user = useSelector((state) => state?.user?.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(5); // You can change the number of reviews per page here
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Calculate the reviews to be shown on the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Change the page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle "View All Reviews" button click
  const handleViewAllReviews = () => {
    setShowAllReviews(true);
    setReviewsPerPage(10);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short" };
    return new Date(date).toLocaleDateString("en-US", options); // Example: "Nov, 2024"
  };

  useEffect(() => {
    let isMounted = true;
  
    const checkWishlist = async () => {
      try {
        const productId = data?._id;
        const userId = user?._id;
  
        if (!productId) return;
  
        if (!userId) {
          const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
          const exists = wishlist.includes(productId);
          if (isMounted) {
            setIsWishlisted((prev) => (prev !== exists ? exists : prev));
          }
        } else {
          const response = await fetch(SummaryApi.getWishlist(userId).url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          if (response.ok) {
            const responseData = await response.json();
            const wishlistIds = responseData.wishlist.map((item) => item._id);
            const exists = wishlistIds.includes(productId);
            if (isMounted) {
              setIsWishlisted((prev) => (prev !== exists ? exists : prev));
            }
          }
        }
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };
  
    checkWishlist();
  
    return () => {
      isMounted = false;
    };
  }, [user, data]); // include full objects to satisfy React's exhaustive-deps
  

  const handleWishlistToggle = async () => {
    if (!user) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      if (wishlist.includes(data?._id)) {
        const updatedWishlist = wishlist.filter((id) => id !== data?._id);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setIsWishlisted(false);
        toast.info("Product removed from wishlist.");
      } else {
        wishlist.push(data?._id);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsWishlisted(true);
        toast.success("Product added to wishlist!");
      }
    } else {
      try {
        const method = isWishlisted ? "DELETE" : "POST";
        const response = await fetch(
          SummaryApi.wishlistAddRemove(user._id, data?._id).url,
          {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        setIsWishlisted(!isWishlisted);
        toast.success(responseData.message);

        // Refresh the wishlist count
      } catch (error) {
        console.error("Error toggling wishlist:", error);
        toast.error("Failed to update wishlist.");
      }
    }
    await fetchWishlistCount(user); // ? Using the context to fetch wishlist count from both localStorage and API
  };

  // Fetch order details from the API
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getOrder.url, {
        method: SummaryApi.getOrder.method,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const responseData = await response.json();
      setOrderList(
        responseData.success && responseData.data.length > 0
          ? responseData.data
          : []
      );
    } catch (err) {
      console.error("Error fetching order details:", err);
      setOrderList([]);
    } finally {
      setLoading(false);
    }
  };

  // Load order details on component mount
  useEffect(() => {
    if (user) {
      fetchOrderDetails();
    }
  }, [user]);

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId: params?.id,
        }),
      });
      setLoading(false);
      const dataReponse = await response.json();
      setData(dataReponse?.data);
      setWarranty(
        dataReponse?.data?.specifications?.find((item) =>
          item.key.toLowerCase().includes("warranty")
        )?.value || ""
      );

      setActiveMedia(dataReponse?.data?.productImage[0]);
      saveViewedProduct(dataReponse?.data._id);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    } finally {
      setLoading(false);
    }
  }, [params?.id]); // Include `params?.id` as a dependency

  const fetchProductReviews = useCallback(async () => {
    const productId = params?.id; // Assuming `params` is the correct object containing the `id` property.

    const url = new URL(SummaryApi.getProductReviews.url);
    const queryParams = { productId: productId }; // Prepare the query parameters
    url.search = new URLSearchParams(queryParams).toString(); // Add the query params to the URL

    try {
      const response = await fetch(url, {
        method: SummaryApi.getProductReviews.method, // Ensure this is 'GET'
        headers: {
          "Content-Type": "application/json",
        },
      });

      const dataReponse = await response.json();
      setReviews(dataReponse?.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [params?.id]);

  useEffect(() => {
    fetchProductDetails(); // Existing fetch for product details
    fetchProductReviews(); // Fetch reviews when the component mounts
  }, [fetchProductDetails, fetchProductReviews]);

  const handleWriteReview = () => {
    const hasPurchased = orderList.some((order) =>
      order.productDetails.some((product) => product.productId === data._id)
    );

    const userReviewed = reviews.find(
      (each) => each?.user?._id === user?._id && each?.productId === data?._id
    );

    if (!user) {
      toast.error("You need to Login to write a review.");
      return;
    }

    if (!hasPurchased) {
      toast.error("You need to purchase this product to write a review.");
      return;
    }
    if (userReviewed) {
      toast.error("You have already reviewed this product.");
      return;
    }
    setShowForm(true); // Show the review form if valid
  };

  const handleSubmitReview = async () => {
    if (rating === 0 || review.trim() === "") {
      toast.error("Please provide both rating and review.");
      return;
    }

    const reviewData = {
      productId: params?.id,
      rating: rating,
      review: review,
    };

    try {
      const response = await fetch(SummaryApi.submitReview.url, {
        method: SummaryApi.submitReview.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Review submitted successfully!");
        setReview("");
        setRating(0); // Reset the form
        fetchProductReviews(); // Refresh reviews after submission
        setShowForm(false);
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      toast.error("Error submitting review.");
    }
  };

  const handleMouseEnterMedia = (media) => {
    setActiveMedia(media);
  };

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();

    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({
      x,
      y,
    });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };

  const handleEnquiry = () => {
    navigate("/CustomerSupport"); // Redirect to Customer Support Enquiry page
  };
  
  const renderMedia = (media) => {
    if (!media) return null;

    if (typeof media === "string" || media?.type === "image") {
      // Render image
      return (
        <img
          src={media.url || media}
          alt={data?.altTitle || "product"} // Use altTitle if available
          title={data?.altTitle || "product"} // Use altTitle if available
          className="h-full w-full object-cover mix-blend-multiply"
          onMouseMove={handleZoomImage}
          onMouseLeave={handleLeaveImageZoom}
        />
      );
    } else if (media?.type === "video") {
      // Render video without controls and with looping
      return (
        <div className="h-full w-full bg-white flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          src={media.url}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
      </div>
      );
    }

    return null;
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const closeShareModal = () => {
    setShowShareOptions(false);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };
  const averageRating = calculateAverageRating(reviews);
  const totalRatings = reviews.length;

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const progressBarWidth = (count) =>
    totalRatings ? `${(count / totalRatings) * 100}%` : "0%";

  return (
    <div className="container mx-auto p-4 bg-white">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-4">
        {/***product Image */}
        <div className="h-96 flex flex-col lg:flex-row-reverse gap-4">
          <div className="h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2 mx-auto">
         

            {renderMedia(activeMedia)}

            {/* Heart Icon */}
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg hover:bg-red-100 transition duration-300 flex items-center justify-center"
              onClick={handleWishlistToggle}
            >
              {isWishlisted ? (
                <FaHeart className="text-brand-primary text-xl" /> // Filled heart icon
              ) : (
                <FaRegHeart className="text-brand-primary text-xl" /> // Outlined heart icon
              )}
            </button>

            {/* <img
              src={activeImage}
              alt={data?.altTitle || "product"} // Use altTitle if available
              title={data?.altTitle || "product"} // Use altTitle if available
              className="h-full w-full object-scale-down mix-blend-multiply"
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
            /> */}

            {/**product zoom */}
            {/* {zoomImage && (
              <div className="hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0">
                <div
                  className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150"
                  style={{
                    background: `url(${activeImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                      zoomImageCoordinate.y * 100
                    }% `,
                  }} */}
            {zoomImage && typeof activeMedia === "string" && (
              <div className="hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0">
                <div
                  className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150"
                  style={{
                    background: `url(${activeMedia})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                      zoomImageCoordinate.y * 100
                    }% `,
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* <div className="h-full">
            {loading ? (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                {productImageListLoading.map((el, index) => {
                  return (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded animate-pulse"
                      key={"loadingImage" + index}
                    ></div>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                {data?.productImage?.map((imgURL, index) => {
                  return (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded p-1 mx-auto"
                      key={imgURL}
                    >
                      <img
                        src={imgURL}
                        alt="list"
                        className="w-full h-full object-scale-down mix-blend-multiply cursor-pointer"
                        onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                        onClick={() => handleMouseEnterProduct(imgURL)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div> */}
          <div className="h-full">
            {loading ? (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                {new Array(4).fill(null).map((_, index) => (
                  <div
                    className="h-20 w-20 bg-slate-200 rounded animate-pulse"
                    key={`loadingImage-${index}`}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="flex lg:flex-col justify-center lg:justify-start gap-2  overflow-scroll scrollbar-none h-full">
                {data?.productImage?.map((media, index) => (
                  <div
                    className="h-20 w-20 bg-slate-200 rounded p-1 "
                    key={media.url || media}
                  >
                    {media?.type === "video" ? (
                      <video
                        loop
                        muted
                        src={media.url}
                        className="w-full h-full object-scale-down mix-blend-multiply cursor-pointer"
                        onClick={() => handleMouseEnterMedia(media)} // Set as active media on click
                      />
                    ) : (
                      <img
                        src={media.url || media}
                        alt="list"
                        className="w-full h-full object-scale-down mix-blend-multiply cursor-pointer"
                        onClick={() => handleMouseEnterMedia(media)} // Set as active media on click
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/***product details */}
        {loading ? (
          <div className="grid gap-1 w-full">
            <p className="bg-slate-200 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block"></p>
            <h2 className="text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-200 animate-pulse w-full">
              {" "}
            </h2>
            <p className="capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-full"></p>

            <div className="text-brand-primary bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full"></div>

            <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full">
              <p className="text-brand-primary bg-slate-200 w-full"></p>
              <p className="text-slate-400 line-through bg-slate-200 w-full"></p>
            </div>

            <div className="flex items-center gap-3 my-2 w-full">
              <button className="h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full"></button>
              <button className="h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full"></button>
            </div>

            <div className="w-full">
              <p className="text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-full"></p>
              <p className=" bg-slate-200 rounded animate-pulse h-10 lg:h-12  w-full"></p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="bg-red-200 text-brand-primary px-2 rounded-full inline-block w-fit uppercase">
              {data?.brandName}
            </p>
            <h2 className="text-lg lg:text-4xl font-medium">
              {data?.productName}
            </h2>
            <div className="flex justify-between">
              <p className="capitalize text-slate-500 font-medium">
                {data?.category}
              </p>
              <p className="capitalize text-slate-500 font-medium">
                Availability:{" "}
                <span
                  className={`${
                    data?.availability > 0 ? "text-green-600" : "text-brand-primary"
                  }`}
                >
                  {data?.availability > 0 ? "In stock" : "Sold out"}
                </span>
              </p>
            </div>

            <div className=" flex items-center gap-1">
              {[...Array(5)].map((_, i) => {
                if (i < Math.floor(averageRating)) {
                  // Full yellow stars
                  return <FaStar key={i} className="text-brand-primary" />;
                } else if (i < Math.ceil(averageRating)) {
                  // Half yellow star (for the 0.5 rating)
                  return <FaStarHalfAlt key={i} className="text-brand-primary" />;
                } else {
                  // Empty gray stars
                  return <FaStar key={i} className="text-gray-300" />;
                }
              })}
              <span className="font-medium">{averageRating.toFixed(1)} </span>
              <span>
                <LuDot />
              </span>
              <span className="text-gray-500 font-medium">
                {" "}
                {reviews.length} ratings
              </span>
            </div>

            <div className="flex items-center gap-2 text-xl lg:text-3xl font-medium my-1">
              <p className="text-brand-primary">
                {displayINRCurrency(data.sellingPrice)}
              </p>
              <p className="text-slate-400 line-through">
                {displayINRCurrency(data.price)}
              </p>
              <span
                className="px-2 py-1 text-xs font-medium rounded-md shadow"
                style={{ backgroundColor: "#175E17", color: "#E8F5E9" }}
              >
                {`${Math.ceil(
                  ((data.price - data.sellingPrice) / data.price) * 100
                )}% OFF`}
              </span>
            </div>

            <div className="flex items-center gap-3 my-2">
              {data?.isHidden || data?.availability === 0 ? (
                <button
                  className="text-sm bg-brand-primary hover:bg-brand-primaryHover text-white px-3 py-0.5 rounded-full"
                  onClick={handleEnquiry}
                >
                  Enquiry Now
                </button>
              ) : (
                <>
                  <button
                    className="border-2 border-brand-primary rounded px-3 py-1 min-w-[120px] text-brand-primary font-medium hover:bg-brand-primaryHover hover:text-white"
                    onClick={(e) => handleBuyProduct(e, data?._id)}
                  >
                    Buy
                  </button>
                  <button
                    className="border-2 border-brand-primary rounded px-3 py-1 min-w-[120px] font-medium text-white bg-brand-primary hover:text-brand-primaryHover hover:bg-white"
                    onClick={(e) => handleAddToCart(e, data?._id)}
                  >
                    Add To Cart
                  </button>
                </>
              )}
              <button
                className="text-gray-500 hover:text-gray-700 ml-3"
                onClick={toggleShareOptions}
              >
                <IoIosShareAlt size={24} />
              </button>

              <div className="relative mt-1 text-[16px]">
                {showShareOptions && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-[300px] md:w-96">
                      {/* HEADER */}
                      <div className="border-b border-gray-200 py-2 px-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">
                          Share This Product
                        </h2>
                        <button
                          className="text-gray-400 hover:text-gray-600  hover:border rounded-full border-gray-600"
                          onClick={closeShareModal}
                        >
                          <IoClose size={20} />
                        </button>
                      </div>

                      {/* SOCIAL ICONS */}
                      <div className="p-6">
                        <div className="grid grid-cols-4 gap-4 ">
                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              window.location.href
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border text-green-500 hover:bg-[#25d366] w-12 h-12 fill-[#25d366] hover:fill-white border-green-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/50 hover:text-white cursor-pointer"
                          >
                            <FaWhatsapp size={26} />
                          </a>
                          {/* Facebook */}
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              window.location.href
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border text-blue-600 hover:text-white hover:bg-blue-600 w-12 h-12 fill-blue-600 hover:fill-white border-blue-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-blue-500/50 cursor-pointer"
                          >
                            <FaFacebookF size={24} />
                          </a>

                          {/* Instagram */}
                          <a
                            href={`https://www.instagram.com/?url=${encodeURIComponent(
                              window.location.href
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border text-brand-primary hover:text-white hover:bg-gradient-to-r from-pink-500 via-brand-primary to-yellow-500 w-12 h-12 fill-[#E1306C] hover:fill-white border-pink-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-pink-500/50 cursor-pointer"
                          >
                            <GrInstagram size={24} />
                          </a>

                          {/* Twitter */}
                          <a
                            href={`https://x.com/intent/tweet?url=${encodeURIComponent(
                              window.location.href
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border hover:text-white hover:bg-black w-12 h-12 fill-blue-400 hover:fill-white border-black rounded-full flex items-center justify-center shadow-lg hover:shadow-gray-500/50 cursor-pointer"
                          >
                            <FaXTwitter size={22} />
                          </a>
                        </div>
                        {/* Copy Link */}
                        <div className="flex items-center mt-6 space-x-2 border p-2 w-full max-w-md rounded-md shadow-lg">
                          <span className="text-gray-500 text-sm truncate">
                            {window.location.href}
                          </span>
                          <button
                            onClick={handleCopyLink}
                            className="border p-2 text-gray-500 hover:text-gray-700 rounded-full flex items-center justify-center cursor-pointer"
                          >
                            <FaRegCopy size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className=" mt-16 border border-gray-200 rounded  text-sm md:text-lg">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "description"
                ? "border-b-2 border-brand-primary text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "specifications"
                ? "border-b-2 border-brand-primary text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("specifications")}
          >
            Specifications
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "reviews"
                ? "border-b-2 border-brand-primary text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 p-2 xl:p-4  shadow-sm rounded-lg">
          {activeTab === "description" && (
            <div>
              <p className="text-slate-600 font-medium my-1">Description:</p>
              <div className="pl-5">
                {data?.description && (
                  <p className="text-gray-700 whitespace-pre-wrap break-words">
                    {data.description.split("\n").map((item, index) => (
                      <span key={index}>
                        {item.trim()}
                        {index < data.description.split("\n").length - 1 && (
                          <span className="text-brand-primary mx-1">|</span>
                        )}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div>
              <p className="text-slate-600 font-medium my-1">Specifications:</p>
              <ul className="list-disc pl-5 text-gray-700">
                {/* Render each specification */}
                {data?.specifications?.map((spec, index) => (
                  // Ensure you are accessing the correct properties
                  <li key={spec._id}>
                    <strong>{spec.key}: </strong> {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="p-2 xl:p-4 border rounded-lg bg-white shadow-md">
              <div className="text-right">
                {/* Rate Product Button */}
                <button
                  onClick={handleWriteReview}
                  className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primaryHover transition duration-300"
                >
                  Rate Product
                </button>
              </div>
              {/* Review Form */}
              {showForm && (
                <div className="mt-4">
                  <p className="font-semibold">Add Your Review</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="font-semibold">Rating:</p>
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`cursor-pointer ${
                          rating > index ? "text-yellow-500" : "text-gray-300"
                        }`}
                        onClick={() => setRating(index + 1)} // Set the rating
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    placeholder="Write your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button
                      className="bg-brand-primary text-white px-4 py-2 rounded-md"
                      onClick={handleSubmitReview}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                {/* Average Rating */}
                <div>
                  <div className="xl:flex">
                    <p className="text-4xl font-bold text-gray-800 mr-4">
                      {averageRating.toFixed(1)}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500 mr-4">
                      {[...Array(5)].map((_, i) => {
                        if (i < Math.floor(averageRating)) {
                          return <FaStar key={i} />;
                        } else if (i < Math.ceil(averageRating)) {
                          return <FaStarHalfAlt key={i} />;
                        } else {
                          return <FaStar key={i} className="text-gray-300" />;
                        }
                      })}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {totalRatings} Ratings & <br /> {reviews.length} Reviews
                  </p>
                </div>

                {/* Star Breakdown */}
                <div className="mt-6 w-full">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 mb-3">
                      <span className="flex items-center text-sm font-semibold">
                        {star} <FaStar className="ml-1" />
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: progressBarWidth(ratingCounts[star]),
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {ratingCounts[star]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Reviews Section */}
              <div className="mt-6">
                <p className="font-semibold">Customer Reviews</p>

                {reviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  <div className="space-y-6 mt-4">
                    {currentReviews.map((review, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          {/* Display stars */}
                          {[...Array(5)].map((_, i) => {
                            const isFull = i < Math.floor(review.rating);
                            const isHalf =
                              i < Math.ceil(review.rating) &&
                              i >= Math.floor(review.rating);

                            return (
                              <FaStar
                                key={i}
                                className={`${
                                  isFull
                                    ? "text-yellow-500"
                                    : isHalf
                                    ? "text-yellow-300"
                                    : "text-gray-300"
                                }`}
                              />
                            );
                          })}{" "}
                          {review.rating}.0
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {review?.user?.name || "User"}
                            </p>
                            <span className="text-gray-400">|</span>
                            <p className="text-gray-500 text-sm">
                              {review?.user?.address?.city || "Chennai"}
                            </p>
                          </div>
                        </div>

                        <p className="mt-2 text-gray-700 mb-3">
                          {review.review}
                        </p>
                        <div className="flex items-center">
                          <p className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md mr-2">
                            Verified Purchase
                          </p>
                          <p className="text-gray-500 text-sm">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* "View All Reviews" button */}
                {!showAllReviews && reviews.length > 5 && (
                  <button
                    onClick={handleViewAllReviews}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                  >
                    View All Reviews
                  </button>
                )}

                {/* Pagination */}
                {showAllReviews && reviews.length > 10 && (
                  <div className="mt-4 flex justify-center space-x-2 items-center">
                    {/* Previous Button */}
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                    >
                      <FiChevronLeft />
                    </button>

                    {/* First Page */}
                    <button
                      onClick={() => paginate(1)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      1
                    </button>

                    {/* Ellipsis Before Current Page */}
                    {currentPage > 2 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}

                    {/* Current Page */}
                    {currentPage !== 1 &&
                      currentPage !==
                        Math.ceil(reviews.length / reviewsPerPage) && (
                        <button
                          onClick={() => paginate(currentPage)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md"
                        >
                          {currentPage}
                        </button>
                      )}

                    {/* Ellipsis After Current Page */}
                    {currentPage <
                      Math.ceil(reviews.length / reviewsPerPage) - 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}

                    {/* Last Page */}
                    {Math.ceil(reviews.length / reviewsPerPage) > 1 && (
                      <button
                        onClick={() =>
                          paginate(Math.ceil(reviews.length / reviewsPerPage))
                        }
                        className={`px-3 py-2 rounded-md ${
                          currentPage ===
                          Math.ceil(reviews.length / reviewsPerPage)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {Math.ceil(reviews.length / reviewsPerPage)}
                      </button>
                    )}

                    {/* Next Button */}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(reviews.length / reviewsPerPage)
                      }
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 space-y-4 md:space-y-0 grid grid-cols-1 md:grid-cols-3 md:gap-4">
        {/* Card 1: Free Delivery */}
        <div
          className="flex items-center border rounded-lg p-4 shadow-lg"
          style={{ borderLeftWidth: "8px", borderColor: "#f7b519" }}
        >
          <FaTruck className="text-yellow-500 text-4xl mr-4" />
          <div>
            <h3 className="text-md md:text-lg font-bold text-yellow-600">
              Free Delivery{" "}
              <span className="text-slate-400 line-through">
                {displayINRCurrency(89)}
              </span>
            </h3>
            <p className="text-sm text-yellow-700">
              Faster Delivery within 4 days
            </p>
          </div>
        </div>

        {/* Highlight 1: 7 Days Return Policy */}
        <div
          className="flex items-center border border-green-500 rounded-lg p-4 shadow-lg"
          style={{ borderLeftWidth: "8px" }}
        >
          <FaUndoAlt className="text-green-500 text-4xl mr-4" />
          <div>
            <a
              href="/RefundPolicy"
              target="_blank"
              className="text-md md:text-lg font-bold text-green-600 hover:underline"
            >
              7 Days Return Policy
            </a>
            <p className="text-sm text-green-700">
              Hassle-free returns within 7 days of delivery.
            </p>
          </div>
        </div>

        {/* Highlight 2: 2 Years Warranty */}
        {warranty !== "" && (
          <div
            className="flex items-center border border-blue-400 rounded-lg p-4 shadow-lg"
            style={{ borderLeftWidth: "8px" }}
          >
            <FaShieldAlt className="text-blue-500 text-4xl mr-4" />
            <div>
              <h3 className="text-md md:text-lg font-bold text-blue-600">
                {warranty} Manufacturer Warranty
              </h3>
              <p className="text-sm text-blue-700">
                Comprehensive coverage for your product.
              </p>
            </div>
          </div>
        )}
      </div>

      {data.category && (
        <CategoryWiseProductDisplay
          category={data?.category}
          heading={"Recommended Product"}
        />
      )}
    </div>
  );
};

export default ProductDetails;
