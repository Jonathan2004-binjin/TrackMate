/**
 * Helper utility functions for TrackMate app
 */

/**
 * Format a date to a human-readable string
 * 
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a time to a human-readable string
 * 
 * @param date The date to format time from
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate the distance between two coordinates in meters
 * 
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Convert meters to a human-readable distance
 * 
 * @param meters Distance in meters
 * @param useImperial Whether to use imperial units (miles, feet) instead of metric
 * @returns Formatted distance string
 */
export const formatDistance = (meters: number, useImperial: boolean = false): string => {
  if (useImperial) {
    const feet = meters * 3.28084;
    if (feet > 5280) {
      const miles = feet / 5280;
      return `${miles.toFixed(1)} mi`;
    }
    return `${Math.round(feet)} ft`;
  } else {
    if (meters >= 1000) {
      const km = meters / 1000;
      return `${km.toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  }
};

/**
 * Format a time period to a human-readable string
 * 
 * @param date The date to calculate time from
 * @returns Human-readable time ago string
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    return formatDate(date);
  }
};

/**
 * Get a color based on battery level
 * 
 * @param batteryLevel Battery level (0-100)
 * @returns Color string (hex)
 */
export const getBatteryColor = (batteryLevel: number): string => {
  if (batteryLevel >= 60) {
    return '#4CAF50'; // Green
  } else if (batteryLevel >= 30) {
    return '#FFC107'; // Yellow/Amber
  } else {
    return '#F44336'; // Red
  }
};

/**
 * Get battery icon name based on battery level
 * 
 * @param batteryLevel Battery level (0-100)
 * @returns Material icon name for battery
 */
export const getBatteryIcon = (batteryLevel: number): string => {
  if (batteryLevel >= 90) return 'battery-full';
  if (batteryLevel >= 70) return 'battery-6-bar';
  if (batteryLevel >= 50) return 'battery-5-bar';
  if (batteryLevel >= 30) return 'battery-3-bar';
  if (batteryLevel >= 20) return 'battery-2-bar';
  if (batteryLevel >= 10) return 'battery-1-bar';
  return 'battery-alert';
};

/**
 * Truncate a string if it's longer than maxLength
 * 
 * @param str String to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated string with ellipsis if necessary
 */
export const truncateString = (str: string, maxLength: number = 30): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

/**
 * Check if a point is within a geofence
 * 
 * @param lat Latitude of the point
 * @param lng Longitude of the point
 * @param fenceLat Latitude of the geofence center
 * @param fenceLng Longitude of the geofence center
 * @param radiusMeters Radius of the geofence in meters
 * @returns Boolean indicating if point is within the geofence
 */
export const isWithinGeofence = (
  lat: number,
  lng: number,
  fenceLat: number,
  fenceLng: number,
  radiusMeters: number
): boolean => {
  const distance = calculateDistance(lat, lng, fenceLat, fenceLng);
  return distance <= radiusMeters;
};

/**
 * Generate a unique ID
 * 
 * @returns Unique ID string
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Validate an email address
 * 
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate a password (at least 8 chars, 1 number, 1 uppercase)
 * 
 * @param password Password to validate
 * @returns Boolean indicating if password is valid
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[0-9]/.test(password);
}; 