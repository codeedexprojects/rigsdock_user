import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { viewProductsAPI } from '../Services/categoryAPI'

function CategoryProducts() {

    const { mainCatId, catId, subCatId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await viewProductsAPI(mainCatId, catId, subCatId);
        setProducts(res.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [mainCatId, catId, subCatId]);


  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      {products.length === 0 ? (
        <p>No products available for this subcategory.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-3 rounded shadow">
              <img
                src={`https://rigsdock.com/uploads/${product.images?.[0]}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-blue-600 font-medium">₹{product.finalPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryProducts
