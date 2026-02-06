// import React, { useState, useEffect } from "react";
// import { CgClose } from "react-icons/cg";
// import { Loader2 } from "lucide-react"; // For loading spinner icon
// import { toast } from "react-toastify";
// import SummaryApi from "../common";
// import { FaMinus, FaPlus } from "react-icons/fa6";

// // cspell:words Kabaddi Silambam

// const programs = [
//   "Tower Fan",
//   "LED TV",
  
// ];

// const BlogUpload = ({ onClose, blog, onSuccess }) => {
//   const [title, setTitle] = useState(blog ? blog.title : "");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(blog ? blog.imageUrl : null);
//   const [category, setCategory] = useState(blog ? blog.category : "");
//   const [isFocused, setIsFocused] = useState();
//   const [isCategoryFocused, setIsCategoryFocused] = useState();
//   const [loadingButton, setLoadingButton] = useState(false);
//   const [contentBlocks, setContentBlocks] = useState(
//     blog?.content?.length ? blog.content : [{ subtitle: "", content: "" }]
//   );


//   // Add new block
//   const handleAddBlock = () => {
//     setContentBlocks([...contentBlocks, { subtitle: "", content: "" }]);
//   };

//   // Remove block by index
//   const handleRemoveBlock = (index) => {
//     const updated = [...contentBlocks];
//     updated.splice(index, 1);
//     setContentBlocks(updated);
//   };

//   // Handle input changes
//   const handleBlockChange = (index, field, value) => {
//     const updated = [...contentBlocks];
//     updated[index][field] = value;
//     setContentBlocks(updated);
//   };

//   useEffect(() => {
//     if (blog) {
//       setTitle(blog.title);
//       setContentBlocks(blog.content);
//       setCategory(blog.category);
//       setImagePreview(blog.imageUrl);
//     }
//   }, [blog]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !contentBlocks || !category || (!image && !blog)) {
//       toast.error("All fields are required!");
//       return;
//     }
//     setLoadingButton(true);

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", JSON.stringify(contentBlocks));
//     formData.append("category", category);
//     if (image) {
//       formData.append("image", image);
//     }

//     try {
//       const url = blog ? SummaryApi.updateBlog(blog._id).url : SummaryApi.UploadBlog.url;
//       const method = blog ? SummaryApi.updateBlog(blog._id).method : SummaryApi.UploadBlog.method;

//       const response = await fetch(url, {
//         method: method,
//         body: formData,
//         credentials: "include",
//         headers: {
//           // No Content-Type needed for FormData
//         },
//       });

//       if (response.ok) {
//         toast.success(
//           `${blog ? "Blog updated successfully!" : "Blog uploaded successfully!"}`
//         );
//         setTitle("");
//         setContentBlocks([{ subtitle: "", content: "" }]);
//         setCategory("");
//         setImage(null);
//         setImagePreview(null);
//         onClose();
//         onSuccess(); // Call the onSuccess callback to update the parent component
//       } else {
//         throw new Error("Upload failed");
//       }
//     } catch (error) {
//       console.error("Error uploading blog:", error);
//       toast.error("Upload failed. Try again.");
//     } finally {
//       setLoadingButton(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-10">
//       <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] shadow-lg relative">
//         {/* Close Button */}
//         <div className="flex justify-between items-center pb-3">
//           <h2 className="font-bold text-lg">
//             {blog ? "Edit Blog" : "Upload Blog"}
//           </h2>
//           <button
//             className="text-2xl hover:text-brand-primaryHover transition-transform duration-300 hover:rotate-180"
//             onClick={onClose}
//           >
//             <CgClose />
//           </button>
//         </div>

//         {/* Form with Scroll */}
//         <form
//           className="overflow-y-auto max-h-[60vh] px-2"
//           onSubmit={handleSubmit}
//         >
//           {/* Title */}
//           <div className="relative mb-4 mt-2">
//             <input
//               id="title"
//               type="text"
//               placeholder=" "
//               className="peer h-12 w-full border border-gray-200 rounded-md px-4 text-sm text-brand-textMuted focus:border-brand-buttonAccent focus:outline-none transition"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <label
//               htmlFor="title"
//               className="absolute left-4 -top-2 text-xs text-brand-textMuted bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-brand-textMuted peer-focus:-top-2 peer-focus:text-xs peer-focus:text-green-500"
//             >
//               Enter Blog Title*
//             </label>
//           </div>

