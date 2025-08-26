import { useState, useEffect } from 'react';
import { fetchGitHubRepositories } from '../utils/github';

interface FetchRepositoriesOptions {
  sort?: 'updated' | 'created' | 'pushed' | 'full_name' | 'stars';
  direction?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
  type?: 'all' | 'owner' | 'public' | 'private' | 'member';
  username?: string;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string | null;
  languages_url: string;
  default_branch: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
  };
}

interface RepositoriesMetadata {
  fetched_at: string;
  username: string;
  sort: string;
  direction: string;
  page: number;
  per_page: number;
}

interface UseGitHubRepositoriesReturn {
  repositories: GitHubRepository[];
  loading: boolean;
  error: string | null;
  metadata: RepositoriesMetadata | null;
  refetch: (fetchOptions?: FetchRepositoriesOptions) => Promise<void>;
}

// React Hook for repositories
export const useGitHubRepositories = (options: FetchRepositoriesOptions = {}): UseGitHubRepositoriesReturn => {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RepositoriesMetadata | null>(null);

  const fetchRepos = async (fetchOptions: FetchRepositoriesOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchGitHubRepositories({ ...options, ...fetchOptions });
      setRepositories(data.repositories);
      setMetadata(data.metadata);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('github_token');
    if (token) {
      fetchRepos();
    } else {
      setError('No GitHub token found. Please login first.');
    }
  }, []);

  return {
    repositories,
    loading,
    error,
    metadata,
    refetch: fetchRepos
  };
};
