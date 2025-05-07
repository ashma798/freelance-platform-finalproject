import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';

const JobReport = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async (search = '') => {
    try {
      const response = await axiosInstance.get(`/users/jobReport?search=${search}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchJobs(searchTerm);
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Job Report</h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by job title..."
          className="px-4 py-2 w-full md:w-1/3 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Job Title</th>
              <th className="px-4 py-2 text-left">Budget</th>
              <th className="px-4 py-2 text-left">Deadline</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Client</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{job.title}</td>
                <td className="px-4 py-2">₹{parseFloat(job.budget).toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(job.deadline).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(job.status)}`}>
                    {job.status?.replace('_', ' ') || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-2">{job.clientName || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobReport;
