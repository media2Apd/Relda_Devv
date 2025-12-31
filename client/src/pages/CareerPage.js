// import React, { useState, useRef } from "react";
// import bannerImage from "../assest/banner/career-img.jpg";
// import teamCollaboration from "../assest/banner/cr=t_5.35,w_89.webp";
// import SummaryApi from "../common";

// const CareerPage = () => {
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
//     if (!formData.email) {
//       e.email = "Email is required";
//     } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
//       e.email = "Enter valid email";
//     }
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
//     Object.entries(formData).forEach(([key, value]) =>
//       fd.append(key, value)
//     );

//     try {
//       setLoading(true);
//       await fetch(SummaryApi.career.url, {
//         method: SummaryApi.career.method,
//         body: fd,
//       });

//       alert("Application submitted successfully");
//       setFormData({
//         name: "",
//         email: "",
//         educationalQualification: "",
//         lookingFor: "",
//         experience: "",
//         phone: "",
//         summary: "",
//         resume: null,
//       });
//       setErrors({});
//       fileInputRef.current.value = "";
//     } finally {
//       setLoading(false);
//     }
//   };

//  const inputClass =
//   "w-full px-2 py-2 border-b outline-none bg-transparent text-sm transition-colors duration-200";

//   return (
//     <div>
//       {/* Banner */}
//       <div className="relative">
//         <img src={bannerImage} alt="banner" className="w-full md:h-[400px] object-cover" />
//         <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//           <h1 className="text-white text-2xl md:text-5xl font-bold">
//             EXPLORE A CAREER AT RELDA
//           </h1>
//         </div>
//       </div>

//       {/* Who We Are */}
//       <section className="text-center py-10">
//         <h2 className="text-2xl font-semibold mb-4">Who we are</h2>
//         <p className="max-w-2xl mx-auto text-brand-textMuted">
//           Our mission is People <b>Work Together</b> to get a new technology.
//         </p>
//         <img src={teamCollaboration} alt="team" className="mx-auto mt-6" />
//       </section>

//       {/* FORM */}
//       <section className="px-4 py-10">
//         <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md px-6 md:px-16 py-8">
//           <h2 className="text-2xl font-bold text-center mb-6">
//             JOIN THE TEAM !!
//           </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">

//           {/* INPUT GRID */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               ["name", "Name", "Jhon Doe"],
//               ["email", "Email", "johndoe@gmail.com"],
//               ["educationalQualification", "Educational Qualification", "Educational Qualification"],
//               ["lookingFor", "Looking For", "Looking For"],
//               ["experience", "Experience", "Enter your experience"],
//               ["phone", "Phone", "+91 2345678901"],
//             ].map(([key, label, placeholder]) => (
//               <div key={key}>
//                 <label className="text-sm font-medium">{label}</label>
//                 <input
//                   name={key}
//                   placeholder={placeholder}
//                   value={formData[key]}
//                   onChange={(e) =>
//                     setFormData({ ...formData, [key]: e.target.value })
//                   }
//                   className={`${inputClass} ${
//                     errors[key]
//                       ? "border-brand-primary"
//                       : "border-brand-productCardBorder"
//                   }`}
//                 />
//                 <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
//                   {errors[key] || ""}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* SUMMARY – FULL WIDTH */}
//           <div>
//             <label className="text-sm font-medium">Summary</label>
//             <textarea
//               rows="3"
//               value={formData.summary}
//               placeholder="Write us a message"
//               onChange={(e) =>
//                 setFormData({ ...formData, summary: e.target.value })
//               }
//               className={`${inputClass} ${
//                 errors.summary
//                   ? "border-brand-primary"
//                   : "border-brand-productCardBorder"
//               }`}
//             />
//             <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
//               {errors.summary || ""}
//             </p>
//           </div>

