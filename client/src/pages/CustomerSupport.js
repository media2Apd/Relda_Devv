import React, { useEffect, useState } from 'react';
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5";
import { BsYoutube } from "react-icons/bs";
import SummaryApi from '../common';

const CustomerSupport = () => {
  const [showForm, setShowForm] = useState(null); // Track which form to show

  useEffect(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    document.getElementById(days[today]).classList.add('text-white');
  }, []);

  const toggleForm = (formType) => {
    setShowForm(showForm === formType ? null : formType);
  };

  const handleCancel = (formType) => {
    if (formType === 'complaint') {
      // Redirect to the main Customer Support page
      window.location.href = '/CustomerSupport';  // or use navigate('/customer-support') if using React Router
    } else if (formType === 'enquiry') {
      // Redirect to the enquiry form page
      window.location.href = '/CustomerSupport';
    }
  };

  const handleSubmitComplaint = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await fetch(SummaryApi.complaintSupport.url, {
        method: SummaryApi.complaintSupport.method,
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        alert('Your complaint has been submitted successfully.');
	event.target.reset(); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to submit your complaint.'}`);
      }
    } catch (error) {
      alert('There was a problem connecting to the server. Please try again later.');
      console.error('Fetch error:', error);
    }
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const message = event.target.message.value;
    const phone = event.target.phone.value;
    const address = event.target.address.value;
    const pincode = event.target.pincode.value;

    try {
      const response = await fetch(SummaryApi.customerSupport.url, {
        method: SummaryApi.customerSupport.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message, phone, address, pincode }),
      });

      if (response.ok) {
        alert('Your message has been sent successfully.');
	event.target.reset(); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to send your message.'}`);
      }
    } catch (error) {
      alert('There was a problem connecting to the server. Please try again later.');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto bg-gray-900 text-gray-400">
      {!showForm ? (
        <div className="text-center">
          <h1 className="text-center text-2xl font-semibold mb-4 text-white">CUSTOMER SUPPORT</h1>
          <hr className="border-gray-300 mb-4" />
          <h2>WE ARE ALWAYS HERE TO SUPPORT OUR CUSTOMERS..!</h2>
          <a href="https://wa.me/919884890934" target="_blank" rel="noopener noreferrer">
            <button className="bg-green-500 text-white py-2 px-4 mt-6 rounded hover:bg-green-600">Message us on WhatsApp</button>
          </a>
          <div className="flex flex-wrap justify-around mt-8 space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2 p-2 text-center md:text-center">
              <h4 className="text-f9f9f9">RELDA INDIA</h4>
              <p>Registered Office: Plot No 17A</p>
              <p>Majestic Avenue, Krishna Nagar,</p>
              <p>Madhavaram Milk Colony, Chennai, Tamil Nadu 600051.</p><br></br>
              <p>09884890934</p>
              <p><a href="mailto:support@reldaindia.com" className="hover:text-white">support@reldaindia.com</a></p>
            </div>
            <div className="w-full md:w-1/2 p-2 text-center md:text-center">
              <h4 className="text-f9f9f9">Working Hours</h4>
              <p id="monday">Mon 09:00 am - 05:00 pm</p>
              <p id="tuesday">Tue 09:00 am - 05:00 pm</p>
              <p id="wednesday">Wed 09:00 am - 05:00 pm</p>
              <p id="thursday">Thu 09:00 am - 05:00 pm</p>
              <p id="friday">Fri 09:00 am - 05:00 pm</p>
              <p id="saturday">Sat 09:00 am - 05:00 pm</p>
              <p id="sunday">Sun Closed</p>
            </div>
          </div>
          <button onClick={() => toggleForm('enquiry')} className="bg-red-600 text-white py-2 px-4 mt-6 rounded hover:bg-gray-500">ENQUIRIES</button>
          <button onClick={() => toggleForm('complaint')} className="bg-blue-600 text-white py-2 px-4 mt-6 ml-4 rounded hover:bg-gray-500">COMPLAINT</button>
          <div className="text-center py-10">
            <h2 className="text-white">CONNECT WITH US</h2>
            <hr className="my-4 border-white" />
            <div className="flex justify-center space-x-6">
              <a href="https://www.facebook.com/reldaindia" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-white"><IoLogoFacebook /></a>
              <a href="https://www.instagram.com/reldaindia/?hl=en" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-white"><IoLogoInstagram /></a>
              {/* <a href="https://x.com/i/flow/login?redirect_after_login=%2FElectronicsElda" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-white"><BsTwitterX /></a> */}
              <a href="https://www.youtube.com/channel/UClkiHCA4tVLtbtIc2fjhCgQ" target="_blank" rel="noopener noreferrer" className="text-2xl text-black-400 hover:text-white"><BsYoutube /> </a>
            </div>
          </div>
        </div>
      ) : showForm === 'complaint' ? (
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-white">CUSTOMER SUPPORT - COMPLAINT</h1>
          <hr className="my-4 border-white" />
          <h3 className="my-4 text-xl">COMPLAINT</h3>
          <form id="complaint-form" onSubmit={handleSubmitComplaint} className="space-y-4">
            <input type="text" name="customerName" placeholder="Customer Name*" required className="w-full p-3 text-black rounded" />
            <input type="text" name="orderID" placeholder="Order ID*" required className="w-full p-3 text-black rounded" />
            <input type="tel" name="mobileNumber" placeholder="Mobile Number*" required className="w-full p-3 text-black rounded" />
            <input type="email" name="email" placeholder="Email*" required className="w-full p-3 text-black rounded" />
            <input type="text" name="address" placeholder="Address*" required className="w-full p-3 text-black rounded" />
            <input type="text" name="purchaseDate" placeholder="Purchase Date*"  required className="w-full p-3 text-black rounded" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")}/>
            <input type="text" name="deliveryDate" placeholder="Delivery Date*" required className="w-full p-3 text-black rounded" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")}/>
            <textarea name="complaintText" placeholder="Describe your issue*" required className="w-full p-3 text-black rounded"></textarea>
            <input type="file" name="fileUpload" placeholder="please be upload the document*" className="w-full my-2 p-2 border border-gray-400 rounded text-gray-400" accept="application/pdf" />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-gray-500">Submit Complaint</button>
          </form>
          <button onClick={() => handleCancel('enquiry')} className="bg-gray-700 text-white py-3 px-6 mt-4 rounded hover:bg-gray-500">Cancel</button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-white">CUSTOMER SUPPORT</h1>
          <hr className="my-4 border-white" />
          <h3 className="my-4 text-xl">ENQUIRIES</h3>
          <form id="inquiry-form" onSubmit={handleSubmit} className="space-y-4">
            <input type="text" id="name" name="name" placeholder="Name*" required className="w-full p-3 text-black rounded" />
            <input type="email" id="email" name="email" placeholder="Email*" required className="w-full p-3 text-black rounded" />
            <textarea id="message" name="message" placeholder="Message" required className="w-full p-3 text-black rounded"></textarea>
            <input type="text" id="phone" name="phone" placeholder="Phone Number*" required className="w-full p-3 text-black rounded" />
            <input type="text" id="address" name="address" placeholder="Address*" required className="w-full p-3 text-black rounded" />
            <input type="text" id="pincode" name="pincode" placeholder="Pincode*" required pattern="\d{6}" className="w-full p-3 text-black rounded" />
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded hover:bg-gray-500">Send</button>
          </form>
          <div className="text-center mt-6">
          <button onClick={() => handleCancel('complaint')} className="bg-gray-700 text-white py-3 px-6 mt-4 rounded hover:bg-gray-500">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSupport;
