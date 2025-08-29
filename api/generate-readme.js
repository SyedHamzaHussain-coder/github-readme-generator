module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📝 Generate README API called');
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body keys:', Object.keys(req.body || {}));
    
    const { repoData, template, type, userInfo } = req.body;
    const { authorization } = req.headers;

    console.log('Request params:', { 
      hasRepoData: !!repoData, 
      template, 
      type, 
      hasUserInfo: !!userInfo,
      hasAuth: !!authorization 
    });

    if (!authorization) {
      console.error('❌ Missing authorization header');
      return res.status(401).json({ error: 'Authorization header required' });
    }

    if (!repoData && !userInfo) {
      console.error('❌ Missing repository data and user info');
      return res.status(400).json({ error: 'Repository data or user info is required' });
    }

    if (!template) {
      console.warn('⚠️ No template specified, using minimal');
    }

    if (!type) {
      console.warn('⚠️ No type specified, defaulting to repository');
    }

    // Extract GitHub token from authorization header
    const githubToken = authorization.replace('Bearer ', '');
    
    try {
      console.log('🔍 Validating GitHub token...');
      
      // Use Node.js https module instead of fetch for better Vercel compatibility
      const https = require('https');
      const url = require('url');
      
      const githubUser = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'api.github.com',
          path: '/user',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-README-Generator'
          }
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 200) {
              try {
                resolve(JSON.parse(data));
              } catch (err) {
                reject(new Error('Invalid JSON response from GitHub'));
              }
            } else {
              console.error('❌ GitHub token validation failed:', res.statusCode);
              reject(new Error(`GitHub API error: ${res.statusCode}`));
            }
          });
        });

        req.on('error', (err) => {
          console.error('❌ Request error:', err);
          reject(err);
        });

        req.end();
      });

      console.log('✅ GitHub token validated for user:', githubUser.login);

      console.log('🚀 Generating README for:', type || 'repository', template || 'minimal');

      // Simulate AI processing time (reduced for serverless)
      await new Promise(resolve => setTimeout(resolve, 1000));

      let generatedReadme = '';

      try {
        if (type === 'profile') {
          // Generate profile README
          console.log('📄 Generating profile README...');
          generatedReadme = generateProfileReadme(userInfo || githubUser, template || 'minimal');
        } else {
          // Generate repository README
          console.log('📁 Generating repository README...');
          generatedReadme = generateRepositoryReadme(repoData, template || 'minimal');
        }

        if (!generatedReadme) {
          throw new Error('Generated README is empty');
        }

        console.log('✅ Successfully generated README', {
          length: generatedReadme.length,
          wordCount: generatedReadme.split(' ').length
        });
      } catch (generateError) {
        console.error('❌ Error during README generation:', generateError);
        throw generateError;
      }

      res.status(200).json({
        success: true,
        readme: generatedReadme,
        metadata: {
          generatedAt: new Date().toISOString(),
          template: template || 'minimal',
          type: type || 'repository',
          wordCount: generatedReadme.split(' ').length,
          characterCount: generatedReadme.length,
        },
      });

    } catch (validationError) {
      console.error('Token validation error:', validationError);
      return res.status(401).json({ 
        error: 'Token validation failed',
        details: validationError.message 
      });
    }

  } catch (error) {
    console.error('💥 Generate README Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return detailed error information in development
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(500).json({ 
      error: 'Internal server error',
      ...(isDevelopment && {
        details: error.message,
        stack: error.stack
      })
    });
  }
}

function generateProfileReadme(userInfo, template) {
  try {
    if (!userInfo) {
      throw new Error('User info is required for profile README');
    }

    const { name, login, bio, company, location, blog } = userInfo;
    
    if (!login) {
      throw new Error('User login is required for profile README');
    }

    console.log('📝 Generating profile README for:', login, 'with template:', template);

    const templates = {
      minimal: `# Hi there! 👋 I'm ${name || login}

${bio ? `## About Me\n${bio}\n` : ''}
${company ? `🏢 Currently working at **${company}**\n` : ''}
${location ? `📍 Based in **${location}**\n` : ''}
${blog ? `🌐 Website: [${blog}](${blog})\n` : ''}

## GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${login}&show_icons=true&theme=dark)

## Connect with me

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${login})
`,

      comprehensive: `# Hi 👋, I'm ${name || login}

${bio ? `**${bio}**\n` : ''}
${company ? `- 🏢 Currently working at **${company}**\n` : ''}
${location ? `- 📍 Based in **${location}**\n` : ''}
${blog ? `- 🌐 Website: [${blog}](${blog})\n` : ''}

## GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${login}&show_icons=true&theme=dark)

## Top Languages

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${login}&layout=compact&theme=dark)

## GitHub Streak

![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${login}&theme=dark)
`,

      creative: `# Hi 👋, I'm ${name || login}

\`\`\`javascript
const developer = {
    name: "${name || login}",
    bio: "${bio || 'Passionate Developer'}",
    ${company ? `company: "${company}",` : ''}
    ${location ? `location: "${location}",` : ''}
    skills: ["JavaScript", "TypeScript", "React", "Node.js"],
    currentFocus: "Building amazing projects"
};
\`\`\`

## GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${login}&show_icons=true&theme=tokyonight)
`
    };

    return templates[template] || templates.minimal;
  } catch (error) {
    console.error('❌ Error generating profile README:', error);
    throw error;
  }
}

function generateRepositoryReadme(repoData, template) {
  try {
    if (!repoData || !repoData.repository) {
      throw new Error('Repository data is required');
    }

    const { repository } = repoData;
    const { name, description, html_url } = repository;
    
    if (!name) {
      throw new Error('Repository name is required');
    }

    console.log('📁 Generating repository README for:', name, 'with template:', template);

    const templates = {
      minimal: `# ${name}

${description ? `${description}\n` : ''}
## 🚀 Getting Started

\`\`\`bash
# Clone the repository
git clone ${html_url || `https://github.com/user/${name}`}.git

# Navigate to project directory
cd ${name}

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## 📝 License

This project is licensed under the MIT License.
`,

      comprehensive: `# ${name}

${description ? `**${description}**\n` : ''}
[![GitHub Stars](https://img.shields.io/github/stars/user/${name}?style=social)](${html_url || `https://github.com/user/${name}`}/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/user/${name})](${html_url || `https://github.com/user/${name}`}/issues)

## 🎯 Features

- ⚡ Fast Performance
- 📱 Responsive Design  
- 🔧 Easy to Use
- 🛡️ Secure

## 🚀 Quick Start

\`\`\`bash
git clone ${html_url || `https://github.com/user/${name}`}.git
cd ${name}
npm install
npm run dev
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
`,

      professional: `# ${name}

> ${description || 'Professional-grade application'}

## Overview

${description || 'This project provides a comprehensive solution for modern development needs.'}

## Features

- Modern architecture
- High performance
- Comprehensive documentation

## Installation

\`\`\`bash
git clone ${html_url || `https://github.com/user/${name}`}.git
cd ${name}
npm install
npm start
\`\`\`

## License

MIT License
`
    };

    return templates[template] || templates.minimal;
  } catch (error) {
    console.error('❌ Error generating repository README:', error);
    throw error;
  }
}
