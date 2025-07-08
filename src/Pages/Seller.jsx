import React, { useState } from "react";
import {
  Upload,
  User,
  Building2,
  CreditCard,
  Calendar,
  Check,
} from "lucide-react";
import Header from "../Components/Header";
import {
  vendorRegisterAPI,
  verifyaccount,
  verifygst,
  verifypan,
} from "../Services/sellerAPI";
import { ToastContainer, toast } from "react-toastify";

function Seller() {
const [formData, setFormData] = useState({
  ownername: "",
  email: "",
  businessname: "",
  businesslocation: "",
  businesslandmark: "",
  phone: "", 
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  description: "",
  storetype: "", 
  password: "",
  openingTime: "",
  closingTime: "",
  workingDays: [],
  panNumber: "",
  gstNumber: "", 
  accountNumber: "",
  ifscCode: "",
  agreeToTerms: false,
    isGstVerified: false,
  isPanVerified: false,
  isBankVerified: false,
});

  const [uploadedFiles, setUploadedFiles] = useState({
    storelogo: null,
    license: null,
    passbookPhoto: null,
    shopImage: null,
  });

  const workingDayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const hours = [
    "12:00 AM",
    "12:30 AM",
    "1:00 AM",
    "1:30 AM",
    "2:00 AM",
    "2:30 AM",
    "3:00 AM",
    "3:30 AM",
    "4:00 AM",
    "4:30 AM",
    "5:00 AM",
    "5:30 AM",
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
  ];

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.agreeToTerms) {
    toast.error("Please agree to the terms.");
    return;
  }

  if (
    !uploadedFiles.storelogo ||
    !uploadedFiles.license ||
    !uploadedFiles.passbookPhoto ||
    !uploadedFiles.shopImage
  ) {
    toast.error("Please upload all required documents.");
    return;
  }

  if (!formData.isGstVerified || !formData.isPanVerified || !formData.isBankVerified) {
  toast.error("Please verify GST, PAN, and Bank before submitting.");
  return;
}

  try {
    const formDataToSend = new FormData();

    // Append fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "workingDays" && Array.isArray(value)) {
        value.forEach((day) => {
          formDataToSend.append("workingDays", day); // ✅ correct array format
        });
      } else {
        formDataToSend.append(key, value);
      }
    });

    // Append files
    Object.entries(uploadedFiles).forEach(([key, file]) => {
      if (file) formDataToSend.append(key, file);
    });

    // Optional: debug what you're sending
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    toast.info("Registering your vendor account...");

    const response = await vendorRegisterAPI(formDataToSend);

    if (response?.success) {
      toast.success("Registration successful! Awaiting admin approval.");

      setFormData({
        ownername: "",
        email: "",
        businessname: "",
        businesslocation: "",
        businesslandmark: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        description: "",
        storetype: "",
        password: "",
        openingTime: "",
        closingTime: "",
        workingDays: [],
        panNumber: "",
        gstNumber: "",
        accountNumber: "",
        ifscCode: "",
        agreeToTerms: false,
      });

      setUploadedFiles({
        storelogo: null,
        license: null,
        passbookPhoto: null,
        shopImage: null,
      });
    } else {
      toast.error(response?.message || "Registration failed.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    toast.error(
      error?.response?.data?.message || "An error occurred during registration."
    );
  }
};


  const handleFileUpload = (key, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5MB)");
      return;
    }
    setUploadedFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleWorkingDayChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

const handleGstVerify = async () => {
  try {
    const res = await verifygst(formData.gstNumber);
    console.log("GST being verified:", formData.gstNumber);

    if (res?.success && res?.data?.verified) {
      setFormData((prev) => ({
        ...prev,
        isGstVerified: true, // ✅ backend will receive this
        businessname: res?.data?.details?.legalName,
        businesslocation: res?.data?.details?.address?.building,
        city: res?.data?.details?.address?.city,
        state: res?.data?.details?.address?.state,
        pincode: res?.data?.details?.address?.pincode,
      }));
      toast.success("GST verified successfully");
    } else {
      toast.error("Invalid or inactive GST");
    }
  } catch (error) {
    toast.error("GST verification failed");
  }
};
const handlePanVerify = async () => {
  try {
    const res = await verifypan(formData.panNumber);
        console.log("PAN being verified:", formData.panNumber);

    if (res?.success && res?.data?.verified) {
      setFormData((prev) => ({
        ...prev,
        isPanVerified: true,
      }));
      toast.success("PAN Verified");
    } else {
      toast.error("PAN not verified");
    }
  } catch (error) {
    toast.error("PAN verification failed");
  }
};

