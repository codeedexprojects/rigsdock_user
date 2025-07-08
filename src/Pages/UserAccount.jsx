import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  User,
  Package,
  MapPin,
  Settings,
  BarChart3,
  Heart,
  LogOut,
  Trash,
  Pencil,
  Star,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {
  addAddressAPI,
  deleteAddressAPI,
  downloadUserInvoice,
  editAddressAPI,
  getEditProfileAPI,
  getProfileAPI,
  orderDetailsAPI,
  userAddressViewAPI,
  userOrdersAPI,
} from "../Services/profileAPI";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCartAPI } from "../Services/cartAPI";
import { getWishlistAPI, removewishlistAPI } from "../Services/wishlistAPI";
import { useLocation } from "react-router-dom";
import { getUserReviews } from "../Services/getUserReviewAPI";

function UserAccount() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [addressList, setAddressList] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [editAddressId, setEditAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();
  const BASE_URL = "https://rigsdock.com";

  const [editProfile, setEditProfile] = useState({
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

  const handleDownloadInvoice = async (orderId) => {
    const res = await downloadUserInvoice(orderId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return toast.error("User not logged in");

    try {
      const res = await getEditProfileAPI(userId, editProfile);
      toast.success(res.message || "Profile updated successfully");

      setProfile(res.user);
      setEditProfile({
        name: res.user.name,
        email: res.user.email,
        mobileNumber: res.user.mobileNumber,
      });

      setIsEditingProfile(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

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
    { name: "My Reviews", icon: Star },
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
        setProfile(res);
        setEditProfile({
          name: res.name || "",
          email: res.email || "",
          mobileNumber: res.mobileNumber || "",
        });
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
        const res = await editAddressAPI(editAddressId, reqBody);
        toast.success(res.message || "Address updated successfully");
        setAddressList((prevList) =>
          prevList.map((addr) =>
            addr._id === editAddressId ? res.address : addr
          )
        );
      } else {
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

  const handleRemoveFromWishlist = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await removewishlistAPI(userId, productId);
      toast.success("Product Removed From Wishlist");
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error", error);
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

  useEffect(() => {
    if (activeSection === "My Reviews") {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      getUserReviews(userId)
        .then((data) => {
          setReviews(data || []);
        })
        .catch(() => toast.error("Failed to load reviews"));
    }
  }, [activeSection]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 mt-5">
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
                  MY DASHBOARD
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-8 h-8 text-gray-600" />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {profile?.name}
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
                  <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                        Your Orders
                      </h2>

                      {/* Order Details View */}
                      {selectedOrder ? (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                          {/* Header with back button */}
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4">
                            <button
                              onClick={() => setSelectedOrder(null)}
                              className="flex items-center text-white hover:text-blue-100 transition-colors mb-2"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              Back to Orders
                            </button>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                              Order #{selectedOrder._id.slice(-8)}
                            </h2>
                          </div>

                          <div className="p-4 sm:p-6 lg:p-8">
                            {/* Order Status Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 mb-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="text-center sm:text-left">
                                  <p className="text-sm font-medium text-gray-600">
                                    Status
                                  </p>
                                  <p
                                    className={`text-lg font-semibold ${
                                      selectedOrder.orderStatus === "Delivered"
                                        ? "text-green-600"
                                        : selectedOrder.orderStatus ===
                                          "Processing"
                                        ? "text-blue-600"
                                        : selectedOrder.orderStatus ===
                                          "Shipped"
                                        ? "text-purple-600"
                                        : "text-orange-600"
                                    }`}
                                  >
                                    {selectedOrder.orderStatus}
                                  </p>
                                </div>
                                <div className="text-center sm:text-left">
                                  <p className="text-sm font-medium text-gray-600">
                                    Total
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900">
                                    ${selectedOrder.finalTotalPrice}
                                  </p>
                                </div>
                                <div className="text-center sm:text-left">
                                  <p className="text-sm font-medium text-gray-600">
                                    Payment
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900">
                                    {selectedOrder.paymentMethod}
                                  </p>
                                </div>
                                <div className="text-center sm:text-left">
                                  <p className="text-sm font-medium text-gray-600">
                                    Ordered On
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900">
                                    {new Date(
                                      selectedOrder.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Products Section */}
                            <div className="mb-8">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Order Items
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {selectedOrder.items?.map((item) => (
                                  <div
                                    key={item._id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                  >
                                    <div className="aspect-w-16 aspect-h-12 mb-3">
                                      <img
                                        src={`${BASE_URL}/uploads/${item.product.images?.[0]}`}
                                        alt={item.product.name}
                                        className="w-full h-32 object-cover rounded-lg"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <h5 className="font-medium text-gray-900 line-clamp-2">
                                        {item.product.name}
                                      </h5>
                                      <p className="text-sm text-gray-600">
                                        Brand: {item.product.brand}
                                      </p>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                          Qty: {item.quantity}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                          ${item.price}
                                        </span>
                                      </div>
                                    </div>

                                    {selectedOrder.orderStatus ===
                                      "Delivered" && (
                                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                        <button
                                          onClick={() =>
                                            handleDownloadInvoice(
                                              selectedOrder.mainOrderId ||
                                                selectedOrder._id
                                            )
                                          }
                                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                        >
                                          Download Invoice
                                        </button>

                                        <button
                                          onClick={() =>
                                            navigate("/add-review", {
                                              state: {
                                                productId: item.product._id,
                                                orderId: selectedOrder._id,
                                                name: item.product.name,
                                                image: item.product.images?.[0],
                                              },
                                            })
                                          }
                                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                        >
                                          Add Review
                                        </button>
                                        <button
                                          onClick={() =>
                                            navigate("/return-order", {
                                              state: {
                                                productId: item.product._id,
                                                orderId: selectedOrder._id,
                                                name: item.product.name,
                                                image: item.product.images?.[0],
                                              },
                                            })
                                          }
                                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                        >
                                          Return
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Shipping Information
                              </h4>
                              <div className="space-y-2">
                                <p className="font-medium text-gray-900">
                                  {selectedOrder.shippingAddress?.firstName}{" "}
                                  {selectedOrder.shippingAddress?.lastName}
                                </p>
                                <p className="text-gray-700">
                                  {selectedOrder.shippingAddress?.addressLine1}
                                  {selectedOrder.shippingAddress
                                    ?.addressLine2 &&
                                    `, ${selectedOrder.shippingAddress?.addressLine2}`}
                                </p>
                                <p className="text-gray-700">
                                  {selectedOrder.shippingAddress?.city},{" "}
                                  {selectedOrder.shippingAddress?.state} -{" "}
                                  {selectedOrder.shippingAddress?.zipCode}
                                </p>
                                <p className="text-gray-700">
                                  Phone: {selectedOrder.shippingAddress?.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : orders.length === 0 ? (
                        /* Empty State */
                        <div className="bg-white rounded-xl shadow-lg">
                          <div className="text-center py-16 px-4">
                            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                              <Package className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No orders yet
                            </h3>
                            <p className="text-gray-500 mb-6">
                              When you place orders, they'll appear here.
                            </p>
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                              Start Shopping
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Orders List */
                        <div className="space-y-4 sm:space-y-6 ">
                          {orders.map((order) => (
                            <div
                              key={order._id}
                              className="bg-white rounded-xl shadow-lg  overflow-hidden hover:shadow-xl transition-shadow"
                            >
                              {/* Order Header */}
                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4  border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between gap-3 ">
                                  <div className="space-y-1 ">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                      <p className="font-semibold text-gray-900">
                                        Order #{order._id}
                                      </p>
                                      <span
                                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                          order.orderStatus === "Delivered"
                                            ? "bg-green-100 text-green-800"
                                            : order.orderStatus === "Processing"
                                            ? "bg-blue-100 text-blue-800"
                                            : order.orderStatus === "Shipped"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-orange-100 text-orange-800"
                                        }`}
                                      >
                                        {order.orderStatus}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {new Date(
                                        order.createdAt
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </p>
                                  </div>
                                  <div className="text-left sm:text-right">
                                    <p className="text-2xl font-bold text-gray-900">
                                      ₹{order.finalTotalPrice}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.paymentMethod}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 sm:p-6">
                                {/* Order Items Preview */}
                                <div className="mb-4">
                                  <h4 className="font-medium text-gray-900 mb-3">
                                    Items ({order.items?.length})
                                  </h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                    {order.items?.slice(0, 6).map((item) => (
                                      <div key={item._id} className="group">
                                        <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                                          <img
                                            src={`${BASE_URL}/uploads/${item.product.images?.[0]}`}
                                            alt={item.product.name}
                                            className="w-full h-20 sm:h-24 object-cover group-hover:scale-105 transition-transform"
                                          />
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 truncate">
                                          {item.product.name}
                                        </p>
                                        <p className="text-xs font-medium text-gray-900">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>
                                    ))}
                                    {order.items?.length > 6 && (
                                      <div className="flex items-center justify-center bg-gray-100 rounded-lg h-20 sm:h-24">
                                        <span className="text-sm font-medium text-gray-600">
                                          +{order.items.length - 6} more
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Shipping Address Summary */}
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                                  <h5 className="font-medium text-gray-900 mb-2">
                                    Shipping To:
                                  </h5>
                                  <p className="text-sm text-gray-700">
                                    {order.shippingAddress?.firstName}{" "}
                                    {order.shippingAddress?.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {order.shippingAddress?.city},{" "}
                                    {order.shippingAddress?.state}
                                  </p>
                                </div>

                                {/* Action Button */}
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeSection === "My Reviews" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      My Reviews
                    </h2>

                    {reviews.length === 0 ? (
                      <p className="text-gray-500">
                        You have not submitted any reviews yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((rev) => (
                          <div
                            key={rev._id}
                            className="bg-white p-4 rounded-md shadow border"
                          >
                            <h3 className="font-semibold text-lg mb-1">
                              {rev.product?.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-1">
                              ₹{rev.product?.price}
                            </p>
                            <p className="text-yellow-600 font-medium mb-1">
                              Rating: {rev.rating} / 5 ⭐
                            </p>
                            <p className="text-gray-700 text-sm mb-2">
                              "{rev.review}"
                            </p>
                            <p className="text-xs text-gray-400 mb-2">
                              Posted on{" "}
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-blue-600 mb-2">
                              Report Status: {rev.report?.status}
                            </p>
                            {rev.images?.length > 0 && (
                              <img
                                src={`https://rigsdock.com/uploads/${rev.images[0]}`}
                                alt="Review"
                                className="w-full h-32 object-cover rounded"
                              />
                            )}
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
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={editProfile?.name}
                            onChange={handleEditInputChange}
                            disabled={!isEditingProfile}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={editProfile.email}
                            onChange={handleEditInputChange}
                            disabled={!isEditingProfile}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="mobileNumber"
                          value={editProfile.mobileNumber}
                          onChange={handleEditInputChange}
                          disabled={!isEditingProfile}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="flex space-x-4">
                        {!isEditingProfile ? (
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md"
                          >
                            Edit Profile
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveProfile}
                              className="bg-green-600 text-white px-6 py-2 rounded-md"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditProfile({
                                  name: profile?.name || "",
                                  email: profile?.email || "",
                                  mobileNumber: profile?.mobileNumber || "",
                                });
                                setIsEditingProfile(false);
                              }}
                              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
                            >
                              Cancel
                            </button>
                          </>
                        )}
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
                      <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
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
