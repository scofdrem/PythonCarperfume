import axios, { AxiosInstance } from 'axios';
import { getAPIBaseURL } from '../lib/config';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    last_login?: string;
  };
}

class AuthApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private getBaseURL() {
    return getAPIBaseURL();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.client.post(
        `${this.getBaseURL()}/api/v1/auth/login`,
        credentials
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw new Error(
        error.response?.data?.detail || 'Failed to login'
      );
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear token from localStorage first
      localStorage.removeItem('auth_token');
      
      // Call logout endpoint
      await this.client.get(`${this.getBaseURL()}/api/v1/auth/logout`);
    } catch (error: any) {
      // Don't throw error for logout failures, just clear local storage
      console.error('Logout error:', error);
    }
  }
}

export const authApi = new AuthApi();