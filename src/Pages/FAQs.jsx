import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Search, Phone, Mail, MessageCircle, ShoppingCart, Truck, CreditCard, Shield, RefreshCw, Clock } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../Components/ChatBox';

function FAQs() {

  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Questions', icon: null },
    { id: 'orders', name: 'Orders & Shipping', icon: <Truck className="w-4 h-4" /> },
    { id: 'payment', name: 'Payment & Billing', icon: <CreditCard className="w-4 h-4" /> },
  ];

 const faqs = [
    {
      id: 1,
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "My Orders" section. You\'ll receive a tracking number via email once your order ships. You can also use this tracking number on our shipping partner\'s website for real-time updates.'
    },
   {
      id: 6,
      category: 'payment',
      question: 'Why was my payment declined?',
      answer: 'Payment declines can occur for various reasons: insufficient funds, incorrect card details, expired card, or your bank\'s security measures. Please verify your payment information and try again. If the issue persists, contact your bank or try an alternative payment method.'
    },

    {
      id: 8,
      category: 'returns',
      question: 'How do I initiate a return?',
      answer: 'To start a return, log into your account, go to "My Orders," select the item you want to return, and click "Return Item.Package the item securely and drop it off at any authorized shipping location.'
    },
    {
      id: 9,
      category: 'returns',
      question: 'When will I receive my refund?',
      answer: 'Refunds are processed within 3-5 business days after we receive your returned item. The refund will be credited to your original payment method. Please note that it may take additional time for the refund to appear on your statement.'
    },

    {
      id: 12,
      category: 'account',
      question: 'How do I update my account information?',
      answer: 'Log into your account and go to "Account Settings" or "Profile." Here you can update your personal information, shipping addresses, payment methods, and communication preferences. Remember to save your changes.'
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handleChat = () => {
  const phone = "919778466748";
  const msg = "Hi, I need help with my order.";
  window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
};

return (
    <>
    <Header/>
    <ChatBox/>
     <div className="min-h-screen bg-gray-50 mt-56">
      {/* Header */}
      <div className="bg-blue-800 text-white py-16 mt-5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100">Find answers to common questions about our products and services</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Search and Categories */}
          <div className="lg:w-1/3">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
              <h5 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search FAQs
              </h5>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-800 hover:text-blue-800">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h5 className="text-lg font-semibold text-blue-800 mb-4">Categories</h5>
              <div className="space-y-2">
                {faqCategories.map(category => (
                  <button
                    key={category.id}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeCategory === category.id 
                        ? 'bg-blue-800 text-white' 
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.icon}
                    <span className="ml-3">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">No results found</h4>
                  <p className="text-gray-600">Try adjusting your search terms or browse different categories.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => toggleFAQ(faq.id)}
                      >
                        <span className="font-semibold text-blue-800 pr-4">{faq.question}</span>
                        {openFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-blue-800 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-blue-800 flex-shrink-0" />
                        )}
                      </button>
                      {openFAQ === faq.id && (
                        <div className="p-4 pt-0 border-t border-gray-200">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-16">
          <div className="bg-blue-800 text-white rounded-lg p-8 md:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Still need help?</h3>
              <p className="text-xl text-blue-100 mb-8">
                Can't find what you're looking for? Our customer support team is here to help!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <Phone className="w-8 h-8 mb-4" />
                  <h6 className="text-lg font-semibold mb-2">Phone Support</h6>
                  <p className="text-blue-100 mb-1">9778466748</p>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-8 h-8 mb-4" />
                  <h6 className="text-lg font-semibold mb-2">Live Chat</h6>
                  <p className="text-blue-100 mb-3">Available 24/7</p>
                  <button onClick={handleChat} className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                    Start Chat
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <Mail className="w-8 h-8 mb-4" />
                  <h6 className="text-lg font-semibold mb-2">Email Support</h6>
                  <p className="text-blue-100 mb-1">support@rigsdock.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-blue-800 mb-3" />
              <h6 className="text-lg font-bold text-blue-800">24/7</h6>
              <p className="text-sm text-gray-600">Customer Support</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-blue-800 mb-3" />
              <h6 className="text-lg font-bold text-blue-800">100%</h6>
              <p className="text-sm text-gray-600">Secure Shopping</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-8 h-8 text-blue-800 mb-3" />
              <h6 className="text-lg font-bold text-blue-800">Free</h6>
              <p className="text-sm text-gray-600">Free Shipping Available</p>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="w-8 h-8 text-blue-800 mb-3" />
              <h6 className="text-lg font-bold text-blue-800">30 Days</h6>
              <p className="text-sm text-gray-600">Return Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default FAQs
