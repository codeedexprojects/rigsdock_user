import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'


function PaymentStatus() {

    const navigate = useNavigate()
    const location = useLocation() 

 useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");

    if (orderId) {
      navigate("/order-confirmed", {
        state: { orderId },
        replace: true,
      });
    } 
  }, [location, navigate]);

  return <p className="text-center mt-5 py-10">Processing Your payment...</p>;
}

export default PaymentStatus;
