import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationPermission, setLocationPermission] = useState(true);
  const [bluetoothPermission, setBluetoothPermission] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState('metric'); // 'metric' or 'imperial'
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            navigation.navigate('Auth');
          }
        }
      ]
    );
  };
  
  const renderSettingSwitch = (
    title: string, 
    description: string, 
    value: boolean, 
    onValueChange: (newValue: boolean) => void
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d1d1', true: '#a4cdff' }}
        thumbColor={value ? '#007bff' : '#f4f3f4'}
      />
    </View>
  );
  
  const renderSettingOption = (
    title: string,
    subtitle: string,
    iconName: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <View style={styles.optionIconContainer}>
        <MaterialIcons name={iconName} size={24} color="#6c757d" />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#adb5bd" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          {renderSettingSwitch(
            'Push Notifications',
            'Receive alerts for important events',
            notificationsEnabled,
            setNotificationsEnabled
          )}
          
          {renderSettingSwitch(
            'Location Permission',
            'Allow TrackMate to access your location',
            locationPermission,
            setLocationPermission
          )}
          
          {renderSettingSwitch(
            'Bluetooth Permission',
            'Allow TrackMate to connect to tracking devices',
            bluetoothPermission,
            setBluetoothPermission
          )}
          
          {renderSettingSwitch(
            'Dark Mode',
            'Switch between light and dark theme',
            darkMode,
            setDarkMode
          )}
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Distance Unit</Text>
              <Text style={styles.settingDescription}>Choose between kilometers and miles</Text>
            </View>
            <View style={styles.unitSelector}>
              <TouchableOpacity
                style={[
                  styles.unitOption,
                  distanceUnit === 'metric' && styles.unitOptionActive
                ]}
                onPress={() => setDistanceUnit('metric')}
              >
                <Text style={[
                  styles.unitText,
                  distanceUnit === 'metric' && styles.unitTextActive
                ]}>
                  KM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitOption,
                  distanceUnit === 'imperial' && styles.unitOptionActive
                ]}
                onPress={() => setDistanceUnit('imperial')}
              >
                <Text style={[
                  styles.unitText,
                  distanceUnit === 'imperial' && styles.unitTextActive
                ]}>
                  MI
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderSettingOption(
            'Personal Information',
            'Manage your account details',
            'person',
            () => {}
          )}
          
          {renderSettingOption(
            'Password & Security',
            'Update your password and security settings',
            'security',
            () => {}
          )}
          
          {renderSettingOption(
            'Connected Devices',
            'Manage your paired tracking devices',
            'devices',
            () => {}
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingOption(
            'Help Center',
            'Frequently asked questions and guides',
            'help',
            () => {}
          )}
          
          {renderSettingOption(
            'Contact Support',
            'Get help from our support team',
            'support-agent',
            () => {}
          )}
          
          {renderSettingOption(
            'Privacy Policy',
            'Read our privacy policy',
            'privacy-tip',
            () => {}
          )}
          
          {renderSettingOption(
            'Terms of Service',
            'Read our terms of service',
            'description',
            () => {}
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>TrackMate v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  optionIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 8,
  },
  unitSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  unitOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  unitOptionActive: {
    backgroundColor: '#007bff',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  unitTextActive: {
    color: 'white',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#adb5bd',
  },
});

export default SettingsScreen;