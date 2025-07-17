import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { returnOrderAPI } from '../Services/orderconfirm';
import Header from '../Components/Header';
const BASE_URL = "https://rigsdock.com";
function ReturnOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId, orderId, name, image } = location.state || {};
  const [previewImage, setPreviewImage] = useState(null);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setPreviewImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login to submit return request");
      return;
    }
    if (!reason) {
      toast.error("Please select a reason for return.");
      return;
    }
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("orderId", orderId);
    formData.append("productId", productId);
    formData.append("complaintType", reason);
    formData.append("description", description);
    if (imageFile) {
      formData.append("images", imageFile); 
    }
    try {
      const result = await returnOrderAPI(formData);
      console.log("API Response:", result);
  toast.success("Return request submitted successfully!");
setTimeout(() => {
  navigate("/user", { state: { section: "Orders" } });
}, 1500);
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response);
      const errorMessage = error.response?.data?.message ||
                         error.message ||
                         "Error submitting return request";
      toast.error(errorMessage);
    }
  };
  return (
    <>
    <Header/>
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-56">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Reason for <span className='text-blue-700'>Returning</span> Product
      </h2>
      <div className="mb-4 flex items-center space-x-4">
        <img
          src={`${BASE_URL}/uploads/${image}`}
          alt={name}
          className="w-20 h-20 object-cover rounded"
        />
        <p className="font-medium">{name}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Select Reason --</option>
          <option value="Damaged Product">Damaged Product</option>
          <option value="Wrong Item">Wrong item received</option>
          <option value="Missing Item">Missing Item</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <div>
          <label className="block mb-1 font-medium">Upload Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Uploaded preview"
              className="w-32 h-32 object-cover rounded border mt-2"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Submit Complaint
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </>
  );
}
export default ReturnOrder;