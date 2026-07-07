import React, { useState } from "react";
import axios from "axios";
import SummaryApi from "../../common/index";

const initialState = {
  businessName: "",
  ownerName: "",
  contactPerson: "",
  mobile: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  businessType: "",
  yearEstablished: "",
  gstNumber: "",
  panNumber: "",
  businessCategory: "",
  brandsDealtWith: "",
  retailExperience: "",
  proposedLocation: "",
  ownershipStatus: "",
  shopArea: "",
  frontageWidth: "",
  landmark: "",
  investmentCapacity: "",
  monthlyTurnover: "",
  salesStaff: "",
  dailyFootfall: "",
  shopFrontPhoto: [],
  shopInteriorPhotos: [],
  gstCertificate: [],
  ownershipProof: [],
  reasonToJoin: "",
};

const REQUIRED_FIELDS = [
  "businessName",
  "ownerName",
  "contactPerson",
  "mobile",
  "whatsapp",
  "address",
  "city",
  "district",
  "state",
  "pincode",
];

// Maps this form's local field names to the field names the backend
// (Mongoose AuthorizedBrandShop model) expects.
const FIELD_MAP = {
  businessName: "businessName",
  ownerName: "proprietorName",
  contactPerson: "contactPerson",
  mobile: "mobile",
  whatsapp: "whatsapp",
  email: "email",
  address: "address",
  city: "city",
  district: "district",
  state: "state",
  pincode: "pinCode",
  businessType: "businessType",
  yearEstablished: "establishmentYear",
  gstNumber: "gstNumber",
  panNumber: "panNumber",
  businessCategory: "currentCategory",
  brandsDealtWith: "brandsDealt",
  retailExperience: "experience",
  proposedLocation: "proposedLocation",
  ownershipStatus: "shopOwnership",
  shopArea: "shopArea",
  frontageWidth: "shopFrontage",
  landmark: "landmark",
  investmentCapacity: "investmentCapacity",
  monthlyTurnover: "monthlyTurnover",
  salesStaff: "salesStaff",
  dailyFootfall: "customerFootfall",
  reasonToJoin: "reason",
};

const FILE_FIELDS = [
  "shopFrontPhoto",
  "shopInteriorPhotos",
  "gstCertificate",
  "ownershipProof",
];

// Matches AuthorizedDealer's inputClass: underline-style input, brand-primary
// border on error.
function getInputClasses(hasError) {
  return `w-full px-2 py-2 border-b outline-none bg-transparent text-sm placeholder-[#666666] transition-colors duration-200 ${
    hasError ? "border-brand-primary" : "border-brand-productCardBorder"
  }`;
}

const labelClasses = "text-sm font-medium";

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className={labelClasses}>
        {label} {required && <span className="text-brand-primary">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-brand-primary mt-1">{error}</p>}
    </div>
  );
}

function TextInput({
  label,
  required,
  placeholder,
  name,
  value,
  onChange,
  type = "text",
  error,
}) {
  return (
    <Field label={label} required={required} error={error}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={getInputClasses(!!error)}
      />
    </Field>
  );
}

function SelectInput({
  label,
  required,
  placeholder,
  name,
  value,
  onChange,
  options,
  error,
}) {
  return (
    <Field label={label} required={required} error={error}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${getInputClasses(!!error)} ${
          value === "" ? "text-[#666666]" : "text-[#040404]"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-[#040404]">
            {opt}
          </option>
        ))}
      </select>
    </Field>
  );
}

// Supports one or many files. Once files are chosen, the picker is replaced
// by a list of the selected file names, each with its own "Cancel" button to
// remove that file. The picker reappears once all files are removed (or can
// be used again to add more files when `multiple` is true).
//
// `files` holds real File objects (not just names) so they can be appended
// to FormData on submit.
function FileInput({
  label,
  required,
  name,
  multiple,
  files,
  onAdd,
  onRemoveOne,
  onRemoveAll,
  error,
  inputKey,
}) {
  const hasFiles = files && files.length > 0;

  return (
    <div data-error={error ? "true" : "false"}>
      <label
        className={`flex items-end min-h-[3rem] ${labelClasses} mb-2`}
      >
        {label} {required && <span className="text-brand-primary">*</span>}
      </label>
      {hasFiles && (
        <div className="flex flex-col gap-2 mb-3">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className={`w-full flex items-center justify-between gap-3 border rounded-md p-3.5 bg-transparent ${
                error ? "border-brand-primary" : "border-brand-productCardBorder"
              }`}
            >
              <span className="text-sm truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemoveOne(name, i)}
                className="shrink-0 text-xs font-medium text-brand-primary hover:text-brand-primaryHover border border-brand-productCardBorder rounded px-2.5 py-1 transition-colors"
              >
                Cancel
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onRemoveAll(name)}
            className="self-start text-xs font-medium text-[#666666] hover:text-[#040404] underline"
          >
            Remove all
          </button>
        </div>
      )}

      <input
        key={inputKey}
        type="file"
        name={name}
        multiple={multiple}
        onChange={(e) => onAdd(name, e)}
        className={`w-full border rounded-md text-sm px-1 py-1 outline-none bg-transparent
          file:border-0
          file:bg-[#E5E5E5]
          file:text-[#040404]
          file:px-4
          file:py-1.5
          file:rounded-md
          file:cursor-pointer
          ${error ? "border-brand-primary" : "border-brand-productCardBorder"}
        `}
      />
      {error && <p className="text-xs text-brand-primary mt-1">{error}</p>}
    </div>
  );
}

