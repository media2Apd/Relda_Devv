// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import ROLE from "../common/role";

// const AdminBlog = () => {
//   const user = useSelector((state) => state?.user?.user);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [returnedOrders, setReturnedOrders] = useState([]);

//   useEffect(() => {
//     // Only allow users with the MANAGEBLOG role to stay
//     if (user?.role !== ROLE.MANAGEBLOG) {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   const isActive = (path, exact = false) => {
//     if (exact) {
//       return location.pathname === path;
//     }
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <div className="min-h-[calc(100vh-120px)] flex flex-col lg:flex-row bg-gray-100">
//       <aside className="bg-white w-full lg:w-1/4 py-6">
//         <div className="flex flex-col items-center space-y-2 mb-6">
//           <div className="relative w-24 h-24">
//             {user?.profilePic ? (
//               <img
//                 src={user?.profilePic}
//                 className="w-full h-full rounded-full object-cover border border-gray-300"
//                 alt={user?.name}
//               />
//             ) : (
//               <FaRegCircleUser className="w-full h-full text-gray-500" />
//             )}
//           </div>
//           <p className="capitalize text-lg font-semibold text-gray-800">
//             {user?.name || "Admin"}
//           </p>
//           <p className="text-sm text-gray-500">{user?.role || "Admin"}</p>
//         </div>

//         <div>
//           <nav className="px-4 space-y-2">
//             {/* ✅ Only show to MANAGEBLOG users */}
//             {user?.role === ROLE.MANAGEBLOG && (
//               <Link
//                 to={"upload-blogs"}
//                 className={`block px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
//                   isActive("/adminBlog/upload-blogs")
//                     ? "bg-red-600 text-white"
//                     : "hover:text-black hover:bg-slate-100"
//                 }`}
//               >
//                 All Blogs
//               </Link>
//             )}
//           </nav>
//         </div>
//       </aside>

//       <main className="w-full h-full pl-2">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AdminBlog;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useLocation } from "react-router-dom";
import ROLE from "../common/role";
import { FaLock } from "react-icons/fa";
const AdminBlog = () => {
  const user = useSelector((state) => state?.user?.user);
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading, true/false = access

  useEffect(() => {
    if (user) {
      setIsAuthorized(user.role === ROLE.MANAGEBLOG);
    }
  }, [user]);

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Loading state
  if (isAuthorized === null) {
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

  // 403 Forbidden page
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
          You don’t have permission to access this section of the site.
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

  // Authorized content
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
              <FaRegCircleUser className="w-full h-full text-brand-textMuted" />
            )}
          </div>
          <p className="capitalize text-lg font-semibold text-gray-900">
            {user?.name || "Admin"}
          </p>
          <p className="text-sm text-brand-textMuted">{user?.role || "Admin"}</p>
        </div>

        <div>
          <nav className="px-4 space-y-2">
            <Link
              to={"upload-blogs"}
              className={`block px-3 py-2 text-brand-textMuted rounded-lg hover:bg-gray-100 hover:text-gray-900 ${
                isActive("/adminBlog/upload-blogs")
                  ? "bg-brand-primary text-white"
                  : "hover:text-black hover:bg-slate-100"
              }`}
            >
              All Blogs
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

export default AdminBlog;

