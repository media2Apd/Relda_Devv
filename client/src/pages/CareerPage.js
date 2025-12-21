import React, { useState, useRef } from 'react';
import bannerImage from '../assest/banner/career-img.jpg';
import teamCollaboration from '../assest/banner/cr=t_5.35,w_89.webp'
import SummaryApi from '../common';

const CareerPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [educationalQualification, setEducationalQualification] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [experience, setExperience] = useState('');
  const [phone, setPhone] = useState('');
  const [summary, setSummary] = useState('');
  const [resume, setResume] = useState(null); // Handle file input
  const [errors, setErrors] = useState({}); // Tracks field-specific errors
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!educationalQualification.trim()) newErrors.educationalQualification = 'Educational Qualification is required.';
    if (!lookingFor.trim()) newErrors.lookingFor = 'This field is required.';
    if (!experience.trim()) newErrors.experience = 'Experience is required.';
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }
    if (!summary.trim()) newErrors.summary = 'Summary is required.';
    if (!resume) newErrors.resume = 'Please attach your resume.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('educationalQualification', educationalQualification);
    formData.append('lookingFor', lookingFor);
    formData.append('experience', experience);
    formData.append('phone', phone);
    formData.append('summary', summary);
    formData.append('resume', resume); // Attach the resume file

    try {
      const response = await fetch(SummaryApi.career.url, {
        method: SummaryApi.career.method,
        body: formData,
      });
      
      const data = await response.json();
      if (data.message) {
        alert('Application submitted successfully');
	setName('');
        setEmail('')
        setEducationalQualification('');
        setLookingFor('');
        setExperience('');
        setPhone('');
        setSummary('');
        setResume(null); // Reset the resume file input
        setErrors({}); // Clear errors on successful submission
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input
        }
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
};


  return (
    <div>
      {/* Banner Section */}
      <div className="relative">
        <img 
          src={bannerImage} 
          alt="Explore a Career" 
          className="w-full md:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl lg:text-6xl font-bold transition-transform transform hover:scale-105">
            EXPLORE A CAREER AT RELDA
          </h1>
        </div>
      </div>

      {/* Who We Are Section */}
      <section className="text-center py-6 md:py-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Who we are</h2>
        <p className="text-brand-textMuted max-w-2xl mx-auto text-sm md:text-base">
          Our mission is People <span className="font-bold">Work Together</span> to get a new technology.
          We take inspiration from what people want to accomplish in their lives and work to create products that empower in new ways.
          This is what drives our innovation forward.
        </p>
        <div className="mt-6 md:mt-8">
          <img src={teamCollaboration} alt="Team collaboration" className="mx-auto max-w-full h-auto" />
        </div>
      </section>

      {/* Job Application Form Section */}
      <section className="bg-brand-productCardImageBg py-6 md:py-8">
        <div className="max-w-lg mx-auto px-4 md:px-0">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-4 md:mb-6">JOIN THE TEAM !!</h2>
          <p className="text-center mb-4 md:mb-6 text-brand-textMuted">Explore exciting opportunities and apply now to join us.</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <input
                type="text"
                placeholder="Name*"
                className={`p-2 rounded bg-white border ${errors.name ? 'border-brand-primary' : 'border-brand-200'}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-brand-primary text-sm">{errors.name}</p>}

              <input
                type="email"
                placeholder="Email*"
                className={`p-2 rounded bg-white border ${errors.email ? 'border-brand-primary' : 'border-gray-200'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-brand-primary text-sm">{errors.email}</p>}

              <input
                type="text"
                placeholder="Educational Qualification*"
                className={`p-2 rounded bg-white border ${errors.educationalQualification ? 'border-brand-primary' : 'border-gray-200'}`}
                value={educationalQualification}
                onChange={(e) => setEducationalQualification(e.target.value)}
              />
              {errors.educationalQualification && (
                <p className="text-brand-primary text-sm">{errors.educationalQualification}</p>
              )}

              <input
                type="text"
                placeholder="Looking For*"
                className={`p-2 rounded bg-white border ${errors.lookingFor ? 'border-brand-primary' : 'border-gray-200'}`}
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
              />
              {errors.lookingFor && <p className="text-brand-primary text-sm">{errors.lookingFor}</p>}

              <input
                type="text"
                placeholder="Experience*"
                className={`p-2 rounded bg-white border ${errors.experience ? 'border-brand-primary' : 'border-gray-200'}`}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
              {errors.experience && <p className="text-brand-primary text-sm">{errors.experience}</p>}

              <input
                type="text"
                placeholder="Phone*"
                className={`p-2 rounded bg-white border ${errors.phone ? 'border-brand-primary' : 'border-gray-200'}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="text-brand-primary text-sm">{errors.phone}</p>}
            </div>

            <textarea
              placeholder="Write a summary about yourself..."
              className={`p-2 rounded bg-white border ${errors.summary ? 'border-brand-primary' : 'border-gray-200'} w-full`}
              rows="4"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            {errors.summary && <p className="text-brand-primary text-sm">{errors.summary}</p>}


            <label htmlFor="fileUpload" className="flex items-center justify-center p-2 mt-2 border-none rounded cursor-pointer">Attach Resume</label>
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              required
              className={`w-full my-2 p-2 bg-white border ${errors.resume ? 'border-brand-primary' : 'border-gray-200'} rounded text-gray-400`}
              onChange={(e) => setResume(e.target.files[0])}
              ref={fileInputRef}
            />
            {errors.resume && <p className="text-brand-primary text-sm">{errors.resume}</p>}

            <button
              onClick={handleSubmit}
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primaryHover text-white py-2 rounded font-semibold"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default CareerPage;
