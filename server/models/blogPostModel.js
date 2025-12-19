const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  content: [
    {
      subtitle: {
        type: String,
        default: "",
      },
      content: {
        type: String,
        default: "",
      },
    },
  ],
  category: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate unique slug before saving
blogSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Check for existing slug conflicts
    while (await mongoose.models.Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
