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
    const { repoFullName } = req.body;
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    if (!repoFullName) {
      return res.status(400).json({ error: 'Repository full name is required' });
    }

    // Extract session token
    const sessionToken = authorization.replace('Bearer ', '');
    
    try {
      // Decode session data
      const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
      const { githubToken, userId, createdAt } = sessionData;

      // Check if session is expired
      if (Date.now() - createdAt > 24 * 60 * 60 * 1000) {
        return res.status(401).json({ error: 'Session expired' });
      }

      console.log('Analyzing repository:', repoFullName);

      // Fetch repository data, contents, and languages in parallel
      const [repoResponse, contentsResponse, languagesResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${repoFullName}`, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }),
        fetch(`https://api.github.com/repos/${repoFullName}/contents`, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }),
        fetch(`https://api.github.com/repos/${repoFullName}/languages`, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }),
      ]);

      if (!repoResponse.ok) {
        return res.status(repoResponse.status).json({ error: 'Repository not found or access denied' });
      }

      const repository = await repoResponse.json();
      const contents = contentsResponse.ok ? await contentsResponse.json() : [];
      const languages = languagesResponse.ok ? await languagesResponse.json() : {};

      // Try to fetch package.json if it exists
      let packageJson = null;
      const packageJsonFile = contents.find(file => file.name === 'package.json');
      if (packageJsonFile) {
        try {
          const packageResponse = await fetch(packageJsonFile.download_url);
          if (packageResponse.ok) {
            packageJson = await packageResponse.json();
          }
        } catch (error) {
          console.log('Could not fetch package.json:', error.message);
        }
      }

      // Try to fetch README if it exists
      let readmeContent = null;
      const readmeFile = contents.find(file => 
        file.name.toLowerCase().startsWith('readme')
      );
      if (readmeFile) {
        try {
          const readmeResponse = await fetch(readmeFile.download_url);
          if (readmeResponse.ok) {
            readmeContent = await readmeResponse.text();
          }
        } catch (error) {
          console.log('Could not fetch README:', error.message);
        }
      }

      // Calculate language percentages
      const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
      const languagePercentages = {};
      for (const [lang, bytes] of Object.entries(languages)) {
        languagePercentages[lang] = ((bytes / totalBytes) * 100).toFixed(1);
      }

      // Analyze project structure
      const projectStructure = {
        hasPackageJson: !!packageJsonFile,
        hasReadme: !!readmeFile,
        hasDockerfile: contents.some(file => file.name.toLowerCase() === 'dockerfile'),
        hasLicense: contents.some(file => file.name.toLowerCase().includes('license')),
        hasGitignore: contents.some(file => file.name === '.gitignore'),
        hasSrc: contents.some(file => file.name === 'src' && file.type === 'dir'),
        hasTests: contents.some(file => 
          file.name.includes('test') || file.name.includes('spec') || file.name === '__tests__'
        ),
        hasCI: contents.some(file => 
          file.name === '.github' || file.name === '.gitlab-ci.yml' || file.name === '.travis.yml'
        ),
      };

      // Determine project type
      let projectType = 'general';
      if (packageJson) {
        if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
          projectType = 'react';
        } else if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
          projectType = 'nextjs';
        } else if (packageJson.dependencies?.vue || packageJson.devDependencies?.vue) {
          projectType = 'vue';
        } else if (packageJson.dependencies?.express) {
          projectType = 'nodejs';
        }
      } else if (languages.Python) {
        projectType = 'python';
      } else if (languages.Java) {
        projectType = 'java';
      } else if (languages['C++'] || languages.C) {
        projectType = 'cpp';
      }

      const analysis = {
        repository: {
          name: repository.name,
          full_name: repository.full_name,
          description: repository.description,
          language: repository.language,
          topics: repository.topics || [],
          stargazers_count: repository.stargazers_count,
          forks_count: repository.forks_count,
          watchers_count: repository.watchers_count,
          size: repository.size,
          default_branch: repository.default_branch,
          created_at: repository.created_at,
          updated_at: repository.updated_at,
          html_url: repository.html_url,
          clone_url: repository.clone_url,
          homepage: repository.homepage,
        },
        files: contents.map(file => ({
          name: file.name,
          type: file.type,
          path: file.path,
          size: file.size,
        })),
        packageJson,
        readmeContent,
        languages: languagePercentages,
        projectStructure,
        projectType,
        analysis: {
          complexity: Object.keys(languages).length > 3 ? 'high' : Object.keys(languages).length > 1 ? 'medium' : 'low',
          hasDocumentation: !!readmeFile,
          isActive: new Date(repository.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Updated in last 30 days
          hasTests: projectStructure.hasTests,
          hasCI: projectStructure.hasCI,
        },
      };

      console.log(`Successfully analyzed repository: ${repoFullName}`);

      res.status(200).json({
        success: true,
        analysis,
      });

    } catch (decodeError) {
      console.error('Invalid session token:', decodeError);
      return res.status(401).json({ error: 'Invalid session token' });
    }

  } catch (error) {
    console.error('Analyze Repo Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
