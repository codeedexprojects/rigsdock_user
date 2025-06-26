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
// import logo from '/src/assets/RigsdockLogo.pdf'

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

  const navigate = useNavigate();

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

  return (
    <>
      <header className="relative z-40 shadow-sm border-b overflow-visible">
        {/* Top Header */}
        <div
          className="relative z-10 flex items-center justify-between px-4 md:px-8 py-4 md:py-7"
          style={{ backgroundColor: "rgb(10, 95, 191)" }}
        >
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-white p-1"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <img
                src="https://i.postimg.cc/MKZkQfTh/logo.png"
                alt="logo"
 className="w-96 h-20 md:w-60 md:h-24"
              />
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center border border-[rgb(10,95,191)] rounded-full overflow-visible w-2/5 bg-white relative z-30">
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
                className="px-4 py-2 text-white font-semibold flex items-center gap-1"
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
                        className="w-14 h-14 rounded object-cover mr-4 border"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-sm text-blue-700 font-medium">
                          ₹{product.finalPrice}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
          </div>

          {/* Mobile Search Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="text-white p-1"
            >
              <Search size={20} />
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-white">
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <User size={16} md:size={18} />
              <span className="hidden md:inline">Log In</span>
            </Link>
            <div className="hidden sm:block h-5 w-px bg-white"></div>
            <Link
              to="/wishlist"
              className="hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <Heart size={16} md:size={18} />
              <span className="hidden md:inline">Wishlist</span>
            </Link>
            <div className="hidden sm:block h-5 w-px bg-white"></div>
            <Link to="/cart">
              <div className="flex items-center gap-1 relative cursor-pointer">
                <ShoppingCart size={18} md:size={20} />
                <span className="hidden md:inline">My Cart</span>
                <span className="absolute -top-2 -right-2 bg-white text-neutral-950 text-xs px-1 rounded-full">
                  {cartCount}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 py-3 bg-white border-t relative">
            <form
              onSubmit={handleSearch}
              className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white"
            >
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 outline-none text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-2 text-gray-500"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-white font-semibold flex items-center gap-1"
                style={{ backgroundColor: "rgb(10, 95, 191)" }}
                disabled={isSearching}
              >
                <Search size={14} /> {isSearching ? "Searching..." : ""}
              </button>
            </form>

            {/* Mobile Search Results */}
            {(searchResults.length > 0 || searchError) && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto mx-4">
                {searchError && (
                  <div className="p-4 text-red-600 text-center">
                    {searchError}
                  </div>
                )}
                {searchResults.length > 0 && (
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product-details/${product._id}`}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          setMobileSearchOpen(false);
                        }}
                      >
                        <img
                          src={`https://rigsdock.com/uploads/${product.images?.[0]}`}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded mr-4"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-sm text-blue-600">
                            ₹{product.finalPrice}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Desktop Bottom Navigation */}
        <div className="hidden lg:flex items-center justify-between px-7 py-4 bg-white text-base text-gray-800">
          <div className="flex items-center gap-6">
            <Link to="/">
              <div className="relative">
                <div className="flex items-center gap-2 font-semibold cursor-pointer hover:text-blue-600 transition-colors">
                  <span>All Departments</span>
                </div>
              </div>
            </Link>
            <Link to="/shop" className="hover:text-blue-600 transition-colors">
              Shop
            </Link>
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
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
                        {/* Main Category - now clickable */}
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
                              activeCategory === mainCat._id ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {/* Categories Dropdown */}
                        {activeCategory === mainCat._id &&
                          categories[mainCat._id] && (
                            <div className="w-full bg-gray-50 border-t border-gray-100">
                              {categories[mainCat._id].length > 0 ? (
                                categories[mainCat._id].map((cat) => (
                                  <div
                                    key={cat._id}
                                    className="relative group/sub"
                                  >
                                    {/* Category - now clickable */}
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

                                    {/* Subcategories Dropdown */}
                                    {activeSubCategory === cat._id &&
                                      subCategories[cat._id] &&
                                      subCategories[cat._id].length > 0 && (
                                        <div className="w-full bg-gray-100 pl-8">
                                          {subCategories[cat._id].map((sub) => (
                                           <Link
  key={sub._id}
  to={`/category/${mainCat._id}/${cat._id}/${sub._id}`}
  className="block px-4 py-2 ..."
  onClick={() => setCategoryOpen(false)}
>
                                              <span className="text-sm text-gray-600 hover:text-blue-600">
                                                {sub.name}
                                              </span>
                                            </Link>
                                          ))}
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
            {/* Mobile Categories Dropdown - Add this for mobile version */}
            <div className="lg:hidden">
              <div
                className="relative"
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">Categories</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      categoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {categoryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    {mainCategories.length > 0 ? (
                      mainCategories.map((mainCat) => (
                        <div
                          key={mainCat._id}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          {/* Mobile Main Category */}
                          <div
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchCategories(mainCat._id);
                              setActiveCategory(
                                activeCategory === mainCat._id
                                  ? null
                                  : mainCat._id
                              );
                            }}
                          >
                            <span className="font-medium text-gray-800">
                              {mainCat.name}
                            </span>
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${
                                activeCategory === mainCat._id
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>

                          {/* Mobile Categories */}
                          {activeCategory === mainCat._id &&
                            categories[mainCat._id] && (
                              <div className="bg-gray-50 border-t border-gray-100">
                                {categories[mainCat._id].length > 0 ? (
                                  categories[mainCat._id].map((cat) => (
                                    <div
                                      key={cat._id}
                                      className="border-b border-gray-100 last:border-b-0"
                                    >
                                      <div
                                        className="flex items-center justify-between px-6 py-2.5 hover:bg-white transition-colors cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          fetchSubCategories(
                                            mainCat._id,
                                            cat._id
                                          );
                                          setActiveSubCategory(
                                            activeSubCategory === cat._id
                                              ? null
                                              : cat._id
                                          );
                                        }}
                                      >
                                        <span className="text-gray-700 text-sm">
                                          {cat.name}
                                        </span>
                                        <ChevronDown
                                          size={12}
                                          className={`transition-transform duration-200 ${
                                            activeSubCategory === cat._id
                                              ? "rotate-180"
                                              : ""
                                          }`}
                                        />
                                      </div>

                                      {/* Mobile Subcategories */}
                                      {activeSubCategory === cat._id &&
                                        subCategories[cat._id] &&
                                        subCategories[cat._id].length > 0 && (
                                          <div className="bg-white border-t border-gray-100">
                                            {subCategories[cat._id].map(
                                              (sub) => (
                                             <Link
  key={sub._id}
  to={`/category/${mainCat._id}/${cat._id}/${sub._id}`}
  className="block px-4 py-2 ..."
  onClick={() => setCategoryOpen(false)}
>
                                                  <span className="text-xs text-gray-600">
                                                    {sub.name}
                                                  </span>
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
            </div>


            <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <span onClick={handleScrollToTopRated}>Top Rated Items</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
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
            <Link to="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <div className="h-4 w-px bg-gray-400"></div>
            <Link to="/user" className="hover:text-blue-600 transition-colors">
              MY Account
            </Link>
            <div className="h-4 w-px bg-gray-400"></div>
            <Link to="/blog" className="hover:text-blue-600 transition-colors">
              Blog
            </Link>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
<div className="lg:hidden px-4 py-3 bg-white border-t">
  {/* Mobile Categories Dropdown */}
  <div className="mb-3">
    <div
      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer"
      onClick={() => setCategoryOpen(!categoryOpen)}
    >
      <span className="font-medium text-gray-800">Browse Categories</span>
      <ChevronDown
        size={16}
        className={`transition-transform duration-200 ${
          categoryOpen ? "rotate-180" : ""
        }`}
      />
    </div>

    {categoryOpen && (
      <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm">
        {mainCategories.length > 0 ? (
          mainCategories.map((mainCat) => (
            <div key={mainCat._id} className="border-b border-gray-100 last:border-b-0">
              <div
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchCategories(mainCat._id);
                  setActiveCategory(activeCategory === mainCat._id ? null : mainCat._id);
                }}
              >
                <span className="font-medium">{mainCat.name}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeCategory === mainCat._id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {activeCategory === mainCat._id && categories[mainCat._id] && (
                <div className="bg-gray-50 pl-6">
                  {categories[mainCat._id].map((cat) => (
                    <div key={cat._id} className="border-t border-gray-100">
                      <div
                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchSubCategories(mainCat._id, cat._id);
                          setActiveSubCategory(activeSubCategory === cat._id ? null : cat._id);
                        }}
                      >
                        <span className="text-sm">{cat.name}</span>
                        {subCategories[cat._id]?.length > 0 && (
                          <ChevronDown
                            size={12}
                            className={`transition-transform duration-200 ${
                              activeSubCategory === cat._id ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>

                      {activeSubCategory === cat._id && subCategories[cat._id] && (
                        <div className="bg-white pl-6">
                          {subCategories[cat._id].map((sub) => (
                            <Link
                              key={sub._id}
to={`/category/${mainCat._id}/${cat._id}/${sub._id}`}
                              className="block px-4 py-2 text-sm hover:bg-gray-100"
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
          <div className="px-4 py-3 text-center text-gray-500">
            Loading categories...
          </div>
        )}
      </div>
    )}
  </div>

  {/* Mobile Quick Links */}
  <div className="grid grid-cols-3 gap-2 text-sm">
    <Link
      to="/"
      className="text-center py-2 bg-gray-50 rounded text-gray-700 hover:bg-gray-100"
    >
      Home
    </Link>
    <Link
      to="/shop"
      className="text-center py-2 bg-gray-50 rounded text-gray-700 hover:bg-gray-100"
    >
      Shop
    </Link>
    <Link
      to="/new-arrivals"
      className="text-center py-2 bg-gray-50 rounded text-gray-700 hover:bg-gray-100"
      onClick={(e) => {
        e.preventDefault();
        handleScrollToNewArrivals();
      }}
    >
      New Arrivals
    </Link>
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
          className={`relative w-[80%] max-w-sm h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto`}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-4 border-b"
            style={{ backgroundColor: "rgb(10, 95, 191)" }}
          >
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Section */}
          <div className="p-4 border-b">
            <Link
              to="/login"
              className="flex items-center gap-3 mb-3 text-gray-700"
            >
              <User size={20} />
              <span>Log In / Sign Up</span>
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center gap-3 text-gray-700"
            >
              <Heart size={20} />
              <span>My Wishlist</span>
            </Link>
          </div>

          <div className="p-4 border-t">
            <Link to="/seller" className="block py-2 text-gray-700">
              Become a Seller
            </Link>
            <Link to="/about" className="block py-2 text-gray-700">
              About Us
            </Link>
            <Link to="/user" className="block py-2 text-gray-700">
              My Account
            </Link>
            <Link to="/blog" className="block py-2 text-gray-700">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
