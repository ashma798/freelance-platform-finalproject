import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ClientNavbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [clientId, setClientId] = useState('');
  const [userName, setUserName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <nav className="bg-indigo-900 shadow-lg w-full">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-white text-2xl font-semibold">
          FreelanceHub
        </Link>

        {/* Main Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/client/clientdashboard" className="text-white hover:text-gray-300">Dashboard</Link>
          <Link to="/Jobs/Jobs" className="text-white hover:text-gray-300">Projects</Link>
          <Link to="/Freelancer/myProposal" className="text-white hover:text-gray-300">Proposals</Link>
          <Link to="/Jobs/addJob" className="text-white hover:text-gray-300">Post Job</Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="text-white font-medium">Logged as {userName}</span>
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
                  <Link to={`/Client/clientProfile?clientId=${clientId}`} className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                </li>
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

        <div className="md:hidden flex items-center">
          <button className="text-white focus:outline-none">
            <span className="text-xl">&#9776;</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavbar;
