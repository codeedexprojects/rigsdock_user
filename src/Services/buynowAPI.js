import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";


export const buyNowAPI = async (userId, productId, quantity) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/product/buy`, {
      userId,
      productId,
      quantity
    });
    return response.data;
  }catch (error) {
  console.error( error?.response?.data || error.message);
  throw error;

  }
};