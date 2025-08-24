module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_BASE_URL || 'https://github-readme-generator-delta.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(401).json({ error: 'Session token is required' });
    }

    // Decode session token to get GitHub access token
    let sessionData;
    try {
      sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
    } catch (error) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const { githubToken } = sessionData;

    if (!githubToken) {
      return res.status(401).json({ error: 'GitHub token not found in session' });
    }

    console.log('Fetching user repositories...');

    // Fetch user's repositories from GitHub
    const reposResponse = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!reposResponse.ok) {
      console.error('Failed to fetch repositories from GitHub');
      return res.status(400).json({ error: 'Failed to fetch repositories from GitHub' });
    }

    const repositories = await reposResponse.json();
    
    // Filter and format repositories
    const formattedRepos = repositories
      .filter(repo => !repo.fork) // Exclude forked repositories
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        forks_count: repo.forks_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        size: repo.size,
        default_branch: repo.default_branch,
        topics: repo.topics || [],
        has_issues: repo.has_issues,
        has_projects: repo.has_projects,
        has_wiki: repo.has_wiki,
      }))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // Sort by most recently updated

    console.log(`Successfully fetched ${formattedRepos.length} repositories`);

    res.status(200).json({
      success: true,
      repositories: formattedRepos,
      total: formattedRepos.length,
    });

  } catch (error) {
    console.error('GitHub repositories fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
