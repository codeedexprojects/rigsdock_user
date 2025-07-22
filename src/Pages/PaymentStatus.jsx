import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { paymentstatusAPI } from "../Services/orderconfirm";
import { XCircle, Loader2, CheckCircle } from "lucide-react";

function PaymentStatus() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

 useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const orderId = params.get("order_id"); // Changed from transaction_id to order_id

      if (!orderId) {
        toast.error("Missing order ID");
        setLoading(false);
        return;
      }

      try {
        // Check local storage for pending order
        const pendingOrder = JSON.parse(localStorage.getItem("pendingPhonePeOrder"));
        
        if (!pendingOrder) {
          toast.error("Order session expired. Please check your orders.");
          setLoading(false);
          return;
        }

        // Verify payment status using orderId
        const result = await paymentstatusAPI(orderId, "order"); // Changed to "order" type
        console.log("Payment verification result:", result);

        setOrderDetails(result);

        // Handle status cases
        if (result.phonepeStatus === "SUCCESS" || 
            result.paymentStatus === "Paid" || 
            result.phonepeStatus === "COMPLETED") {
          // Successful payment
          setStatus("success");
          localStorage.removeItem("pendingPhonePeOrder");
          
          navigate("/order-confirmed", {
            state: { orderId: result.orderId },
            replace: true,
          });
          
        } else if (result.phonepeStatus === "FAILED") {
          // Payment failed
          setStatus("failed");
          localStorage.removeItem("pendingPhonePeOrder");
        } else {
          // Still processing
          setTimeout(verifyPayment, 2000);
          return;
        }

      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Failed to verify payment status");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  const handleRetry = () => {
    navigate("/checkout");
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Verifying your payment...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a few moments
            </p>
          </div>
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
          <p className="text-gray-600 mb-6">
            Your order has been confirmed. You'll be redirected shortly.
          </p>
        </div>
      </div>
    );
  }

  // Failed or error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          {status === "failed" ? "Payment Failed" : "Error Occurred"}
        </h2>
        
        {orderDetails?.orderId && (
          <p className="text-sm text-gray-500 mb-2">
            Order ID: {orderDetails.orderId}
          </p>
        )}
        
        <p className="text-gray-600 mb-6">
          {status === "failed"
            ? "Your payment was not completed. Please try again."
            : "We encountered an error verifying your payment. Please check your orders."}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleBackToCart}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentStatus;