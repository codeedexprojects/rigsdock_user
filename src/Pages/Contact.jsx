import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("Form submitted:", formData);
    // Add your form submission logic here
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-500 mt-5">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <nav className="text-sm text-gray-600 text-center">
                <span>Home</span>
                <span className="mx-2">/</span>
                <span>My account</span>
                <br />
                <span className="text-black text-4xl ">CONTACT</span>
              </nav>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-white">
          {/* Main Container */}
          <div className="container mx-auto px-4 py-8 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
              {/* Map Section - Left Side */}
              {/* Map Section - Left Side */}
              <div className="order-2 lg:order-1 flex items-center">
                <div className="w-full h-[650px] lg:h-[650px] rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.8112001156933!2d76.30164217450846!3d9.992118373171369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d3ceafc36bb%3A0x4aa8b26cd014144c!2s104%2C%20S%20Janatha%20Rd%2C%20Palarivattom%2C%20Kochi%2C%20Ernakulam%2C%20Kerala%20682025!5e1!3m2!1sen!2sin!4v1749020288810!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Contact Form Section - Right Side */}
              <div className="order-1 lg:order-2">
                <div className="bg-blue-50 p-6 lg:p-8 rounded-lg shadow-lg h-fit">
                  <h2 className="text-3xl lg:text-4xl font-bold text-center text-blue-900 mb-4">
                    Get in Touch
                  </h2>

                  <p className="text-blue-700 text-center text-lg mb-8 leading-relaxed">
                    If you wish to directly reach us, please fill out the form.
                  </p>

                  <div className="space-y-6">
                    {/* Name Input */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-blue-800 font-medium mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-blue-800 font-medium mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Message Input */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-blue-800 font-medium mb-2"
                      >
                        Message(Optional)
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                        placeholder="How can we help you?"
                      />
                    </div>

                    {/* Submit Button */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;
