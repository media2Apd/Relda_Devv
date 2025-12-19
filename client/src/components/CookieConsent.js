import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const CookieConsent = () => {
  const [accepted, setAccepted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check localStorage to see if cookies were already accepted and if 12 hours have passed
    const isAccepted = localStorage.getItem('cookiesAccepted');
    const lastAcceptedTime = localStorage.getItem('lastAcceptedTime');
    
    // Check if 12 hours have passed since last acceptance
    if (isAccepted && lastAcceptedTime) {
      const timeDifference = Date.now() - new Date(lastAcceptedTime).getTime();
      if (timeDifference < 12 * 60 * 60 * 1000) {
        setAccepted(true); // Hide the consent banner if cookies are accepted within the last 12 hours
      } else {
        setAccepted(false); // Show banner if 12 hours have passed
      }
    }
  }, []);

  const handleAcceptCookies = async () => {
    try {
      const response = await fetch(SummaryApi.cookies.url, {
        method: SummaryApi.cookies.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Cookies accepted successfully!");
        setAccepted(true);
        // Store acceptance and timestamp in localStorage
        localStorage.setItem('cookiesAccepted', 'true');
        localStorage.setItem('lastAcceptedTime', new Date().toISOString()); // Store current timestamp
      } else {
        toast.error(data.message || "An error occurred while accepting cookies.");
      }
    } catch (error) {
      toast.error("An error occurred while accepting cookies.");
      console.error(error);
    }
  };

  // const handleCancel = () => {
  //   setDismissed(true);
  // };

  if (accepted || dismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '15px',
        backgroundColor: '#333',
        color: '#fff',
        borderTop: '2px solid #007bff',
        textAlign: 'center',
        zIndex: '1000',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
      }}
    >
      <h1 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
        We use cookies to help us understand the usage of our website, to improve our website performance, and to increase the relevance of our communication and advertising.
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <button
  onClick={handleAcceptCookies}
  className="px-4 py-2 bg-blue-600 text-xs md:text-sm text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white transition-all duration-150"
  aria-label="Accept Cookies"
>
  Accept Cookies
</button>

        {/* <button
          onClick={handleCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Cancel
        </button> */}
      </div>
    </div>
  );
};

export default CookieConsent;