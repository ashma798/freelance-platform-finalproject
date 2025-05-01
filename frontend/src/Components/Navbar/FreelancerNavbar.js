import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FreelancerNavbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('@user'));
    if (userData) {
      setUserName(userData.name);
      setImageUrl(userData.image || 'https://via.placeholder.com/40');
    }

    // Close dropdown on outside click
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
    <nav className="bg-green-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">FreelanceHub</Link>

        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Nav Links */}
        <ul className={`lg:flex lg:items-center lg:space-x-6 ${mobileMenuOpen ? 'block mt-4' : 'hidden'} lg:block`}>
          <li><Link to="/Freelancer/freelancerdashboard" className="block py-2 hover:text-gray-300">Dashboard</Link></li>
          <li><Link to="/Jobs/Jobs" className="block py-2 hover:text-gray-300">Browse Jobs</Link></li>
          <li><Link to="/Freelancer/getMessages" className="block py-2 hover:text-gray-300">Inbox</Link></li>
          <li><Link to="#" className="block py-2 hover:text-gray-300">My Bids</Link></li>
          <li><Link to="#" className="block py-2 hover:text-gray-300">My Work</Link></li>
          <li><Link to="#" className="block py-2 hover:text-gray-300">Free Credit</Link></li>
        </ul>

        {/* Right-side Profile Info */}
        <div className="relative ml-4" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:text-gray-200 focus:outline-none"
          >
            <img src={`https://res.cloudinary.com/dg6a6mitp/image/upload/v1746047520/${imageUrl}`} alt="Profile" className="w-8 h-8 rounded-full" />
            <span className="hidden sm:block text-sm font-medium">Logged in as {userName}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-md z-50">
              <li>
                <Link to="/Freelancer/freelancerProfile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              </li>
              <li>
                <Link to="#" className="block px-4 py-2 hover:bg-gray-100">Wallet</Link>
              </li>
              <li><hr className="my-1" /></li>
              <li>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default FreelancerNavbar;
