// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import SummaryApi from "../../common/index";

// const initialState = {
//   businessName: "",
//   ownerName: "",
//   contactPerson: "",
//   mobile: "",
//   whatsapp: "",
//   email: "",
//   address: "",
//   city: "",
//   district: "",
//   state: "",
//   pincode: "",
//   businessType: "",
//   yearEstablished: "",
//   gstNumber: "",
//   panNumber: "",
//   businessCategory: "",
//   brandsDealtWith: "",
//   retailExperience: "",
//   proposedLocation: "",
//   ownershipStatus: "",
//   shopArea: "",
//   frontageWidth: "",
//   landmark: "",
//   investmentCapacity: "",
//   monthlyTurnover: "",
//   salesStaff: "",
//   dailyFootfall: "",
//   shopFrontPhoto: [],
//   shopInteriorPhotos: [],
//   gstCertificate: [],
//   ownershipProof: [],
//   reasonToJoin: "",
// };

// const REQUIRED_FIELDS = [
//   "businessName",
//   "ownerName",
//   "contactPerson",
//   "mobile",
//   "whatsapp",
//   "address",
//   "city",
//   "district",
//   "state",
//   "pincode",
// ];

// // Maps this form's local field names to the field names the backend
// // (Mongoose AuthorizedBrandShop model) expects.
// const FIELD_MAP = {
//   businessName: "businessName",
//   ownerName: "proprietorName",
//   contactPerson: "contactPerson",
//   mobile: "mobile",
//   whatsapp: "whatsapp",
//   email: "email",
//   address: "address",
//   city: "city",
//   district: "district",
//   state: "state",
//   pincode: "pinCode",
//   businessType: "businessType",
//   yearEstablished: "establishmentYear",
//   gstNumber: "gstNumber",
//   panNumber: "panNumber",
//   businessCategory: "currentCategory",
//   brandsDealtWith: "brandsDealt",
//   retailExperience: "experience",
//   proposedLocation: "proposedLocation",
//   ownershipStatus: "shopOwnership",
//   shopArea: "shopArea",
//   frontageWidth: "shopFrontage",
//   landmark: "landmark",
//   investmentCapacity: "investmentCapacity",
//   monthlyTurnover: "monthlyTurnover",
//   salesStaff: "salesStaff",
//   dailyFootfall: "customerFootfall",
//   reasonToJoin: "reason",
// };

// const FILE_FIELDS = [
//   "shopFrontPhoto",
//   "shopInteriorPhotos",
//   "gstCertificate",
//   "ownershipProof",
// ];

// // Matches AuthorizedDealer's inputClass: underline-style input, brand-primary
// // border on error.
// function getInputClasses(hasError) {
//   return `w-full px-2 py-2 border-b outline-none bg-transparent text-sm placeholder-[#777777]/50 transition-colors duration-200 ${
//     hasError ? "border-brand-primary" : "border-brand-productCardBorder"
//   }`;
// }

// const labelClasses = "text-sm font-medium";

// function Field({ label, required, error, children }) {
//   return (
//     <div>
//       <label className={labelClasses}>
//         {label} {required && <span className="text-brand-primary">*</span>}
//       </label>
//       {children}
//       {error && <p className="text-xs text-brand-primary mt-1">{error}</p>}
//     </div>
//   );
// }

// function TextInput({
//   label,
//   required,
//   placeholder,
//   name,
//   value,
//   onChange,
//   type = "text",
//   error,
// }) {
//   return (
//     <Field label={label} required={required} error={error}>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={getInputClasses(!!error)}
//       />
//     </Field>
//   );
// }

// function SelectInput({
//   label,
//   required,
//   placeholder,
//   name,
//   value,
//   onChange,
//   options,
//   error,
// }) {
//   return (
//     <Field label={label} required={required} error={error}>
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className={`${getInputClasses(!!error)} ${
//           value === "" ? "text-[#666666]" : "text-[#040404]"
//         }`}
//       >
//         <option value="" disabled>
//           {placeholder}
//         </option>
//         {options.map((opt) => (
//           <option key={opt} value={opt} className="text-[#040404]">
//             {opt}
//           </option>
//         ))}
//       </select>
//     </Field>
//   );
// }

