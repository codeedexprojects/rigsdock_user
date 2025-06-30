import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addReviews, getUserReviews } from '../Services/getUserReviewAPI';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '../Components/Header';
function AddReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId, orderId, name, images } = location.state || {};
  const userId = localStorage.getItem("userId");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState({ title: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const ratingLabels = ["Poor", "Bad", "Good", "Very Good", "Excellent"];
  const StarRating = ({ rating, setRating }) => (
    <div className="flex items-center gap-2 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => setRating(star)}
          xmlns="http://www.w3.org/2000/svg"
          fill={star <= rating ? "#FACC15" : "none"}
          viewBox="0 0 24 24"
          stroke="#FACC15"
          strokeWidth="2"
          className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.302 3.997a1 1 0 00.95.69h4.21c.969 0 1.371 1.24.588 1.81l-3.405 2.475a1 1 0 00-.364 1.118l1.302 3.997c.3.921-.755 1.688-1.538 1.118l-3.405-2.475a1 1 0 00-1.175 0l-3.405 2.475c-.783.57-1.838-.197-1.538-1.118l1.302-3.997a1 1 0 00-.364-1.118L2.21 9.424c-.783-.57-.38-1.81.588-1.81h4.21a1 1 0 00.95-.69l1.302-3.997z"
          />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-2">
        {rating ? ratingLabels[rating - 1] : "Select rating"}
      </span>
    </div>
  );
  const handleSubmit = async () => {
    if (alreadyReviewed) return setError("You have already reviewed this product.");
    if (!productId) return setError("Product ID is missing");
    if (!orderId) return setError("Order ID is missing");
    if (!userId) return setError("Please log in to submit a review");
    if (rating === 0) return setError("Please select a rating");
    if (!review.description.trim()) return setError("Please write a review");
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("productId", productId);
    formData.append("orderId", orderId);
    formData.append("rating", rating);
    formData.append("review", review.description);
    if (imageFile) {
      formData.append("images", imageFile);
    }
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const response = await addReviews(formData);
      console.log("API Response:", response);
      toast.success("Review submitted successfully!");
      setRating(0);
      setReview({ title: "", description: "" });
      setImage(null);
      setImageFile(null);
      setTimeout(() => navigate("/user", { state: { section: "Orders" } }), 1500);
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error?.response);
      const message = error.response?.data?.message ||
                    error.message ||
                    "Failed to submit review. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    const checkReviewExists = async () => {
      if (!userId || !productId) return;
      try {
        const reviews = await getUserReviews(userId);
        const hasReviewed = reviews.some(
          (rev) => rev.productId === productId
        );
        setAlreadyReviewed(hasReviewed);
      } catch (err) {
        console.error("Failed to check for existing review", err);
      }
    };
    checkReviewExists();
  }, [userId, productId]);
  return (
    <>
    <Header/>
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
      {image && (
        <img
          src={image}
          alt="Preview"
          className="w-32 h-32 object-cover mb-4 rounded"
        />
      )}
      {name && (
        <p className="mb-4 font-medium text-gray-800">{name}</p>
      )}
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Your Rating</label>
        <StarRating rating={rating} setRating={setRating} />
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Your Review</label>
        <textarea
          value={review.description}
          onChange={(e) => setReview({ ...review, description: e.target.value })}
          rows={4}
          className="w-full border p-2 rounded"
          placeholder="Write something about the product..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">Upload Image (Optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading || alreadyReviewed}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } ${alreadyReviewed ? "bg-gray-400 cursor-not-allowed" : ""}`}
      >
        {loading ? "Submitting..." : alreadyReviewed ? "Already Reviewed" : "Submit Review"}
      </button>
            <ToastContainer position="top-right" autoClose={3000} />
      
    </div>
    </>
  );
}
export default AddReview;