import React, { useEffect, useState } from "react";
import { X, ShoppingCart, Heart } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { getWishlistAPI, removewishlistAPI } from "../Services/wishlistAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBox from "../Components/ChatBox";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const products = await getWishlistAPI(userId);
        setWishlistItems(products);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleshopping = () => {
    navigate("/shop");
  };

  const handleRemove = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login to modify your wishlist.");
        return;
      }

      await removewishlistAPI(userId, productId);
      toast.success("Product removed from wishlist");

      // Update UI by removing the item from the state
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove item from wishlist", error);
      toast.error("Error removing item");
    }
  };

  const addToCart = (item) => {
    toast.success(`${item.name} added to cart!`);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <ChatBox />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading wishlist...</p>
              </div>
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
      <ChatBox />
      <div className="min-h-screen bg-gray-50 mt-30">
        {/* Header Section */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Page Title with responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  My Wishlist
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Items you've saved for later
                </p>
              </div>
              
              {/* Item count - responsive positioning */}
              <div className="flex items-center justify-center sm:justify-end">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {!userId ? (
            // Not Logged In State
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  Please login to view your wishlist
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                  Sign in to see all your saved items and manage your wishlist
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Login to Continue
                </button>
              </div>
            </div>
          ) : wishlistItems.length === 0 ? (
            // Empty Wishlist State
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  Your wishlist is empty
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                  Add items you love to your wishlist and save them for later
                </p>
                <button
                  onClick={handleshopping}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          ) : (
            // Wishlist Items
            <div className="space-y-4 sm:space-y-6">
              {/* Grid layout for larger screens, single column for mobile */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Mobile Layout */}
                      <div className="block sm:hidden">
                        {/* Mobile Header with Remove Button */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 pr-2">
                              {item.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                            aria-label="Remove from wishlist"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Mobile Content */}
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={`https://rigsdock.com/uploads/${item.images?.[0]}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                                }}
                              />
                            </div>
                          </div>

                          {/* Mobile Details */}
                          <div className="flex-1 min-w-0">
                            {/* Price */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{item.price}
                              </span>
                              {item.originalPrice && item.originalPrice !== item.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{item.originalPrice}
                                </span>
                              )}
                            </div>

                            {/* Date Added */}
                            {item.dateAdded && (
                              <p className="text-xs text-gray-500 mb-3">
                                Added on {new Date(item.dateAdded).toLocaleDateString()}
                              </p>
                            )}

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => addToCart(item)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span className="text-sm">Add To Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop/Tablet Layout */}
                      <div className="hidden sm:flex sm:items-center gap-4 lg:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={`https://rigsdock.com/uploads/${item.images?.[0]}`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/112x112?text=No+Image";
                              }}
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                            {item.name}
                          </h3>

                          {/* Price */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl lg:text-2xl font-bold text-gray-900">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && item.originalPrice !== item.price && (
                              <span className="text-base text-gray-500 line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>

                          {/* Date Added */}
                          {item.dateAdded && (
                            <p className="text-sm text-gray-500">
                              Added on {new Date(item.dateAdded).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 lg:gap-4">
                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="p-2 lg:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Remove from wishlist"
                          >
                            <X className="h-5 w-5 lg:h-6 lg:w-6" />
                          </button>

                          {/* Add to Cart Button */}
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                          >
                            <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5" />
                            <span className="text-sm lg:text-base">Add To Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Button */}
              <div className="text-center pt-6 sm:pt-8">
                <button
                  onClick={handleshopping}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Toast Container with responsive positioning */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          className="mt-16 sm:mt-20"
          toastClassName="text-sm sm:text-base"
        />
      </div>
      <Footer />
    </>
  );
}

export default Wishlist;