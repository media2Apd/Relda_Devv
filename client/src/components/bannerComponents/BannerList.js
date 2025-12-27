// import React, { useEffect, useState } from "react";
// import SummaryApi from "../../common";
// import { toast } from "react-toastify";

// const BannerList = () => {
//     const [banners, setBanners] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editBanner, setEditBanner] = useState(null);

//     const [form, setForm] = useState({
//         title: "",
//         link: "",
//         order: 1,
//         position: "home-top",
//     });

//     const [desktop, setDesktop] = useState(null);
//     const [mobile, setMobile] = useState(null);
//     const [previewDesktop, setPreviewDesktop] = useState(null);
//     const [previewMobile, setPreviewMobile] = useState(null);

//     const openAddModal = () => {
//         setEditBanner(null);
//         setForm({
//             title: "",
//             link: "",
//             order: 1,
//             position: "home-top",
//         });
//         setDesktop(null);
//         setMobile(null);
//         setPreviewDesktop(null);
//         setPreviewMobile(null);
//         setIsModalOpen(true);
//     };

//     const openEditModal = (banner) => {
//         setEditBanner(banner);
//         setForm({
//             title: banner.title || "",
//             link: banner.link || "",
//             order: banner.order || 1,
//             position: banner.position,
//         });
//         setPreviewDesktop(banner.desktopImage);
//         setPreviewMobile(banner.mobileImage);
//         setIsModalOpen(true);
//     };

//     const submitBanner = async () => {
//         if (!editBanner && (!desktop || !mobile)) {
//             toast.error("Upload both desktop & mobile images");
//             return;
//         }

//         const formData = new FormData();
//         Object.entries(form).forEach(([k, v]) => formData.append(k, v));

//         if (desktop) formData.append("desktop", desktop);
//         if (mobile) formData.append("mobile", mobile);

//         const api = editBanner
//             ? SummaryApi.updateBanner(editBanner._id)
//             : SummaryApi.createBanner;

//         const res = await fetch(api.url, {
//             method: api.method,
//             credentials: "include",
//             body: formData,
//         });

//         const data = await res.json();
//         if (data.success) {
//             toast.success(editBanner ? "Banner updated" : "Banner created");
//             setIsModalOpen(false);
//             fetchBanners();
//         } else {
//             toast.error(data.message);
//         }
//     };

//     const fetchBanners = async () => {
//         try {
//             const res = await fetch(SummaryApi.getAllBannersAdmin.url, {
//                 credentials: "include",
//             });
//             const data = await res.json();
//             if (data.success) setBanners(data.data);
//         } catch {
//             toast.error("Failed to load banners");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBanners();
//     }, []);

//     const toggleBanner = async (id) => {
//         await fetch(SummaryApi.toggleBannerStatus(id).url, {
//             method: "PATCH",
//             credentials: "include",
//         });
//         fetchBanners();
//     };

//     const deleteBanner = async (id) => {
//         if (!window.confirm("Delete this banner?")) return;
//         await fetch(SummaryApi.deleteBanner(id).url, {
//             method: "DELETE",
//             credentials: "include",
//         });
//         toast.success("Banner deleted");
//         fetchBanners();
//     };

//     if (loading) return <p>Loading...</p>;

//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Banner Management</h2>
//                 <button
//                     onClick={openAddModal}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded"
//                 >
//                     + Add Banner
//                 </button>
//             </div>

//             <table className="w-full border">
//                 <thead>
//                     <tr className="bg-gray-100">
//                         <th>Preview</th>
//                         <th>Position</th>
//                         <th>Link</th>
//                         <th>Order</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {banners.map((b) => (
//                         <tr key={b._id} className="border-t text-center">
//                             <td>
//                                 <img
//                                     src={b.desktopImage}
//                                     alt={b.title || "banner"}
//                                     className="h-16 mx-auto" />
//                             </td>
//                             <td>{b.position}</td>
//                             <td className="truncate max-w-xs">{b.link}</td>
//                             <td>{b.order}</td>
//                             <td>
//                                 <button
//                                     onClick={() => toggleBanner(b._id)}
//                                     className={`px-2 py-1 rounded ${b.isActive ? "bg-green-500" : "bg-gray-400"
//                                         } text-white`}
//                                 >
//                                     {b.isActive ? "Active" : "Inactive"}
//                                 </button>
//                             </td>
//                             <td className="space-x-2">
//                                 <button
//                                     onClick={() => openEditModal(b)}
//                                     className="bg-blue-500 text-white px-2 py-1 rounded"
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => deleteBanner(b._id)}
//                                     className="bg-red-500 text-white px-2 py-1 rounded"
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white p-6 rounded-xl w-full max-w-md">
//                         <h2 className="text-lg font-bold mb-4">
//                             {editBanner ? "Edit Banner" : "Add Banner"}
//                         </h2>

