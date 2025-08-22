module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_BASE_URL || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { repoData, template, type, userInfo } = req.body;
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    if (!repoData && !userInfo) {
      return res.status(400).json({ error: 'Repository data or user info is required' });
    }

    // Extract session token
    const sessionToken = authorization.replace('Bearer ', '');
    
    try {
      // Decode session data
      const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
      const { userId, createdAt } = sessionData;

      // Check if session is expired
      if (Date.now() - createdAt > 24 * 60 * 60 * 1000) {
        return res.status(401).json({ error: 'Session expired' });
      }

      console.log('Generating README for:', type, template);

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      let generatedReadme = '';

      if (type === 'profile') {
        // Generate profile README
        generatedReadme = generateProfileReadme(userInfo, template);
      } else {
        // Generate repository README
        generatedReadme = generateRepositoryReadme(repoData, template);
      }

      console.log('Successfully generated README');

      res.status(200).json({
        success: true,
        readme: generatedReadme,
        metadata: {
          generatedAt: new Date().toISOString(),
          template: template,
          type: type,
          wordCount: generatedReadme.split(' ').length,
          characterCount: generatedReadme.length,
        },
      });

    } catch (decodeError) {
      console.error('Invalid session token:', decodeError);
      return res.status(401).json({ error: 'Invalid session token' });
    }

  } catch (error) {
    console.error('Generate README Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function generateProfileReadme(userInfo, template) {
  const { name, login, bio, company, location, blog } = userInfo;
  
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

    comprehensive: `<h1 align="center">Hi 👋, I'm ${name || login}</h1>
<h3 align="center">${bio || 'A passionate developer'}</h3>

<p align="left"> <img src="https://komarev.com/ghpvc/?username=${login}&label=Profile%20views&color=0e75b6&style=flat" alt="${login}" /> </p>

${company || location || blog ? `## 🚀 About Me\n\n` : ''}${company ? `- 🏢 I'm currently working at **${company}**\n` : ''}${location ? `- 📍 I'm based in **${location}**\n` : ''}${blog ? `- 🌐 Check out my website [${blog}](${blog})\n` : ''}
- 📫 How to reach me **${login}@github.local**
- ⚡ Fun fact **I love coding and coffee ☕**

## 🛠️ Languages and Tools

<p align="left">
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a>
<a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a>
<a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a>
</p>

## 📊 GitHub Stats

<p><img align="left" src="https://github-readme-stats.vercel.app/api/top-langs?username=${login}&show_icons=true&locale=en&layout=compact&theme=dark" alt="${login}" /></p>

<p>&nbsp;<img align="center" src="https://github-readme-stats.vercel.app/api?username=${login}&show_icons=true&locale=en&theme=dark" alt="${login}" /></p>

<p><img align="center" src="https://github-readme-streak-stats.herokuapp.com/?user=${login}&theme=dark" alt="${login}" /></p>

## 🤝 Connect with me

<p align="left">
<a href="https://github.com/${login}" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/github.svg" alt="${login}" height="30" width="40" /></a>
</p>
`,

    creative: `<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2196F3&center=true&vCenter=true&width=435&lines=Hi+👋+I'm+${name || login};${bio ? bio.split(' ').slice(0, 6).join('+') : 'Passionate+Developer'};Welcome+to+my+GitHub+profile!" alt="Typing SVG" />
</div>

## 🌟 About Me

\`\`\`javascript
const ${login.toLowerCase()} = {
    pronouns: "he" | "him",
    code: ["JavaScript", "TypeScript", "Python", "Java"],
    askMeAbout: ["web dev", "tech", "app dev", "photography"],
    technologies: {
        frontEnd: {
            js: ["React", "Vue", "Angular"],
            css: ["Sass", "Tailwind", "Bootstrap"]
        },
        backEnd: {
            js: ["Node", "Express", "Fastify"],
            python: ["Django", "Flask"]
        },
        databases: ["MongoDB", "PostgreSQL", "MySQL"],
        misc: ["Firebase", "Socket.IO", "Docker"]
    },
    architecture: ["Serverless Architecture", "Progressive web applications", "Single page applications"],
    currentFocus: "Building amazing user experiences",
    funFact: "There are two ways to write error-free programs; only the third one works"
};
\`\`\`

## 🚀 Quick Stats

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=${login}&hide_title=false&hide_rank=false&show_icons=true&include_all_commits=true&count_private=true&disable_animations=false&theme=tokyonight&locale=en&hide_border=false" height="150" alt="stats graph"  />
  <img src="https://github-readme-stats.vercel.app/api/top-langs?username=${login}&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&theme=tokyonight&hide_border=false" height="150" alt="languages graph"  />
</div>

## 🔥 Streak Stats

<div align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${login}&theme=tokyonight" alt="GitHub Streak" />
</div>

## 💫 Random Dev Quote

<div align="center">
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" />
</div>

---
<div align="center">
  
### 🌟 Show some ❤️ by starring some of the repositories!

</div>
`
  };

  return templates[template] || templates.minimal;
}

