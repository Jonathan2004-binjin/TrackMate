/**
 * Type definitions for TrackMate application
 */

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Auth state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

/**
 * Location interface
 */
export interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
  altitude?: number;
  speed?: number;
}

/**
 * Geofence interface
 */
export interface Geofence {
  id: string;
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in meters
  isActive: boolean;
}

/**
 * Tracking device interface
 */
export interface TrackingDevice {
  id: string;
  name: string;
  deviceId: string; // BLE device ID
  batteryLevel: number;
  isConnected: boolean;
  lastSeen: Date;
}

/**
 * Tracked item interface
 */
export interface TrackedItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
  location: Location | null;
  device: TrackingDevice;
  geofence?: Geofence;
  alertsEnabled: boolean;
  outOfRangeThreshold: number; // in meters
  isActive: boolean;
  lastLocationHistory: Location[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Item risk assessment interface
 */
export interface RiskAssessment {
  itemId: string;
  riskScore: number; // 0-1 value
  riskLevel: 'low' | 'medium' | 'high';
  suggestedAction?: string;
  lastUpdated: Date;
}

/**
 * Notification type
 */
export type NotificationType = 'warning' | 'info' | 'success' | 'error';

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  itemId?: string;
  itemName?: string;
}

/**
 * App settings interface
 */
export interface AppSettings {
  notifications: {
    enabled: boolean;
    outOfRange: boolean;
    lowBattery: boolean;
    geofence: boolean;
    system: boolean;
  };
  display: {
    darkMode: boolean;
    distanceUnit: 'metric' | 'imperial';
    mapType: 'standard' | 'satellite' | 'hybrid';
  };
  security: {
    biometricEnabled: boolean;
    autoLock: boolean;
    autoLockTimeout: number; // in minutes
  };
  privacy: {
    locationSharing: boolean;
    analytics: boolean;
  };
}

/**
 * Custom route parameters
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Map: undefined;
  AddItem: undefined;
  EditItem: { itemId: string };
  ItemDetail: { itemId: string };
  ItemsList: undefined;
  Notifications: undefined;
  Settings: undefined;
  Geofencing: { itemId?: string };
}; 