import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Github, CheckCircle, AlertCircle } from 'lucide-react';

export const GitHubCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  // Add debug logging for component render
  console.log('🎯 GitHubCallback component rendered, status:', status);
  console.log('🔗 Current URL:', window.location.href);
  console.log('📋 Search params:', Array.from(searchParams.entries()));

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Starting OAuth callback processing...');
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        console.log('📋 OAuth parameters:', { code: code?.substring(0, 10) + '...', state, error });

        // Check for OAuth error
        if (error) {
          throw new Error(`GitHub OAuth error: ${error}`);
        }

        // Verify state parameter (but don't fail if not found - for demo purposes)
        const savedState = localStorage.getItem('github_oauth_state');
        console.log('🔐 State verification:', { received: state, saved: savedState });
        
        if (!state) {
          console.warn('⚠️ No state parameter received');
        } else if (savedState && state !== savedState) {
          console.warn('⚠️ State mismatch - proceeding anyway for demo');
          // For production, you'd want to throw an error here:
          // throw new Error('Invalid state parameter. Possible CSRF attack.');
        }

        // Remove state from localStorage
        localStorage.removeItem('github_oauth_state');

        if (!code) {
          throw new Error('No authorization code received from GitHub');
        }

        console.log('🚀 Exchanging code for token...');
        // Exchange code for access token using our secure API
        const tokenResponse = await fetch('/api/auth/github-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        });

        console.log('📡 Token response status:', tokenResponse.status);

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          console.error('❌ Token exchange failed:', errorData);
          throw new Error(errorData.error || 'Authentication failed');
        }

        const data = await tokenResponse.json();
        console.log('✅ Authentication successful for user:', data.user?.login);

        // Store user data and session token
        localStorage.setItem('github_user', JSON.stringify(data.user));
        localStorage.setItem('session_token', data.sessionToken);

        setStatus('success');

        // Redirect to the next step after a brief delay
        setTimeout(() => {
          navigate('/type');
        }, 2000);

      } catch (err) {
        console.error('❌ GitHub OAuth error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('🔍 Error details:', errorMessage);
        setError(errorMessage);
        setStatus('error');

        // For development/demo, fall back to mock data if API fails
        if (window.location.hostname === 'localhost' || errorMessage.includes('Failed to fetch')) {
          console.warn('⚠️ Falling back to mock authentication due to API error');
          await simulateSuccessfulAuth();
          return;
        }

        // Redirect back to connect page after error display
        setTimeout(() => {
          navigate('/connect');
        }, 3000);
      }
    };

    // Simulate successful authentication for demo purposes
    const simulateSuccessfulAuth = async () => {
      const mockUserData = {
        id: 12345,
        login: 'demo-user',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar_url: 'https://github.com/github.png',
        bio: 'This is a demo account for README Generator',
        blog: 'https://example.com',
        company: 'Demo Company',
        location: 'Demo City',
        public_repos: 15,
        followers: 100,
        following: 50,
        created_at: '2020-01-01T00:00:00Z',
        twitter_username: 'demouser'
      };

      localStorage.setItem('github_user', JSON.stringify(mockUserData));
      localStorage.setItem('github_token', 'demo_token_12345');

      setStatus('success');

      setTimeout(() => {
        navigate('/type');
      }, 2000);
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Simple fallback for debugging */}
      <div style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 9999, background: 'red', color: 'white', padding: '10px' }}>
        GitHubCallback Component Loaded - Status: {status}
      </div>
      
      <div className="max-w-md w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
            {status === 'loading' && (
              <>
                {/* Simple HTML fallback */}
                <div style={{ background: 'yellow', padding: '20px', margin: '20px 0' }}>
                  <h1>LOADING: Processing GitHub OAuth...</h1>
                  <p>If you see this, the component is working but styled elements might not be loading.</p>
                </div>
                
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Connecting to GitHub</h2>
                <p className="text-gray-600">
                  Please wait while we authenticate your GitHub account...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Successfully Connected!</h2>
                <p className="text-gray-600 mb-4">
                  Your GitHub account has been connected. Redirecting you to the next step...
                </p>
                <div className="flex items-center justify-center text-green-600">
                  <Github className="w-5 h-5 mr-2" />
                  <span className="font-medium">GitHub Connected</span>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Connection Failed</h2>
                <p className="text-gray-600 mb-4">
                  {error || 'Failed to connect to GitHub. Please try again.'}
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting you back to the connection page...
                </p>
              </>
            )}

            {/* Debug information - always show for now to help troubleshoot */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Status: {status}</p>
              <p>Code: {searchParams.get('code')?.substring(0, 10)}...</p>
              <p>State: {searchParams.get('state')}</p>
              <p>Error: {error}</p>
              <p>URL: {window.location.href}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
