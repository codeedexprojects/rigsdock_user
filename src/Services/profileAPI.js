import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";


// getProfile
export const getProfileAPI = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/auth/profile/${id}`, {
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get products", error);
    throw error;
  }
};


// viewaddressapi
export const userAddressViewAPI = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/address/${userId}`, {
    });
    return response.data;
  } catch (error) {
    console.error("Failed to remove item from wishlist", error);
    throw error;
  }
};


// add address
export const addAddressAPI = async (reqBody)=>{
try{
    const response = await axios.post(`${BASE_URL}/user/address/add`, reqBody,{

    })
    return response.data;
}catch(error){
    console.log("failed to add address", error);
    throw error
    
}
}


// delete address
export const deleteAddressAPI = async(addressId)=>{
  try{
    const response=await axios.delete(`${BASE_URL}/user/address/delete/${addressId}`,{
    });
    return response.data;
  } catch (error){
    console.error("Failed to delete address",error);
    throw error;
  }
}

// editadressAPI
export const editAddressAPI = async (addressId, updatedData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/user/address/update/${addressId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update address", error);
    throw error;
  }
};



// userOrders
export const userOrdersAPI = async(id)=>{
  try{
    const response=await axios.get(`${BASE_URL}/user/order/user/${id}`,{
    });
    return response.data;
  } catch (error){
    console.error("Failed to delete address",error);
    throw error;
  }
}

// orderDetails

export const orderDetailsAPI = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/order/${orderId}`);
    console.log("Fetched Order Data:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Failed to fetch order details", error);
    throw error;
  }
};


export const getEditProfileAPI = async (id, data) => {
  try {
    const response = await axios.patch(`${BASE_URL}/user/auth/profile/${id}`,data, {
      headers:{ "Content-Type": "application/json"}
    });
    console.log("error",response)
    return response.data;
  } catch (error) {
    throw error;
  }
}; 


