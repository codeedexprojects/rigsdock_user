import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";

export const vendorRegisterAPI = async (reqBody) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/vendor/register`, reqBody, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to Register', error);
    throw error;
  }
};

export const verifyBank = async (accountNumber, ifscCode) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/vendor/verify-bank`, {
      accountNumber,
      ifscCode  
    });
    
    return response.data;
  } catch (error) {
    console.error("Error verifying bank details:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Bank verification failed"
    };
  }
};

export const verifyaccount = async (accountNumber, ifscCode) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/vendor/verifyaccount?accountNumber=${accountNumber}&ifscCode=${ifscCode}`);
    return response.data;
  } catch (error) {
    console.error("Failed to verify account", error);
    return [];
  }
};

export const verifypan = async (panNumber) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/vendor/verifypan?panNumber=${panNumber}`);
    return response.data;
  } catch (error) {
    console.error("Failed to verify pan", error);
    return [];
  }
};

export const verifygst = async (gstNumber) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/vendor/verifygst?gstNumber=${gstNumber}`);
    return response.data;
  } catch (error) {
    console.error("Failed to verify gst", error);
    return [];
  }
};