function generateRepositoryReadme(repoData, template) {
  const { repository, analysis, packageJson, projectType, languages } = repoData;
  const { name, description, language, topics, html_url } = repository;
  
  // Get top languages
  const topLanguages = Object.entries(languages || {})
    .sort(([,a], [,b]) => parseFloat(b) - parseFloat(a))
    .slice(0, 5)
    .map(([lang]) => lang);

  const templates = {
    minimal: `# ${name}

${description ? `${description}\n` : ''}
## 🚀 Getting Started

\`\`\`bash
# Clone the repository
git clone ${html_url}.git

# Navigate to project directory
cd ${name}

${packageJson ? `# Install dependencies
npm install

# Start development server
npm run dev` : '# Follow setup instructions in documentation'}
\`\`\`

## 📝 License

This project is licensed under the MIT License.
`,

    comprehensive: `# ${name}

<div align="center">

${description ? `**${description}**\n` : ''}
[![GitHub Stars](https://img.shields.io/github/stars/${repository.full_name}?style=social)](${html_url}/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/${repository.full_name}?style=social)](${html_url}/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/${repository.full_name})](${html_url}/issues)
[![License](https://img.shields.io/github/license/${repository.full_name})](LICENSE)

</div>

## 🎯 Features

- ⚡ **Fast Performance** - Optimized for speed and efficiency
- 📱 **Responsive Design** - Works on all devices
- 🔧 **Easy to Use** - Simple and intuitive interface
- 🛡️ **Secure** - Built with security best practices
- 🎨 **Customizable** - Easily adaptable to your needs

## 🛠️ Tech Stack

${topLanguages.length > 0 ? topLanguages.map(lang => `- **${lang}**`).join('\n') : `- **${language || 'Multiple Languages'}**`}

${packageJson ? `## 📦 Dependencies

\`\`\`json
${JSON.stringify(packageJson.dependencies || {}, null, 2)}
\`\`\`
` : ''}

## 🚀 Quick Start

### Prerequisites

${packageJson ? '- Node.js (v14 or higher)\n- npm or yarn' : '- Git\n- Basic development environment'}

### Installation

\`\`\`bash
# Clone the repository
git clone ${html_url}.git

# Navigate to project directory
cd ${name}

${packageJson ? `# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build` : '# Follow project-specific setup instructions'}
\`\`\`

## 📁 Project Structure

\`\`\`
${name}/
├── src/           # Source files
├── public/        # Public assets
├── docs/          # Documentation
├── tests/         # Test files
└── README.md      # This file
\`\`\`

## 🎮 Usage

[Add usage examples and screenshots here]

## 🧪 Testing

\`\`\`bash
${packageJson?.scripts?.test ? 'npm test' : '# Add testing instructions'}
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**${repository.owner?.login || 'Project Author'}**

- GitHub: [@${repository.owner?.login || 'username'}](https://github.com/${repository.owner?.login || 'username'})

## 🙏 Acknowledgments

- Thanks to all contributors who helped make this project better
- Inspired by amazing open-source projects in the community

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [${repository.owner?.login || 'the team'}](https://github.com/${repository.owner?.login || 'username'})

</div>
`,

    professional: `# ${name}

> ${description || 'Professional-grade application built with modern technologies'}

[![Version](https://img.shields.io/github/package-json/v/${repository.full_name})](package.json)
[![Build Status](https://img.shields.io/github/workflow/status/${repository.full_name}/CI)](${html_url}/actions)
[![Coverage](https://img.shields.io/codecov/c/github/${repository.full_name})](https://codecov.io/gh/${repository.full_name})
[![License](https://img.shields.io/github/license/${repository.full_name})](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

${description || 'This project provides a comprehensive solution for modern web development needs.'}

### Key Highlights

- 🏗️ **Architecture**: Scalable and maintainable codebase
- 🔒 **Security**: Industry-standard security practices
- 📈 **Performance**: Optimized for high performance
- 🧪 **Testing**: Comprehensive test coverage
- 📚 **Documentation**: Well-documented APIs and components

## Features

### Core Features
- Feature 1: Description of main functionality
- Feature 2: Description of secondary functionality
- Feature 3: Description of additional capabilities

### Technical Features
- ${language ? `Built with ${language}` : 'Modern technology stack'}
- RESTful API architecture
- Database integration
- Authentication and authorization
- Real-time updates
- Responsive design

## Installation

### System Requirements

- ${packageJson ? 'Node.js >= 14.0.0' : 'Development environment'}
- ${packageJson ? 'npm >= 6.0.0 or yarn >= 1.0.0' : 'Package manager'}
- Database (if applicable)

### Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone ${html_url}.git
   cd ${name}
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   ${packageJson ? 'npm install' : '# Install project dependencies'}
   \`\`\`

3. **Environment configuration**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Database setup** (if applicable)
   \`\`\`bash
   ${packageJson?.scripts?.['db:migrate'] ? 'npm run db:migrate' : '# Run database migrations'}
   \`\`\`

5. **Start the application**
   \`\`\`bash
   ${packageJson?.scripts?.dev ? 'npm run dev' : '# Start development server'}
   \`\`\`

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`PORT\` | Application port | \`3000\` |
| \`NODE_ENV\` | Environment mode | \`development\` |
| \`DATABASE_URL\` | Database connection string | \`-\` |

### Configuration Files

- \`config/app.js\` - Application configuration
- \`config/database.js\` - Database configuration
- \`config/auth.js\` - Authentication configuration

## Usage

### Basic Usage

[Add basic usage examples here]

### Advanced Usage

[Add advanced usage examples here]

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/api/health\` | Health check |
| GET | \`/api/users\` | Get all users |
| POST | \`/api/users\` | Create user |

## Testing

### Running Tests

\`\`\`bash
# Run all tests
${packageJson?.scripts?.test ? 'npm test' : 'npm run test'}

# Run tests with coverage
${packageJson?.scripts?.['test:coverage'] ? 'npm run test:coverage' : 'npm run test -- --coverage'}

# Run specific test suite
${packageJson?.scripts?.['test:unit'] ? 'npm run test:unit' : 'npm run test unit'}
\`\`\`

### Test Structure

- \`tests/unit/\` - Unit tests
- \`tests/integration/\` - Integration tests
- \`tests/e2e/\` - End-to-end tests

## Deployment

### Production Build

\`\`\`bash
${packageJson?.scripts?.build ? 'npm run build' : '# Build for production'}
${packageJson?.scripts?.start ? 'npm start' : '# Start production server'}
\`\`\`

### Docker Deployment

\`\`\`bash
# Build Docker image
docker build -t ${name} .

# Run container
docker run -p 3000:3000 ${name}
\`\`\`

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add documentation for new features
- Maintain test coverage above 80%

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📝 Issues: [GitHub Issues](${html_url}/issues)
- 📖 Wiki: [Project Wiki](${html_url}/wiki)

---

Made with ❤️ by the ${name} team
`
  };

  return templates[template] || templates.minimal;
}
