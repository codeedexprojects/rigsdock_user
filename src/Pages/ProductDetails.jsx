import React, { useEffect, useState } from "react";
import { Link, Star } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { getSimilarProductsAPI, viewProductsByIdAPI } from "../Services/allAPIs";
import { addToWishlistAPI } from "../Services/wishlistAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCartAPI } from "../Services/cartAPI";
import { buyNowAPI } from "../Services/buynowAPI";



const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState("description");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [productDetails, setProductDetails] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const navigate = useNavigate()
  const [showShareModal, setShowShareModal] = useState(false);

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
    toast.error("Something went wrong while adding to wishlist");
  }
};

const handleAddtoCart= async ()=>{
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

}

  const product = productDetails;

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const result = await viewProductsByIdAPI(productId.id);
      // console.log(result);
      setProductDetails(result.product);
      
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
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
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
    toast.error(error?.response?.data?.message || "Failed to process Buy Now.");
  }
};


  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
        {/* Left Section - Images */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex sm:flex-col gap-2 sm:gap-3 order-2 sm:order-1">
            {product.images?.map((img, index) => (
              <div
                key={index}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border rounded-lg sm:rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={`${SERVER_URL}/uploads/${img}`}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex-1 max-w-md aspect-square bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden order-1 sm:order-2">
            <img
             src={`${SERVER_URL}/uploads/${product?.images?.[0]}`}
              alt="Main Product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Section - Info */}
        <div>
          <p className="text-gray-500 text-xs sm:text-sm mb-1">
            Brand: {product.brand}
          </p>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-4">
            {product.name}
          </h2>

          <div className="text-lg sm:text-xl font-bold text-blue-700 mb-2">
            ${product.price} {product.maxPrice && `– $${product.maxPrice}`}
          </div>

          <div className="text-lg sm:text-xl font-bold text-blue-700 mb-2">
            {product.description}
          </div>

          <div className="flex items-center gap-1 mb-3 sm:mb-4">
            {renderStars(product.rating)}
            <span className="ml-1 sm:ml-2 text-gray-600 text-xs sm:text-sm">
              ({product.totalReviews} review)
            </span>
          </div>

          <ul className="list-disc list-inside text-gray-700 mb-4 sm:mb-6 space-y-1 text-sm sm:text-base">
            {product?.features?.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>

          <button onClick={handleAddtoCart} className="w-full bg-blue-800 hover:bg-blue-800 text-white font-semibold py-2 sm:py-3 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base">
            Add To Cart
          </button>
         <button onClick={handleBuyNow} className="w-full bg-blue-800 hover:bg-blue-800 text-white font-semibold py-2 sm:py-3 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base">
  Buy Now
</button>

          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
            <button onClick={handleAddToWishlist}  className="flex-1 border border-gray-300 text-gray-700 py-1 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm">
              Add to Wishlist
            </button>
<button
  onClick={() => setShowShareModal(true)}
  className="flex-1 border border-gray-300 text-gray-700 py-1 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
>
  Share
</button>

          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 items-center justify-between">
            <span className="flex items-center gap-1">🛡️ 100% Original</span>
            <span className="flex items-center gap-1">🏷️ Lowest Price</span>
            <span className="flex items-center gap-1">🚚 Free Shipping</span>
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
          <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Customer Reviews
            </h3>
            {product.reviews?.map((review) => (
              <div key={review._id} className="border p-3 sm:p-4 rounded-md">
                <p className="font-medium">{review?.user?.name}</p>
                <div className="flex items-center gap-1 mb-1">
                  {renderStars(review?.rating)}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{review?.review}</p>
              </div>
            ))}
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
              <li>Free shipping on orders over $99</li>
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
            ((product.originalPrice - product.price) / product.originalPrice) * 100
          )}%
        </span>
      )}
      <div className="aspect-square mb-2 sm:mb-3 overflow-hidden rounded-lg">
        <img
          src={`https://rigsdock.com/uploads/${product.images[0]}`}
          alt={product.name}
          className="w-full h-full object-cover"
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
            ${product.originalPrice}
          </span>
        )}
        <span className="text-blue-600 font-bold">
          ${product.finalPrice || product.price}
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
      <h3 className="text-lg font-semibold mb-4 text-center">Share Product</h3>
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
        
<ToastContainer position="top-right" autoClose={3000} />
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
