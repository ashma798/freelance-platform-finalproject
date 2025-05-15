import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddReview = () => {
  const location = useLocation();
  const [startDate, setStartDate] = useState('');
  const [clientId, setClientId] = useState(null);
  const [endDate, setEndDate] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const queryParams = new URLSearchParams(location.search);
  const freelancerId = queryParams.get('freelancerId');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('@user'));
    if (loggedInUser) {
      setClientId(loggedInUser._id);
    }

  }, []);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get(`users/completedJobs/${freelancerId}`);
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        reviewer_id: clientId,
        reviewee_id: freelancerId,
        job_id : selectedJobId,
        start_date: startDate,
        end_date: endDate,
        rating,
        comment,
        status: "completed"
      };
      console.log("reviewData:", reviewData);
      await axiosInstance.post('/users/addReview', reviewData);
      toast.success("Review submitted!");
      navigate('Client/clientdashboard');
    } catch (err) {
      toast.error("Error submitting review");
      
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-md rounded-md w-70">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
       
          <div>
            <label className="block font-medium">Select Job</label>
            <div className="mb-3">
              <select
                className="form-select"
                onChange={(e) => setSelectedJobId(e.target.value)}
                value={selectedJobId}
              >
                <option value="">-- Select Job --</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.job_title}
                  </option>
                ))}
              </select>
            </div>
           
          </div>
          <div>
            <label className="block font-medium">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">Rating</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}
              className="w-full border p-2 rounded" required>
              {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-medium">Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              className="w-full border p-2 rounded" rows="4" placeholder="Write a brief review..." />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Submit Review
          </button>
          
      </form>
    </div>
  );
};

export default AddReview;
