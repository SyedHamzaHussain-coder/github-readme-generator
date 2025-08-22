import { marked } from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

// Configure marked with syntax highlighting
const renderer = new marked.Renderer();
renderer.code = function({ text, lang, escaped }) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(text, { language: lang }).value;
    } catch (__) {}
  }
  return text;
};

// Custom image rendering to handle GitHub badges and stats
renderer.image = ({ href, title, text }) => {
  if (href?.includes('shields.io') || href?.includes('github-readme-stats')) {
    return `<img src="${href}" alt="${text}" class="inline-block" />`;
  }
  return `<img src="${href}" alt="${text}" title="${title || ''}" class="rounded-lg max-w-full" />`;
};

marked.setOptions({
  renderer: renderer,
  breaks: true,
  gfm: true
});

// Custom image rendering to handle GitHub badges and stats
renderer.image = ({ href, title, text }) => {
  if (href?.includes('shields.io') || href?.includes('github-readme-stats')) {
    return `<img src="${href}" alt="${text}" class="inline-block" />`;
  }
  return `<img src="${href}" alt="${text}" title="${title || ''}" class="rounded-lg max-w-full" />`;
};

export const renderMarkdown = async (markdown: string): Promise<string> => {
  // Set the custom renderer
  marked.use({ renderer });
  
  // Convert markdown to HTML and sanitize
  const html = await marked.parse(markdown);
  const sanitized = DOMPurify.sanitize(html);
  
  return sanitized;
};

export const generateFallbackReadme = (type: 'profile' | 'repository', data: any): string => {
  if (type === 'profile') {
    return `# Hi there! 👋 I'm ${data.name}\n\n## About Me\n${data.bio}\n\n...`;
  } else {
    return `# ${data.name}\n\n## Description\n${data.description}\n\n...`;
  }
};
