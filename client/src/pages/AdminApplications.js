import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';

const AdminDealer = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch(SummaryApi.getAllApplications.url, {
      method: SummaryApi.getAllApplications.method,
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        // Ensure that data is an array before setting it to state
        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching applications:', error);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800">
      <h1 className="text-center text-2xl font-semibold mb-4">All Applications</h1>
      <hr className="border-gray-300 mb-4" />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Aadhar Number</th>
              <th className="py-2 px-4 border-b">GST Number</th>
              <th className="py-2 px-4 border-b">PAN Number</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">File</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map(application => (
                <tr key={application._id}>
                  <td className="py-2 px-4 border-b">{application.name}</td>
                  <td className="py-2 px-4 border-b">{application.email}</td>
                  <td className="py-2 px-4 border-b">{application.aadharNumber}</td>
                  <td className="py-2 px-4 border-b">{application.gstNumber}</td>
                  <td className="py-2 px-4 border-b">{application.panNumber}</td>
                  <td className="py-2 px-4 border-b">{application.phone}</td>
                  <td className="py-2 px-4 border-b">{application.address}</td>
                  <td className="py-2 px-4 border-b">
                  <a href={SummaryApi.viewApplicationFile(application._id).url} target="_blank" rel="noopener noreferrer">
    View File
</a>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b" colSpan="8">No applications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDealer;
