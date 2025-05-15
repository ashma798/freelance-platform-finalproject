import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';
import Swal from 'sweetalert2';
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

      const jobResponse = await axiosInstance.get('/users/listJobs');
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

  const handleDelete = async (id, type) => {
    try {
      const url = type === 'user' ? '/users/deleteUser' : '/users/deleteJob';
      await axiosInstance.delete(url, {
        data: type === 'user' ? { userId: id } : { jobId: id },
      });

      Swal.fire({
        icon: 'success',
        title: `${type === 'user' ? 'User' : 'Job'} deleted successfully`,
        showConfirmButton: false,
        timer: 1500,
      });

      if (type === 'user') {
        setUserList(prev => prev.filter(user => user._id !== id));
      } else {
        setJobList(prev => prev.filter(job => job._id !== id));
      }
    } catch (error) {
      console.log('Error deleting:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  };

  const handleToggleStatus = async (id, type) => {
    try {
      const url = type === 'user' ? '/users/toggleUserStatus' : '/users/toggleJobStatus';
      const response = await axiosInstance.post(url, { id });

    
      if (response.data.success) {
        if (type === 'user') {
          setUserList(prev =>
            prev.map(user => (user._id === id ? { ...user, isActive: !user.isActive } : user))
          );
        } else {
          setJobList(prev =>
            prev.map(job => (job._id === id ? { ...job, isActive: !job.isActive } : job))
          );
        }
      }
    } catch (error) {
      console.log('Error toggling status:', error);
    }
  };

 
  const handleView = (id, type) => {
  const selectedItem =
    type === 'user'
      ? userList.find((user) => user._id === id)
      : jobList.find((job) => job._id === id);
     // console.log(selectedItem.budget);
Swal.fire({
    title: `
      <div class="text-2xl font-bold text-gray-800 mb-2">
        ${type === 'user' ? 'User Details' : 'Job Details'}
      </div>`,
    html: `
      <div class="p-4 text-left bg-gray-50 rounded-lg space-y-3">
        ${type === 'user' ? `
          <div class="flex items-center gap-4">
            <img src="https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${selectedItem.image}" 
                 alt="Profile" 
                 class="w-24 h-24 rounded-full object-cover border"/>
            <div>
              <p class="text-lg font-semibold text-gray-700">${selectedItem.name}</p>
              <p class="text-sm text-gray-500">${selectedItem.email}</p>
              <p class="text-sm text-gray-500">${selectedItem.role}</p>
            </div>
          </div>
          <hr class="my-3 border-gray-200" />
          <div class="grid grid-cols-2 gap-4">
            <div><strong>Username:</strong> ${selectedItem.username}</div>
            <div><strong>Phone:</strong> ${selectedItem.phone}</div>
            <div><strong>Country:</strong> ${selectedItem.country}</div>
            <div><strong>Status:</strong> 
              <span class="px-2 py-1 rounded ${selectedItem.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                ${selectedItem.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ` : `
          <div class="grid grid-cols-1 gap-4">
            <div><strong>Job Title:</strong> ${selectedItem.job_title}</div>
            <div><strong>Description:</strong> ${selectedItem.description}</div>
           <div><strong>Budget:</strong> Rs ${selectedItem.budget?.$numberDecimal ?? 'N/A'}</div>

            <div><strong>Deadline:</strong> ${selectedItem.deadline ? new Date(selectedItem.deadline).toLocaleDateString('en-GB') : 'N/A'}</div>
            <div><strong>Status:</strong> 
              <span class="px-2 py-1 rounded ${selectedItem.status === 'Open' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                ${selectedItem.status}
              </span>
            </div>
            <div><strong>Active:</strong> 
              <span class="px-2 py-1 rounded ${selectedItem.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                ${selectedItem.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        `}
      </div>
    `,
    width: 600,
    showCloseButton: true,
    focusConfirm: false,
    customClass: {
      popup: 'bg-white shadow-lg rounded-lg'
    }
  });
 
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
                 <th className="py-2 px-4 text-left">Active/Deactive</th>
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
                    <th className="py-2 px-4 text-left">Active/Deactive</th>
                
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
                        onClick={() => handleView(job._id, 'job')}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
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
