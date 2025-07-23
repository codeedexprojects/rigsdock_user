import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { paymentstatusAPI } from "../Services/orderconfirm";
import { XCircle, Loader2 } from "lucide-react";

function PaymentStatus() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("PaymentStatus mounted", location.pathname);

  useEffect(() => {
    const checkStatus = async () => {
      const params = new URLSearchParams(location.search);
      const orderId  = params.get("orderId");

      if (!orderId) {
        toast.error("No order ID found.");
        setLoading(false);
        return;
      }

      try {
        const result = await paymentstatusAPI(orderId,"transaction");
        console.log("Payment Status:", result);

        if (result.phonepeStatus === "COMPLETED") {
          navigate("/order-confirmed", {
            state: { orderId: result.orderId },
            replace: true,
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        toast.error("Unable to verify payment. Please contact support.");
        setLoading(false);
      }
    };

    checkStatus();
  }, [location, navigate]);

  const handleBackToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Processing your payment...
            </p>
          </div>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment was not completed. Please try again or contact
              support if the issue persists.
            </p>
            <button
              onClick={handleBackToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentStatus;
