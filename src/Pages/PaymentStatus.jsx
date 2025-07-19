import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { paymentstatusAPI } from "../Services/orderconfirm";


function PaymentStatus() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      const params = new URLSearchParams(location.search);
      const orderId = params.get("order_id");

      if (!orderId) {
        toast.error("No order ID found.");
        setLoading(false);
        return;
      }

      try {
        const result = await paymentstatusAPI(orderId);
        console.log("Payment Status:", result);

        if (result.phonepeStatus === "SUCCESS") {
          navigate("/order-confirmed", {
            state: { orderId: result.orderId },
            replace: true,
          });
        } else {
          toast.error("Payment failed or was cancelled. Please try again.");
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

  return (
    <div className="text-center mt-5 py-10">
      {loading ? (
        <p className="text-lg font-medium text-gray-600">Processing your payment...</p>
      ) : (
        <p className="text-lg text-red-600">Payment failed or not completed.</p>
      )}
    </div>
  );
}

export default PaymentStatus;
