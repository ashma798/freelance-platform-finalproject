import React, { useState } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';

const AddProposalForm = () => {
  const [formData, setFormData] = useState({
    freelancer_id: '',
    client_id: '',
    job_id: '',
    cover_letter: '',
    proposed_budget: ''
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/proposals/addProposal', formData);
      setSuccessMsg('Proposal submitted successfully!');
      setErrorMsg('');
      console.log('Proposal submitted:', response.data);
    } catch (error) {
      setErrorMsg('Error submitting proposal.');
      setSuccessMsg('');
      console.error('Error submitting proposal:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 to-white p-6">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Submit a Proposal</h2>

        {successMsg && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 text-center">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Freelancer ID</label>
            <input
              type="text"
              name="freelancer_id"
              value={formData.freelancer_id}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Client ID</label>
            <input
              type="text"
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Job ID</label>
            <input
              type="text"
              name="job_id"
              value={formData.job_id}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Cover Letter</label>
            <textarea
              rows="4"
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Proposed Budget (₹)</label>
            <input
              type="number"
              name="proposed_budget"
              value={formData.proposed_budget}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all"
          >
            Submit Proposal
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProposalForm;



