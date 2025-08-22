import { useState } from 'react';
import { Sparkles, Wand2, Edit3 } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ConnectStep } from './components/ConnectStep';
import { TemplateStep } from './components/TemplateStep';
import { PreviewStep } from './components/PreviewStep';
import { GitHubData, Repository, ReadmeType, StepType } from './types';
import { repositoryTemplates, profileTemplates } from './constants/templates';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const step = location.pathname === '/' ? 'landing' : location.pathname.slice(1) as StepType;
  const [readmeType, setReadmeType] = useState<ReadmeType>('repository');
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive');
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [editedReadme, setEditedReadme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');

  const connectToGitHub = async (): Promise<void> => {
    try {
      setIsGenerating(true);
      
      // Check if user is already authenticated
      const savedUserInfo = localStorage.getItem('github_user');
      if (savedUserInfo) {
        const userData = JSON.parse(savedUserInfo);
        setGithubData(userData);
        
        // Simulate loading repos (in real app, fetch from GitHub API)
        const mockRepos: Repository[] = [
          {
            name: 'example-repo',
            description: 'An example repository',
            stars: 10,
            forks: 5,
            language: 'TypeScript',
            updated_at: '2024-01-01'
          },
          {
            name: 'portfolio-website',
            description: 'My personal portfolio website',
            stars: 25,
            forks: 8,
            language: 'React',
            updated_at: '2024-01-15'
          },
          {
            name: 'awesome-project',
            description: 'An awesome open source project',
            stars: 150,
            forks: 30,
            language: 'JavaScript',
            updated_at: '2024-02-01'
          }
        ];

        setRepos(mockRepos);
        navigate('/type');
        return;
      }

      // If not authenticated, redirect to GitHub OAuth
      // This will be handled by the ConnectStep component
      console.log('User not authenticated, GitHub OAuth flow will be initiated');
      
    } catch (error) {
      console.error('Failed to connect to GitHub:', error);
      alert('Failed to connect to GitHub. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStepChange = (nextStep: StepType) => {
    navigate(`/${nextStep}`);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'connect':
        return (
          <ConnectStep
            isGenerating={isGenerating}
            connectToGitHub={connectToGitHub}
          />
        );
      case 'type':
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Choose README Type</h2>
            <div className="flex flex-col items-center gap-6">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setReadmeType('repository');
                    navigate('/template');
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Repository README
                </button>
                <button
                  onClick={() => {
                    setReadmeType('profile');
                    navigate('/template');
                  }}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Profile README
                </button>
              </div>
            </div>
          </div>
        );
      case 'template':
        return (
          <TemplateStep
            readmeType={readmeType}
            templates={readmeType === 'repository' ? repositoryTemplates : profileTemplates}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            githubData={githubData!}
            repos={repos}
            selectedRepo={selectedRepo}
            setSelectedRepo={setSelectedRepo}
            onGenerate={() => {
              setIsGenerating(true);
              navigate('/generate');
              // Simulate generation delay
              setTimeout(() => {
                const template = (readmeType === 'repository' ? repositoryTemplates : profileTemplates)
                  .find(t => t.id === selectedTemplate);
                setGeneratedReadme(template?.preview || '');
                setEditedReadme(template?.preview || '');
                setIsGenerating(false);
                navigate('/preview');
              }, 2000);
            }}
          />
        );
      case 'generate':
        return (
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Generating Your {readmeType === 'repository' ? 'Repository' : 'Profile'} README
                </h2>
                <p className="text-gray-600 mb-6">
                  Our AI is analyzing your {readmeType === 'repository' ? 'repository' : 'profile'} and creating professional documentation...
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center"><Sparkles className="w-4 h-4 mr-1" />Analyzing {readmeType}</span>
                  <span className="flex items-center"><Wand2 className="w-4 h-4 mr-1" />Writing content</span>
                  <span className="flex items-center"><Edit3 className="w-4 h-4 mr-1" />Formatting</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'preview':
        return (
          <PreviewStep
            readmeType={readmeType}
            editedReadme={editedReadme}
            setEditedReadme={setEditedReadme}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            onCopy={() => {
              navigator.clipboard.writeText(editedReadme);
              alert('README copied to clipboard!');
            }}
            onDownload={() => {
              const filename = readmeType === 'profile' ? 'profile-README.md' : 'README.md';
              const blob = new Blob([editedReadme], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            onUpload={() => {
              alert('This feature would upload the README to GitHub. Implementation pending.');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {step !== 'landing' && step !== 'examples' && (
        /* Header - Hidden on landing page and examples page */
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold">README.ai</h1>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center space-x-4">
                {['connect', 'type', 'template', 'generate', 'preview'].map((s, index) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === s
                        ? 'bg-purple-600 text-white'
                        : ['connect', 'type', 'template', 'generate', 'preview'].indexOf(step) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index < 4 && (
                      <div className={`w-8 h-0.5 ${
                        ['connect', 'type', 'template', 'generate', 'preview'].indexOf(step) > index
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={step === 'landing' || step === 'examples' ? '' : 'max-w-7xl mx-auto px-4 py-8'}>
        {step === 'landing' || step === 'examples' ? <Outlet /> : renderStepContent()}
      </main>
    </div>
  );
};

export default App;
