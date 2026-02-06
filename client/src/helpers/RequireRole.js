import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireRole = ({ role, children }) => {
  const user = useSelector((state) => state?.user?.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin trying manager route 
  if (role === "manager" && user.role !== "manager") {
    return <Navigate to="/admin-panel/dashboard" replace />;
  }

  // Manager trying admin route 
  if (role === "admin" && user.role !== "admin") {
    return <Navigate to="/adminBlog/upload-blogs" replace />;
  }

  return children;
};

export default RequireRole;
