import { Mail, Phone } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'


function Footer() {
  return (
   <footer className="bg-gray-100 text-gray-800 mt-5">
      {/* Newsletter Section */}
      <div className="bg-[rgb(10,95,191)] text-white px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Get in Touch */}
        <div>
          <h3 className="font-semibold mb-2 border-l-4 border-[rgb(10,95,191)] pl-2">
            Get In Touch
          </h3>
          <p>LR Towers, SJRRA 104<br />S Janatha Road,Palarivattom, Kochi, Kerala</p>
         <p className="mt-2 flex items-center gap-1">
  <Phone size={12} className="inline" /> 
  9778466748
</p>
<p className="flex items-center gap-1">
  <Mail size={12} className="inline" /> 
  support@rigsdock.com
</p>
        </div>

        {/* Static Link */}
        <div>
          <h3 className="font-semibold mb-2 border-l-4 border-[rgb(10,95,191)] pl-2">
            Product
          </h3>
          <ul className="space-y-1">
            <li>PC Peripherals</li>
            <li>PC Components</li>  
          </ul>
        </div>
        {/* Information */}
        <div>
          <h3 className="font-semibold mb-2 border-l-4 border-[rgb(10,95,191)] pl-2">
            Useful Links
          </h3>
          <ul className="space-y-1">
            <Link to="/user" > <li>Your Account</li></Link>
           <Link to="/seller" > <li>Become an seller</li></Link>
          <Link to="/about" > <li>Terms&Condition</li> </Link>
            <Link to="/about" ><li>Privacy&Policy</li> </Link>
           <Link to="/faqs" ><li>FAQs</li></Link> 
            <Link to="/about" ><li>Shipping Policy</li></Link>
            <Link to="/blog" ><li>Blog</li> </Link>
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold mb-2 border-l-4 border-[rgb(10,95,191)] pl-2">
            RIGSDOCK
          </h3>
          <ul className="space-y-1">
            <li>Your one-shop online shopping Destination.</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t text-center py-4 text-sm text-gray-600">
        <p>© 2025 Copyright: Rigsdock.com</p>
       
      </div>
    </footer>
  )
}

export default Footer
