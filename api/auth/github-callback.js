// api/auth/github-callback.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔍 GitHub Callback Debug Info:');
    console.log('Method:', req.method);
    console.log('Query:', req.query);
    console.log('Headers:', req.headers);
    
    const { code, state } = req.query;

    // Validate required parameters
    if (!code) {
      console.error('❌ Missing authorization code');
      return res.status(400).json({ 
        error: 'Missing authorization code',
        details: 'No code parameter in callback URL'
      });
    }

    if (!state) {
      console.error('❌ Missing state parameter');
      return res.status(400).json({ 
        error: 'Missing state parameter',
        details: 'No state parameter in callback URL'
      });
    }

    // Check environment variables
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    console.log('🔐 Environment Check:');
    console.log('Client ID exists:', !!clientId);
    console.log('Client Secret exists:', !!clientSecret);
    
    if (!clientId) {
      console.error('❌ Missing GITHUB_CLIENT_ID');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Missing GITHUB_CLIENT_ID environment variable'
      });
    }

    if (!clientSecret) {
      console.error('❌ Missing GITHUB_CLIENT_SECRET');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Missing GITHUB_CLIENT_SECRET environment variable'
      });
    }

    // Exchange code for token
    console.log('🚀 Exchanging code for token...');
    
    const tokenParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code
    });

    console.log('📋 Token request params:', tokenParams.toString());

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'GitHub-README-Generator'
      },
      body: tokenParams.toString()
    });

    console.log('📡 Token response status:', tokenResponse.status);
    console.log('📡 Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ GitHub token exchange failed:', errorText);
      return res.status(400).json({ 
        error: 'GitHub token exchange failed',
        details: errorText,
        status: tokenResponse.status
      });
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token data received:', { 
      hasAccessToken: !!tokenData.access_token,
      tokenType: tokenData.token_type,
      scope: tokenData.scope 
    });

    if (!tokenData.access_token) {
      console.error('❌ No access token in response:', tokenData);
      return res.status(400).json({ 
        error: 'No access token received',
        details: tokenData
      });
    }

    // Get user information
    console.log('👤 Fetching user information...');
    
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-README-Generator'
      }
    });

    console.log('👤 User response status:', userResponse.status);

    if (!userResponse.ok) {
      const userErrorText = await userResponse.text();
      console.error('❌ GitHub user fetch failed:', userErrorText);
      return res.status(400).json({ 
        error: 'Failed to fetch user information',
        details: userErrorText,
        status: userResponse.status
      });
    }

    const userData = await userResponse.json();
    console.log('✅ User data received:', {
      login: userData.login,
      id: userData.id,
      name: userData.name
    });

    // Return success response
    const successData = {
      access_token: tokenData.access_token,
      user: {
        login: userData.login,
        id: userData.id,
        name: userData.name,
        avatar_url: userData.avatar_url,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following
      },
      success: true
    };

    console.log('🎉 OAuth callback successful');
    return res.status(200).json(successData);

  } catch (error) {
    console.error('💥 Unexpected error in GitHub callback:', error);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}