//           {/* RESUME */}
//           <div>
//             <p className="text-sm text-[#99A1AF] mb-2 font-medium">Attach Resume</p>
//             <input
//               type="file"
//               ref={fileInputRef}
//               accept=".pdf,.doc,.docx"
//               onChange={(e) =>
//                 setFormData({ ...formData, resume: e.target.files[0] })
//               }
//               className={`w-full border rounded-md text-sm px-2 py-1
//                 ${
//                   errors.resume
//                     ? "border-brand-primary"
//                     : "border-brand-productCardBorder"
//                 }
//                 file:border-0
//                 file:bg-[#E5E5E5]
//                 file:text-[#040404]
//                 file:px-4
//                 file:py-1.5
//                 file:rounded-md
//                 file:cursor-pointer
//               `}
//             />
//             <p className="text-xs text-brand-primary mt-1 min-h-[14px]">
//               {errors.resume || ""}
//             </p>
//           </div>

//           {/* BUTTON */}
//           <div className="flex justify-center md:justify-end">
//             <button
//               disabled={loading}
//               className={`w-full md:w-auto px-10 py-2 rounded-md text-white text-sm font-medium
//                 ${
//                   loading
//                     ? "bg-brand-primaryHover"
//                     : "bg-brand-primary hover:bg-brand-primaryHover"
//                 }`}
//             >
//               {loading ? "Submitting..." : "Submit Application"}
//             </button>
//           </div>
//         </form>

//         </div>
//       </section>
//     </div>
//   );
// };

// export default CareerPage;

import { MapPin, MoveUpRight, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import career1 from "../assest/career/Career1.png";
import career2 from "../assest/career/Career2.png";
import career3 from "../assest/career/Career3.png";
import career4 from "../assest/career/Career4.png";
import career5 from "../assest/career/Career5.png";
import careerCardImg from "../assest/career/CareerCardImg.png";
import CareerApplicationForm from "../components/CareerApplicationForm";

const jobsData = [
    {
      title: "Branch Manager",
      location: "Chennai",
      desc: "Lead branch operations, drive sales, and ensure an outstanding customer experience.",
    },
    {
      title: "Regional Manager",
      location: "Chennai",
      desc: "Lead multiple branches, drive regional sales growth, ensure operational excellence, and build high-performing teams.",
    },
    {
      title: "Area Sales Manager",
      location: "Chennai",
      desc: "Drive regional sales growth, build strong dealer & showroom networks, and achieve revenue targets.",
    },
    {
      title: "Area Sales Executive",
      location: "Chennai",
      desc: "Drive regional sales growth, manage dealer/retail networks, and expand market presence.",
    },
    {
      title: "Direct Selling Women",
      location: "Chennai",
      desc: "Engage directly with customers, explain products confidently, build trust, and drive sales through relationship-based selling.",
    },

  ]

const Careers = () => {
  const [openModal, setOpenModal] = useState(false);
const [searchTitle, setSearchTitle] = useState("");
const [searchLocation, setSearchLocation] = useState("");
const [filteredJobs, setFilteredJobs] = useState(jobsData);


const filterJobs = (title, location) => {
  const filtered = jobsData.filter((job) => {
    const titleMatch = job.title
      .toLowerCase()
      .includes(title.toLowerCase());

    const locationMatch = job.location
      .toLowerCase()
      .includes(location.toLowerCase());

    return titleMatch && locationMatch;
  });

  setFilteredJobs(filtered);
};

useEffect(() => {
  filterJobs(searchTitle, searchLocation);
}, [searchTitle, searchLocation]);

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    filterJobs(searchTitle, searchLocation);
  }
};

