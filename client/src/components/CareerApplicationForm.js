// import React, { useState, useRef } from "react";
// import { X } from "lucide-react";
// import SummaryApi from "../common";

// const CareerApplicationForm = ({ onClose }) => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     educationalQualification: "",
//     lookingFor: "",
//     experience: "",
//     phone: "",
//     summary: "",
//     resume: null,
//   });

//   const validateForm = () => {
//     const e = {};

//     if (!formData.name.trim()) e.name = "Name is required";
//     if (!formData.email) e.email = "Email is required";
//     else if (!/^\S+@\S+\.\S+$/.test(formData.email))
//       e.email = "Enter valid email";

//     if (!formData.educationalQualification)
//       e.educationalQualification = "Educational qualification required";
//     if (!formData.lookingFor) e.lookingFor = "This field is required";
//     if (!formData.experience) e.experience = "Experience is required";
//     if (!/^\d{10}$/.test(formData.phone))
//       e.phone = "Enter valid 10 digit phone";
//     if (!formData.summary) e.summary = "Summary is required";
//     if (!formData.resume) e.resume = "Resume is required";

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const fd = new FormData();
//     Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

//     try {
//       setLoading(true);
//       await fetch(SummaryApi.career.url, {
//         method: SummaryApi.career.method,
//         body: fd,
//       });

//       alert("Application submitted successfully");
//       onClose();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass =
//     "w-full px-2 py-2 border-b outline-none bg-transparent text-sm transition-colors duration-200";

//   return (
//     /* ===== MODAL OVERLAY ===== */
//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      
//       {/* ===== MODAL CONTENT ===== */}
//       <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-md max-h-[90vh] overflow-y-auto">

//         {/* CLOSE BUTTON */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-10"
//         >
//           <X />
//         </button>

//         {/* FORM SECTION (SAME DESIGN) */}
//         <section className="px-4 py-10">
//           <div className="bg-white px-6 md:px-16 py-8">
//             <h2 className="text-2xl font-bold text-center mb-6">
//               JOIN THE TEAM !!
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">

//               {/* INPUT GRID */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {[
//                   ["name", "Name", "Jhon Doe"],
//                   ["email", "Email", "johndoe@gmail.com"],
//                   ["educationalQualification", "Educational Qualification", "Educational Qualification"],
//                   ["lookingFor", "Looking For", "Looking For"],
//                   ["experience", "Experience", "Enter your experience"],
//                   ["phone", "Phone", "+91 2345678901"],
//                 ].map(([key, label, placeholder]) => (
//                   <div key={key}>
//                     <label className="text-sm font-medium">{label}</label>
//                     <input
//                       placeholder={placeholder}
//                       value={formData[key]}
//                       onChange={(e) =>
//                         setFormData({ ...formData, [key]: e.target.value })
//                       }
//                       className={`${inputClass} ${
//                         errors[key]
//                           ? "border-brand-primary"
//                           : "border-brand-productCardBorder"
//                       }`}
//                     />
//                     <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
//                       {errors[key] || ""}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* SUMMARY */}
//               <div>
//                 <label className="text-sm font-medium">Summary</label>
//                 <textarea
//                   rows="3"
//                   value={formData.summary}
//                   placeholder="Write us a message"
//                   onChange={(e) =>
//                     setFormData({ ...formData, summary: e.target.value })
//                   }
//                   className={`${inputClass} ${
//                     errors.summary
//                       ? "border-brand-primary"
//                       : "border-brand-productCardBorder"
//                   }`}
//                 />
//                 <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
//                   {errors.summary || ""}
//                 </p>
//               </div>

//               {/* RESUME */}
//               <div>
//                 <p className="text-sm text-[#99A1AF] mb-2 font-medium">
//                   Attach Resume
//                 </p>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   accept=".pdf,.doc,.docx"
//                   onChange={(e) =>
//                     setFormData({ ...formData, resume: e.target.files[0] })
//                   }
//                   className={`w-full border rounded-md text-sm px-2 py-1
//                     ${
//                       errors.resume
//                         ? "border-brand-primary"
//                         : "border-brand-productCardBorder"
//                     }
//                     file:border-0
//                     file:bg-[#E5E5E5]
//                     file:text-[#040404]
//                     file:px-4
//                     file:py-1.5
//                     file:rounded-md
//                     file:cursor-pointer
//                   `}
//                 />
//                 <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
//                   {errors.resume || ""}
//                 </p>
//               </div>