// // Supports one or many files. Once files are chosen, the picker is replaced
// // by a list of the selected file names, each with its own "Cancel" button to
// // remove that file. The picker reappears once all files are removed (or can
// // be used again to add more files when `multiple` is true).
// //
// // `files` holds real File objects (not just names) so they can be appended
// // to FormData on submit.
// function FileInput({
//   label,
//   required,
//   name,
//   multiple,
//   files,
//   onAdd,
//   onRemoveOne,
//   onRemoveAll,
//   error,
//   inputKey,
// }) {
//   const hasFiles = files && files.length > 0;

//   return (
//     <div data-error={error ? "true" : "false"}>
//       <label
//         className={`flex items-end min-h-[3rem] ${labelClasses} mb-2`}
//       >
//         {label} {required && <span className="text-brand-primary">*</span>}
//       </label>
//       {hasFiles && (
//         <div className="flex flex-col gap-2 mb-3">
//           {files.map((file, i) => (
//             <div
//               key={`${file.name}-${i}`}
//               className={`w-full flex items-center justify-between gap-3 border rounded-md p-3.5 bg-transparent ${
//                 error ? "border-brand-primary" : "border-brand-productCardBorder"
//               }`}
//             >
//               <span className="text-sm truncate">{file.name}</span>
//               <button
//                 type="button"
//                 onClick={() => onRemoveOne(name, i)}
//                 className="shrink-0 text-xs font-medium text-brand-primary hover:text-brand-primaryHover border border-brand-productCardBorder rounded px-2.5 py-1 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => onRemoveAll(name)}
//             className="self-start text-xs font-medium text-[#666666] hover:text-[#040404] underline"
//           >
//             Remove all
//           </button>
//         </div>
//       )}

//       <input
//         key={inputKey}
//         type="file"
//         name={name}
//         multiple={multiple}
//         onChange={(e) => onAdd(name, e)}
//         className={`w-full border rounded-md text-sm px-1 py-1 outline-none bg-transparent
//           file:border-0
//           file:bg-[#E5E5E5]
//           file:text-[#040404]
//           file:px-4
//           file:py-1.5
//           file:rounded-md
//           file:cursor-pointer
//           ${error ? "border-brand-primary" : "border-brand-productCardBorder"}
//         `}
//       />
//       {error && <p className="text-xs text-brand-primary mt-1">{error}</p>}
//     </div>
//   );
// }

// // Auto-growing textarea: the underline sits right under the last line of
// // text instead of staying far below a tall fixed-height box.
// function AutoTextarea({ name, value, onChange, placeholder, error }) {
//   const handleInput = (e) => {
//     e.target.style.height = "auto";
//     e.target.style.height = `${e.target.scrollHeight}px`;
//     onChange(e);
//   };

//   return (
//     <textarea
//       name={name}
//       value={value}
//       onChange={handleInput}
//       placeholder={placeholder}
//       rows={1}
//       className={`${getInputClasses(!!error)} resize-none overflow-hidden`}
//     />
//   );
// }

// function SectionTitle({ children }) {
//   return (
//     <h2 className="text-lg sm:text-xl font-semibold mt-12 mb-6 first:mt-0">
//       {children}
//     </h2>
//   );
// }

// export default function BrandShopForm() {
//   const [form, setForm] = useState(initialState);
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [apiError, setApiError] = useState("");
//   // Bumping the key for a given file field remounts its <input type="file">
//   // so the browser's file picker is cleared / can re-pick a removed file.
//   const [fileInputKeys, setFileInputKeys] = useState(
//     Object.fromEntries(FILE_FIELDS.map((f) => [f, 0]))
//   );

