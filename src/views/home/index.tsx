'use client';
import React, { FC, useEffect, useState } from 'react';

import Loader from 'components/Loader';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'

export const HomeView: FC = ({ }) => {

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('')

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
          setFilteredData(result.data); // Initialize filtered data with the full data array
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

  // Filter data based on search term
  useEffect(() => {
    // If search term is empty, reset to original data
    if (searchTerm === '') {
      setFilteredData(data);
      return;
    } else if (searchTerm?.length > 0) {
      const filteredData = data.filter(item => {
        const userId = item[1].toString();
        return userId.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredData(filteredData);
    }

  }, [searchTerm]);


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
      <h2 className="text-3xl font-medium text-white md:leading-tight  my-5">Show Atlas App - DevNet</h2>

      {/* Right side with search bar */}
      <div className='flex w-full justify-end mt-4'>
        <TextField
          fullWidth
          label='Search by UserID'
          variant='outlined'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          size='small'
          sx={{
            width: '250px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              color: '#ffffff',
              '& fieldset': {
                borderColor: '##0091ad'
              },
              '&:hover fieldset': {
                borderColor: '#'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4f46e5'
              }
            },
            '& .MuiInputLabel-root': {
              color: '#cbd5e1'
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#cbd5e1'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: '#cbd5e1' }} />
              </InputAdornment>
            )
          }}
        />
      </div>
      <div className='flex flex-col gap-8 bg-tiles border-xnd w-full text-white p-5  mt-4 relative md:mb-0 mb-28 text-base'>
        <table className='table table-compact w-full'>
          <thead>
            <tr>
              <th className='text-center'>FSID</th>
              <th className='text-center normal-case'>UserID</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(([id, value], index) => (
              <tr key={index}>
                <td className='text-center'>{id}</td>
                <td className='text-center'>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
