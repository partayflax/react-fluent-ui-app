import React, { useEffect, useState } from 'react';
import { Button, Text, Avatar, Spinner } from '@fluentui/react-components';
import { useAuth } from '../auth/AuthContext';
import { fetchUserProfile, fetchUserRepos } from '../services/api';

interface Repo {
  name: string;
  description: string;
  html_url: string;
}

const LoginButton: React.FC = () => {
  const { isAuthenticated, login, logout, user } = useAuth();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get display name from GitHub user data
  const getDisplayName = () => {
    if (!user) return '';
    // If name is available, use it, otherwise fall back to login (username)
    return user.name || user.login;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user) {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('github_token');
          if (!token) {
            throw new Error('No token found');
          }

          // Fetch user profile and repos
          const [profileData, reposData] = await Promise.all([
            fetchUserProfile(token),
            fetchUserRepos(token),
          ]);

          setRepos(reposData.slice(0, 5)); // Show only first 5 repos
        } catch (err) {
          setError('Failed to fetch user data');
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  return (
    <div>
      {isAuthenticated ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <Avatar
            name={getDisplayName()}
            image={{ src: user?.avatar_url }}
            size={64}
          />
          <Text size={500} weight="semibold">
            Welcome, {getDisplayName()}
          </Text>
          {user?.email && (
            <Text size={400} color="neutral">
              {user.email}
            </Text>
          )}
          {user?.bio && (
            <Text size={400} color="neutral" style={{ maxWidth: '400px', textAlign: 'center' }}>
              {user.bio}
            </Text>
          )}

          {loading ? (
            <Spinner size="medium" />
          ) : error ? (
            <Text color="danger">{error}</Text>
          ) : (
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <Text size={400} weight="semibold">Recent Repositories:</Text>
              <div style={{ marginTop: '10px' }}>
                {repos.map((repo) => (
                  <div
                    key={repo.name}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginBottom: '10px',
                    }}
                  >
                    <Text size={400} weight="semibold">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>
                        {repo.name}
                      </a>
                    </Text>
                    {repo.description && (
                      <Text size={300} color="neutral" style={{ marginTop: '10px' }}>
                        {repo.description}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button appearance="primary" onClick={logout}>
            Logout
          </Button>
        </div>
      ) : (
        <Button appearance="primary" onClick={login}>
          Login with GitHub
        </Button>
      )}
    </div>
  );
};

export default LoginButton; 