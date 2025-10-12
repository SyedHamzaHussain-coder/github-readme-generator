export interface GitHubUser {
  name?: string;
  login?: string;
  username?: string;
  bio?: string;
  company?: string | null;
  location?: string | null;
  blog?: string | null;
  public_repos?: number;
  followers?: number;
  following?: number;
  avatar_url?: string;
}

export interface RepositoryData {
  repository: {
    name: string;
    description?: string;
    html_url?: string;
    language?: string;
    full_name?: string;
  };
}

export function generateProfileReadme(userInfo: GitHubUser, template: string = 'minimal'): string {
  if (!userInfo || (!userInfo.login && !userInfo.username)) {
    throw new Error('User info with login or username is required for profile README');
  }

  const { name, login, username, bio, company, location, blog, public_repos, followers, following } = userInfo;
  const userLogin = login || username || 'user';

  const templates = {
    minimal: `# Hi there! 👋 I'm ${name || userLogin}

${bio ? `## About Me\n${bio}\n` : ''}
${company ? `🏢 Currently working at **${company}**\n` : ''}
${location ? `📍 Based in **${location}**\n` : ''}
${blog ? `🌐 Website: [${blog}](${blog})\n` : ''}

## GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${userLogin}&show_icons=true&theme=dark)

## Connect with me

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${userLogin})
`,

    comprehensive: `# Hi 👋, I'm ${name || userLogin}

${bio ? `**${bio}**\n` : ''}
${company ? `- 🏢 Currently working at **${company}**\n` : ''}
${location ? `- 📍 Based in **${location}**\n` : ''}
${blog ? `- 🌐 Website: [${blog}](${blog})\n` : ''}

## GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${userLogin}&show_icons=true&theme=dark)

## Top Languages

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${userLogin}&layout=compact&theme=dark)

## GitHub Streak

![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${userLogin}&theme=dark)
`,

    creative: `# Hi 👋, I'm ${name || userLogin}

\`\`\`javascript
const developer = {
    name: "${name || userLogin}",
    bio: "${bio || 'Passionate Developer'}",
    ${company ? `company: "${company}",` : ''}
    ${location ? `location: "${location}",` : ''}
    skills: ["JavaScript", "TypeScript", "React", "Node.js"],
    currentFocus: "Building amazing projects"
};
\`\`\`

## GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${userLogin}&show_icons=true&theme=tokyonight)
`,

    developer: `# Hi there! 👋 I'm ${name || userLogin}

## 🚀 About Me
${bio || 'Passionate developer creating amazing software solutions.'}

${company ? `- 💻 **${company}**\n` : ''}
${location ? `- 📍 **${location}**\n` : ''}
${blog ? `- 🌐 [${blog}](${blog})\n` : ''}

## 📊 GitHub Stats
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${userLogin}&show_icons=true&theme=dark)

## 🛠️ Technologies & Tools
- Languages: JavaScript, TypeScript, Python
- Frameworks: React, Node.js, Express
- Tools: Git, Docker, VS Code

## 📈 GitHub Activity
![GitHub Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${userLogin}&theme=github-dark)
`
  };

  return templates[template as keyof typeof templates] || templates.minimal;
}

export function generateRepositoryReadme(repoData: RepositoryData, template: string = 'minimal'): string {
  if (!repoData || !repoData.repository || !repoData.repository.name) {
    throw new Error('Repository data with name is required');
  }

  const { repository } = repoData;
  const { name, description, html_url, language, full_name } = repository;

  const templates: Record<string, string> = {
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
[![GitHub Stars](https://img.shields.io/github/stars/${full_name || `user/${name}`}?style=social)](${html_url || `https://github.com/user/${name}`}/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/${full_name || `user/${name}`})](${html_url || `https://github.com/user/${name}`}/issues)

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
`,

    creative: `# 🚀 ${name}

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=F75C7E&center=true&vCenter=true&width=435&lines=Welcome+to+${name}!;${description || 'Amazing Project'}!" alt="Typing SVG" />
</div>

## ✨ What makes this special?

${description || 'This project brings innovation and excellence to the table.'}

### 🌟 Key Highlights
- 🔥 **Performance**: Lightning fast
- 🎨 **Design**: Beautiful and intuitive
- 🔧 **Developer Experience**: Smooth workflow

## 🚀 Quick Start

\`\`\`bash
git clone ${html_url || `https://github.com/user/${name}`}.git
cd ${name}
npm install
npm run dev
\`\`\`

<div align="center">
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="Built with Love" />
  <img src="https://forthebadge.com/images/badges/made-with-javascript.svg" alt="Made with JavaScript" />
</div>
`
  };

  return templates[template as keyof typeof templates] || templates.minimal;
}