import React, { useEffect, useState } from "react";
import { Star, ChevronDown, ChevronUp, Heart } from "lucide-react";
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

  const products = AllProducts;

  const categories = [
    { name: "Our Store", count: 24 },
    { name: "Storage Devices", count: 5 },
    { name: "Input Devices", count: 6 },
    { name: "Cooling Sysytem", count: 6 },
    { name: "Laptop Screw", count: 6 },
    { name: "Output Devices", count: 20 },
    { name: "Gaming Chairs", count: 7 },
  ];

  const brands = [
    "Apple",
    "Samsung",
    "Sony",
    "Google",
    "Microsoft",
    "Dell",
    "HP",
  ];

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
      <div className="relative group h-full">
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
      <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="h-64 mb-4 bg-white rounded-lg overflow-hidden">
  <div className="relative group w-full h-full">
    <img
  src={product.image}
  alt={product.name}
  className="w-full h-full object-contain p-4 cursor-pointer"
  onClick={handleProductClick}
/>
   <button
  className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow"
  onClick={(e) => handleAddToWishlist(product.id, e)}
>
  <Heart className="text-red-500 w-5 h-5" />
</button>

  </div>
</div>
        <h3 className="font-medium text-gray-900 mb-3 line-clamp-2 text-base">
          {product.name}
        </h3>
        <div className="flex items-center mb-3">
          {renderStars(product.rating)}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-semibold text-blue-800">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-base text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
        <ul className="text-sm text-gray-600 mb-4 space-y-2">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></span>
              {feature}
            </li>
          ))}
        </ul>
        <button
          className="w-full bg-blue-800 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors text-base mt-auto"
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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <nav className="text-sm text-gray-600 text-center">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span>shop</span>
            </nav>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
            SHOP
          </h1>
        </div>
      </div>

      <div className="lg:hidden flex justify-end ">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-blue-800 text-white px-5 py-2 me-3 rounded-md text-sm font-medium"
        >
          Filter
        </button>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
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
                className="w-full bg-blue-800 text-white py-2 rounded-md text-sm font-medium"
              >
                Apply Price Filter
              </button>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Rating</h3>
              {[5, 4, 3, 2, 1].map((rating) => (
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
            <div className="hidden lg:block w-full lg:w-80 space-y-6">
              {/* Filter by Brand */}
              <div className="bg-white rounded-lg p-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter("brand")}
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    Filter by Brand
                  </h3>
                  {expandedFilters.brand ? (
                    <ChevronUp size={22} />
                  ) : (
                    <ChevronDown size={22} />
                  )}
                </div>
                {expandedFilters.brand && (
                  <div className="mt-5 space-y-3">
                    {brandsList.map((brand) => (
                      <label
                        key={brand._id}
                        className={`flex items-center cursor-pointer hover:bg-gray-50 p-3 rounded ${
                          selectedBrand === brand._id ? "bg-blue-50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mr-3 text-blue-800 w-4 h-4"
                          checked={selectedBrand === brand._id}
                          onChange={() => handleBrandFilter(brand._id)}
                        />
                        <span className="text-gray-700 text-base">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter by Price */}
              <div className="bg-white rounded-lg p-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter("price")}
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    Filter by Price
                  </h3>
                  {expandedFilters.price ? (
                    <ChevronUp size={22} />
                  ) : (
                    <ChevronDown size={22} />
                  )}
                </div>
                {expandedFilters.price && (
                  <div className="mt-5 space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 text-base"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 text-base"
                      />
                    </div>
                    <button
                      onClick={handlePriceFilter}
                      className="w-full bg-blue-800 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition-colors text-base font-medium"
                    >
                      Filter
                    </button>
                  </div>
                )}
              </div>

              {/* Filter by Ratings */}
              <div className="bg-white rounded-lg p-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter("ratings")}
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    Filter by Ratings
                  </h3>
                  {expandedFilters.ratings ? (
                    <ChevronUp size={22} />
                  ) : (
                    <ChevronDown size={22} />
                  )}
                </div>
                {expandedFilters.ratings && (
                  <div className="mt-5 space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className={`flex items-center cursor-pointer hover:bg-gray-50 p-3 rounded ${
                          selectedRating === rating ? "bg-blue-50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mr-3 text-blue-800 w-4 h-4"
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
                          <span className="ml-2 text-gray-700 text-base">
                            & Up
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <p className="text-gray-600 text-base">
                  Showing 1–{products.length} of {products.length} results
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
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
                      features: [`Brand-${product.brand}`],
                      buttonText: "Add to cart",
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-base">
                    Previous
                  </button>
                  <button className="px-4 py-3 bg-blue-800 text-white rounded-md text-base">
                    1
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-base">
                    2
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-base">
                    3
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-base">
                    Next
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

export default Shop;
