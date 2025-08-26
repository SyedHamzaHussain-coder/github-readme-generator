module.exports = async function handler(req, res) {
  try {
    // Set proper headers first
    res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_BASE_URL || 'https://github-readme-generator-delta.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Basic request validation
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    console.log('Processing GitHub OAuth callback...');
    console.log('Environment variables check:', {
      hasClientId: !!process.env.GITHUB_CLIENT_ID,
      hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
      clientIdPrefix: process.env.GITHUB_CLIENT_ID?.substring(0, 10)
    });

    // Check for required environment variables
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      console.error('Missing required environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error: Missing GitHub OAuth credentials',
        details: {
          hasClientId: !!process.env.GITHUB_CLIENT_ID,
          hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET
        }
      });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub token error:', tokenData);
      return res.status(400).json({ error: tokenData.error_description || tokenData.error });
    }

    console.log('Successfully obtained GitHub access token');

    // Get user information
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      console.error('Failed to fetch user data from GitHub');
      return res.status(400).json({ error: 'Failed to fetch user data from GitHub' });
    }

    const userData = await userResponse.json();
    console.log('Successfully fetched user data for:', userData.login);

    // Create session token (simple approach - in production use JWT)
    const sessionToken = `${userData.id}-${Date.now()}-${Math.random()}`.replace(/\./g, '');

    // Store the GitHub access token securely (in production, use a database)
    // For now, we'll include it in the session token (encoded)
    const sessionData = {
      userId: userData.id,
      githubToken: tokenData.access_token,
      createdAt: Date.now(),
    };
    
    // Use btoa instead of Buffer for better compatibility
    const encodedSession = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    return res.status(200).json({
      success: true,
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        email: userData.email,
        bio: userData.bio,
        company: userData.company,
        location: userData.location,
        blog: userData.blog,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
      },
      sessionToken: encodedSession,
    });

  } catch (error) {
    console.error('GitHub OAuth Error Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
