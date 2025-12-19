import { useCallback } from 'react';
import './App.css';

import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from './store/userSlice';


function App() {
  const dispatch = useDispatch()
  const [cartProductCount,setCartProductCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0); // Add this line
  const user = useSelector((state) => state?.user?.user); // Get logged-in user


const fetchUserDetails = useCallback(async () => {
  try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
          method: SummaryApi.current_user.method,
          credentials: 'include',
      });
      
      const dataApi = await dataResponse.json();

      if (dataApi.success) {
          // Save token to localStorage
          localStorage.setItem('token', dataApi.data);

          // Dispatch user details to Redux store
          dispatch(setUserDetails(dataApi.data));
      }
  } catch (error) {
      console.error(error);
  }
}, [dispatch]);


  const fetchUserAddToCart = async()=>{
   try {
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
      method : SummaryApi.addToCartProductCount.method,
      credentials : 'include'
    })
    const dataApi = await dataResponse.json()

    setCartProductCount(dataApi?.data?.count)
   } catch (error) {
    console.error(error)
   }
  }
// Fetch wishlist count
const fetchWishlistCount = useCallback(async (user) => {
  try {
    let combinedWishlist = new Set();

    if (user?._id) {
      const response = await fetch(
        SummaryApi.getWishlist(user._id).url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const apiWishlist = data.wishlist.map((item) => item._id);
        combinedWishlist = new Set([...combinedWishlist, ...apiWishlist]);
      }
    }

    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    combinedWishlist = new Set([...combinedWishlist, ...storedWishlist]);

    setWishlistCount(combinedWishlist.size);
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
  }
}, []);


// Fetch user and cart on mount
useEffect(() => {
  const init = async () => {
    await fetchUserDetails();
    await fetchUserAddToCart();
  };

  init();
}, [fetchUserDetails]);

useEffect(() => {
  if (user !== null) {
    fetchWishlistCount(user);
  } else {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistCount(storedWishlist.length); // local only
  }
}, [user, fetchWishlistCount]);

  return (
    <>
      <Context.Provider value={{
          fetchUserDetails, // user detail fetch 
          cartProductCount, // current user add to cart product count,
          fetchUserAddToCart,
          fetchWishlistCount,
          wishlistCount,   // ? expose to context
          setWishlistCount,  // ? expose setter too
      }}>
        <ToastContainer 
          position='top-center'
        />
        
        <Header />
        <main className='min-h-[calc(100vh-120px)] pt-20 lg:pt-36 xl:pt-32'>
          <Outlet/>
        </main>
        <Footer/>
      </Context.Provider>
    </>
  );
}

export default App;
