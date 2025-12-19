import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ContactUsMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    fetch(SummaryApi.allcont.url, {
      method: SummaryApi.allcont.method,
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        return response.json();
      })
      .then((data) => {
        // Ensure that data is an array before setting it to state
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setError('Unexpected data format');
        }
      })
      .catch((error) => {
        console.error('Error fetching applications:', error);
        setError('Unexpected data format');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(messages);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'message Applications');
    XLSX.writeFile(wb, 'message_applications.xlsx');
  };

//   const handleExportPDF = () => {
// const doc = new jsPDF();
// const tableColumn = ["Name", "Email", "Phone", "Message", "Date"];

// const tableRows = messages.map(message => [
//   message.name,
//   message.email,
//   message.phone,
//   message.message,
//   message.createdAt,
//   // message.experience,
//   // message.phone,
//   // message.summary
//   //   ? message.summary.split(' ').slice(0, 10).join(' ') + (message.summary.split(' ').length > 10 ? '...' : '')
//   //   : '', // Truncate to first 10 words with ellipsis if longer
// ]);

// doc.autoTable(tableColumn, tableRows, { startY: 20 });
// doc.text('message Applications', 14, 15);
// doc.save('message_applications.pdf');
// };


  return (
    <div className="mx-auto pb-8 p-1 md:p-4 text-gray-800">

<div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
        <h2 className='font-bold text-xl text-gray-800'>Contact Messages</h2>
        <button className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-4 rounded-full' onClick={handleExportExcel}>Export to Excel</button>
      </div>


      <div className="overflow-x-auto rounded-lg shadow-lg mt-4">
        <table className="w-full userTable bg-white border border-gray-300">
          <thead>
            <tr className='bg-red-600 text-white'>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Phone</th>
              <th className="px-4 py-2 border-b">Message</th>
              <th className="px-4 py-2 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-2 text-center border border-gray-700"
                >
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-2 text-center text-red-500 border border-gray-700"
                >
                  {error}
                </td>
              </tr>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <tr key={message._id}>
                  <td className="py-2 px-4 border-b">{message.name}</td>
                  <td className="py-2 px-4 border-b">{message.email}</td>
                  <td className="py-2 px-4 border-b">{message.phone}</td>
                  <td className="py-2 px-4 border-b truncate" title={message.message}>
                    {message.message.length > 50
                      ? `${message.message.substring(0, 50)}...`
                      : message.message}
                  </td>
                  <td className="py-2 px-4 border-b">{new Date(message.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center border border-gray-700">No messages found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactUsMessages;
