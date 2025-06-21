import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";



// getwishlist
export const getWishlistAPI = async (userId)=>{
    try{
        const response = await axios.get(`${BASE_URL}/user/wishlist/${userId}`,{
})
return response.data.products
    }catch(err){
        console.error("failed to get wishlist",err);
        throw err
    }

}


// addtowishlist
export const addToWishlistAPI = async (userId, productId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/wishlist/add`,
      { userId, productId },
      {
        headers: {
          "Content-Type": "application/json", 
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to add to wishlist", err.response?.data || err);
    throw err;
  }
};


// remove wishlist
export const removewishlistAPI = async (userId, productId)=>{
    try{
        const response = await axios.post(`${BASE_URL}/user/wishlist/remove`,{
             userId,
      productId
        })
return response.data
    }catch(err){
        console.error("error removing wishlist", err);
        throw err
        
    }
}