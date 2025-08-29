import { ReadmeSection, SectionType } from '../components/VisualBuilder';

export interface SpecializedTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  icon: string;
  sections: ReadmeSection[];
  variables: TemplateVariable[];
  aiPrompts: AIPrompt[];
}

export type TemplateCategory = 
  | 'web-development' | 'mobile-development' | 'machine-learning' 
  | 'blockchain' | 'api-service' | 'library-package' 
  | 'data-science' | 'devops' | 'desktop-app' | 'game-development';

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'select' | 'boolean' | 'array';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  placeholder?: string;
  description?: string;
}

export interface AIPrompt {
  section: SectionType;
  prompt: string;
  variables: string[];
}

export class SpecializedTemplateService {
  private static templates: Map<string, SpecializedTemplate> = new Map();

  static {
    this.initializeTemplates();
  }

  private static initializeTemplates() {
    // Web Development Templates
    this.templates.set('react-app', {
      id: 'react-app',
      name: 'React Application',
      category: 'web-development',
      description: 'Modern React application with TypeScript, Vite, and best practices',
      icon: '⚛️',
      sections: this.createReactAppSections(),
      variables: this.createReactAppVariables(),
      aiPrompts: this.createReactAppPrompts()
    });

    this.templates.set('nextjs-app', {
      id: 'nextjs-app',
      name: 'Next.js Application',
      category: 'web-development',
      description: 'Full-stack Next.js app with SSR, API routes, and modern features',
      icon: '🚀',
      sections: this.createNextJsAppSections(),
      variables: this.createNextJsAppVariables(),
      aiPrompts: this.createNextJsAppPrompts()
    });

    // Mobile Development
    this.templates.set('react-native-app', {
      id: 'react-native-app',
      name: 'React Native App',
      category: 'mobile-development',
      description: 'Cross-platform mobile application with React Native',
      icon: '📱',
      sections: this.createReactNativeAppSections(),
      variables: this.createReactNativeAppVariables(),
      aiPrompts: this.createReactNativeAppPrompts()
    });

    this.templates.set('flutter-app', {
      id: 'flutter-app',
      name: 'Flutter Application',
      category: 'mobile-development',
      description: 'Cross-platform mobile app built with Flutter and Dart',
      icon: '🦋',
      sections: this.createFlutterAppSections(),
      variables: this.createFlutterAppVariables(),
      aiPrompts: this.createFlutterAppPrompts()
    });

    // Machine Learning
    this.templates.set('ml-project', {
      id: 'ml-project',
      name: 'Machine Learning Project',
      category: 'machine-learning',
      description: 'Data science and machine learning project with notebooks and models',
      icon: '🤖',
      sections: this.createMLProjectSections(),
      variables: this.createMLProjectVariables(),
      aiPrompts: this.createMLProjectPrompts()
    });

    this.templates.set('deep-learning', {
      id: 'deep-learning',
      name: 'Deep Learning Research',
      category: 'machine-learning',
      description: 'Deep learning research project with PyTorch/TensorFlow',
      icon: '🧠',
      sections: this.createDeepLearningProjectSections(),
      variables: this.createDeepLearningProjectVariables(),
      aiPrompts: this.createDeepLearningProjectPrompts()
    });

    // Blockchain & Web3
    this.templates.set('smart-contract', {
      id: 'smart-contract',
      name: 'Smart Contract',
      category: 'blockchain',
      description: 'Ethereum smart contract with Solidity and deployment scripts',
      icon: '⛓️',
      sections: this.createSmartContractSections(),
      variables: this.createSmartContractVariables(),
      aiPrompts: this.createSmartContractPrompts()
    });

    this.templates.set('dapp', {
      id: 'dapp',
      name: 'Decentralized App (DApp)',
      category: 'blockchain',
      description: 'Full-stack decentralized application with Web3 integration',
      icon: '🌐',
      sections: this.createDAppSections(),
      variables: this.createDAppVariables(),
      aiPrompts: this.createDAppPrompts()
    });

    // API & Services
    this.templates.set('rest-api', {
      id: 'rest-api',
      name: 'REST API Service',
      category: 'api-service',
      description: 'RESTful API service with authentication and documentation',
      icon: '🔗',
      sections: this.createRestApiSections(),
      variables: this.createRestApiVariables(),
      aiPrompts: this.createRestApiPrompts()
    });

    this.templates.set('graphql-api', {
      id: 'graphql-api',
      name: 'GraphQL API',
      category: 'api-service',
      description: 'GraphQL API with schema, resolvers, and subscriptions',
      icon: '📊',
      sections: this.createGraphQLApiSections(),
      variables: this.createGraphQLApiVariables(),
      aiPrompts: this.createGraphQLApiPrompts()
    });

    // Library & Package
    this.templates.set('npm-package', {
      id: 'npm-package',
      name: 'NPM Package',
      category: 'library-package',
      description: 'JavaScript/TypeScript library for NPM distribution',
      icon: '📦',
      sections: this.createNpmPackageSections(),
      variables: this.createNpmPackageVariables(),
      aiPrompts: this.createNpmPackagePrompts()
    });

    this.templates.set('python-package', {
      id: 'python-package',
      name: 'Python Package',
      category: 'library-package',
      description: 'Python package for PyPI distribution with proper setup',
      icon: '🐍',
      sections: this.createPythonPackageSections(),
      variables: this.createPythonPackageVariables(),
      aiPrompts: this.createPythonPackagePrompts()
    });
  }