//   const bumpFileInputKey = (name) =>
//     setFileInputKeys((prev) => ({ ...prev, [name]: prev[name] + 1 }));

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   // Newly chosen files are appended to whatever was already selected.
//   // Real File objects are kept (not just names) so they can be sent as
//   // multipart/form-data on submit.
//   const handleAddFiles = (name, e) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;
//     const fileArr = Array.from(files);
//     setForm((prev) => ({ ...prev, [name]: [...prev[name], ...fileArr] }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//     bumpFileInputKey(name);
//   };

//   const handleRemoveOneFile = (name, index) => {
//     setForm((prev) => ({
//       ...prev,
//       [name]: prev[name].filter((_, i) => i !== index),
//     }));
//     bumpFileInputKey(name);
//   };

//   const handleRemoveAllFiles = (name) => {
//     setForm((prev) => ({ ...prev, [name]: [] }));
//     bumpFileInputKey(name);
//   };

//   const validate = () => {
//     const newErrors = {};

//     REQUIRED_FIELDS.forEach((field) => {
//       if (!String(form[field] || "").trim()) {
//         newErrors[field] = "This field is required.";
//       }
//     });

//     if (form.mobile && !/^\d{10}$/.test(form.mobile.replace(/\D/g, "").slice(-10))) {
//       newErrors.mobile = "Enter a valid 10-digit mobile number.";
//     }
//     if (form.whatsapp && !/^\d{10}$/.test(form.whatsapp.replace(/\D/g, "").slice(-10))) {
//       newErrors.whatsapp = "Enter a valid 10-digit WhatsApp number.";
//     }
//     if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       newErrors.email = "Enter a valid email address.";
//     }
//     if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
//       newErrors.pincode = "PIN code must be 6 digits.";
//     }
//     if (
//       form.gstNumber &&
//       !/^[0-9A-Z]{15}$/.test(form.gstNumber.toUpperCase())
//     ) {
//       newErrors.gstNumber = "GST number must be 15 characters.";
//     }
//     if (
//       form.panNumber &&
//       !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.toUpperCase())
//     ) {
//       newErrors.panNumber = "Enter a valid 10-character PAN number.";
//     }
//     if (!form.reasonToJoin || !form.reasonToJoin.trim()) {
//       newErrors.reasonToJoin = "Please share your reason.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const buildFormData = () => {
//     const formData = new FormData();

//     Object.entries(FIELD_MAP).forEach(([localKey, backendKey]) => {
//       const value = form[localKey];
//       if (value !== undefined && value !== null && value !== "") {
//         formData.append(backendKey, value);
//       }
//     });

//     // Files: appended under their own field name. For the multi-select
//     // field (shopInteriorPhotos), each file is appended under the same
//     // key — multer's `.array()`/`.fields()` will collect them together.
//     FILE_FIELDS.forEach((fieldName) => {
//       form[fieldName].forEach((file) => {
//         formData.append(fieldName, file);
//       });
//     });

//     return formData;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitted(false);
//     setApiError("");

//     const isValid = validate();
//     if (!isValid) {
//       const firstErrorField = document.querySelector('[data-error="true"]');
//       if (firstErrorField) {
//         firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const formData = buildFormData();

//       const response = await axios({
//         url: SummaryApi.brandShop.url,
//         method: SummaryApi.brandShop.method,
//         data: formData,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response?.data?.success === false) {
//         throw new Error(response.data.message || "Submission failed.");
//       }

//       setSubmitted(true);
//       toast.success("Thank you! Your application has been submitted.");
//       setForm(initialState);
//       setFileInputKeys(Object.fromEntries(FILE_FIELDS.map((f) => [f, 0])));
//     } catch (err) {
//       console.error("Brand shop submission failed:", err);
//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong while submitting the form. Please try again.";
//       setApiError(message);
//       toast.error(message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div id="form" className="min-h-screen bg-white sm:pb-16 lg:py-16 px-4">
//       <div className="max-w-5xl mx-auto">
//         {/* HEADER */}
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-semibold mb-2">
//             Form for RELDA Brand Shop
//           </h1>
//           <p className="text-sm text-[#99A1AF]">
//             Please fill in the details below to apply for a RELDA Authorized
//             Brand Shop.
//           </p>
//         </div>

