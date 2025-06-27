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
    const updated = [...otpDigits];
    updated[index] = value.replace(/[^0-9]/g, "");
    setOtpDigits(updated);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = otpDigits.join("");
    if (otp.length < 6) {
      toast.error("Please enter all 6 digits");
      setOtpError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTPAPI({ identifier, otp, identifierType });
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.userId);
      toast.success(res.message || "Login successful");
      navigate("/"); 
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
      setOtpError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/30 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6 relative space-y-6 text-center">
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
              type="text"
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
          className="w-full bg-black text-white py-3 rounded-md font-medium hover:opacity-90 transition"
          onClick={handleVerify}
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