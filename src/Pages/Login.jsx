import React, { useState } from 'react';
import { sendOTPAPI } from '../Services/authAPI';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';




function Login() {

  const [identifier, setIdentifier] = useState('');
  const navigate = useNavigate();

  
 const handleSendOTP = async () => {
  if (!identifier) {
    toast.warning("Please enter your email or phone number.");
    return;
  }

  try {
    const response = await sendOTPAPI(identifier);
    toast.success(response.message || "OTP sent successfully!");
    
    // Delay navigation by 1 second to allow toast to be visible
    setTimeout(() => {
      navigate('/otp-login', { 
        state: { 
          identifier,
          identifierType: identifier.includes('@') ? 'email' : 'phone'
        } 
      });
    }, 1000);
    
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
  }
};

  return (
      <div className="min-h-screen bg-black/30 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        {/* Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <p className="text-sm text-gray-600">Enter your email or phone number to receive an OTP</p>
        </div>

        {/* Input Field */}
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
            Email or Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="example@mail.com or 9876543210"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 transition-colors"
          />
        </div>

        {/* Send OTP Button */}
        <button
          type="button"
          onClick={handleSendOTP}
          className="w-full text-white py-3 px-6 rounded-md font-medium transition-colors"
          style={{ backgroundColor: 'rgb(10, 95, 191)' }}
        >
          Send OTP
        </button>
        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-sm text-gray-600">Don't have an account yet? </span>
          <a
            href="/register"
            className="text-sm font-medium underline hover:opacity-80 transition"
            style={{ color: 'rgb(10, 95, 191)' }}
          >
            Sign up
          </a>
        </div>
      </div>
            <ToastContainer position="top-right" autoClose={3000} />
    </div>
   
  )
}

export default Login
