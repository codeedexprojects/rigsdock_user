import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { chatbotAPI } from '../Services/chatbotAPI';
import { BASE_URL } from '../Services/baseUrl';


function ChatBox() {
 const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState("");
  const [currentFlow, setCurrentFlow] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [showReturnReason, setShowReturnReason] = useState(false);
  const isLoggedIn = !!userId;


  useEffect(() => { 
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "How can I help you?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      if (currentFlow === 'return' && !orderId) {
        setOrderId(input);
        const res = await chatbotAPI({ userId, message: input });
        setMessages((prev) => [...prev, botReply(res.reply)]);
        setShowReturnReason(true);
        return;
      }

      const res = await chatbotAPI({ userId, message: input });
      setMessages((prev) => [...prev, botReply(res.reply)]);
      setCurrentFlow(null);
      setOrderId(null);
    } catch (err) {
      setMessages((prev) => [...prev, botReply(" Error conatcting support.")]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReturnReasonSubmit = async (reason) => {
    setShowReturnReason(false);
    setIsTyping(true);

    const userMsg = {
      id: Date.now(),
      text: reason,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await chatbotAPI({ userId, message: reason });
      setMessages((prev) => [...prev, botReply(res.reply)]);
    } catch (err) {
      setMessages((prev) => [...prev, botReply(" Error submitting return reason.")]);
    } finally {
      setIsTyping(false);
      setCurrentFlow(null);
      setOrderId(null);
    }
  };

const botReply = (text) => {
  const reasons = [
    "Defective product",
    "Wrong item received",
    "Changed mind",
    "Other (please specify)"
  ];
  
  // Split the text at "Thank you" or similar phrases
  const thankYouPhrases = ["Thank you", "🙏 Thank you"];
  let mainText = text;
  let thankYouText = null;
  
  for (const phrase of thankYouPhrases) {
    if (text.includes(phrase)) {
      const splitIndex = text.indexOf(phrase);
      mainText = text.substring(0, splitIndex).trim();
      thankYouText = text.substring(splitIndex).trim();
      break;
    }
  }

  const hasReturnOptions = mainText.includes("provide the reason for return");

  return {
    id: Date.now() + 1,
    text: mainText,
    thankYouText: thankYouText,
    sender: 'bot',
    timestamp: new Date(),
    returnOptions: hasReturnOptions ? reasons : null
  };
};


  const handleQuickAction = async (action) => {
    const userMsg = {
      id: Date.now(),
      text: action,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    let flow = null;
    if (action === "Where is my order?") flow = "track";
    else if (action === "Return ") flow = "return";
    else if (action === "Payment Issues") flow = "payment";

    setCurrentFlow(flow);

    try {
      const res = await chatbotAPI({ userId, message: action });
      setMessages((prev) => [...prev, botReply(res.reply)]);
    } catch (err) {
      setMessages((prev) => [...prev, botReply("Failed to connect to support.")]);
    } finally {
      setIsTyping(false);
    }
  };

useEffect(() => {
  const storedId = localStorage.getItem("userId");
   console.log("Loaded userId from localStorage:", storedId);
  if (storedId) {
    setUserId(storedId);
  }
}, []);
if (!isLoggedIn) return null;


  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center space-x-3">
          <div className="hidden sm:block bg-yellow-300 text-black px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-bounce">
            Need help?
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            💬
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[550px] w-full h-full bg-white md:rounded-lg shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 md:rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Customer Support</h3>
                <p className="text-xs text-blue-100">Online now</p>
              </div>
            </div>
            <button
              onClick={() =>{
                setIsOpen(false)
                setMessages([])
              }
              }
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
           {messages.map((msg) => (
  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`flex items-end space-x-2 max-w-[85%] sm:max-w-xs ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        msg.sender === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-gray-300 text-gray-600'
      }`}>
        {msg.sender === 'bot' ? <Bot size={12} /> : <User size={12} />}
      </div>
      <div className="flex flex-col">
      <div className={`px-3 py-2 rounded-lg text-sm ${
  msg.sender === 'bot'
    ? 'bg-white text-gray-800 shadow-sm rounded-bl-none'
    : 'bg-blue-600 text-white rounded-br-none'
}`}>
  {msg.text}
  
  {/* Show thank you text separately if it exists */}
  {msg.thankYouText && (
    <div className="mt-2 pt-2 border-t border-gray-100 rounded-2xl text-black">
      {msg.thankYouText}
    </div>
  )}

  {/* Show dropdown if returnOptions exist */}
  {msg.returnOptions && (
    <select
      className="mt-2 w-full border border-gray-300 rounded p-1 text-sm"
      onChange={(e) => handleReturnReasonSubmit(e.target.value)}
    >
      <option value="">Select a reason</option>
      {msg.returnOptions.map((reason) => (
        <option key={reason} value={reason}>{reason}</option>
      ))}
    </select>
  )}
</div>
  <span className={`text-xs text-gray-500 mt-1 ${
          msg.sender === 'user' ? 'text-right' : 'text-left'
        }`}>
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  </div>
))}

{/* Quick Actions - Show only after initial message */}
            {messages.length === 1 && !isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2 max-w-[85%] sm:max-w-xs">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-blue-600" />
                  </div>
                  <div className="bg-white shadow-sm rounded-lg rounded-bl-none p-3 w-full">
                    <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                    <div className="space-y-1">
                      {[
                        'Where is my order?',
                        'Return ',
                        'Payment Issues',
                        'Speak to Agent'
                      ].map((action) => (
                        <button
                          key={action}
                          onClick={() => handleQuickAction(action)}
                          className="block w-full text-left px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2 max-w-xs">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-blue-600" />
                  </div>
                  <div className="bg-white shadow-sm rounded-lg rounded-bl-none px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-400 bg-white md:rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2.5 md:py-2 border border-zinc-400 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2.5 md:p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      
    
    </>
  );
}

export default ChatBox;