//         {/* CARD */}
//         <form
//           onSubmit={handleSubmit}
//           noValidate
//           className="bg-white rounded-xl shadow-md px-6 md:px-16 py-4"
//         >
//           {/* SECTION 1 - BUSINESS INFORMATION */}
//           <SectionTitle>Section 1 – Business Information</SectionTitle>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
//             <TextInput
//               label="Business / Shop Name"
//               required
//               placeholder="Enter business / shop name"
//               name="businessName"
//               value={form.businessName}
//               onChange={handleChange}
//               error={errors.businessName}
//             />
//             <TextInput
//               label="Proprietor / Owner Name"
//               required
//               placeholder="Enter owner name"
//               name="ownerName"
//               value={form.ownerName}
//               onChange={handleChange}
//               error={errors.ownerName}
//             />
//             <TextInput
//               label="Contact Person Name"
//               required
//               placeholder="Enter contact person name"
//               name="contactPerson"
//               value={form.contactPerson}
//               onChange={handleChange}
//               error={errors.contactPerson}
//             />
//             <TextInput
//               label="Mobile Number"
//               required
//               placeholder="+91 XXXXXXXXXX"
//               name="mobile"
//               value={form.mobile}
//               onChange={handleChange}
//               type="tel"
//               error={errors.mobile}
//             />
//             <TextInput
//               label="WhatsApp Number"
//               required
//               placeholder="+91 XXXXXXXXXX"
//               name="whatsapp"
//               value={form.whatsapp}
//               onChange={handleChange}
//               type="tel"
//               error={errors.whatsapp}
//             />
//             <TextInput
//               label="Email ID"
//               placeholder="Enter email address"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               type="email"
//               error={errors.email}
//             />
//             <div className="sm:col-span-2">
//               <TextInput
//                 label="Complete Shop Address"
//                 required
//                 placeholder="Enter complete shop address"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 error={errors.address}
//               />
//             </div>
//             <TextInput
//               label="City"
//               required
//               placeholder="Enter city"
//               name="city"
//               value={form.city}
//               onChange={handleChange}
//               error={errors.city}
//             />
//             <TextInput
//               label="District"
//               required
//               placeholder="Enter district"
//               name="district"
//               value={form.district}
//               onChange={handleChange}
//               error={errors.district}
//             />
//             <TextInput
//               label="State"
//               required
//               placeholder="Enter state"
//               name="state"
//               value={form.state}
//               onChange={handleChange}
//               error={errors.state}
//             />
//             <TextInput
//               label="PIN Code"
//               required
//               placeholder="Enter PIN code"
//               name="pincode"
//               value={form.pincode}
//               onChange={handleChange}
//               error={errors.pincode}
//             />
//             <SelectInput
//               label="Business Type"
//               placeholder="Select business type"
//               name="businessType"
//               value={form.businessType}
//               onChange={handleChange}
//               options={[
//                 "Proprietorship",
//                 "Partnership",
//                 "Private Limited",
//                 "LLP",
//                 "Others",
//               ]}
//               error={errors.businessType}
//             />
//             <TextInput
//               label="Year of Establishment"
//               placeholder="Enter year of establishment"
//               name="yearEstablished"
//               value={form.yearEstablished}
//               onChange={handleChange}
//               error={errors.yearEstablished}
//             />
//             <TextInput
//               label="GST Number"
//               placeholder="Enter GST number"
//               name="gstNumber"
//               value={form.gstNumber}
//               onChange={handleChange}
//               error={errors.gstNumber}
//             />
//             <TextInput
//               label="PAN Number"
//               placeholder="Enter PAN number"
//               name="panNumber"
//               value={form.panNumber}
//               onChange={handleChange}
//               error={errors.panNumber}
//             />
//           </div>

