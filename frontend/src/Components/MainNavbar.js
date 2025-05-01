import React from 'react';
import { ClientNavbar, FreelancerNavbar, AdminNavbar } from '../Components/Navbar';

const MainNavbar = () => {
  const role = JSON.parse(localStorage.getItem("@user"))?.role;

  if (role === 'freelancer') return <FreelancerNavbar />;
  if (role === 'admin') return <AdminNavbar />;
  if ((role === 'client') || (!role)) return <ClientNavbar />;

  return <ClientNavbar />;
  
};

export default MainNavbar;

