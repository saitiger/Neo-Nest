import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const AUTH_TOKEN_KEY = '@neo_nest_auth_token';
const REFRESH_TOKEN_KEY = '@neo_nest_refresh_token';
const USER_DATA_KEY = '@neo_nest_user_data';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string; // Display name
  createdAt: string;
  emailVerified: boolean;
  isExpert?: boolean;
  credentials?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private tokens: AuthTokens | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Store authentication data securely
  async storeAuthData(user: User, tokens: AuthTokens): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, tokens.accessToken),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user)),
      ]);
      
      this.currentUser = user;
      this.tokens = tokens;
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  // Retrieve stored authentication data
  async loadAuthData(): Promise<{user: User; tokens: AuthTokens} | null> {
    try {
      const [accessToken, refreshToken, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
      ]);

      if (!accessToken || !refreshToken || !userData) {
        return null;
      }

      const user = JSON.parse(userData) as User;
      const tokens: AuthTokens = {
        accessToken,
        refreshToken,
        expiresAt: 0, // Will be set when we implement JWT parsing
      };

      this.currentUser = user;
      this.tokens = tokens;

      return {user, tokens};
    } catch (error) {
      console.error('Error loading auth data:', error);
      return null;
    }
  }

  // Clear all authentication data
  async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
      
      this.currentUser = null;
      this.tokens = null;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw new Error('Failed to clear authentication data');
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    if (this.currentUser && this.tokens) {
      return true;
    }

    const authData = await this.loadAuthData();
    return authData !== null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get current tokens
  getTokens(): AuthTokens | null {
    return this.tokens;
  }

  // Login user (mock implementation)
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      // Mock successful response
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date().toISOString(),
        emailVerified: true,
      };

      const mockTokens: AuthTokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour
      };

      await this.storeAuthData(mockUser, mockTokens);

      return {user: mockUser, tokens: mockTokens};
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  }

  // Register user (mock implementation)
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      // Mock successful response
      const mockUser: User = {
        id: '2',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      };

      const mockTokens: AuthTokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour
      };

      await this.storeAuthData(mockUser, mockTokens);

      return {user: mockUser, tokens: mockTokens};
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // TODO: Call API to invalidate tokens
      await this.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }

  // Request password reset (mock implementation)
  async requestPasswordReset(email: string): Promise<void> {
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      console.log('Password reset requested for:', email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Password reset request failed');
    }
  }

  // Refresh access token (mock implementation)
  async refreshAccessToken(): Promise<AuthTokens> {
    try {
      if (!this.tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(resolve, 500));

      const newTokens: AuthTokens = {
        accessToken: 'mock_new_access_token_' + Date.now(),
        refreshToken: this.tokens.refreshToken, // Usually stays the same
        expiresAt: Date.now() + 3600000, // 1 hour
      };

      // Update stored tokens
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, newTokens.accessToken);
      this.tokens = newTokens;

      return newTokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Token refresh failed');
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Utility functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  if (password.length < 8) return 'medium';
  if (validatePassword(password)) return 'strong';
  return 'medium';
};