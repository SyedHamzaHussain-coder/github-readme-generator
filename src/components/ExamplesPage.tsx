import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, Github, Star, GitFork, 
  Code, Sparkles, X, ExternalLink
} from 'lucide-react';

export default function ExamplesPage(): JSX.Element {
  const navigate = useNavigate();
  const [selectedExample, setSelectedExample] = useState<any>(null);

  const examples = [
    {
      id: 1,
      title: "Simple Portfolio Website",
      description: "A clean, minimal README for personal portfolio projects",
      difficulty: "Basic",
      color: "accent",
      tags: ["HTML", "CSS", "JavaScript"],
      stars: "127",
      forks: "34",
      language: "JavaScript",
      preview: `# 🌟 My Portfolio Website

A modern, responsive portfolio website showcasing my projects and skills.

## 🚀 Features

- Clean, minimal design
- Fully responsive layout
- Dark/Light theme toggle
- Contact form integration

## 🛠️ Technologies Used

- HTML5 & CSS3
- Vanilla JavaScript
- Font Awesome Icons
- Google Fonts

## 📦 Installation

\`\`\`bash
git clone https://github.com/username/portfolio
cd portfolio
open index.html
\`\`\`

## 📱 Demo

[Live Demo](https://username.github.io/portfolio)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.`
    },
    {
      id: 2,
      title: "React Task Manager",
      description: "Feature-rich task management app with modern React patterns",
      difficulty: "Intermediate",
      color: "secondary",
      tags: ["React", "TypeScript", "Tailwind"],
      stars: "892",
      forks: "156",
      language: "TypeScript",
      preview: `# 📋 TaskFlow - React Task Manager

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)

A modern, feature-rich task management application built with React and TypeScript.

## ✨ Features

- 🎯 **Smart Task Organization** - Drag & drop, categories, priorities
- 🔄 **Real-time Sync** - Cloud synchronization across devices
- 📊 **Analytics Dashboard** - Track productivity and completion rates
- 🎨 **Customizable Themes** - Multiple color schemes and layouts
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔍 **Advanced Search** - Filter and find tasks instantly

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **State Management:** Redux Toolkit
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT, OAuth 2.0
- **Deployment:** Vercel, Railway

## 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/username/taskflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── store/         # Redux store and slices
├── utils/         # Helper functions
└── types/         # TypeScript type definitions
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.`
    },
    {
      id: 3,
      title: "Enterprise Microservices Platform",
      description: "Production-ready microservices architecture with full DevOps pipeline",
      difficulty: "Advanced",
      color: "primary",
      tags: ["Docker", "Kubernetes", "Go", "PostgreSQL"],
      stars: "2.1k",
      forks: "487",
      language: "Go",
      preview: `# 🏢 EnterprisePlatform - Microservices Architecture

[![Build Status](https://img.shields.io/github/workflow/status/company/platform/CI)](https://github.com/company/platform/actions)
[![Coverage](https://img.shields.io/codecov/c/github/company/platform)](https://codecov.io/gh/company/platform)
[![Go Report Card](https://goreportcard.com/badge/github.com/company/platform)](https://goreportcard.com/report/github.com/company/platform)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=platform&metric=security_rating)](https://sonarcloud.io/dashboard?id=platform)

Enterprise-grade microservices platform built for scalability, reliability, and performance.

## 🎯 Overview

This platform provides a complete microservices ecosystem with:
- **High Availability** - 99.99% uptime SLA
- **Auto-scaling** - Handles 10M+ requests/day
- **Security First** - Zero-trust architecture
- **Cloud Native** - Kubernetes & Docker ready

## 🏗️ Architecture

\`\`\`mermaid
graph TB
    A[Load Balancer] --&gt; B[API Gateway]
    B --&gt; C[Auth Service]
    B --&gt; D[User Service]
    B --&gt; E[Order Service]
    B --&gt; F[Payment Service]
    
    C --&gt; G[(Auth DB)]
    D --&gt; H[(User DB)]
    E --&gt; I[(Order DB)]
    F --&gt; J[(Payment DB)]
    
    K[Message Queue] --&gt; L[Notification Service]
    K --&gt; M[Analytics Service]
\`\`\`

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+
- Kubernetes 1.24+
- Helm 3.8+
- Go 1.19+

### Development Setup

\`\`\`bash
# Clone repository
git clone https://github.com/company/platform
cd platform

# Start development environment
make dev-up

# Run tests
make test

# Build all services
make build-all
\`\`\`

### Production Deployment

\`\`\`bash
# Deploy to Kubernetes
helm install platform ./helm/platform

# Scale services
kubectl scale deployment api-gateway --replicas=3

# Monitor deployment
kubectl get pods -l app=platform
\`\`\`

## 📊 Performance Metrics

| Metric | Target | Current |
|--------|---------|---------|
| Response Time | < 100ms | 78ms |
| Throughput | 10k RPS | 12k RPS |
| Availability | 99.99% | 99.97% |
| Error Rate | < 0.1% | 0.05% |

## 🔧 Services

### Core Services
- **API Gateway** - Request routing, rate limiting, authentication
- **Auth Service** - JWT tokens, OAuth2, RBAC
- **User Service** - User management, profiles, preferences
- **Order Service** - Order processing, inventory management
- **Payment Service** - Payment processing, billing

### Support Services
- **Notification Service** - Email, SMS, push notifications
- **Analytics Service** - Real-time metrics, reporting
- **File Service** - File upload, storage, CDN integration

## 🔒 Security

- **Zero Trust Architecture** - Never trust, always verify
- **mTLS** - Service-to-service encryption
- **OWASP Compliance** - Regular security audits
- **Secrets Management** - Kubernetes secrets + HashiCorp Vault
- **Network Policies** - Microsegmentation with Calico

## 📈 Monitoring & Observability

- **Metrics** - Prometheus + Grafana
- **Logging** - ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing** - Jaeger distributed tracing
- **Alerting** - PagerDuty integration
- **Health Checks** - Kubernetes liveness/readiness probes

## 🛠️ Development

### Code Standards
- **Linting** - golangci-lint
- **Testing** - 90%+ code coverage
- **Documentation** - Swagger/OpenAPI 3.0
- **Git Flow** - Feature branches + PR reviews

### CI/CD Pipeline
1. **Code Commit** - Trigger GitHub Actions
2. **Tests** - Unit, integration, e2e tests
3. **Security Scan** - SAST, dependency check
4. **Build** - Docker images + helm charts
5. **Deploy** - Staging → Production

## 📚 Documentation

- [API Documentation](./docs/api/README.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Architecture Decision Records](./docs/adr/README.md)

## 🤝 Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

Licensed under the Apache License 2.0 - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: platform-support@company.com
- 💬 Slack: #platform-support
- 🐛 Issues: [GitHub Issues](https://github.com/company/platform/issues)
- 📖 Wiki: [Internal Wiki](https://wiki.company.com/platform)`
    }
  ];

  const difficultyColors = {
    Basic: "text-accent bg-accent/20 border-accent/30",
    Intermediate: "text-secondary bg-secondary/20 border-secondary/30",
    Advanced: "text-primary-light bg-primary/20 border-primary/30"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white">
      {/* Header */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center text-secondary hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              README
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"> Examples</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Explore real-world README examples from basic to enterprise-level projects. 
              See how professional documentation looks and get inspired for your own projects.
            </p>
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full px-6 py-2 border border-secondary/30">
                <span className="text-sm text-accent font-medium">
                  ✨ Preview-only examples - This is how your README will look
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Examples Grid */}
      <div className="relative z-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <div 
                key={example.id}
                className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden hover:border-secondary/50 transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-secondary/10 cursor-pointer"
                style={{
                  transform: `perspective(1000px) rotateX(${index * 2}deg) rotateY(${index * 1}deg)`,
                  transformStyle: 'preserve-3d'
                }}
                onClick={() => setSelectedExample(example)}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-700/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Github className="w-6 h-6 text-secondary" />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[example.difficulty as keyof typeof difficultyColors]}`}>
                        {example.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {example.stars}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {example.forks}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    {example.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{example.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {example.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                        {tag}
                      </span>
                    ))}
                    {example.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700/30 rounded text-xs text-gray-400">
                        +{example.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* README Preview */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-white">README Preview</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 h-40 overflow-hidden border border-gray-300 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none z-10"></div>
                    <div className="prose prose-sm max-w-none overflow-hidden">
                      <div className="github-markdown text-gray-900">
                        <ReactMarkdown
                          components={{
                            h1: ({children}) => (
                              <h1 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                                {children}
                              </h1>
                            ),
                            h2: ({children}) => (
                              <h2 className="text-base font-semibold text-gray-900 mb-2 mt-4">
                                {children}
                              </h2>
                            ),
                            p: ({children}) => (
                              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                {children}
                              </p>
                            ),
                            ul: ({children}) => (
                              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside mb-3">
                                {children}
                              </ul>
                            ),
                            li: ({children}) => (
                              <li className="text-sm text-gray-700">
                                {children}
                              </li>
                            ),
                            strong: ({children}) => (
                              <strong className="font-semibold text-gray-900">
                                {children}
                              </strong>
                            ),
                            code: ({children}) => (
                              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">
                                {children}
                              </code>
                            ),
                            pre: ({children}) => (
                              <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
                                {children}
                              </pre>
                            )
                          }}
                        >
                          {example.preview.substring(0, 400)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      {example.language}
                    </div>
                    <div className="text-gray-500">
                      This is how it will look
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-700 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl border border-secondary/20">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Create Your Own?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Generate professional READMEs tailored to your project in seconds. 
              Our AI understands your code and creates documentation that stands out.
            </p>
            <button 
              onClick={() => navigate('/connect')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Generating Now
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      {selectedExample && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Github className="w-6 h-6 text-gray-700" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedExample.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedExample.difficulty === 'Basic' ? 'bg-accent-light text-primary-dark' :
                      selectedExample.difficulty === 'Intermediate' ? 'bg-secondary-light text-primary-dark' :
                      'bg-primary-light text-white'
                    }`}>
                      {selectedExample.difficulty}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {selectedExample.stars}
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      {selectedExample.forks}
                    </div>
                    <div className="flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      {selectedExample.language}
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedExample(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => (
                      <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6">
                        {children}
                      </h1>
                    ),
                    h2: ({children}) => (
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
                        {children}
                      </h2>
                    ),
                    h3: ({children}) => (
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                        {children}
                      </h3>
                    ),
                    p: ({children}) => (
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({children}) => (
                      <ul className="text-gray-700 space-y-2 list-disc list-inside mb-4 ml-4">
                        {children}
                      </ul>
                    ),
                    ol: ({children}) => (
                      <ol className="text-gray-700 space-y-2 list-decimal list-inside mb-4 ml-4">
                        {children}
                      </ol>
                    ),
                    li: ({children}) => (
                      <li className="text-gray-700">
                        {children}
                      </li>
                    ),
                    strong: ({children}) => (
                      <strong className="font-semibold text-gray-900">
                        {children}
                      </strong>
                    ),
                    code: ({children}) => (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    ),
                    pre: ({children}) => (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4">
                        {children}
                      </pre>
                    ),
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
                        {children}
                      </blockquote>
                    ),
                    a: ({href, children}) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-secondary hover:text-secondary-dark underline inline-flex items-center gap-1"
                      >
                        {children}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ),
                    table: ({children}) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-300">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({children}) => (
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">
                        {children}
                      </th>
                    ),
                    td: ({children}) => (
                      <td className="border border-gray-300 px-4 py-2">
                        {children}
                      </td>
                    )
                  }}
                >
                  {selectedExample.preview}
                </ReactMarkdown>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                This is how your README will look on GitHub
              </div>
              <button 
                onClick={() => navigate('/connect')}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light px-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 inline-flex items-center"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Similar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
