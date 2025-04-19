import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = () => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = window.location.origin + '/auth/callback';
    const scope = 'user:email';
    
    if (!clientId) {
      console.error('GitHub OAuth configuration is missing');
      return;
    }

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('github_token');
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const exchangeCodeForToken = async () => {
        try {
          const clientId = process.env.GITHUB_CLIENT_ID;
          const clientSecret = process.env.GITHUB_CLIENT_SECRET;
          const redirectUri = window.location.origin + '/auth/callback';

          if (!clientId || !clientSecret) {
            console.error('GitHub OAuth configuration is missing');
            return;
          }

          const response = await fetch('/api/login/oauth/access_token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code,
              redirect_uri: redirectUri,
            }),
          });

          const data = await response.json();
          if (data.access_token) {
            localStorage.setItem('github_token', data.access_token);
            setIsAuthenticated(true);
            
            // Fetch user data
            const userResponse = await fetch('https://api.github.com/user', {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            });
            const userData = await userResponse.json();

            // Fetch user's emails
            const emailsResponse = await fetch('https://api.github.com/user/emails', {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            });
            const emailsData = await emailsResponse.json();
            
            // Find primary email
            const primaryEmail = emailsData.find((email: any) => email.primary)?.email;
            
            // Combine user data with email
            setUser({
              ...userData,
              email: primaryEmail
            });
          }
        } catch (error) {
          console.error('Error exchanging code for token:', error);
        }
      };

      exchangeCodeForToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 