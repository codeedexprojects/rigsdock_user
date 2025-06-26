import React, { useEffect, useState } from "react";
import { X, Plus, Minus, Heart, RefreshCw, Gift } from "lucide-react";
import { Star } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import {
  applycouponAPI,
  cartCountAPI,
  checkoutAPI,
  getCouponsAPI,
  removeCartAPI,
  removeCouponAPI,
  updateCartQuantityAPI,
  viewcartAPI,
} from "../Services/cartAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);

  const [cartCountNumber, setCartCountNumber] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const navigate = useNavigate();
  const [selectedShipping, setSelectedShipping] = useState("free");

  useEffect(() => {
    fetchCartItems();
    fetchCartCount();
    fetchAvailableCoupons();
  }, []);

  const fetchCartItems = async () => {
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login to view cart.");
        setLoading(false);
        return;
      }

      const res = await viewcartAPI(userId);
      const items = res.cart?.items || [];

      setCartItems(
        items.map((item) => ({
          id: item._id,
          productId: item.product._id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image: item.product.images?.[0]
            ? `https://rigsdock.com/uploads/${item.product.images[0]}`
            : "https://via.placeholder.com/150",
        }))
      );

      setTotalPrice(res.totalPrice || 0);
      setPlatformFee(res.platformFee || 0);
      setAppliedCoupon(res.cart?.coupon || null); // ✅ move this inside try block
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart.");
      setLoading(false);
    }
  };

  const removeItem = async (id, productId) => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await removeCartAPI(userId, productId);
      toast.success(res.message || "Item removed from cart");
      fetchCartItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item from cart");
    }
  };

  const updateQuantity = async (cartItemId, productId, action) => {
    try {
      const userId = localStorage.getItem("userId");
      await updateCartQuantityAPI(userId, productId, action);
      fetchCartItems();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quantity");
    }
  };

  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await cartCountAPI(userId);
      setCartCountNumber(res.cartCount || 0);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  const applyCoupon = async () => {
    const userId = localStorage.getItem("userId");

    if (!couponCode.trim()) {
      toast.warn("Please enter a coupon code");
      return;
    }

    try {
      const res = await applycouponAPI(userId, couponCode.trim());

      if (res.message?.toLowerCase().includes("invalid")) {
        toast.error(res.message || "Invalid coupon code");
        return;
      }

      // Success response handling
      toast.success(res.message || "Coupon applied successfully");

      // Set discounted total price
      if (res.newTotalPrice) {
        setTotalPrice(res.newTotalPrice);
      }

      // Optional: Update cartItems if they might change (e.g., price adjustments)
      const updatedItems = res.cart?.items.map((item) => ({
        id: item._id,
        productId: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images?.[0]
          ? `https://rigsdock.com/uploads/${item.product.images[0]}`
          : "https://via.placeholder.com/150",
      }));

      setCartItems(updatedItems || cartItems); // Use updated items if present
    } catch (error) {
      console.error("Coupon apply failed:", error);
      toast.error("Something went wrong applying the coupon.");
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login to remove coupon.");
        return;
      }

      const res = await removeCouponAPI(userId);

      toast.success(res.message || "Coupon removed.");
      setAppliedCoupon(null);
      setCouponCode("");
      fetchCartItems();
    } catch (error) {
      console.error("Remove coupon error:", error);
      toast.error("Failed to remove coupon.");
    }
  };

  const fetchAvailableCoupons = async () => {
    try {
      const res = await getCouponsAPI();
      console.log("Fetched coupons:", res);
      setAvailableCoupons(res?.coupons || []);
    } catch (error) {
      toast.error("Unable to load coupons.");
    }
  };

  const handleCheckout = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Please login first.");
      return;
    }

    try {
      const res = await checkoutAPI(userId);
      console.log("Checkout prepared successfully!", res);
      toast.success("Checkout initialized!");
      navigate("/checkout");
    } catch (err) {
      toast.error("Failed to create checkout.");
      console.error(err);
    }
  };

  const testimonials = [
    {
      id: 1,
      rating: 5,
      title: "Best Online Fashion Site",
      review:
        "Fashion lover combining classic elegance with modern trends. Curating stylish, versatile outfits that express confidence and personality every day.",
      name: "Marie Forleo",
      position: "Founder",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      rating: 5,
      title: "Chic Styles, Timeless Trends",
      review:
        "Style enthusiast mixing timeless pieces with trendy looks, curating outfits that express individuality, confidence, and creativity for every occasion.",
      name: "Tarzen Key",
      position: "Manager",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      rating: 5,
      title: "Bold Looks, Brave Souls",
      review:
        "Fashion enthusiast blending bold trends with timeless pieces, creating unique, confident outfits with individuality and refine every experience.",
      name: "Jarves Lance",
      position: "Developer",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      rating: 5,
      title: "Exceptional Quality & Service",
      review:
        "Outstanding shopping experience with premium quality products. The attention to detail and customer service exceeded all my expectations completely.",
      name: "Sarah Johnson",
      position: "Designer",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 5,
      rating: 5,
      title: "Fashion Forward Excellence",
      review:
        "Incredible variety of trendy and classic pieces. Perfect for creating versatile wardrobes that transition seamlessly from day to night effortlessly.",
      name: "Michael Chen",
      position: "Influencer",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const totalSlides = testimonials.length;
  const slidesToShow = 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = totalSlides - slidesToShow;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = totalSlides - slidesToShow;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost =
    selectedShipping === "free" ? 0 : selectedShipping === "flat" ? 5 : 10;
const total = subtotal + shippingCost + platformFee;

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm p-8">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3m0 0h2m0 0l.4 2M7 13L5.4 5M7 13l-2.293-2.293a1 1 0 00-1.414 0L9 16h6m0 0v1a2 2 0 01-2 2H9a2 2 0 01-2-2v-1m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v7.293"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Your cart is empty
                </h2>
                <p className="text-gray-600">
                  Add some products to get started!
                </p>
              </div>
              <a
                href="/shop"
                className="inline-block bg-blue-800 hover:bg-blue-800 text-black font-semibold py-3 px-6 rounded-lg transition-colors text-base mt-4"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            {/* Header */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-8">
              Cart Summary
            </h1>

            {/* Coupon Banner */}
            {availableCoupons.length > 0 &&
              availableCoupons
                .filter((c) => c.status === "active")
                .map((coupon) => (
                  <div
                    key={coupon._id}
                    className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <p className="text-green-700 text-base sm:text-lg">
                      Use <strong>{coupon.couponCode}</strong> to get
                      {coupon.discountType === "percentage"
                        ? ` ${coupon.discountValue}%`
                        : ` $${coupon.discountValue}`}{" "}
                      off
                      {coupon.minPurchaseAmount
                        ? ` on orders above $${coupon.minPurchaseAmount}`
                        : ""}
                      {coupon.firstPurchaseOnly ? " (First purchase only)" : ""}
                    </p>
                    <button
                      onClick={() => setCouponCode(coupon.couponCode)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-base font-medium transition-colors whitespace-nowrap"
                    >
                      {coupon.couponCode}
                    </button>
                  </div>
                ))}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product Table Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-4 bg-white p-4 rounded-lg shadow-sm font-semibold text-gray-700 text-base">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Subtotal</div>
                </div>

                {/* Cart Items */}
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      <div className="flex items-start gap-4 mb-4">
                        <button
                          onClick={() => removeItem(item.id, item.productId)}
                          className="text-red-500 hover:text-red-700 mt-1"
                        >
                          <X size={20} />
                        </button>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-2 text-base">
                            {item.name}
                          </h3>
                          <p className="text-blue-600 font-semibold text-xl">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.productId,
                                "decrease"
                              )
                            }
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium min-w-[40px] text-center text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.productId,
                                "increase"
                              )
                            }
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="text-blue-600 font-semibold text-xl">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex items-center gap-4">
                        <button
                          onClick={() => removeItem(item.id, item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />{" "}
                        <h3 className="font-medium text-gray-800 text-base">
                          {item.name}
                        </h3>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          ₹{item.price}
                        </span>
                      </div>

                      <div className="col-span-3 flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.productId, "decrease")
                          }
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-medium min-w-[40px] text-center text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.productId, "increase")
                          }
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon Section */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />

                    {!appliedCoupon ? (
                      <button
                        onClick={applyCoupon}
                        className="bg-blue-800 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap text-base"
                      >
                        Apply Coupon
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveCoupon}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap text-base"
                      >
                        Remove Coupon
                      </button>
                    )}

                    <Link
                      to="/shop"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap text-base"
                    >
                      Shop More
                    </Link>
                  </div>

                  {appliedCoupon && (
                    <p className="text-green-700 text-sm mt-2">
                      ✅ Coupon applied successfully.
                    </p>
                  )}
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-purple-50 p-6 rounded-lg">
                  <div className="text-center bg-gray-300 p-5 gap-5">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Heart className="text-purple-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-base">
                      Loved by Thousands
                    </h3>
                    <p className="text-gray-600 text-base">
                      Join Thousands of Happy and Satisfied Customers!
                    </p>
                  </div>

                  <div className="text-center bg-gray-300 p-5 gap-5 ">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <RefreshCw className="text-purple-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-base">
                      Easy Returns
                    </h3>
                    <p className="text-gray-600 text-base">
                      Enjoy Hassle-Free Returns and Exchanges - Shop Now!
                    </p>
                  </div>

                  <div className="text-center bg-gray-300 p-5 gap-5">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Gift className="text-purple-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-base">
                      Order Now & Get Gift!
                    </h3>
                    <p className="text-gray-600 text-base">
                      Order & Receive a Special Gift. Limited Time Only!
                    </p>
                  </div>
                </div>
              </div>

              {/* Cart Totals Section */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Cart totals
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Total items in cart: {cartCountNumber}
                  </p>

                  <div className="space-y-4 mb-6 mt-5">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-blue-600 font-semibold text-lg">
                        ₹{subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
  <span className="text-gray-600">Platform Fee</span>
  <span className="text-blue-600 font-medium">₹{platformFee}</span>
</div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-800 mb-3 text-base">
                        Shipping
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-base">
                          <span>Free shipping</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">₹{total}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-800 hover:bg-blue-800 text-white font-semibold py-4 rounded-lg transition-colors text-base"
                  >
                    Proceed To Checkout
                  </button>
                </div>
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

export default Cart;
