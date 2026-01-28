import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        console.log('AuthCallback - Full URL:', window.location.href);
        console.log('AuthCallback - Hash:', window.location.hash);
        console.log('AuthCallback - Search:', window.location.search);
        
        // Extract session_id from URL fragment (#) or query string (?)
        let sessionId = null;
        
        // Try hash first
        const hash = window.location.hash;
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          sessionId = hashParams.get('session_id');
          console.log('Session ID from hash:', sessionId);
        }
        
        // Try query string if not in hash
        if (!sessionId) {
          const searchParams = new URLSearchParams(window.location.search);
          sessionId = searchParams.get('session_id');
          console.log('Session ID from search:', sessionId);
        }

        if (!sessionId) {
          console.error('No session_id found in URL');
          alert('Authentication failed: No session ID received. Please try again.');
          navigate('/login');
          return;
        }

        console.log('Exchanging session_id:', sessionId);

        // Exchange session_id for user data
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/session`,
          { session_id: sessionId },
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Session exchange response:', response.data);

        if (response.data.success) {
          console.log('Login successful, navigating to chat');
          // Navigate to chat page with user data
          navigate('/chat', { 
            state: { user: response.data.user },
            replace: true 
          });
        } else {
          throw new Error('Session exchange failed');
        }
      } catch (error) {
        console.error('Auth error:', error);
        console.error('Error details:', error.response?.data);
        alert(`Authentication failed: ${error.response?.data?.detail || error.message}`);
        navigate('/login');
      }
    };

    processSession();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-300 mb-2">Authenticating...</p>
        <p className="text-gray-500 text-sm">Please wait while we log you in</p>
      </div>
    </div>
  );
}

export default AuthCallback;