import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig/axiosConfig';
import Chat from '../Chat/Chat';
import { toast } from 'react-toastify';

const FreelancerProfile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const freelancerId = queryParams.get('freelancerId');
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      try {
        const res = await axiosInstance.get(`/users/freelancerProfile/${freelancerId}`);
        setFreelancerData(res.data.data);
       
      } catch (error) {
        toast.error('Error fetching freelancer profile');
      } finally {
        setLoading(false);
      }
    };

    if (freelancerId) {
      fetchFreelancerProfile();
    }
  }, [freelancerId]);
  
  const toggleChat = () => {
    setOpenChat(!openChat);
  };


  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!freelancerData) return <div className="text-center text-red-500 mt-5">Profile not found</div>;

  return (
    <div className="container mx-auto my-5">
      <div className="max-w-4xl mx-auto shadow-lg border border-gray-200 rounded-lg bg-white">
        <div className="p-6">
          <div className="md:flex md:space-x-8">
            {/* Profile Section */}
            <div className="text-center md:text-left">
              <img
                src={`https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${freelancerData.image}`}
                alt="Profile"
                className="w-44 h-44 rounded-full mx-auto md:mx-0 shadow-md object-cover"
              />
              <h3 className="mt-3 text-xl font-semibold">{freelancerData.name}</h3>
              <p className="text-gray-500">{freelancerData.email}</p>
            </div>

            {/* Details Section */}
            <div className="mt-4 md:mt-0">
              {freelancerData.phone && (
                <p className="text-lg text-gray-700">
                  <strong>Contact me:</strong> {freelancerData.phone}
                </p>
              )}
              {freelancerData.country && (
                <p className="text-lg text-gray-700">
                  <strong>Location:</strong> {freelancerData.country}
                </p>
              )}

              <p className="text-lg text-gray-700">
                <strong>Hourly Rate:</strong> ${freelancerData.hourly_rate}
              </p>

              <div className="mt-6">
                <h5 className="text-lg font-semibold text-green-600">Skills</h5>
                {freelancerData.skills && freelancerData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {freelancerData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-2 bg-blue-500 text-white rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>No skills listed</p>
                )}
              </div>

              <div className="mt-6">
                <h5 className="text-lg font-semibold text-green-600">Portfolio</h5>
                {freelancerData.portfolio_links ? (
                  <Link
                    to={freelancerData.portfolio_links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary mt-2 text-blue-600 underline"
                  >
                    View Portfolio
                  </Link>
                ) : (
                  <p>No portfolio available</p>
                )}
              </div>

              <div className="mt-6">
                <h4 className="text-xl font-semibold text-blue-500">About</h4>
                <p className="text-gray-700"><strong>Bio:</strong> {freelancerData.bio}</p>
              </div>
              <div>
    
      
              <button
              
        onClick={()=>toggleChat(freelancerData._id)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        💬 Chat
      </button>

      {openChat && <Chat onClose={() => setOpenChat(false)} />}
    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
















