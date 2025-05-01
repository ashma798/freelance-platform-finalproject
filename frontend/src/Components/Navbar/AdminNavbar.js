import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('@token');
    localStorage.removeItem('@user');
    navigate('/authentication/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-4 shadow-lg">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link to="/admin/dashboard" className="text-white text-2xl font-bold hover:text-gray-300 transition-all">
          AdminPanel
        </Link>

        <div className="hidden md:flex space-x-8">
          <Link to="/admin/dashboard" className="text-white hover:text-gray-300 transition-all">Dashboard</Link>
          <Link to="/admin/users" className="text-white hover:text-gray-300 transition-all">Users</Link>
          <Link to="/admin/payments" className="text-white hover:text-gray-300 transition-all">Payments</Link>
          <Link to="/admin/withdrawals" className="text-white hover:text-gray-300 transition-all">Withdrawals</Link>
          
          <div className="relative">
            <button className="text-white hover:text-gray-300 transition-all" aria-haspopup="true">
              Settings
            </button>
            <ul className="absolute right-0 bg-white shadow-lg rounded-md mt-2 w-48">
              <li><Link to="/admin/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition-all">Admin Profile</Link></li>
              <li><hr className="border-t border-gray-200" /></li>
              <li>
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 transition-all" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
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






