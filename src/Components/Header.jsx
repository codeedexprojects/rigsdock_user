import React, { useEffect, useState } from "react";
import {
  User,
  ShoppingCart,
  Menu,
  ChevronDown,
  Search,
  Heart,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { searchProductAPI } from "../Services/allAPIs";
import {
  viewCategoriesAPI,
  viewMainCategoriesAPI,
  viewSubCategoriesAPI,
} from "../Services/categoryAPI";
import { cartCountAPI } from "../Services/cartAPI";
import { Bell } from "lucide-react";
import { getWishlistAPI } from "../Services/wishlistAPI";
import { BsHeart } from "react-icons/bs";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  const toggleCategoryDropdown = () => {
    setCategoryOpen(!categoryOpen);
  };

  const toggleMainCategory = (mainCatId) => {
    if (activeCategory === mainCatId) {
      setActiveCategory(null);
    } else {
      fetchCategories(mainCatId);
      setActiveCategory(mainCatId);
    }
  };

  const toggleCategory = (mainCatId, catId) => {
    if (activeSubCategory === catId) {
      setActiveSubCategory(null);
    } else {
      fetchSubCategories(mainCatId, catId);
      setActiveSubCategory(catId);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await searchProductAPI(query);
      setSearchResults(response.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(
        error.response?.data?.message ||
          error.message ||
          "Failed to search products."
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await searchProductAPI(searchQuery);
      console.log("response", response);

      setSearchResults(response.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(
        error.response?.data?.message ||
          error.message ||
          "Failed to search products. Please try again."
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
  };

  const fetchMainCategories = async () => {
    try {
      const res = await viewMainCategoriesAPI();
      setMainCategories(res.mainCategories);
    } catch (error) {
      console.error("Failed to fetch main Categories", error);
    }
  };

  React.useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchCategories = async (mainCatId) => {
    if (categories[mainCatId]) return;
    try {
      const res = await viewCategoriesAPI(mainCatId);
      setCategories((prev) => ({
        ...prev,
        [mainCatId]: res,
      }));
    } catch (error) {
      console.error("Failed to fetch Categories", error);
    }
  };

  const fetchSubCategories = async (mainCatId, catId) => {
    if (subCategories[catId]) return;
    try {
      const res = await viewSubCategoriesAPI(mainCatId, catId);
      setSubCategories((prev) => ({
        ...prev,
        [catId]: res,
      }));
    } catch (error) {
      console.error("Failed to view subcategories", error);
    }
  };
  const fetchCartCount = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const res = await cartCountAPI(userId);
      setCartCount(res.cartCount || 0);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleScrollToTopRated = () => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById("top-rated-section");
      section?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleScrollToNewArrivals = () => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById("newarrival");
      section?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const wishlist = await getWishlistAPI(userId);
        setWishlistCount(wishlist?.length || 0);
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
      }
    };

    fetchWishlistCount();
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 shadow-sm border-b overflow-visible bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden">
          {/* Top Mobile Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: "rgb(10, 95, 191)" }}
          >
            {/* Left: Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/">
                <img
                  src="https://i.postimg.cc/MKZkQfTh/logo.png"
                  alt="logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Right: Search & Cart */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Search size={20} />
              </button>
              <Link to="/cart" className="relative">
                <div className="text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="px-4 py-3 bg-gray-50 relative">
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-white rounded-lg shadow-sm  border-gray-200"
              >
                <div className="flex-1 flex items-center">
                  <Search size={18} className="text-gray-400 ml-3" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 px-3 py-3 outline-none text-gray-700"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-[rgb(10,95,191)] text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
                  disabled={isSearching}
                >
                  {isSearching ? "..." : "Search"}
                </button>
              </form>

              {/* Mobile Search Results */}
              {searchQuery && (searchResults.length > 0 || searchError) && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-white  rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {isSearching && (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6  mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  )}

                  {searchError && (
                    <div className="p-4 text-center text-red-600 bg-red-50 border-b border-red-100">
                      <p className="text-sm">{searchError}</p>
                    </div>
                  )}

                  {!isSearching &&
                    !searchError &&
                    searchResults.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        <p className="text-sm">No products found</p>
                      </div>
                    )}

                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product-details/${product._id}`}
                      className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setMobileSearchOpen(false);
                      }}
                    >
                      <img
                        src={`https://rigsdock.com/uploads/${product.images?.[0]}`}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-3 border border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-sm text-blue-600 font-semibold mt-1">
                          ₹{product.finalPrice}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mobile Quick Actions - Updated Version */}
          <div className="px-4 py-3 bg-white border-b">
            <div className="flex items-center justify-center gap-4">
              {/* Home and Shop Links - Made more prominent */}
              <Link
                to="/"
                className="text-center py-2 px-4 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-center py-2 px-4 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Shop
              </Link>

              {/* Categories Button */}
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  Categories
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-600 transition-transform duration-200 ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Categories Dropdown */}
          {categoryOpen && (
            <div className="px-4 py-3 bg-gray-50 border-b">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-h-64 overflow-y-auto">
                {mainCategories.length > 0 ? (
                  mainCategories.map((mainCat) => (
                    <div
                      key={mainCat._id}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <div
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchCategories(mainCat._id);
                          setActiveCategory(
                            activeCategory === mainCat._id ? null : mainCat._id
                          );
                        }}
                      >
                        <span className="font-medium text-gray-800">
                          {mainCat.name}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-200 ${
                            activeCategory === mainCat._id ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {activeCategory === mainCat._id &&
                        categories[mainCat._id] && (
                          <div className="bg-gray-50 px-4">
                            {categories[mainCat._id].map((cat) => (
                              <div
                                key={cat._id}
                                className="border-t border-gray-200 first:border-t-0"
                              >
                                <div
                                  className="flex items-center justify-between py-2.5 hover:bg-gray-100 cursor-pointer rounded px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    fetchSubCategories(mainCat._id, cat._id);
                                    setActiveSubCategory(
                                      activeSubCategory === cat._id
                                        ? null
                                        : cat._id
                                    );
                                  }}
                                >
                                  <span className="text-sm text-gray-700">
                                    {cat.name}
                                  </span>
                                  {subCategories[cat._id]?.length > 0 && (
                                    <ChevronDown
                                      size={14}
                                      className={`text-gray-400 transition-transform duration-200 ${
                                        activeSubCategory === cat._id
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  )}
                                </div>

                                {activeSubCategory === cat._id &&
                                  subCategories[cat._id] && (
                                    <div className="bg-white ml-4 rounded border border-gray-200 mb-2">
                                      {subCategories[cat._id].map((sub) => (
                                        <Link
                                          key={sub._id}
                                          to={`/category/${mainCat._id}/${cat._id}/${sub._id}`}
                                          className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0"
                                          onClick={() => {
                                            setCategoryOpen(false);
                                            setMobileMenuOpen(false);
                                          }}
                                        >
                                          {sub.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <p className="text-sm">Loading categories...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          
        </div>

        {/* Desktop Header (unchanged) */}
        <div className="hidden lg:block">
          {/* Top Header */}
          <div
            className="relative z-10 flex items-center justify-between px-4 md:px-8 py-3 "
            style={{ backgroundColor: "rgb(10, 95, 191)" }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/">
                <img
                  src="https://i.postimg.cc/MKZkQfTh/logo.png"
                  alt="logo"
                  className="w-30 h-15"
                />
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="flex items-center rounded-full  w-2/5 bg-white relative z-30">
              <form onSubmit={handleSearch} className="flex flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 outline-none"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-2 text-gray-500"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-white  rounded-full font-semibold flex items-center gap-1"
                  style={{ backgroundColor: "rgb(10, 95, 191)" }}
                  disabled={isSearching}
                >
                  <Search size={16} /> {isSearching ? "Searching..." : "Search"}
                </button>
              </form>

              {searchQuery &&
                !isSearching &&
                (searchResults.length > 0 || searchError) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      marginTop: "8px",
                      background: "#fff",
                      border: "1px solid #ccc",
                      zIndex: 9999,
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {isSearching && (
                      <div className="p-4 text-center text-gray-500 font-medium">
                        Searching...
                      </div>
                    )}

                    {searchError && (
                      <div className="p-4 text-center text-red-600 font-medium">
                        {searchError}
                      </div>
                    )}

                    {!searchError &&
                      !isSearching &&
                      searchResults.length === 0 && (
                        <div className="p-4 text-center text-gray-500 font-medium">
                          No products found for the given search term.
                        </div>
                      )}

                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product-details/${product._id}`}
                        className="flex items-center p-4 hover:bg-gray-100 transition"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <img
                          src={`https://rigsdock.com/uploads/${product.images?.[0]}`}
                          alt={product.name}
                          className="w-14 h-14 rounded object-cover mr-4 "
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-sm text-blue-800 font-medium">
                            ₹{product.finalPrice}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-white">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <User size={16} />
                  <span>Log In</span>
                </Link>
              ) : (
               null
              )}
              <div className="h-5 w-px bg-white"></div>
              <Link
                to="/wishlist"
                className="relative text-gray-700 hover:text-pink-600"
              >
                <h6 className="text-white"><BsHeart /></h6>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-white text-black text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <div className="h-5 w-px bg-white"></div>
              <Link to="/cart">
                <div className="flex items-center gap-1 relative cursor-pointer">
                  <ShoppingCart size={18} />
                  <span className="absolute -top-2 -right-2 bg-white text-neutral-950 text-xs px-1 rounded-full">
                    {cartCount}
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Bottom Navigation */}
          <div className="flex items-center justify-between px-7 py-2 bg-white text-base text-gray-800">
            <div className="flex items-center gap-6">
              <Link to="/">
                <div className="relative">
                  <div className="flex items-center gap-2 font-semibold cursor-pointer hover:text-blue-600 transition-colors">
                    <span>All Departments</span>
                  </div>
                </div>
              </Link>
              <Link
                to="/shop"
                className="hover:text-blue-800 transition-colors"
              >
                Shop
              </Link>
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-800 transition-colors"
                  onClick={toggleCategoryDropdown}
                >
                  Categories{" "}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      categoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {categoryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    {mainCategories.length > 0 ? (
                      mainCategories.map((mainCat) => (
                        <div key={mainCat._id} className="relative group">
                          <div
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                            onClick={() => toggleMainCategory(mainCat._id)}
                          >
                            <span className="font-medium text-gray-800">
                              {mainCat.name}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`text-gray-400 transition-transform ${
                                activeCategory === mainCat._id
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>

                          {activeCategory === mainCat._id &&
                            categories[mainCat._id] && (
                              <div className="w-full bg-gray-50 border-t border-gray-100">
                                {categories[mainCat._id].length > 0 ? (
                                  categories[mainCat._id].map((cat) => (
                                    <div
                                      key={cat._id}
                                      className="relative group/sub"
                                    >
                                      <div
                                        className="flex items-center justify-between px-6 py-2.5 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                                        onClick={() =>
                                          toggleCategory(mainCat._id, cat._id)
                                        }
                                      >
                                        <span className="text-gray-700 text-sm font-medium">
                                          {cat.name}
                                        </span>
                                        {subCategories[cat._id] &&
                                          subCategories[cat._id].length > 0 && (
                                            <ChevronDown
                                              size={14}
                                              className={`text-gray-400 transition-transform ${
                                                activeSubCategory === cat._id
                                                  ? "rotate-180"
                                                  : ""
                                              }`}
                                            />
                                          )}
                                      </div>

                                      {activeSubCategory === cat._id &&
                                        subCategories[cat._id] &&
                                        subCategories[cat._id].length > 0 && (
                                          <div className="w-full bg-gray-100 pl-8">
                                            {subCategories[cat._id].map(
                                              (sub) => (
                                                <Link
                                                  key={sub._id}
                                                  to={`/category/${mainCat._id}/${cat._id}/${sub._id}`}
                                                  className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors border-b border-gray-200 last:border-b-0"
                                                  onClick={() =>
                                                    setCategoryOpen(false)
                                                  }
                                                >
                                                  {sub.name}
                                                </Link>
                                              )
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-6 py-3 text-gray-500 text-sm italic">
                                    Loading categories...
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <p className="text-sm">No categories available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:text-blue-600">
                <span onClick={handleScrollToTopRated}>Top Rated Items</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:text-blue-600">
                <span onClick={handleScrollToNewArrivals}>New Arrivals</span>
              </div>
            </div>
            <div className="flex items-center gap-4 me-4">
              <Link
                to="/seller"
                className="hover:text-blue-600 transition-colors"
              >
                Become a Seller
              </Link>
              <div className="h-4 w-px bg-gray-400"></div>
              <Link
                to="/about"
                className="hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <div className="h-4 w-px bg-gray-400"></div>
              <Link
                to="/user"
                className="hover:text-blue-600 transition-colors"
              >
                MY Account
              </Link>
              <div className="h-4 w-px bg-gray-400"></div>
              <Link
                to="/blog"
                className="hover:text-blue-600 transition-colors"
              >
                Blog
              </Link>
              <div className="h-4 w-px bg-gray-400"></div>
              <Link
                to="/faqs"
                className="hover:text-blue-600 transition-colors"
              >
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Sidebar */}
        <div
          className={`relative w-[85%] max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto`}
        >
          {/* Sidebar Header */}
          <div
            className="flex justify-between items-center p-4 border-b"
            style={{ backgroundColor: "rgb(10, 95, 191)" }}
          >
            <div className="flex items-center gap-3">
              <img
                src="https://i.postimg.cc/MKZkQfTh/logo.png"
                alt="logo"
                className="h-8 w-auto"
              />
              <h2 className="text-lg font-semibold text-white">Menu</h2>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-1 hover:bg-blue-600 rounded"
            >
              <X size={22} />
            </button>
          </div>

          {/* User Section */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="space-y-3">
              <Link
                to={isLoggedIn ? "/user" : "/login"}
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} className="text-blue-600" />
                <span className="font-medium text-gray-800">
                  {isLoggedIn ? "My Account" : "Login / Sign Up"}
                </span>
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart size={20} className="text-red-500" />
                <span className="font-medium text-gray-800">My Wishlist</span>
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingCart size={20} className="text-green-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="font-medium text-gray-800">My Cart</span>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
              Quick Links
            </div>
            <Link
              to="/seller"
              className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Become a Seller
            </Link>
            <Link
              to="/about"
              className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/faqs"
              className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
