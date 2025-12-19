import React, { useEffect, useState, useContext, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import SummaryApi from "../common"; // Ensure it's properly imported
import Context from "../context";
import { MdDelete } from "react-icons/md";
import displayINRCurrency from "../helpers/displayCurrency"; 
const WishlistView = () => {
  const user = useSelector((state) => state?.user?.user); // Get logged-in user
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize useNavigate hook
  const { fetchWishlistCount } = useContext(Context); 

  const fetchWishlistFromDB = useCallback(async () => {
    try {
      if (!user?._id) return [];
  
      const response = await fetch(SummaryApi.getWishlist(user._id).url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return Array.isArray(data.wishlist) ? data.wishlist : [];
    } catch (error) {
      console.error("Error fetching DB wishlist:", error);
      toast.error("Failed to fetch wishlist from DB.");
      return [];
    }
  }, [user?._id]);

  const fetchGuestWishlist = useCallback(async (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) return [];

  try {
    const productDetails = await Promise.all(
      productIds.map(async (productId) => {
        const response = await fetch(SummaryApi.productDetails.url, {
          method: SummaryApi.productDetails.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch product ${productId}`);
        }

        const result = await response.json();
        return result.data;
      })
    );

    return productDetails;
  } catch (error) {
    console.error("Error fetching localStorage wishlist:", error);
    toast.error("Failed to fetch wishlist from localStorage.");
    return [];
  }
}, []);

const mergeWishlists = useCallback((dbList, localList) => {
  const mergedMap = new Map();

  dbList.forEach((item) => {
    if (item && item._id) {
      mergedMap.set(item._id, item);
    }
  });

  localList.forEach((item) => {
    if (item && item._id) {
      mergedMap.set(item._id, item);
    }
  });

  return Array.from(mergedMap.values());
}, []);

  


  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const localIds = JSON.parse(localStorage.getItem("wishlist")) || [];

      if (user?._id) {
        const dbWishlist = await fetchWishlistFromDB();
        const localWishlist = await fetchGuestWishlist(localIds);
        const merged = mergeWishlists(dbWishlist, localWishlist);
        setWishlist(merged);
      } else {
        const validLocalIds = localIds.filter((id) => typeof id === "string");
        if (validLocalIds.length !== localIds.length) {
          localStorage.setItem("wishlist", JSON.stringify(validLocalIds));
        }
        const localWishlist = await fetchGuestWishlist(validLocalIds);
        setWishlist(localWishlist);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [user?._id, fetchWishlistFromDB, fetchGuestWishlist, mergeWishlists]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]); // ? only runs if stable function changes
  


  // Render the media (image) based on the product data
  const renderMedia = (data) => {
    if (Array.isArray(data?.productImage)) {
      const imageMedia = data.productImage.find((media) => {
        if (typeof media === 'string') return true; // String is an image URL
        if (media?.type === 'image') return true; // Object with type 'image'
        return false;
      });

      if (typeof imageMedia === 'string') {
        return <img src={imageMedia} alt="product" className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply" />;
      } else if (imageMedia?.url) {
        return <img src={imageMedia.url} alt="product" className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply" />;
      }
    }

    return <img src="https://via.placeholder.com/150" alt="placeholder" className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply" />;
  };

  // Handle deleting product from wishlist
  // Handle deleting product from wishlist
const handleDelete = async (productId) => {
  if (!user?._id) {
    // Handle non-logged-in users by deleting from localStorage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const updatedWishlist = storedWishlist.filter((id) => id !== productId);
    
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Update localStorage

    // Update local state after deletion
    setWishlist((prevWishlist) => prevWishlist.filter((product) => product._id !== productId));
    toast.success("Product removed from wishlist.");
    return;
  } else{
    try {
    const response = await fetch(SummaryApi.wishlistAddRemove(user._id, productId).url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete from wishlist.");
    }

    // Delete from localStorage as well
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const updatedWishlist = storedWishlist.filter((id) => id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Update localStorage

    // Update local state after deletion
    setWishlist((prevWishlist) => prevWishlist.filter((product) => product._id !== productId));
    toast.success("Product removed from wishlist.");
  } catch (error) {
    console.error("Error deleting from wishlist:", error);
    toast.error("Failed to remove product from wishlist.");
  }
  }
  await fetchWishlistCount(user); // ? Using the context to fetch wishlist count from both localStorage and API

  // Logged-in user: Delete from the database and localStorage
  
};


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      {loading ? (
        <p>Loading...</p>
      ) : wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <div key={product._id} className="w-full min-w-[200px] max-w-[100%] bg-white rounded-sm shadow relative">
              <div
                className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)} // Navigate to product details page
              >
                {renderMedia(product)}
              </div>
              <div className="p-4 grid gap-3">
                <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">{product?.productName}</h2>
                <p className="capitalize text-slate-500">{product?.category}</p>
                <div className="flex gap-3">
                  <p className="text-red-600 font-medium">{displayINRCurrency(product?.sellingPrice)}</p>
                  <p className="text-slate-500 line-through">{displayINRCurrency(product?.price)}</p>
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-md shadow"
                    style={{ backgroundColor: "#175E17", color: "#E8F5E9" }}
                  >
                    {`${Math.ceil(((product?.price - product?.sellingPrice) / product?.price) * 100)}% OFF`}
                  </span>
                </div>
              </div>

              {/* Delete button inside product card */}
              <button
                className="absolute bottom-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-md"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering navigation
                  handleDelete(product._id); // Handle the deletion
                }}
              >
              <MdDelete />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default WishlistView;
