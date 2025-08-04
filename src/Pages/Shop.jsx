import React, { useEffect, useState } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  Heart,
  MoveRight,
  MoveLeft,
} from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { getAllProducts, getBrandAPI } from "../Services/allAPIs";
import { addToCartAPI } from "../Services/cartAPI";
import { addToWishlistAPI, getWishlistAPI } from "../Services/wishlistAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  filterByBrandAPI,
  filterByPriceAPI,
  filterByyRatingAPI,
} from "../Services/filterAPI";
import axios from "axios";
import { BASE_URL } from "../Services/baseUrl";
import ChatBox from "../Components/ChatBox";
import { ListFilter } from "lucide-react";


function Shop() {
  const navigate = useNavigate();
  const [AllProducts, setAllProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [brandsList, setBrandsList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Increased to show more products (3 rows × 5 products)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setAllProducts(allProducts);
      } catch (err) {
        console.error("Error fetching Products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

useEffect(() => {
  const fetchWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const products = await getWishlistAPI(userId);
      const wishlistProductIds = products.map(item => item._id); // assuming _id is productId
      setWishlistItems(wishlistProductIds);
    } catch (err) {
      console.error("Error fetching wishlist", err);
    }
  };

  fetchWishlist();
}, []);


  const handlePriceFilter = async () => {
    if (!minPrice || !maxPrice) {
      toast.warn("Please enter both min and max Price.");
      return;
    }
    try {
      const result = await filterByPriceAPI(minPrice, maxPrice);
      console.log("eroorr", result);

      setAllProducts(result.products || []);
      // toast.success("Product filtered by Price");
      setShowMobileFilters(false);
    } catch (error) {
      toast.success("price filter error", error);
    }
  };

  const handleRatingFilter = async (rating) => {
    const minRating = rating;
    const maxRate = 5;

    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);

    if (!newRating) {
      try {
        const allProducts = await getAllProducts();
        setAllProducts(allProducts);
        // toast.info("Rating filter cleared");
      } catch (error) {
        toast.error("Failed to reset products");
      }
      setShowMobileFilters(false);

      return;
    }

    try {
      const response = await filterByyRatingAPI(minRating, maxRate);
      setAllProducts(response.products || []);
      // toast.success(`Filtered products with rating ${rating} & up`);
    } catch (error) {
      toast.error("Failed to filter by rating");

      console.error(error);
    }
    setShowMobileFilters(false);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrandAPI();
        setBrandsList(res || []);
      } catch (err) {
        console.error("Error fetching brands", err);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandFilter = async (brandId) => {
    const isSameBrand = selectedBrand === brandId;
    const newBrand = isSameBrand ? null : brandId;
    setSelectedBrand(newBrand);

    if (!newBrand) {
      try {
        const allProducts = await getAllProducts();
        setAllProducts(allProducts);
      } catch (error) {
        toast.error("Failed to reset products");
      }
      return;
    }

    try {
      const res = await filterByBrandAPI(newBrand);
      setAllProducts(res.products || []);
    } catch (error) {
      toast.error("Failed to filter by brand");
    }
  };

  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    highlight: true,
    brand: true,
    price: true,
    ratings: true,
  });

  const reversedProducts = [...AllProducts].reverse();
  const totalPages = Math.ceil(reversedProducts.length / itemsPerPage);
  const paginatedProducts = reversedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < 3 ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const ProductCard = ({ product }) => {
    const handleProductClick = () => {
      navigate(`/product-details/${product.id}`);
    };

const handleAddToWishlist = async (productId, e) => {
  e.stopPropagation();
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login to use wishlist.");
      return;
    }

    const response = await addToWishlistAPI(userId, productId);
    toast.success(response.message);

    setWishlistItems((prev) => [...new Set([...prev, productId])]);
  } catch (error) {
    toast.error(error.response?.data?.message || "Error adding to wishlist");
  }
};



    const discountPercentage = product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

    return (
      <div
        className="bg-white rounded-lg p-2 h-full flex flex-col text-sm cursor-pointer relative" // Reduced padding from p-3 to p-2
        onClick={handleProductClick}
      >
        {/* Discount badge */}

        {discountPercentage > 0 && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-600 text-white text-[9px] xs:text-[10px] sm:text-xs font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded z-10 shadow-sm leading-tight">
            <span className="block sm:inline">{discountPercentage}%</span>
            <span className="hidden xs:inline sm:inline"> OFF</span>
          </div>
        )}

        <div className="h-32 sm:h-40 md:h-48 lg:h-44 xl:h-48 mb-3 bg-white rounded-lg overflow-hidden">
          {" "}
          {/* Reduced mb-4 to mb-3 */}
          <div className="relative group w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover p-2 rounded-md transition-transform duration-300" // Reduced p-3 to p-2
            />
            <button
              className="absolute top-1 right-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow-sm"
              onClick={(e) => handleAddToWishlist(product.id, e)}
            >
