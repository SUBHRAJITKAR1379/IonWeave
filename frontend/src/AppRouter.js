import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import ChatPage from './components/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';

function AppRouter() {
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