import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminProductRegistration = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await fetch(SummaryApi.GetRegistrations.url, {
          method: SummaryApi.GetRegistrations.method,
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setRegistrations(data);
        } else {
          setError('Failed to fetch registrations');
        }
      } catch (error) {
        setError('Error fetching registrations');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

     const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(registrations);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'registration Applications');
        XLSX.writeFile(wb, 'registration_applications.xlsx');
      };
    
  //     const handleExportPDF = () => {
  //   const doc = new jsPDF();
  //   const tableColumn = ["Name", "Phone", "Email", "Order Number", "Serial Number", "Installation Date"];
    
  //   const tableRows = registrations.map(registration => [
  //     registration.name,
  //     registration.phone,
  //     registration.email,
  //     registration.orderNumber,
  //     registration.serialNumber,
  //     registration.installationDate,
  //     // registration.summary,
  //       // ? registration.summary.split(' ').slice(0, 10).join(' ') + (registration.summary.split(' ').length > 10 ? '...' : '')
  //       // : '', // Truncate to first 10 words with ellipsis if longer
  //   ]);
  
  //   doc.autoTable(tableColumn, tableRows, { startY: 20 });
  //   doc.text('registration Applications', 14, 15);
  //   doc.save('registration_applications.pdf');
  // };
  

  return (
    <div className="mx-auto pb-8 p-1 md:p-4 text-gray-800">

      <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg mb-4'>
        <h2 className='font-bold text-xl text-gray-800'>Product Registrations</h2>
        <button className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-4 rounded-full' onClick={handleExportExcel}>Export to Excel</button>
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {loading ? (
        <p className="text-center py-4">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full userTable bg-white" aria-label="Product Registrations Table">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Order Number</th>
                <th className="border border-gray-300 px-4 py-2">Serial Number</th>
                <th className="border border-gray-300 px-4 py-2">Installation Date</th>
                <th className="border border-gray-300 px-4 py-2">File Upload</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length > 0 ? (
                registrations.map((registration) => (
                  <tr key={registration._id}>
                    <td className="py-2 px-4 border-b">{registration.name}</td>
                    <td className="py-2 px-4 border-b">{registration.phone}</td>
                    <td className="py-2 px-4 border-b">{registration.email}</td>
                    <td className="py-2 px-4 border-b">{registration.orderNumber}</td>
                    <td className="py-2 px-4 border-b">{registration.serialNumber}</td>
                    <td className="py-2 px-4 border-b">{new Date(registration.installationDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b underline text-blue-600">
                      <a href={SummaryApi.viewRegistrationFile(registration._id).url} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No registrations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductRegistration;
