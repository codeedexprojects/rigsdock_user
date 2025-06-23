import React, { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { getBlogAPI } from '../Services/orderconfirm';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


 function Blog() {

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <>
    <Header/>
     <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex justify-center items-center text-sm text-gray-500 mb-4">
            <span className="hover:text-gray-700 cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Blog</span>
          </nav>
          <div className="text-center text-3xl font-bold text-gray-900">BLOG</div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-600">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center text-red-500">No blogs found</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {blogs.map((blog) => (
                <div key={blog._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                      {blog.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <span>{blog.ownerrole}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 mb-6">{blog.description}</p>
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
