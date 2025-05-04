import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {Link } from 'react-router-dom';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [userList, setUserList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [freelancerList, setFreelancerList] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const userResponse = await axiosInstance.get('/users/viewClient');
      setUserList(userResponse.data.data);

      const jobResponse = await axiosInstance.get('/users/viewJob');
      setJobList(jobResponse.data.data);

      const freelancerResponse = await axiosInstance.get('/users/getFreelancers');
      setFreelancerList(freelancerResponse.data.data);
    } catch (err) {
      console.log("Error fetching dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartLabels = ['Jobs', 'Freelancers', 'Clients'];
  const chartDataCounts = [jobList.length, freelancerList.length, userList.length];

  const barChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Counts',
        data: chartDataCounts,
        backgroundColor: ['#60a5fa', '#34d399', '#fbbf24'],
        borderWidth: 1,
      },
    ],
  };

  const handleToggleStatus = (id, type) => {
    if (type === 'user') {
      const updatedList = userList.map(user => {
        if (user._id === id) {
          return { ...user, isActive: !user.isActive };
        }
        return user;
      });
      setUserList(updatedList);
    } else if (type === 'job') {
      const updatedList = jobList.map(job => {
        if (job._id === id) {
          return { ...job, isActive: !job.isActive };
        }
        return job;
      });
      setJobList(updatedList);
    }
  };

  const handleDelete = (id, type) => {
    if (type === 'user') {
      const updatedList = userList.filter(user => user._id !== id);
      setUserList(updatedList);
    } else if (type === 'job') {
      const updatedList = jobList.filter(job => job._id !== id);
      setJobList(updatedList);
    }
  };

  const handleView = (id, type) => {
    if (type === 'user') {
      const selectedUser = userList.find(user => user._id === id);
      console.log(selectedUser);  
    } else if (type === 'job') {
      const selectedJob = jobList.find(job => job._id === id);
      console.log(selectedJob);  
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
     
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h4 className="text-gray-500">Jobs</h4>
            <p className="text-2xl font-bold">{jobList.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h4 className="text-gray-500">Freelancers</h4>
            <p className="text-2xl font-bold">{freelancerList.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h4 className="text-gray-500">Clients</h4>
            <p className="text-2xl font-bold">{userList.length}</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-4">Overview</h3>
          <div className="h-96 w-2/3 mx-auto">
            <Bar 
              data={barChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { position: 'top' } },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* User List with Toggle, View, and Delete */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-2xl font-semibold mb-4">User List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4">{user.isActive ? 'Active' : 'Inactive'}</td>
                    <td className="py-2 px-4 flex space-x-4">
                      <button
                        onClick={() => handleView(user._id, 'user')}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(user._id, 'user')}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          checked={user.isActive}
                          onChange={() => handleToggleStatus(user._id, 'user')}
                        />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job List with Toggle, View, and Delete */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-2xl font-semibold mb-4">Job List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Job Title</th>
                  <th className="py-2 px-4 text-left">Deadline</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Active/Inactive</th>
                  <th className="py-2 px-4 text-left flex space-x-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobList.map((job, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{job.job_title}</td>
                    {job.deadline ? new Date(job.deadline).toLocaleDateString('en-GB') : ''}
                    <td className="py-2 px-4">{job.status}</td>
                    <td className="py-2 px-4">{job.isActive ? 'Active' : 'Inactive'}</td>
                    <td className="py-2 px-4 flex space-x-4">
                      
                      <button
                        onClick={() => handleDelete(job._id, 'job')}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          checked={job.isActive}
                          onChange={() => handleToggleStatus(job._id, 'job')}
                        />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
