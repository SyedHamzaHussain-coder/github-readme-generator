// Advanced Repository Analysis Engine
export interface RepositoryAnalysis {
  repository: {
    name: string;
    description: string;
    cloneUrl: string;
    language: string;
    stars: number;
    forks: number;
    size: number;
  };
  files: Array<{
    path: string;
    content: string;
    size: number;
  }>;
  techStack: TechStackAnalysis;
  complexity: ComplexityScore;
  quality: QualityMetrics;
  smartSuggestions: SmartSuggestion[];
  projectType: ProjectType;
  architecture: ArchitecturePattern;
  dependencies: DependencyAnalysis;
  badges: RecommendedBadge[];
  sections: RecommendedSection[];
  performance: PerformanceMetrics;
  security: SecurityAnalysis;
  insights: {
    projectType: string;
    mainPurpose: string;
    targetAudience: string;
    developmentStage: string;
  };
}

export interface TechStackAnalysis {
  primary: string;
  secondary: string[];
  frameworks: Framework[];
  databases: Database[];
  deployment: DeploymentPlatform[];
  cicd: CICDPlatform[];
  testing: TestingFramework[];
  score: number;
  frontend: {
    languages: Array<{ name: string; percentage: number }>;
    frameworks: Array<{ name: string; version?: string; confidence: number }>;
  };
  backend: {
    languages: Array<{ name: string; percentage: number }>;
    frameworks: Array<{ name: string; version?: string; confidence: number }>;
  };
  mobile: {
    frameworks: Array<{ name: string; version?: string; confidence: number }>;
  };
  cloudServices: Array<{ name: string; type: string; confidence: number }>;
}

export interface ComplexityScore {
  overall: number;
  codebase: number;
  dependencies: number;
  architecture: number;
  factors: ComplexityFactor[];
}

export interface QualityMetrics {
  documentation: number;
  testing: number;
  security: number;
  performance: number;
  maintainability: number;
  overall: number;
}

export interface SmartSuggestion {
  id: string;
  type: 'badge' | 'section' | 'improvement' | 'security' | 'performance' | 'documentation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementation: string;
  automated?: boolean;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
}

export interface RecommendedBadge {
  type: string;
  url: string;
  alt: string;
  reason: string;
  priority: number;
}

export interface RecommendedSection {
  name: string;
  content: string;
  priority: number;
  reason: string;
  customizable: boolean;
}

export interface PerformanceMetrics {
  bundleSize?: number;
  loadTime?: number;
  buildTime?: number;
  score: number;
  recommendations: string[];
}

export interface SecurityAnalysis {
  vulnerabilities: SecurityVulnerability[];
  score: number;
  recommendations: string[];
}

export interface SecurityVulnerability {
  package: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  description: string;
  fixAvailable: boolean;
}

export type ProjectType = 
  | 'web-app' | 'mobile-app' | 'api' | 'library' | 'cli-tool' 
  | 'desktop-app' | 'game' | 'ml-project' | 'web3-dapp' 
  | 'documentation' | 'tutorial' | 'portfolio' | 'blockchain'
  | 'ai-ml' | 'iot' | 'data-science';

export type ArchitecturePattern = 
  | 'mvc' | 'mvvm' | 'microservices' | 'monolith' 
  | 'serverless' | 'jamstack' | 'spa' | 'pwa'
  | 'event-driven' | 'layered' | 'hexagonal';

export interface Framework {
  name: string;
  version?: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'desktop' | 'ml' | 'blockchain';
  confidence: number;
}

export interface Database {
  type: 'sql' | 'nosql' | 'cache' | 'search' | 'graph' | 'vector';
  name: string;
  confidence: number;
}

export interface DeploymentPlatform {
  name: string;
  type: 'cloud' | 'container' | 'serverless' | 'static' | 'edge';
  confidence: number;
}

export interface CICDPlatform {
  name: string;
  files: string[];
  confidence: number;
}

