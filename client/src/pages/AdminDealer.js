// import React, { useEffect, useState } from 'react';
// import SummaryApi from '../common';

// const DealerApplications = () => {
//   const [applications, setApplications] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch(SummaryApi.getDealer.url, {
//       method: SummaryApi.getDealer.method,
//       credentials: 'include',
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (Array.isArray(data)) {
//           setApplications(data);
//           setError(null);
//         } else {
//           throw new Error('Fetched data is not an array');
//         }
//       })
//       .catch(error => {
//         setError(error.message);
//         console.error('Error fetching applications:', error);
//       });
//   }, []);

//   return (
//     <div className="mx-auto pb-8 bg-white text-gray-800">
//       <h1 className="text-center text-2xl flex item-center justify-center font-bold mb-4 p-4">All Dealer Applications</h1>
//       {/* <hr className="border-gray-300 mb-4" /> */}
//       {error && <p className="text-center text-red-600">{error}</p>}
//       <div className="overflow-x-auto">
//         <table className="w-full userTable bg-white" aria-label="Dealer Applications Table">
//           <thead>
//             <tr className='bg-red-600 text-white'>
//               <th className="border border-gray-300 px-4 py-2">Name</th>
//               <th className="border border-gray-300 px-4 py-2">Email</th>
//               <th className="border border-gray-300 px-4 py-2">Aadhar Number</th>
//               <th className="border border-gray-300 px-4 py-2">GST Number</th>
//               <th className="border border-gray-300 px-4 py-2">PAN Number</th>
//               <th className="border border-gray-300 px-4 py-2">Phone</th>
//               <th className="border border-gray-300 px-4 py-2">File</th>
//             </tr>
//           </thead>
//           <tbody>
//             {applications.length > 0 ? (
//               applications.map(application => (
//                 <tr key={application._id}>
//                   <td className="py-2 px-4 border-b">{application.email}</td>
//                   <td className="py-2 px-4 border-b">{application.name}</td>
//                   <td className="py-2 px-4 border-b">{application.aadharNumber}</td>
//                   <td className="py-2 px-4 border-b">{application.GSTNumber}</td>
//                   <td className="py-2 px-4 border-b">{application.PanNumber}</td>
//                   <td className="py-2 px-4 border-b">{application.phone}</td>
//                   <td className="py-2 px-4 border-b underline text-blue-600">
//                   <a href={SummaryApi.viewDealerFile(application._id).url} target="_blank" rel="noopener noreferrer">
//                       View File
//                   </a>                  
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td className="py-2 px-4 border-b text-center" colSpan="7">
//                   <div className="py-4 text-gray-500">No applications found. Please check back later.</div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DealerApplications;

import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DealerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(SummaryApi.getDealer.url, {
      method: SummaryApi.getDealer.method,
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setApplications(data);
          setError(null);
        } else {
          throw new Error('Fetched data is not an array');
        }
      })
      .catch(error => {
        setError(error.message);
        console.error('Error fetching applications:', error);
      });
  }, []);

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(applications);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dealer Applications');
    XLSX.writeFile(wb, 'dealer_applications.xlsx');
  };

  // const handleExportPDF = () => {
  //   const doc = new jsPDF();
  //   const tableColumn = ["Name", "Email", "Aadhar Number", "GST Number", "PAN Number", "Phone", "File"];
  //   const tableRows = applications.map(application => [
  //     application.name,
  //     application.email,
  //     application.aadharNumber,
  //     application.GSTNumber,
  //     application.PanNumber,
  //     application.phone,
  //     application._id, // You can modify this to display a file URL or file name as per your requirement
  //   ]);

  //   doc.autoTable(tableColumn, tableRows, { startY: 20 });
  //   doc.text('Dealer Applications', 14, 15);
  //   doc.save('dealer_applications.pdf');
  // };

  return (
    <div className="mx-auto pb-8  p-1 md:p-4 text-gray-900">

      <div className='bg-white py-2 px-6 shadow-md flex justify-between items-center rounded-lg'>
        <h2 className='font-bold text-xl text-gray-900'>All Dealer Applications</h2>
        <button className='border-2 border-brand-buttonSecondary text-brand-buttonSecondary hover:bg-brand-buttonSecondaryHover hover:text-white transition-all py-2 px-4 rounded-full' onClick={handleExportExcel}>Export to Excel</button>
      </div>



      {error && <p className="text-center text-brand-primary">{error}</p>}
      


      <div className="overflow-x-auto mt-4 rounded-lg shadow-lg">
        <table className="w-full userTable bg-white" aria-label="Dealer Applications Table">
          <thead>
            <tr className='bg-brand-primary text-white'>
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Aadhar Number</th>
              <th className="border border-gray-200 px-4 py-2">GST Number</th>
              <th className="border border-gray-200 px-4 py-2">PAN Number</th>
              <th className="border border-gray-200 px-4 py-2">Phone</th>
              <th className="border border-gray-200 px-4 py-2">File</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map(application => (
                <tr key={application._id}>
                  <td className="py-2 px-4 border-b">{application.name}</td>
                  <td className="py-2 px-4 border-b">{application.email}</td>
                  <td className="py-2 px-4 border-b">{application.aadharNumber}</td>
                  <td className="py-2 px-4 border-b">{application.GSTNumber}</td>
                  <td className="py-2 px-4 border-b">{application.PanNumber}</td>
                  <td className="py-2 px-4 border-b">{application.phone}</td>
                  <td className="py-2 px-4 border-b underline text-brand-buttonSecondary">
                    <a href={SummaryApi.viewDealerFile(application._id).url} target="_blank" rel="noopener noreferrer">
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

export default DealerApplications;
