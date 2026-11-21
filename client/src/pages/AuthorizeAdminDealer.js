// import React, { useState, useMemo, useEffect } from "react";
// import { IoMdArrowRoundBack, IoMdEye, IoMdClose } from "react-icons/io";
// import * as XLSX from "xlsx";
// import SummaryApi from "../../src/common/index";

// const FILE_FIELDS = [
//   { key: "shopFrontPhoto", label: "Shop Front Photo" },
//   { key: "shopInteriorPhoto", label: "Shop Interior Photo" },
//   { key: "gstCertificate", label: "GST Certificate" },
//   { key: "visitingCard", label: "Visiting Card" },
// ];

// // Works out what kind of file this is, and returns everything the
// // preview modal needs to render it correctly - regardless of whether
// // the backend `type` field is missing/wrong, or the URL has no extension
// // (common with Cloudinary links).
// const resolveDoc = (doc) => {
//   if (!doc?.url) return null;

//   const url = doc.url;
//   const clean = url.split("?")[0].toLowerCase();
//   const type = (doc.type || "").toLowerCase();
//   const extMatch = clean.match(/\.([a-z0-9]+)$/);
//   const ext = extMatch ? extMatch[1] : "";

//   const isImage =
//     type.startsWith("image") ||
//     ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext) ||
//     /\/image\/upload\//.test(clean);

//   const isPdf =
//     type.includes("pdf") ||
//     ext === "pdf" ||
//     (/\/raw\/upload\//.test(clean) && clean.includes("pdf"));

//   const isOffice =
//     type.includes("word") ||
//     type.includes("excel") ||
//     type.includes("sheet") ||
//     type.includes("officedocument") ||
//     ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext);

//   const kind = isImage ? "image" : isPdf ? "pdf" : isOffice ? "office" : "other";

//   return { url, label: doc.label, kind };
// };

// const AuthorizeAdminDealer = () => {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [view, setView] = useState("summary");
//   const [selectedApp, setSelectedApp] = useState(null);

//   // ---- Document preview modal state ----
//   const [previewDoc, setPreviewDoc] = useState(null); // { url, kind: 'image'|'pdf'|'other', label } | null
//   const [previewImageFailed, setPreviewImageFailed] = useState(false);

