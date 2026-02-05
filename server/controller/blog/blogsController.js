// const Blog = require('../../models/blogPostModel');
// const cloudinary = require("../../config/cloudinary"); 
// const slugify = require('slugify');

// const createBlogPost = async (req, res) => {
//     try {
//         const { title, content, category } = req.body;
//         const imageUrl = req.file ? req.file.path : null;

//         // Ensure content is parsed correctly if sent as a JSON string
//         let parsedContent = content;
//         if (typeof content === 'string') {
//             parsedContent = JSON.parse(content); // this is necessary if frontend sends it as a string
//         }

//         // Allow empty subtitle but require content
//         if (!Array.isArray(parsedContent) || parsedContent.some(c => typeof c.content !== 'string' || c.content.trim() === '')) {
//             return res.status(400).json({ message: 'Invalid content format. Each item must have non-empty content.' });
//         } 

//         const newBlogPost = new Blog({
//             title,
//             content: parsedContent,
//             category,
//             imageUrl
//         });

//         await newBlogPost.save();

//         res.status(201).json({ message: 'Blog post created successfully', blog: newBlogPost });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const getAllBlogPosts = async (req, res) => {
//     try {
//         const blogs = await Blog.find().sort({ createdAt: -1 });
//         res.status(200).json(blogs);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const getBlogPostById = async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id);
//         if (!blog) {
//             return res.status(404).json({ message: 'Blog post not found' });
//         }
//         res.status(200).json(blog);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const editBlogPost = async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id);
//         if (!blog) {
//             return res.status(404).json({ message: 'Blog post not found' });
//         }

//         const { title, content, category } = req.body;
//         let imageUrl = blog.imageUrl; // Keep existing image by default

//         if (req.file) {
//             imageUrl = req.file.path; // If a new image is uploaded, update it
//         }

//     // If title is updated, regenerate unique slug
//     if (title && title !== blog.title) {
//       blog.title = title;

//       const baseSlug = slugify(title, { lower: true, strict: true });
//       let slug = baseSlug;
//       let count = 1;

//       // Check for uniqueness (ignore the current blog post's slug)
//       while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
//         slug = `${baseSlug}-${count++}`;
//       }

//       blog.slug = slug;
//     }
        
//         if (content) {
//             let parsedContent = content;
//             if (typeof content === 'string') {
//                 try {
//                     parsedContent = JSON.parse(content);
//                 } catch (err) {
//                     return res.status(400).json({ message: 'Invalid JSON format for content' });
//                 }
//             }

//         // Allow empty subtitle but require content
//         if (!Array.isArray(parsedContent) || parsedContent.some(c => typeof c.content !== 'string' || c.content.trim() === '')) {
//             return res.status(400).json({ message: 'Invalid content format. Each item must have non-empty content.' });
//         } 

//             blog.content = parsedContent;
//         }
//         if (category) blog.category = category;

//         blog.imageUrl = imageUrl;

//         await blog.save();

//         res.status(200).json({ message: 'Blog post updated successfully', blog });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const deleteBlogPost = async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id);    
//         if (!blog) {
//             return res.status(404).json({ message: 'Blog post not found' });
//         }
//         await cloudinary.uploader.destroy(blog.imageUrl);
//         await Blog.deleteOne({ _id: req.params.id }); // Use deleteOne instead of remove
//         res.status(200).json({ message: 'Blog post deleted successfully' });
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// module.exports = { createBlogPost, getAllBlogPosts, getBlogPostById, editBlogPost, deleteBlogPost };



const blogService = require("../../services/blogService");
const { uploadToCloudinary } = require("../../utils/cloudinaryUtil");
const {
  createBlogSchema,
  updateBlogSchema,
} = require("../../validation/blogValidation");

// Helper: map block image uploads to blocks
const attachBlockImages = async (blocks, files = []) => {
  if (!files || !files.length) return blocks;

  const imageBlocks = blocks.filter(b => b.type === "image");

  for (let i = 0; i < imageBlocks.length; i++) {
    const file = files[i];
    if (!file) continue;

    const uploaded = await uploadToCloudinary({
      file,
      folder: "blog-blocks",
    });

    imageBlocks[i].imageUrl = uploaded.url;
  }

  return blocks;
};

// ---------------- CREATE BLOG ----------------
const createBlog = async (req, res) => {
  try {
    let data = JSON.parse(req.body.data); // JSON part
    let blocks = data.blocks || [];

    // Upload hero image
    if (req.files?.heroImage?.[0]) {
      const heroUpload = await uploadToCloudinary({
        file: req.files.heroImage[0],
        folder: "blog-hero",
      });
      data.heroImage = heroUpload.url;
    }

    // Upload block images
    blocks = await attachBlockImages(blocks, req.files?.blockImages);

    const finalPayload = { ...data, blocks };

    // ✅ VALIDATION AFTER IMAGE INJECTION
    const { error, value } = createBlogSchema.validate(finalPayload);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existing = await blogService.checkSlugExists(value.slug);
    if (existing) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    const blog = await blogService.createBlog(value);
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

// ---------------- UPDATE BLOG ----------------
const updateBlog = async (req, res) => {
  try {
    let data = JSON.parse(req.body.data);
    let blocks = data.blocks || [];

    // Replace hero image if provided
    if (req.files?.heroImage?.[0]) {
      const heroUpload = await uploadToCloudinary({
        file: req.files.heroImage[0],
        folder: "blog-hero",
      });
      data.heroImage = heroUpload.url;
    }

    // Replace block images if provided
    blocks = await attachBlockImages(blocks, req.files?.blockImages);

    const finalPayload = { ...data, blocks };

    // ✅ VALIDATION
    const { error, value } = updateBlogSchema.validate(finalPayload);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const blog = await blogService.updateBlog(req.params.id, value);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

// ---------------- DELETE BLOG ----------------
const deleteBlog = async (req, res) => {
  try {
    const blog = await blogService.deleteBlog(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

// ---------------- GET ALL BLOGS ----------------
const getAllBlogs = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }
    const blogs = await blogService.getAllBlogs(filter);
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// ---------------- GET BLOG BY ID ----------------
const getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

// ---------------- GET BLOG BY SLUG ----------------
const getBlogBySlug = async (req, res) => {
  
  try {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
};