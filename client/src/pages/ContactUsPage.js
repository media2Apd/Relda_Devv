import React, { useEffect } from 'react';
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5";
import { BsTwitterX, BsYoutube } from "react-icons/bs";
import SummaryApi from '../common';

const ContactUsPage = () => {
  useEffect(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    document.getElementById(days[today]).classList.add('text-white');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const message = event.target.message.value;

    try {
      const response = await fetch(SummaryApi.contactUs.url, {
        method: SummaryApi.contactUs.method,
        credintials : 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, message })
      });

      if (response.ok) {
        alert('Message sent successfully');
	event.target.reset(); 
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the message');
    }
   };

  return (
    <div className="p-5 max-w-3xl mx-auto bg-gray-900 text-gray-400">
      <section id="contact-us">
        <h1 className="text-center text-2xl font-semibold mb-4 text-white">CONTACT US</h1>
        <hr className="border-gray-300 mb-4" />
        <div className="p-5 rounded-md">
          <h3 className="text-center p-5">Write us!</h3>
          <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
            <input type="text" id="name" name="name" placeholder="Name*" required className="w-full p-3 text-black rounded-md" />
            <input type="email" id="email" name="email" placeholder="Email*" required className="w-full p-3 text-black rounded-md" />
            <input type="tel" name="phone" placeholder="Mobile Number*" required className="w-full p-3 text-black rounded-md" />
            <textarea id="message" name="message" placeholder="Message" required className="w-full p-3 text-black rounded-md"></textarea>
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-gray-500">Send</button>
          </form>
        </div>
      </section>

      <section id="visit-us">
        <h2 className="text-f9f9f9 text-xl text-center">Better yet, see us in person!</h2>
        <p className="text-center">We love our customers, so feel free to visit during normal business hours.</p>
        <a href="https://wa.me/919884890934" target="_blank" rel="noopener noreferrer">
          <button className="bg-green-500 text-white py-2 px-4 mt-6 rounded-md hover:bg-green-600 block mx-auto">Message us on WhatsApp</button>
        </a>
        <div className="flex flex-wrap justify-around mt-8 space-y-4 md:space-y-0">
          <div className="w-full md:w-1/2 p-2 text-center md:text-center">
            <h4 className="text-f9f9f9">RELDA INDIA</h4>
            <p>Registered Office: Plot No 17A</p>
            <p>Majestic Avenue, Krishna Nagar,</p>
            <p>Madhavaram Milk Colony, Chennai, Tamilnadu 600051.</p><br></br>
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
      </section>

      <section id="social-links" className="text-center py-5">
        <h2 className="text-white">CONNECT WITH US</h2>
        <hr className="border-white my-5" />
        <div className="flex justify-center space-x-5">
          <a href="https://www.facebook.com/reldaindia" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-white"><IoLogoFacebook /></a>
          <a href="https://www.instagram.com/reldaindia/?hl=en" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-white"><IoLogoInstagram /></a>
          {/* <a href="https://x.com/i/flow/login?redirect_after_login=%2FElectronicsElda" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-400 hover:text-white"><BsTwitterX /></a> */}
          <a href="https://www.youtube.com/channel/UClkiHCA4tVLtbtIc2fjhCgQ" target="_blank" rel="noopener noreferrer" className="text-2xl text-black-400 hover:text-white"><BsYoutube /> </a>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
