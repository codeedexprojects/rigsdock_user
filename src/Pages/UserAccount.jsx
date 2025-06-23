import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  User,
  Package,
  Download,
  MapPin,
  Settings,
  BarChart3,
  Heart,
  LogOut,
  Trash,
  Pencil,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
  addAddressAPI,
  deleteAddressAPI,
  editAddressAPI,
  getProfileAPI,
  orderDetailsAPI,
  userAddressViewAPI,
  userOrdersAPI,
} from "../Services/profileAPI";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCartAPI } from "../Services/cartAPI";
import { getWishlistAPI } from "../Services/wishlistAPI";
import { BASE_URL } from "../Services/baseUrl";
import { useLocation } from "react-router-dom";

function UserAccount() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [addressList, setAddressList] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [editAddressId, setEditAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = "https://rigsdock.com";

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobileNumber: "",
  });
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    addressType: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await orderDetailsAPI(orderId);
      setSelectedOrder(res?.order);
    } catch (error) {
      console.error("Error fetching order details", error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const location = useLocation();

useEffect(() => {
  if (location.state?.section === "Orders") {
    setActiveSection("Orders");

    if (location.state?.orderId) {
      fetchOrderDetails(location.state.orderId);
    }
  }
}, [location]);

  const menuItems = [
    { name: "Dashboard", icon: BarChart3 },
    { name: "Orders", icon: Package },
    { name: "Addresses", icon: MapPin },
    { name: "Account details", icon: Settings },
    { name: "Wishlist", icon: Heart },
    { name: "Log out", icon: LogOut },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await getProfileAPI(userId);
        setProfile(res); // assuming response is the user object
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchProfile();
    fetchAddresses();
    fetchWishlist();
  }, []);

  const handleSaveAddress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    try {
      const reqBody = {
        ...newAddress,
        userId,
      };

      if (editAddressId) {
        // Editing an address
        const res = await editAddressAPI(editAddressId, reqBody);
        toast.success(res.message || "Address updated successfully");

        // Replace updated address in list
        setAddressList((prevList) =>
          prevList.map((addr) =>
            addr._id === editAddressId ? res.address : addr
          )
        );
      } else {
        // Adding new address
        const res = await addAddressAPI(reqBody);
        toast.success(res.message || "Address added successfully");
        setAddressList((prevList) => [...prevList, res.address]);
      }

      setNewAddress({
        firstName: "",
        lastName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        addressType: "",
      });
      setEditAddressId(null);
      setShowAddressForm(false);
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const fetchAddresses = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await userAddressViewAPI(userId);
      setAddressList(res);
    } catch (error) {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
  if (location.state?.section === "Addresses") {
    setActiveSection("Addresses");
  }
}, [location]);

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await deleteAddressAPI(addressId);
      toast.success(res.message || "Address deleted");

      // Update the addressList state to remove the deleted address
      setAddressList((prevList) =>
        prevList.filter((addr) => addr._id !== addressId)
      );
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleEditAddress = (address) => {
    setNewAddress({
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      addressType: address.addressType,
    });
    setEditAddressId(address._id);
    setShowAddressForm(true);
  };

  const fetchWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const products = await getWishlistAPI(userId);
      setWishlistItems(products);
    } catch (error) {
      console.error(
        "Error fetching wishlist:",
        error.response?.data || error.message
      );
      toast.error("Failed to load wishlist");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCartAPI(localStorage.getItem("userId"), productId, 1);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const fetchUserOrders = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await userOrdersAPI(userId);
      setOrders(res?.orders || []);
    } catch (error) {
      console.error("Error fetching orders", error);
      toast.error("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    if (activeSection === "Orders") {
      fetchUserOrders();
    }
  }, [activeSection]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (itemName) => {
    setActiveSection(itemName);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token"); 
  localStorage.removeItem("pendingPhonePeOrder"); 
  toast.success("Logged out successfully");
  navigate("/login"); 
};


  console.log(addressList);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-900">
                  Welcome : {profile.name}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-8 h-8 text-gray-600" />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {profile.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div
              className={`md:w-64 ${
                isMobileMenuOpen ? "block" : "hidden md:block"
              }`}
            >
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleMenuClick(item.name)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeSection === item.name
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {activeSection === "Dashboard" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Dashboard
                    </h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-4">
                        From your account dashboard you can view your{" "}
                        <button
                          onClick={() => handleMenuClick("Orders")}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          recent orders
                        </button>
                        , manage your{" "}
                        <button
                          onClick={() => handleMenuClick("Addresses")}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          shipping and billing addresses
                        </button>
                        , and{" "}
                        <button
                          onClick={() => handleMenuClick("Account details")}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          edit your password and account details
                        </button>
                        .
                      </p>
                    </div>
                  </div>
                )}
                {activeSection === "Orders" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Your Orders
                    </h2>

                    {/* If we have a selected order, show its details first */}
                    {selectedOrder ? (
                      <div className="p-6 bg-gray-50 rounded-md shadow-md">
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="mb-4 text-blue-600 underline"
                        >
                          Back to Orders
                        </button>

                        <h2 className="text-2xl font-semibold mb-4">
                          Order {selectedOrder._id} Details
                        </h2>

                        <div className="mb-4">
                          <p>
                            Status:{" "}
                            <span className="text-blue-600">
                              {selectedOrder.orderStatus}
                            </span>
                          </p>
                          <p>Total: ${selectedOrder.finalTotalPrice}</p>
                          <p>
                            Ordered On:{" "}
                            {new Date(selectedOrder.createdAt).toLocaleString()}
                          </p>
                          <p>Payment Method: {selectedOrder.paymentMethod}</p>
                          <p>Payment Status: {selectedOrder.paymentStatus}</p>
                        </div>

                        <div className="border-t pt-4 mb-4">
                          <h4 className="font-semibold mb-2">Products</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedOrder.items?.map((item) => (
                              <div
                                key={item._id}
                                className="p-4 bg-gray-100 rounded-md"
                              >
                                <img
                                  src={`${BASE_URL}/uploads/${item.product.images?.[0]}`}
                                  alt={item.product.name}
                                  className="w-full h-32 object-cover mb-2 rounded"
                                />
                                <p>{item.product.name}</p>
                                <p>Brand: {item.product.brand}</p>
                                <p>Qty: {item.quantity}</p>
                                <p>Price: ${item.price}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">Shipping</h4>
                          <p>
                            {selectedOrder.shippingAddress?.firstName}{" "}
                            {selectedOrder.shippingAddress?.lastName}
                          </p>
                          <p>
                            {selectedOrder.shippingAddress?.addressLine1},{" "}
                            {selectedOrder.shippingAddress?.addressLine2}
                          </p>
                          <p>
                            {selectedOrder.shippingAddress?.city},{" "}
                            {selectedOrder.shippingAddress?.state} -{" "}
                            {selectedOrder.shippingAddress?.zipCode}
                          </p>
                          <p>{selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No orders found</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            className="bg-gray-50 p-6 rounded-md shadow-md"
                          >
                            <div className="flex justify-between mb-4">
                              <div>
                                <p className="font-semibold">
                                  Order ID: {order._id}
                                </p>
                                <p>
                                  Status:{" "}
                                  <span className="text-blue-600">
                                    {order.orderStatus}
                                  </span>
                                </p>
                                <p>
                                  Ordered On:{" "}
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>
                                <p>Total: ${order.finalTotalPrice}</p>
                              </div>
                              <div>
                                <p>Payment Method: {order.paymentMethod}</p>
                                <p>Payment Status: {order.paymentStatus}</p>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <h4 className="font-semibold mb-3">Items</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {order.items?.map((item) => (
                                  <div
                                    key={item._id}
                                    className="p-4 bg-gray-100 rounded-md"
                                  >
                                    <img
                                      src={`${BASE_URL}/uploads/${item.product.images?.[0]}`}
                                      alt={item.product.name}
                                      className="w-full h-32 object-cover mb-2 rounded"
                                    />
                                    <p>{item.product.name}</p>
                                    <p>Brand: {item.product.brand}</p>
                                    <p>Qty: {item.quantity}</p>
                                    <p>Price: ${item.price}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="border-t mt-4 pt-4">
                              <h4 className="font-semibold mb-2">Shipping</h4>
                              <p>
                                {order.shippingAddress?.firstName}{" "}
                                {order.shippingAddress?.lastName}
                              </p>
                              <p>
                                {order.shippingAddress?.addressLine1},{" "}
                                {order.shippingAddress?.addressLine2}
                              </p>
                              <p>
                                {order.shippingAddress?.city},{" "}
                                {order.shippingAddress?.state} -{" "}
                                {order.shippingAddress?.zipCode}
                              </p>
                              <p>{order.shippingAddress?.phone}</p>
                            </div>

                            {/* View details button */}
                            <div className="mt-4">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="bg-blue-600 text-gray-100 px-4 py-2 rounded-md"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === "Addresses" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        My Addresses
                      </h2>
                      <button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        <span className="mr-2">Add Address</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>

                    {showAddressForm && (
                      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={newAddress.firstName}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={newAddress.lastName}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        />
                        <input
                          type="text"
                          name="phone"
                          placeholder="Phone Number"
                          value={newAddress.phone}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        />
                        <input
                          type="text"
                          name="addressLine1"
                          placeholder="Address Line"
                          value={newAddress.addressLine1}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        />
                        <input
                          type="text"
                          name="addressLine2"
                          placeholder="Landmark"
                          value={newAddress.addressLine2}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        />
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        />
                        <select
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        >
                          <option value="">Select State</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Karnataka">Karnataka</option>
                        </select>
                        <input
                          type="text"
                          name="zipCode"
                          placeholder="ZIP Code"
                          value={newAddress.zipCode}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        />
                        <input
                          type="text"
                          name="country"
                          placeholder="Country"
                          value={newAddress.country}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        />
                        <select
                          name="addressType"
                          value={newAddress.addressType}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border rounded-md"
                        >
                          <option value="">Address Type</option>
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                        </select>

                        <div className="sm:col-span-2">
                          <button
                            type="button"
                            onClick={handleSaveAddress}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                          >
                            {editAddressId ? "Update Address" : "Save Address"}
                          </button>
                        </div>
                      </form>
                    )}

                    {addressList.map((addr) => (
                      <div
                        key={addr._id}
                        className="border border-gray-300 rounded-md p-4 relative"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {addr.firstName} {addr.lastName} (
                              {addr.addressType})
                            </p>
                            <p className="text-gray-600 text-sm">
                              {addr.addressLine1}, {addr.addressLine2},{" "}
                              {addr.city}, {addr.state} - {addr.zipCode},{" "}
                              {addr.country}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Phone: {addr.phone}
                            </p>
                          </div>
                          <div className="flex space-x-5 mt-5">
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === "Account details" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Account Details
                    </h2>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Id
                          </label>
                          <input
                            type="text"
                            value={profile.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={profile.mobileNumber}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </form>
                  </div>
                )}

                {activeSection === "Wishlist" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Wishlist
                    </h2>
                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">
                          No items in your wishlist.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((product) => (
                          <div
                            key={product._id}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="relative">
                              <img
                                src={
                                  product.images?.[0]
                                    ? `https://rigsdock.com/uploads/${product.images[0]}`
                                    : "https://via.placeholder.com/300"
                                }
                                alt={product.name}
                                className="w-full h-48 object-cover"
                              />
                              <button
                                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                onClick={() =>
                                  handleRemoveFromWishlist(product._id)
                                }
                              >
                                <Heart className="w-5 h-5 text-red-500 fill-current" />
                              </button>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {product.name}
                              </h3>
                              <p className="text-blue-600 font-semibold">
                                ${product.price}
                              </p>
                              <div className="mt-4 flex justify-between items-center">
                                <button
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                                  onClick={() =>
                                    navigate(`/product-details/${product._id}`)
                                  }
                                >
                                  View Product
                                </button>
                                <button
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
                                  onClick={() => handleAddToCart(product._id)}
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === "Log out" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Log Out
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to log out?
                    </p>
                    <div className="flex space-x-4">
                      <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                        Yes, Log Out
                      </button>
                      <button
                        onClick={() => handleMenuClick("Dashboard")}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

      <Footer />
    </>
  );
}

export default UserAccount;
