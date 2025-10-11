// GitHubCallback.jsx or your callback component
import React, { useEffect, useState } from 'react';

const GitHubCallback = () => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        console.log('🔄 Starting OAuth callback processing...');
        setStatus('loading');
        
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        console.log('📋 OAuth parameters:', { 
          code: code ? `${code.substring(0, 8)}...` : null, 
          state: state ? `${state.substring(0, 8)}...` : null 
        });
        
        if (!code) {
          throw new Error('No authorization code received from GitHub');
        }
        
        if (!state) {
          console.warn('⚠️ No state parameter - this may be a security risk');
        }
        
        console.log('🚀 Exchanging code for token...');
        
        // Make GET request with parameters in URL
        const apiUrl = `/api/auth/github-callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || '')}`;
        console.log('🌐 API URL:', apiUrl.replace(code, `${code.substring(0, 8)}...`));
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Token response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        let responseData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          // Handle non-JSON responses
          const textResponse = await response.text();
          console.log('📄 Non-JSON response:', textResponse);
          responseData = { error: textResponse };
        }
        
        console.log('📋 API Response:', {
          ok: response.ok,
          status: response.status,
          hasAccessToken: !!responseData.access_token,
          hasUser: !!responseData.user,
          error: responseData.error
        });
        
        if (!response.ok) {
          console.error('❌ API Error Response:', responseData);
          throw new Error(responseData.error || responseData.details || `HTTP ${response.status}`);
        }
        
        if (!responseData.access_token) {
          console.error('❌ No access token in response');
          throw new Error('No access token received from GitHub');
        }
        
        if (!responseData.user) {
          console.error('❌ No user data in response');
          throw new Error('No user information received from GitHub');
        }
        
        console.log('✅ OAuth success! User:', responseData.user.login);
        
        // Store the authentication data
        localStorage.setItem('github_token', responseData.access_token);
        localStorage.setItem('github_user', JSON.stringify(responseData.user));
        
        // Optional: Store additional metadata
        localStorage.setItem('github_auth_timestamp', Date.now().toString());
        localStorage.setItem('github_auth_success', 'true');
        
        setStatus('success');
        
        // Wait a moment to show success, then redirect
        setTimeout(() => {
          console.log('🔄 Redirecting to main app...');
          window.location.href = '/';
        }, 1000);
        
      } catch (error) {
        console.error('❌ GitHub OAuth error:', error);
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
        
        setStatus('error');
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        
        // Optional: Clear any existing auth data on error
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_user');
        localStorage.removeItem('github_auth_timestamp');
        localStorage.setItem('github_auth_success', 'false');
      }
    };

    // Start the callback process
    handleGitHubCallback();
  }, []);

  // Render different states
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Connecting to GitHub...</h2>
          <p className="text-gray-600 mt-2">Please wait while we complete the authentication process.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-accent">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Successfully connected!</h2>
          <p className="text-gray-600 mt-2">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 mx-auto mb-4 text-red-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Authentication Failed</h2>
          <p className="text-gray-600 mt-2 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark transition-colors"
            >
              Return to Home
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GitHubCallback;

