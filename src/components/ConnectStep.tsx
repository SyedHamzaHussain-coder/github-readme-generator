import React, { useEffect, useState } from 'react';
import { Github, Shield, Users, BookOpen, AlertCircle } from 'lucide-react';
import { GitHubData } from '../types';

interface ConnectStepProps {
  isGenerating: boolean;
  connectToGitHub: (forceReauth?: boolean) => Promise<void>;
}

export const ConnectStep: React.FC<ConnectStepProps> = ({ isGenerating, connectToGitHub }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('github_token');
      if (!token) {
        setIsConnected(false);
        setUserInfo(null);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/check', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.authenticated && data.user) {
        setUserInfo(data.user);
        setIsConnected(true);
        // Update localStorage with fresh user data
        localStorage.setItem('github_user', JSON.stringify(data.user));
      } else {
        setIsConnected(false);
        setUserInfo(null);
        // Clear invalid data
        localStorage.removeItem('github_user');
        localStorage.removeItem('github_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsConnected(false);
      setUserInfo(null);
    }
    setLoading(false);
  };

  // Check if user is already connected and handle OAuth callback
  useEffect(() => {
    console.log('🔍 ConnectStep useEffect - checking authentication state');
    
    // Check for logout parameter to force clean state
    const urlParams = new URLSearchParams(window.location.search);
    const loggedOut = urlParams.get('logout') === 'true';
    
    if (loggedOut) {
      console.log('🔍 Logout parameter detected, forcing clean state');
      // Clear any remaining data and remove logout parameter from URL
      localStorage.removeItem('github_user');
      localStorage.removeItem('github_token');
      localStorage.removeItem('github_auth_timestamp');
      localStorage.removeItem('github_auth_success');
      localStorage.removeItem('github_oauth_state');
      setUserInfo(null);
      setIsConnected(false);
      setLoading(false);
      
      // Clean up URL
      window.history.replaceState({}, document.title, '/connect');
      return;
    }
    
    // Handle OAuth callback
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    console.log('🔍 URL params:', { code: !!code, state: !!state, error });

    if (error) {
      console.error('OAuth error:', error);
      alert('GitHub authentication failed. Please try again.');
      setLoading(false);
      return;
    }

    if (code && state) {
      console.log('🔍 OAuth callback detected, processing...');
      // Verify state parameter
      const savedState = localStorage.getItem('github_oauth_state');
      if (state !== savedState) {
        console.error('OAuth state mismatch');
        alert('Security error during authentication. Please try again.');
        setLoading(false);
        return;
      }

      // Exchange code for token using our secure API
      handleOAuthCallback(code);
      return;
    }

    // Check authentication status with the server
    checkAuthStatus();
  }, []);

  const handleOAuthCallback = async (code: string) => {
    try {
      const response = await fetch('/api/auth/github-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        credentials: 'include', // Include cookies for session
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      // Store user info locally for quick access
      localStorage.setItem('github_user', JSON.stringify(data.user));
      localStorage.removeItem('github_oauth_state'); // Clean up
      
      setUserInfo(data.user);
      setIsConnected(true);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('OAuth callback error:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    console.log('🚪 Starting logout process...');
    
    // Get the current token for proper logout
    const token = localStorage.getItem('github_token');
    
    // Clear local storage and session storage
    localStorage.removeItem('github_user');
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_auth_timestamp');
    localStorage.removeItem('github_auth_success');
    localStorage.removeItem('github_oauth_state');
    sessionStorage.removeItem('github_user');
    sessionStorage.removeItem('github_token');
    
    console.log('🧹 Local storage cleared');
    
    // Clear server-side session with token
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          token: token
        })
      });
      console.log('✅ Server-side logout successful');
    } catch (error) {
      console.error('❌ Server logout error:', error);
    }
    
    setUserInfo(null);
    setIsConnected(false);
    
    console.log('🔄 Redirecting to /connect with logout parameter');
    // Force redirect with logout parameter to ensure clean authentication
    window.location.href = '/connect?logout=true';
  };

  const handleUseDifferentAccount = async () => {
    try {
      console.log('🔄 Starting "Use Different Account" process...');
      
      // Get the current token for proper logout
      const token = localStorage.getItem('github_token');
      
      // First, logout from the current session with token
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          token: token
        })
      });
      
      // Clear any local storage and session storage
      localStorage.removeItem('github_token');
      localStorage.removeItem('github_user');
      localStorage.removeItem('github_auth_timestamp');
      localStorage.removeItem('github_auth_success');
      localStorage.removeItem('github_oauth_state');
      sessionStorage.removeItem('github_user');
      sessionStorage.removeItem('github_token');
      
      console.log('🧹 Session and storage cleared');
      
      // Get environment variables for OAuth
      const { getOAuthUrls } = await import('../config');
      
      // Generate a unique state parameter for security
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('github_oauth_state', state);
      
      // Get OAuth URLs using the configuration utility
      const { githubAuthorize } = getOAuthUrls();
      
      // Force GitHub logout and account selection by using GitHub's logout URL
      const oauthParams = new URLSearchParams({
        client_id: import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23li3OjcXsV4D0EyK4',
        redirect_uri: `${window.location.origin}/auth/callback`,
        scope: 'read:user user:email public_repo',
        state: state,
        // These parameters force account selection
        prompt: 'select_account',
        allow_signup: 'true'
      });
      
      const githubAuthUrl = `https://github.com/login/oauth/authorize?${oauthParams}`;
      
      console.log('🔗 Redirecting to GitHub with forced account selection');
      
      // Redirect to GitHub logout first, then to OAuth with account selection
      window.location.href = `https://github.com/logout?return_to=${encodeURIComponent(githubAuthUrl)}`;
      
    } catch (error) {
      console.error('❌ Use different account failed:', error);
      
      // Fallback: direct redirect with prompt parameter
      try {
        const { getOAuthUrls } = await import('../config');
        const state = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('github_oauth_state', state);
        
        const oauthParams = new URLSearchParams({
          client_id: import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23li3OjcXsV4D0EyK4',
          redirect_uri: `${window.location.origin}/auth/callback`,
          scope: 'read:user user:email public_repo',
          state: state,
          prompt: 'select_account'
        });
        
        const fallbackUrl = `https://github.com/login/oauth/authorize?${oauthParams}`;
        console.log('🔗 Fallback: Direct OAuth with account selection');
        window.location.href = fallbackUrl;
        
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        alert('Failed to logout and switch accounts. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Checking Authentication Status
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your GitHub connection...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isConnected && userInfo) {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-secondary rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-green-600 to-secondary text-white p-8 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <img 
                src={userInfo.avatar_url} 
                alt={userInfo.name || userInfo.username}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {userInfo.name || userInfo.username}!</h2>
            <p className="text-green-100 mb-6">
              Your GitHub account is connected. Ready to generate amazing READMEs?
            </p>
            
            <div className="flex items-center justify-center space-x-6 mb-6">
              <button
                onClick={() => connectToGitHub(false)}
                disabled={isGenerating}
                className="bg-white text-accent-dark px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Continue to Templates</span>
                  </div>
                )}
              </button>
              
              <button
                onClick={handleUseDifferentAccount}
                className="text-green-100 hover:text-white transition-colors underline"
              >
                Use different account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-3xl shadow-2xl">
          <Github className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Connect Your GitHub Account</h2>
          <p className="text-purple-100 mb-8">
            We'll analyze your repositories and profile to create amazing README files using AI
          </p>
          
          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Shield className="w-8 h-8 mx-auto mb-2 text-purple-200" />
              <h3 className="font-semibold mb-1">Secure</h3>
              <p className="text-sm text-purple-100">OAuth 2.0 authentication</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-200" />
              <h3 className="font-semibold mb-1">Trusted</h3>
              <p className="text-sm text-purple-100">Used by 10,000+ developers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-200" />
              <h3 className="font-semibold mb-1">Smart</h3>
              <p className="text-sm text-purple-100">AI-powered analysis</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => connectToGitHub(true)}
              disabled={isGenerating}
              className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50 text-lg"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Github className="w-6 h-6" />
                  <span>Login with GitHub</span>
                </div>
              )}
            </button>
          </div>
          
          {/* Permissions info */}
          <div className="mt-6 flex items-start justify-center text-purple-100 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="font-medium mb-1">We'll request permission to:</p>
              <ul className="text-xs space-y-1">
                <li>• Read your public profile information</li>
                <li>• Access your public repositories</li>
                <li>• Read your email address</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

