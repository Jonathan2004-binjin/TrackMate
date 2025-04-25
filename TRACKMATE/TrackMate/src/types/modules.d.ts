// This file provides type declarations for modules that don't have their own type definitions
// or need custom overrides for our project

// React declaration
declare module 'react' {
  // Export React basics
  export const useState: any;
  export const useEffect: any;
  export const createContext: any;
  export const useContext: any;
  export const useRef: any;
  export const useMemo: any;
  export const useCallback: any;

  // Types
  export type FC<P = {}> = (props: P) => any;
  export type FunctionComponent<P = {}> = FC<P>;

  // JSX namespace  
  export namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  // Component class
  export class Component<P = {}, S = {}> {}

  // Default export
  const React: any;
  export default React;
}

// React Native declaration
declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const StyleSheet: any;
  export const TextInput: any;
  export const TouchableOpacity: any;
  export const ScrollView: any;
  export const Switch: any;
  export const Alert: any;
  export const Image: any;
  export const KeyboardAvoidingView: any;
  export const Platform: any;
  export const Modal: any;
  export const Dimensions: any;
  export const ActivityIndicator: any;
  export const FlatList: any;
  export const RefreshControl: any;
  export const LogBox: any;
  export type TextStyle = any;
}

// React Navigation modules
declare module '@react-navigation/native' {
  export const NavigationContainer: any;
}

declare module '@react-navigation/stack' {
  export function createStackNavigator(): any;
}

declare module '@react-navigation/bottom-tabs' {
  export function createBottomTabNavigator(): any;
}

// Expo modules
declare module 'expo-status-bar' {
  export const StatusBar: any;
}

declare module 'expo-location' {
  export function requestForegroundPermissionsAsync(): Promise<{ status: string }>;
  export function getCurrentPositionAsync(options: any): Promise<any>;
  export type LocationObject = any;
}

declare module 'react-native-safe-area-context' {
  export const SafeAreaView: any;
  export const SafeAreaProvider: any;
}

declare module 'react-native-maps' {
  const MapView: any;
  export default MapView;
  export const Marker: any;
  export const Circle: any;
  export const PROVIDER_GOOGLE: any;
}

declare module 'react-native-chart-kit' {
  export const LineChart: any;
}

// Backend/API related modules
declare module 'axios' {
  const axios: any;
  export default axios;
  export type AxiosInstance = any;
  export type AxiosRequestConfig = any;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
  export default AsyncStorage;
}

// Machine learning modules
declare module '@tensorflow/tfjs' {
  export function sequential(): any;
  export const layers: any;
  export function loadLayersModel(path: any): Promise<any>;
  export function tensor2d(data: any, shape?: any): any;
  export type LayersModel = any;
  export type Tensor = any;
}

declare module '@tensorflow/tfjs-react-native' {
  export function asyncStorageIO(modelPath: string): any;
}

// Bluetooth modules
declare module 'react-native-ble-plx' {
  export class BleManager {
    constructor();
    onStateChange(listener: (state: State) => void, emitCurrentState: boolean): void;
    state(): Promise<State>;
    startDeviceScan(
      UUIDs: string[] | null,
      options: any | null,
      listener: (error: Error | null, device: Device | null) => void,
    ): void;
    stopDeviceScan(): void;
  }
  
  export class Device {
    id: string;
    name?: string;
    connect(): Promise<Device>;
    discoverAllServicesAndCharacteristics(): Promise<Device>;
    onDisconnected(listener: (error: Error | null, device: Device) => void): void;
    cancelConnection(): Promise<Device>;
    monitorCharacteristicForService(
      serviceUUID: string,
      characteristicUUID: string,
      listener: (error: Error | null, characteristic: any | null) => void,
    ): void;
  }
  
  export enum State {
    PoweredOn = 'PoweredOn',
    PoweredOff = 'PoweredOff',
  }
} 