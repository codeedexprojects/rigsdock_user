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


// GetBlog

export const getBlogAPI = async ()=>{
  try{
    const response = await axios.get(`${BASE_URL}/user/blog/view`,{

    })
    return response.data

  }catch(error){
    console.error("Failed to view Blog", error);
    throw error
    
  }
}