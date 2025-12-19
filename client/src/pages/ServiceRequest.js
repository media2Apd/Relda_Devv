import React, { useEffect } from 'react';
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io5";
import { BsTwitterX } from "react-icons/bs";

const ServiceRequest = () => {
  useEffect(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    document.getElementById(days[today]).classList.add('text-white');
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const message = event.target.message.value;
    const emailList = event.target.emailList.checked;

    const mailtoLink = `mailto:support@eldaelectronics.com?subject=Message from ${name}&body=${message}%0D%0A%0D%0AFrom,%0D%0A${name}%0D%0A${email}%0D%0ASubscribe to email list: ${emailList}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 text-gray-400">
      <div className="mb-8 text-center">
        <h2 className="text-white">SERVICE REQUEST</h2>
        <hr className="my-4 border-white" />
        <div className="bg-gray-700 p-4 my-4">New services are coming soon!</div>
      </div>
      <section id="contact-us" className="mb-8 text-center">
        <h2 className="text-white text-justify">CONTACT US</h2>
        <hr className="my-4 border-white" />
      </section>

      <section id="visit-us" className="mb-8 text-center">
        <h2 className="text-f9f9f9 text-xl">For Installation Service!</h2>
        <p className="text-gray-500">We love our customers, so feel free to visit during normal business hours.</p>
        <a href="https://wa.me/919848490934" target="_blank" rel="noopener noreferrer">
          <button id="whatsapp-button" className="bg-green-500 text-white py-2 px-4 mt-6 rounded hover:bg-green-600">Message us on WhatsApp</button>
        </a>
        <div className="flex flex-wrap justify-around mt-8">
          <div className="w-2/5 my-2 text-left">
            <h4 className="text-f9f9f9">ELDA ELECTRONICS</h4><br />
            <p>Registered Office: Plot No 85 A</p>
            <p>Ring Road Housing Sector,</p>
            <p>Madhavaram, Chennai, Tamil Nadu, India</p>
            <br />
            <p>09848490934</p>
            <p><a href="mailto:support@eldaelectronics.com" className="hover:text-white">support@eldaelectronics.com</a></p>
          </div>
          <div className="w-2/5 my-2 text-left">
            <h4 className="text-f9f9f9">Working Hours</h4><br />
            <p id="monday">Mon 09:00 am – 05:00 pm</p>
            <p id="tuesday">Tue 09:00 am – 05:00 pm</p>
            <p id="wednesday">Wed 09:00 am – 05:00 pm</p>
            <p id="thursday">Thu 09:00 am – 05:00 pm</p>
            <p id="friday">Fri 09:00 am – 05:00 pm</p>
            <p id="saturday">Sat 09:00 am – 05:00 pm</p>
            <p id="sunday">Sun Closed</p>
          </div>
        </div>
      </section>

      <section id="social-links" className="text-center py-4">
        <h2 className="text-white">CONNECT WITH US</h2>
        <hr className="my-4 border-white" />
        <div className="flex justify-center gap-4">
          <a href="https://www.facebook.com/eldaelectronics" className="text-2xl text-gray-400 hover:text-white"><IoLogoFacebook /></a>
          <a href="https://www.instagram.com/eldaelectronics" className="text-2xl text-gray-400 hover:text-white"><IoLogoInstagram /></a>
          <a href="https://www.twitter.com/ElectronicsElda" className="text-2xl text-gray-400 hover:text-white"><BsTwitterX /></a>
        </div>
      </section>
    </div>
  );
};

export default ServiceRequest;