//                         <input
//                             className="input mb-2"
//                             placeholder="Title"
//                             value={form.title}
//                             onChange={(e) => setForm({ ...form, title: e.target.value })}
//                         />

//                         <select
//                             className="input mb-2"
//                             value={form.position}
//                             onChange={(e) => setForm({ ...form, position: e.target.value })}
//                         >
//                             <option value="home-top">Home Top</option>
//                             <option value="home-bottom">Home Bottom</option>
//                         </select>

//                         <input
//                             className="input mb-2"
//                             placeholder="Redirect Link"
//                             value={form.link}
//                             onChange={(e) => setForm({ ...form, link: e.target.value })}
//                         />

//                         <input
//                             type="number"
//                             className="input mb-2"
//                             placeholder="Order"
//                             value={form.order}
//                             onChange={(e) => setForm({ ...form, order: e.target.value })}
//                         />

//                         <label className="block text-sm mt-2">Desktop Image</label>
//                         <input
//                             type="file"
//                             onChange={(e) => {
//                                 setDesktop(e.target.files[0]);
//                                 setPreviewDesktop(URL.createObjectURL(e.target.files[0]));
//                             }}
//                         />
//                         {previewDesktop && 
//                         <img 
//                             src={previewDesktop}
//                             alt="Desktop Preview"
//                             className="h-20 mt-2" />}

//                         <label className="block text-sm mt-2">Mobile Image</label>
//                         <input
//                             type="file"
//                             onChange={(e) => {
//                                 setMobile(e.target.files[0]);
//                                 setPreviewMobile(URL.createObjectURL(e.target.files[0]));
//                             }}
//                         />
//                         {previewMobile && 
//                         <img 
//                             src={previewMobile}
//                             alt="Mobile Preview"
//                             className="h-20 mt-2" />}

//                         <div className="flex gap-3 mt-6">
//                             <button
//                                 onClick={() => setIsModalOpen(false)}
//                                 className="flex-1 bg-gray-200 py-2 rounded"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={submitBanner}
//                                 className="flex-1 bg-indigo-600 text-white py-2 rounded"
//                             >
//                                 {editBanner ? "Update" : "Create"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BannerList;


import React, { useEffect, useState } from "react";
import SummaryApi from "../../common";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import {
    DndContext,
    closestCenter
} from "@dnd-kit/core";

import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const SortableRow = ({ banner, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: banner._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <tr ref={setNodeRef} style={style} {...attributes}>
            {/* Drag Handle */}
            <td className="px-2 cursor-grab text-center" {...listeners}>
                ⠿
            </td>
            {children}
        </tr>
    );
};



