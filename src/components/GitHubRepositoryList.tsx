import React, { useState } from 'react';
import { useGitHubRepositories } from '../hooks/useGitHubRepositories';

interface GitHubRepositoryListProps {
  username?: string | null;
  onRepositorySelect?: (repository: any) => void;
  selectedRepository?: string;
  showSelection?: boolean;
  maxResults?: number;
}

const GitHubRepositoryList: React.FC<GitHubRepositoryListProps> = ({ 
  username = null, 
  onRepositorySelect,
  selectedRepository,
  showSelection = false,
  maxResults = 30
}) => {
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'pushed' | 'full_name' | 'stars'>('updated');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all' | 'owner' | 'public' | 'private'>('all');

  const { repositories, loading, error, metadata, refetch } = useGitHubRepositories({
    username: username || undefined,
    sort: sortBy,
    direction,
    type: filter,
    perPage: maxResults
  });

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    refetch({ sort: newSort, direction, type: filter });
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    refetch({ sort: sortBy, direction, type: newFilter });
  };

  const handleDirectionChange = (newDirection: typeof direction) => {
    setDirection(newDirection);
    refetch({ sort: sortBy, direction: newDirection, type: filter });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
        <span className="ml-3 text-gray-600">Loading repositories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Error Loading Repositories</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Created</option>
            <option value="pushed">Last Pushed</option>
            <option value="full_name">Name</option>
            <option value="stars">Stars</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Order:</label>
          <select 
            value={direction} 
            onChange={(e) => handleDirectionChange(e.target.value as typeof direction)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => handleFilterChange(e.target.value as typeof filter)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="all">All</option>
            <option value="owner">Owned</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <button 
          onClick={() => refetch()}
          className="px-3 py-1 bg-secondary text-white text-sm rounded hover:bg-secondary-dark transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Repository List */}
      <div className="grid gap-4">
        {repositories.map(repo => (
          <div 
            key={repo.id} 
            className={`border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer ${
              showSelection && selectedRepository === repo.name 
                ? 'border-secondary bg-secondary/10' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onRepositorySelect && onRepositorySelect(repo)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-semibold text-secondary hover:text-secondary-dark">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      {repo.name}
                    </a>
                  </h3>
                  {showSelection && selectedRepository === repo.name && (
                    <span className="text-secondary">✓</span>
                  )}
                </div>
                
                {repo.description && (
                  <p className="text-gray-600 mt-2">{repo.description}</p>
                )}

                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                  {repo.language && (
                    <span className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-secondary/100 mr-2"></span>
                      {repo.language}
                    </span>
                  )}
                  
                  <span className="flex items-center">
                    ⭐ {repo.stargazers_count}
                  </span>
                  
                  <span className="flex items-center">
                    🍴 {repo.forks_count}
                  </span>
                  
                  <span>
                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {repo.topics.map(topic => (
                      <span key={topic} className="px-2 py-1 bg-secondary/20 text-secondary-dark text-xs rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="ml-4 flex flex-col space-y-2">
                {repo.private && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Private
                  </span>
                )}
                {repo.fork && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    Fork
                  </span>
                )}
                {repo.archived && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    Archived
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {repositories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No repositories found</p>
        </div>
      )}

      {metadata && (
        <div className="text-sm text-gray-500 text-center bg-gray-50 p-3 rounded">
          Showing {repositories.length} repositories • 
          Last updated: {new Date(metadata.fetched_at).toLocaleString()} • 
          User: {metadata.username}
        </div>
      )}
    </div>
  );
};

export default GitHubRepositoryList;