//           <div className="relative mb-4 mt-2">
//             <select
//               name="category"
//               id="category"
//               className="peer h-12 w-full border border-gray-200 rounded-md px-4 text-sm text-brand-textMuted focus:border-brand-buttonAccent focus:outline-none transition"
//               onFocus={() => setIsCategoryFocused(true)}
//               onBlur={() => setIsCategoryFocused(category !== "")} // Keep label up if a value is selected
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <option value="">Select brand</option>
//               {programs.map((sport) => (
//                 <option key={sport} value={sport}>
//                   {sport}
//                 </option>
//               ))}
//             </select>
//             <label
//               htmlFor="category"
//               className={`absolute left-4 px-1 bg-white transition-all ${
//                 isCategoryFocused || category
//                   ? "-top-2 text-xs text-brand-buttonAccent"
//                   : "top-3 text-sm text-brand-textMuted"
//               }`}
//             >
//               Blog Category*
//             </label>
//           </div>

//           {/* Custom File Input */}
//           <label className="mb-4 flex items-center border border-gray-200 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-100 transition">
//             <input
//               type="file"
//               onChange={handleImageChange}
//               className="hidden"
//             />
//             <span className="text-sm text-brand-textMuted">
//               {image
//                 ? image.name
//                 : blog && blog.imageUrl
//                 ? "Change image"
//                 : "Choose an image"}
//             </span>
//           </label>

//           {/* Image Preview */}
//           {imagePreview && (
//             <div className="mb-4">
//               <img
//                 src={imagePreview}
//                 alt="Blog preview"
//                 className="w-full h-auto rounded-md"
//               />
//             </div>
//           )}

//           <div className="mb-4">
//             <label className="block font-medium text-sm text-brand-textMuted mb-2">
//               Blog Content Sections*
//             </label>
//             {contentBlocks.map((block, index) => (
//               <div
//                 key={index}
//                 className="border border-gray-200 rounded-md p-4 pt-6 mb-3 relative"
//               >
//                 <div className="relative mb-4 mt-2">
//                   <input
//                     id={`subtitle-${index}`}
//                     type="text"
//                     placeholder=" "
//                     className="peer h-12 w-full border border-gray-200 rounded-md px-4 text-sm text-brand-textMuted focus:border-brand-buttonAccent focus:outline-none transition"
//                     value={block.subtitle}
//                     onChange={(e) =>
//                       handleBlockChange(index, "subtitle", e.target.value)
//                     }
//                   />
//                   <label
//                     htmlFor={`subtitle-${index}`}
//                     className="absolute left-4 -top-2 text-xs text-brand-textMuted bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-brand-textMuted peer-focus:-top-2 peer-focus:text-xs peer-focus:text-green-500"
//                   >
//                     Enter Subtitle*
//                   </label>
//                 </div>
//                 <div className="relative mb-4">
//                   <textarea
//                     id={`content-${index}`}
//                     placeholder={isFocused ? "Write a blog content..." : ""}
//                     rows="3"
//                     className="peer w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-brand-textMuted focus:border-brand-buttonAccent focus:outline-none transition"
//                     value={block.content}
//                     onFocus={() => setIsFocused(true)}
//                     onBlur={() => setIsFocused(block.content !== "")} // Keeps label on top if text exists
//                     onChange={(e) =>
//                       handleBlockChange(index, "content", e.target.value)
//                     }
//                   ></textarea>
//                   <label
//                     htmlFor={`content-${index}`}
//                     className="absolute left-4 -top-2 text-xs text-brand-textMuted bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-brand-textMuted peer-focus:-top-2 peer-focus:text-xs peer-focus:text-green-500"
//                   >
//                     Blog Content*
//                   </label>
//                 </div>
//                 <div className="absolute top-1 right-1 flex gap-2">
//                   {contentBlocks.length > 1 && (
//                     <button
//                       type="button"
//                       className="text-white bg-brand-primary rounded-full w-5 h-5 flex justify-center items-center font-bold"
//                       onClick={() => handleRemoveBlock(index)}
//                     >
//                       <FaMinus size={12} />
//                     </button>
//                   )}
//                   {index === contentBlocks.length - 1 && (
//                     <button
//                       type="button"
//                       className="text-white bg-brand-buttonAccent font-bold rounded-full w-5 h-5 flex justify-center items-center"
//                       onClick={handleAddBlock}
//                     >
//                       <FaPlus size={12} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Submit Button */}
//           <div className="text-center flex justify-center items-center">
//             <button
//               type="submit"
//               className={`w-full px-6 py-2 border border-brand-primary text-brand-primary font-bold rounded hover:bg-brand-primaryHover hover:text-white transition flex justify-center items-center ${
//                 loadingButton ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={loadingButton}
//             >
//               {loadingButton ? (
//                 <Loader2 className="animate-spin h-5 w-5" />
//               ) : (
//                 <span>{blog ? "Update Blog" : "Upload Blog"}</span>
//               )}
//             </button> 
//            </div>
//           {/* Submit Button */}
//           {/* <button
//             type="submit"
//             className="w-full bg-green-500 py-2 text-white rounded-md"
//           >
//             {blog ? "Update Blog" : "Upload Blog"}
//           </button> */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BlogUpload;