//   const [selectedUser, setSelectedUser] = useState("All Users");
//   const [selectedCategory, setSelectedCategory] = useState("All Categories");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(SummaryApi.authorizeAdminDealer.url, {
//         method: SummaryApi.authorizeAdminDealer.method,
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (result.success) {
//         setApplications(result.data || []);
//       } else {
//         setError(result.message || "Failed to fetch dealer applications");
//       }
//     } catch (err) {
//       console.error("Error fetching dealer applications:", err);
//       setError("Something went wrong while fetching dealer applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   // Close modal on ESC key + lock background scroll while open
//   useEffect(() => {
//     if (!previewDoc) return;
//     setPreviewImageFailed(false);
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") setPreviewDoc(null);
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     document.body.style.overflow = "hidden";
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "";
//     };
//   }, [previewDoc]);

//   const userOptions = useMemo(
//     () => ["All Users", ...new Set(applications.map((a) => a.proprietorName))],
//     [applications]
//   );

//   const categoryOptions = useMemo(() => {
//     const allCategories = applications.flatMap((a) => a.productCategories || []);
//     return ["All Categories", ...new Set(allCategories)];
//   }, [applications]);

//   const filteredApplications = useMemo(() => {
//     return applications.filter((app) => {
//       if (selectedUser !== "All Users" && app.proprietorName !== selectedUser) {
//         return false;
//       }
//       if (
//         selectedCategory !== "All Categories" &&
//         !(app.productCategories || []).includes(selectedCategory)
//       ) {
//         return false;
//       }
//       if (fromDate && app.createdAt && app.createdAt.slice(0, 10) < fromDate) {
//         return false;
//       }
//       if (toDate && app.createdAt && app.createdAt.slice(0, 10) > toDate) {
//         return false;
//       }
//       return true;
//     });
//   }, [applications, selectedUser, selectedCategory, fromDate, toDate]);

//   const handleViewDetails = (app) => {
//     setSelectedApp(app);
//     setView("details");
//   };

//   const handleClearFilters = () => {
//     setSelectedUser("All Users");
//     setSelectedCategory("All Categories");
//     setFromDate("");
//     setToDate("");
//   };

//   const downloadXLSX = () => {
//     if (filteredApplications.length === 0) {
//       alert("No applications to export.");
//       return;
//     }

//     const rows = filteredApplications.map((app, index) => ({
//       "S.No": index + 1,
//       "Business Name": app.businessName,
//       "Owner Name": app.proprietorName,
//       "Contact Person": app.contactPerson,
//       Mobile: app.mobile,
//       WhatsApp: app.whatsapp,
//       Email: app.email,
//       "GST Number": app.gstNumber,
//       "PAN Number": app.panNumber,
//       "Business Type": app.businessType,
//       "Established Year": app.establishmentYear,
//       "Product Categories": (app.productCategories || []).join(", "),
//       "Other Category": app.otherCategory,
//       "Brands Sold": app.brandsSold,
//       Experience: app.experience,
//       "Monthly Turnover": app.monthlyTurnover,
//       "Shop Ownership": app.shopOwnership,
//       "Shop Area": app.shopArea,
//       "Sales Staff": app.salesStaff,
//       "Home Delivery": app.homeDelivery,
//       "Interested Categories": (app.interestedCategories || []).join(", "),
//       "Expected Purchase": app.expectedPurchase,
//       Address: app.address,
//       City: app.city,
//       District: app.district,
//       State: app.state,
//       "PIN Code": app.pinCode,
//       "Reason to Join": app.reason,
//       "Additional Info": app.additionalInfo,
//       Status: app.status,
//       "Created At": app.createdAt ? app.createdAt.slice(0, 10) : "",
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(rows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Dealer Applications");

//     worksheet["!cols"] = Object.keys(rows[0]).map(() => ({ wch: 20 }));

//     const today = new Date().toISOString().slice(0, 10);
//     XLSX.writeFile(workbook, "dealer-applications-" + today + ".xlsx");
//   };

//   return (
//     <div className="mx-auto pb-8 p-1 md:p-4 text-gray-900">
//       {view === "summary" ? (
//         <>
//           {/* Header Section */}
//           <div className="bg-white py-3 px-4 sm:px-6 shadow-md flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center rounded-lg">
//             <h2 className="font-bold text-lg sm:text-xl text-gray-900">All Dealer Applications</h2>
//             <button
//               className="border-2 border-brand-buttonSecondary text-brand-buttonSecondary hover:bg-brand-buttonSecondaryHover hover:text-white transition-all py-2 px-4 rounded-full text-sm font-semibold w-full sm:w-auto"
//               onClick={downloadXLSX}
//             >
//               Export to Excel
//             </button>
//           </div>

//           {/* Filter Section */}
//           <div className="flex flex-wrap gap-3 mt-4">
//             <select
//               value={selectedUser}
//               onChange={(e) => setSelectedUser(e.target.value)}
//               className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-auto"
//             >
//               {userOptions.map((user) => (
//                 <option key={user} value={user}>
//                   {user}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-auto"
//             >
//               {categoryOptions.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               placeholder="From Date*"
//               className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-auto"
//             />

//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               placeholder="To Date*"
//               className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-auto"
//             />

//             {(selectedUser !== "All Users" ||
//               selectedCategory !== "All Categories" ||
//               fromDate ||
//               toDate) && (
//               <button
//                 onClick={handleClearFilters}
//                 className="text-sm font-semibold text-brand-buttonSecondary hover:underline px-2"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>

//           {/* Table Section */}
//           <div className="overflow-x-auto rounded-lg shadow-lg mt-4 -mx-1 sm:mx-0">
//             <table className="w-full bg-white min-w-[560px]">
//               <thead>
//                 <tr className="bg-brand-primary text-white">
//                   <th className="border border-gray-200 px-4 py-2">S.No</th>
//                   <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
//                   <th className="border border-gray-200 px-4 py-2 text-left">Mobile</th>
//                   <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
//                   <th className="border border-gray-200 px-4 py-2 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="5" className="px-4 py-10 text-center text-brand-textMuted">
//                       Loading applications...
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan="5" className="px-4 py-10 text-center text-red-500">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : filteredApplications.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="px-4 py-10 text-center text-brand-textMuted">
//                       No applications found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredApplications.map((app, index) => (
//                     <tr key={app._id} className="hover:bg-gray-100 transition-colors">
//                       <td className="border border-gray-200 px-4 py-2 text-center">{index + 1}</td>
//                       <td className="border border-gray-200 px-4 py-2 font-medium">{app.proprietorName}</td>
//                       <td className="border border-gray-200 px-4 py-2">{app.mobile}</td>
//                       <td className="border border-gray-200 px-4 py-2 break-all">{app.email}</td>
//                       <td className="border border-gray-200 px-4 py-2 text-center">
//                         <button
//                           onClick={() => handleViewDetails(app)}
//                           className="p-2 bg-green-100 text-brand-buttonAccent rounded-full hover:bg-brand-buttonAccentHover hover:text-white transition-all"
//                           title="View Details"
//                         >
//                           <IoMdEye size={20} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       ) : (
//         /* Detailed View */
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between border-b pb-4 mb-6">
//             <button
//               onClick={() => setView("summary")}
//               className="flex items-center text-brand-primary hover:text-brand-primaryHover font-bold transition-all"
//             >
//               <IoMdArrowRoundBack className="mr-2" size={24} /> Back to Summary
//             </button>
//             <h2 className="text-lg sm:text-xl font-bold">Dealer Application Details</h2>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//             <div className="lg:col-span-2 space-y-3">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
//                 <p className="text-sm"><strong>Business Name:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.businessName}</span></p>
//                 <p className="text-sm"><strong>Owner Name:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.proprietorName}</span></p>
//                 <p className="text-sm"><strong>Contact Person:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.contactPerson}</span></p>
//                 <p className="text-sm"><strong>Mobile:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.mobile}</span></p>
//                 <p className="text-sm"><strong>WhatsApp:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.whatsapp}</span></p>
//                 <p className="text-sm break-all"><strong>Email:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.email}</span></p>
//                 <p className="text-sm"><strong>GST Number:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.gstNumber}</span></p>
//                 <p className="text-sm"><strong>PAN Number:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.panNumber}</span></p>
//                 <p className="text-sm"><strong>Business Type:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.businessType}</span></p>
//                 <p className="text-sm"><strong>Established Year:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.establishmentYear}</span></p>
//                 <p className="text-sm"><strong>Product Categories:</strong> <span className="text-brand-textMuted ml-1">{(selectedApp.productCategories || []).join(", ")}</span></p>
//                 {selectedApp.otherCategory && (
//                   <p className="text-sm"><strong>Other Category:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.otherCategory}</span></p>
//                 )}
//                 <p className="text-sm"><strong>Brands Sold:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.brandsSold}</span></p>
//                 <p className="text-sm"><strong>Retail Experience:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.experience}</span></p>
//                 <p className="text-sm"><strong>Monthly Turnover:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.monthlyTurnover}</span></p>
//                 <p className="text-sm"><strong>Shop Ownership:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.shopOwnership}</span></p>
//                 <p className="text-sm"><strong>Shop Area:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.shopArea}</span></p>
//                 <p className="text-sm"><strong>Sales Staff:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.salesStaff}</span></p>
//                 <p className="text-sm"><strong>Home Delivery:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.homeDelivery}</span></p>
//                 <p className="text-sm"><strong>Interested Categories:</strong> <span className="text-brand-textMuted ml-1">{(selectedApp.interestedCategories || []).join(", ")}</span></p>
//                 <p className="text-sm"><strong>Expected Purchase:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.expectedPurchase}</span></p>
//                 <p className="text-sm"><strong>Status:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.status}</span></p>
//               </div>

//               <div className="pt-4 mt-4 border-t border-gray-200">
//                 <h4 className="font-bold text-sm text-gray-900 mb-2 underline">Address</h4>
//                 <p className="text-sm text-brand-textMuted leading-relaxed">
//                   {selectedApp.address}<br />
//                   {selectedApp.city}, {selectedApp.district}, {selectedApp.state}<br />
//                   <span className="font-semibold text-gray-900">{selectedApp.pinCode}</span>
//                 </p>
//               </div>

//               <div className="pt-4 mt-4 border-t border-gray-200">
//                 <h4 className="font-bold text-sm text-gray-900 mb-2 underline">Reason to Join</h4>
//                 <p className="text-sm text-brand-textMuted leading-relaxed">{selectedApp.reason}</p>
//               </div>

//               {selectedApp.additionalInfo && (
//                 <div className="pt-4 mt-4 border-t border-gray-200">
//                   <h4 className="font-bold text-sm text-gray-900 mb-2 underline">Additional Information</h4>
//                   <p className="text-sm text-brand-textMuted leading-relaxed">{selectedApp.additionalInfo}</p>
//                 </div>
//               )}
//             </div>

//             {/* Right: files - bound to documentSnapshot from backend */}
//             <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg h-fit lg:sticky lg:top-4">
//               <h3 className="font-bold text-lg text-gray-900 border-b border-gray-200 pb-2 mb-4">Uploaded Files</h3>
//               <div className="space-y-4">
//                 {(() => {
//                   const docs = selectedApp.documentSnapshot?.[0] || {};

//                   return FILE_FIELDS.map(({ key, label }) => {
//                     const doc = docs[key]; // { url, publicId, type }
//                     const resolved = resolveDoc(doc);

//                     return (
//                       <div key={key}>
//                         <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
//                         {!resolved ? (
//                           <p className="text-sm text-brand-textMuted italic">Not uploaded</p>
//                         ) : resolved.kind === "image" ? (
//                           <button
//                             type="button"
//                             onClick={() => setPreviewDoc({ ...resolved, label })}
//                             className="block w-fit"
//                           >
//                             <img
//                               src={resolved.url}
//                               alt={label}
//                               className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
//                               onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = "https://via.placeholder.com/150?text=No+Image";
//                               }}
//                             />
//                           </button>
//                         ) : (
//                           <button
//                             type="button"
//                             onClick={() => setPreviewDoc({ ...resolved, label })}
//                             className="text-sm underline text-brand-buttonSecondary"
//                           >
//                             View Document
//                           </button>
//                         )}
//                       </div>
//                     );
//                   });
//                 })()}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ---- Document Preview Modal ---- */}
//       {previewDoc && (
//         <div
//           className="fixed inset-0 z-[999] flex items-start justify-center bg-black/70 p-4 pt-20 sm:pt-24 overflow-y-auto"
//           onClick={() => setPreviewDoc(null)}
//         >
//           <div
//             className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal header */}
//             <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
//               <h3 className="font-semibold text-gray-900">{previewDoc.label}</h3>
//               <div className="flex items-center gap-3">
//                 <a
//                   href={previewDoc.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-sm underline text-brand-buttonSecondary"
//                 >
//                   Open in new tab
//                 </a>
//                 <button
//                   type="button"
//                   onClick={() => setPreviewDoc(null)}
//                   className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
//                   title="Close"
//                 >
//                   <IoMdClose size={22} />
//                 </button>
//               </div>
//             </div>

//             {/* Modal body */}
//             <div
//               className={`flex-1 bg-gray-100 ${
//                 previewDoc.kind === "pdf" || previewDoc.kind === "office"
//                   ? "overflow-y-auto overflow-x-hidden p-0"
//                   : "overflow-auto flex items-center justify-center p-4"
//               }`}
//             >
//               {previewDoc.kind === "image" || (previewDoc.kind === "other" && !previewImageFailed) ? (
//                 <img
//                   src={previewDoc.url}
//                   alt={previewDoc.label}
//                   className="max-w-full max-h-full object-contain rounded"
//                   onError={() => setPreviewImageFailed(true)}
//                 />
//               ) : previewDoc.kind === "pdf" ? (
//                 <iframe
//                   src={previewDoc.url}
//                   title={previewDoc.label}
//                   className="w-full h-full bg-white border-0"
//                 />
//               ) : previewDoc.kind === "office" ? (
//                 <iframe
//                   src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//                     previewDoc.url
//                   )}`}
//                   title={previewDoc.label}
//                   className="w-full h-full bg-white border-0"
//                 />
//               ) : (
//                 <div className="text-center text-sm text-brand-textMuted p-8">
//                   <p className="mb-3">Preview not available for this file type.</p>
//                   <a
//                     href={previewDoc.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline text-brand-buttonSecondary font-semibold"
//                   >
//                     Open document in new tab
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuthorizeAdminDealer;
import React, { useState, useMemo, useEffect, useRef } from "react";
import { IoMdArrowRoundBack, IoMdEye, IoMdClose } from "react-icons/io";
import { MdEdit, MdDelete, MdCloudUpload } from "react-icons/md";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import SummaryApi from "../../src/common/index";

const FILE_FIELDS = [
  { key: "shopFrontPhoto", label: "Shop Front Photo" },
  { key: "shopInteriorPhoto", label: "Shop Interior Photo" },
  { key: "gstCertificate", label: "GST Certificate" },
  { key: "visitingCard", label: "Visiting Card" },
];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Approved: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

// Robust helper function to extract document data regardless of how backend saved it
const extractDoc = (app, key) => {
  if (!app) return null;

  // 1. Direct on root object
  if (app[key]) {
    return typeof app[key] === "string" ? { url: app[key] } : app[key];
  }

  const snap = app.documentSnapshot;
  if (!snap) return null;

  // 2. Inside documentSnapshot array
  if (Array.isArray(snap)) {
    for (const item of snap) {
      if (item && item[key]) {
        return typeof item[key] === "string" ? { url: item[key] } : item[key];
      }
    }
    if (snap[0] && snap[0][key]) {
      return typeof snap[0][key] === "string" ? { url: snap[0][key] } : snap[0][key];
    }
  }

  // 3. Inside documentSnapshot object
  if (typeof snap === "object" && snap[key]) {
    return typeof snap[key] === "string" ? { url: snap[key] } : snap[key];
  }

  return null;
};

// Resolves file kind (image, pdf, office, other)
const resolveDoc = (doc) => {
  if (!doc?.url) return null;

  const url = doc.url;
  const clean = url.split("?")[0].toLowerCase();
  const type = (doc.type || "").toLowerCase();
  const extMatch = clean.match(/\.([a-z0-9]+)$/);
  const ext = extMatch ? extMatch[1] : "";

  const isImage =
    type.startsWith("image") ||
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext) ||
    /\/image\/upload\//.test(clean);

  const isPdf =
    type.includes("pdf") ||
    ext === "pdf" ||
    (/\/raw\/upload\//.test(clean) && clean.includes("pdf"));

  const isOffice =
    type.includes("word") ||
    type.includes("excel") ||
    type.includes("sheet") ||
    type.includes("officedocument") ||
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext);

  const kind = isImage ? "image" : isPdf ? "pdf" : isOffice ? "office" : "other";

  return { url, label: doc.label, kind };
};

const AuthorizeAdminDealer = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("summary");
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // ---- Rejection Reason Modal State ----
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");

  // ---- Document preview modal state ----
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewImageFailed, setPreviewImageFailed] = useState(false);

  // ---- Edit Modal State ----
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editOriginalStatus, setEditOriginalStatus] = useState("Pending");
  const [editRejectionError, setEditRejectionError] = useState("");
  const [editFiles, setEditFiles] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const fileInputRefs = {
    shopFrontPhoto: useRef(null),
    shopInteriorPhoto: useRef(null),
    gstCertificate: useRef(null),
    visitingCard: useRef(null),
  };

  // ---- Delete Modal State ----
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ---- Filter state ----
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(SummaryApi.authorizedAdminDealer.url, {
        method: SummaryApi.authorizedAdminDealer.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setApplications(result.data || []);
      } else {
        setError(result.message || "Failed to fetch dealer applications");
      }
    } catch (err) {
      console.error("Error fetching dealer applications:", err);
      setError("Something went wrong while fetching dealer applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Close modals on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewDoc(null);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setRejectModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (previewDoc || editModalOpen || deleteModalOpen || rejectModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewDoc, editModalOpen, deleteModalOpen, rejectModalOpen]);

  const userOptions = useMemo(
    () => ["All Users", ...new Set(applications.map((a) => a.proprietorName).filter(Boolean))],
    [applications]
  );

  const categoryOptions = useMemo(() => {
    const allCategories = applications.flatMap((a) => a.productCategories || []);
    return ["All Categories", ...new Set(allCategories.filter(Boolean))];
  }, [applications]);

  const statusOptions = ["All Status", "Pending", "Approved", "Rejected"];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (selectedUser !== "All Users" && app.proprietorName !== selectedUser) {
        return false;
      }
      if (
        selectedCategory !== "All Categories" &&
        !(app.productCategories || []).includes(selectedCategory)
      ) {
        return false;
      }
      if (selectedStatus !== "All Status" && (app.status || "Pending") !== selectedStatus) {
        return false;
      }
      const appDate = app.appliedDate || app.createdAt?.slice(0, 10);
      if (fromDate && appDate < fromDate) {
        return false;
      }
      if (toDate && appDate > toDate) {
        return false;
      }
      return true;
    });
  }, [applications, selectedUser, selectedCategory, selectedStatus, fromDate, toDate]);

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setView("details");
  };

  const handleClearFilters = () => {
    setSelectedUser("All Users");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Status");
    setFromDate("");
    setToDate("");
  };

  // ---- Status Dropdown Selection Handler ----
  const handleStatusSelect = (app, newStatus) => {
    if (!app?._id || !newStatus) return;

    if (newStatus === "Rejected") {
      setRejectTargetId(app._id);
      setRejectionReason(app.rejectionReason || "");
      setRejectionError("");
      setRejectModalOpen(true);
      return;
    }

    handleStatusChange(app._id, newStatus);
  };

  // ---- Status Update Handler ----
  const handleStatusChange = async (id, newStatus, reason = "") => {
    if (!id || !newStatus) return false;

    try {
      setStatusUpdatingId(id);
      const apiInfo = SummaryApi.updateDealerStatus(id);

      const payload =
        newStatus === "Rejected"
          ? { status: "Rejected", rejectionReason: reason }
          : { status: newStatus };

      const response = await fetch(apiInfo.url, {
        method: (apiInfo.method || "PATCH").toUpperCase(),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        const updatedDoc = result.data || payload;
        setApplications((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  ...updatedDoc,
                  status: updatedDoc.status || newStatus,
                  ...(newStatus === "Rejected"
                    ? { rejectionReason: updatedDoc.rejectionReason ?? reason }
                    : {}),
                }
              : item
          )
        );
        if (selectedApp && selectedApp._id === id) {
          setSelectedApp((prev) => ({
            ...prev,
            ...updatedDoc,
            status: updatedDoc.status || newStatus,
            ...(newStatus === "Rejected"
              ? { rejectionReason: updatedDoc.rejectionReason ?? reason }
              : {}),
          }));
        }

        if (newStatus === "Approved") {
          toast.success("Email sent successfully!");
        } else {
          toast.success(result.message || "Status updated successfully!");
        }
        return true;
      } else {
        toast.error(result.message || "Failed to update status");
        return false;
      }
    } catch (err) {
      console.error("Error updating dealer status:", err);
      toast.error("Something went wrong while updating status");
      return false;
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    const trimmedReason = rejectionReason.trim();
    if (!trimmedReason) {
      setRejectionError("Rejection reason is required.");
      return;
    }

    const success = await handleStatusChange(rejectTargetId, "Rejected", trimmedReason);
    if (success) {
      setRejectModalOpen(false);
      setRejectTargetId(null);
      setRejectionReason("");
      setRejectionError("");
    }
  };

  // ---- Open Edit Modal ----
  const handleOpenEdit = async (app) => {
    setEditError("");
    setEditRejectionError("");
    setEditFiles({});
    setEditOriginalStatus(app.status || "Pending");
    try {
      const apiInfo = SummaryApi.authorizedAdminDealerById
        ? SummaryApi.authorizedAdminDealerById(app._id)
        : null;

      if (apiInfo) {
        const response = await fetch(apiInfo.url, {
          method: apiInfo.method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const resData = await response.json();
        if (resData.success && resData.data) {
          setEditFormData(resData.data);
          setEditOriginalStatus(resData.data.status || "Pending");
        } else {
          setEditFormData({ ...app });
        }
      } else {
        setEditFormData({ ...app });
      }
    } catch (err) {
      console.warn("Failed to fetch fresh data for edit, using local copy:", err);
      setEditFormData({ ...app });
    }
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "status" && value !== "Rejected") {
      setEditRejectionError("");
    }
    if (name === "rejectionReason" && value.trim()) {
      setEditRejectionError("");
    }
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (key, e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFiles((prev) => ({ ...prev, [key]: file }));
    }
  };

  const handleRemoveFile = (key) => {
    setEditFiles((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    if (fileInputRefs[key]?.current) {
      fileInputRefs[key].current.value = "";
    }
  };

  // ---- Update Handler with Multipart FormData Support ----
  const handleUpdateApplication = async (e) => {
    e.preventDefault();
    if (!editFormData || !editFormData._id) return;

    const newStatus = editFormData.status || "Pending";
    const trimmedRejectionReason = (editFormData.rejectionReason || "").trim();

    if (newStatus === "Rejected" && !trimmedRejectionReason) {
      setEditRejectionError("Rejection reason is required when status is Rejected.");
      toast.error("Please enter a rejection reason.");
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");
      setEditRejectionError("");

      const statusChanged = newStatus !== editOriginalStatus;

      if (statusChanged) {
        const statusApi = SummaryApi.updateDealerStatus(editFormData._id);
        const statusPayload =
          newStatus === "Rejected"
            ? { status: "Rejected", rejectionReason: trimmedRejectionReason }
            : { status: newStatus };

        const statusRes = await fetch(statusApi.url, {
          method: (statusApi.method || "PATCH").toUpperCase(),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(statusPayload),
        });
        const statusResult = await statusRes.json();
        if (!statusResult.success) {
          const msg = statusResult.message || "Failed to update application status";
          setEditError(msg);
          toast.error(msg);
          return;
        }
      }

      const formData = new FormData();

      // Append text fields
      Object.keys(editFormData).forEach((key) => {
        if (key !== "documentSnapshot" && editFormData[key] !== null && editFormData[key] !== undefined) {
          if (Array.isArray(editFormData[key])) {
            editFormData[key].forEach((item) => formData.append(key, item));
          } else {
            formData.append(key, editFormData[key]);
          }
        }
      });

      // Append newly selected files
      Object.keys(editFiles).forEach((fileKey) => {
        if (editFiles[fileKey]) {
          formData.append(fileKey, editFiles[fileKey]);
        }
      });

      const apiInfo = SummaryApi.updateDealer(editFormData._id);
      const response = await fetch(apiInfo.url, {
        method: apiInfo.method,
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const updatedDoc = result.data || { ...editFormData };
        setApplications((prev) =>
          prev.map((item) => (item._id === editFormData._id ? { ...item, ...updatedDoc } : item))
        );
        if (selectedApp && selectedApp._id === editFormData._id) {
          setSelectedApp((prev) => ({ ...prev, ...updatedDoc }));
        }
        setEditModalOpen(false);
        toast.success(result.message || "Dealer application updated successfully!");
        if (statusChanged && newStatus === "Approved") {
          toast.success("Email sent successfully!");
        }
        fetchApplications();
      } else {
        const msg = result.message || "Failed to update application";
        setEditError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Error updating application:", err);
      const msg = "Something went wrong while updating";
      setEditError(msg);
      toast.error(msg);
    } finally {
      setEditLoading(false);
    }
  };

  // ---- Delete Handlers ----
  const handleOpenDelete = (id) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setDeleteLoading(true);
      const apiInfo = SummaryApi.deleteDealer(deleteTargetId);

      const response = await fetch(apiInfo.url, {
        method: apiInfo.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        setApplications((prev) => prev.filter((item) => item._id !== deleteTargetId));
        if (selectedApp && selectedApp._id === deleteTargetId) {
          setView("summary");
          setSelectedApp(null);
        }
        setDeleteModalOpen(false);
        toast.success(result.message || "Dealer application deleted successfully!");
      } else {
        toast.error(result.message || "Failed to delete application");
      }
    } catch (err) {
      console.error("Error deleting application:", err);
      toast.error("Something went wrong while deleting");
    } finally {
      setDeleteLoading(false);
      setDeleteTargetId(null);
    }
  };

  const downloadXLSX = () => {
    if (filteredApplications.length === 0) {
      toast.info("No applications to export.");
      return;
    }

    const rows = filteredApplications.map((app, index) => ({
      "S.No": index + 1,
      Status: app.status || "Pending",
      "Business Name": app.businessName || "N/A",
      "Owner Name": app.proprietorName || "N/A",
      "Contact Person": app.contactPerson || "N/A",
      Mobile: app.mobile || "N/A",
      WhatsApp: app.whatsapp || "N/A",
      Email: app.email || "N/A",
      "GST Number": app.gstNumber || "N/A",
      "PAN Number": app.panNumber || "N/A",
      "Business Type": app.businessType || "N/A",
      "Established Year": app.establishmentYear || "N/A",
      "Product Categories": (app.productCategories || []).join(", "),
      "Other Category": app.otherCategory || "N/A",
      "Brands Sold": app.brandsSold || "N/A",
      Experience: app.experience || "N/A",
      "Monthly Turnover": app.monthlyTurnover || "N/A",
      "Shop Ownership": app.shopOwnership || "N/A",
      "Shop Area": app.shopArea || "N/A",
      "Sales Staff": app.salesStaff || "N/A",
      "Home Delivery": app.homeDelivery || "N/A",
      "Interested Categories": (app.interestedCategories || []).join(", "),
      "Expected Purchase": app.expectedPurchase || "N/A",
      Address: app.address || "N/A",
      City: app.city || "N/A",
      District: app.district || "N/A",
      State: app.state || "N/A",
      "PIN Code": app.pinCode || "N/A",
      "Reason to Join": app.reason || "N/A",
      "Additional Info": app.additionalInfo || "N/A",
      "Created At": app.createdAt ? app.createdAt.slice(0, 10) : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dealer Applications");

    worksheet["!cols"] = Object.keys(rows[0]).map(() => ({ wch: 20 }));

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, "dealer-applications-" + today + ".xlsx");
  };

  return (
    <div className="mx-auto pb-8 p-1 md:p-4 text-gray-900">
      {view === "summary" ? (
        <>
          {/* Header Section */}
          <div className="bg-white py-3 px-4 sm:px-6 shadow-md flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center rounded-lg">
            <h2 className="font-bold text-lg sm:text-xl text-gray-900">All Dealer Applications</h2>
            <button
              className="border-2 border-brand-buttonSecondary text-brand-buttonSecondary hover:bg-brand-buttonSecondaryHover hover:text-white transition-all py-2 px-4 rounded-full text-sm font-semibold w-full sm:w-auto"
              onClick={downloadXLSX}
            >
              Export to Excel
            </button>
          </div>

          {/* Filter Section */}
          <div className="flex flex-wrap gap-3 mt-4">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-auto"
            >
              {userOptions.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-auto"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-auto"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="From Date*"
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-auto"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="To Date*"
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-auto"
            />

            {(selectedUser !== "All Users" ||
              selectedCategory !== "All Categories" ||
              selectedStatus !== "All Status" ||
              fromDate ||
              toDate) && (
              <button
                onClick={handleClearFilters}
                className="text-sm font-semibold text-brand-buttonSecondary hover:underline px-2"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg shadow-lg mt-4 -mx-1 sm:mx-0">
            <table className="w-full bg-white min-w-[750px]">
              <thead>
                <tr className="bg-brand-primary text-white">
                  <th className="border border-gray-200 px-4 py-2 text-center">S.No</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Mobile</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">Status</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center text-brand-textMuted">
                      Loading applications...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center text-brand-textMuted">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, index) => {
                    const statusText = app.status || "Pending";
                    return (
                      <tr key={app._id} className="hover:bg-gray-100 transition-colors">
                        <td className="border border-gray-200 px-4 py-2 text-center">{index + 1}</td>
                        <td className="border border-gray-200 px-4 py-2 font-medium">{app.proprietorName}</td>
                        <td className="border border-gray-200 px-4 py-2">{app.mobile}</td>
                        <td className="border border-gray-200 px-4 py-2 break-all">{app.email}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          <select
                            value={statusText}
                            disabled={statusUpdatingId === app._id}
                            onChange={(e) => handleStatusSelect(app, e.target.value)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 ${
                              STATUS_COLORS[statusText] || STATUS_COLORS.Pending
                            }`}
                          >
                            <option value="Pending" className="bg-white text-gray-900">Pending</option>
                            <option value="Approved" className="bg-white text-gray-900">Approved</option>
                            <option value="Rejected" className="bg-white text-gray-900">Rejected</option>
                          </select>
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(app)}
                              className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-600 hover:text-white transition-all"
                              title="View Details"
                            >
                              <IoMdEye size={18} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(app)}
                              className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                              title="Edit Application"
                            >
                              <MdEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(app._id)}
                              className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-600 hover:text-white transition-all"
                              title="Delete Application"
                            >
                              <MdDelete size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Detailed View */
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between border-b pb-4 mb-6">
            <button
              onClick={() => setView("summary")}
              className="flex items-center text-brand-primary hover:text-brand-primaryHover font-bold transition-all"
            >
              <IoMdArrowRoundBack className="mr-2" size={24} /> Back to Summary
            </button>
            <div className="flex items-center gap-3">
              <select
                value={selectedApp.status || "Pending"}
                disabled={statusUpdatingId === selectedApp._id}
                onChange={(e) => handleStatusSelect(selectedApp, e.target.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 ${
                  STATUS_COLORS[selectedApp.status || "Pending"] || STATUS_COLORS.Pending
                }`}
              >
                <option value="Pending" className="bg-white text-gray-900">Pending</option>
                <option value="Approved" className="bg-white text-gray-900">Approved</option>
                <option value="Rejected" className="bg-white text-gray-900">Rejected</option>
              </select>
              <button
                onClick={() => handleOpenEdit(selectedApp)}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white font-medium text-xs rounded transition-all"
              >
                <MdEdit size={16} /> Edit
              </button>
              <button
                onClick={() => handleOpenDelete(selectedApp._id)}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white font-medium text-xs rounded transition-all"
              >
                <MdDelete size={16} /> Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <p className="text-sm"><strong>Business Name:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.businessName || "N/A"}</span></p>
                <p className="text-sm"><strong>Owner Name:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.proprietorName || "N/A"}</span></p>
                <p className="text-sm"><strong>Contact Person:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.contactPerson || "N/A"}</span></p>
                <p className="text-sm"><strong>Mobile:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.mobile || "N/A"}</span></p>
                <p className="text-sm"><strong>WhatsApp:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.whatsapp || "N/A"}</span></p>
                <p className="text-sm break-all"><strong>Email:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.email || "N/A"}</span></p>
                <p className="text-sm"><strong>GST Number:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.gstNumber || "N/A"}</span></p>
                <p className="text-sm"><strong>PAN Number:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.panNumber || "N/A"}</span></p>
                <p className="text-sm"><strong>Business Type:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.businessType || "N/A"}</span></p>
                <p className="text-sm"><strong>Established Year:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.establishmentYear || "N/A"}</span></p>
                <p className="text-sm"><strong>Product Categories:</strong> <span className="text-brand-textMuted ml-1">{(selectedApp.productCategories || []).join(", ") || "N/A"}</span></p>
                {selectedApp.otherCategory && (
                  <p className="text-sm"><strong>Other Category:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.otherCategory}</span></p>
                )}
                <p className="text-sm"><strong>Brands Sold:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.brandsSold || "N/A"}</span></p>
                <p className="text-sm"><strong>Retail Experience:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.experience || "N/A"}</span></p>
                <p className="text-sm"><strong>Monthly Turnover:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.monthlyTurnover || "N/A"}</span></p>
                <p className="text-sm"><strong>Shop Ownership:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.shopOwnership || "N/A"}</span></p>
                <p className="text-sm"><strong>Shop Area:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.shopArea || "N/A"}</span></p>
                <p className="text-sm"><strong>Sales Staff:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.salesStaff || "N/A"}</span></p>
                <p className="text-sm"><strong>Home Delivery:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.homeDelivery || "N/A"}</span></p>
                <p className="text-sm"><strong>Interested Categories:</strong> <span className="text-brand-textMuted ml-1">{(selectedApp.interestedCategories || []).join(", ") || "N/A"}</span></p>
                <p className="text-sm"><strong>Expected Purchase:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.expectedPurchase || "N/A"}</span></p>
                <p className="text-sm"><strong>Status:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.status || "Pending"}</span></p>
              </div>

              {(selectedApp.status === "Rejected" || selectedApp.rejectionReason) && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <h4 className="font-bold text-sm text-red-700 mb-2 underline">Rejection Reason</h4>
                  <p className="text-sm text-red-600 leading-relaxed">
                    {selectedApp.rejectionReason || "N/A"}
                  </p>
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 mb-2 underline">Address</h4>
                <p className="text-sm text-brand-textMuted leading-relaxed">
                  {selectedApp.address || "N/A"}<br />
                  {selectedApp.city || "N/A"}, {selectedApp.district || "N/A"}, {selectedApp.state || "N/A"}<br />
                  <span className="font-semibold text-gray-900">{selectedApp.pinCode || ""}</span>
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 mb-2 underline">Reason to Join</h4>
                <p className="text-sm text-brand-textMuted leading-relaxed">{selectedApp.reason || "N/A"}</p>
              </div>

              {selectedApp.additionalInfo && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <h4 className="font-bold text-sm text-gray-900 mb-2 underline">Additional Information</h4>
                  <p className="text-sm text-brand-textMuted leading-relaxed">{selectedApp.additionalInfo}</p>
                </div>
              )}
            </div>

            {/* Right: files */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg h-fit lg:sticky lg:top-4">
              <h3 className="font-bold text-lg text-gray-900 border-b border-gray-200 pb-2 mb-4">Uploaded Files</h3>
              <div className="space-y-4">
                {FILE_FIELDS.map(({ key, label }) => {
                  const doc = extractDoc(selectedApp, key);
                  const resolved = resolveDoc(doc);

                  return (
                    <div key={key}>
                      <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
                      {!resolved ? (
                        <p className="text-sm text-brand-textMuted italic">Not uploaded</p>
                      ) : resolved.kind === "image" ? (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ ...resolved, label })}
                          className="block w-fit"
                        >
                          <img
                            src={resolved.url}
                            alt={label}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ ...resolved, label })}
                          className="text-sm underline text-brand-buttonSecondary"
                        >
                          View Document
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Rejection Reason Modal ---- */}
      {rejectModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 pt-16 md:pt-20"
          onClick={() => setRejectModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Reject Application</h3>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <IoMdClose size={22} />
              </button>
            </div>
            <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Rejection Reason <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (e.target.value.trim()) {
                      setRejectionError("");
                    }
                  }}
                  placeholder="Enter reason for rejecting this application..."
                  className={`w-full border rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    rejectionError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {rejectionError && (
                  <p className="text-xs text-red-600 mt-1">{rejectionError}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusUpdatingId === rejectTargetId}
                  className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {statusUpdatingId === rejectTargetId ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Document Preview Modal ---- */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 pt-16 md:pt-20 overflow-y-auto"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">{previewDoc.label}</h3>
              <div className="flex items-center gap-3">
                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline text-brand-buttonSecondary"
                >
                  Open in new tab
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <IoMdClose size={22} />
                </button>
              </div>
            </div>

            <div
              className={`flex-1 bg-gray-100 ${
                previewDoc.kind === "pdf" || previewDoc.kind === "office"
                  ? "overflow-y-auto overflow-x-hidden p-0"
                  : "overflow-auto flex items-center justify-center p-4"
              }`}
            >
              {previewDoc.kind === "image" || (previewDoc.kind === "other" && !previewImageFailed) ? (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.label}
                  className="max-w-full max-h-full object-contain rounded"
                  onError={() => setPreviewImageFailed(true)}
                />
              ) : previewDoc.kind === "pdf" ? (
                <iframe
                  src={previewDoc.url}
                  title={previewDoc.label}
                  className="w-full h-full bg-white border-0"
                />
              ) : previewDoc.kind === "office" ? (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    previewDoc.url
                  )}`}
                  title={previewDoc.label}
                  className="w-full h-full bg-white border-0"
                />
              ) : (
                <div className="text-center text-sm text-brand-textMuted p-8">
                  <p className="mb-3">Preview not available for this file type.</p>
                  <a
                    href={previewDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-brand-buttonSecondary font-semibold"
                  >
                    Open document in new tab
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- Edit Dealer Modal (With Full Fields & File Upload) ---- */}
      {editModalOpen && editFormData && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 pt-16 md:pt-20 overflow-y-auto"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Edit Dealer Application</h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateApplication} className="flex-1 overflow-y-auto p-6 space-y-6">
              {editError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {editError}
                </div>
              )}

              {/* Status Header */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-1">Application Status</label>
                  <select
                    name="status"
                    value={editFormData.status || "Pending"}
                    onChange={handleEditChange}
                    className="w-full sm:w-64 border border-gray-300 rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {editFormData.status === "Rejected" && (
                  <div>
                    <label className="block text-sm font-bold text-blue-900 mb-1">
                      Rejection Reason <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="rejectionReason"
                      rows={3}
                      value={editFormData.rejectionReason || ""}
                      onChange={handleEditChange}
                      placeholder="Enter reason for rejecting this application..."
                      className={`w-full border rounded-md p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                        editRejectionError ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {editRejectionError && (
                      <p className="text-xs text-red-600 mt-1">{editRejectionError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* INITIAL / BASIC INFORMATION */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 border-b pb-2 mb-3">Applicant &amp; Location Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Owner / Proprietor Name *</label>
                    <input
                      type="text"
                      name="proprietorName"
                      value={editFormData.proprietorName || ""}
                      onChange={handleEditChange}
                      required
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email ID *</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email || ""}
                      onChange={handleEditChange}
                      required
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      name="mobile"
                      value={editFormData.mobile || ""}
                      onChange={handleEditChange}
                      required
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={editFormData.city || ""}
                      onChange={handleEditChange}
                      required
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={editFormData.state || ""}
                      onChange={handleEditChange}
                      required
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 1 - BUSINESS INFORMATION */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 border-b pb-2 mb-3">Section 1 – Business Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={editFormData.businessName || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={editFormData.contactPerson || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={editFormData.whatsapp || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      name="district"
                      value={editFormData.district || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={editFormData.pinCode || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Business Type</label>
                    <select
                      name="businessType"
                      value={editFormData.businessType || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select Business Type</option>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Private Limited">Private Limited</option>
                      <option value="LLP">LLP</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Establishment Year</label>
                    <input
                      type="text"
                      name="establishmentYear"
                      value={editFormData.establishmentYear || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">GST Number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={editFormData.gstNumber || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={editFormData.panNumber || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      rows={2}
                      value={editFormData.address || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2 - BUSINESS PROFILE */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 border-b pb-2 mb-3">Section 2 – Business Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Experience</label>
                    <select
                      name="experience"
                      value={editFormData.experience || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select Experience</option>
                      <option value="Less than 1 Year">Less than 1 Year</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5-10 Years">5-10 Years</option>
                      <option value="More than 10 Years">More than 10 Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Brands Sold</label>
                    <input
                      type="text"
                      name="brandsSold"
                      value={editFormData.brandsSold || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Monthly Turnover</label>
                    <select
                      name="monthlyTurnover"
                      value={editFormData.monthlyTurnover || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select Monthly Turnover</option>
                      <option value="Below 2 Lakhs">Below 2 Lakhs</option>
                      <option value="2-5 Lakhs">2-5 Lakhs</option>
                      <option value="5-10 Lakhs">5-10 Lakhs</option>
                      <option value="Above 10 Lakhs">Above 10 Lakhs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Other Category</label>
                    <input
                      type="text"
                      name="otherCategory"
                      value={editFormData.otherCategory || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>

                  {/* Product Categories Checkboxes */}
                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Product Categories
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      {[
                        "Home Appliances",
                        "Kitchen Appliances",
                        "Electronics",
                        "Electrical Products",
                        "Consumer Durables",
                        "Others",
                      ].map((category) => {
                        const isChecked = (editFormData.productCategories || []).includes(category);
                        return (
                          <label
                            key={category}
                            className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer hover:text-black"
                          >
                            <input
                              type="checkbox"
                              name="productCategories"
                              value={category}
                              checked={isChecked}
                              onChange={(e) => {
                                const current = editFormData.productCategories || [];
                                const updated = e.target.checked
                                  ? [...current, category]
                                  : current.filter((item) => item !== category);
                                setEditFormData((prev) => ({
                                  ...prev,
                                  productCategories: updated,
                                }));
                              }}
                              className="accent-brand-primary w-4 h-4 rounded"
                            />
                            {category}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3 - SHOP DETAILS */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 border-b pb-2 mb-3">Section 3 – Shop Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Shop Ownership</label>
                    <select
                      name="shopOwnership"
                      value={editFormData.shopOwnership || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select Ownership</option>
                      <option value="Owned">Owned</option>
                      <option value="Rented">Rented</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Shop Area (Sq. Ft.)</label>
                    <input
                      type="text"
                      name="shopArea"
                      value={editFormData.shopArea || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Sales Staff</label>
                    <input
                      type="number"
                      name="salesStaff"
                      value={editFormData.salesStaff || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Home Delivery</label>
                    <select
                      name="homeDelivery"
                      value={editFormData.homeDelivery || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Expected Purchase</label>
                    <select
                      name="expectedPurchase"
                      value={editFormData.expectedPurchase || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="">Select Range</option>
                      <option value="Below 1 Lakh">Below 1 Lakh</option>
                      <option value="1-3 Lakhs">1-3 Lakhs</option>
                      <option value="3-5 Lakhs">3-5 Lakhs</option>
                      <option value="Above 5 Lakhs">Above 5 Lakhs</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4 - UPLOAD / REPLACE DOCUMENTS */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 border-b pb-2 mb-3">Upload / Replace Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {FILE_FIELDS.map(({ key, label }) => {
                    const doc = extractDoc(editFormData, key);
                    const existingUrl = doc?.url;
                    const newFile = editFiles[key];

                    return (
                      <div key={key} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-semibold text-gray-800 mb-1">{label}</p>
                          {existingUrl && !newFile && (
                            <p className="text-[11px] text-green-700 font-medium mb-2">
                              ✓ Current File Available
                            </p>
                          )}
                          {newFile && (
                            <p className="text-[11px] text-blue-700 font-medium mb-2 truncate">
                              📁 {newFile.name}
                            </p>
                          )}
                          {!existingUrl && !newFile && (
                            <p className="text-[11px] text-gray-400 italic mb-2">Not Uploaded</p>
                          )}
                        </div>

                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRefs[key]}
                          onChange={(e) => handleFileSelect(key, e)}
                          className="hidden"
                          accept="image/*,.pdf"
                        />

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 mt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRefs[key]?.current?.click()}
                            className="flex items-center gap-1 text-xs py-1 px-2.5 rounded bg-brand-primary text-white hover:bg-brand-primaryHover transition-colors"
                          >
                            <MdCloudUpload size={14} />
                            {existingUrl || newFile ? "Replace" : "Upload"}
                          </button>

                          {newFile && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(key)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Cancel
                            </button>
                          )}

                          {existingUrl && !newFile && (
                            <button
                              type="button"
                              onClick={() => setPreviewDoc({ url: existingUrl, kind: "image", label })}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5 - ADDITIONAL INFORMATION */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 border-b pb-2 mb-3">Section 5 – Additional Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Reason to Join</label>
                    <textarea
                      name="reason"
                      rows={2}
                      value={editFormData.reason || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Additional Information</label>
                    <textarea
                      name="additionalInfo"
                      rows={2}
                      value={editFormData.additionalInfo || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primaryHover rounded-lg transition-colors disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Delete Confirmation Modal ---- */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 pt-16 md:pt-20"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <MdDelete size={28} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Delete Application</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete this dealer application? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizeAdminDealer;