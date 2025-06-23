import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Moon, Sun, Heart, } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import axios from "axios";
import { BASE_URL } from "../Services/baseUrl";
import { dealOfTheDayAPI } from "../Services/allAPIs";
import { useNavigate } from "react-router-dom";
import { addToWishlistAPI } from "../Services/wishlistAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { viewCategoriesAPI, viewMainCategoriesAPI, viewSubCategoriesAPI } from "../Services/categoryAPI";





const blogPosts = [
    {
      date: "February 9, 2024",
      author: "By Editor",
      title: "How to Write a Blog Post Your Readers Will Love in 5 Steps",
      excerpt: "Why the world would end without travel coupons...."
    },
    {
      date: "February 7, 2024",
      author: "By Editor",
      title: "9 Content Marketing Trends and Ideas to Increase Traffic",
      excerpt: "Why do people think wholesale accessories are a..."
    },
    {
      date: "February 5, 2024",
      author: "By Editor",
      title: "The Ultimate Guide to Marketing Strategies to Improve Sales",
      excerpt: "Many things about electronic devices your kids don't..."
    },
    {
      date: "February 3, 2024",
      author: "By Editor",
      title: "50 Best Sales Questions to Determine Your Customer's Needs",
      excerpt: "The unconventional guide to the software applications. Why..."
    }
  ];





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
  const [timeLeft, setTimeLeft] = useState({
    days: 458,
    hours: 4,
    minutes: 46,
    seconds: 20,
  });
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
    const SERVER_URL = "https://rigsdock.com";


useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch latest products
      const latestResponse = await axios.get(`${BASE_URL}/user/product/get`);
      const sortedLatest = latestResponse.data.products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setLatestProducts(sortedLatest);

      // Fetch top rated products
      const topRatedResponse = await axios.get(`${BASE_URL}/user/product/get`);
      const sortedTopRated = topRatedResponse.data.products
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 10);
      setTopRatedProducts(sortedTopRated);

      // Fetch deal products
      const dealResponse = await axios.get(`${BASE_URL}/user/dealoftheday/get`);
      setDealProducts(dealResponse.data);

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError(err.message);
      setLoading(false);
    }
  };

  fetchProducts();
}, []);
  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    const mainRes = await viewMainCategoriesAPI();
    const mainCats = mainRes.mainCategories;
    setCategories(mainCats);

    const map = {};
    for (const mainCat of mainCats) {
      console.log("Calling viewCategoriesAPI with:", mainCat._id);
      const catRes = await viewCategoriesAPI(mainCat._id);
      console.log("viewCategoriesAPI RESPONSE:", catRes);  

      map[mainCat._id] = catRes || [];  
    }

    setCategoryMap(map);
  } catch (error) {
    console.error("Failed to fetch categories for main categories", error);
  }
};
  fetchMainAndCategories();
}, []);

  const products = [
    {
      id: 1,
      name: "Lenovo Tab M9 Tablet 4 GB RAM 64 GB",
      price: "$144 - $150",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Samsung R6 Wireless 360° Multiroom Speaker",
      price: "$189 - $199",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Phonokart USB Type C OTG Cable",
      price: "$450",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Xiaomi Redmi Note 12 Pro 5G 128 GB, 6 GB RAM",
      price: "$249 - $265",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
    },
    {
      id: 5,
      name: "Logitech M350 WHITE Optical Wireless Mouse",
      price: "$299",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
    },
    {
      id: 6,
      name: "Apple MacBook Air M2 Chip",
      price: "$1199 - $1399",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    },
    {
      id: 7,
      name: "Sony WH-1000XM4 Headphones",
      price: "$279 - $349",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    },
    {
      id: 8,
      name: "iPad Pro 12.9-inch Wi-Fi 128GB",
      price: "$999 - $1099",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop",
    },
    {
      id: 9,
      name: "Dell XPS 13 Laptop",
      price: "$899 - $1199",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
    },
    {
      id: 10,
      name: "Samsung Galaxy Watch 5",
      price: "$249 - $299",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    },
  ];

  const deals = [
    {
      id: 1,
      badge: "Flat Deal",
      title: "Around Deals",
      subtitle: "Laptops",
      description: "11th Generation System",
      image:
        "https://img.freepik.com/premium-photo/headphones-joystick-computer-keyboard-black-table_93675-157726.jpg",
      alt: "Laptop with cosmic background",
    },
    {
      id: 2,
      badge: "Flat Deal",
      title: "Silver Wireless",
      subtitle: "EarPods",
      description: "Clean Enjoy Sounds!",
      image:
        "https://img.freepik.com/premium-photo/headphones-joystick-computer-keyboard-black-table_93675-157726.jpg",
      alt: "Silver wireless earbuds",
    },
    {
      id: 3,
      badge: "Flat Deal",
      title: "Smart Home's",
      subtitle: "Echo Dot",
      description: "Smart Security System",
      image:
        "https://img.freepik.com/premium-photo/headphones-joystick-computer-keyboard-black-table_93675-157726.jpg",
      alt: "Amazon Echo Dot smart speaker",
    },
  ];
  // Get items per slide based on screen size
 const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 5; // xl
      if (window.innerWidth >= 1024) return 4; // lg
      if (window.innerWidth >= 768) return 3; // md
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

  const totalSlides = Math.ceil(products.length / itemsPerSlide);
  const maxIndex = totalSlides - 1;

  const nextDealSlide = () => {
    setDealCurrentIndex(prev => 
      prev >= Math.ceil(dealProducts.length / 1) - 1 ? 0 : prev + 1
    );
  };

  const prevDealSlide = () => {
    setDealCurrentIndex(prev => 
      prev <= 0 ? Math.ceil(dealProducts.length / 1) - 1 : prev - 1
    );
  };

  const nextOnSaleSlide = () => {
    setOnSaleCurrentIndex(prev => 
      prev >= Math.ceil(latestProducts.length / itemsPerSlide) - 1 ? 0 : prev + 1
    );
  };

  const prevOnSaleSlide = () => {
    setOnSaleCurrentIndex(prev => 
      prev <= 0 ? Math.ceil(latestProducts.length / itemsPerSlide) - 1 : prev - 1
    );
  };

  const nextTopRatedSlide = () => {
    setTopRatedCurrentIndex(prev => 
      prev >= Math.ceil(topRatedProducts.length / itemsPerSlide) - 1 ? 0 : prev + 1
    );
  };

  const prevTopRatedSlide = () => {
    setTopRatedCurrentIndex(prev => 
      prev <= 0 ? Math.ceil(topRatedProducts.length / itemsPerSlide) - 1 : prev - 1
    );
  };

  const nextNewArrivalsSlide = () => {
    setNewArrivalsCurrentIndex(prev => 
      prev >= Math.ceil(latestProducts.length / itemsPerSlide) - 1 ? 0 : prev + 1
    );
  };

  const prevNewArrivalsSlide = () => {
    setNewArrivalsCurrentIndex(prev => 
      prev <= 0 ? Math.ceil(latestProducts.length / itemsPerSlide) - 1 : prev - 1
    );
  };

  const blogs = [
  {
    id: 1,
    date: "February 9, 2024",
    author: "Editor",
    title: "How to Write a Blog Post Your Readers Will Love in 5 Steps",
    description: "Why the world would end without travel coupons....",
    image: "https://cdn.pixabay.com/photo/2015/09/04/23/28/wordpress-923188_1280.jpg",
  },
  {
    id: 2,
    date: "February 7, 2024",
    author: "Editor",
    title: "9 Content Marketing Trends and Ideas to Increase Traffic",
    description: "Why do people think wholesale accessories are a....",
    image: "https://th.bing.com/th/id/OIP.EsjoJOrbfiLHQ5GZA4EbXwAAAA?rs=1&pid=ImgDetMain",
  },
  {
    id: 3,
    date: "February 5, 2024",
    author: "Editor",
    title: "The Ultimate Guide to Marketing Strategies to Improve Sales",
    description: "Many things about electronic devices your kids don't....",
    image: "https://images.pexels.com/photos/8357683/pexels-photo-8357683.jpeg?cs=srgb&dl=pexels-ron-lach-8357683.jpg&fm=jpg",
  },
  {
    id: 4,
    date: "February 3, 2024",
    author: "Editor",
    title: "50 Best Sales Questions to Determine Your Customer's Needs",
    description: "The unconventional guide to the software applications....",
    image: "https://images.pexels.com/photos/3601081/pexels-photo-3601081.jpeg?cs=srgb&dl=pexels-suzyhazelwood-3601081.jpg&fm=jpg",
  },
]

