module.exports = async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Simple health check
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        hasGithubClientId: !!process.env.GITHUB_CLIENT_ID,
        hasGithubClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
        hasReactAppBaseUrl: !!process.env.REACT_APP_BASE_URL,
        nodeVersion: process.version,
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
}
