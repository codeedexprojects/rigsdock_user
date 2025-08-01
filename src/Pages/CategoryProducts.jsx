import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { viewProductsAPI } from "../Services/categoryAPI";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ChatBox from "../Components/ChatBox";

function CategoryProducts() {
  const { mainCatId, catId, subCatId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await viewProductsAPI(mainCatId, catId, subCatId);
        console.log("API response", res);
        setProducts(res.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [mainCatId, catId, subCatId]);

  // Star Rating Component
  const StarRating = ({ rating = 4.2, reviews = 234 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {/* Full Stars */}
          {[...Array(fullStars)].map((_, i) => (
            <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          ))}
          {/* Half Star */}
          {hasHalfStar && (
            <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20">
              <defs>
                <linearGradient id="half">
                  <stop offset="50%" stopColor="#FBBF24"/>
                  <stop offset="50%" stopColor="#D1D5DB"/>
                </linearGradient>
              </defs>
              <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          )}
          {/* Empty Stars */}
          {[...Array(emptyStars)].map((_, i) => (
            <svg key={i} className="w-3 h-3 text-gray-300 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          ))}
        </div>
        {/* <span className="text-xs text-gray-500 ml-1">({reviews})</span> */}
      </div>
    );
  };

  return (
    <>
      <Header />
      <ChatBox />
      <div className="p-4 max-w-7xl mx-auto min-h-screen mt-40">
        {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Products</h2> */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base">
              No products available for this subcategory.
            </p>
          </div>
        ) : (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {products.map((product) => {
              // Calculate discount percentage
              const discountPercentage = product.originalPrice && product.finalPrice
                ? Math.round(((product.originalPrice - product.finalPrice) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product._id}
                  className="group relative bg-white  rounded-lg overflow-hidden "
                >
                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1">
                      {discountPercentage}% OFF
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative w-full h-36">
                    <img
                      src={`https://rigsdock.com/uploads/${product.images?.[0]}`}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    
                    {/* Star Rating */}
                    <div className="mb-2">
                      <StarRating />
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base font-bold text-blue-600">
                        ₹{product.finalPrice}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* View Details Button */}
                    <Link
                      to={`/product-details/${product._id}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CategoryProducts;