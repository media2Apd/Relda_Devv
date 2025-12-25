import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useLocation, } from "react-router-dom";
import ROLE from "../common/role";
import SummaryApi from "../common"; // Ensure you have the correct API object
import { FaLock } from "react-icons/fa";
import scrollTop from "../helpers/scrollTop";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  // const navigate = useNavigate();
  const location = useLocation();
  const [returnedOrders, setReturnedOrders] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
      if (user) {
        setIsAuthorized(user.role === ROLE.ADMIN);
      }
    }, [user]);

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Fetch all returned orders
  const fetchReturnedOrders = async () => {
    try {
      const response = await fetch(`${SummaryApi.allOrder.url}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch returned orders");
      }

      const responseData = await response.json();
      if (responseData.success) {
        const orders = responseData.order
          ? [responseData.order]
          : responseData.orders || responseData.data;

        const filteredOrders = orders.filter(
          (each) => each.order_status === "returnRequested"
        );
        setReturnedOrders(filteredOrders);
      } else {
        setReturnedOrders([]);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchReturnedOrders();
  }, []);

 if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="max-w-md text-center animate-fade-in-up transition-all duration-700 ease-in-out">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full shadow-md animate-pulse">
              <FaLock className="text-brand-primary text-4xl" />
            </div>
          </div>
          <h1 className="text-6xl font-extrabold text-brand-primary animate-fade-in">
            403
          </h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Access Forbidden
          </h2>
          <p className="mt-2 text-brand-textMuted">
            You don't have permission to access this section of the site.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-2 text-white bg-brand-primary hover:bg-brand-primaryHover rounded-md shadow-lg transform hover:scale-105 transition duration-300"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row bg-gray-100">
      <aside className="bg-white w-full lg:w-1/4 py-6">
        <div className="flex flex-col items-center space-y-2 mb-6">
          <div className="relative w-24 h-24">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-full h-full rounded-full object-cover border border-gray-200"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser className="w-full h-full text-brand-textMuted"/>
            )}
          </div>
          <p className="capitalize text-lg font-semibold text-gray-900">{user?.name || "Admin"}</p>
          <p className="text-sm text-brand-textMuted">{user?.role || "Admin"}</p>
        </div>

        {/***navigation */}
        <div>
          <nav className="px-4 space-y-2">
            <Link
              onClick={scrollTop}
              to={"dashboard"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/dashboard")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
              
            >
              Dashboard
            </Link>
            <Link
             onClick={scrollTop}
              to={"all-users"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-users")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Users
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-products"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-products")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Products
            </Link>
            <Link
              onClick={scrollTop}
              to={"upload-blogs"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/upload-blogs")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Blogs
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-offerposter"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-offerposter")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Upload Poster
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-categories"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-categories")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Categories
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-orders"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-orders")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Orders
            </Link>
            <Link
              onClick={scrollTop}
              to={"orders"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/orders")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              Sales Orders
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-dealer-applications"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-dealer-applications")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Dealer
            </Link>
            {/* <Link
              to={"AdminApplications"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/AdminApplications")
                  ? "bg-slate-500 text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Authourized service centre
            </Link> */}
            <Link
              onClick={scrollTop}
              to={"all-enquiries"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-enquiries")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Customer Support
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-complaints"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-complaints")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Complaint Messages
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-contactus"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-contactus")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Contact Messages
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-product-registration"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-product-registration")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Product-Registration
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-careers"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-careers")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Careers
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-returned-products"}
              className={` px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 flex items-center ${
                isActive("/admin-panel/all-returned-products")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Return Requested{" "}
              <div className="bg-green-500 text-white min-w-5 h-5 rounded-full p-1 flex items-center justify-center ml-2">
                <p className="text-sm">{returnedOrders.length}</p>
              </div>
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-cart-items"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-cart-items")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All CartItems
            </Link>
            <Link
              onClick={scrollTop}
              to={"all-cookies-page"}
              className={`block px-3 py-2 font-medium text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/admin-panel/all-cookies-page")
                  ? "bg-brand-primary text-white"
                  : "hover:text-gray-900 hover:bg-slate-100"
              }`}
            >
              All Cookies
            </Link>
          </nav>
        </div>
      </aside>

      <main className="w-full h-full pl-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