  static getAllTemplates(): SpecializedTemplate[] {
    return Array.from(this.templates.values());
  }

  static getTemplatesByCategory(category: TemplateCategory): SpecializedTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  static getTemplate(id: string): SpecializedTemplate | undefined {
    return this.templates.get(id);
  }

  static generateReadmeFromTemplate(
    templateId: string, 
    variables: Record<string, any>
  ): ReadmeSection[] {
    const template = this.getTemplate(templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    return template.sections.map(section => ({
      ...section,
      content: this.interpolateVariables(section.content, variables),
      customContent: this.interpolateVariables(section.content, variables)
    }));
  }

  private static interpolateVariables(content: string, variables: Record<string, any>): string {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value || ''));
    });
    return result;
  }

  // React App Template
  private static createReactAppSections(): ReadmeSection[] {
    return [
      {
        id: 'title',
        type: 'title',
        title: 'Project Title',
        content: '# {{projectName}}\n\n{{description}}',
        order: 0,
        editable: true,
        required: true
      },
      {
        id: 'badges',
        type: 'badges',
        title: 'Badges',
        content: '![React](https://img.shields.io/badge/React-{{reactVersion}}-blue)\n![TypeScript](https://img.shields.io/badge/TypeScript-{{tsVersion}}-blue)\n![Vite](https://img.shields.io/badge/Vite-{{viteVersion}}-646CFF)',
        order: 1,
        editable: true,
        required: false
      },
      {
        id: 'tech-stack',
        type: 'tech-stack',
        title: 'Tech Stack',
        content: '## Tech Stack\n\n**Client:** React, TypeScript, {{cssFramework}}\n\n**Build Tool:** Vite\n\n**Testing:** {{testingFramework}}\n\n**State Management:** {{stateManagement}}',
        order: 2,
        editable: true,
        required: true
      },
      {
        id: 'features',
        type: 'features',
        title: 'Features',
        content: '## Features\n\n- ⚡ Lightning fast with Vite\n- 🎨 Modern UI with {{cssFramework}}\n- 📱 Responsive design\n- 🔧 TypeScript for type safety\n- 🧪 Comprehensive testing setup\n- 🚀 Optimized production builds',
        order: 3,
        editable: true,
        required: true
      },
      {
        id: 'installation',
        type: 'installation',
        title: 'Installation',
        content: '## Installation\n\n```bash\n# Clone the repository\ngit clone {{repositoryUrl}}\n\n# Navigate to the project directory\ncd {{projectName}}\n\n# Install dependencies\nnpm install\n\n# Start the development server\nnpm run dev\n```',
        order: 4,
        editable: true,
        required: true
      },
      {
        id: 'usage',
        type: 'usage',
        title: 'Usage',
        content: '## Usage\n\n```javascript\n// Example usage\nimport { {{mainComponent}} } from \'./components\';\n\nfunction App() {\n  return (\n    <div>\n      <{{mainComponent}} {{exampleProps}} />\n    </div>\n  );\n}\n```',
        order: 5,
        editable: true,
        required: true
      }
    ];
  }

  private static createReactAppVariables(): TemplateVariable[] {
    return [
      { key: 'projectName', label: 'Project Name', type: 'text', required: true, placeholder: 'my-react-app' },
      { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'A modern React application...' },
      { key: 'repositoryUrl', label: 'Repository URL', type: 'url', required: true, placeholder: 'https://github.com/user/repo' },
      { key: 'reactVersion', label: 'React Version', type: 'text', required: false, defaultValue: '18.0.0' },
      { key: 'tsVersion', label: 'TypeScript Version', type: 'text', required: false, defaultValue: '5.0.0' },
      { key: 'viteVersion', label: 'Vite Version', type: 'text', required: false, defaultValue: '4.0.0' },
      { 
        key: 'cssFramework', 
        label: 'CSS Framework', 
        type: 'select', 
        required: true, 
        options: ['Tailwind CSS', 'Material-UI', 'Styled Components', 'CSS Modules'],
        defaultValue: 'Tailwind CSS'
      },
      {
        key: 'testingFramework',
        label: 'Testing Framework',
        type: 'select',
        required: true,
        options: ['Jest + Testing Library', 'Vitest', 'Cypress'],
        defaultValue: 'Jest + Testing Library'
      },
      {
        key: 'stateManagement',
        label: 'State Management',
        type: 'select',
        required: true,
        options: ['Redux Toolkit', 'Zustand', 'Context API', 'Jotai'],
        defaultValue: 'Redux Toolkit'
      },
      { key: 'mainComponent', label: 'Main Component Name', type: 'text', required: false, defaultValue: 'App' },
      { key: 'exampleProps', label: 'Example Props', type: 'text', required: false, defaultValue: 'title="Hello World"' }
    ];
  }

  private static createReactAppPrompts(): AIPrompt[] {
    return [
      {
        section: 'description',
        prompt: 'Create a compelling description for a React application called {{projectName}} that uses {{cssFramework}} for styling and {{stateManagement}} for state management.',
        variables: ['projectName', 'cssFramework', 'stateManagement']
      },
      {
        section: 'features',
        prompt: 'Generate a list of key features for a modern React application using {{cssFramework}}, {{testingFramework}}, and {{stateManagement}}.',
        variables: ['cssFramework', 'testingFramework', 'stateManagement']
      }
    ];
  }

  // Next.js App Template
  private static createNextJsAppSections(): ReadmeSection[] {
    return [
      {
        id: 'title',
        type: 'title',
        title: 'Project Title',
        content: '# {{projectName}}\n\n{{description}}',
        order: 0,
        editable: true,
        required: true
      },
      {
        id: 'tech-stack',
        type: 'tech-stack',
        title: 'Tech Stack',
        content: '## Tech Stack\n\n**Framework:** Next.js {{nextVersion}}\n**Frontend:** React, TypeScript, {{cssFramework}}\n**Backend:** API Routes, {{database}}\n**Authentication:** {{authProvider}}\n**Deployment:** {{deploymentPlatform}}',
        order: 1,
        editable: true,
        required: true
      },
      {
        id: 'features',
        type: 'features',
        title: 'Features',
        content: '## Features\n\n- 🚀 Server-Side Rendering (SSR)\n- ⚡ Static Site Generation (SSG)\n- 🔄 API Routes for backend functionality\n- 🔐 Authentication with {{authProvider}}\n- 🎨 Styled with {{cssFramework}}\n- 📱 Fully responsive design\n- 🔍 SEO optimized\n- 📊 Analytics integration',
        order: 2,
        editable: true,
        required: true
      },
      {
        id: 'installation',
        type: 'installation',
        title: 'Getting Started',
        content: '## Getting Started\n\n```bash\n# Clone the repository\ngit clone {{repositoryUrl}}\n\n# Install dependencies\nnpm install\n\n# Set up environment variables\ncp .env.example .env.local\n\n# Run the development server\nnpm run dev\n```\n\nOpen [http://localhost:3000](http://localhost:3000) to view it in the browser.',
        order: 3,
        editable: true,
        required: true
      },
      {
        id: 'api',
        type: 'api',
        title: 'API Routes',
        content: '## API Routes\n\n```\nGET    /api/{{apiEndpoint}}     - {{apiDescription}}\nPOST   /api/{{apiEndpoint}}     - Create new {{apiResource}}\nPUT    /api/{{apiEndpoint}}/[id] - Update {{apiResource}}\nDELETE /api/{{apiEndpoint}}/[id] - Delete {{apiResource}}\n```',
        order: 4,
        editable: true,
        required: false
      }
    ];
  }

  private static createNextJsAppVariables(): TemplateVariable[] {
    return [
      { key: 'projectName', label: 'Project Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'repositoryUrl', label: 'Repository URL', type: 'url', required: true },
      { key: 'nextVersion', label: 'Next.js Version', type: 'text', required: false, defaultValue: '14.0.0' },
      { 
        key: 'cssFramework', 
        label: 'CSS Framework', 
        type: 'select', 
        required: true,
        options: ['Tailwind CSS', 'Styled Components', 'CSS Modules', 'Material-UI']
      },
      {
        key: 'database',
        label: 'Database',
        type: 'select',
        required: true,
        options: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Supabase', 'PlanetScale']
      },
      {
        key: 'authProvider',
        label: 'Authentication Provider',
        type: 'select',
        required: true,
        options: ['NextAuth.js', 'Auth0', 'Firebase Auth', 'Supabase Auth', 'Clerk']
      },
      {
        key: 'deploymentPlatform',
        label: 'Deployment Platform',
        type: 'select',
        required: true,
        options: ['Vercel', 'Netlify', 'AWS', 'Heroku', 'Railway']
      },
      { key: 'apiEndpoint', label: 'Main API Endpoint', type: 'text', required: false, defaultValue: 'users' },
      { key: 'apiDescription', label: 'API Description', type: 'text', required: false, defaultValue: 'Get all users' },
      { key: 'apiResource', label: 'API Resource', type: 'text', required: false, defaultValue: 'user' }
    ];
  }

  private static createNextJsAppPrompts(): AIPrompt[] {
    return [
      {
        section: 'description',
        prompt: 'Create a description for a Next.js full-stack application called {{projectName}} using {{database}} database and {{authProvider}} for authentication.',
        variables: ['projectName', 'database', 'authProvider']
      }
    ];
  }

  // Machine Learning Project Template
  private static createMLProjectSections(): ReadmeSection[] {
    return [
      {
        id: 'title',
        type: 'title',
        title: 'Project Title',
        content: '# {{projectName}}\n\n{{description}}',
        order: 0,
        editable: true,
        required: true
      },
      {
        id: 'tech-stack',
        type: 'tech-stack',
        title: 'Tech Stack',
        content: '## Tech Stack\n\n**Language:** Python {{pythonVersion}}\n**ML Framework:** {{mlFramework}}\n**Data Processing:** {{dataProcessing}}\n**Visualization:** {{visualization}}\n**Notebook:** Jupyter\n**Environment:** {{environment}}',
        order: 1,
        editable: true,
        required: true
      },
      {
        id: 'dataset',
        type: 'custom',
        title: 'Dataset',
        content: '## Dataset\n\n- **Source:** {{datasetSource}}\n- **Size:** {{datasetSize}}\n- **Features:** {{datasetFeatures}}\n- **Target:** {{targetVariable}}\n\n### Data Description\n{{datasetDescription}}',
        order: 2,
        editable: true,
        required: true
      },
      {
        id: 'methodology',
        type: 'custom',
        title: 'Methodology',
        content: '## Methodology\n\n### 1. Data Preprocessing\n- {{preprocessingSteps}}\n\n### 2. Feature Engineering\n- {{featureEngineering}}\n\n### 3. Model Selection\n- {{modelTypes}}\n\n### 4. Evaluation Metrics\n- {{evaluationMetrics}}',
        order: 3,
        editable: true,
        required: true
      },
      {
        id: 'results',
        type: 'custom',
        title: 'Results',
        content: '## Results\n\n| Model | {{metric1}} | {{metric2}} | {{metric3}} |\n|-------|-------------|-------------|-------------|\n| {{model1}} | {{model1Score1}} | {{model1Score2}} | {{model1Score3}} |\n| {{model2}} | {{model2Score1}} | {{model2Score2}} | {{model2Score3}} |\n\n### Best Model: {{bestModel}}\n{{modelDescription}}',
        order: 4,
        editable: true,
        required: true
      },
      {
        id: 'installation',
        type: 'installation',
        title: 'Installation',
        content: '## Installation\n\n```bash\n# Clone the repository\ngit clone {{repositoryUrl}}\n\n# Create virtual environment\npython -m venv venv\nsource venv/bin/activate  # On Windows: venv\\Scripts\\activate\n\n# Install dependencies\npip install -r requirements.txt\n\n# Start Jupyter\njupyter notebook\n```',
        order: 5,
        editable: true,
        required: true
      }
    ];
  }

  private static createMLProjectVariables(): TemplateVariable[] {
    return [
      { key: 'projectName', label: 'Project Name', type: 'text', required: true },
      { key: 'description', label: 'Project Description', type: 'textarea', required: true },
      { key: 'repositoryUrl', label: 'Repository URL', type: 'url', required: true },
      { key: 'pythonVersion', label: 'Python Version', type: 'text', required: false, defaultValue: '3.9+' },
      {
        key: 'mlFramework',
        label: 'ML Framework',
        type: 'select',
        required: true,
        options: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'XGBoost', 'LightGBM']
      },
      {
        key: 'dataProcessing',
        label: 'Data Processing',
        type: 'select',
        required: true,
        options: ['Pandas + NumPy', 'Polars', 'Dask', 'Spark']
      },
      {
        key: 'visualization',
        label: 'Visualization',
        type: 'select',
        required: true,
        options: ['Matplotlib + Seaborn', 'Plotly', 'Bokeh', 'Altair']
      },
      {
        key: 'environment',
        label: 'Environment',
        type: 'select',
        required: true,
        options: ['Conda', 'pip + venv', 'Poetry', 'Docker']
      },
      { key: 'datasetSource', label: 'Dataset Source', type: 'text', required: true },
      { key: 'datasetSize', label: 'Dataset Size', type: 'text', required: true },
      { key: 'datasetFeatures', label: 'Number of Features', type: 'text', required: true },
      { key: 'targetVariable', label: 'Target Variable', type: 'text', required: true },
      { key: 'datasetDescription', label: 'Dataset Description', type: 'textarea', required: true }
    ];
  }

  private static createMLProjectPrompts(): AIPrompt[] {
    return [
      {
        section: 'description',
        prompt: 'Create a description for a machine learning project called {{projectName}} using {{mlFramework}} to predict {{targetVariable}} from {{datasetSource}} dataset.',
        variables: ['projectName', 'mlFramework', 'targetVariable', 'datasetSource']
      }
    ];
  }

  // Additional template creation methods for other categories would follow similar patterns...
  
  // Placeholder methods for other templates
  private static createReactNativeAppSections(): ReadmeSection[] { return []; }
  private static createReactNativeAppVariables(): TemplateVariable[] { return []; }
  private static createReactNativeAppPrompts(): AIPrompt[] { return []; }
  
  private static createFlutterAppSections(): ReadmeSection[] { return []; }
  private static createFlutterAppVariables(): TemplateVariable[] { return []; }
  private static createFlutterAppPrompts(): AIPrompt[] { return []; }

  private static createDeepLearningProjectSections(): ReadmeSection[] { return []; }
  private static createDeepLearningProjectVariables(): TemplateVariable[] { return []; }
  private static createDeepLearningProjectPrompts(): AIPrompt[] { return []; }

  private static createSmartContractSections(): ReadmeSection[] { return []; }
  private static createSmartContractVariables(): TemplateVariable[] { return []; }
  private static createSmartContractPrompts(): AIPrompt[] { return []; }

  private static createDAppSections(): ReadmeSection[] { return []; }
  private static createDAppVariables(): TemplateVariable[] { return []; }
  private static createDAppPrompts(): AIPrompt[] { return []; }

  private static createRestApiSections(): ReadmeSection[] { return []; }
  private static createRestApiVariables(): TemplateVariable[] { return []; }
  private static createRestApiPrompts(): AIPrompt[] { return []; }

  private static createGraphQLApiSections(): ReadmeSection[] { return []; }
  private static createGraphQLApiVariables(): TemplateVariable[] { return []; }
  private static createGraphQLApiPrompts(): AIPrompt[] { return []; }

  private static createNpmPackageSections(): ReadmeSection[] { return []; }
  private static createNpmPackageVariables(): TemplateVariable[] { return []; }
  private static createNpmPackagePrompts(): AIPrompt[] { return []; }

  private static createPythonPackageSections(): ReadmeSection[] { return []; }
  private static createPythonPackageVariables(): TemplateVariable[] { return []; }
  private static createPythonPackagePrompts(): AIPrompt[] { return []; }
}
