import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CareerApplications = () => {
  const [careers, setCareers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(SummaryApi.allCareer.url, {
      method: SummaryApi.allCareer.method,
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch career applications');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCareers(data);
        } else {
          throw new Error('Invalid data format');
        }
      })
      .catch(error => setError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

   const handleExportExcel = () => {
      const ws = XLSX.utils.json_to_sheet(careers);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Career Applications');
      XLSX.writeFile(wb, 'career_applications.xlsx');
    };
  
//     const handleExportPDF = () => {
//   const doc = new jsPDF();
//   const tableColumn = ["Name", "Email", "Educational Qualification", "Looking For", "Experience", "Phone", "Summary"];
  
//   const tableRows = careers.map(career => [
//     career.name,
//     career.email,
//     career.educationalQualification,
//     career.lookingFor,
//     career.experience,
//     career.phone,
//     career.summary
//       ? career.summary.split(' ').slice(0, 10).join(' ') + (career.summary.split(' ').length > 10 ? '...' : '')
//       : '', // Truncate to first 10 words with ellipsis if longer
//   ]);

//   doc.autoTable(tableColumn, tableRows, { startY: 20 });
//   doc.text('Career Applications', 14, 15);
//   doc.save('career_applications.pdf');
// };

  

  return (
    <div className="mx-auto pb-8 p-1 md:p-4 text-gray-800">

<div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg mb-4'>
        <h2 className='font-bold text-xl text-gray-800'>All Careers</h2>
        <button className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all py-2 px-4 rounded-full' onClick={handleExportExcel}>Export to Excel</button>
      </div>

      {/* <hr className="border-gray-300 mb-4" /> */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {isLoading ? (
        <p className="text-center text-gray-500">Loading career applications...</p>
      ) : (
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full userTable bg-white" aria-label="Product Registrations Table">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Educational Qualification</th>
              <th className="border border-gray-300 px-4 py-2">Looking For</th>
              <th className="border border-gray-300 px-4 py-2">Experience</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Summary</th>
              <th className="border border-gray-300 px-4 py-2">File</th>
            </tr>
          </thead>
          <tbody>
            {careers.length > 0 ? (
              careers.map((career) => (
                <tr key={career._id}>
                  <td className="py-2 px-4 border-b">{career.name}</td>
                  <td className="py-2 px-4 border-b">{career.email}</td>
                  <td className="py-2 px-4 border-b">{career.educationalQualification}</td>
                  <td className="py-2 px-4 border-b">{career.lookingFor}</td>
                  <td className="py-2 px-4 border-b">{career.experience}</td>
                  <td className="py-2 px-4 border-b">{career.phone}</td>
                  <td className="py-2 px-4 border-b">{career.summary}</td>
                  <td className="py-2 px-4 border-b underline text-blue-600">
                    <a href={SummaryApi.viewCareerFile.url(career._id)} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-4" colSpan="8">No careers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default CareerApplications;
