import { BleManager, Device, State } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { Alert } from 'react-native';

// Define the tracker device service and characteristic UUIDs
// Note: These are example UUIDs and should be replaced with the actual UUIDs for your tracker devices
const TRACKER_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const BATTERY_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const LOCATION_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

/**
 * Bluetooth Low Energy Service for TrackMate
 * Handles scanning for, connecting to, and receiving data from BLE tracking devices
 */
class BLEService {
  private bleManager: BleManager;
  private isScanning: boolean = false;
  private connectedDevices: Map<string, Device> = new Map();
  private discoveredDevices: Device[] = [];
  private onDeviceDiscoveredCallbacks: ((device: Device) => void)[] = [];
  private onDeviceDisconnectedCallbacks: ((deviceId: string) => void)[] = [];
  private onBatteryUpdateCallbacks: ((deviceId: string, batteryLevel: number) => void)[] = [];
  private onLocationUpdateCallbacks: ((deviceId: string, latitude: number, longitude: number) => void)[] = [];

  constructor() {
    this.bleManager = new BleManager();
    
    // Setup state change handler
    this.bleManager.onStateChange((state) => {
      if (state === State.PoweredOn) {
        console.log('Bluetooth is powered on');
      } else {
        console.log('Bluetooth state:', state);
        if (this.isScanning) {
          this.stopScan();
        }
      }
    }, true);
  }

  /**
   * Request necessary permissions for BLE on Android
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          // For Android 12+, you might need additional permissions like BLUETOOTH_SCAN and BLUETOOTH_CONNECT
          ...(Platform.Version >= 31 ? [
            'android.permission.BLUETOOTH_SCAN',
            'android.permission.BLUETOOTH_CONNECT'
          ] : [])
        ]);

        return Object.values(granted).every(
          (value) => value === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error('Error requesting BLE permissions:', error);
        return false;
      }
    }
    return true; // iOS doesn't need explicit permissions for BLE
  }

  /**
   * Check if Bluetooth is enabled
   */
  async isBluetoothEnabled(): Promise<boolean> {
    try {
      const state = await this.bleManager.state();
      return state === State.PoweredOn;
    } catch (error) {
      console.error('Error checking Bluetooth state:', error);
      return false;
    }
  }

  /**
   * Start scanning for BLE devices
   */
  async startScan(): Promise<boolean> {
    if (this.isScanning) {
      return true;
    }

    // Check permissions
    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      Alert.alert(
        'Permission Required',
        'TrackMate needs location permission to scan for BLE devices'
      );
      return false;
    }

    // Check if Bluetooth is enabled
    const isEnabled = await this.isBluetoothEnabled();
    if (!isEnabled) {
      Alert.alert(
        'Bluetooth Required',
        'Please enable Bluetooth to scan for tracking devices'
      );
      return false;
    }

