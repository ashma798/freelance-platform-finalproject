import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useNavigate,useLocation } from 'react-router-dom';

const ClientDashboard = () => {
  const [search, setSearch] = useState('');
  const [freelancerList, setFreelancerList] = useState([]);
  const [freelancerCount, setFreelancerCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [openProjectCount, setOpenProjectCount] = useState(0);
  const [proposalCount, setProposalCount] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);
  const [postedJob, setPostedJob] = useState(null);
 

const location = useLocation();


  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStatus = async () => {
      try {
        const jobResponse = await axiosInstance.get('/users/getJobCount');
        setJobCount(jobResponse.data.count);

        const openCount = await axiosInstance.get('/users/getOpenProjectCount');
        setOpenProjectCount(openCount.data.count);

        const proposalCount = await axiosInstance.get('/users/getProposalCount');
        setProposalCount(proposalCount.data.count);

        } catch (err) {
        console.error("Error fetching dashboard stats", err);
      }
    };
    fetchDashboardStatus();
  }, []);

  useEffect(() => {
    const fetchFreelancerList = async () => {
      try {
        const response = await axiosInstance.get('/users/getFreelancers');
        setFreelancerList(response.data.data);
        setFreelancerCount(response.data.data.length);
        //console.log("freelancer data:",response.data.data);
        localStorage.setItem('freelancerlist', JSON.stringify(response.data.data));
      } catch (err) {
        console.error('Error fetching freelancers:', err);
      }
    };
    fetchFreelancerList();
  },[location.pathname]);

  const handlePostJobClick = () => navigate('/Jobs/addJob');

  const handleContactClick = (freelancerId) => {
    navigate(`/Freelancer/freelancerProfile?freelancerId=${freelancerId}`);
  };

  const handleFreelancerInvite = async (freelancerId) => {
    try {
      const response = await axiosInstance.post('/users/getLastPostedJobId');
      const jobId = response.data.data;

      await axiosInstance.post('/users/inviteFreelancer', {
        freelancer_id: freelancerId,
        job_id: jobId
      });
    } catch (err) {
      console.log("Error sending invite:", err);
    }
  };

  const handleViewJobClick = (jobId) => {
    navigate(`/Jobs/jobDetails?jobId=${jobId}`);
  };

  const handleAddReviewClick = (freelancerId) => {
    navigate(`/Client/AddReview?${freelancerId}`);
    };
  

  const filteredFreelancers = search
  ? freelancerList.filter((f) => 
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
    )
  : freelancerList;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Welcome, Client!</h2>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        {[{ label: 'Total Projects', value: jobCount, icon: 'bi-folder-fill', color: 'primary' },
          { label: 'Proposals', value: proposalCount, icon: 'bi-clipboard-check-fill', color: 'success' },
          { label: 'Freelancers', value: freelancerCount, icon: 'bi-people-fill', color: 'info' },
          { label: 'Open Projects', value: openProjectCount, icon: 'bi-briefcase-fill', color: 'warning' },
          { label: 'Payments', value: paymentCount, icon: 'bi-cash-coin', color: 'purple' }
        ].map(({ label, value, icon, color }, index) => (
          <div key={index} className="col-md-2 col-sm-6">
            <div className={`bg-${color} text-white p-3 rounded text-center`}>
              <i className={`bi ${icon} fs-4`}></i>
              <p className="mb-0">{label}</p>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
        <div className="col-md-2 col-sm-12 d-flex align-items-center">
          <button className="btn btn-danger w-100" onClick={handlePostJobClick}>Post a Job</button>
        </div>
        {postedJob && (
          <div className="col-md-2 col-sm-12 d-flex align-items-center">
            <button
              className="btn btn-info w-100"
              onClick={() => handleViewJobClick(postedJob._id)}
            >
              View Posted Job
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-light p-3 rounded mb-4 d-flex align-items-center gap-3">
        <i className="bi bi-search fs-4"></i>
        <input
          type="text"
          className="form-control"
          placeholder="Search freelancers by name or Skills "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Freelancer Cards */}
      <h4>Available Freelancers</h4>
      <div className="row">
        {filteredFreelancers.map((freelancer, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="d-flex mb-3">
                  <img
                   src={`https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${freelancer.image}`}
                    alt="Freelancer"
                    className="rounded me-3"
                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                  />
                  <div>
                    <h5 className="card-title mb-1">{freelancer.name}</h5>
                    <p className="text-muted small mb-2">{freelancer.portfolio_links}</p>
                    <div className="d-flex flex-wrap gap-1">
                      {freelancer.skills.map((skill, i) => (
                        <span key={i} className="badge bg-secondary">{skill}</span>
                      ))}
                    </div>
                    <p className="mt-2 mb-0"><strong>Experience:</strong> {freelancer.experience} years</p>
                  </div>
                </div>

                <div className="mt-auto d-flex gap-2">
                  <button className="btn btn-outline-primary btn-sm w-50" onClick={() => handleContactClick(freelancer._id)}>Contact</button>
                  <button className="btn btn-outline-success btn-sm w-50" onClick={() => handleFreelancerInvite(freelancer._id)}>Invite to Bid</button>
                  <button
                    className="btn btn-outline-warning btn-sm w-50"
                    onClick={() => handleAddReviewClick(freelancer._id)}
                  >
                    Add Review
                  </button>
                </div>
                
                 
              </div>
            </div>
          </div>
        ))}
        {filteredFreelancers.length === 0 && <p className="text-muted">No freelancers found.</p>}
      </div>
    </div>
  );
};

export default ClientDashboard;
