import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";

export const confirmOrderAPI = async (orderData) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/order/place-order`, orderData);
    return response.data;
  } catch (error) {
    console.error("Failed to place order", error);
    throw error;
  }
};
