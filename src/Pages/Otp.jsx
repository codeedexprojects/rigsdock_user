import React, { useState } from "react";
import { X, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTPAPI } from "../Services/authAPI";

function Otp() {
  const location = useLocation();
  const { identifier } = location.state || {};
  const identifierType = identifier?.includes('@') ? 'email' : 'phone';
  
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const navigate = useNavigate();

const handleChange = (value, index) => {
  const isNumber = /^[0-9]$/.test(value);

  if (!isNumber && value !== "") {
    toast.error("Only numbers are allowed in OTP");
    return;
  }

  const updated = [...otpDigits];
  updated[index] = value;
  setOtpDigits(updated);
  setOtpError(false);

  if (value && index < 5) {
    document.getElementById(`otp-${index + 1}`)?.focus();
  }
};

const handleVerifyOTP = async () => {
  const enteredOtp = otpDigits.join("");

  if (enteredOtp.length !== 6) {
    setOtpError(true);
    toast.error("Please enter a valid 6-digit OTP");
    return;
  }

  setLoading(true);
  try {
    const response = await verifyOTPAPI({
      identifier,
      otp: enteredOtp,
    });

    const { token, userId, isRegistered, message } = response;

    toast.success(message || "OTP verified successfully");

    // Always save token and userId to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);

    // Check if isRegistered field exists and is explicitly false
    if (isRegistered === false) {
      // 🆕 New user: go to registration page
      navigate("/registeration", {
        state: {
          identifier,
          identifierType,
          userId,
        },
      });
    } else {
      // ✅ User is registered or isRegistered field is not present/true
      // Redirect to dashboard/home
      navigate("/"); // or "/home", based on your app
    }
  } catch (error) {
    setOtpError(true);
    toast.error(error.response?.data?.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};

return (
    <div className="min-h-screen bg-blue-100 backdrop-blur-md flex items-center justify-center p-4 ">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 relative space-y-6 text-center">
       <button
  className="absolute top-4 right-4 text-gray-500 hover:text-black"
  onClick={() => navigate("/login")}
>
  <X size={20} />
</button>

        <div className="flex justify-center">
          <div className="bg-cyan-500 p-3 rounded-full">
            <Lock size={24} className="text-white" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800">Enter OTP</h3>
        {identifier && (
          <p className="text-sm text-gray-500">Sent to <strong>{identifier}</strong></p>
        )}

        <div className="flex justify-center gap-2">
          {otpDigits.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="tel"
              maxLength="1"
              value={digit}
              onChange={(e) => {
                handleChange(e.target.value, i);
                setOtpError(false);
              }}
              className={`w-10 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 ${
                otpError 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:ring-cyan-500"
              }`}
            />
          ))}
        </div>

        {otpError && (
          <p className="text-red-500 text-sm mt-2">Invalid OTP. Please try again.</p>
        )}

        <button
          className="w-full bg-blue-800 text-white py-3 rounded-md font-medium hover:opacity-90 transition"
          onClick={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? "Verifying..." : "CONTINUE"}
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Otp;