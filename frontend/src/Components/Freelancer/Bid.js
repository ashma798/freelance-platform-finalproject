import { React, useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig/axiosConfig';
import { toast } from 'react-toastify';

const Bid = () => {
  const [jobId, setJobId] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [clientId, setClientId] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [clientData, setClientData] = useState(null);

  const [error, setError] = useState('');
  

  const location = useLocation();
    const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const jobId = queryParams.get('jobId');
    setJobId(jobId);
    console.log(jobId);
    const clientId = queryParams.get('clientId');
    setClientId(clientId);
    const freelancerId = queryParams.get('freelancerId');
    setFreelancerId(freelancerId);
  }, [location]);

  useEffect(() => {
    const fetchJobProfile = async () => {
      try {

        const res = await axiosInstance.get(`/users/jobProfile/${jobId}`);
        setJobData(res.data.data);


      } catch (error) {
        console.error('Error fetching job profile:', error);
      } finally {
        setLoading(false);
      }
    }
    if (jobId) {
      fetchJobProfile();
    }
  }, [jobId]);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const response = await axiosInstance.get(`/users/clientProfile/${clientId}`);
        console.log("res:", response.data.data);
        setClientData(response.data.data);
      } catch (error) {
        console.error('Error fetching client profile:', error);
      }
    };
    if (clientId) {
      fetchClientProfile();
    }

  }, [clientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/users/bid', {
        freelancer_id: freelancerId,
        client_id: clientId,
        job_id: jobId,
        bid_amount: bidAmount
      });
      toast.success('Bid submitted successfully!');
      navigate('/Freelancer/Freelancerdashboard');
      setLoading(false);
     

    } catch (err) {
      toast.error('Error submitting bid. Please try again.');
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!jobData) {
    return <div>No Job Found</div>;
  }
    const cloudinaryImageUrl = clientData?.image 
  ? `https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${clientData?.image}`
  : '/path/to/default-image.jpg';

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{jobData?.job_title}</h1>
        <div className="text-right">
          <p className="text-xl font-semibold text-green-500">₹{jobData.budget?.$numberDecimal}</p>
        </div>
      </div>

    
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 mb-8 space-y-6">
        <div className="lg:flex lg:space-x-10">
         
          <div className="lg:w-2/3 space-y-5">
            <h2 className="text-2xl font-semibold text-gray-800">Project Description</h2>
            <p className="text-gray-700 text-lg">
              {jobData?.description}
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-5">Skills Required</h3>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {Array.isArray(jobData.skills_required) &&
                jobData.skills_required.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
            </ul>
          </div>

          {/* Right Section - Client Info */}
          <div className="lg:w-1/3 bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold text-center text-gray-800">About the Client</h3>
            <div className="flex justify-center mt-4">
            <img
    className="w-40 h-40 rounded-full justify-center object-cover border-4 border-indigo-500 mt-2 me-5"
    src={cloudinaryImageUrl}
    alt="Profile"
  />
  </div>
  <div className="mt-4 text-center">
    <h2 className="text-3xl font-bold text-gray-800">{clientData?.name}</h2>
    <p className="text-indigo-600 text-lg">{clientData?.email}</p>
  </div>
             <p>{clientData?.bio}</p> 
            
           
          </div>
        </div>
      </div>

      {/* Bid Submission Form */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submit Your Bid</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="bidamt" className="block text-lg font-medium text-gray-700">Bid Amount</label>
            <input
              type="number"
              id="bidamt"
              className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter your bid amount"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Bid'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Bid;
