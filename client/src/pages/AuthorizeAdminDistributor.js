import React, { useState, useMemo, useEffect } from "react";
import { IoMdArrowRoundBack, IoMdEye, IoMdClose } from "react-icons/io";
import * as XLSX from "xlsx";
import SummaryApi from "../../src/common/index";

const FILE_FIELDS = [
  { key: "gstCertificate", label: "GST Certificate" },
  { key: "shopPhoto", label: "Shop Photo" },
  { key: "warehousePhoto", label: "Warehouse Photo" },
  { key: "visitingCard", label: "Visiting Card" },
];

// Works out what kind of file this is, and returns everything the
// preview modal needs to render it correctly - regardless of whether
// the backend `type` field is missing/wrong, or the URL has no extension
// (common with Cloudinary links).
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

const AuthorizeAdminDistributor = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("summary");
  const [selectedApp, setSelectedApp] = useState(null);

  // ---- Document preview modal state ----
  const [previewDoc, setPreviewDoc] = useState(null); // { url, kind: 'image'|'pdf'|'office'|'other', label } | null
  const [previewImageFailed, setPreviewImageFailed] = useState(false);

  const [selectedUser, setSelectedUser] = useState("All Users");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(SummaryApi.authorizeAdminDistributor.url, {
        method: SummaryApi.authorizeAdminDistributor.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setApplications(result.data || []);
      } else {
        setError(result.message || "Failed to fetch distributor applications");
      }
    } catch (err) {
      console.error("Error fetching distributor applications:", err);
      setError("Something went wrong while fetching distributor applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Close modal on ESC key + lock background scroll while open
  useEffect(() => {
    if (!previewDoc) return;
    setPreviewImageFailed(false);
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setPreviewDoc(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewDoc]);

  const userOptions = useMemo(
    () => ["All Users", ...new Set(applications.map((a) => a.proprietorName))],
    [applications]
  );

  const categoryOptions = useMemo(() => {
    const allCategories = applications.flatMap((a) => a.productCategories || []);
    return ["All Categories", ...new Set(allCategories)];
  }, [applications]);

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
      if (fromDate && app.createdAt && app.createdAt.slice(0, 10) < fromDate) {
        return false;
      }
      if (toDate && app.createdAt && app.createdAt.slice(0, 10) > toDate) {
        return false;
      }
      return true;
    });
  }, [applications, selectedUser, selectedCategory, fromDate, toDate]);

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setView("details");
  };

  const handleClearFilters = () => {
    setSelectedUser("All Users");
    setSelectedCategory("All Categories");
    setFromDate("");
    setToDate("");
  };

  const downloadXLSX = () => {
    if (filteredApplications.length === 0) {
      alert("No applications to export.");
      return;
    }

    const rows = filteredApplications.map((app, index) => ({
      "S.No": index + 1,
      "Business Name": app.businessName,
      "Owner Name": app.proprietorName,
      "Contact Person": app.contactPerson,
      Mobile: app.mobile,
      WhatsApp: app.whatsapp,
      Email: app.email,
      "GST Number": app.gstNumber,
      "PAN Number": app.panNumber,
      "Business Type": app.businessType,
      "Established Year": app.establishmentYear,
      "Product Categories": (app.productCategories || []).join(", "),
      "Distributed Brands": app.distributedBrands,
      Experience: app.experience,
      "Monthly Turnover": app.monthlyTurnover,
      "Coverage Areas": app.coverageAreas,
      "Sales Executives": app.salesExecutives,
      "Delivery Vehicles": app.deliveryVehicles,
      "Warehouse Available": app.warehouseAvailable ? "Yes" : "No",
      "Warehouse Size": app.warehouseSize,
      "Dealers Count": app.dealersCount,
      "Expected Purchase": app.expectedPurchase,
      "Investment Capacity": app.investmentCapacity,
      Address: app.address,
      City: app.city,
      District: app.district,
      State: app.state,
      "PIN Code": app.pinCode,
      "Reason to Join": app.reason,
      "Additional Comments": app.additionalComments,
      Status: app.status,
      "Created At": app.createdAt ? app.createdAt.slice(0, 10) : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Distributor Applications");

    worksheet["!cols"] = Object.keys(rows[0]).map(() => ({ wch: 20 }));

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, "distributor-applications-" + today + ".xlsx");
  };

  return (
    <div className="mx-auto pb-8 p-1 md:p-4 text-gray-900">
      {view === "summary" ? (
        <>
          {/* Header Section */}
          <div className="bg-white py-3 px-4 sm:px-6 shadow-md flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center rounded-lg">
            <h2 className="font-bold text-lg sm:text-xl text-gray-900">All Distributor Applications</h2>
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
            <table className="w-full bg-white min-w-[560px]">
              <thead>
                <tr className="bg-brand-primary text-white">
                  <th className="border border-gray-200 px-4 py-2">S.No</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Mobile</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-brand-textMuted">
                      Loading applications...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-brand-textMuted">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, index) => (
                    <tr key={app._id} className="hover:bg-gray-100 transition-colors">
                      <td className="border border-gray-200 px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2 font-medium">{app.proprietorName}</td>
                      <td className="border border-gray-200 px-4 py-2">{app.mobile}</td>
                      <td className="border border-gray-200 px-4 py-2 break-all">{app.email}</td>
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        <button
                          onClick={() => handleViewDetails(app)}
                          className="p-2 bg-green-100 text-brand-buttonAccent rounded-full hover:bg-brand-buttonAccentHover hover:text-white transition-all"
                          title="View Details"
                        >
                          <IoMdEye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
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
            <h2 className="text-lg sm:text-xl font-bold">Distributor Application Details</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <p className="text-sm"><strong>Business Name:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.businessName}</span></p>
                <p className="text-sm"><strong>Owner Name:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.proprietorName}</span></p>
                <p className="text-sm"><strong>Contact Person:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.contactPerson}</span></p>
                <p className="text-sm"><strong>Mobile:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.mobile}</span></p>
                <p className="text-sm"><strong>WhatsApp:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.whatsapp}</span></p>
                <p className="text-sm break-all"><strong>Email:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.email}</span></p>
                <p className="text-sm"><strong>GST Number:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.gstNumber}</span></p>
                <p className="text-sm"><strong>PAN Number:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.panNumber}</span></p>
                <p className="text-sm"><strong>Business Type:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.businessType}</span></p>
                <p className="text-sm"><strong>Established Year:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.establishmentYear}</span></p>
                <p className="text-sm"><strong>Product Categories:</strong> <span className="text-brand-textMuted ml-1">{(selectedApp.productCategories || []).join(", ")}</span></p>
                <p className="text-sm"><strong>Distributed Brands:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.distributedBrands}</span></p>
                <p className="text-sm"><strong>Experience:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.experience}</span></p>
                <p className="text-sm"><strong>Monthly Turnover:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.monthlyTurnover}</span></p>
                <p className="text-sm"><strong>Coverage Areas:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.coverageAreas}</span></p>
                <p className="text-sm"><strong>Sales Executives:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.salesExecutives}</span></p>
                <p className="text-sm"><strong>Delivery Vehicles:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.deliveryVehicles}</span></p>
                <p className="text-sm"><strong>Warehouse Available:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.warehouseAvailable ? "Yes" : "No"}</span></p>
                <p className="text-sm"><strong>Warehouse Size:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.warehouseSize}</span></p>
                <p className="text-sm"><strong>Dealers Count:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.dealersCount}</span></p>
                <p className="text-sm"><strong>Expected Purchase:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.expectedPurchase}</span></p>
                <p className="text-sm"><strong>Investment Capacity:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.investmentCapacity}</span></p>
                <p className="text-sm"><strong>Status:</strong> <span className="text-brand-textMuted ml-1">{selectedApp.status}</span></p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 mb-2 underline">Address</h4>
                <p className="text-sm text-brand-textMuted leading-relaxed">
                  {selectedApp.address}<br />
                  {selectedApp.city}, {selectedApp.district}, {selectedApp.state}<br />
                  <span className="font-semibold text-gray-900">{selectedApp.pinCode}</span>
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 mb-2 underline">Reason to Join</h4>
                <p className="text-sm text-brand-textMuted leading-relaxed">{selectedApp.reason}</p>
              </div>

              {selectedApp.additionalComments && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <h4 className="font-bold text-sm text-gray-900 mb-2 underline">Additional Comments</h4>
                  <p className="text-sm text-brand-textMuted leading-relaxed">{selectedApp.additionalComments}</p>
                </div>
              )}
            </div>

            {/* Right: files - bound to documentSnapshot from backend */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg h-fit lg:sticky lg:top-4">
              <h3 className="font-bold text-lg text-gray-900 border-b border-gray-200 pb-2 mb-4">Uploaded Files</h3>
              <div className="space-y-4">
                {(() => {
                  const docs = selectedApp.documentSnapshot?.[0] || {};

                  return FILE_FIELDS.map(({ key, label }) => {
                    const doc = docs[key];
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
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Document Preview Modal ---- */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-[999] flex items-start justify-center bg-black/70 p-4 pt-20 sm:pt-24 overflow-y-auto"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
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

            {/* Modal body */}
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
    </div>
  );
};

export default AuthorizeAdminDistributor;