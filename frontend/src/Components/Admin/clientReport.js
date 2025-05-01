import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';

const ClientListPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get('/users/userReport');  
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.log("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleFilter = () => {
    let filtered = clients;

    
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    

    setFilteredClients(filtered);
  };

  
  useEffect(() => {
    handleFilter();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Client List</h2>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              className="px-4 py-2 border rounded-lg w-full md:w-1/3"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          
          </div>
        </div>
      </div>

      {/* Client List Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
          <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Contact No</th>
              <th className="py-2 px-4 text-left">Country</th>
              <th className="py-2 px-4 text-left">Active/Inactive</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, index) => (
              <tr key={index} className="border-t">
              <td className="py-2 px-4">{client.name}</td>
              <td className="py-2 px-4">{client.email}</td>
              <td className="py-2 px-4">{client.role}</td>
              <td className="py-2 px-4">{client.phone}</td>
              <td className="py-2 px-4">{client.country}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-3 py-1 rounded-full ${
                    client.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {client.isActive ? "Active" : "Inactive"}
                </span>
              </td>
             
              
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientListPage;
