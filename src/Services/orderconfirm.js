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

export const returnOrderAPI = async(formData) => {
  try {
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
        if (!formData.has('productId') || !formData.get('productId')) {
      throw new Error('Product ID is missing');
    }
    
    const response = await axios.post(`${BASE_URL}/user/complaint/register`, formData, {
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

// cancelOrder

export const cancelOrderAPI = async (orderId, reason) =>{
  const token = localStorage.getItem("rigsdock_accessToken");
  try{
    const response = await axios.patch(`${BASE_URL}/user/orders/cancel/${orderId}`,{reason},{
      headers:{
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      }
    })
    return response.data
  }catch(error){
    console.error("failed to cancel Order", error);
    throw error
  }
}

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


// paymentstatus
export const paymentstatusAPI = async()=>{
  try{
    const response = await axios.get(`${BASE_URL}/user/order/payment-status/${mainOrderId}`,{

    })

    return response.data;
  }catch(error){
    console.error("failed to get status", error);
    throw error
    
  }
}

