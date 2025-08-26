// Frontend functions for fetching GitHub repositories

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

interface RepositoriesResponse {
  repositories: GitHubRepository[];
  total_count: number;
  metadata: {
    fetched_at: string;
    username: string;
    sort: string;
    direction: string;
    page: number;
    per_page: number;
  };
  rate_limit: {
    remaining: string | null;
    reset: string | null;
    limit: string | null;
  };
}

// Main function to fetch repositories
export const fetchGitHubRepositories = async (options: FetchRepositoriesOptions = {}): Promise<RepositoriesResponse> => {
  try {
    console.log('🚀 Fetching GitHub repositories...');
    
    // Get authentication token
    const token = localStorage.getItem('github_token');
    if (!token) {
      throw new Error('No GitHub token found. Please login first.');
    }

    // Build query parameters
    const params = new URLSearchParams({
      sort: options.sort || 'updated',
      direction: options.direction || 'desc',
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString(),
      type: options.type || 'all'
    });

    if (options.username) {
      params.append('username', options.username);
    }

    const url = `/api/github-repos?${params.toString()}`;
    console.log('📡 API URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP ${response.status}`, details: await response.text() };
      }
      
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.error || errorData.details || 'Failed to fetch repositories');
    }

    const data: RepositoriesResponse = await response.json();
    console.log('✅ Repositories fetched:', data.repositories.length);
    
    return data;

  } catch (error) {
    console.error('❌ Failed to fetch repositories:', error);
    throw error;
  }
};
