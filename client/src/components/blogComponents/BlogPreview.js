import { Calendar, User } from "lucide-react";

const BlogPreview = ({ blog, onBack }) => {
  if (!blog) return null;

  const b = blog;

  return (
    <section className="bg-white relative">

      {/* BACK TO EDITOR BUTTON (OPTIONAL) */}
  <div className="container mx-auto px-4 md:px-8">
    {onBack && (
      <button
        onClick={onBack}
        className="sticky top-6 z-50 bg-white/90 backdrop-blur shadow px-4 py-2 rounded-lg text-red-600 hover:bg-white transition my-4"
      >
        ← Back to Editor
      </button>
    )}
  </div>

      {/* HERO IMAGE */}
      {b.heroImage && (
        <div className="relative w-full aspect-[16/9] max-h-[700px] bg-gray-200">
          <img
            src={b.heroImage}
            alt={b.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* FLOATING HEADER */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative -mt-24 md:-mt-28 bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto">

          {b.category && (
            <span className="inline-block bg-[#D80A07] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {b.category}
            </span>
          )}

          <h1 className="text-2xl md:text-4xl font-bold text-[#1F1F1F] leading-snug">
            {b.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mt-4">
            {b.author && (
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>{b.author}</span>
              </div>
            )}

            {b.publishDate && (
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>
                  {new Date(b.publishDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BLOG CONTENT */}
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="max-w-7xl mx-auto space-y-8">

          {b.blocks?.map((block, i) => (
            <div key={i}>

              {/* H2 / H3 */}
              {block.type === "heading" && block.text && (
                block.level === "h2" ? (
                  <h2 className="text-2xl font-bold mt-8 mb-4">
                    {block.text}
                  </h2>
                ) : (
                  <h3 className="text-xl font-semibold mt-6 mb-3">
                    {block.text}
                  </h3>
                )
              )}

              {/* PARAGRAPH */}
              {block.type === "text" && block.text && (
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />
              )}

              {/* LIST */}
              {block.type === "list" && block.items?.length > 0 && (
                block.style === "bullet" ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {block.items.map((it, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
                    ))}
                  </ul>
                ) : (
                  <ol className="list-decimal pl-6 space-y-2">
                    {block.items.map((it, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
                    ))}
                  </ol>
                )
              )}

              {/* IMAGE */}
              {block.type === "image" && (block.preview || block.imageUrl) && (
                <figure className="my-8">
                  <img
                    src={block.preview || block.imageUrl}
                    alt={block.alt || b.title}
                    className="rounded-xl w-full max-w-[700px] object-contain mx-auto"
                  />
                  {block.caption && (
                    <figcaption className="text-sm text-gray-500 mt-2 text-center">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* PRO TIP */}
              {block.type === "proTip" && block.text && (
                <div className="bg-[#FDE8E8] border-l-4 border-[#D80A07] p-8 rounded-lg my-8">
                  <div
                    dangerouslySetInnerHTML={{ __html: block.text }}
                  />
                </div>
              )}

              {/* FAQ */}
              {block.type === "faq" && block.question && (
                <div className="my-6">
                  <h3 className="font-semibold text-lg">
                    {block.question}
                  </h3>
                  {block.answer && (
                    <div
                      className="prose max-w-none mt-2"
                      dangerouslySetInnerHTML={{ __html: block.answer }}
                    />
                  )}
                </div>
              )}
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
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default BlogPreview;