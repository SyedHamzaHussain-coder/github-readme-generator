// api/auth/logout.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔍 Logout Debug Info:');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    // Clear session cookies with proper expiration
    res.setHeader('Set-Cookie', [
      'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
      'github-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
      'github_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
      'github_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
    ]);

    let token = null;
    
    // Try to get token from different sources
    if (req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
      console.log('🔐 Token found in Authorization header');
    } else if (req.body?.token) {
      token = req.body.token;
      console.log('🔐 Token found in request body');
    } else if (req.cookies?.['auth-token']) {
      token = req.cookies['auth-token'];
      console.log('🔐 Token found in cookies');
    }

    // Optional: Revoke GitHub token
    if (token && process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      try {
        console.log('🚮 Attempting to revoke GitHub token...');
        
        // GitHub token revocation
        const revokeResponse = await fetch(`https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/token`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Basic ${Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            access_token: token
          })
        });

        console.log('📡 Revoke response status:', revokeResponse.status);
        
        if (revokeResponse.ok || revokeResponse.status === 404) {
          // 404 means token was already invalid/revoked
          console.log('✅ Token revoked successfully (or was already invalid)');
        } else {
          console.warn('⚠️ Token revocation failed, but continuing with logout');
        }
      } catch (revokeError) {
        console.warn('⚠️ Error during token revocation:', revokeError.message);
        // Don't fail the logout if token revocation fails
      }
    } else {
      console.log('ℹ️ No token provided or GitHub credentials missing - skipping token revocation');
    }

    // Return success response
    const response = {
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString()
    };

    console.log('✅ Logout successful');
    return res.status(200).json(response);

  } catch (error) {
    console.error('💥 Unexpected error during logout:', error);
    console.error('Error stack:', error.stack);
    
    // Even if there's an error, we should still return success for logout
    // because the main goal is to clear client-side session
    return res.status(200).json({ 
      success: true,
      message: 'Logged out (with server-side warning)',
      warning: error.message,
      timestamp: new Date().toISOString()
    });
  }
}