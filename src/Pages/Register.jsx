import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';
import Footer from '../Components/Footer';
import Header from '../Components/Header';
function Register() {
  return (
    <>
    <Header/>
   <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <nav className="text-sm text-gray-600 text-center">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span>My account</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">My account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
          {/* Login Section */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Login</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Username or email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="login-email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                  onFocus={(e) => e.target.style.borderColor = 'rgb(10, 95, 191)'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                    style={{ '--tw-ring-color': 'rgb(10, 95, 191)' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgb(10, 95, 191)'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                     <Eye size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      accentColor: 'rgb(10, 95, 191)',
                      '--tw-ring-color': 'rgb(10, 95, 191)'
                    }}
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
              </div>
              
              <button
                type="button"
                className="w-full text-white py-3 px-6 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{ backgroundColor: 'rgb(10, 95, 191)', ':hover': { backgroundColor: 'rgb(8, 76, 153)' } }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(8, 76, 153)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(10, 95, 191)'}
              >
                Log In
              </button>
              
              <div className="text-center">
                <a href="#" className="text-sm underline transition-colors" style={{ color: 'rgb(10, 95, 191)' }}>
                  Lost your password?
                </a>
              </div>
            </div>
          </div>

          {/* Register Section */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Register</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="register-username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                  onFocus={(e) => e.target.style.borderColor = 'rgb(10, 95, 191)'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                  onFocus={(e) => e.target.style.borderColor = 'rgb(10, 95, 191)'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                    onFocus={(e) => e.target.style.borderColor = 'rgb(10, 95, 191)'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                      <Eye size={20} />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 leading-relaxed">
                Your personal data will be used to support your experience throughout this website, to 
                manage access to your account, and for other purposes described in our{' '}
                <a href="#" className="underline transition-colors" style={{ color: 'rgb(10, 95, 191)' }}>
                  privacy policy
                </a>.
              </div>
              
              <button
                type="button"
                className="w-full text-white py-3 px-6 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{ backgroundColor: 'rgb(10, 95, 191)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(8, 76, 153)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(10, 95, 191)'}
              >
                Register
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

export default Register



