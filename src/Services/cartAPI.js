import axios from "axios";
import { BASE_URL } from "./baseUrl";

// addtoCART

export const addToCartAPI = async (userId, productId, quantity = 1) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/cart/add`, {
      userId,
      productId,
      quantity
    });
    
    return response.data;
  } catch (error) {
    console.error("Failed to add to cart", error);
    throw error;
  }
}

// viewCartAPI

export const viewcartAPI = async(userId)=>{
    try{
        const response = await axios.get(`${BASE_URL}/user/cart/${userId}`,{
 })
    return response.data
    }catch(error){
        console.log("failed to get cart", error);
        throw error
        
    }
}


// remove cart

export const removeCartAPI = async(userId, productId)=>{
  try{

    const response = await axios.post(`${BASE_URL}/user/cart/remove`,{
      userId,
      productId,
    })
    return response.data
  }catch(error){
    console.log("failed to remove", error);
    throw error
    
  }
}

// UpdateCartQuantity

export const updateCartQuantityAPI = async (userId, productId, action) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/cart/update-quantity`, {
      userId,
      productId,
      action, 
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart quantity:", error.response?.data || error.message);
    throw error;
  }
};

// cartcount
export const cartCountAPI = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/cart/count/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering by rating:", error);
    throw error;
  }
};

// getcoupon
export const getCouponsAPI = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/admin/coupon/get`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch coupons", error);
    throw error;
  }
}

// applycouponAPI
export const applycouponAPI = async (userId, couponCode) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/cart/apply-coupon`, {
      userId,
      couponCode,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error("Failed to apply coupon:", message);
    throw error;
  }
};


// remove coupon
export const removeCouponAPI = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/cart/remove-coupon`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to apply coupon", error);
    throw error;
  }
};

// create checkoutAPI

export const checkoutAPI = async (userId)=>{
  try{
    const response = await axios.post(`${BASE_URL}/user/checkout/create`,{
      userId,
    })
    return response.data
  }catch(error){
    console.log("error occured",error);
    throw error
    
  }
}
// viewCheckoutapi
export const viewCheckoutAPI = async (userId)=>{
  try {
    const response = await axios.get(`${BASE_URL}/user/checkout/view/${userId}`, {
    });
    return response.data;
  } catch (error) {
    console.error("Failed to view checkout", error);
    throw error;
  }
}

// placeorderAPI

export const placeOrderAPI = async (orderData)=>{
 try {
    const response = await axios.post(`${BASE_URL}/user/order/place-order`, orderData);
    return response.data;
  } catch (error) {
    console.error("Failed to place order", error);
    throw error;
  }
}