// Update the handleCategoryClick function in Home.jsx
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
    console.log("Subcategories response:", res);
    setSubCategoryMap((prev) => ({
      ...prev,
      [catId]: Array.isArray(res.subcategories) ? res.subcategories : res,
    }));
  } catch (err) {
    console.error("Error fetching subcategories:", err);
  }
};
const toggleMainCategory = (mainCatId) => {
  setExpandedMainCat(prev => {
    // If clicking the already expanded category, collapse it
    if (prev === mainCatId) {
      return null;
    }
    // Otherwise, expand the clicked category
    return mainCatId;
  });
  
  // Load categories if not already loaded
  if (!categoryMap[mainCatId]) {
    fetchCategoriesForMain(mainCatId);
  }
};


const fetchCategoriesForMain = async (mainCatId) => {
  try {
    const res = await viewCategoriesAPI(mainCatId);
    setCategoryMap(prev => ({
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


  const brands = [
    {
      id: 1,
      name: "Samsung",
      image: "https://blog.logomaster.ai/hs-fs/hubfs/samsung-logo-cover.jpg?width=2016&height=1344&name=samsung-logo-cover.jpg"
    },
    {
      id: 2,
      name: "BOSS",
      image: "https://th.bing.com/th/id/R.9931d3f39fbdb9b938662d63c51ceab0?rik=1JdVvDOkdHGDpA&riu=http%3a%2f%2fcdn.wallpapersafari.com%2f80%2f15%2fX8QGrT.jpg&ehk=8YN3Dwd8apZsZ0fkwn37DCKnNAngs9lniLlKKF4eT8E%3d&risl=&pid=ImgRaw&r=0"
    },
    {
      id: 3,
      name: "Dell",
      image: "https://static.vecteezy.com/system/resources/previews/021/514/963/non_2x/dell-brand-logo-computer-symbol-black-design-usa-laptop-illustration-free-vector.jpg"
    },
    {
      id: 4,
      name: "ASUS",
      image: "https://logos-world.net/wp-content/uploads/2020/07/Asus-Logo.png"
    },
    {
      id: 5,
      name: "JBL",
      image: "https://cdn.simplycodes.com/images/logo/jblcom.jpg?preset=share_3:2"
    },
    {
      id: 6,
      name: "Samsung",
      image: "https://blog.logomaster.ai/hs-fs/hubfs/samsung-logo-cover.jpg?width=2016&height=1344&name=samsung-logo-cover.jpg"
    },
    {
      id: 7,
      name: "Apple",
      image: "https://th.bing.com/th/id/OIP.31wjH95quHzwuakOGYdmDAHaEK?w=328&h=184&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
    }
  ];

  const duplicatedBrands = [...brands, ...brands];



    const navigateToProduct = (productId) => {
  navigate(`/product-details/${productId}`) 
    
  };
  

  return (
    <>
      <Header />
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center mt-5">
        Your Gadget Sale Zone Starts Here!
      </h2>
      <div className="w-full px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* iPad Pro Max Card - Wide */}
          <div
            className="flex-[2] rounded-2xl overflow-hidden min-h-[400px] flex flex-col justify-between p-6 lg:p-8  text-white"
            style={{
              backgroundImage:
                "url('https://mattj.io/images/posts/2021-02-27_-_keyboard.gif')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className=" p-4 rounded-xl ">
              <div className="text-sm mb-2">Flat Online Deal</div>
              <h2 className="text-4xl font-light mb-1">Apple Kit's</h2>
              <h3 className="text-4xl font-light mb-4">Ipad Pro Max</h3>
              <div className="text-3xl font-semibold mb-6">
                Only <span className="text-white">$225.00</span>
              </div>
              <button className="bg-blue-800 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Shop Now
              </button>
            </div>
          </div>

          {/* Wireless Earbuds */}
          <div
            className="flex-1 rounded-2xl overflow-hidden  min-h-[400px] flex flex-col justify-end p-6 lg:p-8 bg-black text-white"
            style={{
              backgroundImage:
                "url('https://png.pngtree.com/thumb_back/fw800/background/20230704/pngtree-office-essentials-technology-and-gadgets-illustration-featuring-laptop-printer-camera-tablet-image_3748458.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black/50 p-4 rounded-xl ">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                Battery Life
              </h2>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Truly Wireless
              </h3>
              <div className="text-sm font-medium">
                4GB RAM | 64GB ROM | 20MP
              </div>
            </div>
          </div>

          {/* Smart TV */}
          <div
            className="flex-1 rounded-2xl overflow-hidden min-h-[400px] flex flex-col justify-end p-6 lg:p-8 bg-black text-white"
            style={{
              backgroundImage:
                "url('https://giffiles.alphacoders.com/296/2964.gif')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black/50 p-4 rounded-xl ">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                For 4K Ultra
              </h2>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                RGB Backlight
              </h3>
              <div className="text-sm text-white/90">Safe & Enjoy Life !!</div>
            </div>
          </div>
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
      Weekly Deal Offer
    </h2>

    {loading ? (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : error ? (
      <div className="text-center py-4 text-red-500 text-sm">
        Failed to load deals
      </div>
    ) : dealProducts.length > 0 ? (
      <div className="relative">
        {/* Deal Products Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
 style={{ transform: `translateX(-${dealCurrentIndex * 100}%)` }} >
             {dealProducts.map((deal) => (
              <div key={deal._id} className="w-full flex-shrink-0 px-2">
                <div className="text-center mb-6">
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
                      {Math.round(((deal.product.price - deal.offerPrice) / deal.product.price) * 100)}%
                    </span>
                  </div>

                  <img
                    src={
                      deal.product.images && deal.product.images.length > 0
                        ? `${SERVER_URL}/uploads/${deal.product.images[0]}`
                        : "https://via.placeholder.com/300"
                    }
                    alt={deal.product.name}
                    className="w-48 h-48 mx-auto rounded-lg object-cover mb-4"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {deal.product.name}
                  </h3>

                  <div className="flex justify-center mb-2">
                    {renderStars(5)}
                  </div>

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
                      <div className="text-xs text-gray-500">DAYS</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">
                        {String(timeLeft.hours).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500">HRS</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">
                        {String(timeLeft.minutes).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500">MIN</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500">SEC</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigateToProduct(deal.product._id)}
                  className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Shop Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {dealProducts.length > 1 && (
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
        No deals available
      </div>
    )}
  </div>
</div>

            {/* Main Products Section */}
<div className="px-4 py-4">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">On Sale Products</h2>
    <div className="flex gap-2">
      <button
        onClick={prevOnSaleSlide}
        className={`p-2 rounded-full ${
          isDark
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-white hover:bg-gray-100"
        } shadow-md transition-colors`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextOnSaleSlide}
        className={`p-2 rounded-full ${
          isDark
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-white hover:bg-gray-100"
        } shadow-md transition-colors`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </div>

  {/* Products Slider */}
  {loading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : error ? (
    <div className="text-center py-10 text-red-500">
      {error}
    </div>
  ) : (
    <div className="relative overflow-hidden mb-8">
      <div className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${onSaleCurrentIndex * 100}%)` }}>
        {Array.from({ length: Math.ceil(latestProducts.length / itemsPerSlide) }, (_, slideIndex) => (
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
                          e.target.src = "https://via.placeholder.com/300";
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
        ))}
      </div>
    </div>
  )}

  {/* Image Cards Section - Now positioned after the products */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Card 1 - Gaming Setup */}
    <div className="relative group h-64 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      <div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
      
      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-4">
            50% OFF
          </span>
          <h3 className="text-white text-2xl font-bold mb-2">
            Gaming Setup
          </h3>
          <p className="text-white/90 text-sm">
            Complete your gaming experience with our premium collection
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white/80 text-sm line-through">$299.99</span>
            <span className="text-white text-xl font-bold ml-2">$149.99</span>
          </div>
          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
            Shop Now
          </button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-8 right-8 w-8 h-8 bg-yellow-400/30 rounded-full blur-lg" />
    </div>

    {/* Card 2 - Mobile Accessories */}
    <div className="relative group h-64 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      <div
        className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&h=400&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
      
      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <span className="inline-block bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-4">
            NEW ARRIVAL
          </span>
          <h3 className="text-white text-2xl font-bold mb-2">
            Mobile Accessories
          </h3>
          <p className="text-white/90 text-sm">
            Latest accessories for your smartphone and tablet needs
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white/80 text-sm">Starting from</span>
            <span className="text-white text-xl font-bold ml-2">$29.99</span>
          </div>
          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
            Explore
          </button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-12 right-12 w-6 h-6 bg-green-400/30 rounded-full blur-lg" />
    </div>
  </div>
</div>
          </div>
        </div>
      </div>


      {/* Top Rated Section */}
    <div className="px-4 py-4">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold" id="top-rated-section">Top Rated Item's</h2>
    <div className="flex gap-2">
      <button
        onClick={prevTopRatedSlide}
        className={`p-2 rounded-full ${
          isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"
        } shadow-md transition-colors`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextTopRatedSlide}
        className={`p-2 rounded-full ${
          isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"
        } shadow-md transition-colors`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </div>

  {loading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : error ? (
    <div className="text-center py-10 text-red-500">{error}</div>
  ) : (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${topRatedCurrentIndex * 100}%)` }}>
        {Array.from({ length: Math.ceil(topRatedProducts.length / itemsPerSlide) }, (_, slideIndex) => (
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
        e.target.src = "https://via.placeholder.com/300";
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
        ))}
      </div>
    </div>
  )}
</div>

      <div className="w-full px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="relative group h-72 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
            >
              {/* Background Image */}
              <img
                src={deal.image}
                alt={deal.alt}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0  bg-opacity-40 z-10 group-hover:bg-opacity-50 transition duration-300"></div>

              {/* Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-yellow-400  text-xs font-semibold px-3 py-1 rounded-full">
                  {deal.badge}
                </span>
              </div>

              {/* Text Content */}
              <div className="relative z-20 p-6 h-full flex flex-col justify-end">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
                  {deal.title}
                </h3>
                <h4 className="text-white text-lg md:text-xl font-semibold mb-1">
                  {deal.subtitle}
                </h4>
                <p className="text-white text-sm">{deal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* shop by category section */}

<section className="bg-white py-14 px-6 md:px-10">
  <div className="max-w-none">
    <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories?.map((mainCat) => {
          const isExpanded = expandedMainCat === mainCat._id;
          const mainCatCategories = categoryMap[mainCat._id] || [];
          
          const isDisabled = ['used products', 'courses'].includes(
            mainCat.name?.trim().toLowerCase()
          );

          return (
            <div
              key={mainCat._id}
              className={`border rounded-xl p-6 w-full bg-white shadow-md hover:shadow-lg transition-all ${
                isExpanded ? "ring-2 ring-blue-500" : ""
              } ${
                isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => !isDisabled && toggleMainCategory(mainCat._id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    {mainCat.name}
                    {isDisabled && (
                      <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">{mainCat.description}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <img
                    src={`${SERVER_URL}/uploads/${mainCat.image}`}
                    alt={mainCat.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100";
                    }}
                  />
                </div>
              </div>

              {isExpanded && !isDisabled && (
                <div className="mt-4 border-t pt-4">
                  {mainCatCategories.length > 0 ? (
                    <>
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">
                        Categories under {mainCat.name}:
                      </h5>
                      <div className="grid grid-cols-2 gap-3">
                        {mainCatCategories.map((cat) => {
                          const subcategories = subCategoryMap[cat._id] || [];
                          return (
                            <div key={cat._id} className="space-y-2">
                              <div
                                className={`px-3 py-2 rounded hover:bg-gray-200 transition font-medium ${
                                  subcategories.length > 0 ? 'bg-gray-100 cursor-pointer' : 'bg-gray-50'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCategoryClick(mainCat._id, cat._id);
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <span>{cat.name}</span>
                                  {subcategories.length > 0 && (
                                    <span className="text-xs text-gray-500">▲</span>
                                  )}
                                </div>
                              </div>

                              {subCategoryMap[cat._id]?.length > 0 && (
                                <ul className="mt-2 ml-3 pl-3 border-l border-gray-300 text-sm space-y-1">
                                  {subcategories.map((sub) => (
                                    <li
                                      key={sub._id}
                                      className="bg-white px-3 py-1 rounded shadow-sm border text-gray-700 hover:bg-gray-50"
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
                    <div className="text-center text-gray-500 py-2">
                      No subcategories available
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right: Promo Button Block */}
<div className="border border-black rounded-lg relative min-h-[300px] max-h-[300px] overflow-hidden group">
  <img 
    src="https://th.bing.com/th/id/OIP.hazIISjrgxkwQfBs38lxZgHaEK?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3" 
    alt="Special Promotion"
    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    onError={(e) => {
      e.target.src = "https://via.placeholder.com/300x180?text=Promotion+Image";
      e.target.className = "w-full h-full object-contain";
    }}
  />
  <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center p-4">
    <h3 className="text-white text-xl font-bold mb-2">Special Offer</h3>
    <p className="text-white/90 text-sm mb-4">Limited time only</p>
   
  </div>
</div>
    </div>
  </div>
</section>


     <div className="mt-10 px-4 py-4">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold " id="newarrival">New Arrivals</h2>
    <div className="flex gap-2">
      <button
        onClick={prevNewArrivalsSlide}
        className={`p-2 rounded-full ${
          isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"
        } shadow-md transition-colors`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextNewArrivalsSlide}
        className={`p-2 rounded-full ${
          isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"
        } shadow-md transition-colors`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </div>

  {loading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : error ? (
    <div className="text-center py-10 text-red-500">{error}</div>
  ) : (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500 ease-in-out"
       style={{ transform: `translateX(-${newArrivalsCurrentIndex * 100}%)` }}>
        {Array.from({length: Math.ceil(latestProducts.length / itemsPerSlide) }, (_, slideIndex) => (
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
        e.target.src = "https://via.placeholder.com/300";
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
        ))}
      </div>
    </div>
  )}

<div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      {/* Section Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">
        Brands
      </h2>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        {/* Sliding Container */}
        <div className="flex animate-scroll">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex-shrink-0 mx-2 sm:mx-3 md:mx-4 bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28 lg:w-52 lg:h-32"
            >
              <div className="flex items-center justify-center h-full p-3 sm:p-4 md:p-6">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-8 sm:max-h-10 md:max-h-12 lg:max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for animation */}
      <style jsx>{`
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
      <h2 className="text-2xl font-semibold mb-6">From Our Blog</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-gray-50 p-4 rounded-md shadow-md transition-transform transform hover:-translate-y-1"
          >
            <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover mb-4 rounded" />
            <p className="text-gray-500 text-sm mb-1">
              {blog.date} &nbsp;•&nbsp; By {blog.author}
            </p>
            <h3 className="text-lg font-semibold mb-2">
              {blog.title}
            </h3>
            <p className="text-gray-500 mb-4">
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
    </section>
          <ToastContainer position="top-right" autoClose={3000} />
  
</div>
      <Footer />
    </>
  );
}

export default Home;
