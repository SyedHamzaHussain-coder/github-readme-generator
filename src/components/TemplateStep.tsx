import React, { useState } from 'react';
import { Wand2, GitBranch, Calendar, Code2, Star, Users, List, Grid } from 'lucide-react';
import { Repository, GitHubData, Template } from '../types';
import GitHubRepositoryList from './GitHubRepositoryList';
import GitHubProfile from './GitHubProfile';

interface TemplateStepProps {
  readmeType: 'repository' | 'profile';
  templates: Template[];
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  githubData: GitHubData;
  repos: Repository[];
  selectedRepo: string;
  setSelectedRepo: (repo: string) => void;
  onGenerate: () => void;
}

export const TemplateStep: React.FC<TemplateStepProps> = ({
  readmeType,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  githubData,
  repos,
  selectedRepo,
  setSelectedRepo,
  onGenerate,
}) => {
  const [useEnhancedRepoView, setUseEnhancedRepoView] = useState(false);

  const handleRepositorySelect = (repository: any) => {
    setSelectedRepo(repository.name);
  };
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Choose Your {readmeType === 'repository' ? 'Repository' : 'Profile'} Template
        </h2>
        <p className="text-gray-600 text-lg">Select a template that matches your style</p>
      </div>

      {/* User Profile Card */}
      <div className="mb-8">
        <GitHubProfile 
          githubData={githubData} 
          repositoryCount={repos.length}
          showActions={true}
          onLogout={() => {
            // Clear local storage and redirect to connect page
            localStorage.removeItem('github_token');
            localStorage.removeItem('github_user');
            localStorage.removeItem('github_auth_timestamp');
            localStorage.removeItem('github_auth_success');
            localStorage.removeItem('github_oauth_state');
            window.location.href = '/connect';
          }}
        />
      </div>

      {/* Repository Selection - only for repository type */}
      {readmeType === 'repository' && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Select Repository</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUseEnhancedRepoView(false)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  !useEnhancedRepoView 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4 inline mr-1" />
                Simple
              </button>
              <button
                onClick={() => setUseEnhancedRepoView(true)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  useEnhancedRepoView 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4 inline mr-1" />
                Enhanced
              </button>
            </div>
          </div>

          {useEnhancedRepoView ? (
            <GitHubRepositoryList
              showSelection={true}
              selectedRepository={selectedRepo}
              onRepositorySelect={handleRepositorySelect}
              maxResults={20}
            />
          ) : (
            <div className="grid gap-4">
              {repos.map((repo) => (
                <div
                  key={repo.name}
                  onClick={() => setSelectedRepo(repo.name)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedRepo === repo.name
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{repo.name}</h4>
                      <p className="text-gray-600 text-sm">{repo.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Code2 className="w-4 h-4 mr-1" />
                          {repo.language}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {repo.stars}
                        </span>
                        <span className="flex items-center">
                          <GitBranch className="w-4 h-4 mr-1" />
                          {repo.forks}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {repo.updated_at}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Template Selection */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer transition-all duration-300 border-2 ${
              selectedTemplate === template.id
                ? 'border-purple-500 shadow-2xl transform scale-105'
                : 'border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:transform hover:scale-102'
            }`}
          >
            <div className="text-center mb-4">
              <Wand2 className={`w-8 h-8 mx-auto mb-3 ${
                selectedTemplate === template.id ? 'text-purple-600' : 'text-gray-400'
              }`} />
              <h3 className="font-bold text-gray-800">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-700 overflow-hidden max-h-32">
              <pre className="whitespace-pre-wrap">{template.preview}</pre>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={onGenerate}
            disabled={readmeType === 'repository' && !selectedRepo}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-2">
              <Wand2 className="w-5 h-5" />
              <span>Generate AI README</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
