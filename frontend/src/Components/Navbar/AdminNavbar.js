import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [userName, setUserName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('@user'));
    if (userData) {
      setClientId(userData._id);
      setUserName(userData.name);
      setImageUrl(userData.image || 'https://via.placeholder.com/150');
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@token');
    localStorage.removeItem('@user');
    navigate('/Authentication/login');
  };



  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-4 shadow-lg">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link to="/admin/dashboard" className="text-white text-2xl font-bold hover:text-gray-300 transition-all">
          AdminPanel
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/Admin/admindashboard" className="text-white hover:text-gray-300 transition-all">Dashboard</Link>
          <Link to="/Admin/clientReport" className="text-white hover:text-gray-300 transition-all">clients</Link>
          <Link to="/Admin/freelancerReport" className="text-white hover:text-gray-300 transition-all">Freelancers</Link>
          
          {/* Profile Dropdown */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="text-white font-medium whitespace-nowrap">Logged as {userName}</span>
              <img
                src={`https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${imageUrl}`}
                alt="Profile"
                className="rounded-full w-10 h-10 border-2 border-white"
              />
              <svg className="w-4 h-4 text-white ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
              
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>


        {/* Mobile navbar */}
        <button className="md:hidden text-white" aria-label="Open menu">
          <span className="text-2xl">&#9776;</span> {/* Hamburger icon */}
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;






