import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ChatPage({ user }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history
    loadChatHistory();
    // Load suggestions
    loadSuggestions();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/chat/history`, {
        withCredentials: true
      });
      if (response.data.success) {
        const history = response.data.history.map(msg => ([
          { role: 'user', content: msg.user_message },
          { role: 'assistant', content: msg.assistant_message }
        ])).flat();
        setMessages(history);
        setShowSuggestions(history.length === 0);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/suggested-questions`);
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/chat`,
        { message: messageText, model: selectedModel },
        { withCredentials: true }
      );

      if (response.data.success) {
        const assistantMessage = { 
          role: 'assistant', 
          content: response.data.message 
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    handleSendMessage(suggestion);
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your chat history?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/chat/history`, {
        withCredentials: true
      });
      setMessages([]);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="nav-dynamic border-b border-accent-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center animate-spin-slow">
                  <div className="w-8 h-8 rounded-full bg-dark-bg flex items-center justify-center">
                    <span className="text-lg">🌪️</span>
                  </div>
                </div>
                <span className="text-xl font-bold gradient-text">AtmosAether</span>
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">AI Assistant</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Model Selector */}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="input-3d px-4 py-2 rounded-lg text-sm font-medium focus:outline-none cursor-pointer"
                data-testid="model-selector"
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="claude-3-5-sonnet-20241022">Claude Sonnet</option>
                <option value="gemini-2.0-flash-exp">Gemini Flash</option>
              </select>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <img 
                  src={user?.picture || 'https://via.placeholder.com/40'} 
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-accent-blue"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" data-testid="chat-messages">
          {messages.length === 0 && showSuggestions && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold mb-2 gradient-text">Welcome to AtmosAether AI Assistant</h2>
              <p className="text-gray-400 mb-8">Ask me anything about our atmospheric purification technology!</p>
              
              {/* Suggested Questions */}
              <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="glass-effect hover-lift p-4 rounded-xl text-left text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="text-accent-blue mr-2">Q:</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-6 py-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-accent-blue to-accent-teal text-white ml-12'
                    : 'glass-effect text-gray-100 mr-12'
                } shadow-depth`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🤖</span>
                    <span className="text-xs text-accent-blue font-semibold">AtmosAether AI</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="glass-effect px-6 py-4 rounded-2xl shadow-depth">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-accent-teal rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  <span className="text-gray-400 text-sm ml-2">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-accent-blue/20 bg-dark-card/50 backdrop-blur-sm">
          <div className="px-4 py-4">
            {messages.length > 0 && (
              <div className="flex justify-center mb-3">
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-gray-400 hover:text-accent-blue transition-colors"
                >
                  🗑️ Clear History
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about AtmosAether technology..."
                className="input-3d flex-1 px-6 py-4 rounded-xl focus:outline-none"
                disabled={isLoading}
                data-testid="chat-input"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="button-3d bg-gradient-to-r from-accent-blue to-accent-teal text-white px-8 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="send-button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;