import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig/axiosConfig';
import Slider from 'react-slick';


const Home = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const freelancerRes = await axiosInstance.get('/users/getFreelancers');
        //console.log("freelancers data:", freelancerRes);
        const clientRes = await axiosInstance.get('/users/viewClient');
        setFreelancers(freelancerRes.data.data);
        setClients(clientRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold">Find Top Freelancers & Build Amazing Projects</h1>
        <p className="mt-4 text-xl">Connect with professionals for your next project</p>
        <button className="mt-8 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition duration-300"  onClick={() => navigate("/authentication/login")}>
          Get Started
        </button>
      </section>

      {/* Freelancer Carousel */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Top Freelancers</h2>
        <div className="px-5 bg-gray-100 mb-5 mt-5">
          <Slider {...carouselSettings}>
            {freelancers.map((freelancer) => (
              <div key={freelancer._id} className="px-3">
              <div className="bg-white shadow-xl rounded-2xl p-3 text-center h-[300px] flex flex-col items-center justify-between overflow-hidden">
                <img
                  src={`https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${freelancer.image}`|| "/default-avatar.png"}
                  alt={freelancer.name}
                  className="w-28 mt-2 h-28 rounded-full object-cover mb-3 border-4 border-blue-200"
                />
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{freelancer.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{freelancer.profession || "Freelancer"}</p>
                 
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition">
                  View Profile
                </button>
              </div>
            </div>

            ))}
          </Slider>
        </div>
      </section>

      {/* Client Carousel */}
      <section className="bg-gray-100 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Trusted Clients</h2>
        <div className="px-5">
          <Slider {...carouselSettings}>
            {clients.map((client) => (
              <div key={client._id} className="px-3">
                <div className="bg-white shadow-lg rounded-xl p-6 text-center">
                  <img
                    src={`https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${client.image}`}
                    alt={client.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">{client.name}</h3>
                  <p className="text-gray-500">{client.description}</p>
                  <button className="mt-6 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300">
                    View Jobs
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Next Project?</h2>
        <p className="text-xl mb-6">Find skilled freelancers or post your job today!</p>
        <div className="flex justify-center space-x-6">
          <button className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition duration-300"  onClick={() => navigate("/authentication/login")}>
            Find a Freelancer
          </button>
          <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition duration-300"  onClick={() => navigate("/authentication/login")}>
            Post a Job
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
