import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig/axiosConfig';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const jobId = new URLSearchParams(location.search).get('jobId');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/getJobDetails?jobId=${jobId}`);
        setJobDetails(response.data.job);
        setProposals(response.data.proposals);
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

  const handleAcceptProposal = async (proposalId) => {
    try {
      await axiosInstance.post('/users/acceptProposal', { proposalId });
      toast.success('Proposal accepted successfully');
      navigate('/ClientDashboard');
    } catch (err) {
      toast.error('Error accepting proposal');
    }
  };

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
        <h2 className="text-3xl font-semibold mb-4">{jobDetails.title}</h2>
        <p className="text-gray-600 mb-4">{jobDetails.description}</p>
        <div className="flex gap-4 mb-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full">{jobDetails.budget}</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full">{jobDetails.skills.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Posted on:</span>
          <span>{new Date(jobDetails.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">Proposals</h3>
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <div key={proposal._id} className="border-b border-gray-200 mb-4 pb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xl font-medium">{proposal.freelancerName}</h4>
                <span className="text-sm text-gray-500">{proposal.status}</span>
              </div>
              <p className="text-gray-600 mb-2">{proposal.message}</p>
              <div className="flex gap-4">
                <span className="text-gray-500">Price: {proposal.price}</span>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={() => handleAcceptProposal(proposal._id)}
                >
                  Accept Proposal
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No proposals yet.</p>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
