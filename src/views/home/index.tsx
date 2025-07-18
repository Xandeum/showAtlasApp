'use client';
import React, { FC, useEffect, useState } from 'react';

import Loader from 'components/Loader';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Connection } from '@solana/web3.js';
import { getMetadata, listDirectoryEntry } from 'test2-xandeum-web3';

export const HomeView: FC = ({ }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 10; // Number of items to display per page


  useEffect(() => {
    const fetchData = async () => {
      try {
        const connection = new Connection("https://apis.trynet.xandeum.com", 'confirmed');
        const res = await listDirectoryEntry(connection, "/root");


        const fsids = res?.result?.response?.response?.ListDir?.entries;
        console.log("Fetched fsids:", fsids);

        const result = await Promise.all(fsids.map(async (item) => {
          const metadata = await getMetadata(connection, item.path);
          return {
            id: item.name,
            value: metadata?.result?.response?.response?.Metadata?.owner || 'Unknown Owner',
          };
        }));

        if (fsids?.length > 0) {
          result.sort((a, b) => Number(a[0]) - Number(b[0]));
          //reverse the order of the data
          result.reverse();
          setData(result); // Store the data array
          setFilteredData(result); // Initialize filtered data with the full data array
        } else {
          setError("Failed to fetch data: Invalid response format.");
        }
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => {
        const userId = item?.value;
        return userId.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-[calc(100vh-80px)]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container flex mx-auto flex-col items-center w-full max-w-4xl p-4 mb-10">
      <h2 className="text-3xl font-medium text-white md:leading-tight my-5">
        Show Atlas App - TryNet
      </h2>

      {/* Right side with search bar */}
      <div className='flex flex-col  bg-tiles border-xnd w-full text-white p-3  mt-8 relative md:mb-0 mb-28 text-base'>
        <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-[#fda31b] via-[#622657] to-[#198476] border-xnd blur  "></div>
        <div className="flex w-full justify-end mt-4 pr-5">
          <TextField
            fullWidth
            label="Search by UserID"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: '250px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                color: '#ffffff',
                '& fieldset': {
                  borderColor: '#0091ad',
                },
                '&:hover fieldset': {
                  borderColor: '#',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4f46e5',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#cbd5e1',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#cbd5e1',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#cbd5e1' }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="flex flex-col gap-4 bg-tiles border-xnd w-full text-white p-5 relative md:mb-0 mb-28 text-base">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th className="text-center">FSID</th>
                <th className="text-center normal-case">UserID</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(({ id, value }, index) => (
                <tr key={index}>
                  <td className="text-center">{id}</td>
                  <td className="text-center">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex flex-row justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 bg-white flex items-center justify-center rounded disabled:bg-gray-500"
            >
              <NavigateBeforeIcon fontSize='small' sx={{ color: '#050b27' }} />
            </button>
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 bg-white flex items-center justify-center rounded disabled:bg-gray-500"
            >
              <NavigateNextIcon fontSize='small' sx={{ color: '#050b27' }} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};