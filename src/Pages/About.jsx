import React, { useState } from 'react'
import Footer from '../Components/Footer';
import Header from '../Components/Header';
import { CheckSquare, MessageCircle, UserCheck } from 'lucide-react';

const tabs = [
  {
    id: "terms",
    label: "Terms & Conditions",
    content: `Terms and Conditions
Welcome to our computer equipment e-commerce website. By accessing or purchasing from our website, you agree to abide by the following terms and conditions. Please read them carefully.

1. General Terms
- You must be at least 18 years old to make a purchase.
- All products listed are subject to availability.
- We reserve the right to refuse service to anyone for any reason.

2. Orders and Payments
- Orders will be processed after payment is successfully received.
- We accept payments via Razorpay, credit/debit cards, and UPI.
- Prices are subject to change without prior notice.

3. Shipping and Delivery
- Shipping times may vary depending on location and availability.
- We are not responsible for delays caused by courier services.
- International shipping fees and customs duties are the buyer's responsibility.

4. Returns and Refunds
- Returns are accepted within 7 days of delivery, provided the product is unused and in its original packaging.
- Refunds will be processed after inspection of the returned item.
- Damaged products must be reported within 24 hours of delivery.

5. Warranty Policy
- Warranty is provided as per the manufacturer’s terms.
- Physical damage or unauthorized repairs void the warranty.
- Warranty claims must be processed through customer support.

6. User Accounts
- You are responsible for maintaining the confidentiality of your account.
- Any unauthorized access or breach should be reported immediately.
- We reserve the right to suspend or terminate accounts for fraudulent activities.

7. Limitation of Liability
- We are not responsible for indirect or consequential damages resulting from product use.
- In no case shall our liability exceed the purchase amount of the product.

8. Changes to Terms
- We reserve the right to update these terms at any time.
- It is your responsibility to review this page periodically for updates.

If you have any questions regarding these Terms and Conditions, please contact us at support@rigsdock.com.`,
  },
  {
    id: "privacy",
    label: "Privacy & Policy",
    content: `Privacy Policy
At RigsDock, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website.

1. Information We Collect
- Personal information such as name, email, phone number, and billing address when you make a purchase.
- Payment details are processed securely through third-party gateways (e.g., Razorpay).
- Technical data such as IP address, browser type, and device information.

2. How We Use Your Information
- To process orders and payments.
- To improve our website experience and customer service.
- To send promotional emails and updates (you can opt out anytime).

3. Data Security
- We implement industry-standard security measures to protect your data.
- We do not store sensitive payment details on our servers.
- While we strive for security, no method of transmission over the internet is 100% secure.

4. Sharing of Information
- We do not sell or rent your personal data to third parties.
- We may share information with trusted partners for payment processing and delivery.
- Legal compliance: We may disclose data if required by law.

5. Cookies and Tracking
- Our website uses cookies to improve user experience.
- You can disable cookies in your browser settings.
- Third-party analytics tools may collect anonymous usage data.

6. Your Rights
- You can request access, correction, or deletion of your personal data.
- You have the right to opt out of marketing communications.
- Contact us for any privacy-related concerns.

7. Changes to This Policy
- We may update this Privacy Policy from time to time.
- The latest version will always be available on our website.
- Continued use of our site implies acceptance of changes.

If you have any questions about our Privacy Policy, please contact us at support@rigsdock.com.`,
  },
  {
    id: "shipping",
    label: "Shipping Policy",
    content: `Shipping Policy
At RigsDock, we partner with **Shiprocket** to provide fast and reliable shipping services. This Shipping Policy outlines the shipping process, delivery timeframes, and associated charges.

1. Shipping Coverage
- We deliver across India using **Shiprocket** logistics partners.
- International shipping is available for select countries; additional charges apply.
- Certain remote locations may have longer delivery times.

2. Order Processing Time
- Orders are processed within **1-2 business days** after payment confirmation.
- Orders placed on weekends or holidays will be processed on the next business day.
- You will receive an email with tracking details once your order is shipped.

3. Estimated Delivery Time
- **Standard Delivery**: 5-7 business days.
- **Express Delivery**: 2-4 business days (available in select locations).
- Delivery times may vary due to unforeseen circumstances such as weather or courier delays.

4. Shipping Charges
- **Standard Shipping**: ₹50 for orders below ₹1000, free for orders above ₹1000.
- **Express Shipping**: Additional charges apply based on location.
- International shipping fees depend on destination and weight.

5. Order Tracking
- Once shipped, you will receive a **tracking link via email/SMS**.
- You can track your order on the **Shiprocket tracking page**.
- For any tracking issues, contact our support team at **support@rigsdock.com**.

6. Delays & Shipping Issues
- Delays may occur due to unforeseen reasons (weather, strikes, courier issues).
- If your order is delayed beyond the estimated timeframe, contact our support team.
- We are not responsible for lost or stolen packages once marked as delivered.

7. Contact Us
- For any shipping-related inquiries, contact us at **support@rigsdock.com**.
- Our support team is available Monday to Friday, 9 AM - 6 PM (IST).`,
  },
  {
    id: "Cancellation",
    label: "Cancellation and Refund",
    content: `Cancellation and Refund Policy
We strive to provide the best service and products to our customers. However, if you need to cancel an order or request a refund, please review our policy below.

1. Order Cancellation
- Orders can be canceled **before they are shipped**. Once shipped, cancellations are not allowed.
- To cancel an order, please contact our support team at support@rigsdock.com with your order details.
- If your cancellation request is approved, a refund will be processed within **7 business days**.

2. Refund Eligibility
- Refunds are only applicable for **defective, damaged, or wrong products**.
- To be eligible for a refund, the item must be unused and in its **original packaging**.
- Refunds will not be issued for **products damaged due to misuse, software issues, or unauthorized modifications**.

3. Return and Refund Process
- To request a return, email us at support@rigsdock.com within **7 days of receiving the product**.
- We will arrange a return pickup or guide you on how to ship the item back.
- After receiving and inspecting the returned item, the refund will be processed within **7-10 business days**.

4. Non-Refundable Items
- **Digital products, software, and licenses** are non-refundable.
- Products without original packaging or missing accessories are not eligible for refunds.
- Clearance sale items or **final sale products** cannot be refunded.

5. Refund Methods
- Refunds will be processed using the **original payment method**.
- If paid via Razorpay, the amount will be credited to the same account.
- Credit/debit card refunds may take **5-7 business days** to reflect in your bank statement.

6. Late or Missing Refunds
- If you haven’t received your refund yet, check your bank account again.
- Contact your credit card company, as refunds may take time to process.
- If you still have issues, please reach out to us at **support@rigsdock.com**.

7. Changes to This Policy
- We reserve the right to modify this policy at any time.
- Changes will be updated on this page, and it is your responsibility to review them periodically.

If you have any questions regarding our **Cancellation and Refund Policy**, please contact us at support@rigsdock.com.`,
  },
];

