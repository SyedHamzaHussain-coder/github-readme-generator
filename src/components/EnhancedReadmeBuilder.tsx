import React, { useState, useCallback, useEffect } from 'react';
import { VisualBuilder, ReadmeSection } from './VisualBuilder';
import { LivePreview } from './LivePreview';
import { SpecializedTemplateService, SpecializedTemplate } from '../services/specializedTemplates';
import { RepositoryAnalyzer, RepositoryAnalysis } from '../services/repositoryAnalyzer';
import PerformanceService from '../services/performanceService';
import { Settings, Layers, Zap, BarChart3, Brain, Download, Share2 } from 'lucide-react';

interface EnhancedReadmeBuilderProps {
  repositoryUrl?: string;
  githubToken?: string;
  onReadmeGenerated?: (markdown: string) => void;
}

export const EnhancedReadmeBuilder: React.FC<EnhancedReadmeBuilderProps> = ({
  repositoryUrl,
  githubToken,
  onReadmeGenerated
}) => {
  const [currentView, setCurrentView] = useState<'builder' | 'templates' | 'analytics' | 'settings'>('builder');
  const [sections, setSections] = useState<ReadmeSection[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SpecializedTemplate | null>(null);
  const [repositoryAnalysis, setRepositoryAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMarkdown, setPreviewMarkdown] = useState('');

  // Initialize with basic sections if no template is selected
  useEffect(() => {
    if (sections.length === 0 && !selectedTemplate) {
      setSections([
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
          id: 'description',
          type: 'description',
          title: 'Description',
          content: '## Description\n\n{{description}}',
          order: 1,
          editable: true,
          required: true
        }
      ]);
    }
  }, [sections.length, selectedTemplate]);

  // Analyze repository when URL changes
  useEffect(() => {
    if (repositoryUrl && githubToken) {
      analyzeRepository();
    }
  }, [repositoryUrl, githubToken]);

  const analyzeRepository = useCallback(async () => {
    if (!repositoryUrl || !githubToken) return;

    setIsAnalyzing(true);
    try {
      const analysis = await RepositoryAnalyzer.analyzeRepository(repositoryUrl, githubToken);
      setRepositoryAnalysis(analysis);
      
      // Auto-suggest template based on analysis
      const suggestedTemplate = suggestTemplateFromAnalysis(analysis);
      if (suggestedTemplate) {
        setSelectedTemplate(suggestedTemplate);
      }
    } catch (error) {
      console.error('Repository analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [repositoryUrl, githubToken]);

  const suggestTemplateFromAnalysis = (analysis: RepositoryAnalysis): SpecializedTemplate | null => {
    const { techStack } = analysis;
    
    // React-based projects
    if (techStack.frontend.frameworks.some(f => f.name.toLowerCase().includes('react'))) {
      if (techStack.frontend.frameworks.some(f => f.name.toLowerCase().includes('next'))) {
        return SpecializedTemplateService.getTemplate('nextjs-app') || null;
      }
      if (techStack.mobile.frameworks.some(f => f.name.toLowerCase().includes('react native'))) {
        return SpecializedTemplateService.getTemplate('react-native-app') || null;
      }
      return SpecializedTemplateService.getTemplate('react-app') || null;
    }

    // Machine Learning projects
    if (techStack.backend.languages.some(l => l.name.toLowerCase() === 'python') &&
        (analysis.files.some(f => f.path.includes('.ipynb')) ||
         analysis.files.some(f => f.path.includes('requirements.txt') && f.content.includes('scikit-learn')))) {
      return SpecializedTemplateService.getTemplate('ml-project') || null;
    }

    // Blockchain projects
    if (techStack.backend.languages.some(l => l.name.toLowerCase() === 'solidity') ||
        analysis.files.some(f => f.path.includes('hardhat.config') || f.path.includes('truffle-config'))) {
      return SpecializedTemplateService.getTemplate('smart-contract') || null;
    }

    // API projects
    if (analysis.files.some(f => f.path.includes('package.json') && 
        (f.content.includes('express') || f.content.includes('fastify') || f.content.includes('koa')))) {
      return SpecializedTemplateService.getTemplate('rest-api') || null;
    }

    return null;
  };

  const handleTemplateSelect = useCallback((template: SpecializedTemplate) => {
    setSelectedTemplate(template);
    setSections(template.sections);
  }, []);

  const handleSectionsChange = useCallback((newSections: ReadmeSection[]) => {
    setSections(newSections);
  }, []);

  const handlePreview = useCallback((markdown: string) => {
    setPreviewMarkdown(markdown);
  }, []);

  const generateAIEnhancedReadme = useCallback(async () => {
    if (!repositoryAnalysis) return;

    setIsGenerating(true);
    try {
      // Generate AI-enhanced sections based on repository analysis
      const enhancedSections = await enhanceSectionsWithAI(sections, repositoryAnalysis);
      setSections(enhancedSections);
      
      // Generate final markdown
      const finalMarkdown = enhancedSections
        .sort((a, b) => a.order - b.order)
        .map(section => section.customContent || section.content)
        .join('\n\n');
      
      setPreviewMarkdown(finalMarkdown);
      onReadmeGenerated?.(finalMarkdown);
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [sections, repositoryAnalysis, onReadmeGenerated]);

  const enhanceSectionsWithAI = async (
    sections: ReadmeSection[], 
    analysis: RepositoryAnalysis
  ): Promise<ReadmeSection[]> => {
    // This would integrate with OpenAI API to enhance sections
    // For now, return enhanced sections based on analysis
    return sections.map(section => {
      let enhancedContent = section.content;

      // Enhance based on section type and repository analysis
      switch (section.type) {
        case 'title':
          enhancedContent = `# ${analysis.repository.name}\n\n${analysis.repository.description || 'A modern application built with cutting-edge technologies.'}`;
          break;
        case 'tech-stack':
          enhancedContent = generateTechStackSection(analysis);
          break;
        case 'features':
          enhancedContent = generateFeaturesSection(analysis);
          break;
        case 'installation':
          enhancedContent = generateInstallationSection(analysis);
          break;
        default:
          // Keep original content for other sections
          break;
      }

      return {
        ...section,
        customContent: enhancedContent
      };
    });
  };

  const generateTechStackSection = (analysis: RepositoryAnalysis): string => {
    const { techStack } = analysis;
    let content = '## Tech Stack\n\n';

    if (techStack.frontend.frameworks.length > 0) {
      content += `**Frontend:** ${techStack.frontend.frameworks.map(f => f.name).join(', ')}\n\n`;
    }

    if (techStack.backend.frameworks.length > 0) {
      content += `**Backend:** ${techStack.backend.frameworks.map(f => f.name).join(', ')}\n\n`;
    }

    if (techStack.databases.length > 0) {
      content += `**Database:** ${techStack.databases.map(d => d.name).join(', ')}\n\n`;
    }

    if (techStack.cloudServices.length > 0) {
      content += `**Cloud Services:** ${techStack.cloudServices.map(c => c.name).join(', ')}\n\n`;
    }

    return content;
  };

  const generateFeaturesSection = (analysis: RepositoryAnalysis): string => {
    const { smartSuggestions } = analysis;
    let content = '## Features\n\n';

    // Add features based on detected technologies and patterns
    const features = smartSuggestions
      .filter(s => s.type === 'improvement' || s.type === 'performance')
      .map(s => `- ✨ ${s.description}`)
      .slice(0, 6); // Limit to 6 features

    if (features.length > 0) {
      content += features.join('\n');
    } else {
      content += '- 🚀 Modern architecture\n- 📱 Responsive design\n- 🔧 Easy to customize';
    }

    return content;
  };

  const generateInstallationSection = (analysis: RepositoryAnalysis): string => {
    const { techStack } = analysis;
    let content = '## Installation\n\n';

    // Generate installation steps based on detected package managers
    if (analysis.files.some(f => f.path === 'package.json')) {
      content += '```bash\n# Clone the repository\ngit clone ' + analysis.repository.cloneUrl + '\n\n';
      content += '# Navigate to the project directory\ncd ' + analysis.repository.name + '\n\n';
      content += '# Install dependencies\nnpm install\n\n';
      content += '# Start the development server\nnpm run dev\n```';
    } else if (analysis.files.some(f => f.path === 'requirements.txt')) {
      content += '```bash\n# Clone the repository\ngit clone ' + analysis.repository.cloneUrl + '\n\n';
      content += '# Navigate to the project directory\ncd ' + analysis.repository.name + '\n\n';
      content += '# Create virtual environment\npython -m venv venv\nsource venv/bin/activate\n\n';
      content += '# Install dependencies\npip install -r requirements.txt\n```';
    }

    return content;
  };

  const downloadReadme = useCallback(() => {
    const markdown = sections
      .sort((a, b) => a.order - b.order)
      .map(section => section.customContent || section.content)
      .join('\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [sections]);

  const shareReadme = useCallback(() => {
    const markdown = sections
      .sort((a, b) => a.order - b.order)
      .map(section => section.customContent || section.content)
      .join('\n\n');

    if (navigator.share) {
      navigator.share({
        title: 'Generated README',
        text: markdown
      });
    } else {
      navigator.clipboard.writeText(markdown);
      // Show toast notification
      alert('README copied to clipboard!');
    }
  }, [sections]);

  return (
    <div className="enhanced-readme-builder min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Enhanced README Builder</h1>
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Analyzing repository...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={generateAIEnhancedReadme}
                disabled={isGenerating || !repositoryAnalysis}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Brain size={20} />
                {isGenerating ? 'Enhancing...' : 'AI Enhance'}
              </button>
              
              <button
                onClick={downloadReadme}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={20} />
                Download
              </button>
              
              <button
                onClick={shareReadme}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 size={20} />
                Share
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 -mb-px">
            {[
              { key: 'builder', label: 'Visual Builder', icon: Layers },
              { key: 'templates', label: 'Templates', icon: Zap },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
              { key: 'settings', label: 'Settings', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  currentView === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'builder' && (
          <VisualBuilder
            initialSections={sections}
            onSectionsChange={handleSectionsChange}
            onPreview={handlePreview}
            repositoryData={repositoryAnalysis}
          />
        )}

        {currentView === 'templates' && (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            repositoryAnalysis={repositoryAnalysis}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard repositoryAnalysis={repositoryAnalysis} />
        )}

        {currentView === 'settings' && (
          <SettingsPanel />
        )}
      </div>
    </div>
  );
};

// Template Selector Component
interface TemplateSelectorProps {
  selectedTemplate: SpecializedTemplate | null;
  onTemplateSelect: (template: SpecializedTemplate) => void;
  repositoryAnalysis: RepositoryAnalysis | null;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  repositoryAnalysis
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const templates = SpecializedTemplateService.getAllTemplates();
  
  const categories = [
    { key: 'all', label: 'All Templates' },
    { key: 'web-development', label: 'Web Development' },
    { key: 'mobile-development', label: 'Mobile Development' },
    { key: 'machine-learning', label: 'Machine Learning' },
    { key: 'blockchain', label: 'Blockchain' },
    { key: 'api-service', label: 'API & Services' },
    { key: 'library-package', label: 'Libraries & Packages' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4">Template Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      {repositoryAnalysis && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">AI Recommendations</h4>
          <p className="text-blue-800 text-sm">
            Based on your repository analysis, we recommend the <strong>React Application</strong> template.
          </p>
        </div>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{template.icon}</span>
              <h3 className="text-lg font-semibold">{template.name}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>
            <div className="text-xs text-gray-500">
              {template.sections.length} sections • {template.variables.length} variables
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Analytics Dashboard Component
interface AnalyticsDashboardProps {
  repositoryAnalysis: RepositoryAnalysis | null;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ repositoryAnalysis }) => {
  const metrics = PerformanceService.getMetrics();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Requests"
          value={metrics.requests.total}
          subtitle={`${metrics.requests.successful} successful`}
          color="blue"
        />
        <MetricCard
          title="Cache Hit Rate"
          value={`${Math.round(metrics.caching.hitRate * 100)}%`}
          subtitle={`${metrics.caching.hits} hits`}
          color="green"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${Math.round(metrics.requests.averageResponseTime)}ms`}
          subtitle="Last 100 requests"
          color="purple"
        />
        <MetricCard
          title="Error Rate"
          value={`${Math.round((metrics.requests.failed / metrics.requests.total) * 100)}%`}
          subtitle={`${metrics.errors.totalErrors} total errors`}
          color="red"
        />
      </div>

      {/* Repository Analysis */}
      {repositoryAnalysis && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Repository Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Complexity Score</h4>
              <div className="text-2xl font-bold text-blue-600">
                {repositoryAnalysis.complexity.overall}/10
              </div>
              <p className="text-sm text-gray-600">
                {repositoryAnalysis.complexity.overall > 7 ? 'High' : 
                 repositoryAnalysis.complexity.overall > 4 ? 'Medium' : 'Low'} complexity
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quality Score</h4>
              <div className="text-2xl font-bold text-green-600">
                {repositoryAnalysis.quality.overall}/10
              </div>
              <p className="text-sm text-gray-600">
                {repositoryAnalysis.quality.overall > 7 ? 'Excellent' : 
                 repositoryAnalysis.quality.overall > 4 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Technologies</h4>
              <div className="text-2xl font-bold text-purple-600">
                {repositoryAnalysis.techStack.frontend.languages.length + 
                 repositoryAnalysis.techStack.backend.languages.length}
              </div>
              <p className="text-sm text-gray-600">Languages detected</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Settings Panel Component
const SettingsPanel: React.FC = () => {
  const config = PerformanceService.getConfig();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate Limiting
            </label>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={config.rateLimiting.enabled}
                className="rounded"
              />
              <span className="text-sm">
                {config.rateLimiting.maxRequests} requests per {config.rateLimiting.windowMs / 60000} minutes
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caching
            </label>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={config.caching.enabled}
                className="rounded"
              />
              <span className="text-sm">
                TTL: {config.caching.ttl / 3600000} hours, Max size: {config.caching.maxSize}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    red: 'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${colorClasses[color].split(' ')[2]}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
      <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>
        {value}
      </div>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  );
};

export default EnhancedReadmeBuilder;
