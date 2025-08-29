// api/auth/check.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔍 Auth Check API called');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);

    // Extract token from different sources
    let token = null;

    if (req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
      console.log('🔐 Token found in Authorization header');
    } else if (req.cookies?.github_token) {
      token = req.cookies.github_token;
      console.log('🔐 Token found in cookies');
    } else if (req.cookies?.['auth-token']) {
      token = req.cookies['auth-token'];
      console.log('🔐 Token found in auth-token cookie');
    }

    if (!token) {
      console.log('❌ No token found');
      return res.status(200).json({ 
        authenticated: false,
        message: 'No authentication token found'
      });
    }

    console.log('🚀 Verifying token with GitHub...');

    // Verify token with GitHub API
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-README-Generator'
      }
    });

    console.log('📡 GitHub API response status:', response.status);

    if (!response.ok) {
      console.log('❌ Token verification failed');
      
      // If token is invalid, clear cookies
      if (response.status === 401) {
        console.log('🧹 Clearing invalid token cookies');
        res.setHeader('Set-Cookie', [
          'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
          'github-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
          'github_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
          'github_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
        ]);
      }
      
      return res.status(200).json({ 
        authenticated: false,
        message: 'Token verification failed',
        tokenValid: false
      });
    }

    const user = await response.json();
    console.log('✅ Token verified successfully for user:', user.login);

    return res.status(200).json({ 
      authenticated: true,
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
        company: user.company,
        location: user.location,
        blog: user.blog,
        twitter_username: user.twitter_username,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        created_at: user.created_at
      },
      tokenValid: true
    });

  } catch (error) {
    console.error('💥 Auth check error:', error);
    return res.status(500).json({ 
      authenticated: false,
      message: 'Internal server error during authentication check',
      error: error.message
    });
  }
}
