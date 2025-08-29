// Enhanced AI-powered README generation
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
    console.log('🤖 AI Generate README API called');
    
    const { repoData, template, type, userInfo } = req.body;
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    // Validate GitHub token (same as before)
    const githubToken = authorization.replace('Bearer ', '');
    const githubUser = await validateGitHubToken(githubToken);

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ No OpenAI API key found, falling back to templates');
      return await generateTemplateReadme(repoData, template, type, userInfo || githubUser);
    }

    // Generate README using AI
    let generatedReadme = '';
    
    if (type === 'profile') {
      generatedReadme = await generateAIProfileReadme(userInfo || githubUser, template);
    } else {
      generatedReadme = await generateAIRepositoryReadme(repoData, template);
    }

    res.status(200).json({
      success: true,
      readme: generatedReadme,
      aiGenerated: true,
      metadata: {
        generatedAt: new Date().toISOString(),
        template: template || 'minimal',
        type: type || 'repository',
        wordCount: generatedReadme.split(' ').length,
        characterCount: generatedReadme.length,
        aiProvider: 'OpenAI GPT-4'
      },
    });

  } catch (error) {
    console.error('💥 AI Generate README Error:', error);
    
    // Fallback to template generation
    try {
      const fallbackReadme = await generateTemplateReadme(req.body.repoData, req.body.template, req.body.type, req.body.userInfo);
      return res.status(200).json({
        success: true,
        readme: fallbackReadme,
        aiGenerated: false,
        fallback: true,
        warning: 'AI generation failed, used template instead'
      });
    } catch (fallbackError) {
      return res.status(500).json({ 
        error: 'Both AI and template generation failed',
        details: error.message
      });
    }
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
- Add GitHub stats badges and widgets
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
  
  const data = JSON.stringify({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert technical writer specializing in creating professional README files for GitHub repositories and profiles. Generate clear, engaging, and well-structured documentation."
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

// GitHub token validation (same as current implementation)
async function validateGitHubToken(token) {
  const https = require('https');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/user',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
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
          reject(new Error(`GitHub API error: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

// Template fallback function (your current implementation)
async function generateTemplateReadme(repoData, template, type, userInfo) {
  // This would include your current template generation logic
  // Return template-generated README as fallback
  return "# Fallback Template README\n\nAI generation failed, but we've created a basic template for you.";
}