// Auto-growing textarea: the underline sits right under the last line of
// text instead of staying far below a tall fixed-height box.
function AutoTextarea({ name, value, onChange, placeholder, error }) {
  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    onChange(e);
  };

  return (
    <textarea
      name={name}
      value={value}
      onChange={handleInput}
      placeholder={placeholder}
      rows={1}
      className={`${getInputClasses(!!error)} resize-none overflow-hidden`}
    />
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-lg sm:text-xl font-semibold mt-12 mb-6 first:mt-0">
      {children}
    </h2>
  );
}

export default function BrandShopForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  // Bumping the key for a given file field remounts its <input type="file">
  // so the browser's file picker is cleared / can re-pick a removed file.
  const [fileInputKeys, setFileInputKeys] = useState(
    Object.fromEntries(FILE_FIELDS.map((f) => [f, 0]))
  );

  const bumpFileInputKey = (name) =>
    setFileInputKeys((prev) => ({ ...prev, [name]: prev[name] + 1 }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Newly chosen files are appended to whatever was already selected.
  // Real File objects are kept (not just names) so they can be sent as
  // multipart/form-data on submit.
  const handleAddFiles = (name, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files);
    setForm((prev) => ({ ...prev, [name]: [...prev[name], ...fileArr] }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    bumpFileInputKey(name);
  };

  const handleRemoveOneFile = (name, index) => {
    setForm((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
    bumpFileInputKey(name);
  };

  const handleRemoveAllFiles = (name) => {
    setForm((prev) => ({ ...prev, [name]: [] }));
    bumpFileInputKey(name);
  };

  const validate = () => {
    const newErrors = {};

    REQUIRED_FIELDS.forEach((field) => {
      if (!String(form[field] || "").trim()) {
        newErrors[field] = "This field is required.";
      }
    });

    if (form.mobile && !/^\d{10}$/.test(form.mobile.replace(/\D/g, "").slice(-10))) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }
    if (form.whatsapp && !/^\d{10}$/.test(form.whatsapp.replace(/\D/g, "").slice(-10))) {
      newErrors.whatsapp = "Enter a valid 10-digit WhatsApp number.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "PIN code must be 6 digits.";
    }
    if (
      form.gstNumber &&
      !/^[0-9A-Z]{15}$/.test(form.gstNumber.toUpperCase())
    ) {
      newErrors.gstNumber = "GST number must be 15 characters.";
    }
    if (
      form.panNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.toUpperCase())
    ) {
      newErrors.panNumber = "Enter a valid 10-character PAN number.";
    }
    if (!form.reasonToJoin || !form.reasonToJoin.trim()) {
      newErrors.reasonToJoin = "Please share your reason.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildFormData = () => {
    const formData = new FormData();

    Object.entries(FIELD_MAP).forEach(([localKey, backendKey]) => {
      const value = form[localKey];
      if (value !== undefined && value !== null && value !== "") {
        formData.append(backendKey, value);
      }
    });

    // Files: appended under their own field name. For the multi-select
    // field (shopInteriorPhotos), each file is appended under the same
    // key — multer's `.array()`/`.fields()` will collect them together.
    FILE_FIELDS.forEach((fieldName) => {
      form[fieldName].forEach((file) => {
        formData.append(fieldName, file);
      });
    });

    return formData;
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

      const formData = buildFormData();

      const response = await axios({
        url: SummaryApi.brandShop.url,
        method: SummaryApi.brandShop.method,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Submission failed.");
      }

      setSubmitted(true);
      setForm(initialState);
      setFileInputKeys(Object.fromEntries(FILE_FIELDS.map((f) => [f, 0])));
    } catch (err) {
      console.error("Brand shop submission failed:", err);
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while submitting the form. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold mb-2">
            Form for RELDA Brand Shop
          </h1>
          <p className="text-sm text-[#99A1AF]">
            Please fill in the details below to apply for a RELDA Authorized
            Brand Shop.
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-xl shadow-md px-6 md:px-16 py-4"
        >
          {/* SECTION 1 - BUSINESS INFORMATION */}
          <SectionTitle>Section 1 – Business Information</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
            <TextInput
              label="Business / Shop Name"
              required
              placeholder="Enter business / shop name"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              error={errors.businessName}
            />
            <TextInput
              label="Proprietor / Owner Name"
              required
              placeholder="Enter owner name"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              error={errors.ownerName}
            />
            <TextInput
              label="Contact Person Name"
              required
              placeholder="Enter contact person name"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              error={errors.contactPerson}
            />
            <TextInput
              label="Mobile Number"
              required
              placeholder="+91 XXXXXXXXXX"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              type="tel"
              error={errors.mobile}
            />
            <TextInput
              label="WhatsApp Number"
              required
              placeholder="+91 XXXXXXXXXX"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              type="tel"
              error={errors.whatsapp}
            />
            <TextInput
              label="Email ID"
              placeholder="Enter email address"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              error={errors.email}
            />
            <div className="sm:col-span-2">
              <TextInput
                label="Complete Shop Address"
                required
                placeholder="Enter complete shop address"
                name="address"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
              />
            </div>
            <TextInput
              label="City"
              required
              placeholder="Enter city"
              name="city"
              value={form.city}
              onChange={handleChange}
              error={errors.city}
            />
            <TextInput
              label="District"
              required
              placeholder="Enter district"
              name="district"
              value={form.district}
              onChange={handleChange}
              error={errors.district}
            />
            <TextInput
              label="State"
              required
              placeholder="Enter state"
              name="state"
              value={form.state}
              onChange={handleChange}
              error={errors.state}
            />
            <TextInput
              label="PIN Code"
              required
              placeholder="Enter PIN code"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              error={errors.pincode}
            />
            <SelectInput
              label="Business Type"
              placeholder="Select business type"
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              options={[
                "Proprietorship",
                "Partnership",
                "Private Limited",
                "LLP",
                "Others",
              ]}
              error={errors.businessType}
            />
            <TextInput
              label="Year of Establishment"
              placeholder="Enter year of establishment"
              name="yearEstablished"
              value={form.yearEstablished}
              onChange={handleChange}
              error={errors.yearEstablished}
            />
            <TextInput
              label="GST Number"
              placeholder="Enter GST number"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              error={errors.gstNumber}
            />
            <TextInput
              label="PAN Number"
              placeholder="Enter PAN number"
              name="panNumber"
              value={form.panNumber}
              onChange={handleChange}
              error={errors.panNumber}
            />
          </div>

          {/* SECTION 2 - BUSINESS CATEGORY & EXPERIENCE */}
          <SectionTitle>Section 2 – Business Category &amp; Experience</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
            <SelectInput
              label="Current Business Category"
              placeholder="Select business category"
              name="businessCategory"
              value={form.businessCategory}
              onChange={handleChange}
              options={[
                "Home Appliances",
                "Electronics",
                "Electrical",
                "Kitchen Appliances",
                "Consumer Durables",
                "Others",
              ]}
              error={errors.businessCategory}
            />
            <TextInput
              label="Which Brands Do You Currently Deal With?"
              placeholder="Enter brand names"
              name="brandsDealtWith"
              value={form.brandsDealtWith}
              onChange={handleChange}
              error={errors.brandsDealtWith}
            />
            <SelectInput
              label="Years of Experience in Retail Business"
              placeholder="Select experience"
              name="retailExperience"
              value={form.retailExperience}
              onChange={handleChange}
              options={[
                "Less than 1 Year",
                "1-3 Years",
                "3-5 Years",
                "5-10 Years",
                "More than 10 Years",
              ]}
              error={errors.retailExperience}
            />
          </div>

          {/* SECTION 3 - BRAND SHOP DETAILS */}
          <SectionTitle>Section 3 – Brand Shop Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
            <div className="sm:col-span-2">
              <TextInput
                label="Proposed Location for RELDA Brand Shop"
                placeholder="Enter proposed location"
                name="proposedLocation"
                value={form.proposedLocation}
                onChange={handleChange}
                error={errors.proposedLocation}
              />
            </div>
            <SelectInput
              label="Shop Ownership Status"
              placeholder="Select ownership status"
              name="ownershipStatus"
              value={form.ownershipStatus}
              onChange={handleChange}
              options={["Owned", "Rented", "Lease"]}
              error={errors.ownershipStatus}
            />
            <TextInput
              label="Shop Area (Sq. Ft.)"
              placeholder="Enter shop area"
              name="shopArea"
              value={form.shopArea}
              onChange={handleChange}
              error={errors.shopArea}
            />
            <TextInput
              label="Shop Frontage Width (Feet)"
              placeholder="Enter frontage width"
              name="frontageWidth"
              value={form.frontageWidth}
              onChange={handleChange}
              error={errors.frontageWidth}
            />
            <TextInput
              label="Nearby Landmark"
              placeholder="Enter nearby landmark"
              name="landmark"
              value={form.landmark}
              onChange={handleChange}
              error={errors.landmark}
            />
            <SelectInput
              label="Expected Investment Capacity"
              placeholder="Select investment capacity"
              name="investmentCapacity"
              value={form.investmentCapacity}
              onChange={handleChange}
              options={[
                "5 Lakhs",
                "10 Lakhs",
                "20 Lakhs",
                "30 Lakhs",
                "50 Lakhs",
                "Above 50 Lakhs",
              ]}
              error={errors.investmentCapacity}
            />
            <SelectInput
              label="Current Monthly Business Turnover"
              placeholder="Select monthly turnover"
              name="monthlyTurnover"
              value={form.monthlyTurnover}
              onChange={handleChange}
              options={[
                "Below 5 Lakhs",
                "5-10 Lakhs",
                "10-25 Lakhs",
                "25-50 Lakhs",
                "Above 50 Lakhs",
              ]}
              error={errors.monthlyTurnover}
            />
            <TextInput
              label="Number of Sales Staff Available"
              placeholder="Enter number of staff"
              name="salesStaff"
              value={form.salesStaff}
              onChange={handleChange}
              type="number"
              error={errors.salesStaff}
            />
            <SelectInput
              label="Average Daily Customer Footfall"
              placeholder="Select daily footfall"
              name="dailyFootfall"
              value={form.dailyFootfall}
              onChange={handleChange}
              options={[
                "Below 20 Customers/Day",
                "20-50 Customers/Day",
                "50-100 Customers/Day",
                "Above 100 Customers/Day",
              ]}
              error={errors.dailyFootfall}
            />
          </div>

          {/* SECTION 4 - SHOP INFRASTRUCTURE */}
          <SectionTitle>Section 4 – Shop Infrastructure</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
            <FileInput
              label="Shop Front Photo"
              name="shopFrontPhoto"
              files={form.shopFrontPhoto}
              onAdd={handleAddFiles}
              onRemoveOne={handleRemoveOneFile}
              onRemoveAll={handleRemoveAllFiles}
              inputKey={fileInputKeys.shopFrontPhoto}
              error={errors.shopFrontPhoto}
            />
            <FileInput
              label="Shop Interior Photos"
              name="shopInteriorPhotos"
              multiple
              files={form.shopInteriorPhotos}
              onAdd={handleAddFiles}
              onRemoveOne={handleRemoveOneFile}
              onRemoveAll={handleRemoveAllFiles}
              inputKey={fileInputKeys.shopInteriorPhotos}
              error={errors.shopInteriorPhotos}
            />
            <FileInput
              label="GST Certificate"
              name="gstCertificate"
              files={form.gstCertificate}
              onAdd={handleAddFiles}
              onRemoveOne={handleRemoveOneFile}
              onRemoveAll={handleRemoveAllFiles}
              inputKey={fileInputKeys.gstCertificate}
              error={errors.gstCertificate}
            />
            <FileInput
              label="Shop Ownership Proof / Rental Agreement (if available)"
              name="ownershipProof"
              files={form.ownershipProof}
              onAdd={handleAddFiles}
              onRemoveOne={handleRemoveOneFile}
              onRemoveAll={handleRemoveAllFiles}
              inputKey={fileInputKeys.ownershipProof}
              error={errors.ownershipProof}
            />
          </div>

          {/* SECTION 5 - ADDITIONAL INFORMATION */}
          <SectionTitle>Section 5 – Additional Information</SectionTitle>
          <div className="mb-10" data-error={errors.reasonToJoin ? "true" : "false"}>
            <Field
              label="Why would you like to open a RELDA Authorized Brand Shop?"
              required
              error={errors.reasonToJoin}
            >
              <AutoTextarea
                name="reasonToJoin"
                value={form.reasonToJoin}
                onChange={handleChange}
                placeholder="Tell us your reason"
                error={errors.reasonToJoin}
              />
            </Field>
          </div>

          {apiError && (
            <p className="mb-6 text-sm font-medium text-brand-primary">
              {apiError}
            </p>
          )}

          {submitted && (
            <p className="mb-6 text-sm font-medium text-green-600">
              Thank you! Your application has been submitted.
            </p>
          )}

          {/* BUTTON */}
          <div className="flex justify-center md:justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto px-10 py-2 rounded-md text-white text-sm font-medium bg-brand-primary hover:bg-brand-primaryHover disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}