//           {/* SECTION 2 - BUSINESS CATEGORY & EXPERIENCE */}
//           <SectionTitle>Section 2 – Business Category &amp; Experience</SectionTitle>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
//             <SelectInput
//               label="Current Business Category"
//               placeholder="Select business category"
//               name="businessCategory"
//               value={form.businessCategory}
//               onChange={handleChange}
//               options={[
//                 "Home Appliances",
//                 "Electronics",
//                 "Electrical",
//                 "Kitchen Appliances",
//                 "Consumer Durables",
//                 "Others",
//               ]}
//               error={errors.businessCategory}
//             />
//             <TextInput
//               label="Which Brands Do You Currently Deal With?"
//               placeholder="Enter brand names"
//               name="brandsDealtWith"
//               value={form.brandsDealtWith}
//               onChange={handleChange}
//               error={errors.brandsDealtWith}
//             />
//             <SelectInput
//               label="Years of Experience in Retail Business"
//               placeholder="Select experience"
//               name="retailExperience"
//               value={form.retailExperience}
//               onChange={handleChange}
//               options={[
//                 "Less than 1 Year",
//                 "1-3 Years",
//                 "3-5 Years",
//                 "5-10 Years",
//                 "More than 10 Years",
//               ]}
//               error={errors.retailExperience}
//             />
//           </div>

//           {/* SECTION 3 - BRAND SHOP DETAILS */}
//           <SectionTitle>Section 3 – Brand Shop Details</SectionTitle>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
//             <div className="sm:col-span-2">
//               <TextInput
//                 label="Proposed Location for RELDA Brand Shop"
//                 placeholder="Enter proposed location"
//                 name="proposedLocation"
//                 value={form.proposedLocation}
//                 onChange={handleChange}
//                 error={errors.proposedLocation}
//               />
//             </div>
//             <SelectInput
//               label="Shop Ownership Status"
//               placeholder="Select ownership status"
//               name="ownershipStatus"
//               value={form.ownershipStatus}
//               onChange={handleChange}
//               options={["Owned", "Rented", "Lease"]}
//               error={errors.ownershipStatus}
//             />
//             <TextInput
//               label="Shop Area (Sq. Ft.)"
//               placeholder="Enter shop area"
//               name="shopArea"
//               value={form.shopArea}
//               onChange={handleChange}
//               error={errors.shopArea}
//             />
//             <TextInput
//               label="Shop Frontage Width (Feet)"
//               placeholder="Enter frontage width"
//               name="frontageWidth"
//               value={form.frontageWidth}
//               onChange={handleChange}
//               error={errors.frontageWidth}
//             />
//             <TextInput
//               label="Nearby Landmark"
//               placeholder="Enter nearby landmark"
//               name="landmark"
//               value={form.landmark}
//               onChange={handleChange}
//               error={errors.landmark}
//             />
//             <SelectInput
//               label="Expected Investment Capacity"
//               placeholder="Select investment capacity"
//               name="investmentCapacity"
//               value={form.investmentCapacity}
//               onChange={handleChange}
//               options={[
//                 "5 Lakhs",
//                 "10 Lakhs",
//                 "20 Lakhs",
//                 "30 Lakhs",
//                 "50 Lakhs",
//                 "Above 50 Lakhs",
//               ]}
//               error={errors.investmentCapacity}
//             />
//             <SelectInput
//               label="Current Monthly Business Turnover"
//               placeholder="Select monthly turnover"
//               name="monthlyTurnover"
//               value={form.monthlyTurnover}
//               onChange={handleChange}
//               options={[
//                 "Below 5 Lakhs",
//                 "5-10 Lakhs",
//                 "10-25 Lakhs",
//                 "25-50 Lakhs",
//                 "Above 50 Lakhs",
//               ]}
//               error={errors.monthlyTurnover}
//             />
//             <TextInput
//               label="Number of Sales Staff Available"
//               placeholder="Enter number of staff"
//               name="salesStaff"
//               value={form.salesStaff}
//               onChange={handleChange}
//               type="number"
//               error={errors.salesStaff}
//             />
//             <SelectInput
//               label="Average Daily Customer Footfall"
//               placeholder="Select daily footfall"
//               name="dailyFootfall"
//               value={form.dailyFootfall}
//               onChange={handleChange}
//               options={[
//                 "Below 20 Customers/Day",
//                 "20-50 Customers/Day",
//                 "50-100 Customers/Day",
//                 "Above 100 Customers/Day",
//               ]}
//               error={errors.dailyFootfall}
//             />
//           </div>

