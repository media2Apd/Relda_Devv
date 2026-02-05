import React, { useState, useEffect, useCallback } from "react";
import { MdModeEditOutline, MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import BlogCard from "../components/blogComponents/BlogCard";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const getBlogExcerpt = (blocks = []) => {
  const firstTextBlock = blocks.find(
    (b) => b.type === "text" && b.text
  );

  if (!firstTextBlock) return "";

  // Remove HTML tags & limit length
  const plainText = firstTextBlock.text.replace(/<[^>]*>?/gm, "");

  return plainText.length > 120
    ? plainText.slice(0, 120) + "..."
    : plainText;
};

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.getBlogs.url);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDeleteBlog = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteBlog(id).url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }
      setBlogs(blogs.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <div className="min-h-screen p-1 md:p-4">
      <div className="bg-white py-3 px-6 shadow-md flex justify-between items-center mb-2 rounded-lg">
        <h2 className="font-bold text-xl text-gray-900">All Blogs</h2>
        <button
          className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primaryHover hover:text-white transition-all py-2 px-4 rounded-full"
          onClick={() => navigate("/admin-panel/upload-blogs/create")}

        >
          Upload Blogs
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {error && <p className="text-brand-primary">{error}</p>}
        {blogs.map((blog) => (
          <div key={blog._id} className="relative">
            
            <BlogCard
                key={blog._id}
                image={blog.heroImage}
                category={blog.category}
                title={blog.title}
                description={getBlogExcerpt(blog.blocks)}
                author={blog.author}
                date={formatDate(blog.createdAt)}
                blogSlug={blog.slug}
              onClick={() => navigate(`/admin-panel/upload-blogs/edit?id=${blog._id}`)}

            />

            {/* ADMIN ACTION BUTTONS (Overlay) */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                className="p-2 bg-white/90 hover:bg-green-500 rounded-full hover:text-white shadow"
                onClick={() => navigate(`/admin-panel/upload-blogs/edit?id=${blog._id}`||'')}

              >
                <MdModeEditOutline size={18} />
              </button>

              <button
                className="p-2 bg-white/90 hover:bg-red-500 rounded-full hover:text-white shadow"
                onClick={() => handleDeleteBlog(blog._id)}
              >
                <MdDeleteOutline size={18} />
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default AllBlogs;
