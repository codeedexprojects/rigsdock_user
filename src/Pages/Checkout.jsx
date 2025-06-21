import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userAddressViewAPI } from "../Services/profileAPI";
import { viewcartAPI, viewCheckoutAPI } from "../Services/cartAPI";
import { confirmOrderAPI } from "../Services/orderconfirm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Checkout() {
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutData, setCheckoutData] = useState({
    items: [],
    totalPrice: 0,
    appliedCoupon: null,
  });
  
  const navigate = useNavigate();

  const handleNavigate = ()=>{
    navigate("/user",{state: {
      section: "Addresses"
    }
  })
     
  }

  useEffect(() => {
    async function fetchAddressesAndCart() {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      try {
        const res = await userAddressViewAPI(userId);
        setAddresses(res);
        if (res.length > 0) setSelectedAddress(res[0]._id);

        const checkout = await viewCheckoutAPI(userId);
        setCheckoutData({
          items: checkout.items || [],
          totalPrice: checkout.totalPrice || 0,
          appliedCoupon: checkout.appliedCoupon || null,
        });

        const cart = await viewcartAPI(userId);
        setCartItems(cart?.cart?.items || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchAddressesAndCart();
  }, []);

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please log in to place an order.");
      return;
    }

    if (!selectedAddress) {
      toast.warn("Please select a delivery address.");
      return;
    }

    try {
      const orderData = {
        userId,
        shippingAddressId: selectedAddress,
        paymentMethod: selectedPayment,
      };

      const response = await confirmOrderAPI(orderData);
      console.log("Order response:", response);

      if (selectedPayment === "COD") {
        navigate("/order-confirmed", {
          state: { orderId: response.mainOrderId },
        });
      } else if (selectedPayment === "PhonePe") {
        if (response.paymentUrl) {
          localStorage.setItem(
            "pendingPhonePeOrder",
            JSON.stringify({
              mainOrderId: response.mainOrderId,
              transactionId: response.phonepeTransactionId,
              timestamp: new Date().getTime(),
            })
          );
          window.location.href = response.paymentUrl;
        } else {
          throw new Error("Payment URL not received from server");
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const location = useLocation();

useEffect(() => {
  if (location.state?.section === "Addresses") {
    setActiveSection("Addresses");
  }
}, [location]);

  return (
    <>
      <Header />

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <nav className="text-sm text-gray-600 text-center">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span>Checkout</span>
            </nav>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
            CHECKOUT
          </h1>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Billing Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Billing Details
                </h2>

                {addresses.length > 0 ? (
                  <ul className="space-y-4">
                    {addresses.map((address) => (
                      <li
                        key={address._id}
                        className="p-4 border rounded-md flex items-center"
                      >
                        {/* Radio button to select this address */}
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={address._id}
                          checked={selectedAddress === address._id}
                          onChange={() => setSelectedAddress(address._id)}
                          className="mr-4 text-blue-600"
                        />

                        {/* Display address details */}
                        <div>
                          <p>
                            {address?.firstName} {address?.lastName}
                          </p>
                          <p>
                            {address?.addressLine1}, {address?.addressLine2}
                          </p>
                          <p>
                            {address?.city}, {address?.state},{" "}
                            {address?.zipCode}
                          </p>
                          <p>Phone: {address?.phone}</p>
                          <p>Address Type: {address?.addressType}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Addresses</p>
                )}
              </div>

              {/* Ship to Different Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <input
                    type="text"
                    id="different-address"
                   onClick={handleNavigate} 
                    className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="different-address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Ship to a different address?
                  </label>
                </div>

                {shipToDifferentAddress && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address 1 *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                        placeholder="House number and street name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Town / City *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Select State</option>
                          <option value="kerala">Kerala</option>
                          <option value="tamil-nadu">Tamil Nadu</option>
                          <option value="karnataka">Karnataka</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="682024"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="shippingAddressType"
                            value="home"
                            className="mr-2 text-blue-600"
                            defaultChecked
                          />
                          <span className="text-sm text-gray-700">Home</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="shippingAddressType"
                            value="office"
                            className="mr-2 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Office</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Order
                </h2>

                {/* Product List */}
                {checkoutData.items.length > 0 ? (
                  <>
                    <ul className="space-y-4 mb-6">
                      {checkoutData.items.map((item) => (
                        <li
                          key={item._id}
                          className="p-4 border rounded-md flex items-center"
                        >
                          <img
                            src={`https://rigsdock.com/uploads/${item.product.images[0]}`}
                            alt={item.product.name}
                            className="w-16 h-16 mr-4 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <div className="text-blue-600 text-sm">
                              <p>Qty: {item.quantity}</p>
                              <p>Price: ₹{item.price}</p>
                              {item.product.brand && (
                                <p>Brand: {item.product.brand}</p>
                              )}
                            </div>
                          </div>
                          <div className="font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Order Totals */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          ₹
                          {checkoutData.items
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>

                      {checkoutData.appliedCoupon &&
                        Object.keys(checkoutData.appliedCoupon).length > 0 && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Discount</span>
                            <span className="text-green-600 font-medium">
                              {checkoutData.appliedCoupon.discountType ===
                              "percentage"
                                ? `${checkoutData.appliedCoupon.discountValue}%`
                                : `-$${checkoutData.appliedCoupon.discountValue}`}
                            </span>
                          </div>
                        )}

                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="font-medium">₹5.00</span>{" "}
                        {/* Adjust as needed */}
                      </div>

                      <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                        <span>Total</span>
                        <span className="text-blue-600">
                          ₹{checkoutData.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Your order is empty</p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Method
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={selectedPayment === "COD"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <span className="font-medium text-gray-900">
                      Cash on delivery
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="PhonePe"
                      checked={selectedPayment === "PhonePe"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <span className="font-medium text-gray-900">UPI</span>
                  </label>
                </div>
                <div className="ml-6 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our{" "}
                    <Link to="/about">
                      <span className="text-blue-700 underline">
                        privacy policy.
                      </span>
                    </Link>{" "}
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      <Footer />
    </>
  );
}

export default Checkout;
