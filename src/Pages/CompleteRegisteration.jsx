import React, { useState } from 'react';
import { completeRegistrationAPI } from '../Services/authAPI';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CompleteRegisteration() {
  const { state } = useLocation();
  const userId = state?.userId;
  const identifier = state?.identifier;
  const identifierType = state?.identifierType;
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    email: identifierType === 'email' ? identifier : '',
    mobileNumber: identifierType === 'phone' ? identifier : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

 const handleRegister = async (e) => {
  e.preventDefault(); // prevent form reload

  try {
    const response = await completeRegistrationAPI({ ...userData, userId });

    const { token, userId: returnedUserId, message } = response;

    toast.success(message || 'Registration completed!');
    localStorage.setItem("token", token);
    localStorage.setItem("userId", returnedUserId);

    setTimeout(() => navigate('/'), 1500);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registration failed.');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form className="space-y-5" onSubmit={handleRegister}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="mobileNumber"
              value={userData.mobileNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="1234567890"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleteRegisteration;