const handleClearSearch = () => {
  setSearchTitle("");
  setSearchLocation("");
  setFilteredJobs(jobsData);
};

  return (
    <div className="w-full bg-white">

      {/* ================= HERO SECTION ================= */}
      <section className="mx-auto px-4 sm:px-6 lg:px-12 py-10 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Careers at <span className="text-brand-primary">RELDA India</span>
            </h1>

            <p className="leading-relaxed mb-4">
              At RELDA India, we are more than a home and kitchen appliance brand—
              we are on a <span className="text-brand-primary">mission to transform homes</span> and make modern living
              accessible to every Indian family.
            </p>

            <p className="leading-relaxed mb-4">
              Behind every reliable, affordable, and innovative product is a team
              of passionate individuals driving change, innovation, and impact.
            </p>

            <p className="text-brand-primary font-medium mb-6">
              We believe that our people are our greatest strength.
            </p>

            <button className="bg-brand-primary text-white px-6 py-2 rounded-md text-sm font-medium hover:opacity-90 transition">
              View Open Positions
            </button>
          </div>

          {/* RIGHT IMAGE PLACEHOLDER */}
          <div className=" bg-gray-200 rounded-lg">
            <img alt="card" src={careerCardImg} className="w-full h-[400px] rounded-lg"/>
          </div>
        </div>

        <div className="px-2 pt-8 max-w-3xl xl:max-w-5xl mx-auto text-left md:text-center ">
          <p>
            Every employee at RELDA India contributes to building a future where <span className="text-brand-primary">quality, trust, and affordability</span> are at the heart of Indian homes. Whether you're a fresh graduate, a seasoned professional, or an innovator with a bold idea, RELDA India is a place where your work makes a tangible difference.
          </p>
        </div>
      </section>

      {/* ================= WHY JOIN SECTION ================= */}
      <section className="mx-auto px-4 lg:px-12 py-10">

        <p className="text-center text-brand-primary text-sm  md:text-base font-regular mb-2">
          Benefits & Culture
        </p>

        <h2 className="text-center text-2xl lg:text-3xl font-medium mb-10">
          Why Join RELDA India?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {[
            {
              title: "Make an Impact",
              img: career1,
              desc: "Your work will directly influence products that touch the lives of millions of families across India. Every solution we create is designed to solve real problems and bring convenience, efficiency, and joy into homes."
            },
            {
              title: "Culture of Innovation",
              img: career2,
              desc: "We embrace creativity and innovation at every level. Your ideas will be encouraged, nurtured, and implemented to make RELDA products better and more accessible."
            },
            {
              title: "Growth & Development",
              img: career3,
              desc: "We are committed to your personal and professional growth. From learning programs to mentorship opportunities, we provide the tools and support to help you achieve your career goals."
            },
            {
              title: "Inclusive & Collaborative Environment",
              img: career4,
              desc: "At RELDA India, diversity is our strength. We celebrate different perspectives and foster a culture of collaboration, respect, and teamwork."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex gap-4 items-start"
            >
              {/* ICON */}
              <div className="w-11 h-11 min-w-[44px] flex items-center justify-center bg-gradient-to-r from-[#D80A07] to-[#B70300] rounded-lg">
              <img alt="img" src={item.img} className="w-8 h-8"/>
              </div>

              {/* CONTENT */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

          {/* CENTERED LAST CARD */}
          <div className="md:col-span-2 flex justify-center">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex gap-4 items-start max-w-2xl w-full">
              
              <div className="w-11 h-11 min-w-[44px] flex items-center justify-center bg-gradient-to-r from-[#D80A07] to-[#B70300] rounded-lg">
                <img alt="img" src={career5} className="text-white w-8 h-8"/>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Proudly Made in India
                </h3>

                <p className="text-sm leading-relaxed">
                  Joining RELDA means being part of a brand that is truly home-grown,
                  committed to empowering rural and urban communities alike. Every
                  product we deliver embodies the values of quality, reliability, and
                  affordability.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14">

        <p className="text-center text-brand-primary text-sm md:text-base font-medium mb-2">
          Join our Team
        </p>

        <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-4">
          Who We Are Looking For
        </h2>

        <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
          We are always on the lookout for talented, motivated, and passionate
          individuals across various domains.
        </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12 max-w-6xl mx-auto">

        {[
          "Product Development & Engineering",
          "Sales & Marketing",
          "Operations & Supply Chain",
          "Customer Experience & Support",
          "Technology & Innovation",
        ].map((role, i) => {

          let colStart = "";
          if (i === 3) colStart = "lg:col-start-2"; // 4th card
          if (i === 4) colStart = "lg:col-start-4"; // 5th card

          return (
            <div
              key={i}
              className={`
                relative bg-white rounded-xl
                px-6 py-8
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                text-center
                lg:col-span-2 border-l-2 border-brand-primary
                ${colStart}
              `}
            >

              <p className="text-sm font-medium leading-snug max-w-[200px] mx-auto">
                {role}
              </p>
            </div>
          );
        })}

      </div>

      </section>


      {/* ================= CTA SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16">
        <div className="rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 text-center">
          <h3 className="text-2xl font-semibold mb-8">
            Are You Ready to Make a Difference?
          </h3>

          <p className="max-w-2xl mx-auto">
            If you are ambitious, solution-oriented, and driven to make a real
            impact, RELDA India is the place to grow, learn, and leave your mark.
          </p>
        </div>
      </section>

      <section className="bg-[#F4F6F8] py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* ---------- HEADER ---------- */}
          <p className="text-center text-brand-primary text-sm font-medium mb-2">
            Current Openings
          </p>

          <h2 className="text-center text-3xl sm:text-3xl font-semibold mb-3">
            Opportunities Available
          </h2>

          <p className="text-center text-gray-500 mb-10">
            Join our growing team across India
          </p>

{/* ---------- SEARCH BAR ---------- */}
<div className="bg-white rounded-lg shadow-sm flex flex-col sm:flex-row items-center gap-3 p-3 max-w-6xl mx-auto mb-16 border border-[#E5E5E5]">

  {/* JOB TITLE */}
  <div className="flex items-center gap-2 w-full px-3">
    <Search strokeWidth={1} className="w-6 h-6" />
    <input
      type="text"
      placeholder="Job Title or Keywords"
      className="w-full outline-none text-sm placeholder:text-[#666666]"
      value={searchTitle}
      onChange={(e) => setSearchTitle(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  </div>

  <div className="hidden sm:block h-6 w-px bg-[#999999]"></div>

  {/* LOCATION */}
  <div className="flex items-center gap-2 w-full px-3">
    <MapPin strokeWidth={1} className="w-6 h-6" />
    <input
      type="text"
      placeholder="Location"
      className="w-full outline-none text-sm placeholder:text-[#666666]"
      value={searchLocation}
      onChange={(e) => setSearchLocation(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  </div>

  {/* ACTION BUTTONS */}
  <div className="flex gap-2">
    <button
      onClick={() => filterJobs(searchTitle, searchLocation)}
      className="bg-brand-primary text-white text-sm px-6 py-1.5 rounded-md"
    >
      Search
    </button>

    {(searchTitle || searchLocation) && (
      <button
        onClick={handleClearSearch}
        className="text-sm px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
      >
        Clear
      </button>
    )}
  </div>

</div>


          {/* ---------- JOB CARDS GRID ---------- */}
<div className="max-w-6xl mx-auto">

  {filteredJobs.length === 0 ? (
    <p className="text-center text-gray-500 py-10">
      No jobs found matching your search.
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">

      {filteredJobs.map((job, i) => {
        const isLast = i === 4;

        return (
          <div
            key={i}
            className={`
              relative bg-white rounded-2xl
              px-8 py-8
              lg:col-span-2
              ${isLast ? "lg:col-start-2" : ""}
            `}
          >
            {/* CUT-OUT CORNER + ARROW */}
            <div className="absolute -top-4 -right-4 bg-[#F4F6F8] w-20 h-20 rounded-full flex items-center justify-center">
              <div
                className="w-12 h-12 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-lg cursor-pointer"
                onClick={() => setOpenModal(true)}
              >
                <MoveUpRight />
              </div>
            </div>

            {/* CONTENT */}
            <h3 className="text-brand-primary text-xl font-medium mb-4">
              {job.title}
            </h3>

            <p className="leading-relaxed max-w-md">
              {job.desc}
            </p>
          </div>
        );
      })}

    </div>
  )}
</div>

        </div>
      </section>
      {openModal && (
        <CareerApplicationForm onClose={() => setOpenModal(false)} />
      )}


    </div>
  );
};

export default Careers;
