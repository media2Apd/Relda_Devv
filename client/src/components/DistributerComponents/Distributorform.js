import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SummaryApi from "../../common/index"; // TODO: adjust path to match where your SummaryApi.js file actually lives

const initialState = {
  shopName: "",
  ownerName: "",
  contactName: "",
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
  gst: "",
  pan: "",
  categories: [],
  brands: "",
  experience: "",
  turnover: "",
  areas: "",
  salesExecutives: "",
  deliveryVehicles: "",
  warehouse: "",
  warehouseSize: "",
  dealersSupplied: "",
  purchaseValue: "",
  investment: "",
  gstFile: null,
  shopPhoto: null,
  warehousePhoto: null,
  visitingCard: null,
  reason: "",
  comments: "",
};

// Used to force file <input> elements to remount when a file is removed,
// since file inputs are uncontrolled and can't be cleared by value alone.
const initialFileKeys = {
  gstFile: 0,
  shopPhoto: 0,
  warehousePhoto: 0,
  visitingCard: 0,
};

const inputClass =
  "w-full px-2 py-2 border-b outline-none bg-transparent text-sm placeholder-[#777777]/50 transition-colors duration-200";

function Field({ label, required, error, children, full, variant }) {
  const isFile = variant === "file";
  return (
    <div className={full ? "col-span-1 md:col-span-2" : "col-span-1"}>
      <label className={isFile ? "block text-sm font-medium text-[#99A1AF] mb-2" : "block text-sm font-medium mb-1"}>
        {label}
        {required && <span className="text-[#E60000] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#E60000] mt-1">{error}</p>}
    </div>
  );
}

function TextInput({ placeholder, type = "text", value, onChange, error }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${inputClass} ${error ? "border-[#E60000]" : "border-gray-300"}`}
    />
  );
}

function TextArea({ placeholder, value, onChange, error }) {
  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    onChange(e);
  };

  return (
    <textarea
      placeholder={placeholder}
      rows={1}
      value={value}
      onChange={handleInput}
      className={`${inputClass} resize-none overflow-hidden leading-relaxed ${error ? "border-[#E60000]" : "border-gray-300"}`}
    />
  );
}

function SelectInput({ placeholder, value, onChange, options, error }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`${inputClass} ${value === "" ? "text-[#666666]" : "text-gray-900"} ${error ? "border-[#E60000]" : "border-gray-300"}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="text-gray-900">
          {opt}
        </option>
      ))}
    </select>
  );
}

