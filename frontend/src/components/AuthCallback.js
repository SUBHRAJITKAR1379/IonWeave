import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL fragment (#) or query string (?)
        let sessionId = null;
        
        // Try hash first
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          sessionId = hashParams.get('session_id');
        }
        
        // Try query string if not in hash
        if (!sessionId && window.location.search) {
          const searchParams = new URLSearchParams(window.location.search);
          sessionId = searchParams.get('session_id');
        }

        if (!sessionId) {
          console.error('No session_id found');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Exchange session_id for user data
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/session`,
          { session_id: sessionId },
          { 
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        );

        if (response.data.success) {
          // Small delay to ensure cookie is set
          setTimeout(() => {
            navigate('/chat', { 
              state: { user: response.data.user },
              replace: true 
            });
          }, 500);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(processSession, 100);
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="glass-effect px-8 py-6 rounded-2xl inline-block">
          <h2 className="text-2xl font-bold gradient-text mb-2">Logging you in...</h2>
          <p className="text-gray-400">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
}

export default AuthCallback;