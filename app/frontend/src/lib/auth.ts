import axios, { AxiosInstance } from 'axios';
import { getAPIBaseURL } from './config';

class RPApi {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 401 interceptor — redirect to login
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  getBaseURL() {
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

  async login(username: string, password: string) {
    try {
      const response = await this.client.post(
        `${this.getBaseURL()}/api/v1/auth/admin/login`,
        { username, password }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || 'Login failed'
      );
    }
  }

  async logout() {
    try {
      await this.client.post(
        `${this.getBaseURL()}/api/v1/auth/logout`
      );
    } catch (error) {
      // Best-effort logout
    } finally {
      window.location.href = '/admin/login';
    }
  }

  async refreshToken() {
    try {
      const response = await this.client.post(
        `${this.getBaseURL()}/api/v1/auth/token/refresh`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || 'Token refresh failed'
      );
    }
  }
}

export const authApi = new RPApi();