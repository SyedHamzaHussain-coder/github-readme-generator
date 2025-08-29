import { useState, useEffect } from 'react';
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
  const currentPath = location.pathname;
  const [readmeType, setReadmeType] = useState<ReadmeType>('repository');
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive');
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [editedReadme, setEditedReadme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');

  // Load GitHub data on component mount if user is already authenticated
  useEffect(() => {
    const loadStoredGitHubData = () => {
      const savedUserInfo = localStorage.getItem('github_user');
      const githubToken = localStorage.getItem('github_token');
      
      if (savedUserInfo && githubToken && !githubData) {
        try {
          const userData = JSON.parse(savedUserInfo);
          const githubDataFormatted: GitHubData = {
            avatar_url: userData.avatar_url,
            name: userData.name || userData.login,
            username: userData.login,
            bio: userData.bio || '',
            public_repos: userData.public_repos || 0,
            followers: userData.followers || 0,
            following: userData.following || 0,
            location: userData.location || '',
            company: userData.company || '',
            blog: userData.blog || '',
            twitter_username: userData.twitter_username || '',
            email: userData.email || '',
            created_at: userData.created_at || '',
          };
          setGithubData(githubDataFormatted);
          
          // Also fetch repositories if we're not already loading them
          if (repos.length === 0) {
            fetchUserRepositories();
          }
        } catch (error) {
          console.error('Failed to load stored GitHub data:', error);
        }
      }
    };

    loadStoredGitHubData();
  }, [githubData, repos.length]);

  const connectToGitHub = async (forceReauth: boolean = false): Promise<void> => {
    try {
      console.log('🚀 connectToGitHub called with forceReauth:', forceReauth);
      setIsGenerating(true);
      
      // Check if user is already authenticated (unless forced re-auth)
      const savedUserInfo = localStorage.getItem('github_user');
      console.log('🔍 Saved user info exists:', !!savedUserInfo);
      
      if (savedUserInfo && !forceReauth) {
        console.log('🔍 User already authenticated, using saved data');
        const userData = JSON.parse(savedUserInfo);
        // Transform the GitHub user data to GitHubData format
        const githubDataFormatted: GitHubData = {
          avatar_url: userData.avatar_url,
          name: userData.name || userData.login,
          username: userData.login,
          bio: userData.bio || '',
          public_repos: userData.public_repos || 0,
          followers: userData.followers || 0,
          following: userData.following || 0,
          location: userData.location || '',
          company: userData.company || '',
          blog: userData.blog || '',
          twitter_username: userData.twitter_username || '',
          email: userData.email || '',
          created_at: userData.created_at || '',
        };
        setGithubData(githubDataFormatted);
        
        // Fetch repositories using our secure API
        await fetchUserRepositories();
        navigate('/type');
        return;
      }

      // If not authenticated or forced re-auth, trigger GitHub OAuth
      console.log('🔗 Triggering GitHub OAuth flow');
      const { getOAuthUrls } = await import('./config');
      
      // Generate a unique state parameter for security
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('github_oauth_state', state);
      
      // Get OAuth URLs using the configuration utility
      const { githubAuthorize } = getOAuthUrls();
      const githubAuthUrl = githubAuthorize(state);
      
      console.log('🔗 Redirecting to GitHub OAuth:', githubAuthUrl);
      
      // Redirect to GitHub OAuth
      window.location.href = githubAuthUrl;
      
    } catch (error) {
      console.error('❌ Failed to connect to GitHub:', error);
      alert('Failed to connect to GitHub. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchUserRepositories = async (): Promise<void> => {
    try {
      // Get the stored GitHub token
      const githubToken = localStorage.getItem('github_token');
      if (!githubToken) {
        throw new Error('No GitHub token found');
      }

      // Use the new GitHub API utility function
      const { fetchGitHubRepositories } = await import('./utils/github');
      const data = await fetchGitHubRepositories({
        sort: 'updated',
        direction: 'desc',
        perPage: 50,
        type: 'all'
      });
      
      // Transform the repository data to match our Repository interface
      const formattedRepos = data.repositories.map((repo: any) => ({
        name: repo.name,
        description: repo.description || '',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || 'Unknown',
        updated_at: repo.updated_at
      }));
      
      setRepos(formattedRepos);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      // Fallback to mock data for development
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
        if (!githubData) {
          return (
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Loading GitHub Data...</h2>
              <p className="text-gray-600">Please wait while we load your GitHub profile information.</p>
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent mx-auto mt-4"></div>
            </div>
          );
        }
        return (
          <TemplateStep
            readmeType={readmeType}
            templates={readmeType === 'repository' ? repositoryTemplates : profileTemplates}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            githubData={githubData}
            repos={repos}
            selectedRepo={selectedRepo}
            setSelectedRepo={setSelectedRepo}
            onGenerate={async () => {
              setIsGenerating(true);
              navigate('/generate');
              
              try {
                // Get the GitHub token for authorization
                const token = localStorage.getItem('github_token');
                
                if (!token) {
                  throw new Error('No GitHub token found. Please reconnect your account.');
                }

                // Use our secure API endpoint for README generation
                const response = await fetch('/api/generate-readme', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  credentials: 'include',
                  body: JSON.stringify({
                    type: readmeType,
                    template: selectedTemplate,
                    repoData: readmeType === 'repository' ? {
                      repository: {
                        name: selectedRepo,
                        full_name: `${githubData?.username}/${selectedRepo}`,
                        description: '',
                        html_url: `https://github.com/${githubData?.username}/${selectedRepo}`,
                        language: 'JavaScript',
                        owner: { login: githubData?.username }
                      },
                      analysis: {},
                      packageJson: null,
                      projectType: 'JavaScript',
                      languages: {}
                    } : undefined,
                    userInfo: readmeType === 'profile' ? githubData : undefined,
                  }),
                });

                if (!response.ok) {
                  if (response.status === 404 && window.location.hostname === 'localhost') {
                    // In development, API routes may not be available
                    throw new Error('API not available in development mode');
                  }
                  const errorText = await response.text();
                  throw new Error(`Failed to generate README: ${errorText}`);
                }

                const data = await response.json();
                setGeneratedReadme(data.readme);
                setEditedReadme(data.readme);
                
                // Show AI generation status
                if (data.aiGenerated) {
                  console.log('✅ README generated using AI:', data.metadata?.generator);
                } else {
                  console.log('📄 README generated using templates');
                }
                
                navigate('/preview');
              } catch (error) {
                console.error('Failed to generate README:', error);
                
                // Show specific error message
                let errorMessage = 'Failed to generate README. ';
                if (error instanceof Error) {
                  if (error.message.includes('No GitHub token')) {
                    errorMessage += 'Please reconnect your GitHub account.';
                  } else if (error.message.includes('API not available in development')) {
                    errorMessage += 'API generation not available in development mode. Using template preview.';
                  } else if (error.message.includes('Failed to generate README')) {
                    errorMessage += 'Server error occurred. Using template preview instead.';
                  } else {
                    errorMessage += error.message;
                  }
                } else {
                  errorMessage += 'Using template preview instead.';
                }
                
                // Fallback to template preview
                const template = (readmeType === 'repository' ? repositoryTemplates : profileTemplates)
                  .find(t => t.id === selectedTemplate);
                setGeneratedReadme(template?.preview || '');
                setEditedReadme(template?.preview || '');
                navigate('/preview');
                alert(errorMessage);
              } finally {
                setIsGenerating(false);
              }
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
              
              {/* Progress Steps and User Info */}
              <div className="flex items-center space-x-6">
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

                {/* User Info and Logout */}
                {githubData && (
                  <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <img 
                      src={githubData.avatar_url} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-700">@{githubData.username}</span>
                    <button
                      onClick={async () => {
                        // Clear all GitHub-related data
                        // Get current token for proper logout
                        const token = localStorage.getItem('github_token');
                        
                        // Clear localStorage first
                        localStorage.removeItem('github_token');
                        localStorage.removeItem('github_user');
                        localStorage.removeItem('github_auth_timestamp');
                        localStorage.removeItem('github_auth_success');
                        localStorage.removeItem('github_oauth_state');
                        
                        // Also clear sessionStorage
                        sessionStorage.removeItem('github_user');
                        sessionStorage.removeItem('github_token');
                        
                        // Call server-side logout with token
                        try {
                          await fetch('/api/auth/logout', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              ...(token && { 'Authorization': `Bearer ${token}` })
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                              token: token
                            })
                          });
                        } catch (error) {
                          console.warn('Server logout failed:', error);
                        }
                        
                        // Clear state and redirect to connect page with logout parameter
                        setGithubData(null);
                        setRepos([]);
                        window.location.href = '/connect?logout=true';
                      }}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={step === 'landing' || step === 'examples' || currentPath === '/auth/callback' || currentPath === '/debug' ? '' : 'max-w-7xl mx-auto px-4 py-8'}>
        {step === 'landing' || step === 'examples' || currentPath === '/auth/callback' || currentPath === '/debug' ? <Outlet /> : renderStepContent()}
      </main>
    </div>
  );
};

export default App;
