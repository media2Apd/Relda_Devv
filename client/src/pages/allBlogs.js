import React, { useState, useEffect, useCallback } from "react";
import BlogUpload from "./BlogUpload";
import { MdModeEditOutline, MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import SummaryApi from "../common";

const AllBlogs = () => {
  const [openUploadBlog, setOpenUploadBlog] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);

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

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setOpenUploadBlog(true);
  };

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

  const handleSuccess = async () => {
    setOpenUploadBlog(false);
    fetchBlogs();
  };

  return (
    <div className="min-h-screen p-1 md:p-4">
      <div className="bg-white py-3 px-6 shadow-md flex justify-between items-center mb-2 rounded-lg">
        <h2 className="font-bold text-xl text-gray-900">All Blogs</h2>
        <button
          className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primaryHover hover:text-white transition-all py-2 px-4 rounded-full"
          onClick={() => {
            setEditingBlog(null);
            setOpenUploadBlog(true);
          }}
        >
          Upload Blogs
        </button>
      </div>

      {openUploadBlog && (
        <BlogUpload
          onClose={() => setOpenUploadBlog(false)}
          blog={editingBlog}
          onSuccess={handleSuccess}
        />
      )}

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {error && <p className="text-brand-primary">{error}</p>}
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-3 h-[500px] overflow-x-auto"
          >
            <div className="w-full h-50">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <h1 className="text-lg font-semibold text-center">{blog.title}</h1>
            <div className="text-sm text-brand-textMuted space-y-2">
              {blog.content.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-gray-900">
                    {section.subtitle}
                  </h4>
                  {/* Render content safely */}
                  <p className="text-justify">
                    {typeof section.content === "string"
                      ? section.content
                      : JSON.stringify(section.content)}
                  </p>
                </div>
              ))}
            </div>

            {/* <p className="text-center text-xs text-gray-500 mt-2">
              Category: {blog.category}
            </p> */}

            <div className="flex justify-between mt-4">
              <button
                className="p-2 bg-green-100 hover:bg-brand-buttonAccentHover rounded-full hover:text-white cursor-pointer"
                onClick={() => handleEditBlog(blog)}
              >
                <MdModeEditOutline size={20} />
              </button>
              <button
                className="p-2 bg-red-100 hover:bg-brand-primaryHover rounded-full hover:text-white cursor-pointer"
                onClick={() => handleDeleteBlog(blog._id)}
              >
                <MdDeleteOutline size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
