import React from 'react';

function Login() {
  const handleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-2xl p-8 text-center shadow-depth">
          {/* Logo */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent-blue to-accent-teal rounded-full flex items-center justify-center animate-spin-slow">
              <div className="w-16 h-16 rounded-full bg-dark-bg flex items-center justify-center">
                <span className="text-3xl">🌪️</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 gradient-text">Welcome to AtmosAether</h1>
          <p className="text-gray-400 mb-8">Sign in to chat with our AI agent and explore atmospheric purification technology</p>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="button-3d w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all"
            data-testid="google-login-button"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Features */}
          <div className="mt-8 space-y-3 text-sm text-gray-400 text-left">
            <div className="flex items-center gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Ask questions about AtmosAether technology</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-teal">✓</span>
              <span>Choose from multiple AI models</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-blue">✓</span>
              <span>Access your chat history anytime</span>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-accent-blue hover:text-accent-teal transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;