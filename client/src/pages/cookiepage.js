import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';

const CookiePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [from, setfrom] = useState('');
  const [to, setto] = useState('');
  const [isFocused, setIsFocused] = useState(false);
console.log(data);

  // Updated fetchData function to use the provided dates
  const fetchData = async (from, to) => {
    try {
      setLoading(true);
      setError(null);

      // Debugging log: Check the dates before making the API request

      const url = new URL(SummaryApi.allCookies.url); // Replace with your backend URL

      // Only append date parameters if they are provided
      if (from) url.searchParams.append('from', from);
      if (to) url.searchParams.append('to', to);

      // Debugging log: Check the constructed URL

      const response = await fetch(url.toString());
      
      // Debugging log: Check if the response is successful
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Debugging log: Check the result from the API

      // Check if the result is valid
      if (result && result.data) {
        setData(result.data);
      } else {
        setError("No data returned from the server");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err); // Debugging log for any errors
      setError('Error fetching data');
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or when from/to change
  useEffect(() => {
    // Fetch data even if no dates are set
    fetchData(from, to);
  }, [from, to]);

  // Handle changes in 'from' and automatically set 'to'
  const handlefromChange = (e) => {
    const newfrom = e.target.value;
    setfrom(newfrom);
    setto(newfrom); // Set 'to' to the same value as 'from'
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">

<div className='bg-white py-4 px-6 shadow-md flex justify-between items-center rounded-lg mb-4'>
        <h2 className='font-bold text-xl text-gray-800'>Cookie Acceptance Data</h2>
      </div>


      <div className="mb-4">
        <div className="flex space-x-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type={isFocused ? "date" : "text"}
              value={from}
              onChange={handlefromChange}
              className="border p-2 rounded-md md:mr-2"         
              placeholder={isFocused ? "" : "From Date*"}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type={isFocused ? "date" : "text"}
              value={to || from} // Default to 'from' if 'to' is empty
              onChange={(e) => setto(e.target.value)}
              className="border p-2 rounded-md md:mr-2"
              placeholder={isFocused ? "" : "To Date*"}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <p>No cookie acceptance data available.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-4 py-2 border-b text-left">S.No</th>
              <th className="px-4 py-2 border-b text-left">IP Address</th>
              <th className="px-4 py-2 border-b text-left">Location</th>
              <th className="px-4 py-2 border-b text-left">Acceptance Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 bg-white"
              >
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b whitespace-nowrap">
                  {item.ipLocations.map((ip) => ip.ipAddress).join(', ')}
                </td>
                <td className="px-4 py-2 border-b">
                  {item.ipLocations.map((ip, i) => (
                    <div key={i}>
                      <strong>{ip.location.city}</strong>, {ip.location.region},{' '}
                      {ip.location.country}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 border-b">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
      )}
    </div>
  );
};

export default CookiePage;