import React, { useState, useRef, useEffect } from "react";
import SummaryApi from "../common";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import { MdOutlineDragIndicator } from "react-icons/md";
import BlogPreview from "../components/blogComponents/BlogPreview";
import { useLocation } from "react-router-dom";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";

function SortableBlock({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}     // ✅ REQUIRED
    >
      {children({ listeners })}
    </div>
  );
}


const BlockBtn = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-3 py-2 border rounded-lg text-sm bg-white hover:bg-gray-100 whitespace-nowrap"
  >
    + {label}
  </button>
);

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")          // & → and
    .replace(/[^a-z0-9\s-]/g, "")  // remove special chars
    .replace(/\s+/g, "-")          // spaces → -
    .replace(/-+/g, "-");          // multiple - → single -
};


// ----------------------------------------------------------------------
// UPDATED RICH TEXT INPUT WITH ACTIVE TOOLBAR STATE
// ----------------------------------------------------------------------
const RichTextInput = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState([]);

  // Check which formats are currently active at cursor position
  const checkFormats = () => {
    if (!editorRef.current) return;
    
    const formats = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    
    setActiveFormats(formats);
  };

  const exec = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
    checkFormats(); // Update state immediately after action
  };

  // Keep editor in sync when switching blocks
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
    checkFormats(); // Check formats while typing
  };

  const handleKeyDown = (e) => {
    // Better Enter behavior
    if (e.key === "Enter") {
      document.execCommand("insertHTML", false, "<br><br>");
      e.preventDefault();
    }
  };

  // Check formats on mouse up (clicking or selecting text) and key up (moving cursor)
  const handleKeyUp = () => checkFormats();
  const handleMouseUp = () => checkFormats();

  // Helper to get button class based on active state
  const getBtnClass = (formatName) => {
    const isActive = activeFormats.includes(formatName);
    return `px-3 py-1 rounded transition-colors ${
      isActive 
        ? "bg-gray-300 text-black font-semibold shadow-inner" // Active Style
        : "hover:bg-gray-200 text-gray-700" // Inactive Style
    }`;
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex gap-1 border-b p-2 bg-gray-50 text-sm flex-wrap">
        <button 
          type="button" 
          onClick={() => exec("bold")} 
          className={`${getBtnClass("bold")} font-bold`}
          title="Bold"
        >
          B
        </button>

        <button 
          type="button" 
          onClick={() => exec("italic")} 
          className={`${getBtnClass("italic")} italic`}
          title="Italic"
        >
          I
        </button>

        <button 
          type="button" 
          onClick={() => exec("underline")} 
          className={`${getBtnClass("underline")} underline`}
          title="Underline"
        >
          U
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) exec("createLink", url);
          }}
          className="px-3 py-1 hover:bg-gray-200 rounded"
          title="Insert Link"
        >
          🔗
        </button>

        <button 
          type="button" 
          onClick={() => exec("unlink")} 
          className="px-3 py-1 hover:bg-gray-200 rounded"
          title="Remove Link"
        >
          ❌ Link
        </button>

        <button 
          type="button" 
          onClick={() => exec("removeFormat")} 
          className="px-3 py-1 hover:bg-gray-200 rounded ml-auto"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="p-3 min-h-[120px] outline-none prose prose-sm max-w-none"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        data-placeholder={placeholder}
      />

      {/* Placeholder styling */}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
};


