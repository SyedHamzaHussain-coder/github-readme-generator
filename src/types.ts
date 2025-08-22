export type ReadmeType = 'repository' | 'profile';

export type StepType = 'landing' | 'examples' | 'connect' | 'type' | 'template' | 'generate' | 'preview';

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export interface GitHubData {
  username: string;
  name: string;
  bio: string;
  avatar_url: string;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
  company: string | null;
  email: string | null;
  public_repos: number;
  created_at: string;
  twitter_username: string | null;
}

export interface Repository {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  updated_at: string;
}