const handleIfscVerify = async () => {
  try {
    const res = await verifyaccount(formData.accountNumber, formData.ifscCode);
        console.log("Account being verified:", formData.accountNumber, formData.ifscCode);

    if (res?.success && res?.data?.verified) {
      setFormData((prev) => ({
        ...prev,
        isBankVerified: true,
      }));
      toast.success("Bank Verified");
    } else {
      toast.error("Bank not verified");
    }
  } catch (error) {
    toast.error("Bank verification failed");
  }
};

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-8 px-3 mt-5 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-8 py-4 sm:py-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Become a Seller
              </h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Join our marketplace and start selling your products
              </p>
            </div>

            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              {/* User Details Section */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center mb-4 sm:mb-6">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Personal Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      value={formData.ownername}
                      onChange={(e) =>
                        setFormData({ ...formData, ownername: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      rows="3"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.country || ""} 
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Business Details Section */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center mb-4 sm:mb-6">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Business Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessname}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessname: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Location *
                    </label>
                    <input
                      type="text"
                      value={formData.businesslocation || ""} 
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businesslocation: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Landmark *
                    </label>
                    <input
                      type="text"
                      value={formData.businesslandmark || ""} 
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businesslandmark: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {" "}
                      Store Type *
                    </label>
                    <input
                      type="text"
                      value={formData.storetype || ""} // Add to initial state if needed
                      onChange={(e) =>
                        setFormData({ ...formData, storetype: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {" "}
                      Password *
                    </label>
                    <input
                      type="password" 
                      value={formData.password || ""} 
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description*
                    </label>
                    <textarea
                      value={formData.description || ""} 
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center mb-4 sm:mb-6">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Bank Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            ifscCode: e.target.value,
                          }))
                        }
                        value={formData.ifscCode}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        required
                      />
                      <button
                        onClick={() =>
                          handleIfscVerify("IFSC", formData.ifscCode)
                        }
                        type="button"
                        className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 text-gray-50 font-semibold rounded-r-lg hover:bg-blue-600 transition-all"
                      >
                        Verify IFSC
                      </button>
                    </div>
                  </div>

                <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    PAN Number *
  </label>
  <div className="flex">
    <input
      type="text"
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          panNumber: e.target.value,
        }))
      }
      value={formData.panNumber}
      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
      required
    />
    <button
      onClick={handlePanVerify}
      type="button"
      className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 text-gray-50 font-semibold rounded-r-lg hover:bg-blue-600 transition-all"
    >
      Verify PAN
    </button>
  </div>
</div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number*
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            gstNumber: e.target.value,
                          }))
                        }
                        value={formData.gstNumber}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        required
                      />
                      <button
                        onClick={handleGstVerify}
                        type="button"
                        className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 text-gray-50 font-semibold rounded-r-lg hover:bg-blue-600 transition-all"
                      >
                        Verify GST
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* opening - closing  */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center mb-4 sm:mb-6">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Opening & Closing Time
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Opening Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Time
                    </label>
                    <select
                      value={formData.openingTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openingTime: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    >
                      <option value="">Select Opening Time</option>
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Closing Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closing Time
                    </label>
                    <select
                      value={formData.closingTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          closingTime: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    >
                      <option value="">Select Closing Time</option>
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Working Days Section */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center mb-4 sm:mb-6">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Working Days
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 sm:gap-4">
                  {workingDayOptions.map((day) => (
                    <label
                      key={day}
                      className="flex items-center space-x-2 sm:space-x-3 p-3 bg-white rounded-lg border hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day)}
                        onChange={() => handleWorkingDayChange(day)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {day}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center mb-4 sm:mb-6">
                  <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Upload Documents
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Shop Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Logo *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("storelogo", e)}
                        className="hidden"
                        id="storelogo"
                      />
                      <label htmlFor="storelogo" className="cursor-pointer">
                        <span className="text-xs sm:text-sm text-gray-600 break-words">
                          {uploadedFiles.storelogo
                            ? uploadedFiles.storelogo.name
                            : "Click to upload storelogo"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Passbook */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Passbook *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload("passbookPhoto", e)}
                        className="hidden"
                        id="passbookPhoto"
                      />
                      <label htmlFor="passbookPhoto" className="cursor-pointer">
                        <span className="text-xs sm:text-sm text-gray-600 break-words">
                          {uploadedFiles.passbookPhoto
                            ? uploadedFiles.passbookPhoto.name
                            : "Click to upload passbook"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* License */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business License *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload("license", e)}
                        className="hidden"
                        id="license"
                      />
                      <label htmlFor="license" className="cursor-pointer">
                        <span className="text-xs sm:text-sm text-gray-600 break-words">
                          {uploadedFiles.license
                            ? uploadedFiles.license.name
                            : "Click to upload license"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Shop Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shop Image *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("shopImage", e)}
                        className="hidden"
                        id="shopImage"
                      />
                      <label htmlFor="shopImage" className="cursor-pointer">
                        <span className="text-xs sm:text-sm text-gray-600 break-words">
                          {uploadedFiles.shopImage
                            ? uploadedFiles.shopImage.name
                            : "Click to upload shop image"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement and Submit */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreeToTerms: e.target.checked,
                      })
                    }
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 flex-shrink-0"
                    required
                  />
                  <label className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    I agree to RIgsdock{" "}
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                      Terms and Conditions
                    </span>{" "}
                    and{" "}
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                      Privacy Policy
                    </span>
                    . I confirm that all the information provided is accurate
                    and complete.
                  </label>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 sm:hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 inline-block mr-2" />
                  Submit Registration
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default Seller;
