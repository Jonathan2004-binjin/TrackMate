import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL - replace with your actual backend URL in production
const API_BASE_URL = 'https://api.trackmate.example.com';

/**
 * Interface for user data
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

/**
 * Interface for tracked item data
 */
export interface TrackedItem {
  id: string;
  name: string;
  category: string;
  deviceId: string;
  batteryLevel: number;
  lastSeen: Date;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  isActive: boolean;
  geofence?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for authentication response
 */
interface AuthResponse {
  token: string;
  user: User;
}

/**
 * API Service class for handling all backend API calls
 */
class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;
  
  constructor() {
    // Initialize axios instance
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Add request interceptor for auth token
    this.api.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        if (!this.token) {
          this.token = await this.getAuthToken();
        }
        
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Get the stored auth token
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@auth_token');
    } catch (error) {
      console.error('Failed to get auth token', error);
      return null;
    }
  }
  
  /**
   * Set the auth token
   */
  private async setAuthToken(token: string): Promise<void> {
    try {
      this.token = token;
      await AsyncStorage.setItem('@auth_token', token);
    } catch (error) {
      console.error('Failed to save auth token', error);
    }
  }
  
  /**
   * Clear the auth token (logout)
   */
  private async clearAuthToken(): Promise<void> {
    try {
      this.token = null;
      await AsyncStorage.removeItem('@auth_token');
    } catch (error) {
      console.error('Failed to clear auth token', error);
    }
  }
  
  /**
   * Register a new user
   */
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      });
      
      await this.setAuthToken(response.data.token);
      return response.data.user;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  }
  
  /**
   * Login a user
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      
      await this.setAuthToken(response.data.token);
      return response.data.user;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
      await this.clearAuthToken();
    } catch (error) {
      console.error('Logout failed', error);
      // Clear token anyway
      await this.clearAuthToken();
    }
  }
  
  /**
   * Get the current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<User>('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user', error);
      throw error;
    }
  }
  
  /**
   * Get all tracked items for the current user
   */
  async getTrackedItems(): Promise<TrackedItem[]> {
    try {
      const response = await this.api.get<TrackedItem[]>('/items');
      return response.data;
    } catch (error) {
      console.error('Failed to get tracked items', error);
      throw error;
    }
  }
  
  /**
   * Get a specific tracked item by ID
   */
  async getTrackedItem(itemId: string): Promise<TrackedItem> {
    try {
      const response = await this.api.get<TrackedItem>(`/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get item ${itemId}`, error);
      throw error;
    }
  }
  
  /**
   * Add a new tracked item
   */
  async addTrackedItem(itemData: {
    name: string;
    category: string;
    deviceId: string;
    geofence?: {
      latitude: number;
      longitude: number;
      radius: number;
    };
  }): Promise<TrackedItem> {
    try {
      const response = await this.api.post<TrackedItem>('/items', itemData);
      return response.data;
    } catch (error) {
      console.error('Failed to add tracked item', error);
      throw error;
    }
  }
  
  /**
   * Update a tracked item
   */
  async updateTrackedItem(
    itemId: string,
    updates: Partial<TrackedItem>
  ): Promise<TrackedItem> {
    try {
      const response = await this.api.put<TrackedItem>(
        `/items/${itemId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update item ${itemId}`, error);
      throw error;
    }
  }
  
  /**
   * Delete a tracked item
   */
  async deleteTrackedItem(itemId: string): Promise<void> {
    try {
      await this.api.delete(`/items/${itemId}`);
    } catch (error) {
      console.error(`Failed to delete item ${itemId}`, error);
      throw error;
    }
  }
  
  /**
   * Update the location of a tracked item
   * This would typically be called when receiving location updates from tracking devices
   */
  async updateItemLocation(
    itemId: string,
    latitude: number,
    longitude: number
  ): Promise<TrackedItem> {
    try {
      const response = await this.api.patch<TrackedItem>(
        `/items/${itemId}/location`,
        {
          latitude,
          longitude,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update location for item ${itemId}`, error);
      throw error;
    }
  }
  
  /**
   * Get notifications for the current user
   */
  async getNotifications(limit: number = 20, offset: number = 0): Promise<any[]> {
    try {
      const response = await this.api.get('/notifications', {
        params: { limit, offset },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get notifications', error);
      throw error;
    }
  }
  
  /**
   * Mark a notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await this.api.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error(`Failed to mark notification ${notificationId} as read`, error);
      throw error;
    }
  }
}

// Export as singleton
export default new ApiService(); 