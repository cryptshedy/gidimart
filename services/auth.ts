import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

// Auth configuration
const AUTH_CONFIG = {
  google: {
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'myapp',
      path: 'auth'
    }),
  },
  facebook: {
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'myapp',
      path: 'auth'
    }),
  },
  instagram: {
    clientId: process.env.EXPO_PUBLIC_INSTAGRAM_CLIENT_ID || '',
    redirectUri: AuthSession.makeRedirectUri({
      scheme: 'myapp',
      path: 'auth'
    }),
  }
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  userType: 'buyer' | 'seller' | 'both';
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

class AuthService {
  private baseUrl = Platform.OS === 'web' 
    ? 'http://localhost:3000' 
    : process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  // Store auth token
  async storeToken(token: string): Promise<void> {
    await AsyncStorage.setItem('authToken', token);
  }

  // Get stored token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  // Remove token
  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
  }

  // Store user data
  async storeUser(user: User): Promise<void> {
    await AsyncStorage.setItem('userData', JSON.stringify(user));
  }

  // Get stored user
  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Regular email/password signup
  async signup(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    userType: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        await this.storeToken(data.token);
        await this.storeUser(data.user);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Regular email/password login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await this.storeToken(data.token);
        await this.storeUser(data.user);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Google OAuth login
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      if (!AUTH_CONFIG.google.clientId) {
        return { success: false, error: 'Google authentication not configured' };
      }

      const codeChallenge = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(),
        { encoding: Crypto.CryptoEncoding.BASE64URL }
      );

      const request = new AuthSession.AuthRequest({
        clientId: AUTH_CONFIG.google.clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: AUTH_CONFIG.google.redirectUri,
        responseType: AuthSession.ResponseType.Code,
        codeChallenge,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type === 'success') {
        return await this.handleSocialAuth('google', result.params.code);
      } else {
        return { success: false, error: 'Google authentication cancelled' };
      }
    } catch (error) {
      return { success: false, error: 'Google authentication failed' };
    }
  }

  // Facebook OAuth login
  async loginWithFacebook(): Promise<AuthResponse> {
    try {
      if (!AUTH_CONFIG.facebook.clientId) {
        return { success: false, error: 'Facebook authentication not configured' };
      }

      const request = new AuthSession.AuthRequest({
        clientId: AUTH_CONFIG.facebook.clientId,
        scopes: ['public_profile', 'email'],
        redirectUri: AUTH_CONFIG.facebook.redirectUri,
        responseType: AuthSession.ResponseType.Code,
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
      });

      if (result.type === 'success') {
        return await this.handleSocialAuth('facebook', result.params.code);
      } else {
        return { success: false, error: 'Facebook authentication cancelled' };
      }
    } catch (error) {
      return { success: false, error: 'Facebook authentication failed' };
    }
  }

  // Instagram OAuth login
  async loginWithInstagram(): Promise<AuthResponse> {
    try {
      if (!AUTH_CONFIG.instagram.clientId) {
        return { success: false, error: 'Instagram authentication not configured' };
      }

      const request = new AuthSession.AuthRequest({
        clientId: AUTH_CONFIG.instagram.clientId,
        scopes: ['user_profile'],
        redirectUri: AUTH_CONFIG.instagram.redirectUri,
        responseType: AuthSession.ResponseType.Code,
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
      });

      if (result.type === 'success') {
        return await this.handleSocialAuth('instagram', result.params.code);
      } else {
        return { success: false, error: 'Instagram authentication cancelled' };
      }
    } catch (error) {
      return { success: false, error: 'Instagram authentication failed' };
    }
  }

  // Handle social authentication with backend
  private async handleSocialAuth(provider: string, code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, code }),
      });

      const data = await response.json();

      if (response.ok) {
        await this.storeToken(data.token);
        await this.storeUser(data.user);
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error || 'Social authentication failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Logout
  async logout(): Promise<void> {
    await this.removeToken();
    await AsyncStorage.removeItem('userData');
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // Get auth headers for API requests
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();