export interface TestingFramework {
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  confidence: number;
}

export interface DependencyAnalysis {
  total: number;
  direct: number;
  dev: number;
  outdated: number;
  security: SecurityIssue[];
  licenses: License[];
  bundleSize?: BundleAnalysis;
}

export interface SecurityIssue {
  package: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  recommendation: string;
}

export interface License {
  name: string;
  compatibility: 'compatible' | 'warning' | 'incompatible';
  packages: string[];
}

export interface BundleAnalysis {
  size: number;
  gzipped: number;
  recommendations: string[];
}

export interface ComplexityFactor {
  name: string;
  score: number;
  description: string;
  impact: string;
}

export class RepositoryAnalyzer {
  private openaiApiKey?: string;

  constructor(openaiApiKey?: string) {
    this.openaiApiKey = openaiApiKey;
  }

  static async analyzeRepository(repositoryUrl: string, githubToken: string): Promise<RepositoryAnalysis> {
    // Extract repository info from URL
    const [owner, repo] = repositoryUrl.replace('https://github.com/', '').split('/');
    
    // Fetch repository data from GitHub API
    const repoData = await this.fetchRepositoryData(owner, repo, githubToken);
    
    // Create analyzer instance and analyze
    const analyzer = new RepositoryAnalyzer();
    return analyzer.analyzeRepository(repoData);
  }

  private static async fetchRepositoryData(owner: string, repo: string, token: string): Promise<any> {
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
    
    const headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };

