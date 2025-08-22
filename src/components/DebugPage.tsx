import React, { useState } from 'react';
import { getOAuthUrls, logConfig, config } from '../config';

export const DebugPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const handleDebugOAuth = () => {
    console.log('=== DEBUG OAUTH ===');
    logConfig();
    
    const { githubAuthorize } = getOAuthUrls();
    const state = 'test-state-123';
    const oauthUrl = githubAuthorize(state);
    
    console.log('Generated OAuth URL:', oauthUrl);
    console.log('Config object:', config);
    console.log('Environment variables:', {
      REACT_APP_BASE_URL: import.meta.env.REACT_APP_BASE_URL,
      REACT_APP_GITHUB_CLIENT_ID: import.meta.env.REACT_APP_GITHUB_CLIENT_ID,
      VITE_APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL,
      VITE_APP_GITHUB_CLIENT_ID: import.meta.env.VITE_APP_GITHUB_CLIENT_ID,
    });
    
    // Test if the URL would work
    setTestResult(oauthUrl);
    alert(`OAuth URL generated: ${oauthUrl}`);
  };

  const testGitHubClientId = async () => {
    const clientId = config.githubClientId;
    console.log('Testing GitHub Client ID:', clientId);
    
    try {
      // Test if the client ID exists by trying to fetch GitHub's OAuth authorize page
      const testUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:3001/test&scope=read:user`;
      
      setTestResult(`Testing GitHub Client ID: ${clientId}\nTest URL: ${testUrl}`);
      
      // Open in new tab to test
      window.open(testUrl, '_blank');
    } catch (error) {
      console.error('Error testing GitHub Client ID:', error);
      setTestResult('Error testing GitHub Client ID: ' + error);
    }
  };

  const handleDirectGitHubTest = () => {
    // Test with the exact same format that GitHub expects
    const clientId = config.githubClientId;
    const redirectUri = 'http://localhost:3001/auth/callback';
    const scope = 'read:user user:email public_repo';
    const state = 'test-' + Math.random().toString(36).substring(2, 15);
    
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    
    console.log('Direct GitHub OAuth URL:', url);
    setTestResult(`Direct GitHub OAuth URL:\n${url}`);
    
    // Actually redirect to test
    window.location.href = url;
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug OAuth Configuration</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Current Config</h2>
          <pre className="text-sm text-gray-300">
            Base URL: {config.baseUrl}{'\n'}
            GitHub Client ID: {config.githubClientId}{'\n'}
            Environment: {config.environment}{'\n'}
            API URL: {config.apiUrl}{'\n'}
            Current URL: {window.location.href}
          </pre>
        </div>
        
        <div className="bg-red-900 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">🔍 Environment Variables Debug</h2>
          <pre className="text-sm text-red-200">
            REACT_APP_GITHUB_CLIENT_ID: {import.meta.env.REACT_APP_GITHUB_CLIENT_ID || 'NOT SET'}{'\n'}
            VITE_APP_GITHUB_CLIENT_ID: {import.meta.env.VITE_APP_GITHUB_CLIENT_ID || 'NOT SET'}{'\n'}
            REACT_APP_BASE_URL: {import.meta.env.REACT_APP_BASE_URL || 'NOT SET'}{'\n'}
            All env vars: {JSON.stringify(import.meta.env, null, 2)}
          </pre>
        </div>
        
        <div className="space-x-4">
          <button
            onClick={handleDebugOAuth}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Debug OAuth URL Generation
          </button>
          
          <button
            onClick={testGitHubClientId}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Test GitHub Client ID
          </button>
          
          <button
            onClick={handleDirectGitHubTest}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            🚀 Direct GitHub Test (Will Redirect)
          </button>
        </div>
        
        {testResult && (
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Test Result</h2>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
        
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Expected OAuth URL Format</h2>
          <pre className="text-sm text-gray-300">
            https://github.com/login/oauth/authorize?
            client_id={config.githubClientId}&
            redirect_uri={encodeURIComponent(config.baseUrl + '/auth/callback')}&
            scope=read:user%20user:email%20public_repo&
            state=RANDOM_STATE
          </pre>
        </div>
        
        <div className="bg-yellow-900 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">🚨 Required GitHub OAuth App Settings</h2>
          <div className="text-sm text-yellow-200 space-y-2">
            <p><strong>Homepage URL:</strong></p>
            <code className="block bg-black p-2 rounded">{config.baseUrl}</code>
            <p><strong>Authorization callback URL:</strong></p>
            <code className="block bg-black p-2 rounded">{config.baseUrl}/auth/callback</code>
            <p><strong>Client ID should be:</strong> {config.githubClientId}</p>
          </div>
        </div>
        
        <div className="bg-blue-900 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">📋 Update Your GitHub OAuth App</h2>
          <p className="text-sm text-blue-200 mb-2">
            Go to: <a href="https://github.com/settings/applications" target="_blank" rel="noopener noreferrer" className="underline">
              https://github.com/settings/applications
            </a>
          </p>
          <p className="text-sm text-blue-200">Find your OAuth app and update:</p>
          <div className="mt-2 p-2 bg-black rounded">
            <p className="text-green-400">✅ Homepage URL: {config.baseUrl}</p>
            <p className="text-green-400">✅ Callback URL: {config.baseUrl}/auth/callback</p>
          </div>
        </div>
      </div>
    </div>
  );
};