const BlogUpload = () => {
  const location = useLocation();

  const basePath = location.pathname.startsWith("/admin-panel")
    ? "/admin-panel/upload-blogs"
    : "/adminBlog/upload-blogs";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const blogId = searchParams.get("id");

  // ---------------- BASIC INFO ----------------
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [status, setStatus] = useState("draft");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // ---------------- HERO IMAGE ----------------
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);

  // ---------------- BLOCKS ----------------
  const [blocks, setBlocks] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [message, setMessage] = useState("");

  const handleBlockDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    setBlocks((items) => {
      const oldIndex = items.findIndex(b => b.id === active.id);
      const newIndex = items.findIndex(b => b.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return items;

      return arrayMove(items, oldIndex, newIndex);
    });
  };




  // ---------------- BLOCK HELPERS ----------------

  useEffect(() => {
    if (blogId) {
      fetch(SummaryApi.getOneBlog(blogId).url, {
        method: SummaryApi.getOneBlog(blogId).method,
        credentials: "include",
      })
        .then(res => res.json())
        .then((b) => {

          setTitle(b.title || "");
          setSlug(b.slug || "");
          setCategory(b.category || "");
          setAuthor(b.author || "");
          setPublishDate(b.publishDate?.slice(0, 10) || "");
          setStatus(b.status || "draft");

          setMetaTitle(b.metaTitle || "");
          setMetaDescription(b.metaDescription || "");

          setHeroPreview(b.heroImage || null);
          setBlocks(
            (b.blocks || []).map(block => {
              const withId = {
                ...block,
                id: block.id || uuidv4(),   // ✅ ADD ID ALWAYS
              };

              if (withId.type === "image" && withId.imageUrl) {
                return {
                  ...withId,
                  preview: withId.imageUrl,
                };
              }

              return withId;
            })
          );


        })
        .catch(console.error);
    }
  }, [blogId]);


  const addBlock = (type) => {
    let block = { id: uuidv4(), type };

    if (type === "heading") block = { id: uuidv4(), type, level: "h2", text: "" };
    if (type === "text") block = { id: uuidv4(), type, text: "" };
    if (type === "list") block = { id: uuidv4(), type, style: "bullet", items: [""] };
    if (type === "image") block = { id: uuidv4(), type, file: null, preview: null, alt: "", caption: "" };
    if (type === "proTip") block = { id: uuidv4(), type, text: "" };
    if (type === "faq") block = { id: uuidv4(), type, question: "", answer: "" };
    if (type === "quote") block = { id: uuidv4(), type, text: "" };

    setBlocks([...blocks, block]);
  };


  const updateBlock = (index, key, value) => {
    const copy = [...blocks];
    copy[index][key] = value;
    setBlocks(copy);
  };

  const updateListItem = (blockIndex, itemIndex, value) => {
    const copy = [...blocks];
    copy[blockIndex].items[itemIndex] = value;
    setBlocks(copy);
  };

  const addListItem = (blockIndex) => {
    const copy = [...blocks];
    copy[blockIndex].items.push("");
    setBlocks(copy);
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };


  // ---------------- IMAGE HANDLERS ----------------

  const handleHeroChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const handleBlockImageChange = (index, file) => {
    const copy = [...blocks];
    copy[index].file = file;
    copy[index].preview = URL.createObjectURL(file);
    setBlocks(copy);
  };


  const handleSubmit = async () => {
    if (!title || !slug || !category || !author) {
      setMessage("Title, Slug, Category, Author are required");
      return;
    }

    const data = {
      title,
      slug,
      category,
      author,
      publishDate,
      status,
      metaTitle,
      metaDescription,
      blocks: blocks.map((b) => ({
        ...b,
        file: undefined,
        preview: undefined,
      })),
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (heroFile) formData.append("heroImage", heroFile);

    blocks.forEach((b) => {
      if (b.type === "image" && b.file) {
        formData.append("blockImages", b.file);
      }
    });

  try {
    if (blogId) {
      await fetch(SummaryApi.updateBlog(blogId).url, {
        method: SummaryApi.updateBlog(blogId).method,
        body: formData,
        credentials: "include",
      });
    } else {
      await fetch(SummaryApi.UploadBlog.url, {
        method: SummaryApi.UploadBlog.method,
        body: formData,
        credentials: "include",
      });
    }

    toast.success("Blog saved successfully");
    navigate(basePath);


  } catch (err) {
    console.error(err);
    setMessage("Failed to save blog");
  }

  };

  if (previewMode) {
    const previewBlog = {
      title,
      category,
      author,
      publishDate,
      heroImage: heroPreview,
      blocks,
    };

    return (
      <BlogPreview
        blog={previewBlog}
        onBack={() => setPreviewMode(false)}
      />
    );
  }


  // ---------------- CMS EDITOR PAGE ----------------

  return (
    <div className="py-4 mx-auto space-y-6">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {blogId ? "Edit Blog" : "Create Blog"}
        </h1>
        <div className="flex gap-3">
          <button onClick={() => setPreviewMode(true)} className="border px-4 py-2 rounded">
            Preview
          </button>
          <button onClick={handleSubmit} className="bg-red-600 text-white px-6 py-2 rounded">
            Save Blog
          </button>
        </div>
      </div>

      {message && <p className="text-red-600">{message}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: BASIC + SEO */}
        <div className="space-y-4 bg-white p-5 border rounded-xl">
          <h2 className="font-semibold">Basic Info</h2>

          <input
            className="input"
            placeholder="Blog Title (H1)"
            value={title}
            onChange={(e) => {
              const val = e.target.value;
              setTitle(val);

              // Auto-generate slug ONLY for new blog
              if (!blogId) {
                setSlug(generateSlug(val));
              }
            }}
          />

          <input
            className="input"
            placeholder="Slug (blog-url)"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            onBlur={() => setSlug(generateSlug(slug))}
          />

          <input className="input" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <input className="input" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
          <input type="date" className="input" value={publishDate} onChange={e => setPublishDate(e.target.value)} />

          <h2 className="font-semibold pt-4">SEO</h2>
          <input className="input" placeholder="Meta Title" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
          <textarea className="input" placeholder="Meta Description" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />

          <h2 className="font-semibold pt-4">Featured Image</h2>
          <input type="file" accept="image/*" onChange={handleHeroChange} />
          {heroPreview && <img src={heroPreview} alt="" className="rounded-lg mt-2" />}

          <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* RIGHT: CONTENT BUILDER */}
        <div className="lg:col-span-2 space-y-4">

          {/* TOOLBAR */}
          <div className="flex gap-2 bg-white p-3 border rounded-xl sticky top-0 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

            {/* Buttons should not shrink */}
            <div className="flex-shrink-0">
              <BlockBtn label="Heading (H2/H3)" onClick={() => addBlock("heading")} />
            </div>
            <div className="flex-shrink-0">
              <BlockBtn label="Paragraph" onClick={() => addBlock("text")} />
            </div>
            <div className="flex-shrink-0">
              <BlockBtn label="List (Bullet/Number)" onClick={() => addBlock("list")} />
            </div>
            <div className="flex-shrink-0">
              <BlockBtn label="Image" onClick={() => addBlock("image")} />
            </div>
            <div className="flex-shrink-0">
              <BlockBtn label="Pro Tip" onClick={() => addBlock("proTip")} />
            </div>
            <div className="flex-shrink-0">
              <BlockBtn label="FAQ" onClick={() => addBlock("faq")} />
            </div>
            <div className="flex-shrink-0">
              <BlockBtn label="Quote" onClick={() => addBlock("quote")} />
            </div>

          </div>
          {/* BLOCK EDITOR */}
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleBlockDragEnd}
          >
            <SortableContext
              items={blocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block, index) => (
                <SortableBlock key={block.id} id={block.id}>
                  {({ listeners }) => (
                    <div className="bg-white border rounded-xl p-4 space-y-3">

                      {/* HEADER ROW */}
                      <div className="flex justify-between items-center border-b pb-2">

                        <div className="flex items-center gap-2">
                          {/* DRAG HANDLE INSIDE CARD */}
                          <span
                            {...listeners}
                            className="cursor-move select-none"
                            title="Drag to reorder"
                          >
                            <MdOutlineDragIndicator className="text-lg" />
                          </span>

                          <strong className="capitalize">
                            {block.type}
                          </strong>
                        </div>

                        <button
                          onClick={() => removeBlock(block.id)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      {/* CONTENT */}
                      <div className="space-y-3">

                        {block.type === "heading" && (
                          <>
                            <select className="input" value={block.level} onChange={e => updateBlock(index, "level", e.target.value)}>
                              <option value="h2">H2</option>
                              <option value="h3">H3</option>
                            </select>
                            <input className="input" placeholder="Heading text" value={block.text} onChange={e => updateBlock(index, "text", e.target.value)} />
                          </>
                        )}

                        {block.type === "text" && (
                          <RichTextInput
                            value={block.text}
                            onChange={(val) => updateBlock(index, "text", val)}
                            placeholder="Paragraph text..."
                          />
                        )}


                        {block.type === "list" && (
                          <>
                            <select className="input" value={block.style} onChange={e => updateBlock(index, "style", e.target.value)}>
                              <option value="bullet">Bullet</option>
                              <option value="number">Number</option>
                            </select>

                            {block.items.map((it, i) => (
                              <RichTextInput
                                key={i}
                                value={it}
                                onChange={(val) => updateListItem(index, i, val)}
                                placeholder={`List item ${i + 1}`}
                              />
                            ))}


                            <button onClick={() => addListItem(index)} className="text-sm text-blue-600">
                              + Add item
                            </button>
                          </>
                        )}

                        {block.type === "image" && (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e =>
                                handleBlockImageChange(index, e.target.files[0])
                              }
                            />

                            {(block.preview || block.imageUrl) && (
                              <img
                                src={block.preview || block.imageUrl}
                                alt=""
                                className="rounded-lg"
                              />
                            )}

                            <input
                              className="input"
                              placeholder="Image ALT text (SEO)"
                              value={block.alt || ""}
                              onChange={e => updateBlock(index, "alt", e.target.value)}
                            />

                            <input
                              className="input"
                              placeholder="Caption"
                              value={block.caption || ""}
                              onChange={e => updateBlock(index, "caption", e.target.value)}
                            />
                          </>
                        )}


                        {block.type === "proTip" && (
                          <>
                            <RichTextInput
                              value={block.text}
                              onChange={(val) => updateBlock(index, "text", val)}
                              placeholder="Pro tip content..."
                            />

                            {/* LIVE PREVIEW LIKE FRONTEND */}
                            {block.text && (
                              <div className="bg-red-50 border-l-4 border-red-600 p-4 mt-2 rounded">
                                <div
                                  dangerouslySetInnerHTML={{ __html: block.text }}
                                />
                              </div>
                            )}
                          </>
                        )}



                        {block.type === "faq" && (
                          <>
                            <input className="input" placeholder="Question" value={block.question} onChange={e => updateBlock(index, "question", e.target.value)} />
                            <RichTextInput
                              value={block.answer}
                              onChange={(val) => updateBlock(index, "answer", val)}
                              placeholder="FAQ Answer..."
                            />

                          </>
                        )}

                        {block.type === "quote" && (
                          <>
                            <RichTextInput
                              value={block.text}
                              onChange={(val) => updateBlock(index, "text", val)}
                              placeholder="Quote text..."
                            />

                            {/* Quote Author - ONLY for quote */}
                            <input
                              className="input"
                              placeholder="Quote Author (optional)"
                              value={block.author || ""}
                              onChange={e => updateBlock(index, "author", e.target.value)}
                            />

                            {/* LIVE PREVIEW */}
                            {block.text && (
                              <div className="border-l-4 border-red-600 pl-4 italic text-gray-600 bg-gray-50 p-4 rounded mt-2">
                                <div dangerouslySetInnerHTML={{ __html: block.text }} />
                                {block.author && (
                                  <div className="mt-3 text-sm font-medium text-gray-800">
                                    – {block.author}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}

                      </div>
                    </div>
                  )}
                </SortableBlock>
              ))}
            </SortableContext>
          </DndContext>

        </div>
      </div>
    </div>
  );
};

export default BlogUpload;