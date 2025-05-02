import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Components/axiosConfig/axiosConfig";
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneno, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState(null);
  const [portfolio_links, setPortfolio_links] = useState("");
  const [hourly_rate, setHourly_rate] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");

  const navigate = useNavigate();

  const handleRoleChange = (e) => setRole(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneno)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneno", phoneno);
    formData.append("country", country);
    formData.append("role", role);

    if (role === "freelancer") {
      formData.append("portfolio_links", portfolio_links);
      formData.append("hourly_rate", hourly_rate);
      formData.append("experience", experience);
      formData.append("skills", skills);
      formData.append("bio", about);
    } else if (role === "client") {
      formData.append("company", company);
      formData.append("website", website);
      formData.append("bio", about);
    }

    try {
      const response = await axiosInstance.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success('Registration successful!');
        navigate("/authentication/login", { replace: true });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error('Registration failed! Something went wrong.');
      
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create an Account
        </h2>

        <div className="w-full text-center mb-6">
          <span
            onClick={() => navigate("/authentication/login")}
            className="text-blue-600 hover:text-blue-800 cursor-pointer underline transition-all"
          >
            Already Registered? Login
          </span>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            className="input-classy"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input-classy"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="input-classy"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-classy"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="input-classy"
            type="tel"
            placeholder="Phone (10 digits)"
            value={phoneno}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            className="input-classy"
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />

          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-600 text-sm font-medium">
              Profile Picture
            </label>
            <input
              className="block w-full text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-2.5"
              type="file"
              onChange={handleImageChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-600 text-sm font-medium">
              Select Role
            </label>
            <select
              className="input-classy"
              value={role}
              onChange={handleRoleChange}
              required
            >
              <option value="">--Select Role--</option>
              <option value="admin">Admin</option>
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>

          {role === "freelancer" && (
            <>
              <input
                className="input-classy"
                type="text"
                placeholder="Portfolio Links"
                value={portfolio_links}
                onChange={(e) => setPortfolio_links(e.target.value)}
                required
              />
              <input
                className="input-classy"
                type="number"
                placeholder="Hourly Rate"
                value={hourly_rate}
                onChange={(e) => setHourly_rate(e.target.value)}
                required
              />
              <input
                className="input-classy"
                type="number"
                placeholder="Experience (years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
              <input
                className="input-classy"
                type="text"
                placeholder="Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
             <textarea
                className="input-classy md:col-span-2 resize-none h-28"
                placeholder="Bio"
               value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </>
          )}

          {role === "client" && (
            <>
              <input
                className="input-classy"
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <input
                className="input-classy"
                type="text"
                placeholder="Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <textarea
                className="input-classy md:col-span-2 resize-none h-28"
                placeholder="Bio"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </>
          )}

          <button
            type="submit"
            className="md:col-span-2 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