    try {
      // Clear previous discovered devices
      this.discoveredDevices = [];
      
      this.isScanning = true;
      
      // Start scanning for devices that match our service UUID
      this.bleManager.startDeviceScan(
        [TRACKER_SERVICE_UUID], 
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error('Error scanning for devices:', error);
            this.stopScan();
            return;
          }

          if (device) {
            // Check if we already discovered this device
            if (!this.discoveredDevices.some(d => d.id === device.id)) {
              this.discoveredDevices.push(device);
              
              // Notify all registered callbacks
              this.onDeviceDiscoveredCallbacks.forEach(callback => {
                callback(device);
              });
            }
          }
        }
      );
      
      // Automatically stop scan after 10 seconds to save battery
      setTimeout(() => {
        if (this.isScanning) {
          this.stopScan();
        }
      }, 10000);
      
      return true;
    } catch (error) {
      console.error('Failed to start BLE scan:', error);
      this.isScanning = false;
      return false;
    }
  }

  /**
   * Stop scanning for BLE devices
   */
  stopScan(): void {
    if (this.isScanning) {
      this.bleManager.stopDeviceScan();
      this.isScanning = false;
      console.log('BLE scan stopped');
    }
  }

  /**
   * Get discovered devices
   */
  getDiscoveredDevices(): Device[] {
    return this.discoveredDevices;
  }

  /**
   * Connect to a specific device
   */
  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      // Check if already connected
      if (this.connectedDevices.has(deviceId)) {
        return true;
      }
      
      // Find the device from discovered devices
      const device = this.discoveredDevices.find(d => d.id === deviceId);
      if (!device) {
        console.error(`Device ${deviceId} not found in discovered devices`);
        return false;
      }
      
      // Connect to the device
      const connectedDevice = await device.connect();
      
      // Discover services and characteristics
      const discoveredDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
      
      // Store the connected device
      this.connectedDevices.set(deviceId, discoveredDevice);
      
      // Setup disconnect listener
      discoveredDevice.onDisconnected((error, device) => {
        if (device) {
          this.connectedDevices.delete(device.id);
          
          // Notify all registered callbacks
          this.onDeviceDisconnectedCallbacks.forEach(callback => {
            callback(device.id);
          });
        }
      });
      
      // Start monitoring battery level and location
      this.startMonitoringDeviceData(discoveredDevice);
      
      return true;
    } catch (error) {
      console.error(`Error connecting to device ${deviceId}:`, error);
      return false;
    }
  }

  /**
   * Disconnect from a specific device
   */
  async disconnectDevice(deviceId: string): Promise<boolean> {
    try {
      const device = this.connectedDevices.get(deviceId);
      if (device) {
        await device.cancelConnection();
        this.connectedDevices.delete(deviceId);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error disconnecting from device ${deviceId}:`, error);
      return false;
    }
  }

  /**
   * Start monitoring data from a device (battery level and location)
   */
  private async startMonitoringDeviceData(device: Device): Promise<void> {
    try {
      // Monitor battery level
      device.monitorCharacteristicForService(
        TRACKER_SERVICE_UUID,
        BATTERY_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error(`Error monitoring battery level for ${device.id}:`, error);
            return;
          }
          
          if (characteristic?.value) {
            // Decode the base64 value to get battery level
            const batteryData = this.decodeBase64(characteristic.value);
            
            // Extract battery level (assuming it's the first byte)
            const batteryLevel = batteryData[0];
            
            // Notify all registered callbacks
            this.onBatteryUpdateCallbacks.forEach(callback => {
              callback(device.id, batteryLevel);
            });
          }
        }
      );
      
      // Monitor location data
      device.monitorCharacteristicForService(
        TRACKER_SERVICE_UUID,
        LOCATION_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error(`Error monitoring location for ${device.id}:`, error);
            return;
          }
          
          if (characteristic?.value) {
            // Decode the base64 value
            const locationData = this.decodeBase64(characteristic.value);
            
            // Parse location data (example format: 8 bytes, 4 for latitude, 4 for longitude as floats)
            const dataView = new DataView(new ArrayBuffer(locationData.length));
            locationData.forEach((value, index) => {
              dataView.setUint8(index, value);
            });
            
            const latitude = dataView.getFloat32(0, true);
            const longitude = dataView.getFloat32(4, true);
            
            // Notify all registered callbacks
            this.onLocationUpdateCallbacks.forEach(callback => {
              callback(device.id, latitude, longitude);
            });
          }
        }
      );
    } catch (error) {
      console.error(`Error setting up monitoring for device ${device.id}:`, error);
    }
  }

  /**
   * Decode base64 string to array of numbers
   */
  private decodeBase64(base64: string): number[] {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return Array.from(bytes);
  }

  /**
   * Register callback for device discovered event
   */
  onDeviceDiscovered(callback: (device: Device) => void): void {
    this.onDeviceDiscoveredCallbacks.push(callback);
  }

  /**
   * Register callback for device disconnected event
   */
  onDeviceDisconnected(callback: (deviceId: string) => void): void {
    this.onDeviceDisconnectedCallbacks.push(callback);
  }

  /**
   * Register callback for battery level update event
   */
  onBatteryUpdate(callback: (deviceId: string, batteryLevel: number) => void): void {
    this.onBatteryUpdateCallbacks.push(callback);
  }

  /**
   * Register callback for location update event
   */
  onLocationUpdate(callback: (deviceId: string, latitude: number, longitude: number) => void): void {
    this.onLocationUpdateCallbacks.push(callback);
  }

  /**
   * Cleanup and disconnect from all devices
   */
  async cleanup(): Promise<void> {
    this.stopScan();
    
    // Disconnect from all devices
    for (const deviceId of this.connectedDevices.keys()) {
      await this.disconnectDevice(deviceId);
    }
    
    // Clear all callbacks
    this.onDeviceDiscoveredCallbacks = [];
    this.onDeviceDisconnectedCallbacks = [];
    this.onBatteryUpdateCallbacks = [];
    this.onLocationUpdateCallbacks = [];
  }
}

// Export as singleton
export default new BLEService(); 