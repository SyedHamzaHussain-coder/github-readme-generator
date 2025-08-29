import React from 'react';
import { 
  Users, 
  Star, 
  GitBranch, 
  Calendar, 
  MapPin, 
  Building2, 
  Globe, 
  Twitter,
  Mail,
  ExternalLink
} from 'lucide-react';
import { GitHubData } from '../types';

interface GitHubProfileProps {
  githubData: GitHubData;
  repositoryCount?: number;
  showActions?: boolean;
  onLogout?: () => void;
}

const GitHubProfile: React.FC<GitHubProfileProps> = ({ 
  githubData, 
  repositoryCount,
  showActions = false,
  onLogout 
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = async () => {
    if (!onLogout) return;

    try {
      console.log('🚪 Starting logout process...');
      
      // Get the stored token
      const token = localStorage.getItem('github_token');
      
      // Clear client-side data immediately
      const keysToRemove = [
        'github_token',
        'github_user', 
        'github_auth_timestamp',
        'github_auth_success'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('🧹 Client-side data cleared');
      
      // Optional: Call server-side logout to revoke token
      if (token) {
        try {
          console.log('📡 Calling server-side logout...');
          
          const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              token: token
            })
          });
          
          console.log('📡 Logout response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Server-side logout successful:', data.message);
          } else {
            console.warn('⚠️ Server-side logout failed, but client is logged out');
          }
          
        } catch (serverError) {
          console.warn('⚠️ Server-side logout error (client still logged out):', serverError);
        }
      }
      
      console.log('🎉 Logout complete');
      
      // Redirect to connect page for re-authentication with logout parameter
      window.location.href = '/connect?logout=true';
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Even if there's an error, still clear local data and call callback
      localStorage.clear(); // Clear all data as fallback
      if (onLogout) onLogout();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header with avatar and basic info */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
        <div className="flex items-center space-x-6">
          <img 
            src={githubData.avatar_url} 
            alt={`${githubData.name || githubData.username}'s avatar`}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{githubData.name || githubData.username}</h1>
            <p className="text-purple-100 text-lg">@{githubData.username}</p>
            {githubData.bio && (
              <p className="text-purple-50 mt-2 max-w-2xl">{githubData.bio}</p>
            )}
          </div>
          {showActions && (
            <div className="flex flex-col space-y-2">
              <a
                href={`https://github.com/${githubData.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </a>
              {onLogout && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 bg-opacity-90 text-white rounded-lg hover:bg-opacity-100 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats section */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{repositoryCount || githubData.public_repos}</div>
            <div className="text-gray-600 text-sm">Repositories</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{githubData.followers}</div>
            <div className="text-gray-600 text-sm">Followers</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
              <GitBranch className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{githubData.following}</div>
            <div className="text-gray-600 text-sm">Following</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {githubData.created_at ? new Date(githubData.created_at).getFullYear() : 'N/A'}
            </div>
            <div className="text-gray-600 text-sm">Joined</div>
          </div>
        </div>

        {/* Additional info */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          {githubData.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-3 text-gray-400" />
              <span>{githubData.location}</span>
            </div>
          )}
          
          {githubData.company && (
            <div className="flex items-center text-gray-600">
              <Building2 className="w-4 h-4 mr-3 text-gray-400" />
              <span>{githubData.company}</span>
            </div>
          )}
          
          {githubData.blog && (
            <div className="flex items-center text-gray-600">
              <Globe className="w-4 h-4 mr-3 text-gray-400" />
              <a 
                href={githubData.blog.startsWith('http') ? githubData.blog : `https://${githubData.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {githubData.blog}
              </a>
            </div>
          )}
          
          {githubData.twitter_username && (
            <div className="flex items-center text-gray-600">
              <Twitter className="w-4 h-4 mr-3 text-gray-400" />
              <a 
                href={`https://twitter.com/${githubData.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                @{githubData.twitter_username}
              </a>
            </div>
          )}
          
          {githubData.email && (
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-3 text-gray-400" />
              <a 
                href={`mailto:${githubData.email}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {githubData.email}
              </a>
            </div>
          )}
          
          {githubData.created_at && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-3 text-gray-400" />
              <span>Joined GitHub on {formatDate(githubData.created_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubProfile;
