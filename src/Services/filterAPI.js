import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";

export const filterProductsByBrandAPI = async (brand) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/product/filter-by-brand?brand=${brand}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering by brand:", error);
    throw error;
  }
};

export const filterProductsByPriceAPI = async (minPrice, maxPrice) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/product/filter-by-price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering by price range:", error);
    throw error;
  }
};


export const filterProductsByRatingAPI = async (minRating) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/product/filter-by-rating?minRating=${minRating}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering by rating:", error);
    throw error;
  }
};