import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { XCircle, Loader2, CheckCircle } from "lucide-react";
import { BASE_URL } from "../Services/baseUrl";

function PaymentStatus() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const orderId = params.get("order_id");
  const mainOrderId = params.get("mainOrderId"); 

  const clearPendingOrder = () => {
    localStorage.removeItem("pendingPhonePeOrder");
  };

  useEffect(() => {
    const pendingOrder = localStorage.getItem("pendingPhonePeOrder");
    if (pendingOrder) {
      const orderData = JSON.parse(pendingOrder);
      setOrderDetails(orderData);

      const targetMainOrderId = mainOrderId || orderData.mainOrderId;

      if (orderId) {
        verifyPayment(orderId, targetMainOrderId);
      } else {
        checkOrderStatus(targetMainOrderId);
      }
    } else if (orderId && mainOrderId) {
      verifyPayment(orderId, mainOrderId);
    } else if (mainOrderId) {
      checkOrderStatus(mainOrderId);
    } else {
      setStatus("error");
      setMessage("No order information found. Redirecting to home...");
      setTimeout(() => navigate("/"), 3000);
    }
  }, [orderId, mainOrderId, navigate]);

  const checkOrderStatus = async (targetMainOrderId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/order/payment-status/${targetMainOrderId}`
      );

      if (response.data.paymentStatus === "Paid") {
        setStatus("success");
        setMessage("Payment successful! Redirecting to order confirmation...");
        clearPendingOrder();
        setTimeout(() => {
          navigate("/order-confirmed", { state: { orderId: targetMainOrderId } });
        }, 3000);
      } else if (response.data.paymentStatus === "Processing") {
        setStatus("pending");
        setMessage(
          "Payment is still processing. We'll notify you when complete."
        );
        setTimeout(() => checkOrderStatus(targetMainOrderId), 5000);
      } else {
        setStatus("error");
        setMessage("Payment failed. Redirecting to checkout...");
        clearPendingOrder();
        setTimeout(() => {
          navigate(`/checkout?retry_order=${targetMainOrderId}`);
        }, 3000);
      }
    } catch (error) {
      console.error("Error checking order status:", error);
      setStatus("error");
      setMessage("Error verifying payment status. Redirecting to home...");
      clearPendingOrder();
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (transactionId, targetMainOrderId) => {
    try {
      setStatus("verifying");
      setMessage("Verifying your payment...");
      
      const response = await axios.get(
        `${BASE_URL}/api/user/order/payment-status/${targetMainOrderId}`
      );
      
      if (response.data.paymentStatus === "Paid") {
        setStatus("success");
        setMessage("Payment successful! Redirecting to order confirmation...");
        clearPendingOrder();
        setTimeout(() => {
          navigate("/order-confirmation", { state: { orderId: targetMainOrderId } });
        }, 3000);
      } else if (response.data.paymentStatus === "Processing") {
        if (response.data.phonepeStatus) {
          handlePhonePeStatus(response.data.phonepeStatus, targetMainOrderId);
        } else {
          setStatus("pending");
          setMessage(
            "Payment is still processing. We'll notify you when complete."
          );
          setTimeout(() => verifyPayment(transactionId, targetMainOrderId), 5000);
        }
      } else {
        setStatus("error");
        setMessage("Payment failed. Redirecting to checkout...");
        clearPendingOrder();
        setTimeout(() => {
          navigate(`/checkout?retry_order=${targetMainOrderId}`);
        }, 3000);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("error");
      setMessage("Verification failed. Redirecting to home...");
      clearPendingOrder();
      setTimeout(() => navigate("/"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePeStatus = (phonepeStatus, targetMainOrderId) => {
    switch (phonepeStatus) {
      case "checkout.order.completed":
        setStatus("success");
        setMessage("Payment successful! Redirecting to order confirmation...");
        clearPendingOrder();
        setTimeout(() => {
          navigate("/order-confirmation", { state: { orderId: targetMainOrderId } });
        }, 3000);
        break;
      case "checkout.order.failed":
      case "checkout.transaction.attempt.failed":
        setStatus("error");
        setMessage("Payment failed. Redirecting to checkout...");
        clearPendingOrder();
        setTimeout(() => {
          navigate(`/checkout?retry_order=${targetMainOrderId}`);
        }, 3000);
        break;
      default:
        setStatus("pending");
        setMessage(
          "Payment is still processing. We'll notify you when complete."
        );
        setTimeout(() => verifyPayment(`MT_${targetMainOrderId}`, targetMainOrderId), 5000);
    }
  };

  if (loading || status === "verifying" || status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-lg font-medium text-gray-700">{message}</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">{message}</p>
      </div>
    </div>
  );
}

export default PaymentStatus;