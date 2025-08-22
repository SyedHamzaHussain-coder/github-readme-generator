import { Template } from '../types';

export const repositoryTemplates: Template[] = [
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    description: 'Detailed README with all sections',
    preview: '# 🚀 Project Name\n\n## 📋 Description\nDetailed project description...\n\n## ⚡ Quick Start\n```bash\nnpm install\nnpm start\n```\n\n## ✨ Features\n- Feature 1\n- Feature 2'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple README',
    preview: '# Project Name\n\nSimple description of what this project does.\n\n## Quick Start\n```bash\ngit clone repo\nnpm start\n```'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Business-ready documentation',
    preview: '# Project Name\n\n## Overview\nProfessional project overview...\n\n## Architecture\n- Component 1\n- Component 2\n\n## API Documentation\nDetailed API docs...'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique and eye-catching design',
    preview: '🌟 # Amazing Project\n\n<div align="center">\n  <img src="logo.png" width="200"/>\n</div>\n\n✨ **What makes this special?**\n\nThis project brings magic...'
  }
];

export const profileTemplates: Template[] = [
  {
    id: 'developer',
    name: 'Developer Focus',
    description: 'Showcase your coding skills and projects',
    preview: '# Hi there! 👋 I\'m John\n\n## 🚀 About Me\n- 💻 Full Stack Developer\n- 🌱 Learning AI/ML\n- 👯 Open to collaborate\n\n## 📊 GitHub Stats\n![GitHub stats](stats-card)\n\n## 🛠️ Technologies'
  },
  {
    id: 'creative',
    name: 'Creative Profile',
    description: 'Eye-catching design with animations',
    preview: '<h1 align="center">Hi 👋, I\'m John</h1>\n<h3 align="center">Passionate Developer from SF</h3>\n\n<p align="center">\n  <img src="https://readme-typing-svg.herokuapp.com?lines=Full+Stack+Developer;AI+Enthusiast;Open+Source+Contributor" />\n</p>'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and professional look',
    preview: '### John Doe\n\nFull Stack Developer | AI Enthusiast\n\n**Currently working on:** AI-powered applications\n**Learning:** Machine Learning, Cloud Architecture\n**Ask me about:** React, Node.js, Python'
  },
  {
    id: 'interactive',
    name: 'Interactive',
    description: 'Widgets and dynamic content',
    preview: '# John Doe 🚀\n\n![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=johndoe)\n\n## 📈 Activity Graph\n![Activity Graph](github-activity-graph)\n\n## 🏆 Trophies\n![Trophies](github-profile-trophy)'
  }
];
