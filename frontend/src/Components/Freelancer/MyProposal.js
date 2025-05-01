import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';

const MyProposal = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    try {
      const res = await axiosInstance.get('/proposals/myProposals');
      setProposals(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center"> Proposals</h1>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : proposals.length === 0 ? (
          <div className="text-center text-gray-600">No proposals received yet.</div>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <div key={proposal._id} className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition-all">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{proposal.job_id?.job_title || 'Job Title'}</h2>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-medium">Client:</span> {proposal.client_id?.name || 'Client Name'}
                  </p>
                  <p className="text-gray-700">{proposal.cover_letter}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-indigo-600 font-bold text-lg">₹ {proposal.proposed_budget}</span>
                  <span className="text-gray-400 text-sm">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProposal;


