// Closing dropdown for multi-select: click to open a checkbox popup, click
// outside (or select) to close it — behaves like the single SelectInput
// above instead of an always-open checkbox list.
function MultiSelectDropdown({ placeholder = "Select options", options, value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (opt) => {
    const next = value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt];
    onChange(next);
  };

  const displayText = value.length > 0 ? value.join(", ") : placeholder;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} flex items-center justify-between gap-2 text-left ${
          value.length === 0 ? "text-[#666666]" : "text-gray-900"
        } ${error ? "border-[#E60000]" : "border-gray-300"}`}
      >
        <span className="truncate pr-2">{displayText}</span>
        <svg
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => toggleOption(opt)}
                className="accent-[#E60000] w-4 h-4"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// FileInput shows the selected file name with a "Cancel" button once a file
// has been chosen, instead of always showing the raw file picker.
function FileInput({ onChange, onRemove, error, fileName, inputKey }) {
  if (fileName) {
    return (
      <div className={`w-full flex items-center justify-between gap-3 border rounded-md p-3 bg-gray-50 ${
        error ? "border-[#E60000]" : "border-gray-300"
      }`}>
        <span className="text-sm text-gray-700 truncate">{fileName}</span>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-xs font-semibold text-[#E60000] hover:opacity-80 border border-[#E60000]/30 rounded px-2.5 py-1 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <input
      key={inputKey}
      type="file"
      onChange={onChange}
      className={`w-full border rounded-md text-sm px-1 py-1 outline-none bg-transparent file:border-0 file:bg-[#E5E5E5] file:text-[#040404] file:px-4 file:py-1.5 file:rounded-md file:cursor-pointer ${
        error ? "border-[#E60000]" : "border-gray-300"
      }`}
    />
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">{children}</div>
    </section>
  );
}

export default function DistributorForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fileKeys, setFileKeys] = useState(initialFileKeys);

  const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));
  const setFromEvent = (field) => (e) => set(field)(e.target.value);
  // Stores the real File object (needed to upload it), not just its name.
  const setFile = (field) => (e) => set(field)(e.target.files?.[0] || null);

  // Clears the selected file and remounts the <input type="file"> so the
  // same (or a different) file can be chosen again afterwards.
  const removeFile = (field) => () => {
    set(field)(null);
    setFileKeys((k) => ({ ...k, [field]: k[field] + 1 }));
  };

  const validate = () => {
    const e = {};

    const requireText = (field, message) => {
      if (!form[field] || !form[field].toString().trim()) e[field] = message;
    };

    requireText("shopName", "Business / Shop name is required");
    requireText("ownerName", "Owner name is required");
    requireText("contactName", "Contact person name is required");
    requireText("address", "Complete shop address is required");
    requireText("city", "City is required");
    requireText("district", "District is required");
    requireText("state", "State is required");
    requireText("yearEstablished", "Year of establishment is required");
    requireText("brands", "Please list the brands you distribute");
    requireText("areas", "Please list the areas / districts you can cover");
    requireText("salesExecutives", "Number of sales executives is required");

    if (!form.mobile.trim()) e.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = "Enter a valid 10-digit mobile number";

    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
    else if (!/^\d{10}$/.test(form.whatsapp.trim())) e.whatsapp = "Enter a valid 10-digit WhatsApp number";

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Enter a valid email address";
    }

    if (!form.pincode.trim()) e.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Enter a valid 6-digit PIN code";

    if (!form.gst.trim()) e.gst = "GST number is required";
    else if (!/^[0-9A-Z]{15}$/.test(form.gst.trim().toUpperCase()))
      e.gst = "Enter a valid 15-character GST number";

    if (form.pan.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.trim().toUpperCase())) {
      e.pan = "Enter a valid PAN number (e.g. ABCDE1234F)";
    }

    if (!form.experience) e.experience = "Please select your years of experience";
    if (!form.warehouse) e.warehouse = "Please select yes or no";
    if (!form.dealersSupplied) e.dealersSupplied = "Please select a range";
    if (!form.purchaseValue) e.purchaseValue = "Please select expected monthly purchase value";
    if (!form.investment) e.investment = "Please select your investment capacity";

    if (form.warehouse === "YES" && !form.warehouseSize.trim()) {
      e.warehouseSize = "Please enter the warehouse size";
    }

    if (!form.gstFile) e.gstFile = "Please upload your GST certificate";
    if (!form.shopPhoto) e.shopPhoto = "Please upload a shop photo";
    if (!form.warehousePhoto) e.warehousePhoto = "Please upload a warehouse photo";

    return e;
  };

  // Maps form fields onto the backend's expected field names and packs
  // everything (including files) into a multipart FormData payload.
  // Unlike the dealer form, this schema has no enum restrictions on
  // experience/monthlyTurnover/expectedPurchase/investmentCapacity, so no
  // currency-symbol/dash normalization is required here.
  const buildFormData = () => {
    const fd = new FormData();

    fd.append("businessName", form.shopName);
    fd.append("proprietorName", form.ownerName);
    fd.append("contactPerson", form.contactName);
    fd.append("mobile", form.mobile);
    fd.append("whatsapp", form.whatsapp);
    fd.append("email", form.email);
    fd.append("address", form.address);
    fd.append("city", form.city);
    fd.append("district", form.district);
    fd.append("state", form.state);
    fd.append("pinCode", form.pincode);
    fd.append("businessType", form.businessType);
    fd.append("establishmentYear", form.yearEstablished);
    fd.append("gstNumber", form.gst);
    fd.append("panNumber", form.pan);

    form.categories.forEach((cat) => fd.append("productCategories", cat));

    fd.append("distributedBrands", form.brands);
    fd.append("experience", form.experience);
    fd.append("monthlyTurnover", form.turnover);
    fd.append("coverageAreas", form.areas);
    fd.append("salesExecutives", form.salesExecutives);
    fd.append("deliveryVehicles", form.deliveryVehicles);
    // Mongoose can only auto-cast "true"/"false" (or "1"/"0") to Boolean,
    // not "YES"/"NO" - so convert here before sending.
    fd.append("warehouseAvailable", form.warehouse === "YES" ? "true" : "false");
    fd.append("warehouseSize", form.warehouseSize);
    fd.append("dealersCount", form.dealersSupplied);
    fd.append("expectedPurchase", form.purchaseValue);
    fd.append("investmentCapacity", form.investment);
    fd.append("reason", form.reason);
    fd.append("additionalComments", form.comments);

    if (form.gstFile) fd.append("gstCertificate", form.gstFile);
    if (form.shopPhoto) fd.append("shopPhoto", form.shopPhoto);
    if (form.warehousePhoto) fd.append("warehousePhoto", form.warehousePhoto);
    if (form.visitingCard) fd.append("visitingCard", form.visitingCard);

    return fd;
  };

  const handleSubmit = async () => {
    const foundErrors = validate();
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) {
      setSubmitted(false);
      const firstKey = Object.keys(foundErrors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const formData = buildFormData();
      // Don't set Content-Type manually - the browser needs to generate it
      // itself (including the multipart boundary) based on the FormData
      // object, or multer will throw "Unexpected field" on the server.
      await axios({
        url: SummaryApi.distributor.url,
        method: SummaryApi.distributor.method,
        data: formData,
      });
      setSubmitted(true);
      toast.success("Thank you! Your application has been submitted.");
      setForm(initialState);
      setFileKeys(initialFileKeys);
    } catch (err) {
      setSubmitted(false);
      const message =
        err?.response?.data?.message ||
        "Something went wrong while submitting your application. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="form" className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold mb-2">RELDA Authorized Distributor Application</h1>
          <p className="text-sm text-[#99A1AF]">
            Please fill in all the details below to apply as a RELDA Authorized Distributor.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 text-sm rounded-md px-4 py-3">
            Your application has been submitted successfully.
          </div>
        )}

        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-[#E60000] text-sm rounded-md px-4 py-3">
            {submitError}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md px-6 md:px-16 py-8">
          <Section title="Section 1 – Business Information">
            <div id="field-shopName">
              <Field label="Business / Shop Name" required error={errors.shopName}>
                <TextInput placeholder="Enter business / shop name" value={form.shopName} onChange={setFromEvent("shopName")} error={errors.shopName} />
              </Field>
            </div>
            <div id="field-ownerName">
              <Field label="Proprietor / Owner Name" required error={errors.ownerName}>
                <TextInput placeholder="Enter owner name" value={form.ownerName} onChange={setFromEvent("ownerName")} error={errors.ownerName} />
              </Field>
            </div>
            <div id="field-contactName">
              <Field label="Contact Person Name" required error={errors.contactName}>
                <TextInput placeholder="Enter contact person name" value={form.contactName} onChange={setFromEvent("contactName")} error={errors.contactName} />
              </Field>
            </div>
            <div id="field-mobile">
              <Field label="Mobile Number" required error={errors.mobile}>
                <TextInput type="tel" placeholder="+91 XXXXXXXXXX" value={form.mobile} onChange={setFromEvent("mobile")} error={errors.mobile} />
              </Field>
            </div>
            <div id="field-whatsapp">
              <Field label="WhatsApp Number" required error={errors.whatsapp}>
                <TextInput type="tel" placeholder="+91 XXXXXXXXXX" value={form.whatsapp} onChange={setFromEvent("whatsapp")} error={errors.whatsapp} />
              </Field>
            </div>
            <div id="field-email">
              <Field label="Email ID" error={errors.email}>
                <TextInput type="email" placeholder="Enter email address" value={form.email} onChange={setFromEvent("email")} error={errors.email} />
              </Field>
            </div>
            <div id="field-address" className="col-span-1 md:col-span-2">
              <Field label="Complete Shop Address" required full error={errors.address}>
                <TextInput placeholder="Enter complete shop address" value={form.address} onChange={setFromEvent("address")} error={errors.address} />
              </Field>
            </div>
            <div id="field-city">
              <Field label="City" required error={errors.city}>
                <TextInput placeholder="Enter city" value={form.city} onChange={setFromEvent("city")} error={errors.city} />
              </Field>
            </div>
            <div id="field-district">
              <Field label="District" required error={errors.district}>
                <TextInput placeholder="Enter district" value={form.district} onChange={setFromEvent("district")} error={errors.district} />
              </Field>
            </div>
            <div id="field-state">
              <Field label="State" required error={errors.state}>
                <TextInput placeholder="Enter state" value={form.state} onChange={setFromEvent("state")} error={errors.state} />
              </Field>
            </div>
            <div id="field-pincode">
              <Field label="PIN Code" required error={errors.pincode}>
                <TextInput placeholder="Enter PIN code" value={form.pincode} onChange={setFromEvent("pincode")} error={errors.pincode} />
              </Field>
            </div>
          </Section>

          <Section title="Section 2 – Business Details">
            <div id="field-businessType">
              <Field label="Business Type">
                <SelectInput
                  placeholder="Select business type"
                  options={["Proprietorship", "Partnership", "Private Limited", "LLP", "Other"]}
                  value={form.businessType}
                  onChange={setFromEvent("businessType")}
                />
              </Field>
            </div>
            <div id="field-yearEstablished">
              <Field label="Year of Establishment" required error={errors.yearEstablished}>
                <TextInput placeholder="Enter year of establishment" value={form.yearEstablished} onChange={setFromEvent("yearEstablished")} error={errors.yearEstablished} />
              </Field>
            </div>
            <div id="field-gst">
              <Field label="GST Number" required error={errors.gst}>
                <TextInput placeholder="Enter GST number" value={form.gst} onChange={setFromEvent("gst")} error={errors.gst} />
              </Field>
            </div>
            <div id="field-pan">
              <Field label="PAN Number (Optional)" error={errors.pan}>
                <TextInput placeholder="Enter PAN number" value={form.pan} onChange={setFromEvent("pan")} error={errors.pan} />
              </Field>
            </div>
          </Section>

          <Section title="Section 3 – Business Profile">
            <div id="field-categories" className="col-span-1 md:col-span-2">
              <Field label="Which Product Categories Do You Sell?" full>
                <MultiSelectDropdown
                  placeholder="Select product categories"
                  options={["Home Appliances", "Kitchen Appliances", "Electronics", "Electrical Products", "Consumer Durables", "Others (Please Specify)"]}
                  value={form.categories}
                  onChange={set("categories")}
                />
              </Field>
            </div>
            <div id="field-brands" className="col-span-1 md:col-span-2">
              <Field label="Which Brands Do You Currently Distribute?" required full error={errors.brands}>
                <TextArea placeholder="Enter brands you currently distribute" value={form.brands} onChange={setFromEvent("brands")} error={errors.brands} />
              </Field>
            </div>
            <div id="field-experience">
              <Field label="Years of Experience in Distribution Business" required error={errors.experience}>
                <SelectInput
                  placeholder="Select experience"
                  options={["Less than 1 Year", "1–3 Years", "3–5 Years", "5–10 Years", "More than 10 Years"]}
                  value={form.experience}
                  onChange={setFromEvent("experience")}
                  error={errors.experience}
                />
              </Field>
            </div>
            <div id="field-turnover">
              <Field label="Average Monthly Sales Turnover">
                <SelectInput
                  placeholder="Select monthly turnover"
                  options={["Below ₹2 Lakhs", "₹2–5 Lakhs", "₹5–10 Lakhs", "Above ₹10 Lakhs"]}
                  value={form.turnover}
                  onChange={setFromEvent("turnover")}
                />
              </Field>
            </div>
          </Section>

          <Section title="Section 4 – Coverage & Infrastructure">
            <div id="field-areas" className="col-span-1 md:col-span-2">
              <Field label="Which Areas / Districts Can You Cover?" required full error={errors.areas}>
                <TextArea placeholder="Enter areas / districts you can cover" value={form.areas} onChange={setFromEvent("areas")} error={errors.areas} />
              </Field>
            </div>
            <div id="field-salesExecutives">
              <Field label="Number of Sales Executives" required error={errors.salesExecutives}>
                <TextInput placeholder="Enter number of sales executives" value={form.salesExecutives} onChange={setFromEvent("salesExecutives")} error={errors.salesExecutives} />
              </Field>
            </div>
            <div id="field-deliveryVehicles">
              <Field label="Number of Delivery Vehicles">
                <TextInput placeholder="Enter number of delivery vehicles" value={form.deliveryVehicles} onChange={setFromEvent("deliveryVehicles")} />
              </Field>
            </div>
            <div id="field-warehouse">
              <Field label="Do You Have a Warehouse?" required error={errors.warehouse}>
                <SelectInput
                  placeholder="Select yes or no"
                  options={["YES", "NO"]}
                  value={form.warehouse}
                  onChange={setFromEvent("warehouse")}
                  error={errors.warehouse}
                />
              </Field>
            </div>
            <div id="field-warehouseSize">
              <Field label="Warehouse Size (Sq. Ft.)" error={errors.warehouseSize}>
                <TextInput placeholder="Enter warehouse size" value={form.warehouseSize} onChange={setFromEvent("warehouseSize")} error={errors.warehouseSize} />
              </Field>
            </div>
            <div id="field-dealersSupplied">
              <Field label="Approximate Number of Dealers / Retailers You Currently Supply" required error={errors.dealersSupplied}>
                <SelectInput
                  placeholder="Select a range"
                  options={["Below 50", "50–100", "101–250", "Above 250"]}
                  value={form.dealersSupplied}
                  onChange={setFromEvent("dealersSupplied")}
                  error={errors.dealersSupplied}
                />
              </Field>
            </div>
          </Section>

          <Section title="Section 5 – Business Capacity">
            <div id="field-purchaseValue">
              <Field label="Expected Monthly Purchase Value from RELDA" required error={errors.purchaseValue}>
                <SelectInput
                  placeholder="Select expected monthly purchase value"
                  options={["₹2–5 Lakhs", "₹5–10 Lakhs", "₹10–20 Lakhs", "Above ₹20 Lakhs"]}
                  value={form.purchaseValue}
                  onChange={setFromEvent("purchaseValue")}
                  error={errors.purchaseValue}
                />
              </Field>
            </div>
            <div id="field-investment">
              <Field label="Investment Capacity" required error={errors.investment}>
                <SelectInput
                  placeholder="Select investment capacity"
                  options={["₹5 Lakhs", "₹10 Lakhs", "₹20 Lakhs", "₹50 Lakhs", "Above ₹1 Crore"]}
                  value={form.investment}
                  onChange={setFromEvent("investment")}
                  error={errors.investment}
                />
              </Field>
            </div>
          </Section>

          <Section title="Section 6 – Document Upload">
            <div id="field-gstFile">
              <Field label="Upload GST Certificate" required variant="file" error={errors.gstFile}>
                <FileInput
                  inputKey={fileKeys.gstFile}
                  onChange={setFile("gstFile")}
                  onRemove={removeFile("gstFile")}
                  error={errors.gstFile}
                  fileName={form.gstFile?.name}
                />
              </Field>
            </div>
            <div id="field-shopPhoto">
              <Field label="Upload Shop Photo" required variant="file" error={errors.shopPhoto}>
                <FileInput
                  inputKey={fileKeys.shopPhoto}
                  onChange={setFile("shopPhoto")}
                  onRemove={removeFile("shopPhoto")}
                  error={errors.shopPhoto}
                  fileName={form.shopPhoto?.name}
                />
              </Field>
            </div>
            <div id="field-warehousePhoto">
              <Field label="Upload Warehouse Photo" required variant="file" error={errors.warehousePhoto}>
                <FileInput
                  inputKey={fileKeys.warehousePhoto}
                  onChange={setFile("warehousePhoto")}
                  onRemove={removeFile("warehousePhoto")}
                  error={errors.warehousePhoto}
                  fileName={form.warehousePhoto?.name}
                />
              </Field>
            </div>
            <div id="field-visitingCard">
              <Field label="Upload Business Visiting Card (Optional)" variant="file">
                <FileInput
                  inputKey={fileKeys.visitingCard}
                  onChange={setFile("visitingCard")}
                  onRemove={removeFile("visitingCard")}
                  fileName={form.visitingCard?.name}
                />
              </Field>
            </div>
          </Section>

          <Section title="Section 7 – Additional Information">
            <div id="field-reason" className="col-span-1 md:col-span-2">
              <Field label="Why would you like to become a RELDA Authorized Distributor?" full>
                <TextArea placeholder="Tell us your reason" value={form.reason} onChange={setFromEvent("reason")} />
              </Field>
            </div>
            <div id="field-comments" className="col-span-1 md:col-span-2">
              <Field label="Additional Comments or Information" full>
                <TextArea placeholder="Any additional comments" value={form.comments} onChange={setFromEvent("comments")} />
              </Field>
            </div>
          </Section>

          <div className="flex justify-center md:justify-end mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full md:w-auto px-10 py-2 rounded-md text-white text-sm font-medium bg-[#E60000] hover:bg-[#cc0000] active:bg-[#b30000] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}