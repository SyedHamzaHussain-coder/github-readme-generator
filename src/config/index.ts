// Configuration utility for environment variables
// This makes it easier to manage URLs and settings across different environments

interface AppConfig {
  baseUrl: string;
  githubClientId: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
}

// Get environment variables with fallbacks
const getConfig = (): AppConfig => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Determine environment based on hostname
  let environment: 'development' | 'staging' | 'production' = 'development';
  if (hostname.includes('staging')) {
    environment = 'staging';
  } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    environment = 'production';
  }

  // Get base URL from environment variable or construct from current location
  const envBaseUrl = import.meta.env.VITE_APP_BASE_URL || import.meta.env.REACT_APP_BASE_URL;
  const baseUrl = envBaseUrl || `${protocol}//${window.location.host}`;

  // Get GitHub client ID (should be different for each environment)
  const githubClientId = import.meta.env.VITE_APP_GITHUB_CLIENT_ID || import.meta.env.REACT_APP_GITHUB_CLIENT_ID || 'your_github_client_id';

  // API URL for backend calls (adjust as needed)
  const apiUrl = import.meta.env.VITE_APP_API_URL || import.meta.env.REACT_APP_API_URL || `${baseUrl}/api`;

  return {
    baseUrl,
    githubClientId,
    environment,
    apiUrl,
  };
};

export const config = getConfig();

// OAuth URLs helper
export const getOAuthUrls = () => {
  const { baseUrl, githubClientId } = config;
  
  return {
    githubCallback: `${baseUrl}/auth/callback`,
    githubAuthorize: (state: string) => {
      const redirectUri = encodeURIComponent(`${baseUrl}/auth/callback`);
      const scopes = encodeURIComponent('read:user user:email public_repo');
      return `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;
    }
  };
};

// Helper to log current configuration (useful for debugging)
export const logConfig = () => {
  console.group('🔧 App Configuration');
  console.log('Environment:', config.environment);
  console.log('Base URL:', config.baseUrl);
  console.log('GitHub Client ID:', config.githubClientId.substring(0, 10) + '...');
  console.log('Callback URL:', getOAuthUrls().githubCallback);
  console.groupEnd();
};

export default config;
