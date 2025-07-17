import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Header from "../Components/Header";
import { cancelOrderAPI } from "../Services/orderconfirm";
import "react-toastify/dist/ReactToastify.css";


function CancelOrder() {
   const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const [reason, setReason] = useState("");

const handleCancel = async () => {
  if (!reason.trim()) {
    toast.warning("Please enter a reason");
    return;
  }

  try {
    const response = await cancelOrderAPI(orderId, reason); 
    toast.success(response.message);
 setTimeout(() => {
      navigate("/user", { state: { section: "Orders" } });
    }, 1500);  } catch (err) {
    toast.error(err.response?.data?.error || "Cancel failed");
  }
};

return (
    <>
    <Header/>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 mt-5">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Cancel Order</h2>
        <p className="text-gray-600">Please provide a reason for cancellation:</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          rows={4}
          placeholder="Write your reason..."
        ></textarea>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
          >
            Go Back
          </button>
          <button
            onClick={handleCancel}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
    <ToastContainer position="top-right" autoClose={3000} />

    </>
  )
}

export default CancelOrder
