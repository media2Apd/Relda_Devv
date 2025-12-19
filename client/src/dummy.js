import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import ROLE from "../common/role";
import SummaryApi from "../common"; // Ensure you have the correct API object

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [returnedOrders, setReturnedOrders] = useState([]);

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/");
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

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex">
      <aside className="bg-white min-h-full w-full md:max-w-60 customShadow">
        <div className="h-32 flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer relative flex justify-center">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-20 h-20 rounded-full"
                alt={user?.name}
              />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="capitalize text-lg font-semibold">{user?.name}</p>
          <p className="text-sm">{user?.role}</p>
        </div>

        {/***navigation */}
        <div>
          <nav className="grid p-4">
            <Link
              to={"dashboard"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/dashboard")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to={"all-users"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/all-users")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Users
            </Link>
            <Link
              to={"all-products"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/all-products")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Products
            </Link>
            <Link
              to={"all-categories"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              All Categories
            </Link>
            <Link
              to={"AdminDealer"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/AdminDealer")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Dealer
            </Link>
            <Link
              to={"AdminApplications"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/AdminApplications")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Authourized service centre
            </Link>
            <Link
              to={"all-orders"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/all-orders")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Orders
            </Link>
            <Link
              to={"all-msg"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/all-msg")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Customer Support
            </Link>
            <Link
              to={"all-cont"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/all-cont")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Messages
            </Link>
            <Link
              to={"all-reg"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/all-reg")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Product-Registration
            </Link>
            <Link
              to={"all-applications"}
              className={`px-2 py-1 ${
                isActive("/admin-panel/all-applications")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Careers
            </Link>
            <Link
              to={"all-returned-products"}
              className={`px-2 py-1 flex items-center ${
                isActive("/admin-panel/all-returned-products")
                  ? "bg-slate-500 text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Return Requested{" "}
              <div className="bg-red-600 text-white min-w-5 h-5 rounded-full p-1 flex items-center justify-center ml-2">
                <p className="text-sm">{returnedOrders.length}</p>
              </div>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="w-full h-full p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