//               {/* BUTTON */}
//               <div className="flex justify-center md:justify-end">
//                 <button
//                   disabled={loading}
//                   className={`w-full md:w-auto px-10 py-2 rounded-md text-white text-sm font-medium
//                     ${
//                       loading
//                         ? "bg-brand-primaryHover"
//                         : "bg-brand-primary hover:bg-brand-primaryHover"
//                     }`}
//                 >
//                   {loading ? "Submitting..." : "Submit Application"}
//                 </button>
//               </div>

//             </form>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default CareerApplicationForm;


// import React, { useState, useRef } from "react";
// import { X } from "lucide-react";
// import SummaryApi from "../common";

// const CareerApplicationForm = ({ onClose }) => {
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     educationalQualification: "",
//     lookingFor: "",
//     experience: "",
//     phone: "",
//     summary: "",
//     resume: null,
//   });

//   const validateForm = () => {
//     const e = {};
//     if (!formData.name.trim()) e.name = "Name is required";
//     if (!formData.email) e.email = "Email is required";
//     if (!formData.educationalQualification) e.educationalQualification = "Educational qualification required";
//     if (!formData.lookingFor) e.lookingFor = "This field is required";
//     if (!formData.experience) e.experience = "Experience is required";
//     if (!/^\d{10}$/.test(formData.phone)) e.phone = "Enter valid 10 digit phone";
//     if (!formData.summary) e.summary = "Summary is required";
//     if (!formData.resume) e.resume = "Resume is required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const fd = new FormData();
//     Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

//     try {
//       setLoading(true);
//       await fetch(SummaryApi.career.url, {
//         method: SummaryApi.career.method,
//         body: fd,
//       });
//       alert("Application submitted successfully");
//       onClose();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass =
//     "w-full px-2 py-2 border-b outline-none bg-transparent text-sm transition-colors duration-200";

//   return (
//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 pt-24">
//       <div className="bg-white w-full max-w-4xl rounded-xl shadow-md relative h-[650px] max-h-[90vh] overflow-y-auto">

//         {/* CLOSE */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 "
//         >
//           <X />
//         </button>

//         {/* FORM SECTION – SAME DESIGN */}
//         <section className="px-4 py-10">
//           <div className="mx-auto px-6 md:px-16">
//             {/* <h2 className="text-2xl font-bold text-center mb-6">
//               JOIN THE TEAM !!
//             </h2> */}

//             <form onSubmit={handleSubmit} className="space-y-6">

//               {/* INPUT GRID */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {[
//                   ["name", "Name", "Jhon Doe"],
//                   ["email", "Email", "johndoe@gmail.com"],
//                   ["educationalQualification", "Educational Qualification", "Educational Qualification"],
//                   ["lookingFor", "Looking For", "Looking For"],
//                   ["experience", "Experience", "Enter your experience"],
//                   ["phone", "Phone", "+91 2345678901"],
//                 ].map(([key, label, placeholder]) => (
//                   <div key={key}>
//                     <label className="text-sm font-medium">{label}</label>
//                     <input
//                       placeholder={placeholder}
//                       value={formData[key]}
//                       onChange={(e) =>
//                         setFormData({ ...formData, [key]: e.target.value })
//                       }
//                       className={`${inputClass} ${
//                         errors[key]
//                           ? "border-brand-primary"
//                           : "border-brand-productCardBorder"
//                       }`}
//                     />
//                     <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
//                       {errors[key] || ""}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* SUMMARY */}
//               <div>
//                 <label className="text-sm font-medium">Summary</label>
//                 <textarea
//                   rows="3"
//                   value={formData.summary}
//                   placeholder="Write us a message"
//                   onChange={(e) =>
//                     setFormData({ ...formData, summary: e.target.value })
//                   }
//                   className={`${inputClass} ${
//                     errors.summary
//                       ? "border-brand-primary"
//                       : "border-brand-productCardBorder"
//                   }`}
//                 />
//                 <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
//                   {errors.summary || ""}
//                 </p>
//               </div>

