import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";



// view main categories
export const viewMainCategoriesAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/maincategory/get`, {
      
    });
    return response.data;
  } catch (error) {
    console.error('Failed to view main categories', error);
    throw error;
  }
};

// view categories
export const viewCategoriesAPI = async (mainCatId) => {
     console.log("Calling viewCategoriesAPI with:", mainCatId);

  try {
    const response = await axios.get(`${BASE_URL}/user/category/view/${mainCatId}`, {
    });
     console.log("viewCategoriesAPI RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to view categories', error);
    throw error;
  }
}

// view sub categories
export const viewSubCategoriesAPI = async (mainCatId, catId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/subcategory/view/${mainCatId}/${catId}`, {
    });
    return response.data;
  } catch (error) {
    console.error('Failed to view subcategories', error);
    throw error;
  }
};