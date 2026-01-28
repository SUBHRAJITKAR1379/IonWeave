import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FloatingChatButton() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="button-3d w-16 h-16 bg-gradient-to-r from-accent-blue to-accent-teal rounded-full flex items-center justify-center shadow-depth hover:scale-110 transition-transform"
        data-testid="floating-chat-button"
        title="Chat with AI"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
      
      {isHovered && (
        <div className="absolute bottom-20 right-0 glass-effect px-4 py-2 rounded-lg whitespace-nowrap animate-fade-in">
          <p className="text-sm font-medium text-white">Chat with AI Assistant</p>
          <p className="text-xs text-gray-400">Ask about AtmosAether</p>
        </div>
      )}
    </div>
  );
}

export default FloatingChatButton;