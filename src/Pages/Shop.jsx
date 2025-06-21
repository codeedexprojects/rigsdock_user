import React, { useEffect, useState } from "react";
import { Star, ChevronDown, ChevronUp, Heart } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../Services/allAPIs";
import { addToCartAPI } from "../Services/cartAPI";
import { addToWishlistAPI } from "../Services/wishlistAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Shop() {
  const navigate = useNavigate();
  const [AllProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        console.log("Fetched Products:", allProducts);
        setAllProducts(allProducts);
      } catch (err) {
        console.error("Error fetching Products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const highlights = [
    "All Products",
    "Best Seller",
    "New Arrivals",
    "Sale",
    "Hot Items",
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
        // console.error("Error adding to wishlist:", error);
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
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow"
          onClick={(e) => handleAddToWishlist(product.id, e)}
        >
          <Heart className="text-red-500 w-5 h-5" />
        </button>
      </div>
    );

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="h-64 mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {ImageWithWishlist}
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

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <div className="w-full lg:w-80 space-y-6">
              {/* Shop By Categories */}
              <div className="bg-white rounded-lg p-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter("categories")}
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    Shop By Categories
                  </h3>
                  {expandedFilters.categories ? (
                    <ChevronUp size={22} />
                  ) : (
                    <ChevronDown size={22} />
                  )}
                </div>
                {expandedFilters.categories && (
                  <div className="mt-5 space-y-3">
                    {categories.map((category, index) => (
                      <label
                        key={index}
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3 text-blue-600 w-4 h-4"
                          />
                          <span className="text-gray-700 text-base">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-gray-500 text-base">
                          ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Highlight */}
              <div className="bg-white rounded-lg p-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter("highlight")}
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    Highlight
                  </h3>
                  {expandedFilters.highlight ? (
                    <ChevronUp size={22} />
                  ) : (
                    <ChevronDown size={22} />
                  )}
                </div>
                {expandedFilters.highlight && (
                  <div className="mt-5 space-y-3">
                    {highlights.map((item, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer py-3 px-3 rounded text-base ${
                          index === 0
                            ? "text-blue-800 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                    {brands.map((brand, index) => (
                      <label
                        key={index}
                        className="flex items-center cursor-pointer hover:bg-gray-50 p-3 rounded"
                      >
                        <input
                          type="checkbox"
                          className="mr-3 text-blue-800 w-4 h-4"
                        />
                        <span className="text-gray-700 text-base">{brand}</span>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 text-base"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 text-base"
                      />
                    </div>
                    <button className="w-full bg-blue-800 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition-colors text-base font-medium">
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
                        className="flex items-center cursor-pointer hover:bg-gray-50 p-3 rounded"
                      >
                        <input
                          type="checkbox"
                          className="mr-3 text-blue-800 w-4 h-4"
                        />
                        <div className="flex items-center">
                          {renderStars(rating)}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