function About() {
      const [activeTab, setActiveTab] = useState("terms");

 const [openTab, setOpenTab] = useState("vision");

  const toggleTab = (tab) => {
    setOpenTab(openTab === tab ? null : tab);
  };

   const features = [
    {
      id: 1,
      icon: CheckSquare,
      title: "Products",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus."
    },
    {
      id: 2,
      icon: MessageCircle,
      title: "Send message",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus."
    },
    {
      id: 3,
      icon: UserCheck,
      title: "Trusted experience",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus."
    }
  ];
  

  return (
     <>
      <Header />
      <div className="max-w-7xl mx-auto mt-6 sm:mt-10 px-2 sm:px-4 mb-6 sm:mb-10">
        {/* Tab Headers - Made horizontal scrollable on mobile */}
        <div className="flex overflow-x-auto pb-2 sm:pb-0 sm:justify-center border-b border-gray-200 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors duration-200 border-b-2 ${
                activeTab === tab.id
                  ? "text-blue-800 border-b-blue-800"
                  : "text-gray-800 border-transparent hover:text-blue-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="w-full mt-3 sm:mt-4 p-4 sm:p-6 md:p-8 bg-white mb-6 sm:mb-10 text-gray-800 text-xs sm:text-sm md:text-base text-left border border-gray-300 rounded-lg">
          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <div key={tab.id} className="space-y-3 sm:space-y-4">
                {tab.content.split("\n").map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>

      <section className="bg-gray-50 py-6 sm:py-10">
        <div className="container mx-auto px-2 sm:px-4 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
          {/* Left Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
              Inspiration, innovation, <br /> and opportunities.
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Many Desktop Publishing Packages And Web Page Editors Now Use Lorem
              Ipsum As Their Default Model Text.
            </p>

            {/* Accordion */}
            <div className="space-y-3 sm:space-y-4">
              {/* Vision */}
              <div className="bg-white shadow-sm border rounded">
                <button
                  className="w-full text-left px-4 sm:px-5 py-2 sm:py-3 font-semibold text-yellow-500 text-sm sm:text-base"
                  onClick={() => toggleTab("vision")}
                >
                  ▾ Business's vision
                </button>
                {openTab === "vision" && (
                  <div className="px-4 sm:px-5 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s...
                  </div>
                )}
              </div>

              {/* Mission */}
              <div className="bg-white shadow-sm border rounded">
                <button
                  className="w-full text-left px-4 sm:px-5 py-2 sm:py-3 font-semibold text-black text-sm sm:text-base"
                  onClick={() => toggleTab("mission")}
                >
                  ▾ Our mission
                </button>
                {openTab === "mission" && (
                  <div className="px-4 sm:px-5 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, porro officia. Incidunt quaerat, sed error dicta harum iusto est minima itaque culpa in nulla, voluptatem pariatur eius quidem quibusdam nemo?
                    Praesentium, pariatur cupiditate repudiandae nisi, vero tenetur officiis dolorum nostrum corrupti consectetur ipsa voluptate minima perferendis nihil vitae? Rerum, deserunt nostrum? Iste non delectus assumenda, soluta impedit dolore obcaecati. Debitis.
                  </div>
                )}
              </div>

              {/* Support */}
              <div className="bg-white shadow-sm border rounded">
                <button
                  className="w-full text-left px-4 sm:px-5 py-2 sm:py-3 font-semibold text-black text-sm sm:text-base"
                  onClick={() => toggleTab("support")}
                >
                  ▾ Support
                </button>
                {openTab === "support" && (
                  <div className="px-4 sm:px-5 pb-3 sm:pb-4 text-gray-700 text-sm sm:text-base">
                    We offer 24/7 support to ensure smooth operation and customer
                    satisfaction at every step.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 flex justify-center mt-4 sm:mt-0">
            <img
              src="https://thumbs.dreamstime.com/b/3d-rendering-interior-room-computers-photos-wall-computer-room-lot-monitors-screens-led-backlight-ceiling-ai-generated-280967673.jpg"
              alt="About section visual"
              className="w-full max-w-md md:max-w-full rounded-lg"
            />
          </div>
        </div>
      </section>

      <div className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {features.map((feature) => (
              <div key={feature.id} className="text-center px-2 sm:px-0">
                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-800 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                  {feature.title}
                </h3>
                
                {/* Content */}
                <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                  {feature.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Footer />
    </>
  )
}

export default About