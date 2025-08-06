import React, { useEffect, useState } from "react";
import { Link, Star } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSimilarProductsAPI,
  viewProductsByIdAPI,
} from "../Services/allAPIs";
import { addToWishlistAPI } from "../Services/wishlistAPI";
import { addToCartAPI } from "../Services/cartAPI";
import { buyNowAPI } from "../Services/buynowAPI";
import ChatBox from "../Components/ChatBox";
import { Toaster, toast } from "react-hot-toast";


const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [productDetails, setProductDetails] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const handleViewProducts = (productId) => {
    window.location.href = `/product-details/${productId}`;
  };

  const productId = useParams();
  const SERVER_URL = "https://rigsdock.com";

  const handleAddToWishlist = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login to use wishlist.");
        return;
      }

      if (!product || !product._id) {
        toast.error("Product not loaded yet.");
        return;
      }

      const res = await addToWishlistAPI(userId, product._id);
      if (res?.message?.includes("already")) {
        toast.info("Product is already in your wishlist.");
      } else {
        toast.success("Product added to wishlist!");
      }
    } catch (error) {
      console.error("Add to wishlist failed", error);
      toast.error(error.response.data.message);
    }
  };

  const handleAddtoCart = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("Please login to add items to cart.");
        return;
      }

      if (!product || !product._id) {
        toast.error("Product not loaded yet.");
        return;
      }

      const res = await addToCartAPI(userId, product._id, 1); // Quantity can be dynamic

      if (res?.message?.includes("added")) {
        toast.success("Product added to cart!");
      } else if (res?.message?.includes("already")) {
        toast.info("Product is already in your cart.");
      } else {
        toast.info(res.message || "Action completed.");
      }
    } catch (error) {
      console.error("Add to cart failed", error);
      toast.error("Something went wrong while adding to cart.");
    }
  };

  const product = productDetails;

  const averageRating =
    product?.reviews?.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  useEffect(() => {
    fetchProductDetails();
  }, []);

 const fetchProductDetails = async () => {
  try {
    const result = await viewProductsByIdAPI(productId.id);
    setProductDetails(result.product);
    setSelectedImage(result.product.images?.[0]); // Set default main image
    const similar = await getSimilarProductsAPI(productId.id);
    setSimilarProducts(similar);
  } catch (err) {
    console.log(err);
  }
};


  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < 3 ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const productURL = window.location.href;
  const encodedURL = encodeURIComponent(productURL);
  const text = encodeURIComponent(`Check out this product: ${product.name}`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productURL);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = (platform) => {
    let shareURL = "";

    switch (platform) {
      case "whatsapp":
        shareURL = `https://wa.me/?text=${text}%0A${encodedURL}`;
        break;
      case "facebook":
        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
        break;
      case "twitter":
        shareURL = `https://twitter.com/intent/tweet?text=${text}&url=${encodedURL}`;
        break;
      default:
        return;
    }

    window.open(shareURL, "_blank");
    setShowShareModal(false);
  };

  const handleBuyNow = async () => {
    const userId = localStorage.getItem("userId");
    const productId = product._id;
    const quantity = 1;

    console.log("Buy Now Payload:", { userId, productId, quantity });

    if (!userId || !productId) {
      toast.error("Missing user or product ID.");
      return;
    }

    if (!product.stock || product.stock < quantity) {
      toast.error("Sorry, the product is out of stock.");
      return;
    }

    try {
      const res = await buyNowAPI(userId, productId, quantity);
      console.log("Buy Now API Response:", res);
      toast.success("Buy now request successful!");
      navigate("/cart");
    } catch (error) {
      console.error("Buy Now Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to process Buy Now."
      );
    }
  };
  return (
    <>
      <Header />
      <ChatBox />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 mt-40">
        <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
              <img
               src={`${SERVER_URL}/uploads/${selectedImage}`}
                alt="Main Product"
                className="w-full object-contain p-4 sm:p-6"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images?.map((img, index) => (
                <div
                  key={index}
                   onClick={() => setSelectedImage(img)} 
                  className="flex-shrink-0 w-15 h-15 sm:w-20 sm:h-16  rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <img
                    src={`${SERVER_URL}/uploads/${img}`}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover p-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="w-full lg:w-1/2">
            {/* Brand and Title */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-black text-sm uppercase tracking-wider mb-2  font-medium">
                Brand : {product?.brand?.name}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">{renderStars(averageRating)}</div>
             
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              {product.finalPrice &&
              product.price &&
              product.finalPrice < product.price ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.finalPrice}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.price}
                  </span>
                  <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                    {Math.round(
                      ((product.price - product.finalPrice) / product.price) *
                        100
                    )}
                    % OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.finalPrice || product.price}
                </span>
              )}
            </div>

            {/* Key Features */}
            {product.features?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Attributes */}
            {product.attributes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className=" rounded-lg">
                  <div className="space-y-2">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 last:border-b-0 pb-2 last:pb-0"
                      >
                        <span className=" font-medium w-full sm:w-32 text-sm mb-1 sm:mb-0 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-gray-800 text-sm sm:text-base ">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <p
                className={`text-sm font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleAddtoCart}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-lg transition-colors"
                disabled={!product.stock}
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors"
                disabled={!product.stock}
              >
                Buy Now
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToWishlist}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Wishlist
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>

            {/* Trust Badges */}
           <div className="mt-6 pt-6 border-t border-gray-200">
  <div className="overflow-x-auto pb-2">
    <div className="flex gap-4 min-w-max lg:grid lg:grid-cols-5 lg:gap-3 lg:min-w-0 text-center">
      <div className="flex flex-col items-center p-3 rounded-lg min-w-[100px] lg:min-w-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 mb-1 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
          Pay on <br /> Delivery
        </span>
      </div>

      <div className="flex flex-col items-center p-3 rounded-lg min-w-[100px] lg:min-w-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 mb-1 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
          Secure <br /> Transaction
        </span>
      </div>

      <div className="flex flex-col items-center p-3 rounded-lg min-w-[100px] lg:min-w-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 mb-1 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
          100% Authentic
        </span>
      </div>

      <div className="flex flex-col items-center p-3 rounded-lg min-w-[100px] lg:min-w-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 mb-1 text-yellow-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
          Best Price
        </span>
      </div>

      <div className="flex flex-col items-center p-3 rounded-lg min-w-[100px] lg:min-w-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 mb-1 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
          Free Shipping
        </span>
      </div>
    </div>
    </div>
    </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex border-b mb-4 sm:mb-6 overflow-x-auto">
          {["description", "reviews", "Shipping and Refund"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 sm:py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-blue-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Product Description
            </h3>
            <p>{product?.description}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Customer Reviews
                </h3>
                <p className="text-sm text-gray-600">
                  {product.reviews?.length || 0} review
                  {product.reviews?.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Average Rating Display */}
              {product.reviews?.length > 0 && (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {(
                        product.reviews.reduce(
                          (sum, review) => sum + review.rating,
                          0
                        ) / product.reviews.length
                      ).toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {renderStars(
                        Math.round(
                          product.reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0
                          ) / product.reviews.length
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews?.length > 0 ? (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Review Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {review?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {review?.user?.name || "Anonymous User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Verified Purchase
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review?.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {review?.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="pl-0 sm:pl-13">
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {review?.review}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No reviews yet
                  </h4>
                  {/* <p className="text-gray-600 mb-4">Be the first to share your thoughts about this product.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Write a Review
          </button> */}
                </div>
              )}
            </div>

            {/* Load More Button (if needed) */}
            {product.reviews?.length > 3 && (
              <div className="text-center pt-4">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  View All Reviews ({product.reviews.length})
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "Shipping and Refund" && (
          <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Shipping & Return Policy
            </h3>
            <p className="mb-2">
              We offer various shipping options to meet your needs, including
              standard and express shipping. Orders are typically processed
              within 24 hours.
            </p>
            <ul className="list-disc list-inside mb-3 sm:mb-4 text-sm">
              <li>Free shipping on orders over ₹99</li>
              <li>Delivery within 5-7 business days</li>
              <li>Easy 30-day return and exchange policy</li>
            </ul>
            <p>
              If you're not satisfied with your purchase, returns are accepted
              within 30 days of delivery. Please refer to our return policy for
              more details.
            </p>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Related Products</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
          {similarProducts.map((product) => (
            <div
              key={product._id}
              className="rounded-lg sm:rounded-xl p-2 sm:p-4 bg-white shadow-sm sm:shadow-md hover:shadow-lg transition-shadow relative"
            >
              {product.originalPrice && (
                <span className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-yellow-400 text-black text-2xs sm:text-xs font-bold px-1 sm:px-2 py-0.5 rounded">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  %
                </span>
              )}
              <div className="aspect-square mb-2 sm:mb-3 overflow-hidden rounded-lg bg-white flex items-center justify-center">
                <img
                  src={`https://rigsdock.com/uploads/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <h3 className="text-xs sm:text-sm font-semibold mb-1 min-h-[36px] sm:min-h-[40px] line-clamp-2">
                {product.name}
              </h3>
              <div className="flex text-yellow-400 text-xs sm:text-sm mb-1">
                {renderStars(product.rating || 0)}
              </div>
              <div className="text-xs sm:text-sm text-center mb-2">
                {product.originalPrice && (
                  <span className="text-gray-400 line-through mr-1">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-blue-600 font-bold">
                  ₹{product.finalPrice || product.price}
                </span>
              </div>
              {/* Add View Product Button */}
              <button
                onClick={() => handleViewProducts(product._id)}
                className="block w-full text-center bg-blue-800 text-white text-xs sm:text-sm font-medium py-1 sm:py-2 rounded"
              >
                view product
              </button>
            </div>
          ))}
          {showShareModal && (
            <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-4 w-72 shadow-lg relative">
                <button
                  className="absolute top-2 right-2 text-gray-500"
                  onClick={() => setShowShareModal(false)}
                >
                  ✖
                </button>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Share Product
                </h3>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="bg-gray-100 py-2 rounded text-sm hover:bg-gray-200"
                  >
                    📎 Copy Link
                  </button>
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="bg-green-100 text-green-800 py-2 rounded text-sm hover:bg-green-200"
                  >
                    📱 Share via WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="bg-blue-100 text-blue-800 py-2 rounded text-sm hover:bg-blue-200"
                  >
                    📘 Share on Facebook
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="bg-sky-100 text-sky-800 py-2 rounded text-sm hover:bg-sky-200"
                  >
                    🐦 Share on Twitter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      <Toaster position="top-center" reverseOrder={false} />
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
