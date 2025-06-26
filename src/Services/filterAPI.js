import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";

export const filterByBrandAPI = async (brandId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/product/filter/brand/${brandId}`);
console.log("res[onse",response);

    return response.data;
  } catch (error) {
    console.error("Error filtering by brand:", error);
    throw error;
  }
};

export const filterByPriceAPI = async (minPrice, maxPrice) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/product/filter/price?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering by price range:", error);
    throw error;
  }
};

export const filterByyRatingAPI = async(minRate, maxRate)=>{
  try{
    const response = await axios.get(`${BASE_URL}/user/product/filter/rating?minRating=${minRate}&maxRate=${maxRate}`)    
    return response.data
  }catch(error){
    console.error("Error filtering by Ratings", error);
    throw error
    
  }
}


