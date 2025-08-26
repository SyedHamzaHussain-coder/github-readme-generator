// api/github-repos.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔍 GitHub Repos API Debug Info:');
    console.log('Method:', req.method);
    console.log('Query:', req.query);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    // Extract token from different sources
    let token = null;
    let username = null;

    if (req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
      console.log('🔐 Token found in Authorization header');
    } else if (req.body?.token) {
      token = req.body.token;
      console.log('🔐 Token found in request body');
    } else if (req.query?.token) {
      token = req.query.token;
      console.log('🔐 Token found in query params');
    }

    // Get username from different sources
    if (req.query?.username) {
      username = req.query.username;
    } else if (req.body?.username) {
      username = req.body.username;
    }

    console.log('📋 Parameters:', { 
      hasToken: !!token, 
      username: username || 'current user',
      method: req.method 
    });

    if (!token) {
      console.error('❌ No GitHub token provided');
      return res.status(401).json({ 
        error: 'Authentication required',
        details: 'No GitHub token provided. Please login first.'
      });
    }

    // Fetch user's repositories
    console.log('🚀 Fetching repositories from GitHub...');
    
    let apiUrl;
    if (username) {
      // Fetch specific user's public repos
      apiUrl = `https://api.github.com/users/${username}/repos`;
    } else {
      // Fetch authenticated user's repos (including private)
      apiUrl = 'https://api.github.com/user/repos';
    }

    // Add query parameters for sorting and pagination
    const params = new URLSearchParams({
      sort: req.query.sort || 'updated',
      direction: req.query.direction || 'desc',
      per_page: req.query.per_page || '30',
      page: req.query.page || '1',
      type: req.query.type || 'all' // all, owner, public, private, member
    });

    const fullUrl = `${apiUrl}?${params.toString()}`;
    console.log('🌐 GitHub API URL:', fullUrl.replace(token, 'TOKEN'));

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-README-Generator'
      }
    });

    console.log('📡 GitHub API response status:', response.status);
    console.log('📡 Rate limit remaining:', response.headers.get('x-ratelimit-remaining'));
    console.log('📡 Rate limit reset:', response.headers.get('x-ratelimit-reset'));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ GitHub API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      // Handle different error types
      if (response.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid or expired GitHub token',
          details: 'Please re-authenticate with GitHub'
        });
      } else if (response.status === 403) {
        return res.status(403).json({ 
          error: 'GitHub API rate limit exceeded or access forbidden',
          details: errorText,
          rateLimitRemaining: response.headers.get('x-ratelimit-remaining'),
          rateLimitReset: response.headers.get('x-ratelimit-reset')
        });
      } else if (response.status === 404) {
        return res.status(404).json({ 
          error: 'User not found',
          details: `GitHub user '${username}' not found`
        });
      } else {
        return res.status(response.status).json({ 
          error: `GitHub API error (${response.status})`,
          details: errorText
        });
      }
    }

    const repositories = await response.json();
    console.log('✅ Successfully fetched repositories:', repositories.length);

    // Process and enhance repository data
    const processedRepos = repositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      ssh_url: repo.ssh_url,
      homepage: repo.homepage,
      size: repo.size,
      stargazers_count: repo.stargazers_count,
      watchers_count: repo.watchers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      languages_url: repo.languages_url,
      default_branch: repo.default_branch,
      private: repo.private,
      fork: repo.fork,
      archived: repo.archived,
      disabled: repo.disabled,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      topics: repo.topics || [],
      license: repo.license ? {
        key: repo.license.key,
        name: repo.license.name,
        spdx_id: repo.license.spdx_id
      } : null,
      owner: {
        login: repo.owner.login,
        id: repo.owner.id,
        avatar_url: repo.owner.avatar_url,
        html_url: repo.owner.html_url,
        type: repo.owner.type
      }
    }));

    // Return success response with metadata
    const responseData = {
      repositories: processedRepos,
      total_count: processedRepos.length,
      metadata: {
        fetched_at: new Date().toISOString(),
        username: username || 'authenticated user',
        sort: req.query.sort || 'updated',
        direction: req.query.direction || 'desc',
        page: parseInt(req.query.page || '1'),
        per_page: parseInt(req.query.per_page || '30')
      },
      rate_limit: {
        remaining: response.headers.get('x-ratelimit-remaining'),
        reset: response.headers.get('x-ratelimit-reset'),
        limit: response.headers.get('x-ratelimit-limit')
      }
    };

    console.log('🎉 Repository fetch successful');
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('💥 Unexpected error in GitHub repos API:', error);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}