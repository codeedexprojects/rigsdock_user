import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Heart,
  BaselineIcon,
} from "lucide-react";
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
// import {
//   viewCategoriesAPI,
//   viewMainCategoriesAPI,
//   viewSubCategoriesAPI,
// } from "../Services/categoryAPI";
import { getBlogAPI } from "../Services/orderconfirm";
import ChatBox from "../Components/ChatBox";
import AOS from 'aos';
import 'aos/dist/aos.css';
import CategoryGrid from "../Components/Category.jsx/ShopCategory";



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
  const [currentSlide, setCurrentSlide] = useState(0);
  const offersToShow = homeOffers.slice(0, 2);
  const offersToShows = homeOffers.slice(0, 1);

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeOffers.slice(0, 3).length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [homeOffers]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeOffers.slice(0, 2).length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [homeOffers]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? homeOffers.slice(0, 3).length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % homeOffers.slice(0, 3).length);
  };

  const goToSlides = (index) => {
    setCurrentSlide(index);
  };

  const gosToPrevious = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? offersToShow.length - 1 : prev - 1
    );
  };

  const goToNexts = () => {
    setCurrentSlide((prev) => (prev + 1) % offersToShow.length);
  };

  useEffect(() => {
    // Only start interval if we have offers
    if (offersToShow.length > 1) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % offersToShow.length);
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(slideInterval);
    }
  }, [offersToShow]);

  const calculateTimeLeft = (createdAt) => {
    const endTime = new Date(createdAt).getTime() + 1 * 24 * 60 * 60 * 1000;
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
  AOS.init({
    duration: 1000, // animation duration (in ms)
    once: true,     // whether animation should happen only once
  });
}, []);

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
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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



  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < 3 ? "text-yellow-400" : "text-gray-300"
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
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center mt-40 mb-4">
        Welcome to <span className="text-blue-700">RIGSDOCK</span>
      </h2>

     <div className="w-full px-4 lg:px-8 py-8">
  {/* Desktop Layout - Enhanced Design */}
  <div className="hidden lg:flex flex-row gap-6">
    {homeOffers.slice(0, 3).map((offer, index) => {
      const product = offer.productIds?.[0];
      const bgImage =
        offer.image && offer.image.includes("/uploads/")
          ? `${SERVER_URL}/uploads/${offer.image.split("/uploads/")[1]}`
          : "https://source.unsplash.com/600x400/?gadget,tech";

      return (
        <div
          key={offer._id}
          className={`${
            index === 0 ? "flex-[2]" : "flex-1"
          } group relative rounded-2xl overflow-hidden min-h-[400px] flex flex-col justify-end transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer`}
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => product && navigateToProduct(product._id)}
        >
          {/* Gradient Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10 p-6 lg:p-8">
            {/* Offer Badge */}
            {product && product.price !== product.finalPrice && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold mb-4">
                SALE
              </div>
            )}
            
            <h2 className="text-2xl lg:text-4xl font-bold text-white drop-shadow-lg leading-tight" data-aos="fade-up">
              {offer.name}
            </h2>
            <p className="text-base lg:text-lg  text-gray-100 drop-shadow-md leading-relaxed">
              {offer.description}
            </p>

            {product ? (
              <div className="mb-6">
                {product.price !== product.finalPrice && (
                  <span className="text-gray-300 text-lg line-through mr-3 drop-shadow-sm">
                    ₹{product.price}
                  </span>
                )}
                <span className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                  ₹{product.finalPrice}
                </span>
              </div>
            ) : (
              <p className="text-base text-gray-200 mb-6">Explore our collection</p>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                product && navigateToProduct(product._id);
              }}
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-1 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Shop Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      );
    })}
  </div>

  {/* Mobile Horizontal Scroll Layout */}
  <div className="lg:hidden">
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
      {homeOffers.slice(0, 3).map((offer, index) => {
        const product = offer.productIds?.[0];
        const bgImage = offer.image
          ? `${SERVER_URL}/uploads/${offer.image
              .split("\\")
              .pop()
              .split("/")
              .pop()}`
          : "https://source.unsplash.com/600x400/?gadget,tech";
        
        return (
          <div
            key={offer._id}
            className="flex-shrink-0 w-80 h-96 relative rounded-2xl overflow-hidden shadow-lg"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => product && navigateToProduct(product._id)}
          >
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            
            {/* Content Container */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Offer Badge */}
              {product && product.price !== product.finalPrice && (
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold mb-3">
                  SALE
                </div>
              )}
              
              <h2 className="text-xl font-bold mb-2 text-white drop-shadow-lg leading-tight">
                {offer.name}
              </h2>
              <p className="text-sm mb-3 text-gray-100 drop-shadow-md line-clamp-2 leading-relaxed">
                {offer.description}
              </p>

              {product ? (
                <div className="mb-4">
                  {product.price !== product.finalPrice && (
                    <span className="text-gray-300 text-sm line-through mr-2 drop-shadow-sm">
                      ₹{product.price}
                    </span>
                  )}
                  <span className="text-xl font-bold text-white drop-shadow-lg">
                    ₹{product.finalPrice}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-200 mb-4">Explore collection</p>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  product && navigateToProduct(product._id);
                }}
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 text-sm shadow-lg"
              >
                Shop Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-4 right-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Scroll Indicator */}
    <div className="flex justify-center mt-4">
      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <span className="text-xs text-gray-600 font-medium">Swipe to explore</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  </div>
</div>

    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900 text-white" : "text-gray-900"}`}>
  <div className="container mx-auto px-0 sm:px-4 py-4">
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Weekly Deal Offer Card - Slider Version */}
      <div className="w-full lg:w-80 flex-shrink-0 px-2 sm:px-0">
        <div
          className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border-4 border-yellow-400 ${
            isDark ? "bg-gray-800" : "bg-white"
          } relative overflow-hidden`}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
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
                            className="w-full flex-shrink-0 px-1 sm:px-2"
                          >
                            <div className="text-center mb-4 sm:mb-6 relative">
                              {/* Product Image */}
                              <img
                                src={imageUrl}
                                alt={deal.product.name}
                                className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-lg object-cover mb-3 sm:mb-4"
                                onError={(e) => {
                                  e.target.src =
                                    "https://source.unsplash.com/300x300/?technology";
                                }}
                              />

                              {/* Product Name */}
                              <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">
                                {deal.product.name}
                              </h3>

                              {/* Static 5 stars */}
                              <div className="flex justify-center mb-1 sm:mb-2">
                                {renderStars(5)}
                              </div>

                              {/* Price Info */}
                              <div className="flex justify-center items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                                <span className="text-gray-400 line-through text-xs sm:text-base">
                                  ₹{deal.product.price}
                                </span>
                                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                                  ₹{deal.offerPrice}
                                </span>
                              </div>
                            </div>

                            {/* Countdown Timer */}
                            <div className="text-center mb-4 sm:mb-6">
                              <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-4">
                                Hurry Up! Limited Time
                              </p>
                              <div className="grid grid-cols-3 gap-1 sm:gap-2 mx-auto max-w-[200px] text-center">
                                <div>
                                  <div className="text-xl sm:text-2xl font-bold text-red-500">
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
                                  <div className="text-xl sm:text-2xl font-bold text-red-500">
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
                                  <div className="text-xl sm:text-2xl font-bold text-red-500">
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
                              className="w-full bg-blue-800 hover:bg-blue-700 text-white py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
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
                        className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={nextDealSlide}
                        className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-10 text-gray-500">
                  <img
                    src="https://cdn.dribbble.com/userupload/22180708/file/original-fb0f3fcb86aa71d393a578acb476b44c.gif"
                    alt=""
                    className="mx-auto max-w-[200px]"
                  />
                  No active deals available
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* On Sale Products Section */}
     <div className="px-2 sm:px-4 py-2 sm:py-4 flex-1">
  <div className="flex justify-between items-center mb-3 sm:mb-4">
    <h2 className="text-xl sm:text-2xl font-bold">
      On Sale Products
    </h2>
  </div>

  {/* Products Slider */}
  {loading ? (
    <div className="flex justify-center items-center h-48 sm:h-64">
      <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2"></div>
    </div>
  ) : error ? (
    <div className="text-center py-8 sm:py-10 text-red-500">
      {error}
    </div>
  ) : (
    <>
      {/* Mobile Scrollable Layout */}
      <div className="block sm:hidden mb-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {latestProducts.map((product) => (
            <div
              key={product._id}
              className="rounded-lg p-2 flex flex-col h-full bg-white relative flex-shrink-0 w-[140px]"
            >
              {/* Sale Badge */}
              {product.price !== product.finalPrice && (
                <span className="absolute top-1 left-1 bg-yellow-400 text-black text-[8px] font-bold px-1 py-0.5 rounded">
                  Sale
                </span>
              )}

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(product._id);
                }}
                className="absolute top-1 right-1 z-10 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <Heart className="w-3 h-3 text-gray-700 hover:text-red-500" />
              </button>

              {/* Product Image */}
              <div className="aspect-square mb-1 overflow-hidden rounded-lg flex items-center justify-center">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `${SERVER_URL}/uploads/${product.images[0]}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow">
                <h3 className="text-xs truncate font-medium mb-1">
                  {product.name.slice(0, 40)}
                </h3>

                <div className="flex text-yellow-400 text-xs mb-1">
                  {renderStars(product.averageRating)}
                </div>

                <div className="text-xs">
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
                className="w-full bg-blue-800 hover:bg-blue-700 text-white py-1 rounded-md text-xs font-medium transition-colors mt-1"
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Slider Layout */}
      <div className="hidden sm:block relative overflow-hidden mb-6 sm:mb-10">
        <button
          onClick={prevOnSaleSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={nextOnSaleSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${onSaleCurrentIndex * 100}%)`,
          }}
        >
          {Array.from(
            {
              length: Math.ceil(latestProducts.length / itemsPerSlide),
            },
            (_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="flex-wrap justify-center gap-2 sm:gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {latestProducts
                    .slice(
                      slideIndex * itemsPerSlide,
                      (slideIndex + 1) * itemsPerSlide
                    )
                    .map((product) => (
                      <div
                        key={product._id}
                        className={`rounded-lg sm:rounded-xl p-2 sm:p-4 flex flex-col h-full bg-white relative w-full max-w-[180px] sm:w-[160px] md:w-[180px] lg:w-[200px]`}
                      >
                        {/* Sale Badge */}
                        {product.price !== product.finalPrice && (
                          <span className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-yellow-400 text-black text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded">
                            Sale
                          </span>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(product._id);
                          }}
                          className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                        >
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 hover:text-red-500" />
                        </button>

                        {/* Product Image */}
                        <div className="aspect-square mb-1 sm:mb-2 overflow-hidden rounded-lg flex items-center justify-center">
                          <img
                            src={
                              product.images && product.images.length > 0
                                ? `${SERVER_URL}/uploads/${product.images[0]}`
                                : "https://via.placeholder.com/300"
                            }
                            alt={product.name}
                            className="w-full h-full object-contain p-1 sm:p-2"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300";
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow">
                          <h3 className="text-xs truncate font-medium mb-1">
                            {product.name.slice(0, 40)}
                          </h3>

                          <div className="flex text-yellow-400 text-xs mb-1">
                            {renderStars(product.averageRating)}
                          </div>

                          <div className="text-xs sm:text-sm">
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
                          className="w-full bg-blue-800 hover:bg-blue-700 text-white py-1 rounded-md text-xs font-medium transition-colors mt-1 sm:mt-2"
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
    </>
  )}

  {/* Image Cards Section */}
  <div className="w-full">
    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {offersToShow.map((offer) => {
        const product = offer.productIds?.[0];
        return (
          <div
            key={offer._id}
            className="relative group h-48 sm:h-64 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg sm:hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] sm:hover:scale-[1.02]"
            onClick={() => product && navigateToProduct(product._id)}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${
                  offer.image
                    ? `${SERVER_URL}/uploads/${offer.image.split("/").pop()}`
                    : "https://source.unsplash.com/600x400/?electronics,tech"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

            {/* Content */}
            <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-between">
              <div>
                <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mb-2 sm:mb-4">
                  {offer.discountType === "percentage"
                    ? `${offer.discountValue}% OFF`
                    : "SPECIAL"}
                </span>
                <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
                  {offer.name}
                </h3>
                <p className="text-white/90 text-xs sm:text-sm line-clamp-2">
                  {offer.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                {product ? (
                  <div>
                    {product.price !== product.finalPrice && (
                      <span className="text-white/80 text-xs sm:text-sm line-through">
                        ₹{product.price}
                      </span>
                    )}
                    <span className="text-white text-base sm:text-lg md:text-xl font-bold ml-1 sm:ml-2">
                      ₹{product.finalPrice}
                    </span>
                  </div>
                ) : (
                  <span className="text-white text-xs sm:text-sm">
                    No product
                  </span>
                )}

                <button className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 text-xs sm:text-sm">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Mobile Slider Layout */}
    <div className="md:hidden relative">
      {/* Slider Container */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {offersToShow.map((offer) => {
            const product = offer.productIds?.[0];
            return (
              <div
                key={offer._id}
                className="w-full flex-shrink-0 relative group h-48 cursor-pointer"
                onClick={() => product && navigateToProduct(product._id)}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${
                      offer.image
                        ? `${SERVER_URL}/uploads/${offer.image.split("/").pop()}`
                        : "https://source.unsplash.com/600x400/?electronics,tech"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

                {/* Content */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                      {offer.discountType === "percentage"
                        ? `${offer.discountValue}% OFF`
                        : "SPECIAL"}
                    </span>
                    <h3 className="text-white text-base font-bold mb-1">
                      {offer.name}
                    </h3>
                    <p className="text-white/90 text-xs line-clamp-2">
                      {offer.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    {product ? (
                      <div>
                        {product.price !== product.finalPrice && (
                          <span className="text-white/80 text-xs line-through">
                            ₹{product.price}
                          </span>
                        )}
                        <span className="text-white text-sm font-bold ml-1">
                          ₹{product.finalPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-white text-xs">No product</span>
                    )}

                    <button className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md hover:bg-white/30 transition-all duration-300 border border-white/30 text-xs">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows - Only show if more than 1 slide */}
      {offersToShow.length > 1 && (
        <>
          <button
            onClick={gosToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors z-20 backdrop-blur-sm border border-white/20"
            aria-label="Previous slide"
          >
            <svg
              className="w-4 h-4"
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
          </button>

          <button
            onClick={goToNexts}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors z-20 backdrop-blur-sm border border-white/20"
            aria-label="Next slide"
          >
            <svg
              className="w-4 h-4"
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
          </button>
        </>
      )}

      {/* Dot Indicators - Only show if more than 1 slide */}
      {offersToShow.length > 1 && (
        <div className="flex justify-center space-x-2 mt-3">
          {offersToShow.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlides(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-yellow-400 scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
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
    <div className="relative mb-8">
      {/* Desktop Slider - Hidden on mobile */}
      <div className="hidden md:block">
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

        {/* Product Slider for Desktop */}
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {topRatedProducts
                    .slice(
                      slideIndex * itemsPerSlide,
                      (slideIndex + 1) * itemsPerSlide
                    )
                    .map((product) => (
                      <div
                        key={product._id}
                        className={`rounded-xl p-3 sm:p-4 flex flex-col h-full ${
                          isDark ? "bg-gray-800" : "bg-white"
                        }  relative`}
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
                        <div className="aspect-square mb-3 overflow-hidden  flex items-center justify-center p-6">
                          <img
                            src={
                              product.images && product.images.length > 0
                                ? `${SERVER_URL}/uploads/${product.images[0]}`
                                : "https://via.placeholder.com/300"
                            }
                            alt={product.name}
                            className="w-full h-full object-contain p-2 sm:p-3"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300";
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow">
                          <h3 className="text-xs truncate sm:text-sm font-semibold line-clamp-2 h-10 sm:h-10">
                            {product.name.slice(0, 50)}
                          </h3>
                          <div className="flex text-yellow-400 text-xs sm:text-sm">
                            {renderStars(product.averageRating)}
                          </div>
                          <div className="text-xs sm:text-sm ">
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
                          className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-xs sm:text-sm font-medium transition-colors mt-auto"
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

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {topRatedProducts.map((product) => (
            <div
              key={product._id}
              className="flex-shrink-0 w-40 sm:w-48 snap-start"
            >
              <div
                className={`rounded-xl p-3 flex flex-col h-full ${
                  isDark ? "bg-gray-800" : "bg-white"
                } shadow-md transition-shadow relative`}
              >
                {/* Sale Badge */}
                {product.price !== product.finalPrice && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded z-10">
                    Sale
                  </span>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(product._id);
                  }}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-gray-700 hover:text-red-500" />
                </button>

                {/* Product Image */}
                <div className="aspect-square mb-2 overflow-hidden rounded-lg flex items-center justify-center">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? `${SERVER_URL}/uploads/${product.images[0]}`
                        : "https://via.placeholder.com/300"
                    }
                    alt={product.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <h3 className="text-xs font-semibold mb-1 line-clamp-2 h-8">
                    {product.name.slice(0, 40)}
                  </h3>
                  <div className="flex text-yellow-400 text-xs mb-1">
                    {renderStars(product.averageRating)}
                  </div>
                  <div className="text-xs mb-2">
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
                  className="w-full bg-blue-800 hover:bg-blue-700 text-white py-1.5 rounded-md text-xs font-medium transition-colors mt-auto"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet Grid - Shown only on tablet sizes */}
      <div className="hidden sm:block md:hidden">
        <div className="grid grid-cols-2 gap-4">
          {topRatedProducts.slice(0, 6).map((product) => (
            <div
              key={product._id}
              className={`rounded-xl p-3 flex flex-col h-full ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-md transition-shadow relative`}
            >
              {/* Sale Badge */}
              {product.price !== product.finalPrice && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded z-10">
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
              <div className="aspect-square mb-3 overflow-hidden rounded-lg flex items-center justify-center">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `${SERVER_URL}/uploads/${product.images[0]}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow">
                <h3 className="text-sm font-semibold mb-1 line-clamp-2 h-10">
                  {product.name.slice(0, 45)}
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
                className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors mt-auto"
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</div>

<style jsx>{`
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`}</style>

      {/* Deal 3 Card Product */}
     <div className="w-full px-4">
  {/* Section Header */}
  <div className="text-center mb-5">
    <h2 className="text-4xl font-bold text-gray-900 mb-4">
      Latest Tech & Gadgets
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      Explore cutting-edge technology and innovative gadgets that redefine
      your digital lifestyle
    </p>
  </div>

  {/* Mobile: Horizontal scrollable, Desktop: Grid */}
  <div className="md:flex md:flex-wrap md:justify-center md:gap-8 overflow-x-auto md:overflow-x-visible scrollbar-hide">
    <div className="flex md:contents gap-4 md:gap-8 pb-4 md:pb-0">
      {carouselCards.map((card) => {
        const imageUrl = `https://rigsdock.com/uploads/${card?.image}`;
        return (
          <div
            key={card._id}
            className="group flex-shrink-0 w-80 md:w-80 flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
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

            {/* Content Section */}
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
</div>

<style jsx>{`
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`}</style>

      {/* Shop by Category Section */}
     <CategoryGrid></CategoryGrid>

      {/* New Arrivals Section */}
      <div className="mt-10 px-4">
       <div className="px-4">
  <div className="flex justify-between items-center">
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
    <div className="relative overflow-hidden ">
      {/* Desktop Navigation Arrows - Hidden on mobile */}
      <button
        onClick={prevNewArrivalsSlide}
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextNewArrivalsSlide}
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 -mx-2">
          {latestProducts.map((product) => (
            <div
              key={product._id}
              className={`rounded-xl p-3 flex flex-col flex-shrink-0 w-48 ${
                isDark ? "bg-gray-800" : "bg-white"
              } relative shadow-sm`}
            >
              {/* Sale Badge */}
              {product.price !== product.finalPrice && (
                <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded z-20">
                  Sale
                </span>
              )}

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(product._id);
                }}
                className="absolute top-2 right-2 z-20 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <Heart className="w-4 h-4 text-gray-700 hover:text-red-500" />
              </button>

              {/* Product Image */}
              <div className="aspect-square mb-3 overflow-hidden rounded-lg flex items-center justify-center">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `${SERVER_URL}/uploads/${product.images[0]}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow">
                <h3 className="text-sm font-semibold mb-1 line-clamp-2 h-10">
                  {product.name.slice(0, 40)}...
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
                className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors mt-auto"
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Slider - Hidden on mobile */}
      <div className="hidden md:block">
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
                <div className="flex flex-wrap justify-center gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {latestProducts
                    .slice(
                      slideIndex * itemsPerSlide,
                      (slideIndex + 1) * itemsPerSlide
                    )
                    .map((product) => (
                      <div
                        key={product._id}
                        className={`rounded-xl p-3 sm:p-4 flex flex-col h-full ${
                          isDark ? "bg-gray-800" : "bg-white"
                        } relative w-full sm:w-auto`}
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
                        <div className="aspect-square mb-3 overflow-hidden rounded-lg flex items-center justify-center p-6">
                          <img
                            src={
                              product.images && product.images.length > 0
                                ? `${SERVER_URL}/uploads/${product.images[0]}`
                                : "https://via.placeholder.com/300"
                            }
                            alt={product.name}
                            className="w-full h-full object-contain p-2 sm:p-3"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300";
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow">
                          <h3 className="text-xs sm:text-sm truncate font-semibold mb-1 line-clamp-2 h-10 sm:h-10">
                            {product.name.slice(0, 50)}
                          </h3>
                          <div className="flex text-yellow-400 text-xs sm:text-sm mb-1">
                            {renderStars(product.averageRating)}
                          </div>
                          <div className="text-xs sm:text-sm mb-3">
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
                          className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-xs sm:text-sm font-medium transition-colors mt-auto"
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
    </div>
  )}
</div>
      </div>

      {/* Our Brands Section */}
      <div className=" mb-5 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Section Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center md:mb-12 text-gray-800">
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
            animation: scroll 10s linear infinite;
          }
          
          .animate-scroll:hover {
            animation-play-state: paused;
          }

          @media (max-width: 640px) {
            .animate-scroll {
              animation: scroll 10s linear infinite;
            }
          }

          @media (max-width: 768px) {
            .animate-scroll {
              animation: scroll 5s linear infinite;
            }
          }
        `}</style>
      </div>

      {/* From Our Blog Section */}
      <section className="px-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">From Our Blog</h2>
          <button
            onClick={() => navigate("/blog")}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            View More
          </button>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white p-3 sm:p-4 rounded-lg transition-all duration-300"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-32 sm:h-40 object-cover rounded mb-3"
                />
                <p className="text-gray-500 text-xs sm:text-sm mb-1">
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3">
                  {blog.description}
                </p>
                <a
                  href="/blog"
                  className="text-blue-600 text-xs sm:text-sm font-medium hover:underline"
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
      <Footer />
    </>
  );
}

export default Home;
