module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_BASE_URL || 'https://github-readme-generator-delta.vercel.app/');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    console.log('Processing GitHub OAuth callback...');

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
    const sessionToken = Buffer.from(`${userData.id}-${Date.now()}-${Math.random()}`).toString('base64');

    // Store the GitHub access token securely (in production, use a database)
    // For now, we'll include it in the session token (encoded)
    const sessionData = {
      userId: userData.id,
      githubToken: tokenData.access_token,
      createdAt: Date.now(),
    };
    
    const encodedSession = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    res.status(200).json({
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
    console.error('GitHub OAuth Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
