import React from 'react'
import { ArrowRight } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function Blog() {
  return (
    <>
    <Header/>
     <div className="bg-white border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                {/* Breadcrumb */}
                <nav className="flex justify-center items-center text-sm text-gray-500 mb-4">
                  <span className="hover:text-gray-700 cursor-pointer">Home</span>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-medium">blog</span>
                </nav>
    
                {/* Page Title */}
                <div className="relative flex items-center justify-center">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
                    BLOG
                  </h1>
    
                 
                </div>
              </div>
            </div>
   <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* First Blog Post */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Blog post"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    BUSINESS
                  </span>
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    MARKETING
                  </span>
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    SOCIAL MEDIA
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                How to Write a Blog Post Your Readers Will Love in 5 Steps
              </h2>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>By Editor</span>
                <span className="mx-2">•</span>
                <span>February 9, 2024</span>
              </div>
              
              <p className="text-gray-700 mb-6">
                Why the world would end without travel coupons. The 16 worst songs about spa deals. How daily me person. The 11 worst business software in history. Why latest electronic gadgets will make you question everything. The evolution of cool science experiments. 16 facts about cool tech gadgets that will impress you up at night. How carnival...
              </p>
              
              <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group">
                READ MORE
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Second Blog Post */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Blog post"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    BUSINESS
                  </span>
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    INFORMATION
                  </span>
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    PROMOTIONS
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
6 Simple Ways To Boost Your Ecommerce Conversion Rate              </h2>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>By Editor</span>
                <span className="mx-2">•</span>
                <span>February 7, 2024</span>
              </div>
              
              <p className="text-gray-700 mb-6">
                Why do people think wholesale accessories are a good idea? Unbelievable cool tech gadget success stories. How cool tech gadgets can help you predict the future. The 10 best passport application twitter feeds to follow. 9 uses for business software. The unconventional guide to wholesale accessories. How to be unpopular in the science article world....
              </p>
              
              <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group">
                READ MORE
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img 
                src="https://www.freshbooks.com/blog/wp-content/uploads/2020/11/accountant-marketing.jpg" 
                alt="Blog post"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    BUSINESS
                  </span>
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    INFORMATION
                  </span>
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    PROMOTIONS
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                The Ultimate Guide to Marketing Strategies to Improve Sales
              </h2>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>By Editor</span>
                <span className="mx-2">•</span>
                <span>February 7, 2024</span>
              </div>
              
              <p className="text-gray-700 mb-6">
                Why do people think wholesale accessories are a good idea? Unbelievable cool tech gadget success stories. How cool tech gadgets can help you predict the future. The 10 best passport application twitter feeds to follow. 9 uses for business software. The unconventional guide to wholesale accessories. How to be unpopular in the science article world....
              </p>
              
              <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group">
                READ MORE
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/8357683/pexels-photo-8357683.jpeg?cs=srgb&dl=pexels-ron-lach-8357683.jpg&fm=jpg" 
                alt="Blog post"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    BUSINESS
                  </span>
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    INFORMATION
                  </span>
                  <span className="bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                    PROMOTIONS
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                9 Content Marketing Trends and Ideas to Increase Traffic
              </h2>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>By Editor</span>
                <span className="mx-2">•</span>
                <span>February 7, 2024</span>
              </div>
              
              <p className="text-gray-700 mb-6">
                Why do people think wholesale accessories are a good idea? Unbelievable cool tech gadget success stories. How cool tech gadgets can help you predict the future. The 10 best passport application twitter feeds to follow. 9 uses for business software. The unconventional guide to wholesale accessories. How to be unpopular in the science article world....
              </p>
              
              <button className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group">
                READ MORE
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default Blog
