import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // If needed to get freelancerId from URL

const BidList = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem('@user'));

  const freelancerId = loggedInUser._id; 

  // Fetch bids when component mounts
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get(`/users/myBids/${freelancerId}`);
        setBids(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bids:", error);
        setLoading(false);
      }
    };
    fetchBids();
  }, [freelancerId]);

  if (loading) {
    return <div>Loading bids...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Bid List</h2>

      {bids.length === 0 ? (
        <p>No bids found.</p>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{bid.job_id.title}</h3>
                <span
                  className={`${
                    bid.status === "approved" ? "text-green-500" : "text-yellow-500"
                  } font-semibold`}
                >
                  {bid.status}
                </span>
              </div>
              <p className="text-gray-700">{bid.job_id.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500">Bid Amount: ${bid.bid_amount}</span>
                <a
                  href={`/job/${bid.job_id._id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Job
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidList;
