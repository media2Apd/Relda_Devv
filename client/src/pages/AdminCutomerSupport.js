import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminEnquiriesMsg = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(SummaryApi.allmsg.url, {
      method: SummaryApi.allmsg.method,
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
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
      .catch((err) => {
        console.error('Error fetching applications:', err);
        setError('Failed to fetch messages');
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
// const tableColumn = ["Name", "Email", "Phone", "Message", "Address", "Pincode", "Date"];

// const tableRows = messages.map(message => [
//   message.name,
//   message.email,
//   message.phone,
//   message.message,
//   message.address,
//   message.pincode,
//   message.createdAt,
//     // ? message.summary.split(' ').slice(0, 10).join(' ') + (message.summary.split(' ').length > 10 ? '...' : '')
//     // : '', // Truncate to first 10 words with ellipsis if longer
// ]);

// doc.autoTable(tableColumn, tableRows, { startY: 20 });
// doc.text('message Applications', 14, 15);
// doc.save('message_applications.pdf');
// };


  return (
    <div className="mx-auto pb-8 p-1 md:p-4 text-gray-800">

<div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
        <h2 className='font-bold text-xl text-gray-800'>Enquiry Messages</h2>
        <button className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-4 rounded-full' onClick={handleExportExcel}>Export to Excel</button>
      </div>

      <div className="overflow-x-auto mt-4 rounded-lg shadow-lg">
        <table className="w-full userTable bg-white border border-gray-300">
          <thead>
            <tr className='bg-red-600 text-white'>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Phone</th>
              <th className="px-4 py-2 border-b">Message</th>
              <th className="px-4 py-2 border-b">Address</th>
              <th className="px-4 py-2 border-b">Pincode</th>
              <th className="px-4 py-2 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center border border-gray-300 text-red-500">
                  {error}
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center border border-gray-300">
                  Loading...
                </td>
              </tr>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <tr key={message._id}>
                  <td className="px-4 py-2 border-b">{message.name}</td>
                  <td className="px-4 py-2 border-b">{message.email}</td>
                  <td className="px-4 py-2 border-b">{message.phone}</td>
                  <td className="px-4 py-2 border-b" title={message.message}>
                    {message.message.length > 50
                      ? `${message.message.substring(0, 50)}...`
                      : message.message}
                  </td>
                  <td className="px-4 py-2 border-b">{message.address}</td>
                  <td className="px-4 py-2 border-b">{message.pincode}</td>
                  <td className="px-4 py-2 border-b">{new Date(message.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center border border-gray-300">No messages found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEnquiriesMsg;