    try {
      // Fetch basic repository info
      const repoResponse = await fetch(baseUrl, { headers });
      if (!repoResponse.ok) {
        throw new Error(`Failed to fetch repository: ${repoResponse.statusText}`);
      }
      const repoInfo = await repoResponse.json();

      // Fetch languages
      const languagesResponse = await fetch(`${baseUrl}/languages`, { headers });
      const languages = languagesResponse.ok ? await languagesResponse.json() : {};

      // Fetch contents (limited to key files)
      const contentsResponse = await fetch(`${baseUrl}/contents`, { headers });
      const contents = contentsResponse.ok ? await contentsResponse.json() : [];

      return {
        ...repoInfo,
        languages,
        files: contents.map((file: any) => file.name),
        contents
      };
    } catch (error) {
      console.error('Error fetching repository data:', error);
      throw error;
    }
  }

  async analyzeRepository(repoData: any): Promise<RepositoryAnalysis> {
    console.log('🔍 Starting comprehensive repository analysis...');
    
    const analysis: RepositoryAnalysis = {
      repository: {
        name: repoData.name || 'Unknown',
        description: repoData.description || '',
        cloneUrl: repoData.clone_url || repoData.html_url || '',
        language: repoData.language || 'Unknown',
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        size: repoData.size || 0
      },
      files: repoData.files || [],
      techStack: await this.analyzeTechStack(repoData),
      complexity: await this.calculateComplexity(repoData),
      quality: await this.assessQuality(repoData),
      smartSuggestions: [],
      projectType: await this.detectProjectType(repoData),
      architecture: await this.identifyArchitecture(repoData),
      dependencies: await this.analyzeDependencies(repoData),
      badges: await this.recommendBadges(repoData),
      sections: await this.recommendSections(repoData),
      performance: await this.analyzePerformance(repoData),
      security: await this.analyzeSecurity(repoData),
      insights: {
        projectType: 'Web Application',
        mainPurpose: 'Development Tool',
        targetAudience: 'Developers',
        developmentStage: 'Active'
      }
    };

    // Generate suggestions based on analysis
    analysis.smartSuggestions = await this.generateSuggestions(analysis, repoData);

    // Use AI for enhanced analysis if API key is available
    if (this.openaiApiKey) {
      analysis.smartSuggestions = await this.enhanceSuggestionsWithAI(analysis, repoData);
    }

    console.log('✅ Repository analysis complete');
    return analysis;
  }

  private async analyzeTechStack(repoData: any): Promise<TechStackAnalysis> {
    const techStack: TechStackAnalysis = {
      primary: repoData.language || 'Unknown',
      secondary: Object.keys(repoData.languages || {}).slice(1, 4),
      frameworks: [],
      databases: [],
      deployment: [],
      cicd: [],
      testing: [],
      score: 0,
      frontend: {
        languages: Object.entries(repoData.languages || {}).map(([lang, percentage]) => ({
          name: lang,
          percentage: percentage as number
        })).filter(l => ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'React'].includes(l.name)),
        frameworks: []
      },
      backend: {
        languages: Object.entries(repoData.languages || {}).map(([lang, percentage]) => ({
          name: lang,
          percentage: percentage as number
        })).filter(l => ['Python', 'Node.js', 'Java', 'C#', 'PHP', 'Go', 'Rust'].includes(l.name)),
        frameworks: []
      },
      mobile: {
        frameworks: []
      },
      cloudServices: []
    };

    // Analyze based on files and dependencies
    if (repoData.files) {
      // Detect frameworks
      if (repoData.files.includes('package.json')) {
        const packageJson = repoData.packageJson;
        if (packageJson?.dependencies) {
          techStack.frameworks = this.detectFrameworks(packageJson.dependencies);
          techStack.databases = this.detectDatabases(packageJson.dependencies);
          techStack.testing = this.detectTestingFrameworks(packageJson.dependencies);
        }
      }

      // Detect Python frameworks
      if (repoData.files.includes('requirements.txt') || repoData.files.includes('pyproject.toml')) {
        techStack.frameworks.push(...this.detectPythonFrameworks(repoData.files));
      }

      // Detect CI/CD
      techStack.cicd = this.detectCICD(repoData.files);
      
      // Detect deployment platforms
      techStack.deployment = this.detectDeployment(repoData.files);
    }

    // Calculate tech stack score
    techStack.score = this.calculateTechStackScore(techStack);

    return techStack;
  }

  private detectFrameworks(dependencies: Record<string, string>): Framework[] {
    const frameworkMap: Record<string, { category: Framework['category'], confidence: number }> = {
      // Frontend Frameworks
      'react': { category: 'frontend', confidence: 0.9 },
      'vue': { category: 'frontend', confidence: 0.9 },
      'angular': { category: 'frontend', confidence: 0.9 },
      'svelte': { category: 'frontend', confidence: 0.9 },
      'solid-js': { category: 'frontend', confidence: 0.8 },
      
      // Fullstack Frameworks
      'next': { category: 'fullstack', confidence: 0.8 },
      'nuxt': { category: 'fullstack', confidence: 0.8 },
      'remix': { category: 'fullstack', confidence: 0.8 },
      'sveltekit': { category: 'fullstack', confidence: 0.8 },
      
      // Backend Frameworks
      'express': { category: 'backend', confidence: 0.8 },
      'fastify': { category: 'backend', confidence: 0.8 },
      'koa': { category: 'backend', confidence: 0.8 },
      'nestjs': { category: 'backend', confidence: 0.8 },
      'hapi': { category: 'backend', confidence: 0.7 },
      
      // Mobile Frameworks
      'react-native': { category: 'mobile', confidence: 0.9 },
      'expo': { category: 'mobile', confidence: 0.8 },
      'ionic': { category: 'mobile', confidence: 0.7 },
      
      // Desktop Frameworks
      'electron': { category: 'desktop', confidence: 0.9 },
      'tauri': { category: 'desktop', confidence: 0.8 },
      
      // ML/AI Frameworks
      'tensorflow': { category: 'ml', confidence: 0.9 },
      'pytorch': { category: 'ml', confidence: 0.9 },
      '@tensorflow/tfjs': { category: 'ml', confidence: 0.8 },
      
      // Blockchain Frameworks
      'web3': { category: 'blockchain', confidence: 0.8 },
      'ethers': { category: 'blockchain', confidence: 0.8 },
      'hardhat': { category: 'blockchain', confidence: 0.8 },
      'truffle': { category: 'blockchain', confidence: 0.7 }
    };

    return Object.keys(dependencies)
      .filter(dep => Object.keys(frameworkMap).some(fw => dep.includes(fw)))
      .map(dep => {
        const framework = Object.keys(frameworkMap).find(fw => dep.includes(fw))!;
        return {
          name: framework,
          version: dependencies[dep],
          category: frameworkMap[framework].category,
          confidence: frameworkMap[framework].confidence
        };
      });
  }

  private detectPythonFrameworks(files: string[]): Framework[] {
    const pythonFrameworks: Framework[] = [];
    
    // Common Python framework indicators
    const indicators = {
      'django': ['manage.py', 'settings.py'],
      'flask': ['app.py', 'flask'],
      'fastapi': ['main.py', 'fastapi'],
      'streamlit': ['streamlit'],
      'jupyter': ['.ipynb'],
      'pytorch': ['torch'],
      'tensorflow': ['tensorflow']
    };

    Object.entries(indicators).forEach(([framework, fileIndicators]) => {
      if (fileIndicators.some(indicator => files.some(f => f.includes(indicator)))) {
        pythonFrameworks.push({
          name: framework,
          category: framework.includes('torch') || framework.includes('tensorflow') ? 'ml' : 'backend',
          confidence: 0.8
        });
      }
    });

    return pythonFrameworks;
  }

  private detectDatabases(dependencies: Record<string, string>): Database[] {
    const dbMap: Record<string, { type: Database['type'], confidence: number }> = {
      'mongodb': { type: 'nosql', confidence: 0.9 },
      'mongoose': { type: 'nosql', confidence: 0.8 },
      'redis': { type: 'cache', confidence: 0.9 },
      'mysql': { type: 'sql', confidence: 0.9 },
      'mysql2': { type: 'sql', confidence: 0.9 },
      'pg': { type: 'sql', confidence: 0.9 },
      'postgres': { type: 'sql', confidence: 0.9 },
      'sqlite': { type: 'sql', confidence: 0.8 },
      'sqlite3': { type: 'sql', confidence: 0.8 },
      'elasticsearch': { type: 'search', confidence: 0.9 },
      'neo4j': { type: 'graph', confidence: 0.9 },
      'pinecone': { type: 'vector', confidence: 0.8 },
      'chromadb': { type: 'vector', confidence: 0.8 }
    };

    return Object.keys(dependencies)
      .filter(dep => Object.keys(dbMap).some(db => dep.includes(db)))
      .map(dep => {
        const db = Object.keys(dbMap).find(d => dep.includes(d))!;
        return {
          name: db,
          type: dbMap[db].type,
          confidence: dbMap[db].confidence
        };
      });
  }

  private detectTestingFrameworks(dependencies: Record<string, string>): TestingFramework[] {
    const testMap: Record<string, { type: TestingFramework['type'], confidence: number }> = {
      'jest': { type: 'unit', confidence: 0.9 },
      'mocha': { type: 'unit', confidence: 0.8 },
      'vitest': { type: 'unit', confidence: 0.9 },
      'cypress': { type: 'e2e', confidence: 0.9 },
      'playwright': { type: 'e2e', confidence: 0.9 },
      'puppeteer': { type: 'e2e', confidence: 0.8 },
      'supertest': { type: 'integration', confidence: 0.8 },
      'k6': { type: 'performance', confidence: 0.8 },
      'lighthouse': { type: 'performance', confidence: 0.7 }
    };

    return Object.keys(dependencies)
      .filter(dep => Object.keys(testMap).some(test => dep.includes(test)))
      .map(dep => {
        const test = Object.keys(testMap).find(t => dep.includes(t))!;
        return {
          name: test,
          type: testMap[test].type,
          confidence: testMap[test].confidence
        };
      });
  }

  private detectCICD(files: string[]): CICDPlatform[] {
    const cicdPlatforms: CICDPlatform[] = [];

    if (files.some(f => f.includes('.github/workflows'))) {
      cicdPlatforms.push({
        name: 'GitHub Actions',
        files: files.filter(f => f.includes('.github/workflows')),
        confidence: 0.9
      });
    }

    if (files.includes('.gitlab-ci.yml')) {
      cicdPlatforms.push({
        name: 'GitLab CI',
        files: ['.gitlab-ci.yml'],
        confidence: 0.9
      });
    }

    if (files.includes('Jenkinsfile')) {
      cicdPlatforms.push({
        name: 'Jenkins',
        files: ['Jenkinsfile'],
        confidence: 0.8
      });
    }

    if (files.includes('.circleci/config.yml')) {
      cicdPlatforms.push({
        name: 'CircleCI',
        files: ['.circleci/config.yml'],
        confidence: 0.8
      });
    }

    return cicdPlatforms;
  }

  private detectDeployment(files: string[]): DeploymentPlatform[] {
    const deployment: DeploymentPlatform[] = [];

    if (files.includes('Dockerfile')) {
      deployment.push({
        name: 'Docker',
        type: 'container',
        confidence: 0.9
      });
    }

    if (files.includes('vercel.json') || files.includes('.vercel')) {
      deployment.push({
        name: 'Vercel',
        type: 'serverless',
        confidence: 0.9
      });
    }

    if (files.includes('netlify.toml') || files.includes('_redirects')) {
      deployment.push({
        name: 'Netlify',
        type: 'static',
        confidence: 0.9
      });
    }

    if (files.includes('serverless.yml')) {
      deployment.push({
        name: 'Serverless Framework',
        type: 'serverless',
        confidence: 0.8
      });
    }

    return deployment;
  }

  private calculateTechStackScore(techStack: TechStackAnalysis): number {
    let score = 0;
    
    // Base score for having a primary language
    if (techStack.primary !== 'Unknown') score += 20;
    
    // Points for frameworks
    score += Math.min(techStack.frameworks.length * 15, 45);
    
    // Points for databases
    score += Math.min(techStack.databases.length * 10, 20);
    
    // Points for CI/CD
    score += Math.min(techStack.cicd.length * 10, 20);
    
    // Points for testing
    score += Math.min(techStack.testing.length * 8, 15);
    
    // Points for deployment
    score += Math.min(techStack.deployment.length * 5, 10);

    return Math.min(score, 100);
  }

  private async calculateComplexity(repoData: any): Promise<ComplexityScore> {
    const factors: ComplexityFactor[] = [];
    let codebaseScore = 50;
    let dependenciesScore = 50;
    let architectureScore = 50;

    // Analyze codebase complexity
    if (repoData.size) {
      if (repoData.size > 100000) {
        codebaseScore += 30;
        factors.push({
          name: 'Large Codebase',
          score: 30,
          description: 'Repository size indicates high complexity',
          impact: 'Requires comprehensive documentation and modular architecture'
        });
      }
    }

    // Analyze dependency complexity
    if (repoData.packageJson?.dependencies) {
      const depCount = Object.keys(repoData.packageJson.dependencies).length;
      if (depCount > 50) {
        dependenciesScore += 25;
        factors.push({
          name: 'High Dependency Count',
          score: 25,
          description: `${depCount} dependencies detected`,
          impact: 'May require dependency management documentation'
        });
      }
    }

    // Analyze architecture complexity
    if (repoData.files?.some((f: string) => f.includes('microservice') || f.includes('service'))) {
      architectureScore += 20;
      factors.push({
        name: 'Microservices Architecture',
        score: 20,
        description: 'Complex distributed architecture detected',
        impact: 'Requires architecture documentation and service diagrams'
      });
    }

    const overall = Math.round((codebaseScore + dependenciesScore + architectureScore) / 3);

    return {
      overall,
      codebase: codebaseScore,
      dependencies: dependenciesScore,
      architecture: architectureScore,
      factors
    };
  }

  private async assessQuality(repoData: any): Promise<QualityMetrics> {
    let documentation = 30; // Base score
    let testing = 20;
    let security = 40;
    let performance = 50;
    let maintainability = 50;

    // Documentation assessment
    if (repoData.files?.includes('README.md')) documentation += 20;
    if (repoData.files?.some((f: string) => f.includes('docs/') || f.includes('documentation/'))) documentation += 25;
    if (repoData.files?.includes('CONTRIBUTING.md')) documentation += 15;
    if (repoData.files?.includes('LICENSE')) documentation += 10;

    // Testing assessment
    if (repoData.files?.some((f: string) => f.includes('test') || f.includes('spec'))) testing += 30;
    if (repoData.packageJson?.scripts?.test) testing += 25;
    if (repoData.files?.includes('jest.config.js') || repoData.files?.includes('vitest.config.ts')) testing += 15;
    if (repoData.files?.some((f: string) => f.includes('cypress') || f.includes('playwright'))) testing += 10;

    // Security assessment
    if (repoData.files?.includes('.github/dependabot.yml')) security += 20;
    if (repoData.files?.includes('SECURITY.md')) security += 15;
    if (repoData.packageJson?.scripts?.audit) security += 10;
    if (repoData.files?.some((f: string) => f.includes('eslint'))) security += 5;

    // Performance assessment
    if (repoData.files?.includes('lighthouse.config.js')) performance += 20;
    if (repoData.files?.includes('webpack.config.js') || repoData.files?.includes('vite.config.ts')) performance += 15;
    if (repoData.packageJson?.scripts?.build) performance += 10;
    if (repoData.files?.some((f: string) => f.includes('optimization'))) performance += 5;

    // Maintainability assessment
    if (repoData.files?.includes('.prettierrc') || repoData.files?.includes('prettier.config.js')) maintainability += 10;
    if (repoData.files?.includes('.eslintrc') || repoData.files?.includes('eslint.config.js')) maintainability += 15;
    if (repoData.files?.includes('tsconfig.json')) maintainability += 15;
    if (repoData.files?.includes('.editorconfig')) maintainability += 5;
    if (repoData.files?.includes('CHANGELOG.md')) maintainability += 5;

    const overall = Math.round((documentation + testing + security + performance + maintainability) / 5);

    return {
      documentation: Math.min(documentation, 100),
      testing: Math.min(testing, 100),
      security: Math.min(security, 100),
      performance: Math.min(performance, 100),
      maintainability: Math.min(maintainability, 100),
      overall: Math.min(overall, 100)
    };
  }

  private async analyzePerformance(repoData: any): Promise<PerformanceMetrics> {
    const recommendations: string[] = [];
    let score = 70; // Base score

    // Bundle size analysis
    if (repoData.packageJson?.dependencies) {
      const heavyDeps = ['moment', 'lodash', 'jquery'];
      const hasHeavyDeps = heavyDeps.some(dep => repoData.packageJson.dependencies[dep]);
      
      if (hasHeavyDeps) {
        score -= 15;
        recommendations.push('Consider using lighter alternatives to heavy dependencies');
      }
    }

    // Build optimization
    if (!repoData.files?.some((f: string) => f.includes('webpack') || f.includes('vite') || f.includes('rollup'))) {
      recommendations.push('Add build optimization with bundler configuration');
      score -= 10;
    }

    // Image optimization
    if (repoData.files?.some((f: string) => f.includes('.jpg') || f.includes('.png'))) {
      recommendations.push('Optimize images with WebP format and compression');
    }

    return {
      score: Math.max(score, 0),
      recommendations
    };
  }

  private async analyzeSecurity(repoData: any): Promise<SecurityAnalysis> {
    const vulnerabilities: SecurityVulnerability[] = [];
    const recommendations: string[] = [];
    let score = 80; // Base score

    // Check for common security issues
    if (!repoData.files?.includes('.github/dependabot.yml')) {
      recommendations.push('Enable Dependabot for automated security updates');
      score -= 10;
    }

    if (!repoData.files?.includes('SECURITY.md')) {
      recommendations.push('Add security policy documentation');
      score -= 5;
    }

    // Environment variables check
    if (repoData.files?.includes('.env') && !repoData.files?.includes('.gitignore')) {
      vulnerabilities.push({
        package: 'repository',
        severity: 'high',
        title: 'Environment file not ignored',
        description: '.env file may contain sensitive information',
        fixAvailable: true
      });
      score -= 20;
    }

    return {
      vulnerabilities,
      score: Math.max(score, 0),
      recommendations
    };
  }

  private async detectProjectType(repoData: any): Promise<ProjectType> {
    const { files = [], packageJson, language } = repoData;

    // AI/ML Detection
    if (files.some((f: string) => f.includes('.ipynb')) || 
        packageJson?.dependencies?.tensorflow || 
        packageJson?.dependencies?.pytorch ||
        files.some((f: string) => f.includes('model') || f.includes('dataset'))) {
      return 'ml-project';
    }

    // Web3/Blockchain Detection
    if (packageJson?.dependencies?.web3 || 
        packageJson?.dependencies?.ethers ||
        files.includes('hardhat.config.js') ||
        files.some((f: string) => f.includes('contract'))) {
      return 'web3-dapp';
    }

    // Mobile App Detection
    if (packageJson?.dependencies?.['react-native'] || 
        packageJson?.dependencies?.expo ||
        files.includes('android/') ||
        files.includes('ios/')) {
      return 'mobile-app';
    }

    // Desktop App Detection
    if (packageJson?.dependencies?.electron || 
        packageJson?.dependencies?.tauri) {
      return 'desktop-app';
    }

    // API Detection
    if (packageJson?.dependencies?.express || 
        packageJson?.dependencies?.fastify ||
        files.some((f: string) => f.includes('api') || f.includes('server'))) {
      return 'api';
    }

    // CLI Tool Detection
    if (packageJson?.bin || 
        files.includes('bin/') ||
        packageJson?.dependencies?.commander ||
        packageJson?.dependencies?.yargs) {
      return 'cli-tool';
    }

    // Library Detection
    if (packageJson?.main && !packageJson?.dependencies?.react && !packageJson?.dependencies?.vue) {
      return 'library';
    }

    // Game Detection
    if (packageJson?.dependencies?.phaser || 
        packageJson?.dependencies?.['three.js'] ||
        files.some((f: string) => f.includes('game'))) {
      return 'game';
    }

    // Documentation Detection
    if (files.some((f: string) => f.includes('gitbook') || f.includes('docusaurus')) ||
        packageJson?.dependencies?.vuepress ||
        packageJson?.dependencies?.gatsby) {
      return 'documentation';
    }

    // Default to web-app
    return 'web-app';
  }

  private async identifyArchitecture(repoData: any): Promise<ArchitecturePattern> {
    const { files = [], packageJson } = repoData;

    // Microservices
    if (files.some((f: string) => f.includes('docker-compose') || f.includes('kubernetes'))) {
      return 'microservices';
    }

    // Serverless
    if (files.includes('serverless.yml') || 
        files.some((f: string) => f.includes('lambda') || f.includes('functions'))) {
      return 'serverless';
    }

    // JAMstack
    if (packageJson?.dependencies?.gatsby || 
        packageJson?.dependencies?.next ||
        files.includes('netlify.toml')) {
      return 'jamstack';
    }

    // SPA
    if (packageJson?.dependencies?.react || 
        packageJson?.dependencies?.vue ||
        packageJson?.dependencies?.angular) {
      return 'spa';
    }

    // PWA
    if (files.includes('manifest.json') || 
        files.includes('sw.js') ||
        files.includes('service-worker.js')) {
      return 'pwa';
    }

    // Default to monolith
    return 'monolith';
  }

  private async analyzeDependencies(repoData: any): Promise<DependencyAnalysis> {
    const packageJson = repoData.packageJson;
    if (!packageJson) {
      return {
        total: 0,
        direct: 0,
        dev: 0,
        outdated: 0,
        security: [],
        licenses: []
      };
    }

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length,
      direct: Object.keys(dependencies).length,
      dev: Object.keys(devDependencies).length,
      outdated: 0, // Would need API call to npm to check
      security: [], // Would need security audit
      licenses: [] // Would need license analysis
    };
  }

  private async recommendBadges(repoData: any): Promise<RecommendedBadge[]> {
    const badges: RecommendedBadge[] = [];

    // Language badge
    if (repoData.language) {
      badges.push({
        type: 'language',
        url: `https://img.shields.io/badge/language-${repoData.language}-blue`,
        alt: `${repoData.language} Language`,
        reason: 'Shows primary programming language',
        priority: 1
      });
    }

    // License badge
    if (repoData.license) {
      badges.push({
        type: 'license',
        url: `https://img.shields.io/badge/license-${repoData.license.key}-green`,
        alt: `${repoData.license.name} License`,
        reason: 'Shows project license',
        priority: 2
      });
    }

    // CI/CD badges
    if (repoData.files?.some((f: string) => f.includes('.github/workflows'))) {
      badges.push({
        type: 'ci',
        url: `https://github.com/${repoData.full_name}/workflows/CI/badge.svg`,
        alt: 'CI Status',
        reason: 'Shows build status',
        priority: 3
      });
    }

    return badges;
  }

  private async recommendSections(repoData: any): Promise<RecommendedSection[]> {
    const sections: RecommendedSection[] = [];

    // API documentation section for APIs
    if (repoData.projectType === 'api') {
      sections.push({
        name: 'API Documentation',
        content: '## API Documentation\n\nDetailed API endpoints and usage examples.',
        priority: 1,
        reason: 'Essential for API projects',
        customizable: true
      });
    }

    // Installation section for libraries
    if (repoData.projectType === 'library') {
      sections.push({
        name: 'Installation',
        content: '## Installation\n\n```bash\nnpm install package-name\n```',
        priority: 1,
        reason: 'Critical for library adoption',
        customizable: true
      });
    }

    return sections;
  }

  private async generateSuggestions(analysis: RepositoryAnalysis, repoData: any): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Documentation suggestions
    if (analysis.quality.documentation < 70) {
      suggestions.push({
        id: 'improve-docs',
        type: 'documentation',
        priority: 'high',
        title: 'Improve Documentation',
        description: 'Add comprehensive documentation to increase project quality',
        implementation: 'Add README sections, API docs, and contributing guidelines',
        impact: 'high',
        effort: 'medium',
        automated: false
      });
    }

    // Testing suggestions
    if (analysis.quality.testing < 50) {
      suggestions.push({
        id: 'add-tests',
        type: 'improvement',
        priority: 'high',
        title: 'Add Test Coverage',
        description: 'Implement comprehensive testing to improve code quality',
        implementation: 'Set up Jest/Vitest and write unit tests',
        impact: 'high',
        effort: 'high',
        automated: false
      });
    }

    // Security suggestions
    if (analysis.security.score < 80) {
      suggestions.push({
        id: 'improve-security',
        type: 'security',
        priority: 'high',
        title: 'Enhance Security',
        description: 'Implement security best practices',
        implementation: 'Add Dependabot, security policy, and audit scripts',
        impact: 'high',
        effort: 'low',
        automated: true
      });
    }

    return suggestions;
  }

  private async enhanceSuggestionsWithAI(analysis: RepositoryAnalysis, repoData: any): Promise<SmartSuggestion[]> {
    // This would use OpenAI to generate more sophisticated suggestions
    // For now, return the basic suggestions
    return analysis.smartSuggestions;
  }
}

export const repositoryAnalyzer = new RepositoryAnalyzer();
