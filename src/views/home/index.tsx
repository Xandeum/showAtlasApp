'use client';
import React, { FC, useEffect, useState } from 'react';

import Loader from 'components/Loader';

export const HomeView: FC = ({ }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/atlasdata"); // Call the API route

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Check if the response contains valid data
        if (result.status === "success") {
          result.data.sort((a, b) => Number(a[0]) - Number(b[0]));
          setData(result.data); // Store the data array
        } else {
          setError("Failed to fetch data: Invalid response format.");
        }
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchData();
  }, []);

  // Render the table if data is available
  if (loading) {
    return <div className="flex flex-col justify-center items-center w-full h-[calc(100vh-80px)]">
      <Loader />
    </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container flex mx-auto flex-col items-center w-full max-w-4xl p-4 mb-10">
      <h2 className="text-3xl font-medium text-white md:leading-tight  my-5">Show Atlas App</h2>
      <div className='flex flex-col gap-8 bg-tiles border-xnd w-full text-white p-5  mt-8 relative md:mb-0 mb-28 text-base'>
        <table className='table table-compact w-full'>
          <thead>
            <tr>
              <th className='text-center'>FSID</th>
              <th className='text-center normal-case'>UserID</th>
            </tr>
          </thead>
          <tbody>
            {data.map(([id, value], index) => (
              <tr key={index}>
                <td className='text-left'>{id}</td>
                <td className='text-center'>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
