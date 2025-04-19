const API_BASE_URL = 'http://localhost:3001';

export const fetchUserProfile = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
};

export const fetchUserRepos = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/user/repos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user repositories');
  }

  return response.json();
}; 