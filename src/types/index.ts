export interface GitHubData {
  username: string;
  name: string;
  bio: string;
  company: string;
  location: string;
  email: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  avatar_url: string;
  blog: string;
  twitter_username: string;
}

export interface Repository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export type ReadmeType = 'repository' | 'profile';
export type StepType = 'connect' | 'type' | 'analyze' | 'template' | 'generate' | 'preview' | 'edit';