<Heart
  className={`w-3 h-3 sm:w-4 sm:h-4 ${
    wishlistItems.includes(product.id) ? "fill-red-500 text-red-500" : "text-red-500"
  }`}
/>
            </button>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs sm:text-sm leading-tight">
          {" "}
          {/* Reduced mb-2 to mb-1 */}
          {product.name.slice(0, 40)}...
        </h3>

        <div className="flex items-center mb-1" size={40}>
          {" "}
          {/* Reduced mb-2 to mb-1 */}
          <div className="flex gap-0.5">{renderStars(product.rating)}</div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          {" "}
          {/* Reduced mb-3 to mb-2 */}
          <span className="text-base sm:text-lg font-semibold text-blue-800">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <ChatBox />
      <div className="bg-white shadow-sm mt-34"></div>

      <div className="lg:hidden flex justify-start ">
        <button
          onClick={() => setShowMobileFilters(true)}
          className=" text-white px-3 ms-3 rounded-md text-sm font-medium"
        >
          <ListFilter className="text-gray-500" />
        </button>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex justify-start">
          <div className="w-4/5 max-w-xs bg-white h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Brand</h3>
              {brandsList.map((brand) => (
                <label
                  key={brand._id}
                  className={`block mb-2 cursor-pointer ${
                    selectedBrand === brand._id ? "text-blue-800" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedBrand === brand._id}
                    onChange={() => handleBrandFilter(brand._id)}
                    className="mr-2"
                  />
                  {brand.name}
                </label>
              ))}
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Price</h3>
              <div className="flex gap-3 mb-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <button
                onClick={handlePriceFilter}
                className=" bg-blue-800 text-white py-2 w-[140px] rounded-md text-sm font-medium"
              >
                Apply Price Filter
              </button>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Rating</h3>
              {[5, 4].map((rating) => (
                <label
                  key={rating}
                  className={`flex items-center mb-2 cursor-pointer ${
                    selectedRating === rating ? "text-blue-800" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedRating === rating}
                    onChange={() => handleRatingFilter(rating)}
                  />
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm">& Up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <div className="hidden lg:block w-full lg:w-64 space-y-6">
              {/* Filter by Brand */}
              <div className="bg-white rounded-lg p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter("brand")}
                >
                  <h3 className="text-lg font-semibold text-gray-900">Brand</h3>
                  {expandedFilters.brand ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
                {expandedFilters.brand && (
                  <div className="mt-3 space-y-2">
                    {brandsList.map((brand) => (
                      <label
                        key={brand._id}
                        className={`flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded text-sm ${
                          selectedBrand === brand._id ? "bg-blue-50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mr-2 text-blue-800 w-3.5 h-3.5"
                          checked={selectedBrand === brand._id}
                          onChange={() => handleBrandFilter(brand._id)}
                        />
                        <span className="text-gray-700">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter by Price */}
              <div className="bg-white rounded-lg p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter("price")}
                >
                  <h3 className="text-lg font-semibold text-gray-900">Price</h3>
                  {expandedFilters.price ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
                {expandedFilters.price && (
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-800 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-800 text-sm"
                      />
                    </div>
                    <button
                      onClick={handlePriceFilter}
                      className="w-full bg-blue-800 text-white py-2 px-3 rounded-md hover:bg-blue-800 transition-colors text-sm font-medium"
                    >
                      Filter
                    </button>
                  </div>
                )}
              </div>

              {/* Filter by Ratings */}
              <div className="bg-white rounded-lg p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter("ratings")}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ratings
                  </h3>
                  {expandedFilters.ratings ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
                {expandedFilters.ratings && (
                  <div className="mt-3 space-y-2">
                    {[4, 3].map((rating) => (
                      <label
                        key={rating}
                        className={`flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded text-sm ${
                          selectedRating === rating ? "bg-blue-50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mr-2 text-blue-800 w-3.5 h-3.5"
                          checked={selectedRating === rating}
                          onChange={() => handleRatingFilter(rating)}
                        />
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-3.5 h-3.5 ${
                                index < rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-gray-700">& above</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Products */}
            <div className="flex-1">
              {/* Adjusted grid to show fewer products per row for better image display */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      id: product._id,
                      name: product.name,
                      price: product.finalPrice || product.price,
                      originalPrice:
                        product.price !== product.finalPrice
                          ? product.price
                          : null,
                      image: `https://rigsdock.com/uploads/${product.images?.[0]}`,
                      rating: product.averageRating || 0,
                      features: [`Brand-${product.brand?.name}`],
                    }}
                  />
                ))}
              </div>

              {/* Improved pagination styling */}
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <MoveLeft className="w-4 h-4" />
                </button>

                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <MoveRight className="w-4 h-4" />
                </button>
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

export default Shop;