//               {/* RESUME */}
//               <div>
//                 <p className="text-sm text-[#99A1AF] mb-2 font-medium">Attach Resume</p>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   accept=".pdf,.doc,.docx"
//                   onChange={(e) =>
//                     setFormData({ ...formData, resume: e.target.files[0] })
//                   }
//                   className="w-full border rounded-md text-sm px-2 py-1
//                     border-brand-productCardBorder
//                     file:border-0 file:bg-[#E5E5E5]
//                     file:px-4 file:py-1.5 file:rounded-md"
//                 />
//                 <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
//                   {errors.resume || ""}
//                 </p>
//               </div>

//               {/* BUTTON */}
//               <div className="flex justify-center md:justify-end">
//                 <button
//                   disabled={loading}
//                   className="w-full md:w-auto px-10 py-2 rounded-md text-white text-sm font-medium bg-brand-primary"
//                 >
//                   {loading ? "Submitting..." : "Submit Application"}
//                 </button>
//               </div>

//             </form>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default CareerApplicationForm;


import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import SummaryApi from "../common";

const CareerApplicationForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    educationalQualification: "",
    lookingFor: "",
    experience: "",
    phone: "",
    summary: "",
    resume: null,
  });

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email) e.email = "Email is required";
    if (!formData.educationalQualification) e.educationalQualification = "Educational qualification required";
    if (!formData.lookingFor) e.lookingFor = "This field is required";
    if (!formData.experience) e.experience = "Experience is required";
    if (!/^\d{10}$/.test(formData.phone)) e.phone = "Enter valid 10 digit phone";
    if (!formData.summary) e.summary = "Summary is required";
    if (!formData.resume) e.resume = "Resume is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

    try {
      setLoading(true);
      await fetch(SummaryApi.career.url, {
        method: SummaryApi.career.method,
        body: fd,
      });
      alert("Application submitted successfully");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-2 py-2 border-b outline-none bg-transparent text-sm transition-colors duration-200";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 pt-24">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-md relative max-h-[90vh] overflow-hidden">
        
        {/* CLOSE BUTTON - Fixed position relative to modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Scrollable content container */}
        <div className="h-[650px] 2xl:h-[700px] overflow-y-auto">
          {/* FORM SECTION */}
          <section className="px-4 py-10">
            <div className="mx-auto px-6 md:px-16">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* INPUT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    ["name", "Name", "Jhon Doe"],
                    ["email", "Email", "johndoe@gmail.com"],
                    ["educationalQualification", "Educational Qualification", "Educational Qualification"],
                    ["lookingFor", "Looking For", "Looking For"],
                    ["experience", "Experience", "Enter your experience"],
                    ["phone", "Phone", "+91 2345678901"],
                  ].map(([key, label, placeholder]) => (
                    <div key={key}>
                      <label className="text-sm font-medium">{label}</label>
                      <input
                        placeholder={placeholder}
                        value={formData[key]}
                        onChange={(e) =>
                          setFormData({ ...formData, [key]: e.target.value })
                        }
                        className={`${inputClass} ${
                          errors[key]
                            ? "border-brand-primary"
                            : "border-brand-productCardBorder"
                        }`}
                      />
                      <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
                        {errors[key] || ""}
                      </p>
                    </div>
                  ))}
                </div>

                {/* SUMMARY */}
                <div>
                  <label className="text-sm font-medium">Summary</label>
                  <textarea
                    rows="3"
                    value={formData.summary}
                    placeholder="Write us a message"
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    className={`${inputClass} ${
                      errors.summary
                        ? "border-brand-primary"
                        : "border-brand-productCardBorder"
                    }`}
                  />
                  <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
                    {errors.summary || ""}
                  </p>
                </div>

                {/* RESUME */}
                <div>
                  <p className="text-sm text-[#99A1AF] mb-2 font-medium">Attach Resume</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setFormData({ ...formData, resume: e.target.files[0] })
                    }
                    className="w-full border rounded-md text-sm px-2 py-1
                      border-brand-productCardBorder
                      file:border-0 file:bg-[#E5E5E5]
                      file:px-4 file:py-1.5 file:rounded-md"
                  />
                  <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
                    {errors.resume || ""}
                  </p>
                </div>

                {/* BUTTON */}
                <div className="flex justify-center md:justify-end">
                  <button
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-2 rounded-md text-white text-sm font-medium bg-brand-primary disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>

              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CareerApplicationForm;