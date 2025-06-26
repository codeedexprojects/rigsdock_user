import axios from "axios";
import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonApi";

export const getUserReviews = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/reviews/user/${userId}`, {
    });
    return response.data.reviews;
  } catch (error) {
    console.error('Failed to get reviews', error);
    throw error;
  }
};

export const addReviews = async(formData) => {
  try {
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    if (!formData.has('productId') || !formData.get('productId')) {
      throw new Error('Product ID is missing');
    }
    
    const response = await axios.post(`${BASE_URL}/user/reviews/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add review", error);
    throw error;
  }
}