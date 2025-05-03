import ClientNavbar from "../Components/Navbar/ClientNavbar";
import FreelancerNavbar from "../Components/Navbar/FreelancerNavbar";
import AdminNavbar from "../Components/Navbar/AdminNavbar";
import Footer from "../Components/Footer/Footer";
import { ToastContainer } from 'react-toastify';       
import 'react-toastify/dist/ReactToastify.css';  
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("@user"));
    setRole(user?.role);
    setLoading(false);
  }, [location]); 

  const renderNavbar = () => {
    switch (role) {
      case "admin":
        return <AdminNavbar />;
      case "client":
        return <ClientNavbar />;
      case "freelancer":
        return <FreelancerNavbar />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderNavbar()}
      <div className="container mt-4">{children}</div>
      <ToastContainer position="top-right" autoClose={1000} />       
      <Footer />
    </>
  );
};

export default Layout;
