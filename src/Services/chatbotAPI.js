import axios from "axios";
import { BASE_URL } from "./baseUrl";


export const chatbotAPI = async ({ userId, message, attachments = [] }) => {
  try {
    console.log("Sending to chatbot API:", { userId, message });
    const response = await axios.post(`${BASE_URL}/user/chatbot/chat`, {
      userId,
      message,
      attachments,
    });
    console.log("Chatbot API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Chatbot API failed:", error);
    return { reply: " Unable to connect to support. Please try again later." };
  }
};

export const chatClearSessionAPI = async()=>{
  try{
    const response = await axios.post(`${BASE_URL}/user/chatbot/clear-session`,{

    })
  return response.data
  }catch(error){
    console.error("Failed to clear", error);
    
  }
}