//           {/* SECTION 4 - SHOP INFRASTRUCTURE */}
//           <SectionTitle>Section 4 – Shop Infrastructure</SectionTitle>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
//             <FileInput
//               label="Shop Front Photo"
//               name="shopFrontPhoto"
//               files={form.shopFrontPhoto}
//               onAdd={handleAddFiles}
//               onRemoveOne={handleRemoveOneFile}
//               onRemoveAll={handleRemoveAllFiles}
//               inputKey={fileInputKeys.shopFrontPhoto}
//               error={errors.shopFrontPhoto}
//             />
//             <FileInput
//               label="Shop Interior Photos"
//               name="shopInteriorPhotos"
//               multiple
//               files={form.shopInteriorPhotos}
//               onAdd={handleAddFiles}
//               onRemoveOne={handleRemoveOneFile}
//               onRemoveAll={handleRemoveAllFiles}
//               inputKey={fileInputKeys.shopInteriorPhotos}
//               error={errors.shopInteriorPhotos}
//             />
//             <FileInput
//               label="GST Certificate"
//               name="gstCertificate"
//               files={form.gstCertificate}
//               onAdd={handleAddFiles}
//               onRemoveOne={handleRemoveOneFile}
//               onRemoveAll={handleRemoveAllFiles}
//               inputKey={fileInputKeys.gstCertificate}
//               error={errors.gstCertificate}
//             />
//             <FileInput
//               label="Shop Ownership Proof / Rental Agreement (if available)"
//               name="ownershipProof"
//               files={form.ownershipProof}
//               onAdd={handleAddFiles}
//               onRemoveOne={handleRemoveOneFile}
//               onRemoveAll={handleRemoveAllFiles}
//               inputKey={fileInputKeys.ownershipProof}
//               error={errors.ownershipProof}
//             />
//           </div>

//           {/* SECTION 5 - ADDITIONAL INFORMATION */}
//           <SectionTitle>Section 5 – Additional Information</SectionTitle>
//           <div className="mb-10" data-error={errors.reasonToJoin ? "true" : "false"}>
//             <Field
//               label="Why would you like to open a RELDA Authorized Brand Shop?"
//               required
//               error={errors.reasonToJoin}
//             >
//               <AutoTextarea
//                 name="reasonToJoin"
//                 value={form.reasonToJoin}
//                 onChange={handleChange}
//                 placeholder="Tell us your reason"
//                 error={errors.reasonToJoin}
//               />
//             </Field>
//           </div>

//           {apiError && (
//             <p className="mb-6 text-sm font-medium text-brand-primary">
//               {apiError}
//             </p>
//           )}

//           {submitted && (
//             <p className="mb-6 text-sm font-medium text-green-600">
//               Thank you! Your application has been submitted.
//             </p>
//           )}

//           {/* BUTTON */}
//           <div className="flex justify-center md:justify-end">
//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full md:w-auto px-10 py-2 rounded-md text-white text-sm font-medium bg-brand-primary hover:bg-brand-primaryHover disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {submitting ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SummaryApi from "../../common/index";

const initialState = {
  proprietorName: "",
  email: "",
  mobile: "",
  city: "",
  state: "",
};

const PERKS = [
  {
    title: "A growing home appliance range",
    desc: "Televisions, fans and kitchen essentials under one brand.",
  },
  {
    title: "Brand shop support",
    desc: "Shop branding, product display and launch guidance.",
  },
  {
    title: "Product and sales training",
    desc: "Your team learns the range before the shop opens.",
  },
];

