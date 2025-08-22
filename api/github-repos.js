module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_BASE_URL || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { authorization } = req.headers;
    
    if (!authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    // Extract session token
    const sessionToken = authorization.replace('Bearer ', '');
    
    try {
      // Decode session data
      const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
      const { githubToken, userId, createdAt } = sessionData;

      // Check if session is expired (24 hours)
      if (Date.now() - createdAt > 24 * 60 * 60 * 1000) {
        return res.status(401).json({ error: 'Session expired' });
      }

      console.log('Fetching repositories for user:', userId);

      // Fetch repositories from GitHub API
      const reposResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!reposResponse.ok) {
        console.error('GitHub API error:', reposResponse.status, reposResponse.statusText);
        return res.status(reposResponse.status).json({ error: 'Failed to fetch repositories from GitHub' });
      }

      const repositories = await reposResponse.json();
      
      // Filter and format repositories
      const formattedRepos = repositories.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        private: repo.private,
        html_url: repo.html_url,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        default_branch: repo.default_branch,
        size: repo.size,
        open_issues_count: repo.open_issues_count,
      }));

      console.log(`Successfully fetched ${formattedRepos.length} repositories`);

      res.status(200).json({
        success: true,
        repositories: formattedRepos,
        total_count: formattedRepos.length,
      });

    } catch (decodeError) {
      console.error('Invalid session token:', decodeError);
      return res.status(401).json({ error: 'Invalid session token' });
    }

  } catch (error) {
    console.error('Get Repos Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
