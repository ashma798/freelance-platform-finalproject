import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const FinalPayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { bidId } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [bidData, setBidData] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialPayment, setInitialPayment] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const res = await axiosInstance.get(`/users/finalDetails/${bidId}`);
        if (res.data.success) {
          const { jobDetails, initialPayment, remainingAmount } = res.data;
          setJobDetails(jobDetails);
          setInitialPayment(initialPayment);
          setRemainingAmount(remainingAmount);
          const stripeRes = await axiosInstance.post('/users/createPayment', {
                    clientId:jobDetails.client_id,
                    jobId : jobDetails._id,
                     amount: remainingAmount ,
                  });
                   console.log("Stripe Response:", stripeRes.data);
        setClientSecret(stripeRes.data.clientSecret);
         
        }
      } catch (error) {
        toast.error('Error fetching payment details');
      }
    };

    if (bidId) {
      fetchPaymentDetails();
    }
  }, [bidId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        await axiosInstance.post('/users/finalPaymentRelease', {
           clientId:jobDetails.client_id,
          jobId: jobDetails?._id,
          amount: remainingAmount
        });

        toast.success('Final Payment successful!');
        navigate('/Client/clientdashboard');
      }
    } catch (err) {
      toast.error('Payment processing error');
    }

    setLoading(false);
  };

  if (!jobDetails) {
    return <p>Loading job details...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Finalize Your Payment</h2>
        
        <div className="mb-6 text-gray-600">
          <p><strong>Title:</strong> {jobDetails?.title}</p>
          <p><strong>Description:</strong> {jobDetails?.description}</p>
          <p><strong>Budget:</strong> ₹ {jobDetails.budget?.$numberDecimal}</p>
          <p><strong>Status:</strong> {jobDetails.status}</p>
        </div>

        <div className="p-4 border rounded mb-4">
          <h3 className="font-semibold mb-2">Payment Breakdown:</h3>
          <p>Initial Payment (50%): ₹ {initialPayment} (Paid)</p>
          <p>Remaining Payment (50%): ₹ {remainingAmount}</p>
          <p>Total: ₹ {initialPayment + remainingAmount}</p>
        </div>

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
  );
};

export default FinalPayment;