export default function BrandShopForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedFirstName, setSubmittedFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name } = e.target;
    let value = e.target.value;

    if (name === "mobile") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.proprietorName.trim()) {
      newErrors.proprietorName = "Owner / Proprietor name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, "").slice(-10))) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setApiError("");

    const isValid = validate();
    if (!isValid) {
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("proprietorName", form.proprietorName.trim());
      formData.append("email", form.email.trim());
      formData.append("mobile", form.mobile.trim());
      formData.append("city", form.city.trim());
      formData.append("state", form.state.trim());

      const response = await axios({
        url: SummaryApi.brandShop.url,
        method: SummaryApi.brandShop.method,
        data: formData,
      });

      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Submission failed.");
      }

      const firstName = form.proprietorName.trim().split(" ")[0];
      setSubmittedFirstName(firstName);
      setSubmitted(true);
      toast.success("Thank you! Your application has been submitted.");
      setForm(initialState);
    } catch (err) {
      console.error("Brand shop submission failed:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while submitting the form. Please try again.";
      setApiError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputBaseClass = (hasError) =>
    `w-full bg-white text-[#1E1E22] placeholder-[#8F8992] border-[1.5px] rounded-xl px-3.5 py-3 min-h-[48px] text-[15px] transition-all duration-150 focus:outline-none focus:ring-4 ${
      hasError
        ? "border-[#B3141E] focus:border-[#B3141E] focus:ring-[#B3141E]/15"
        : "border-[#E4DCD8] hover:border-[#C9BEB8] focus:border-[#D4202B] focus:ring-[#D4202B]/15"
    }`;

  return (
    <div id="form" className=" bg-[#F3EEEC] flex items-center justify-center py-16 px-4">
      <main className="w-full max-w-[1080px] grid grid-cols-1 lg:grid-cols-12 rounded-[24px] overflow-hidden bg-white shadow-[0_24px_60px_-28px_rgba(60,30,30,0.35)]">
        {/* Left Panel */}
        <aside className="lg:col-span-5 relative bg-white text-[#1E1E22] p-7 sm:p-10 flex flex-col justify-center gap-6 overflow-hidden isolate border-t-[6px] border-[#D4202B]">
          <div className="pointer-events-none absolute -right-[120px] -bottom-[120px] w-[340px] h-[340px] rounded-full bg-[#FDECEC] -z-10" />

          <h1 className="text-[38px] sm:text-[48px] leading-[0.98] font-bold tracking-tight text-[#1E1E22] max-w-[11ch]">
            Apply for a Relda Brand Shop
          </h1>

          <p className="text-[#625C66] text-[15.5px] leading-relaxed max-w-[36ch]">
            Open a Relda brand shop in your city and bring smart, stylish, energy-efficient
            appliances to your customers.
          </p>

          <ul className="space-y-4 m-0 p-0 list-none">
            {PERKS.map((perk) => (
              <li key={perk.title} className="flex items-start gap-3">
                <span className="flex-none w-[22px] h-[22px] rounded-full bg-[#D4202B] text-white flex items-center justify-center mt-0.5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-[15.5px] text-[#1E1E22] leading-snug">
                    {perk.title}
                  </div>
                  <small className="block text-[#625C66] text-[14px] font-normal mt-0.5">
                    {perk.desc}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Panel: Form */}
        <section
          className="lg:col-span-7 p-7 sm:p-10 bg-[#FAF6F4] border-t lg:border-t-0 lg:border-l border-[#E4DCD8] flex flex-col justify-center"
          aria-live="polite"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="text-[28px] sm:text-[32px] font-bold leading-tight text-[#1E1E22]">
                Tell us about you
              </h2>
              <p className="text-[#625C66] mt-1.5 mb-6 text-[15px]">
                Please fill in the details below to apply for a RELDA Authorized Brand Shop.
              </p>

              {apiError && (
                <div className="mb-5 bg-red-50 border border-red-200 text-[#B3141E] text-sm rounded-xl px-4 py-3">
                  {apiError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-4">
                {/* Owner / Proprietor Name */}
                <div data-error={!!errors.proprietorName}>
                  <label
                    htmlFor="proprietorName"
                    className="block font-semibold text-sm text-[#1E1E22] mb-1.5"
                  >
                    Owner / Proprietor Name <span className="text-[#D4202B]">*</span>
                  </label>
                  <input
                    id="proprietorName"
                    type="text"
                    name="proprietorName"
                    autoComplete="name"
                    placeholder="Enter owner name"
                    value={form.proprietorName}
                    onChange={handleChange}
                    className={inputBaseClass(errors.proprietorName)}
                  />
                  {errors.proprietorName && (
                    <p className="text-[#B3141E] text-[13px] mt-1">{errors.proprietorName}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div data-error={!!errors.mobile}>
                  <label
                    htmlFor="mobile"
                    className="block font-semibold text-sm text-[#1E1E22] mb-1.5"
                  >
                    Mobile Number <span className="text-[#D4202B]">*</span>
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    name="mobile"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={form.mobile}
                    onChange={handleChange}
                    className={inputBaseClass(errors.mobile)}
                  />
                  {errors.mobile && (
                    <p className="text-[#B3141E] text-[13px] mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Email ID */}
                <div data-error={!!errors.email}>
                  <label
                    htmlFor="email"
                    className="block font-semibold text-sm text-[#1E1E22] mb-1.5"
                  >
                    Email ID <span className="text-[#D4202B]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    className={inputBaseClass(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-[#B3141E] text-[13px] mt-1">{errors.email}</p>
                  )}
                </div>

                {/* City */}
                <div data-error={!!errors.city}>
                  <label
                    htmlFor="city"
                    className="block font-semibold text-sm text-[#1E1E22] mb-1.5"
                  >
                    City <span className="text-[#D4202B]">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Enter city"
                    value={form.city}
                    onChange={handleChange}
                    className={inputBaseClass(errors.city)}
                  />
                  {errors.city && (
                    <p className="text-[#B3141E] text-[13px] mt-1">{errors.city}</p>
                  )}
                </div>

                {/* State (Full Width) */}
                <div data-error={!!errors.state} className="sm:col-span-2">
                  <label
                    htmlFor="state"
                    className="block font-semibold text-sm text-[#1E1E22] mb-1.5"
                  >
                    State <span className="text-[#D4202B]">*</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    autoComplete="address-level1"
                    placeholder="Enter state"
                    value={form.state}
                    onChange={handleChange}
                    className={inputBaseClass(errors.state)}
                  />
                  {errors.state && (
                    <p className="text-[#B3141E] text-[13px] mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto sm:min-w-[230px] font-semibold text-[16px] rounded-xl py-3.5 px-7 min-h-[50px] bg-[#D4202B] hover:bg-[#A8161F] text-white transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D4202B]/35 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>

              <p className="text-[13px] text-[#625C66] text-center mt-3.5">
                No fee to apply. Your details stay with the Relda team.
              </p>
            </form>
          ) : (
            <div className="text-center py-6 px-2">
              <div className="w-[84px] h-[84px] mx-auto mb-4 rounded-full bg-[#1E7A46] flex items-center justify-center text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-11 h-11"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </div>
              <h2 className="text-[28px] sm:text-[32px] font-bold text-[#1E1E22]">
                Application received
              </h2>
              <p className="text-[#625C66] mt-1 mb-6 text-[15px]">
                Thanks, <strong className="text-[#1E1E22]">{submittedFirstName}</strong>. Your
                authorized brand shop application has been submitted successfully.
              </p>
              <ol className="text-left max-w-[390px] mx-auto space-y-3 p-0 list-none mb-6">
                {[
                  "The Relda team reviews your details and calls you.",
                  "We discuss your shop space, range and investment.",
                  "If it is a fit, we plan your brand shop setup together.",
                ].map((step, idx) => (
                  <li key={step} className="flex items-start gap-3 text-[15px] text-[#1E1E22]">
                    <span className="flex-none w-[26px] h-[26px] rounded-full bg-[#D4202B] text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-sm font-semibold text-[#D4202B] hover:underline"
              >
                Submit another application
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}