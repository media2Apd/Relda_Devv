import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { Loader2 } from "lucide-react"; // For loading spinner icon
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { FaMinus, FaPlus } from "react-icons/fa6";

// cspell:words Kabaddi Silambam

const programs = [
  "Tower Fan",
  "LED TV",
  
];

const BlogUpload = ({ onClose, blog, onSuccess }) => {
  const [title, setTitle] = useState(blog ? blog.title : "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(blog ? blog.imageUrl : null);
  const [category, setCategory] = useState(blog ? blog.category : "");
  const [isFocused, setIsFocused] = useState();
  const [isCategoryFocused, setIsCategoryFocused] = useState();
  const [loadingButton, setLoadingButton] = useState(false);
  const [contentBlocks, setContentBlocks] = useState(
    blog?.content?.length ? blog.content : [{ subtitle: "", content: "" }]
  );


  // Add new block
  const handleAddBlock = () => {
    setContentBlocks([...contentBlocks, { subtitle: "", content: "" }]);
  };

  // Remove block by index
  const handleRemoveBlock = (index) => {
    const updated = [...contentBlocks];
    updated.splice(index, 1);
    setContentBlocks(updated);
  };

  // Handle input changes
  const handleBlockChange = (index, field, value) => {
    const updated = [...contentBlocks];
    updated[index][field] = value;
    setContentBlocks(updated);
  };

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContentBlocks(blog.content);
      setCategory(blog.category);
      setImagePreview(blog.imageUrl);
    }
  }, [blog]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !contentBlocks || !category || (!image && !blog)) {
      toast.error("All fields are required!");
      return;
    }
    setLoadingButton(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", JSON.stringify(contentBlocks));
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const url = blog ? SummaryApi.updateBlog(blog._id).url : SummaryApi.UploadBlog.url;
      const method = blog ? SummaryApi.updateBlog(blog._id).method : SummaryApi.UploadBlog.method;

      const response = await fetch(url, {
        method: method,
        body: formData,
        credentials: "include",
        headers: {
          // No Content-Type needed for FormData
        },
      });

      if (response.ok) {
        toast.success(
          `${blog ? "Blog updated successfully!" : "Blog uploaded successfully!"}`
        );
        setTitle("");
        setContentBlocks([{ subtitle: "", content: "" }]);
        setCategory("");
        setImage(null);
        setImagePreview(null);
        onClose();
        onSuccess(); // Call the onSuccess callback to update the parent component
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading blog:", error);
      toast.error("Upload failed. Try again.");
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-10">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] shadow-lg relative">
        {/* Close Button */}
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">
            {blog ? "Edit Blog" : "Upload Blog"}
          </h2>
          <button
            className="text-2xl hover:text-brand-primaryHover transition-transform duration-300 hover:rotate-180"
            onClick={onClose}
          >
            <CgClose />
          </button>
        </div>

        {/* Form with Scroll */}
        <form
          className="overflow-y-auto max-h-[60vh] px-2"
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <div className="relative mb-4 mt-2">
            <input
              id="title"
              type="text"
              placeholder=" "
              className="peer h-12 w-full border border-gray-200 rounded-md px-4 text-sm text-brand-textMuted focus:border-brand-buttonAccent focus:outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label
              htmlFor="title"
              className="absolute left-4 -top-2 text-xs text-brand-textMuted bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-brand-textMuted peer-focus:-top-2 peer-focus:text-xs peer-focus:text-green-500"
            >
              Enter Blog Title*
            </label>
          </div>

          <div className="relative mb-4 mt-2">
            <select
              name="category"
              id="category"
              className="peer h-12 w-full border border-gray-200 rounded-md px-4 text-sm text-brand-textMuted focus:border-brand-buttonAccent focus:outline-none transition"
              onFocus={() => setIsCategoryFocused(true)}
              onBlur={() => setIsCategoryFocused(category !== "")} // Keep label up if a value is selected
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select brand</option>
              {programs.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
            <label
              htmlFor="category"
              className={`absolute left-4 px-1 bg-white transition-all ${
                isCategoryFocused || category
                  ? "-top-2 text-xs text-brand-buttonAccent"
                  : "top-3 text-sm text-brand-textMuted"
              }`}
            >
              Blog Category*
            </label>
          </div>

          {/* Custom File Input */}
          <label className="mb-4 flex items-center border border-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-sm text-brand-textMuted">
              {image
                ? image.name
                : blog && blog.imageUrl
                ? "Change image"
                : "Choose an image"}
            </span>
          </label>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Blog preview"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block font-medium text-sm text-brand-textMuted mb-2">
              Blog Content Sections*
            </label>
            {contentBlocks.map((block, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-4 pt-6 mb-3 relative"
              >
                <div className="relative mb-4 mt-2">
                  <input
                    id={`subtitle-${index}`}
                    type="text"
                    placeholder=" "
                    className="peer h-12 w-full border border-gray-200 rounded-md px-4 text-sm text-brand-textMuted focus:border-brand-buttonAccent focus:outline-none transition"
                    value={block.subtitle}
                    onChange={(e) =>
                      handleBlockChange(index, "subtitle", e.target.value)
                    }
                  />
                  <label
                    htmlFor={`subtitle-${index}`}
                    className="absolute left-4 -top-2 text-xs text-brand-textMuted bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-brand-textMuted peer-focus:-top-2 peer-focus:text-xs peer-focus:text-green-500"
                  >
                    Enter Subtitle*
                  </label>
                </div>
                <div className="relative mb-4">
                  <textarea
                    id={`content-${index}`}
                    placeholder={isFocused ? "Write a blog content..." : ""}
                    rows="3"
                    className="peer w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-brand-textMuted focus:border-brand-buttonAccent focus:outline-none transition"
                    value={block.content}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(block.content !== "")} // Keeps label on top if text exists
                    onChange={(e) =>
                      handleBlockChange(index, "content", e.target.value)
                    }
                  ></textarea>
                  <label
                    htmlFor={`content-${index}`}
                    className="absolute left-4 -top-2 text-xs text-brand-textMuted bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-brand-textMuted peer-focus:-top-2 peer-focus:text-xs peer-focus:text-green-500"
                  >
                    Blog Content*
                  </label>
                </div>
                <div className="absolute top-1 right-1 flex gap-2">
                  {contentBlocks.length > 1 && (
                    <button
                      type="button"
                      className="text-white bg-brand-primary rounded-full w-5 h-5 flex justify-center items-center font-bold"
                      onClick={() => handleRemoveBlock(index)}
                    >
                      <FaMinus size={12} />
                    </button>
                  )}
                  {index === contentBlocks.length - 1 && (
                    <button
                      type="button"
                      className="text-white bg-brand-buttonAccent font-bold rounded-full w-5 h-5 flex justify-center items-center"
                      onClick={handleAddBlock}
                    >
                      <FaPlus size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center flex justify-center items-center">
            <button
              type="submit"
              className={`w-full px-6 py-2 border border-brand-primary text-brand-primary font-bold rounded hover:bg-brand-primaryHover hover:text-white transition flex justify-center items-center ${
                loadingButton ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loadingButton}
            >
              {loadingButton ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span>{blog ? "Update Blog" : "Upload Blog"}</span>
              )}
            </button> 
           </div>
          {/* Submit Button */}
          {/* <button
            type="submit"
            className="w-full bg-green-500 py-2 text-white rounded-md"
          >
            {blog ? "Update Blog" : "Upload Blog"}
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default BlogUpload;