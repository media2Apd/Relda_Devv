// const mongoose = require('mongoose');
// const slugify = require('slugify');

// const blogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   slug: {
//     type: String,
//     unique: true,
//     index: true,
//   },
//   content: [
//     {
//       subtitle: {
//         type: String,
//         default: "",
//       },
//       content: {
//         type: String,
//         default: "",
//       },
//     },
//   ],
//   category: {
//     type: String,
//     default: "",
//   },
//   imageUrl: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Generate unique slug before saving
// blogSchema.pre('save', async function (next) {
//   if (this.isModified('title') || !this.slug) {
//     const baseSlug = slugify(this.title, { lower: true, strict: true });
//     let slug = baseSlug;
//     let count = 1;

//     // Check for existing slug conflicts
//     while (await mongoose.models.Blog.findOne({ slug })) {
//       slug = `${baseSlug}-${count++}`;
//     }

//     this.slug = slug;
//   }
//   next();
// });

// const Blog = mongoose.model('Blog', blogSchema);
// module.exports = Blog;


const mongoose =require("mongoose");

const BlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["heading", "text", "list", "image", "proTip", "quote", "faq"],
      required: true,
    },

    text: String,

    level: {
      type: String,
      enum: ["h2", "h3", "h4"],
    },

    style: {
      type: String,
      enum: ["bullet", "number"],
    },
    items: [String],

    // ✅ Standard image field
    imageUrl: String,
    alt: String,
    caption: String,

    question: String,
    answer: String,

    // For future highlight / callout
    highlight: {
      type: Boolean,
      default: false,
    },
    author: String

  },
);


const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    publishDate: {
      type: Date,
    },

    heroImage: {
      type: String, // URL
    },

    metaTitle: {
      type: String,
    },

    metaDescription: {
      type: String,
    },

    readingTime: {
      type: Number, // minutes
      default: 5,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    //  MAIN CONTENT FOR DESIGN
    blocks: [BlockSchema],

  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;