const Joi = require("joi");

const blockSchema = Joi.object({
  type: Joi.string()
    .valid("heading", "text", "list", "image", "proTip", "quote", "faq")
    .required(),

  text: Joi.string().allow(""),

  level: Joi.string().valid("h2", "h3", "h4"),

  style: Joi.string().valid("bullet", "number"),

  items: Joi.array().items(Joi.string()),

  imageUrl: Joi.string().uri().allow(""),

  alt: Joi.string().allow(""),        // 🔥 ADD THIS

  caption: Joi.string().allow(""),

  question: Joi.string().allow(""),
  answer: Joi.string().allow(""),

  highlight: Joi.boolean(),
})
.unknown(true);


const createBlogSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  category: Joi.string().required(),
  author: Joi.string().required(),
  publishDate: Joi.date().optional(),
  heroImage: Joi.string().uri().allow(""),
  metaTitle: Joi.string().allow(""),
  metaDescription: Joi.string().allow(""),
  readingTime: Joi.number().optional(),
  status: Joi.string().valid("draft", "published").default("draft"),

  blocks: Joi.array().items(blockSchema).required(),
});

const updateBlogSchema = createBlogSchema.fork(
  ["title", "slug", "category", "author", "blocks"],
  (schema) => schema.optional()
);

module.exports = { createBlogSchema, updateBlogSchema };
