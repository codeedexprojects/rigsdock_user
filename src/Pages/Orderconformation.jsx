import React, { useEffect } from "react";
import {
  CheckCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Orderconformation() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  console.log("Order ID from location:", orderId);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-56">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Order Confirmed!
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
          <div className="mt-6 bg-blue-600 text-white py-2 px-4 inline-block rounded-md">
            Order #:{orderId || "Unavailable"}
          </div>
        </div>
 
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/shop"
            className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Shopping
          </Link>
          <Link
            to="/user"
            state={{ section: "Orders", orderId }}
            className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Order Details
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link to="/about" className="text-blue-600 hover:text-blue-500">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Orderconformation;
