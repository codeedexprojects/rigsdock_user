import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { viewProductsAPI } from '../Services/categoryAPI'
import Header from '../Components/Header';
import Footer from '../Components/Footer';


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

  return (
    <>
    <Header/>
      <div className="p-4 max-w-7xl mx-auto min-h-screen">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Products</h2>
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products available for this subcategory.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                {/* Product Image */}
                                <div className="relative overflow-hidden h-60">
                                    <img
                                        src={`https://rigsdock.com/uploads/${product.images?.[0]}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Quick View Button (appears on hover) */}
<div className="absolute inset-0 backdrop-blur-sm bg-white/10 group-hover:backdrop-blur-md transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Link
                                            to={`/product-details/${product._id}`}
                                            className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                        >
                                            Quick View
                                        </Link>
                                    </div>
                                </div>
                                
                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xl font-bold text-blue-600">₹{product.finalPrice}</span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                                        )}
                                    </div>
                                    
                                    {/* View Details Button (visible on mobile) */}
                                    <div className="mt-4 md:hidden">
                                        <Link
                                            to={`/product-details/${product._id}`}
                                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                               
                            </div>
                        ))}
                    </div>
                )}
            </div>
    <Footer/>
    </>
  )
}

export default CategoryProducts
