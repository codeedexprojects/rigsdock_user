import React, { useState, useEffect } from 'react';
import { X, Send, Headset, UserRound } from 'lucide-react';

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
       {
          id: 5,
          text: "How Can i help you?",
          sender: 'bot',
        },
      ]);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (input.trim() === '') return;
    const newMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  return (
    <>
      {/* Floating Button and Prompt */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2">
          <div className="bg-yellow-500 text-gray-800 px-5 py-2 rounded-full shadow text-sm font-bold animate-bounce">
            Need help?
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          >
            💬
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
<div className="fixed bottom-20 right-6 w-[400px] h-[600px] border border-blue-200 rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
         <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 relative text-center rounded-t-lg">
  <div>
    <h4 className="font-bold text-lg text-gray-800">Customer Support</h4>
    <p className="text-xs text-gray-600">Get help 24x7</p>
  </div>

  <button
    onClick={() => setIsOpen(false)}
    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
  >
    <X size={20} />
  </button>
</div>


          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                {msg.sender === 'bot' ? (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserRound size={16} className="text-blue-600" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
                  msg.sender === 'bot'
                    ? 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    : 'bg-blue-100 text-gray-800 border border-blue-200 rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Options Menu (like in the image) */}
            <div className="flex items-start space-x-2">
              {/* <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
              </div> */}
              {/* <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 max-w-xs lg:max-w-md">
                <div className="space-y-2">
                  <button className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Issue with Delivaery date
                  </button>
                  <button className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Bills / Payment / Return Order
                  </button>
                  <button className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium">
                    
                  </button>
                  <button className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Manage account 
                  </button>
                  <button className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium ">
                    More
                  </button>
                </div>
              </div> */}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t bg-white flex items-center">
           
            <input
              type="text"
              placeholder="Type your query here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border-0 focus:outline-none text-sm "
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
           
            <button
              onClick={handleSend}
              className="ml-2 p-2 text-blue-600 hover:text-blue-800"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBox;