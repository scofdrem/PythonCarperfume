import axios, { AxiosInstance } from 'axios';
import { getAPIBaseURL } from './config';

const TOKEN_STORAGE_KEY = 'token';

class RPApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptor to include Authorization header with Bearer token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add interceptor to clear token on 401 responses
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getBaseURL() {
    return getAPIBaseURL();
  }

  async getCurrentUser() {
    try {
      const response = await this.client.get(
        `${this.getBaseURL()}/api/v1/auth/me`
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return null;
      }
      throw new Error(
        error.response?.data?.detail || 'Failed to get user info'
      );
    }
  }

  // Keep existing login method for OIDC compatibility (redirects to /admin/login)
  async login() {
    window.location.href = '/admin/login';
  }

  async logout() {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      const response = await this.client.get(
        `${this.getBaseURL()}/api/v1/auth/logout`
      );
      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        window.location.href = '/admin/login';
      }
    } catch (error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.location.href = '/admin/login';
    }
  }

  // Helper methods for token management
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export const authApi = new RPApi();