const BannerList = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editBanner, setEditBanner] = useState(null);

    const [form, setForm] = useState({
        title: "",
        link: "",
        order: 1,
        position: "home-top",
    });

    const [desktop, setDesktop] = useState(null);
    const [mobile, setMobile] = useState(null);
    const [previewDesktop, setPreviewDesktop] = useState(null);
    const [previewMobile, setPreviewMobile] = useState(null);
    const [activePosition, setActivePosition] = useState("home-top");


    /* ---------------- FETCH BANNERS ---------------- */
    const fetchBanners = async () => {
        try {
            const res = await fetch(SummaryApi.getAllBannersAdmin.url, {
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) setBanners(data.data);
        } catch {
            toast.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    /* ---------------- MODAL HANDLERS ---------------- */
    const openAddModal = () => {
        setEditBanner(null);
        setForm({
            title: "",
            link: "",
            order: 1,
            position: "home-top",
        });
        setDesktop(null);
        setMobile(null);
        setPreviewDesktop(null);
        setPreviewMobile(null);
        setIsModalOpen(true);
    };

    const openEditModal = (banner) => {
        setEditBanner(banner);
        setForm({
            title: banner.title || "",
            link: banner.link || "",
            order: banner.order || 1,
            position: banner.position,
        });
        setPreviewDesktop(banner.desktopImage);
        setPreviewMobile(banner.mobileImage);
        setIsModalOpen(true);
    };

    /* ---------------- CREATE / UPDATE ---------------- */
    const submitBanner = async () => {
        if (!editBanner && (!desktop || !mobile)) {
            toast.error("Upload both Desktop & Mobile images");
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        if (desktop) formData.append("desktop", desktop);
        if (mobile) formData.append("mobile", mobile);

        const api = editBanner
            ? SummaryApi.updateBanner(editBanner._id)
            : SummaryApi.createBanner;

        const res = await fetch(api.url, {
            method: api.method,
            credentials: "include",
            body: formData,
        });

        const data = await res.json();
        if (data.success) {
            toast.success(editBanner ? "Banner updated" : "Banner created");
            setIsModalOpen(false);
            fetchBanners();
        } else {
            toast.error(data.message);
        }
    };

    /* ---------------- ACTIONS ---------------- */
    // const toggleBanner = async (id) => {
    //     await fetch(SummaryApi.toggleBannerStatus(id).url, {
    //         method: "PATCH",
    //         credentials: "include",
    //     });
    //     fetchBanners();
    // };
    const toggleBanner = async (id) => {
        const res = await fetch(SummaryApi.toggleBannerStatus(id).url, {
            method: "PATCH",
            credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
            toast.success("Banner status updated");
            fetchBanners();
        } else {
            toast.error("Failed to update status");
        }
    };


    const deleteBanner = async (id) => {
        if (!window.confirm("Delete this banner?")) return;
        await fetch(SummaryApi.deleteBanner(id).url, {
            method: "DELETE",
            credentials: "include",
        });
        toast.success("Banner deleted");
        fetchBanners();
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const filtered = banners.filter(b => b.position === activePosition);

        const oldIndex = filtered.findIndex(b => b._id === active.id);
        const newIndex = filtered.findIndex(b => b._id === over.id);

        const reordered = arrayMove(filtered, oldIndex, newIndex);

        // update local UI instantly
        const updated = banners.map(b => {
            const index = reordered.findIndex(r => r._id === b._id);
            return index !== -1 ? { ...b, order: index + 1 } : b;
        });

        setBanners(updated);

        // persist order to backend
        await fetch(SummaryApi.updateBannerOrder.url, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                position: activePosition,
                orders: reordered.map((b, i) => ({
                    id: b._id,
                    order: i + 1
                }))
            })
        });
        fetchBanners();
    };


    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4 min-h-screen">
            {/* ---------- HEADER ---------- */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-bold text-gray-900">Banner Management</h2>
                <button
                    onClick={openAddModal}
                    className="bg-[#e60000] hover:bg-[#cc0000] text-white px-4 py-2 rounded-md font-medium"
                >
                    + Add Banner
                </button>
            </div>

            <div className="flex gap-3 mb-4">
                {["home-top", "home-bottom"].map((pos) => (
                    <button
                        key={pos}
                        onClick={() => setActivePosition(pos)}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition
                            ${activePosition === pos
                                ? "bg-[#e60000] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                        {pos === "home-top" ? "Home Top" : "Home Bottom"}
                    </button>
                ))}
            </div>


            {/* ---------- TABLE ---------- */}
            <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-xs uppercase text-brand-textMuted">
                        <tr>
                            <th className="px-2 py-3 text-center">Move</th>
                            <th className="px-4 py-3">Preview</th>
                            <th className="px-4 py-3">Position</th>
                            <th className="px-4 py-3">Link</th>
                            <th className="px-4 py-3 text-center">Order</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    {/* <tbody className="divide-y">
                        {banners
                           .filter(b => b.position === activePosition)
                           .map((b, index) => (
                            <tr key={b._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <img
                                        src={b.desktopImage}
                                        alt="Desktop Preview"
                                        className="h-12 mx-auto rounded" />
                                </td>
                                <td className="px-4 py-3">{b.position}</td>
                                <td className="px-4 py-3 truncate max-w-xs">{b.link}</td>
                                <td className="px-4 py-3 text-center">{b.order}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => toggleBanner(b._id)}
                                        className={`px-2 py-1 rounded text-white text-xs ${b.isActive ? "bg-[#e60000]" : "bg-gray-400"
                                            }`}
                                    >
                                        {b.isActive ? "Active" : "Inactive"}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => openEditModal(b)}
                                            className="p-2 bg-green-100 text-brand-buttonAccent rounded-md hover:bg-brand-buttonAccentHover hover:text-white"
                                        >
                                            <MdModeEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteBanner(b._id)}
                                            className="p-2 bg-red-100 text-brand-primary rounded-md hover:bg-brand-primaryHover hover:text-white"
                                        >
                                            <MdDelete size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody> */}
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={banners
                                .filter(b => b.position === activePosition)
                                .map(b => b._id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <tbody className="divide-y">
                                {banners
                                    .filter(b => b.position === activePosition)
                                    .map((b) => (
                                        <SortableRow key={b._id} banner={b}>
                                            <td className="px-4 py-3">
                                                <img
                                                    src={b.desktopImage}
                                                    alt="Desktop Preview"
                                                    className="h-12 mx-auto rounded" />
                                            </td>
                                            <td className="px-4 py-3">{b.position}</td>
                                            <td className="px-4 py-3 truncate max-w-xs">{b.link}</td>
                                            <td className="px-4 py-3 text-center">{b.order}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleBanner(b._id) }}
                                                    className={`px-2 py-1 rounded text-white text-xs ${b.isActive ? "bg-[#e60000]" : "bg-gray-400"
                                                        }`}
                                                >
                                                    {b.isActive ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openEditModal(b) }}
                                                        className="p-2 bg-green-100 text-brand-buttonAccent rounded-md hover:bg-brand-buttonAccentHover hover:text-white"
                                                    >
                                                        <MdModeEdit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteBanner(b._id) }}
                                                        className="p-2 bg-red-100 text-brand-primary rounded-md hover:bg-brand-primaryHover hover:text-white"
                                                    >
                                                        <MdDelete size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </SortableRow>
                                    ))}
                            </tbody>
                        </SortableContext>
                    </DndContext>
                </table>
            </div>

            {/* ---------- MODAL ---------- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-6">
                            {editBanner ? "Edit Banner" : "Add Banner"}
                        </h3>

                        {/* Inputs */}
                        <div className="space-y-4">
                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />

                            <select
                                className="w-full p-2 border rounded"
                                value={form.position}
                                onChange={(e) => setForm({ ...form, position: e.target.value })}
                            >
                                <option value="home-top">Home Top</option>
                                <option value="home-bottom">Home Bottom</option>
                            </select>

                            <input
                                className="w-full p-2 border rounded"
                                placeholder="Redirect Link"
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
                            />

                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                placeholder="Order"
                                value={form.order}
                                onChange={(e) => setForm({ ...form, order: e.target.value })}
                            />

                            {/* Desktop */}
                            <label className="text-sm font-semibold">Desktop Image</label>
                            <input
                                type="file"
                                onChange={(e) => {
                                    setDesktop(e.target.files[0]);
                                    setPreviewDesktop(URL.createObjectURL(e.target.files[0]));
                                }}
                            />
                            {previewDesktop && (
                                <img
                                    src={previewDesktop}
                                    alt="Desktop Preview"
                                    className="h-20 mt-2 rounded" />
                            )}

                            {/* Mobile */}
                            <label className="text-sm font-semibold">Mobile Image</label>
                            <input
                                type="file"
                                onChange={(e) => {
                                    setMobile(e.target.files[0]);
                                    setPreviewMobile(URL.createObjectURL(e.target.files[0]));
                                }}
                            />
                            {previewMobile && (
                                <img
                                    src={previewMobile}
                                    alt="Mobile Preview"
                                    className="h-20 mt-2 rounded" />
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-2 bg-gray-100 rounded font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitBanner}
                                className="flex-1 py-2 bg-[#e60000] text-white rounded font-semibold"
                            >
                                {editBanner ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerList;
