import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig/axiosConfig';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const [jobDetails, setJobDetails] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const jobId = new URLSearchParams(location.search).get('jobId');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/jobProfile/${jobId}`);
        setJobDetails(response.data.data);
     
        setLoading(false);
      } catch (err) {
        toast.error('Error fetching job details:');
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

 console.log("jobDetails=",jobDetails);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg font-semibold">Job not found</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Job Details Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-semibold mb-4">{jobDetails.job_title}</h2>
        <p className="text-gray-600 mb-4">{jobDetails.description}</p>
        <div className="gap-4 mb-4">
         <span className="font-medium mr-2">Amount:</span><span className="bg-blue-500 text-white px-3 py-1 rounded-full"> ₹{parseFloat(jobDetails.budget?.$numberDecimal).toFixed(2)}</span>
            <div className="flex items-center mb-3">
      <span className="font-medium mr-2">Deadline:</span>
      <span className="text-gray-600">
        {new Date(jobDetails.deadline).toLocaleDateString()}
      </span>
    </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="font-medium mr-2">Skills:</span>
  {Array.isArray(jobDetails.skills_required) &&
    jobDetails.skills_required.map((skill, index) => (
      <span
        key={index}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
      >
        {skill}
      </span>
    ))}
</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Posted on:</span>
          <span>{new Date(jobDetails.created).toLocaleDateString()}</span>
        </div>
      </div>


    </div>
  );
};

export default JobDetails;
