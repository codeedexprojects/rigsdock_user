import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { viewMainCategoriesAPI } from '../../Services/categoryAPI';
import { viewCategoriesAPI } from '../../Services/categoryAPI';
import { viewSubCategoriesAPI } from '../../Services/categoryAPI';
import { getHomeCategoryAPI } from '../../Services/allAPIs';

export default function CategoryGrid() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [subCategoryMap, setSubCategoryMap] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [homeCategory, setHomeCategory] = useState(null);
  const SERVER_URL = "https://rigsdock.com";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const homeCategoryRes = await getHomeCategoryAPI();
        if (homeCategoryRes?.success && homeCategoryRes?.data?.length > 0) {
          setHomeCategory(homeCategoryRes.data[0]);
        }

        const mainCatRes = await viewMainCategoriesAPI();
        if (mainCatRes?.mainCategories) {
          setMainCategories(mainCatRes.mainCategories);

          const categoryPromises = mainCatRes.mainCategories.map(cat =>
            viewCategoriesAPI(cat._id)
              .then(res => ({ mainCatId: cat._id, categories: res }))
              .catch(() => ({ mainCatId: cat._id, categories: [] }))
          );

          const results = await Promise.all(categoryPromises);
          const newMap = {};
          const newSubCategoryMap = {};
          
          results.forEach(({ mainCatId, categories }) => {
            newMap[mainCatId] = categories;
            
            if (categories && categories.length > 0) {
              categories.forEach(async (category) => {
                try {
                  const subCatRes = await viewSubCategoriesAPI(mainCatId, category._id);
                  setSubCategoryMap(prev => ({
                    ...prev,
                    [`${mainCatId}_${category._id}`]: subCatRes || []
                  }));
                } catch (error) {
                  console.error(`Failed to load subcategories for ${category.name}:`, error);
                }
              });
            }
          });
          
          setCategoryMap(newMap);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    fetchAll();
  }, []);

  const handleSubCategoryClick = (mainCatId, catId, subCatId) => {
    navigate(`/category/${mainCatId}/${catId}/${subCatId}`);
  };

  const toggleDropdown = (mainCatId, categoryId) => {
    const dropdownKey = `${mainCatId}_${categoryId}`;
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownKey]: !prev[dropdownKey]
    }));
  };

  const renderCategoryDropdown = (mainCatId, category) => {
    const dropdownKey = `${mainCatId}_${category._id}`;
    const isOpen = openDropdowns[dropdownKey];
    const subcategories = subCategoryMap[dropdownKey] || [];

    return (
      <div key={category._id} className="mb-2">
        <button
          onClick={() => toggleDropdown(mainCatId, category._id)}
          className="w-full text-left flex items-center justify-between text-gray-300 text-sm hover:text-white cursor-pointer py-1 px-2 rounded hover:bg-gray-700 transition-colors"
        >
          <span>{category.name}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && subcategories.length > 0 && (
          <div className="ml-4 mt-1 space-y-1">
            {subcategories.map((subcat) => (
              <div
                key={subcat._id}
                onClick={() => handleSubCategoryClick(mainCatId, category._id, subcat._id)}
                className="text-gray-400 text-xs hover:text-white cursor-pointer py-1 px-2 rounded hover:bg-gray-600 transition-colors"
              >
                {subcat.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="text-white min-h-screen px-4 py-10">
      <h2 className="text-3xl text-black font-bold mb-10">Shop By Category</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {/* Promo Section - Now fetches from API */}
        <div className="bg-orange-500 rounded-xl p-6 flex flex-col justify-between items-center text-center min-h-[400px]">
          <div>
           
            <h3 className="text-2xl font-bold mb-4 leading-tight">
              {homeCategory?.title || 'Best Category Components Block'}
            </h3>
             <p className="text-white text-sm font-semibold mb-1">
              {homeCategory?.subtitle || '50% Discount'}
            </p>
          </div>
          <img
            src={
              homeCategory?.image 
                ? `${SERVER_URL}/uploads/${homeCategory.image}`
                : "https://source.unsplash.com/150x150/?security-camera"
            }
            alt={homeCategory?.title || "Promo"}
            className="w-70 h-70 rounded-4xl  object-contain"
          />
        </div>

        {/* First Two Main Categories */}
        {mainCategories.slice(0, 2).map((cat) => (
          <div
            key={cat._id}
            className="bg-[#1C1C1C] p-4 rounded-xl flex flex-col justify-between min-h-[400px]"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-3">{cat.name}</h4>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {categoryMap[cat._id]?.map((category) => 
                  renderCategoryDropdown(cat._id, category)
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              {/* <img
                src={`${SERVER_URL}/uploads/${cat.image}`}
                alt={cat.name}
                className="w-20 h-20 object-contain"
              /> */}
            </div>
          </div>
        ))}

        {/* Combined Card: Courses (top 50%) and Used Products (bottom 50%) */}
        <div className="bg-[#1C1C1C] rounded-xl flex flex-col min-h-[400px]">
          {/* Courses Section - Top 50% */}
          {mainCategories.length > 2 && (
            <div className="p-4 border-b border-gray-600 flex-1 flex flex-col justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-3 text-gray-500">{mainCategories[2].name}</h4>
                <p className="text-sm text-gray-400 mb-2">Coming Soon</p>
              </div>
              <div className="flex justify-center mt-2">
                {/* <img
                  src={`${SERVER_URL}/uploads/${mainCategories[2].image}`}
                  alt={mainCategories[2].name}
                  className="w-16 h-16 object-contain opacity-50"
                /> */}
              </div>
            </div>
          )}
          
          {/* Used Products Section - Bottom 50% */}
          {mainCategories.length > 3 && (
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-3 text-gray-500">{mainCategories[3].name}</h4>
                <p className="text-sm text-gray-400 mb-2">Coming Soon</p>
              </div>
              <div className="flex justify-center mt-2">
               
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}