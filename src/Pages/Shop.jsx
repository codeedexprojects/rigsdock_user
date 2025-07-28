import React, { useEffect, useState } from "react";
import { Star, ChevronDown, ChevronUp, Heart,  MoveRight, MoveLeft } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { getAllProducts, getBrandAPI } from "../Services/allAPIs";
import { addToCartAPI } from "../Services/cartAPI";
import { addToWishlistAPI } from "../Services/wishlistAPI";
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
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 9; 


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

  const handlePriceFilter = async () => {
    if (!minPrice || !maxPrice) {
      toast.warn("Please enter both min and max Price.");
      return;
    }
    try {
      const result = await filterByPriceAPI(minPrice, maxPrice);
      console.log("eroorr", result);

      setAllProducts(result.products || []);
      toast.success("Product filtered by Price");
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
        toast.info("Rating filter cleared");
      } catch (error) {
        toast.error("Failed to reset products");
      }
      setShowMobileFilters(false);

      return;
    }

    try {
      const response = await filterByyRatingAPI(minRating, maxRate);
      setAllProducts(response.products || []);
      toast.success(`Filtered products with rating ${rating} & up`);
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
        toast.info("Brand filter cleared");
      } catch (error) {
        toast.error("Failed to reset products");
      }
      return;
    }

    try {
      const res = await filterByBrandAPI(newBrand);
      setAllProducts(res.products || []);
      toast.success("Filtered by brand");
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
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const ProductCard = ({ product }) => {
    const handleProductClick = () => {
      navigate(`/product-details/${product.id}`);
    };

    const handleAddToCart = async (productId) => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("Please login to use wishlist.");
          return;
        }

        const response = await addToCartAPI(userId, productId);
        console.log("response", response);

        toast.success(response.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
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
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    const ImageWithWishlist = (
      <div className="relative group h-full ">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain cursor-pointer"
          onClick={handleProductClick}
        />
      <button
  className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow"
  onClick={(e) => handleAddToWishlist(product.id, e)}
>
  <Heart className="text-red-500 w-5 h-5" />
</button>

      </div>
    );

    return (
<div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow h-full flex flex-col text-sm">
<div className="h-24 sm:h-48 md:h-64 mb-4 bg-white rounded-lg overflow-hidden">
  <div className="relative group w-full h-full">
    <img
  src={product.image}
  alt={product.name}
  className="w-full h-full object-cover p-2 rounded-md cursor-pointer transition-transform duration-300 hover:scale-105"
/>

    <button
      className="absolute top-0 right-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow"
      onClick={(e) => handleAddToWishlist(product.id, e)}
    >
      <Heart className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  </div>
</div>
        <h3 className="font-medium text-gray-900 mb-3 line-clamp-2 text-base">
          {product.name.slice(0,15)}
        </h3>
        <div className="flex items-center mb-2">
          {renderStars(product.rating)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-blue-800">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-base text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
        {/* <ul className="text-sm text-gray-600 mb-4 space-y-2">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
              {feature}
            </li>
          ))}
        </ul> */}
       <button
  className="bg-blue-800 text-white font-medium py-1.5 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
  onClick={() => handleAddToCart(product.id)}
>
  {product.buttonText}
</button>

      </div>
    );
  };

  return (
    <>
      <Header />
      <ChatBox/>
      <div className="bg-white shadow-sm mt-40"></div>

      <div className="lg:hidden flex justify-start ">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-blue-800 text-white px-5 py-2 ms-4  rounded-md text-sm font-medium"
        >
         <ListFilter />
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
              {[5, 4,].map((rating) => (
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

      <div className="min-h-screen bg-gray-50">
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
      <h3 className="text-lg font-semibold text-gray-900">
        Brand
      </h3>
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
            <span className="text-gray-700">
              {brand.name}
            </span>
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
      <h3 className="text-lg font-semibold text-gray-900">
        Price
      </h3>
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
              <span className="ml-1 text-gray-700">
                & above
              </span>
            </div>
          </label>
        ))}
      </div>
    )}
  </div>
</div>

            {/* Right Side - Products */}
            <div className="flex-1">
              {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <p className="text-gray-600 text-base">
                  Showing 1–{products.length} of {products.length} results
                </p>
              </div> */}

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {paginatedProducts.map((product) => (
  <ProductCard
    key={product._id}
    product={{
      id: product._id,
      name: product.name,
      price: product.finalPrice || product.price,
      originalPrice:
        product.price !== product.finalPrice ? product.price : null,
      image: `https://rigsdock.com/uploads/${product.images?.[0]}`,
      rating: product.averageRating || 0,
      features: [`Brand-${product.brand}`],
      buttonText: "Add to cart",
    }}
  />
))}

              </div>

             <div className="flex justify-center mt-8 space-x-2">
  <button
    className="px-4 py-2  hover:bg-gray-100"
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    <MoveLeft />
  </button>

  {[...Array(totalPages)].map((_, i) => (
    <button
      key={i}
      className={`px-4 py-2  ${currentPage === i + 1 ? "bg-blue-800 text-white" : " hover:bg-gray-100"}`}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}

  <button
    className="px-4 py-2  hover:bg-gray-100"
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    <MoveRight />
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
