const TOKEN_KEY = 'auth_token';

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('Getting token from localStorage:', token ? 'Token exists' : 'No token found');
  return token;
};

export const setToken = (token: string): void => {
  console.log('Setting new token in localStorage');
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  console.log('Removing token from localStorage');
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  const hasToken = !!getToken();
  console.log('Checking authentication status:', hasToken);
  return hasToken;
};