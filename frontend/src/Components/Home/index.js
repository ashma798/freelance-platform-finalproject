import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig/axiosConfig';
import Slider from 'react-slick';

const Spinner = () => (
  <div className="flex justify-center items-center min-h-[300px]">
    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
  </div>
);

const Home = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);
  const [review, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [freelancerRes, clientRes, reviewRes] = await Promise.all([
          axiosInstance.get('/users/getFreelancerDetails'),
          axiosInstance.get('/users/viewClient'),
          axiosInstance.get('/users/viewReview'),
        ]);
        setFreelancers(freelancerRes.data.data);
        setClients(clientRes.data.data);
        setReviews(reviewRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
//console.log(freelancers);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold">Find Top Freelancers & Build Amazing Projects</h1>
        <p className="mt-4 text-xl">Connect with professionals for your next project</p>
        <button
          onClick={() => navigate("/authentication/login")}
          className="mt-8 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition duration-300"
        >
          Get Started
        </button>
      </section>

      {/* Freelancer Carousel */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Top Freelancers</h2>
        {loading ? (
          <Spinner />
        ) : (
          <Slider {...carouselSettings}>
            {freelancers.map((freelancer) => (
              <div key={freelancer._id} className="px-3">
                <div className="bg-gray-50 rounded-xl shadow-md hover:shadow-2xl p-5 text-center h-[360px] flex flex-col items-center">
                  <img
                    src={
                      freelancer.image
                        ? `https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${freelancer.image}`
                        : "/default-avatar.png"
                    }
                    alt={freelancer.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-800">{freelancer.name}</h3>
                  <p className="text-gray-500 text-sm">{freelancer.email}</p>
                  <p className="text-gray-500 text-sm">{freelancer.role || "Freelancer"}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-3">{freelancer.bio}</p>
                  {/* Reviews and Rating Section */}
                  <div className="mt-4 flex items-center space-x-2">
                    {/* Star rating - you can customize to show filled/unfilled stars */}
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(freelancer.avgRating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
                      </svg>
                    ))}

                    {/* Review count */}
                    <span className="text-gray-600 text-sm">
                      ({freelancer.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* Client Carousel */}
      <section className="py-16 px-4 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Trusted Clients</h2>
        {loading ? (
          <Spinner />
        ) : (
          <Slider {...carouselSettings}>
            {clients.map((client) => (
              <div key={client._id} className="px-3">
                <div className="bg-white rounded-xl shadow-md hover:shadow-2xl p-6 text-center h-[380px] flex flex-col items-center">
                  <img
                    src={
                      client.image
                        ? `https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${client.image}`
                        : "/default-avatar.png"
                    }
                    alt={client.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-green-200 mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
                  <p className="text-gray-500 text-sm">{client.email}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                    {client.bio || "Trusted partner working on innovative projects."}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Next Project?</h2>
        <p className="text-xl mb-6">Find skilled freelancers or post your job today!</p>
        <div className="flex justify-center space-x-6 flex-wrap">
          <button
            onClick={() => navigate("/authentication/login")}
            className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition duration-300"
          >
            Find a Freelancer
          </button>
          <button
            onClick={() => navigate("/authentication/login")}
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition duration-300"
          >
            Post a Job
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
