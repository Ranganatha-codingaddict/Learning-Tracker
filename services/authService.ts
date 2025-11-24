

import { useState, useEffect, useCallback } from 'react';
import { User, UserCredentials, AuthResponse, SignupDetails } from '../types';

const MOCK_CURRENT_USER_KEY = 'roadmap_tracker_current_user';
const MOCK_USERS_DB_KEY = 'roadmap_tracker_users_db'; // New: Database of all users

/**
 * Interface for stored user data including sensitive info (password) 
 * which is kept internal to this service's storage logic.
 */
interface StoredUserAccount extends User {
  password: string; // Stored securely... or well, in localStorage for this mock :)
}

// Simple mock for generating a unique user ID
const generateUserId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mocks a backend authentication service using LocalStorage as a persistence layer.
 */
const mockAuthApi = {
  login: async (credentials: UserCredentials): Promise<AuthResponse | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const usersDbJson = localStorage.getItem(MOCK_USERS_DB_KEY);
    const usersDb: Record<string, StoredUserAccount> = usersDbJson ? JSON.parse(usersDbJson) : {};

    // Check if user exists
    const userAccount = usersDb[credentials.email];

    if (userAccount && userAccount.password === credentials.password) {
      // Remove password before returning User object
      const { password, ...user } = userAccount;
      return { user, token: `mock-jwt-token-${user.id}` };
    }

    return null; // Login failed
  },

  signup: async (details: SignupDetails): Promise<AuthResponse | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));

    const usersDbJson = localStorage.getItem(MOCK_USERS_DB_KEY);
    const usersDb: Record<string, StoredUserAccount> = usersDbJson ? JSON.parse(usersDbJson) : {};

    if (usersDb[details.email]) {
      throw new Error('User with this email already exists.');
    }

    const newUser: StoredUserAccount = { 
      id: generateUserId(), 
      email: details.email, 
      name: details.name || details.email.split('@')[0],
      phone: details.phone,
      photoUrl: details.photoUrl,
      password: details.password 
    };

    // Save to DB
    usersDb[details.email] = newUser;
    localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(usersDb));

    // Return safe user object
    const { password, ...user } = newUser;
    return { user, token: `mock-jwt-token-${user.id}` };
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    localStorage.removeItem(MOCK_CURRENT_USER_KEY);
  },

  getCurrentUser: async (): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const storedUser = localStorage.getItem(MOCK_CURRENT_USER_KEY);
    if (storedUser) {
      return JSON.parse(storedUser) as User;
    }
    return null;
  },
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await mockAuthApi.getCurrentUser();
      setUser(currentUser);
    } catch (e: any) {
      setError(e.message || 'Failed to check authentication');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: UserCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockAuthApi.login(credentials);
      if (response) {
        localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(response.user));
        setUser(response.user);
      } else {
        setError('Invalid email or password');
      }
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (details: SignupDetails) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockAuthApi.signup(details);
      if (response) {
        localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(response.user));
        setUser(response.user);
      } else {
        setError('Signup failed');
      }
    } catch (e: any) {
      setError(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await mockAuthApi.logout();
      setUser(null);
    } catch (e: any) {
      setError(e.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { user, loading, error, login, signup, logout, checkAuth };
};