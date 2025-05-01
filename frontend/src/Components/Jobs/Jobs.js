import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Jobs = () => {
  const [joblist, setJobList] = useState([]);
  const [search, setSearch] = useState('');
   const navigate = useNavigate();

  const FetchJobList = async () => {
    try {
      const jobListResponse = await axiosInstance.get('/users/viewJob');
      setJobList(jobListResponse.data.data);
      console.log(jobListResponse.data.data);
    } catch (err) {
      toast.error('Error in  fetching jobs');
    }
  };

  useEffect(() => {
    FetchJobList();
  }, []);

  const filteredJobs = joblist.filter((job) =>
    job.job_title.toLowerCase().includes(search.toLowerCase()) ||
    job.skills_required.some(skill =>
      skill.toLowerCase().includes(search.toLowerCase())
    )
  );
  const handleBidClick = () => {
    navigate('/Freelancer/Bid');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center bg-blue-400 p-4 rounded-xl shadow-md mb-8 gap-4">
  <div className="flex items-center gap-2 w-full sm:w-auto">
    <i className="bi bi-search text-2xl text-indigo-600"></i>
    <span className="font-semibold text-lg text-gray-700">Search</span>
  </div>
  <input
    type="text"
    className="flex-1 p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-500 text-gray-800 shadow-sm"
    placeholder="Search by project name or skill..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Available Projects</h2>

        {/* Job Cards */}
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center transition hover:shadow-2xl">

              {/* Job Details */}
              <div className="flex-1 w-full sm:w-auto">
                <div className="flex items-center gap-3 mb-2">
                  <h5 className="text-xl font-bold text-gray-800">{job.job_title}</h5>
                  <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full"   onClick={handleBidClick}>
                    Free to Bid
                  </button>
                </div>
                <p className="text-gray-600 mb-3">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <div className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full text-center">
                  ₹{parseFloat(job.budget?.$numberDecimal).toFixed(2)}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Jobs;











