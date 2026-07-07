import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SummaryApi from "../../src/common/index";

const initialState = {
    centerName: "",
    contactName: "",
    mobile: "",
    whatsapp: "",
    email: "",
    address: "",
    cityDistrict: "",
    state: "",
    gst: "",
    establishedYear: "",
    technicians: "",
    categories: [],
    brandsServiced: "",
    warrantyService: "",
    inShopFacility: "",
    photo: "",
    pickupDelivery: "",
    areasCovered: "",
    reason: "",
};

const ALLOWED_PHOTO_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const inputClass =
    "w-full px-2 py-2 border-b outline-none bg-transparent text-sm placeholder-[#666666] transition-colors duration-200";

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

function SelectInput({ options, value, onChange, error, placeholder = "Select an option" }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
                className={`${inputClass} flex items-center justify-between gap-2 text-left ${value.length === 0 ? "text-[#666666]" : "text-gray-900"
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

function FileInput({ onChange, onRemove, error, fileName, inputKey }) {
    const lowerName = fileName ? fileName.toLowerCase() : "";
    const isPdf = lowerName.endsWith(".pdf");
    const isExcel = lowerName.endsWith(".xls") || lowerName.endsWith(".xlsx");
    const isWord = lowerName.endsWith(".doc") || lowerName.endsWith(".docx");
    const fileIcon = fileName ? (isPdf ? "📄" : isExcel ? "📊" : isWord ? "📝" : "🖼️") : "";

    return (
        <div>
            <input
                key={inputKey}
                type="file"
                accept="image/*,.pdf,.xls,.xlsx,.doc,.docx"
                onChange={onChange}
                className={`w-full border rounded-md text-sm px-1 py-1 outline-none bg-transparent file:border-0 file:bg-[#E5E5E5] file:text-[#040404] file:px-4 file:py-1.5 file:rounded-md file:cursor-pointer ${error ? "border-[#E60000]" : "border-gray-300"
                    }`}
            />
            {fileName && (
                <div className="flex items-center justify-between gap-3 mt-2">
                    <span className="text-sm text-gray-600 truncate">
                        {fileIcon} {fileName}
                    </span>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="shrink-0 text-xs font-semibold text-[#E60000] hover:opacity-80 border border-[#E60000]/30 rounded px-2.5 py-1 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ServiceCenterForm() {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoInputKey, setPhotoInputKey] = useState(0);

    // The actual File object lives outside `form` (form.photo only holds the
    // display name), since File objects shouldn't sit in state you might
    // serialize/reset the same way as text fields.
    const photoFileRef = useRef(null);

    const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));
    const setFromEvent = (field) => (e) => set(field)(e.target.value);

    const setPhoto = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
            alert("Only Images and PDF files are allowed.");
            e.target.value = "";
            return;
        }

        photoFileRef.current = file;
        setForm((f) => ({ ...f, photo: file.name }));
    };

    const removePhoto = () => {
        photoFileRef.current = null;
        setForm((f) => ({ ...f, photo: "" }));
        setPhotoInputKey((k) => k + 1);
    };

    const validate = () => {
        const e = {};

        const requireText = (field, message) => {
            if (!form[field] || !form[field].toString().trim()) e[field] = message;
        };

        requireText("centerName", "Service Center Name is required");
        requireText("contactName", "Contact Person Name is required");
        requireText("address", "Complete Address is required");
        requireText("cityDistrict", "City / District is required");
        requireText("state", "State is required");

        if (!form.mobile.trim()) e.mobile = "Mobile Number is required";
        else if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = "Enter a valid 10-digit mobile number";

        if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp Number is required";
        else if (!/^\d{10}$/.test(form.whatsapp.trim())) e.whatsapp = "Enter a valid 10-digit WhatsApp number";

        if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            e.email = "Enter a valid email address";
        }

        if (form.gst.trim() && !/^[0-9A-Z]{15}$/.test(form.gst.trim().toUpperCase())) {
            e.gst = "Enter a valid 15-character GST number";
        }

        if (!form.technicians) e.technicians = "Please select number of technicians available";
        if (form.categories.length === 0) e.categories = "Please select at least one product category";

        return e;
    };

    // The form collects one "City / District" field, but the backend schema
    // expects `city` and `district` separately. If the user typed something
    // like "Tambaram, Chengalpattu" we split on the comma; otherwise we send
    // the same value for both so neither required field is empty.
    // Adjust this if you'd rather split the UI field into two inputs.
    const splitCityDistrict = (value) => {
        const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
        if (parts.length >= 2) return { city: parts[0], district: parts.slice(1).join(", ") };
        return { city: value.trim(), district: value.trim() };
    };

    const buildPayload = () => {
        const { city, district } = splitCityDistrict(form.cityDistrict);
        return {
            serviceCenterName: form.centerName.trim(),
            contactPerson: form.contactName.trim(),
            mobile: form.mobile.trim(),
            whatsapp: form.whatsapp.trim(),
            email: form.email.trim(),
            address: form.address.trim(),
            city,
            district,
            state: form.state.trim(),
            gstNumber: form.gst.trim().toUpperCase(),
            establishmentYear: form.establishedYear.trim(),
            // Backend enum uses plain hyphens ("1-2"); SelectInput options below
            // were updated to match exactly, so no conversion needed here.
            technicians: form.technicians,
            productCategories: form.categories,
            existingBrands: form.brandsServiced.trim(),
            warrantyService: form.warrantyService,
            inShopService: form.inShopFacility,
            pickupDelivery: form.pickupDelivery,
            serviceAreas: form.areasCovered.trim(),
            reason: form.reason.trim(),
        };
    };

    const handleSubmit = async () => {
        const foundErrors = validate();
        setErrors(foundErrors);
        setSubmitError("");

        if (Object.keys(foundErrors).length > 0) {
            setSubmitted(false);
            const firstKey = Object.keys(foundErrors)[0];
            const el = document.getElementById(`field-${firstKey}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const payload = buildPayload();

        try {
            setIsSubmitting(true);

            let response;
            if (photoFileRef.current) {
                // Multipart submission when a photo is attached.
                const formData = new FormData();
                Object.entries(payload).forEach(([key, val]) => {
                    if (Array.isArray(val)) {
                        // Controller does JSON.parse(data.productCategories) when
                        // it arrives as a string, so send arrays as JSON strings
                        // rather than repeated form-data keys.
                        formData.append(key, JSON.stringify(val));
                    } else {
                        formData.append(key, val ?? "");
                    }
                });
                // Must match upload.fields([{ name: "serviceCenterPhotos" }])
                // in the backend controller.
                formData.append("serviceCenterPhotos", photoFileRef.current);

                response = await axios({
                    url: SummaryApi.serviceCenter.url,
                    method: SummaryApi.serviceCenter.method,
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                response = await axios({
                    url: SummaryApi.serviceCenter.url,
                    method: SummaryApi.serviceCenter.method,
                    data: payload,
                    headers: { "Content-Type": "application/json" },
                });
            }

            if (response.status === 200 || response.status === 201) {
                setSubmitted(true);
                setForm(initialState);
                photoFileRef.current = null;
                setPhotoInputKey((k) => k + 1);
            }
        } catch (err) {
            setSubmitted(false);
            const message =
                err?.response?.data?.message ||
                "Something went wrong while submitting your application. Please try again.";
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-semibold mb-2">
                        RELDA Authorized Service Center Registration
                    </h1>
                    <p className="text-sm text-[#99A1AF]">
                        Please fill in all the details below to register as a RELDA Authorized Service Center.
                    </p>
                </div>

                {submitted && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-800 text-sm rounded-md px-4 py-3">
                        Your application has been submitted successfully.
                    </div>
                )}

                {submitError && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-sm rounded-md px-4 py-3">
                        {submitError}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md px-6 md:px-16 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div id="field-centerName">
                            <Field label="Service Center Name" required error={errors.centerName}>
                                <TextInput placeholder="Enter service center name" value={form.centerName} onChange={setFromEvent("centerName")} error={errors.centerName} />
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
                            <Field label="Complete Address" required full error={errors.address}>
                                <TextInput placeholder="Enter complete address" value={form.address} onChange={setFromEvent("address")} error={errors.address} />
                            </Field>
                        </div>

                        <div id="field-cityDistrict">
                            <Field label="City / District" required error={errors.cityDistrict}>
                                <TextInput placeholder="e.g. Tambaram, Chengalpattu" value={form.cityDistrict} onChange={setFromEvent("cityDistrict")} error={errors.cityDistrict} />
                            </Field>
                        </div>

                        <div id="field-state">
                            <Field label="State" required error={errors.state}>
                                <TextInput placeholder="Enter state" value={form.state} onChange={setFromEvent("state")} error={errors.state} />
                            </Field>
                        </div>

                        <div id="field-gst">
                            <Field label="GST Number (If Available)" error={errors.gst}>
                                <TextInput placeholder="Enter GST number" value={form.gst} onChange={setFromEvent("gst")} error={errors.gst} />
                            </Field>
                        </div>

                        <div id="field-establishedYear">
                            <Field label="Service Center Established Year">
                                <TextInput placeholder="Enter established year" value={form.establishedYear} onChange={setFromEvent("establishedYear")} />
                            </Field>
                        </div>

                        <div id="field-technicians">
                            <Field label="Number of Technicians Available" required error={errors.technicians}>
                                <SelectInput
                                    options={["1-2", "3-5", "6-10", "Above 10"]}
                                    value={form.technicians}
                                    onChange={set("technicians")}
                                    error={errors.technicians}
                                    placeholder="Select number of technicians"
                                />
                            </Field>
                        </div>

                        <div id="field-categories" className="col-span-1 md:col-span-2">
                            <Field label="Which Product Categories Do You Service?" required full error={errors.categories}>
                                <MultiSelectDropdown
                                    placeholder="Select product categories"
                                    options={[
                                        "Mixer Grinder",
                                        "Induction Cooktop",
                                        "Electric Iron",
                                        "Fans",
                                        "Water Heater",
                                        "Chimney",
                                        "Hob",
                                        "Small Home Appliances",
                                        "Others",
                                    ]}
                                    value={form.categories}
                                    onChange={set("categories")}
                                    error={errors.categories}
                                />
                            </Field>
                        </div>

                        <div id="field-brandsServiced" className="col-span-1 md:col-span-2">
                            <Field label="Existing Brands Currently Serviced">
                                <TextArea placeholder="Enter brands you currently service" value={form.brandsServiced} onChange={setFromEvent("brandsServiced")} />
                            </Field>
                        </div>

                        <div id="field-warrantyService" className="col-span-1 md:col-span-2">
                            <Field label="Do You Provide Warranty Service?" full>
                                <SelectInput
                                    options={["Yes", "No"]}
                                    value={form.warrantyService}
                                    onChange={set("warrantyService")}
                                    placeholder="Select yes or no"
                                />
                            </Field>
                        </div>

                        <div id="field-inShopFacility" className="col-span-1 md:col-span-2">
                            <Field label="Do You Have an In-Shop Service Facility?" full>
                                <SelectInput
                                    options={["Yes", "No"]}
                                    value={form.inShopFacility}
                                    onChange={set("inShopFacility")}
                                    placeholder="Select yes or no"
                                />
                            </Field>
                        </div>

                        <div id="field-photo" className="col-span-1 md:col-span-2">
                            <Field label="Service Center Photo Upload (Shop Front View, Service Area, Technician Team)" full variant="file">
                                <FileInput
                                    inputKey={photoInputKey}
                                    onChange={setPhoto}
                                    onRemove={removePhoto}
                                    fileName={form.photo}
                                />
                            </Field>
                        </div>

                        <div id="field-pickupDelivery" className="col-span-1 md:col-span-2">
                            <Field label="Do You Have Pickup & Delivery Service?" full>
                                <SelectInput
                                    options={["Yes", "No"]}
                                    value={form.pickupDelivery}
                                    onChange={set("pickupDelivery")}
                                    placeholder="Select yes or no"
                                />
                            </Field>
                        </div>

                        <div id="field-areasCovered" className="col-span-1 md:col-span-2">
                            <Field label="Areas Covered by Your Service Team" full>
                                <TextArea placeholder="Enter areas covered by your service team" value={form.areasCovered} onChange={setFromEvent("areasCovered")} />
                            </Field>
                        </div>

                        <div id="field-reason" className="col-span-1 md:col-span-2">
                            <Field label="Why Would You Like to Become a RELDA Authorized Service Partner?" full>
                                <TextArea placeholder="Tell us your reason" value={form.reason} onChange={setFromEvent("reason")} />
                            </Field>
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-end mt-8">
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