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

// downloadInvoice

export const downloadUserInvoice = async (orderId) => {
  const url = `${BASE_URL}/user/order/${orderId}/invoice`;
  try {
    // First, get the invoice URL
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate invoice');
    }
    const data = await response.json();
    if (!data.pdfUrl) {
      throw new Error('Invoice URL not found in response');
    }
    let pdfUrl = data.pdfUrl;
    if (!pdfUrl.startsWith('http')) {
      pdfUrl = `${BASE_URL}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
    }

    if (pdfUrl.startsWith('http://')) {
  pdfUrl = pdfUrl.replace('http://', 'https://');
}
    // Fetch the actual PDF file
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download invoice PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
    }
    const pdfBlob = await pdfResponse.blob();
    const downloadUrl = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `user-invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    return { success: true, message: 'Invoice downloaded successfully' };
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error: error.message || "Error downloading invoice",
    };
  }
};



