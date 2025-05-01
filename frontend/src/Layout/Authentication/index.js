import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { userLogin } from "../../apiUtils/userApi";
import { toast } from 'react-toastify';



export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("@token");
    const user = localStorage.getItem("@user");
    const currentPath = window.location.pathname;

    if (user && token && currentPath === "/Authentication/login") {
      const userData = JSON.parse(user);
      const usrrole = userData.role;
      if (usrrole === "admin") navigate("/admin/admindashboard", { replace: true });
      else if (usrrole === "freelancer") navigate("/freelancer/freelancerdashboard", { replace: true });
      else if (usrrole === "client") navigate("/client/clientdashboard", { replace: true });
      else navigate("/unauthorized", { replace: true });
    }
  }, []);

  const isValid = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return trimmedEmail && trimmedPassword && emailPattern.test(trimmedEmail);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValid()) {
      try {
        const response = await userLogin({ email, password });
        if (response?.success) {
           toast.success('Login successful!');
          localStorage.setItem("@token", response.user.token);
          localStorage.setItem("@user", JSON.stringify(response.user.user));
          const role = response.user.user.role;
          if (role === "admin") navigate("/admin/admindashboard");
          else if (role === "freelancer") navigate("/freelancer/freelancerdashboard");
          else if (role === "client") navigate("/client/clientdashboard");
          else navigate("/unauthorized");
        } else {
          toast.error("Enter valid email and password");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Incorrect email or password.");
        }
      }
    } else {
      toast.error("Please enter a valid email and password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-start px-4 login-container">
    <div class="w-full max-w-[400px] ml-[120px] bg-white/40 p-4 rounded-xl shadow-lg backdrop-blur-sm">
  
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
          <NavLink
            to="/authentication/register"
            className="block text-center text-sm text-white hover:underline mt-2"
          >
            New user? Register
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default Login;





