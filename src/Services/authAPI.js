import axios from "axios";
import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonApi";

// user login
export const loginAPI = async (reqBody) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/auth/login`, reqBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to login', error);
    throw error;
  }
};

// otp send

export const sendOTPAPI = async (identifier) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/auth/send-otp`, { identifier });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// verifyOTP
export const verifyOTPAPI = async ({ identifier, otp, identifierType }) => {
    // console.log("Sending OTP verification request with:", { userId, otp });
  try {
    const response = await axios.post(`${BASE_URL}/user/auth/verify-otp`, { 
      identifier,
      otp,
      identifierType
    });
        localStorage.setItem("token",response.token)

    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// USERRegsiterAPI
export const completeRegistrationAPI = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/auth/register-with-mobile`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};