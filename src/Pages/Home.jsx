import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Moon, Sun, Heart } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import axios from "axios";
import { BASE_URL } from "../Services/baseUrl";
import {
  dealOfTheDayAPI,
  getBrandAPI,
  getHomeCategoryAPI,
  getHomeOfferAPI,
  productCarouselAPI,
} from "../Services/allAPIs";
import { useNavigate } from "react-router-dom";
import { addToWishlistAPI } from "../Services/wishlistAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  viewCategoriesAPI,
  viewMainCategoriesAPI,
  viewSubCategoriesAPI,
} from "../Services/categoryAPI";
import { getBlogAPI } from "../Services/orderconfirm";
import ChatBox from "../Components/ChatBox";

function Home() {
  const [isDark, setIsDark] = useState(false);
  const [dealCurrentIndex, setDealCurrentIndex] = useState(0);
  const [onSaleCurrentIndex, setOnSaleCurrentIndex] = useState(0);
  const [topRatedCurrentIndex, setTopRatedCurrentIndex] = useState(0);
  const [newArrivalsCurrentIndex, setNewArrivalsCurrentIndex] = useState(0);
  const [dealProducts, setDealProducts] = useState([]);
  const [expandedMainCat, setExpandedMainCat] = useState(null);
  const [subCategoryMap, setSubCategoryMap] = useState({});
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [homeOffers, setHomeOffers] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [carouselCards, setCarouselCards] = useState([]);
  const [homeCategories, setHomeCategories] = useState([]);
  const navigate = useNavigate();
  const SERVER_URL = "https://rigsdock.com";
  const [dealTimers, setDealTimers] = useState({});

  const calculateTimeLeft = (createdAt) => {
    const endTime = new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const diff = endTime - now;

    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const latestResponse = await axios.get(`${BASE_URL}/user/product/get`);
        const sortedLatest = latestResponse.data.products
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setLatestProducts(sortedLatest);
        const topRatedResponse = await axios.get(
          `${BASE_URL}/user/product/get`
        );
        const sortedTopRated = topRatedResponse.data.products
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 10);
        setTopRatedProducts(sortedTopRated);

        const dealResponse = await axios.get(
          `${BASE_URL}/user/dealoftheday/get`
        );
        setDealProducts(dealResponse.data);
        const initialTimers = {};
        dealResponse.data.forEach((deal) => {
          const timeLeft = calculateTimeLeft(deal.createdAt);
          if (timeLeft) {
            initialTimers[deal._id] = timeLeft;
          }
        });
        setDealTimers(initialTimers);

        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch products", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setDealTimers((prevTimers) => {
        const updated = {};
        for (const dealId in prevTimers) {
          const deal = dealProducts.find((d) => d._id === dealId);
          if (!deal) continue;
          const timeLeft = calculateTimeLeft(deal.createdAt);
          if (timeLeft) updated[dealId] = timeLeft;
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dealProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await viewMainCategoriesAPI();
        setCategories(res.mainCategories);
      } catch (error) {
        console.error("Error fetching main Categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMainAndCategories = async () => {
      try {
        const mainCategoriesResponse = await viewMainCategoriesAPI();
        const mainCategories = mainCategoriesResponse?.mainCategories || [];

        setMainCategories(mainCategories);
        const newCategoryMap = {};

        for (const mainCat of mainCategories) {
          if (mainCat && mainCat._id) {
            try {
              console.log("Fetching categories for:", mainCat._id);

              const categories = await viewCategoriesAPI(mainCat._id);
              newCategoryMap[mainCat._id] = categories;
            } catch (err) {
              console.error("Failed to fetch categories for", mainCat._id, err);
            }
          }
        }

        setCategoryMap(newCategoryMap);
      } catch (error) {
        console.error("Failed to fetch main categories", error);
      }
    };
    fetchMainAndCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrandAPI();
        setBrands(res);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await getBlogAPI();
        setBlogs(result.data || []);
      } catch (error) {
        toast.error(error.data.response.message);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchHomeOffer = async () => {
      try {
        const result = await getHomeOfferAPI();
        setHomeOffers(result.data || []);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchHomeOffer();
  }, []);
  useEffect(() => {
    const fetchHomeCategories = async () => {
      try {
        const res = await getHomeCategoryAPI();
        setHomeCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch home categories", err);
      }
    };

    fetchHomeCategories();
  }, []);

  useEffect(() => {
    const fetchCarouselCards = async () => {
      try {
        const res = await productCarouselAPI();
        console.log("Carousel API Response:", res);
        setCarouselCards(res);
      } catch (error) {
        console.error("Error fetching carousel cards", error);
      }
    };

    fetchCarouselCards();
  }, []);

  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 5;
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }
    return 5;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
      // setCurrentIndex(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const totalSlides = Math.ceil(products.length / itemsPerSlide);
  // const maxIndex = totalSlides - 1;

  const nextDealSlide = () => {
    setDealCurrentIndex((prev) =>
      prev >= Math.ceil(dealProducts.length / 1) - 1 ? 0 : prev + 1
    );
  };

  const prevDealSlide = () => {
    setDealCurrentIndex((prev) =>
      prev <= 0 ? Math.ceil(dealProducts.length / 1) - 1 : prev - 1
    );
  };

  const nextOnSaleSlide = () => {
    setOnSaleCurrentIndex((prev) =>
      prev >= Math.ceil(latestProducts.length / itemsPerSlide) - 1
        ? 0
        : prev + 1
    );
  };

  const prevOnSaleSlide = () => {
    setOnSaleCurrentIndex((prev) =>
      prev <= 0
        ? Math.ceil(latestProducts.length / itemsPerSlide) - 1
        : prev - 1
    );
  };

  const nextTopRatedSlide = () => {
    setTopRatedCurrentIndex((prev) =>
      prev >= Math.ceil(topRatedProducts.length / itemsPerSlide) - 1
        ? 0
        : prev + 1
    );
  };

  const prevTopRatedSlide = () => {
    setTopRatedCurrentIndex((prev) =>
      prev <= 0
        ? Math.ceil(topRatedProducts.length / itemsPerSlide) - 1
        : prev - 1
    );
  };

  const nextNewArrivalsSlide = () => {
    setNewArrivalsCurrentIndex((prev) =>
      prev >= Math.ceil(latestProducts.length / itemsPerSlide) - 1
        ? 0
        : prev + 1
    );
  };

  const prevNewArrivalsSlide = () => {
    setNewArrivalsCurrentIndex((prev) =>
      prev <= 0
        ? Math.ceil(latestProducts.length / itemsPerSlide) - 1
        : prev - 1
    );
  };

  const handleCategoryClick = async (mainCatId, catId) => {
    if (subCategoryMap[catId]) {
      setSubCategoryMap((prev) => {
        const updated = { ...prev };
        delete updated[catId];
        return updated;
      });
      return;
    }

    try {
      const res = await viewSubCategoriesAPI(mainCatId, catId);

      const subcategories = Array.isArray(res.subcategories)
        ? res.subcategories
        : res;

      setSubCategoryMap((prev) => ({
        ...prev,
        [catId]: subcategories || [], // ✅ Even if empty
      }));
    } catch (err) {
      if (err?.response?.status === 404) {
        console.warn(`No subcategories found for ${catId}`);
        setSubCategoryMap((prev) => ({
          ...prev,
          [catId]: [], // ✅ Treat as empty, no error shown
        }));
      } else {
        console.error("Error fetching subcategories:", err);
      }
    }
  };

  const toggleMainCategory = (mainCatId) => {
    setExpandedMainCat((prev) => {
      if (prev === mainCatId) {
        return null;
      }
      return mainCatId;
    });
    if (!categoryMap[mainCatId]) {
      fetchCategoriesForMain(mainCatId);
    }
  };
  const fetchCategoriesForMain = async (mainCatId) => {
    try {
      const res = await viewCategoriesAPI(mainCatId);
      setCategoryMap((prev) => ({
        ...prev,
        [mainCatId]: res || [],
      }));
    } catch (error) {
      console.error("Failed to fetch categories for main category", error);
    }
  };
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const handleAddToWishlist = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Please login first.");
      return;
    }

    try {
      const res = await addToWishlistAPI(userId, productId);
      toast.success("Product added to wishlist!");
      console.log("API response :", res);
    } catch (err) {
      console.error("Error adding to wishlist", err);
      toast.error(err.response.data.message);
    }
  };

  const duplicatedBrands = [...brands, ...brands];

  const navigateToProduct = (productId) => {
    navigate(`/product-details/${productId}`);
  };
  return (
    <>
      <Header />
      <ChatBox />
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl  font-bold text-gray-900 mb-6 text-center mt-40">
        Welcome to <span className="text-blue-700">RIGSDOCK</span>
      </h2>

      <div className="w-full px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {homeOffers.slice(0, 3).map((offer, index) => {
            const product = offer.productIds?.[0];
          const bgImage = offer.image
  ? `${SERVER_URL}/uploads/${offer.image.split('\\').pop().split('/').pop()}`
  : "https://source.unsplash.com/600x400/?gadget,tech";
return (
             <div
  key={offer._id}
  className={`${
    index === 0 ? "flex-[2]" : "flex-1"
  } rounded-2xl overflow-hidden min-h-[400px] flex flex-col justify-end p-6 lg:p-8 bg-black text-white`}
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

                <div className="bg-black/50 p-4 rounded-xl">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                    {offer.name}
                  </h2>
                  <h3 className="text-sm mb-2">{offer.description}</h3>

                  {product ? (
                    <div className="mb-2">
                      {product.price !== product.finalPrice && (
                        <span className="text-gray-300 text-sm line-through mr-2">
                          ₹{product.price}
                        </span>
                      )}
                      <span className="text-xl font-bold text-white">
                        ₹{product.finalPrice}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm">No product available</p>
                  )}

                  <button
                    onClick={() => product && navigateToProduct(product._id)}
                    className="bg-blue-800 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors mt-4"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={`min-h-screen mt-5 transition-colors duration-300 ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto px-2 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Weekly Deal Offer Card - Slider Version */}
            <div className="lg:w-80 flex-shrink-0">
              <div
                className={`rounded-2xl p-6 border-4 border-yellow-400 ${
                  isDark ? "bg-gray-800" : "bg-white"
                } relative overflow-hidden`}
              >
                <h2 className="text-xl font-bold mb-4 text-center">
                  Deal of the Day
                </h2>

                {loading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-4 text-red-500 text-sm">
                    Failed to load deals
                  </div>
                ) : (
                  (() => {
                    const activeDeals = dealProducts.filter((deal) =>
                      calculateTimeLeft(deal.createdAt)
                    );

                    return activeDeals.length > 0 ? (
                      <div className="relative">
                        {/* Deal Products Slider */}
                        <div className="overflow-hidden">
                          <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{
                              transform: `translateX(-${
                                dealCurrentIndex * 100
                              }%)`,
                            }}
                          >
                            {activeDeals.map((deal) => {
                              const timeLeft = dealTimers[deal._id];
                              const imageUrl = deal.product.images?.[0]
                                ? `${SERVER_URL}/uploads/${deal.product.images[0]}`
                                : "https://via.placeholder.com/300";

                              return (
                                <div
                                  key={deal._id}
                                  className="w-full flex-shrink-0 px-2"
                                >
                                  <div className="text-center mb-6 relative">
                                    {/* Discount Badge */}
                                    <div className="absolute top-4 right-4">
                                      <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
                                        {Math.round(
                                          ((deal.product.price -
                                            deal.offerPrice) /
                                            deal.product.price) *
                                            100
                                        )}
                                        %
                                      </span>
                                    </div>

                                    {/* Product Image */}
                                    <img
                                      src={imageUrl}
                                      alt={deal.product.name}
                                      className="w-48 h-48 mx-auto rounded-lg object-cover mb-4"
                                      onError={(e) => {
                                        e.target.src =
                                          "https://source.unsplash.com/300x300/?technology";
                                      }}
                                    />

                                    {/* Product Name */}
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                      {deal.product.name}
                                    </h3>

                                    {/* Static 5 stars */}
                                    <div className="flex justify-center mb-2">
                                      {renderStars(5)}
                                    </div>

                                    {/* Price Info */}
                                    <div className="flex justify-center items-center gap-2 mb-4">
                                      <span className="text-gray-400 line-through">
                                        ₹{deal.product.price}
                                      </span>
                                      <span className="text-2xl font-bold text-blue-600">
                                        ₹{deal.offerPrice}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Countdown Timer */}
                                  <div className="text-center mb-6">
                                    <p className="text-sm font-medium mb-4">
                                      Hurry Up! Limited Time
                                    </p>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                      <div>
                                        <div className="text-2xl font-bold text-red-500">
                                          {timeLeft.days}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          DAYS
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-2xl font-bold text-red-500">
                                          {String(timeLeft.hours).padStart(
                                            2,
                                            "0"
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          HRS
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-2xl font-bold text-red-500">
                                          {String(timeLeft.minutes).padStart(
                                            2,
                                            "0"
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          MIN
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-2xl font-bold text-red-500">
                                          {String(timeLeft.seconds).padStart(
                                            2,
                                            "0"
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          SEC
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* CTA Button */}
                                  <button
                                    onClick={() =>
                                      navigateToProduct(deal.product._id)
                                    }
                                    className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
                                  >
                                    Shop Now
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Navigation Arrows */}
                        {activeDeals.length > 1 && (
                          <>
                            <button
                              onClick={prevDealSlide}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={nextDealSlide}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white transition-colors"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        No active deals available
                      </div>
                    );
                  })()
                )}
              </div>
            </div>

            {/* Main Products Section */}
            <div className="px-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">On Sale Products</h2>
              </div>

              {/* Products Slider */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : (
                <div className="relative overflow-hidden mb-8">
                  <button
                    onClick={prevOnSaleSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextOnSaleSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${onSaleCurrentIndex * 100}%)`,
                    }}
                  >
                    {Array.from(
                      {
                        length: Math.ceil(
                          latestProducts.length / itemsPerSlide
                        ),
                      },
                      (_, slideIndex) => (
                        <div key={slideIndex} className="w-full flex-shrink-0">
                          <div className="flex flex-wrap justify-center gap-4 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {latestProducts
                              .slice(
                                slideIndex * itemsPerSlide,
                                (slideIndex + 1) * itemsPerSlide
                              )
                              .map((product) => (
                                <div
                                  key={product._id}
                                  className={`rounded-xl p-4 flex flex-col h-full ${
                                    isDark ? "bg-gray-800" : "bg-white"
                                  } shadow-md hover:shadow-lg transition-shadow relative`}
                                >
                                  {/* Sale Badge */}
                                  {product.price !== product.finalPrice && (
                                    <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                                      Sale
                                    </span>
                                  )}

                                  {/* Wishlist Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddToWishlist(product._id);
                                    }}
                                    className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                                  >
                                    <Heart className="w-4 h-4 text-gray-700 hover:text-red-500" />
                                  </button>

                                  {/* Product Image */}
                                  <div className="aspect-square mb-3 overflow-hidden rounded-lg flex items-center justify-center bg-gray-100">
                                    <img
                                      src={
                                        product.images &&
                                        product.images.length > 0
                                          ? `${SERVER_URL}/uploads/${product.images[0]}`
                                          : "https://via.placeholder.com/300"
                                      }
                                      alt={product.name}
                                      className="w-full h-full object-contain p-2"
                                      onError={(e) => {
                                        e.target.src =
                                          "https://via.placeholder.com/300";
                                      }}
                                    />
                                  </div>

                                  {/* Product Info */}
                                  <div className="flex-grow">
                                    <h3 className="text-sm font-semibold mb-1 line-clamp-2 h-10">
                                      {product.name}
                                    </h3>

                                    <div className="flex text-yellow-400 text-sm mb-1">
                                      {renderStars(product.averageRating)}
                                    </div>

                                    <div className="text-sm mb-3">
                                      {product.price !== product.finalPrice && (
                                        <span className="text-gray-400 line-through mr-1">
                                          ₹{product.price}
                                        </span>
                                      )}
                                      <span className="text-blue-600 font-bold">
                                        ₹{product.finalPrice}
                                      </span>
                                    </div>
                                  </div>

                                  {/* View Product Button */}
                                  <button
                                    onClick={() =>
                                      navigateToProduct(product._id)
                                    }
                                    className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-xs font-medium transition-colors mt-auto"
                                  >
                                    View Product
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Image Cards Section - Now positioned after the products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {homeOffers.slice(0, 2).map((offer) => {
                  const product = offer.productIds?.[0];
                  return (
                    <div
                      key={offer._id}
                      className="relative group h-64 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={() => product && navigateToProduct(product._id)}
                    >
                      {/* Background Image */}
                     <div
  className="absolute inset-0"
  style={{
    backgroundImage: `url(${
      offer.image
        ? `${SERVER_URL}/uploads/${offer.image.split('/').pop()}`
        : "https://source.unsplash.com/600x400/?electronics,tech"
    })`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
/>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

                      {/* Content */}
                      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                        <div>
                          <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-4">
                            {offer.discountType === "percentage"
                              ? `${offer.discountValue}% OFF`
                              : "SPECIAL"}
                          </span>
                          <h3 className="text-white text-2xl font-bold mb-2">
                            {offer.name}
                          </h3>
                          <p className="text-white/90 text-sm line-clamp-2">
                            {offer.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          {product ? (
                            <div>
                              {product.price !== product.finalPrice && (
                                <span className="text-white/80 text-sm line-through">
                                  ₹{product.price}
                                </span>
                              )}
                              <span className="text-white text-xl font-bold ml-2">
                                ₹{product.finalPrice}
                              </span>
                            </div>
                          ) : (
                            <span className="text-white text-sm">
                              No product
                            </span>
                          )}

                          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
                            Shop Now
                          </button>
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full blur-xl" />
                      <div className="absolute bottom-8 right-8 w-8 h-8 bg-yellow-400/30 rounded-full blur-lg" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Top Rated Section */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" id="top-rated-section">
            Top Rated Item's
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="relative overflow-hidden mb-8">
            {/* Left Arrow */}
            <button
              onClick={prevTopRatedSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextTopRatedSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Product Slider */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${topRatedCurrentIndex * 100}%)`,
              }}
            >
              {Array.from(
                { length: Math.ceil(topRatedProducts.length / itemsPerSlide) },
                (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="flex flex-wrap justify-center gap-4 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {topRatedProducts
                        .slice(
                          slideIndex * itemsPerSlide,
                          (slideIndex + 1) * itemsPerSlide
                        )
                        .map((product) => (
                          <div
                            key={product._id}
                            className={`rounded-xl p-4 flex flex-col h-full ${
                              isDark ? "bg-gray-800" : "bg-white"
                            } shadow-md hover:shadow-lg transition-shadow relative`}
                          >
                            {/* Sale Badge */}
                            {product.price !== product.finalPrice && (
                              <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                                Sale
                              </span>
                            )}

                            {/* Wishlist Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToWishlist(product._id);
                              }}
                              className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                            >
                              <Heart className="w-4 h-4 text-gray-700 hover:text-red-500" />
                            </button>

                            {/* Product Image */}
                            <div className="aspect-square mb-3 overflow-hidden rounded-lg flex items-center justify-center bg-gray-100">
                              <img
                                src={
                                  product.images && product.images.length > 0
                                    ? `${SERVER_URL}/uploads/${product.images[0]}`
                                    : "https://via.placeholder.com/300"
                                }
                                alt={product.name}
                                className="w-full h-full object-contain p-2"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/300";
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-grow">
                              <h3 className="text-sm font-semibold mb-1 line-clamp-2 h-10">
                                {product.name}
                              </h3>
                              <div className="flex text-yellow-400 text-sm mb-1">
                                {renderStars(product.averageRating)}
                              </div>
                              <div className="text-sm mb-3">
                                {product.price !== product.finalPrice && (
                                  <span className="text-gray-400 line-through mr-1">
                                    ₹{product.price}
                                  </span>
                                )}
                                <span className="text-blue-600 font-bold">
                                  ₹{product.finalPrice}
                                </span>
                              </div>
                            </div>

                            {/* View Product Button */}
                            <button
                              onClick={() => navigateToProduct(product._id)}
                              className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-xs font-medium transition-colors mt-auto"
                            >
                              View Product
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* deal 3 card product */}
      <div className="w-full px-4 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Tech & Gadgets
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore cutting-edge technology and innovative gadgets that redefine
            your digital lifestyle
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {carouselCards.map((card) => {
            const imageUrl = `https://rigsdock.com/uploads/${card?.image}`;
            return (
              <div
                key={card._id}
                className="group w-80 flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
                onClick={() => window.open(card.link, "_blank")}
              >
                {/* Image Container with Overlay */}
                <div className="relative overflow-hidden h-56 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://source.unsplash.com/600x400/?gadget";
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Floating Action Button */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>

                {/* Content Section - flex-grow makes this section expand to fill remaining space */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {card.subtitle}
                  </p>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      View Product
                    </span>
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* shop by category section */}
      <section className="bg-white py-12 px-4 md:px-10">
        <div className="max-w-none">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories?.map((mainCat) => {
                const isExpanded = expandedMainCat === mainCat._id;
                const mainCatCategories = categoryMap[mainCat._id] || [];

                const isDisabled = ["used products", "courses"].includes(
                  mainCat.name?.trim().toLowerCase()
                );

                return (
                  <div
                    key={mainCat._id}
                    className={`border rounded-lg p-4 bg-white shadow hover:shadow-md transition-all ${
                      isExpanded ? "ring-2 ring-blue-500" : ""
                    } ${
                      isDisabled
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() =>
                      !isDisabled && toggleMainCategory(mainCat._id)
                    }
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={`${SERVER_URL}/uploads/${mainCat.image}`}
                        alt={mainCat.name}
                        className="w-16 h-16 object-cover rounded-md mb-2"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100";
                        }}
                      />
                      <h4 className="font-semibold text-base mb-1">
                        {mainCat.name}
                        {isDisabled && (
                          <span className="ml-1 text-xs text-gray-500">
                            (Coming Soon)
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {mainCat.description}
                      </p>
                    </div>

                    {/* Expand categories */}
                    {isExpanded && !isDisabled && (
                      <div className="mt-3 border-t pt-3">
                        {mainCatCategories.length > 0 ? (
                          <>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">
                              Categories under {mainCat.name}:
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                              {mainCatCategories.map((cat) => {
                                const subcategories =
                                  subCategoryMap[cat._id] || [];
                                return (
                                  <div key={cat._id} className="space-y-2">
                                    <div
                                      className={`px-3 py-2 rounded font-medium ${
                                        subcategories.length > 0
                                          ? "bg-gray-100 cursor-pointer"
                                          : "bg-gray-50"
                                      } hover:bg-gray-200`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCategoryClick(
                                          mainCat._id,
                                          cat._id
                                        );
                                      }}
                                    >
                                      <div className="flex justify-between items-center">
                                        <span>{cat.name}</span>
                                        {subcategories.length > 0 && (
                                          <span className="text-xs text-gray-500">
                                            ▲
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {subCategoryMap[cat._id]?.length > 0 && (
                                      <ul className="mt-1 ml-3 pl-3 border-l border-gray-300 text-sm space-y-1">
                                        {subcategories.map((sub) => (
                                          <li
                                            key={sub._id}
                                            onClick={() =>
                                              navigate(
                                                `/category/${mainCat._id}/${cat._id}/${sub._id}`
                                              )
                                            }
                                            className="bg-white px-3 py-1 rounded shadow-sm border text-gray-700 hover:bg-gray-100 cursor-pointer"
                                          >
                                            {sub.name}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-gray-500 py-2 text-sm">
                            No subcategories available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right-side Promo Image */}
            <div className="lg:col-span-5">
              {homeCategories.length > 0 ? (
                <div
                  key={homeCategories[0]._id}
                  className="relative group h-full min-h-[480px] rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                  onClick={() => navigate("/shop")}
                >
                  <img
                    src={
                      homeCategories[0].image
                        ? homeCategories[0].image.replace(
                            "C:\\Users\\Abhijith KK\\Desktop\\Abijith\\Codeedex\\rigsdock_backend\\uploads\\",
                            `${SERVER_URL}/uploads/`
                          )
                        : "https://source.unsplash.com/600x400/?electronics,gadgets"
                    }
                    alt={homeCategories[0].title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    onError={(e) => {
                      e.target.src =
                        "https://source.unsplash.com/600x400/?electronics,gadgets";
                    }}
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/50 transition duration-300"></div>

                  {/* Text Content */}
                  <div className="relative z-20 p-6 h-full flex flex-col justify-end">
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-1">
                        {homeCategories[0].title}
                      </h3>
                      <p className="text-white text-sm">
                        {homeCategories[0].subtitle}
                      </p>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                      <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[480px] flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded-lg">
                  No Promotion Available
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 px-4 py-4">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" id="newarrival">
              New Arrivals
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="relative overflow-hidden mb-8">
              {/* Left Arrow */}
              <button
                onClick={prevNewArrivalsSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={nextNewArrivalsSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Product Slider */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${newArrivalsCurrentIndex * 100}%)`,
                }}
              >
                {Array.from(
                  { length: Math.ceil(latestProducts.length / itemsPerSlide) },
                  (_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="flex flex-wrap justify-center gap-4 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {latestProducts
                          .slice(
                            slideIndex * itemsPerSlide,
                            (slideIndex + 1) * itemsPerSlide
                          )
                          .map((product) => (
                            <div
                              key={product._id}
                              className={`rounded-xl p-4 flex flex-col h-full ${
                                isDark ? "bg-gray-800" : "bg-white"
                              } shadow-md hover:shadow-lg transition-shadow relative`}
                            >
                              {/* Sale Badge */}
                              {product.price !== product.finalPrice && (
                                <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                                  Sale
                                </span>
                              )}

                              {/* Wishlist Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToWishlist(product._id);
                                }}
                                className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                              >
                                <Heart className="w-4 h-4 text-gray-700 hover:text-red-500" />
                              </button>

                              {/* Product Image */}
                              <div className="aspect-square mb-3 overflow-hidden rounded-lg flex items-center justify-center bg-gray-100">
                                <img
                                  src={
                                    product.images && product.images.length > 0
                                      ? `${SERVER_URL}/uploads/${product.images[0]}`
                                      : "https://via.placeholder.com/300"
                                  }
                                  alt={product.name}
                                  className="w-full h-full object-contain p-2"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/300";
                                  }}
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex-grow">
                                <h3 className="text-sm font-semibold mb-1 line-clamp-2 h-10">
                                  {product.name}
                                </h3>
                                <div className="flex text-yellow-400 text-sm mb-1">
                                  {renderStars(product.averageRating)}
                                </div>
                                <div className="text-sm mb-3">
                                  {product.price !== product.finalPrice && (
                                    <span className="text-gray-400 line-through mr-1">
                                      ₹{product.price}
                                    </span>
                                  )}
                                  <span className="text-blue-600 font-bold">
                                    ₹{product.finalPrice}
                                  </span>
                                </div>
                              </div>

                              {/* View Product Button */}
                              <button
                                onClick={() => navigateToProduct(product._id)}
                                className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-xs font-medium transition-colors mt-auto"
                              >
                                View Product
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          {/* Section Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">
            Our Brands
          </h2>

          {/* Carousel Container */}
          {brands?.length > 0 ? (
            <div className="relative overflow-hidden">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

              {/* Sliding Container */}
              <div className="flex animate-scroll">
                {duplicatedBrands.map((brand, index) => (
                  <div
                    key={`${brand?._id || index}-${index}`}
                    className="flex-shrink-0 mx-2 sm:mx-3 md:mx-4 bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 group w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28 lg:w-52 lg:h-32"
                  >
                    <div className="flex items-center justify-center h-full p-3 sm:p-4 md:p-6">
                      <img
                        src={
                          brand?.image
                            ? `${SERVER_URL}/uploads/${brand.image}`
                            : "https://via.placeholder.com/150"
                        }
                        alt={brand?.name || "Brand"}
                        className="max-h-8 sm:max-h-10 md:max-h-12 lg:max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {loading ? "Loading brands..." : "No brands available"}
            </div>
          )}

          {/* Custom CSS for animation */}
          <style>{`
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    
    .animate-scroll {
      animation: scroll 25s linear infinite;
    }
    
    .animate-scroll:hover {
      animation-play-state: paused;
    }

    @media (max-width: 640px) {
      .animate-scroll {
        animation: scroll 20s linear infinite;
      }
    }

    @media (max-width: 768px) {
      .animate-scroll {
        animation: scroll 22s linear infinite;
      }
    }
  `}</style>
        </div>

        <section className="px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">From Our Blog</h2>
            <button
              onClick={() => navigate("/blog")}
              className="text-blue-600 font-semibold hover:underline text-sm"
            >
              View More
            </button>
          </div>
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-gray-50 p-4 rounded-md shadow-md transition-transform transform hover:-translate-y-1"
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-40 object-cover mb-4 rounded"
                  />
                  <p className="text-gray-500 text-sm mb-1">
                    {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                  <p className="text-gray-500 mb-4 line-clamp-2">
                    {blog.description}
                  </p>
                  <a
                    href="/blog"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Read more
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No blog posts available
            </div>
          )}
        </section>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      <Footer />
    </>
  );
}

export default Home;
