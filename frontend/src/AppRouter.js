import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import ChatPage from './components/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';

function AppRouter() {
  const location = useLocation();

  // Check for session_id in URL fragment during render (before useEffect)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default AppRouter;