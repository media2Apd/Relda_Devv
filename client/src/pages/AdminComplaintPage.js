import React, { useState, useEffect } from 'react';
import SummaryApi from '../common'
import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(SummaryApi.complaints.url); // Replace with your backend endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching complaints:', err);
      }
    };

    fetchComplaints();
  }, []);
    // Function to handle viewing the file
    const handleExportExcel = () => {
      const ws = XLSX.utils.json_to_sheet(complaints);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'complaint Applications');
      XLSX.writeFile(wb, 'complaint_applications.xlsx');
    };
  
//     const handleExportPDF = () => {
//   const doc = new jsPDF();
//   const tableColumn = ["Name", "Order Id", "Mobile", "Email", "Complaint Text", "Purchase Date", "Delivery Date"];
  
//   const tableRows = complaints.map(complaint => [
//     complaint.customerName,
//     complaint.orderID,
//     complaint.mobileNumber,
//     complaint.email,
//     complaint.complaintText
//     ? complaint.complaintText.split(' ').slice(0, 10).join(' ') + (complaint.complaintText.split(' ').length > 10 ? '...' : '')
//       : '',
//     complaint.purchaseDate,
//     complaint.deliveryDate,
//       // ? complaint.summary.split(' ').slice(0, 10).join(' ') + (complaint.summary.split(' ').length > 10 ? '...' : '')
//       // : '', // Truncate to first 10 words with ellipsis if longer
//   ]);

//   doc.autoTable(tableColumn, tableRows, { startY: 20 });
//   doc.text('complaint Applications', 14, 15);
//   doc.save('complaint_applications.pdf');
// };

    
      return (
        <div className="mx-auto pb-8 p-1 md:p-4 text-gray-900">

<div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
        <h2 className='font-bold text-xl text-gray-900'>All Customer Complaints</h2>
        <button className='border-2 border-brand-buttonSecondary text-brand-buttonSecondary hover:bg-brand-buttonSecondaryHover hover:text-white transition-all py-2 px-4 rounded-full' onClick={handleExportExcel}>Export to Excel</button>
      </div>

          {error && <p className="text-center text-brand-primary">{error}</p>}

          <div className="overflow-x-auto mt-4 rounded-lg shadow-lg">
          <table className="w-full userTable bg-white " aria-label="Complaint Messages Table">
            <thead>
              <tr className="bg-brand-primary text-white">
                <th className="border border-gray-200 px-4 py-2">Customer Name</th>
                <th className="border border-gray-200 px-4 py-2">Order ID</th>
                <th className="border border-gray-200 px-4 py-2">Mobile</th>
                <th className="border border-gray-200 px-4 py-2">Email</th>
                <th className="border border-gray-200 px-4 py-2">Complaint</th>
                <th className="border border-gray-200 px-4 py-2">Purchase Date</th>
                <th className="border border-gray-200 px-4 py-2">Delivery Date</th>
                <th className="border border-gray-200 px-4 py-2">View File</th> {/* Added file column for view */}
              </tr>
            </thead>
            <tbody>
              {complaints.length > 0 ? (
                complaints.map(complaint => (
                <tr key={complaint._id}>
                  <td className="px-4 py-2 border-b">{complaint.customerName}</td>
                  <td className="px-4 py-2 border-b">{complaint.orderID}</td>
                  <td className="px-4 py-2 border-b">{complaint.mobileNumber}</td>
                  <td className="px-4 py-2 border-b">{complaint.email}</td>
                  <td className="px-4 py-2 border-b">{complaint.complaintText}</td>
                  <td className="px-4 py-2 border-b">{new Date(complaint.purchaseDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b">{new Date(complaint.deliveryDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b underline text-brand-buttonSecondary">
                    <a href={SummaryApi.viewComplaintFile(complaint._id).url} target="_blank" rel="noopener noreferrer">
                        View File
                    </a>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan="7">
                    <div className="py-4 text-brand-textMuted">No applications found. Please check back later.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
    
          </div> 
        </div>
      );
    };

export default AdminComplaint;