import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';



const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { bidId } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [bidData, setBidData] = useState(null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const res = await axiosInstance.get(`/users/getbidDetails/${bidId}`);
        setBidData(res.data.data);
       
        const halfAmount = res.data.data.bid_amount / 2;
        const stripeRes = await axiosInstance.post('/users/createPayment', {
          clientId:res.data.data.client_id._id,
          jobId : res.data.data.job_id._id,
          amount: halfAmount,
        });
       console.log("Stripe Response:", stripeRes.data);
        setClientSecret(stripeRes.data.clientSecret);
       
      }
      catch (error) {
        toast.error('Error fetching bid details');
      }
    }
    if (bidId) {
      fetchBidDetails();
    }
  }, [bidId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    console.log(result.paymentIntent); 

    if (result.error) {
      alert(result.error.message);
      setLoading(false);
    } else if (result.paymentIntent.status === 'succeeded') {

      await axiosInstance.post('/users/initialPaymentRelease', {
        clientId: bidData.client_id._id,
        freelancerId: bidData.freelancer_id._id,
        jobId: bidData.job_id._id,
        amount: bidData.bid_amount / 2,
      });

      toast.success('Payment successful!');
      navigate('/Client/clientdashboard');
    }
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Pay 50% to Accept Bid</h2>
        <p className="mb-6 text-gray-600">Project: {bidData?.job_id?.job_title}</p>

        <div className="p-4 border rounded mb-4">
          <CardElement />
        </div>

        <button
          type="submit"
         disabled={!stripe || !elements || loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  )
};

export default Payment;
