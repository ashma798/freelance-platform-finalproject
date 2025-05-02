import { React, useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig/axiosConfig';
import { toast } from 'react-toastify';

const AcceptBid = () => {

  const [bidId, setBidId] = useState('');
  const [bidData, setBidData] = useState(null);
    const location = useLocation();
     const navigate = useNavigate();


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const bidId = queryParams.get('bidId');
        if(bidId){
        setBidId(bidId);
        }
      }, [location]);
    
  

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const response = await axiosInstance.get(`users/getbidDetails/${bidId}`);
        console.log(response);
        setBidData(response.data.data);
        
      } catch (error) {
        toast.error('Error fetching bid details!');
      }
    };
if(bidId){
    fetchBidDetails();
}
  }, [bidId]);

  
  const handleAcceptBidClick = () => {
    navigate(`/Payment/${bidId}`);
  }
   
  if (!bidData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading bid details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-3xl w-full">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            
          <img
         src={`https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${bidData.freelancer_id?.image}`}
            alt="Freelancer Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{bidData.freelancer_id?.name}</h2>
            <p className="text-indigo-600">{bidData.freelancer_id?.email}</p>
          </div>
        </div>

        {/* Bid and Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h4 className="font-semibold">Project Title:</h4>
            <p>{bidData.job_id?.job_title || 'Not Provided'}</p>
          </div>

          <div>
            <h4 className="font-semibold">Client Name:</h4>
            <p>{bidData.client_id?.name || 'Not Provided'}</p>
          </div>

          <div>
            <h4 className="font-semibold">Bid Amount:</h4>
            <p className="text-green-600 font-bold">₹ {bidData?.bid_amount}</p>
          </div>

          <div>
            <h4 className="font-semibold">Status:</h4>
            <p>{bidData.status}</p>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold">Bid Message:</h4>
            <p className="leading-relaxed">{bidData.message || 'No additional message provided.'}</p>
          </div>
        </div>

        {/* Accept Button */}
        <div className="mt-8 text-center">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition" onClick={()=>handleAcceptBidClick(bidData._id)}>
            Accept Bid
          </button>
        </div>

      </div>
    </div>
  );
};

export default AcceptBid;
