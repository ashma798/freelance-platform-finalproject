import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig/axiosConfig';

const ClientProfile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get('clientId');
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const response = await axiosInstance.get(`/users/clientProfile/${clientId}`);
        console.log("res:", response.data);
        setClientData(response.data.data);
      } catch (error) {
        console.error('Error fetching client profile:', error);
      }
    };

    fetchClientProfile();
  }, []);

  if (!clientData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading Profile...</p>
      </div>
    );
  }
  const cloudinaryImageUrl = clientData.image 
  ? `https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${clientData.image}`
  : '/path/to/default-image.jpg';
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full -8 mx-5">
        <div className="flex flex-col md:flex-row items-center md:items-start min-h-[400px]">
          
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8 ml-6">
  <img
    className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 mt-5"
    src={cloudinaryImageUrl}
    alt="Profile"
  />
  <div className="mt-4 text-center">
    <h2 className="text-3xl font-bold text-gray-800">{clientData.name}</h2>
    <p className="text-indigo-600 text-lg">{clientData.email}</p>
  </div>
</div>
          {/* Profile Details */}
          <div className="flex-1 mb-6 mx-6 mt-5">
            <h2 className="text-3xl font-bold text-gray-800 mb-2"></h2>
            <p className="text-indigo-600 text-lg mb-4">{clientData.companyName || 'Company Not Provided'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h4 className="font-semibold">Email:</h4>
                <p>{clientData.email}</p>
              </div>

              <div>
                <h4 className="font-semibold">Phone:</h4>
                <p>{clientData.phone || 'Not Provided'}</p>
              </div>

              <div>
                <h4 className="font-semibold">Website:</h4>
                {clientData.website ? (
                  <a
                    href={clientData.website}
                    className="text-indigo-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {clientData.website}
                  </a>
                ) : (
                  <p>Not Provided</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold">Location:</h4>
                <p>{clientData.country || 'Not Provided'}</p>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-semibold">Bio:</h4>
                <p className="leading-relaxed">{clientData.bio || 'No bio available.'}</p>
              </div>
            </div>

          </div>

        </div>

        {/* Optional Edit Profile Button */}
       {/*} <div className="mt-8 text-right">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
            Edit Profile
          </button>
        </div>*/}

      </div>
    </div>
  );
};

export default ClientProfile;
