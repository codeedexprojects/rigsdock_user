import axios from "axios";
import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonApi";
// get allproducts api

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/product/get`, {
    });
    
    return response.data.products;
  } catch (error) {
    console.error("Failed to get products", error);
    throw error;
  }
};


export const viewProducts = async (mainCatId, catId, subCatId) => {
  try {
    // Convert "null" string to actual null (if coming from URL)
    const finalSubCatId = subCatId === "null" ? null : subCatId;
    
    const response = await axios.get(
      `${BASE_URL}/user/product/get/${mainCatId}/${catId}/${finalSubCatId || 'null'}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products', error); // Changed error message
    throw error;
  }
};

// view products by id
export const viewProductsByIdAPI = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/product/get/${productId}`, {
    });
    return response.data;
  } catch (error) {
    console.error('Failed to register', error);
    throw error;
  }
};

export const getSimilarProductsAPI = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/product/get/similar/${productId}`);
    return response.data.similarProducts; // Return the similar products array
  } catch (error) {
    console.error("Failed to fetch similar products", error);
    return []; // Return an empty array in case of error
  }
};


// searchproducts
export const searchProductAPI = async(query)=>{
  try {
    const response = await axios.get(`${BASE_URL}/user/product/search/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

// top rated products

export const getLatestProductsAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/product/get`);
    const sortedProducts = response.data.products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
      .slice(0, 7); 
    return sortedProducts;
  } catch (error) {
    console.error("Failed to fetch latest products", error);
    throw error;
  }
};


// Dealoftheday
export const dealOfTheDayAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/dealoftheday/get`, {
    });
    return response.data;
    } catch (error) {
    console.error("Failed to get cart", error);
    throw error;
  }
};

// brandAPI
export const getBrandAPI = async () =>{
  try{
    const response = await axios.get(`${BASE_URL}/user/brand/view`,{

    })
    return response.data

  }catch(error){
    console.error("Failed to view brand",error);
    throw error
    
  }
 
};
// OFFER API

export const getHomeOfferAPI =async()=>{
  try{
    const response = await axios.get(`${BASE_URL}/user/homeoffer/get`,{

    })
    return response.data

  }catch(err){
    console.error("Failed to get",err);
    throw err
    
  }
}
export const getHomeCategoryAPI =async()=>{
  try{
    const response = await axios.get(`${BASE_URL}/user/homecategory/get`,{

    })
    return response.data

  }catch(err){
    console.error("Failed to get",err);
    throw err
    
  }
}

// productCarousel
 export const productCarouselAPI = async()=>{
  try{
    const response = await axios.get(`${BASE_URL}/admin/carousel/view`)
    return response.data
  }catch(error){
    console.error("error display carousel",error);
    throw error
  }
 }