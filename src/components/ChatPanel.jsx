// components/ChatPanel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export const ChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you with your workflow today?',
      sender: 'agent',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatPanelRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Handle clicks outside the chat panel to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatPanelRef.current &&
        !chatPanelRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate agent response after a short delay
    setTimeout(() => {
      const agentResponse = {
        id: Date.now() + 1,
        text: "I'm processing your request. How else can I assist with your workflow?",
        sender: 'agent',
      };
      setMessages((prev) => [...prev, agentResponse]);
    }, 1000);
  };

  return (
    <div className='absolute bottom-20 left-12 z-50' ref={chatPanelRef}>
      {/* Chat button */}
      <button
        className='p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors'
        onClick={toggleChat}
        aria-label='Toggle chat'
        title='Chat with Agent'
      >
        <MessageSquare className='w-6 h-6' />
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className='absolute bottom-16 left-0 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col transition-all duration-300 animate-slide-up'>
          {/* Chat header */}
          <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='font-medium text-gray-800 dark:text-white'>
              Chat with Assistant
            </h3>
          </div>

          {/* Messages area */}
          <div className='flex-1 p-4 overflow-y-auto max-h-80 space-y-4'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white rounded-tl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSendMessage}
            className='p-3 border-t border-gray-200 dark:border-gray-700 flex items-center'
          >
            <input
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Type your message...'
              className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors'
              disabled={!newMessage.trim()}
            >
              <Send className='w-4 h-4' />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
