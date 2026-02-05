import React from "react";

const BlogCard = ({ image, category, date, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl 
      overflow-hidden 
      transition-all duration-300 
      cursor-pointer 
      flex flex-col h-full"
    >
      {/* IMAGE */}
<div className="relative w-full aspect-[10/9] overflow-hidden rounded-2xl">
  <img
    src={image}
    alt={title}
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>


      {/* CONTENT */}
      <div className="py-6 flex flex-col flex-grow space-y-3">
        {/* CATEGORY + DATE */}
        <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-wider">
          <span className="font-medium">{category}</span>
          <span>•</span>
          <span>{date}</span>
        </div>

        {/* TITLE */}
        <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-grow">
          {description}
        </p>

        {/* READ MORE */}
        <span className="text-sm font-semibold text-red-500 underline mt-auto">
          Read More...
        </span>
      </div>
    </div>
  );
};

export default BlogCard;
