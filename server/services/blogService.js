
const Blog = require("../models/blogPostModel");

const fetchblogsFromDB = async () => {
    try {
        const blogs = await Blog.find({});
        return blogs;
    } catch (error) {
        console.error("Error fetching blogs from DB:", error);
        throw error;
    }
};

// Function to fetch blog by ID
const fetchblogById = async (blogId) => {
    try {
        const blog = await Blog.findById(blogId);
        return blog;
    } catch (error) {
        console.error("Error fetching blog by ID from DB:", error);
        throw error;
    }
};

const createBlog = async (payload) => {
  return await Blog.create(payload);
};

const updateBlog = async (id, payload) => {
  return await Blog.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBlog = async (id) => {
  return await Blog.findByIdAndDelete(id);
};

const getAllBlogs = async (filter = {}) => {
  return await Blog.find(filter).sort({ publishDate: -1 });
};

const getBlogById = async (id) => {
  return await Blog.findById(id);
};

const getBlogBySlug = async (slug) => {
  return await Blog.findOne({ slug, status: "published" });
};

const checkSlugExists = async (slug) => {
  return await Blog.findOne({ slug });
};

module.exports = {
  fetchblogsFromDB,
  fetchblogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  checkSlugExists,
};
