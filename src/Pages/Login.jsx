import React, { useState } from 'react';
import { sendOTPAPI } from '../Services/authAPI';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Mail, Smartphone } from 'lucide-react';

function Login() {

  const [identifier, setIdentifier] = useState('');
  const navigate = useNavigate();

 const getInputType = () => {
    if (!identifier) return 'none';
    return identifier.includes('@') ? 'email' : 'phone';
  };
  
   const inputType = getInputType();

  
 const handleSendOTP = async () => {
  if (!identifier) {
    toast.warning("Please enter your email or phone number.");
    return;
  }

  try {
    const response = await sendOTPAPI(identifier);
    toast.success(response.message || "OTP sent successfully!");
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
 <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 mt-5">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-blue-600/70 text-sm">
              Enter your email or phone number to receive an OTP
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-2">
            <label htmlFor="contact" className="block text-sm font-semibold text-blue-800 mb-3">
              Email or Phone Number <span className="text-red-500">*</span>
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {getInputType() === 'email' && (
                  <Mail className="h-5 w-5 text-blue-500 transition-all duration-200" />
                )}
                {getInputType() === 'phone' && (
                  <Smartphone className="h-5 w-5 text-blue-500 transition-all duration-200" />
                )}
                {getInputType() === 'none' && (
                  <div className="h-5 w-5 rounded-full border-2 border-blue-300 transition-all duration-200"></div>
                )}
              </div>
              
              <input
                type="text"
                id="contact"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="example@mail.com or 9876543210"
                className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/50 text-blue-900 placeholder-blue-400"
              />
            </div>
          </div>

          {/* Send OTP Button */}
          <button
            type="button"
            onClick={handleSendOTP}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Send OTP
          </button>

          {/* Decorative Elements */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-blue-500 font-medium">Secure Login</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-blue-500/70">
              We'll send you a verification code for secure access
            </p>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-0 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>
      </div>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        className="mt-16"
        toastClassName="bg-white border border-blue-200 text-blue-800"
      />
    </div>
   
  )
}

export default Login
