import React, { useEffect } from 'react'
import { CheckCircle, ShoppingBag, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';



function Orderconformation() {

  

     const order = {
    id: 'ORD-123456',
    date: new Date().toLocaleDateString(),
    total: 1499.99,
    items: [
      { id: 1, name: 'Wireless Bluetooth Headphones', price: 299.99, quantity: 2 },
      { id: 2, name: 'USB-C Charging Cable', price: 19.99, quantity: 1 },
      { id: 3, name: 'Ergonomic Mouse', price: 49.99, quantity: 1 }
    ],
    shipping: {
      name: 'John Doe',
      address: '123 Main St, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    },
    payment: {
      method: 'VISA',
      last4: '4242'
    }
  };
  const location = useLocation();
const orderId = location.state?.orderId;


console.log("Order ID from location:", orderId);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <div className="mt-6 bg-blue-600 text-white py-2 px-4 inline-block rounded-md">
           Order #: {orderId || "Unavailable"}
          </div>
        </div>

        {/* Order Summary */}
        {/* <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200 bg-blue-50">
            <h2 className="text-lg font-medium text-blue-800 flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Order Summary
            </h2>
          </div>
          <div className="px-6 py-5">
            <div className="flow-root">
              <ul className="-my-4 divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>₹{order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div> */}

       
      

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
            Need help? <Link to="/contact" className="text-blue-600 hover:text-blue-500">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Orderconformation
