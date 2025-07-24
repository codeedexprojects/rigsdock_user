import React, { useEffect, useState } from 'react'
import { ArrowRight, ArrowDown } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { getBlogAPI } from '../Services/orderconfirm';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBox from '../Components/ChatBox';

function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedBlogs, setExpandedBlogs] = useState({})

  useEffect(()=>{
    const fetchBlogs = async ()=>{
      try{
        const result = await getBlogAPI();        
        setBlogs(result.data || []);

      }catch(error){
        toast.error(error.response.data.message)
        return error
      } finally{
        setLoading(false);
      }
    }
    fetchBlogs();
  },[])

  const toggleExpand = (blogId) => {
    setExpandedBlogs(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }))
  }

  return (
    <>
      <Header/>
      <ChatBox/>
      <div className="mt-30"></div>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-600">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-red-500">No blogs found</div>
          ) : (
            <div className="space-y-8">
              {blogs.map((blog) => (
                <div 
                  key={blog._id} 
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3">
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-64 lg:h-full object-cover"
                      />
                    </div>
                    <div className="p-6 lg:w-2/3">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                        {blog.title}
                      </h2>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 mb-6">
                        {expandedBlogs[blog._id] 
                          ? blog.description 
                          : `${blog.description.substring(0, 300)}${blog.description.length > 300 ? '...' : ''}`
                        }
                      </p>
                      {blog.description.length > 300 && (
                        <button 
                          onClick={() => toggleExpand(blog._id)}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {expandedBlogs[blog._id] ? (
                            <>
                              Show less <ArrowDown className="ml-2" size={16} />
                            </>
                          ) : (
                            <>
                              Read more <ArrowRight className="ml-2" size={16} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      <Footer/>
    </>
  )
}

export default Blog