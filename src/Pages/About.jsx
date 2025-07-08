import React, { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

const tabs = [
  { id: "terms", label: "TERMS & CONDITIONS" },
  { id: "privacy", label: "RETURN & REFUND POLICY" },
  { id: "Cancellation", label: "CONTACT INFORMATION" },
];

function About() {
  const [activeTab, setActiveTab] = useState("terms");

  const [openTab, setOpenTab] = useState("vision");

  const toggleTab = (tab) => {
    setOpenTab(openTab === tab ? null : tab);
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto mt-5 sm:mt-10 px-2 sm:px-4 mb-6 sm:mb-10">
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
          {activeTab === "terms" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">
                DOA HANDLING PROCEDURES AND PROCESS
              </h2>

              <h3 className="font-semibold text-gray-900">1. PURPOSE</h3>
              <p>
                This document outlines the procedure for handling products
                identified as Dead on Arrival (DOA) at Rigsdock. The aim is to
                ensure a swift, fair, and efficient resolution for customers who
                receive non-functional or physically damaged products upon
                delivery, minimizing inconvenience and maintaining customer
                satisfaction.
              </p>

              <h3 className="font-semibold text-gray-900">
                2. DEFINITION OF DOA
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Non-functional:</strong> The product fails to power
                  on, operate as intended, or exhibits critical malfunctions
                  immediately upon first use after delivery.
                </li>
                <li>
                  <strong>Physically Damaged:</strong> The product shows clear
                  signs of physical damage (e.g., cracks, dents, broken
                  components) that occurred during transit or before unboxing,
                  rendering it unusable or compromised.
                </li>
              </ul>

              <h3 className="font-semibold text-gray-900">
                3. SCOPE AND APPLICABILITY
              </h3>
              <p>
                This procedure applies to all hardware and peripheral products
                sold on Rigsdock. It does not apply to software or personalized
                items unless the issue is related to an invalid license key for
                software, as per the general Return & Refund Policy.
              </p>

              <h3 className="font-semibold text-gray-900">
                4. CUSTOMER DOA REPORTING PROCESS
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  Immediate Reporting: The customer must report a DOA product
                  within 48 hours of product delivery. Reports made after this
                  window may be subject to standard warranty claims rather than
                  DOA procedures.
                </li>
                <li>
                  Initiate Return Request via "My Orders" on rigsdock.com and
                  click "Request Return".
                </li>
                <li>
                  Provide Evidence: Upload clear photos or a short video
                  demonstrating the issue.
                </li>
                <li>
                  Contact Channels:
                  <ul className="list-disc pl-6">
                    <li>Email: returns@rigsdock.com</li>
                    <li>Phone (India): +91 9778466748</li>
                    <li>Live Chat: 9 AM – 9 PM IST</li>
                  </ul>
                </li>
              </ul>

              <h3 className="font-semibold text-gray-900">
                5. RIGSDOCK INTERNAL DOA VERIFICATION PROCESS
              </h3>
              <h4 className="font-semibold">5.1. Initial Assessment</h4>
              <p>
                Customer support reviews evidence and determines DOA status. If
                unclear, it moves to 5.2.
              </p>
              <h4 className="font-semibold">5.2. Technical Verification</h4>
              <p>
                Technician may visit the customer’s location to diagnose and
                report the product condition.
              </p>
              <h4 className="font-semibold">
                5.3. DOA Confirmation and Resolution
              </h4>
              <ul className="list-disc pl-6">
                <li>
                  If DOA confirmed: Replacement or refund within 24 hours.
                </li>
                <li>
                  If No Defect: Rs. 500 technician fee applied, and product
                  returned or processed as remorse return.
                </li>
              </ul>

              <h3 className="font-semibold text-gray-900">
                6. LOGISTICS FOR DOA PRODUCTS
              </h3>
              <ul className="list-disc pl-6">
                <li>Pickup arranged by Rigsdock at no cost.</li>
                <li>
                  Customer must pack item securely with all accessories and
                  manuals.
                </li>
                <li>No additional damage/tampering should be present.</li>
              </ul>

              <h3 className="font-semibold text-gray-900">
                7. REFUND TIMELINES (If applicable for DOA)
              </h3>
              <table className="w-full text-sm border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Payment Method</th>
                    <th className="p-2 border">Refund Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">UPI (PhonePe, GPay)</td>
                    <td className="p-2 border">Up to 2 working days</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">Credit/Debit Card</td>
                    <td className="p-2 border">Up to 5 working days</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">Rigsdock Wallet Credit</td>
                    <td className="p-2 border">Within 4 hours</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">COD Orders (via NEFT)</td>
                    <td className="p-2 border">Up to 7 working days</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="font-semibold text-gray-900">
                8. DOCUMENTATION AND RECORD-KEEPING
              </h3>
              <p>
                All DOA reports, technician reports, communication logs, and
                resolution data must be documented for audit and quality control
                purposes.
              </p>
            </div>
          )}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                1. SCOPE AND APPLICABILITY
              </h3>
              <p>
                This policy applies to all hardware and peripheral products sold
                on Rigsdock...
              </p>

              <h3 className="font-semibold text-gray-900">2. DEFINITIONS</h3>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Returnable Product</strong>: Eligible under policy
                </li>
                <li>
                  <strong>DOA</strong>: Dead on Arrival (non-functional/damaged)
                </li>
                <li>
                  <strong>Remorse Return</strong>: Customer-initiated without
                  defect
                </li>
                <li>
                  <strong>Restocking Fee</strong>: Cost to inspect/repack
                </li>
              </ul>

              <h3 className="font-semibold text-gray-900">
                3. RETURN WINDOWS & ELIGIBLE ACTIONS
              </h3>
              <table className="w-full text-sm border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Product Category</th>
                    <th className="p-2 border">Return Window</th>
                    <th className="p-2 border">Return Type</th>
                    <th className="p-2 border">Return Shipping</th>
                    <th className="p-2 border">Restocking Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">PC Components</td>
                    <td className="p-2 border">7 days</td>
                    <td className="p-2 border">Replacement if defective</td>
                    <td className="p-2 border">Customer pays</td>
                    <td className="p-2 border">5%</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      Custom-Built PCs (e.g., NSG Edition)
                    </td>
                    <td className="p-2 border"> Not returnable</td>
                    <td className="p-2 border">
                      Replacement only (if defective)
                    </td>
                    <td className="p-2 border">N/A</td>
                    <td className="p-2 border">N/A</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      {" "}
                      Pre-built PCs & Laptops (Premium Brands)
                    </td>
                    <td className="p-2 border">7 days</td>
                    <td className="p-2 border">Replacement if defective</td>
                    <td className="p-2 border">
                      {" "}
                      Rigsdock pays (for defect only)
                    </td>
                    <td className="p-2 border">N/A</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      {" "}
                      Monitors, UPS, Cabinets, Power Supplies
                    </td>
                    <td className="p-2 border">7 days</td>
                    <td className="p-2 border">Replacement if defective</td>
                    <td className="p-2 border">Customer pays</td>
                    <td className="p-2 border">5%</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      {" "}
                      Consumables (thermal paste, pads, cleaners, etc.)
                    </td>
                    <td className="p-2 border">3 days</td>
                    <td className="p-2 border">Replacement if defective</td>
                    <td className="p-2 border">Customer pays</td>
                    <td className="p-2 border">10%</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      {" "}
                      Cables, Adapters, Small Accessories
                    </td>
                    <td className="p-2 border">3 days</td>
                    <td className="p-2 border">Replacement if defective</td>
                    <td className="p-2 border">Customer pays</td>
                    <td className="p-2 border">5%</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      {" "}
                      Software Licenses & Activation Keys
                    </td>
                    <td className="p-2 border">Not returnable</td>
                    <td className="p-2 border"> Only if key is invalid</td>
                    <td className="p-2 border">N/A</td>
                    <td className="p-2 border">N/A</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="font-semibold text-gray-900">
                4. CONDITION REQUIREMENTS FOR RETURNS
              </h3>
              <ul className="list-disc pl-6">
                <li>Must be unused and original condition</li>
                <li>Original packaging with all parts</li>
              </ul>

              <h3 className="font-semibold text-gray-900">
                5. HOW TO INITIATE A RETURN
              </h3>
              <p>
                Go to "My Orders", click "Request Return", and upload issue
                proof.
              </p>

              <h3 className="font-semibold text-gray-900">
                6. DEFECT / DOA VERIFICATION
              </h3>
              <p>
                May involve technician visit. If no defect: Rs. 500 fee may
                apply.
              </p>

              <h3 className="font-semibold text-gray-900">
                7. NON-RETURNABLE ITEMS
              </h3>
              <ul className="list-disc pl-6">
                <li>Custom-built PCs</li>
                <li>Software keys</li>
                <li>Consumables</li>
              </ul>

              <h3 className="font-semibold text-gray-900">
                8. REFUND TIMELINES
              </h3>
              <p>Same as in Terms section above.</p>

              <h3 className="font-semibold text-gray-900">
                9. RETURN ABUSE POLICY
              </h3>
              <ul className="list-disc pl-6">
                <li>20%+ return rate may be flagged</li>
                <li>No-shows = Rs. 200 penalty</li>
              </ul>

              <h3 className="font-semibold text-gray-900">
                10. CONTACT SUPPORT
              </h3>
              <ul className="list-disc pl-6">
                <li>Email: returns@rigsdock.com</li>
                <li>Phone: +91 9778466748</li>
              </ul>

              <h3 className="font-semibold text-gray-900">
                11. POLICY UPDATES
              </h3>
              <p>
                Policy subject to change. Orders follow policy at time of
                placement for 30 days.
              </p>
            </div>
          )}
          {activeTab === "Cancellation" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                CONTACT INFORMATION
              </h3>
              <p>
                For any questions regarding DOA products or this procedure,
                please contact:
              </p>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Email (Returns):</strong>{" "}
                  <a
                    href="mailto:returns@rigsdock.com"
                    className="text-blue-700 hover:underline"
                  >
                    returns@rigsdock.com
                  </a>
                </li>
                <li>
                  <strong>Phone (India):</strong>{" "}
                  <a
                    href="tel:+919778466748"
                    className="text-blue-700 hover:underline"
                  >
                    +91 9778466748
                  </a>
                </li>
                <li>
                  <strong>Live Chat:</strong> Available 9 AM – 9 PM IST on{" "}
                  <a
                    href="https://rigsdock.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    rigsdock.com
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <style>{`
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
  );
}

export default About;
