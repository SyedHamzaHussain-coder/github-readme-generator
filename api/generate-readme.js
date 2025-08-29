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

      let generatedReadme = '';

      // Check if AI generation is available
      if (process.env.OPENAI_API_KEY) {
        try {
          console.log('🤖 Using AI generation...');
          
          if (type === 'profile') {
            generatedReadme = await generateAIProfileReadme(userInfo || githubUser, template || 'minimal');
          } else {
            generatedReadme = await generateAIRepositoryReadme(repoData, template || 'minimal');
          }
          
          console.log('✅ AI generation successful');
        } catch (aiError) {
          console.warn('⚠️ AI generation failed, falling back to templates:', aiError.message);
          // Fall back to template generation
          if (type === 'profile') {
            generatedReadme = generateProfileReadme(userInfo || githubUser, template || 'minimal');
          } else {
            generatedReadme = generateRepositoryReadme(repoData, template || 'minimal');
          }
        }
      } else {
        console.log('📄 Using template generation (no AI key configured)');
        // Use template generation
        if (type === 'profile') {
          generatedReadme = generateProfileReadme(userInfo || githubUser, template || 'minimal');
        } else {
          generatedReadme = generateRepositoryReadme(repoData, template || 'minimal');
        }
      }

      if (!generatedReadme) {
        throw new Error('Generated README is empty');
      }

      console.log('✅ Successfully generated README', {
        length: generatedReadme.length,
        wordCount: generatedReadme.split(' ').length,
        aiGenerated: !!process.env.OPENAI_API_KEY
      });

      res.status(200).json({
        success: true,
        readme: generatedReadme,
        aiGenerated: !!process.env.OPENAI_API_KEY,
        metadata: {
          generatedAt: new Date().toISOString(),
          template: template || 'minimal',
          type: type || 'repository',
          wordCount: generatedReadme.split(' ').length,
          characterCount: generatedReadme.length,
          generator: process.env.OPENAI_API_KEY ? 'AI (OpenAI GPT)' : 'Template'
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

// AI-powered profile README generation
async function generateAIProfileReadme(userInfo, template) {
  const { name, login, bio, company, location, blog, public_repos, followers, following } = userInfo;
  
  const prompt = `Generate a professional GitHub profile README for a developer with the following information:

Name: ${name || login}
Username: ${login}
Bio: ${bio || 'Not provided'}
Company: ${company || 'Not provided'}
Location: ${location || 'Not provided'}
Website: ${blog || 'Not provided'}
Public Repositories: ${public_repos || 0}
Followers: ${followers || 0}
Following: ${following || 0}

Style: ${template || 'minimal'} (minimal = simple and clean, comprehensive = detailed with stats, creative = unique design elements, professional = business-oriented)

Requirements:
- Use proper Markdown formatting
- Include appropriate emojis
- Add GitHub stats badges and widgets using username "${login}"
- Make it engaging and professional
- Include sections for skills, projects, and contact
- Use the actual username "${login}" in all GitHub links and stats
- Keep it between 300-800 words
- Make it unique and personalized based on the provided information

Generate only the README content, no explanations or additional text.`;

  return await callOpenAI(prompt);
}

// AI-powered repository README generation
async function generateAIRepositoryReadme(repoData, template) {
  const { repository } = repoData;
  const { name, description, language, html_url, full_name } = repository;
  
  const prompt = `Generate a professional README.md for a GitHub repository with the following information:

Repository Name: ${name}
Description: ${description || 'Not provided'}
Primary Language: ${language || 'Not specified'}
Repository URL: ${html_url || ''}
Full Name: ${full_name || ''}

Style: ${template || 'minimal'} (minimal = essential info only, comprehensive = detailed documentation, professional = enterprise-grade with all sections)

Requirements:
- Use proper Markdown formatting
- Include installation and usage instructions
- Add appropriate badges and shields
- Include sections for: Features, Installation, Usage, Contributing, License
- Make it professional and informative
- Use actual repository information provided
- Include code examples where appropriate
- Keep it between 400-1000 words depending on template
- Make it specific to the project type based on the language

Generate only the README content, no explanations or additional text.`;

  return await callOpenAI(prompt);
}

// OpenAI API call function
async function callOpenAI(prompt) {
  const https = require('https');
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const data = JSON.stringify({
    model: "gpt-4o-mini", // Using the more cost-effective model
    messages: [
      {
        role: "system",
        content: "You are an expert technical writer specializing in creating professional README files for GitHub repositories and profiles. Generate clear, engaging, and well-structured documentation using proper Markdown formatting."
      },
      {
        role: "user", 
        content: prompt
      }
    ],
    max_tokens: 2000,
    temperature: 0.7
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (response.choices && response.choices[0]) {
            resolve(response.choices[0].message.content);
          } else {
            throw new Error('Invalid OpenAI response format');
          }
        } catch (err) {
          reject(new Error(`OpenAI API error: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}
