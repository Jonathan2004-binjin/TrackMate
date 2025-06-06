import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddItemScreenProps {
  navigation: any;
}

const AddItemScreen: React.FC<AddItemScreenProps> = ({ navigation }) => {
  const [itemName, setItemName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [enableGeofencing, setEnableGeofencing] = useState(false);
  const [alertWhenOutOfRange, setAlertWhenOutOfRange] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState<any[]>([]);

  const startScan = () => {
    setIsScanning(true);
    
    // Mock scan for devices
    setTimeout(() => {
      setFoundDevices([
        { id: 'BD-45-FA-12', name: 'TrackMate Device', rssi: -65 },
        { id: 'CE-33-BF-55', name: 'TrackMate Mini', rssi: -72 },
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const selectDevice = (device: any) => {
    setDeviceId(device.id);
    setFoundDevices([]);
  };
  
  const saveItem = () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }
    
    if (!deviceId) {
      Alert.alert('Error', 'Please connect to a tracking device');
      return;
    }
    
    // Here you would normally save to your backend
    Alert.alert(
      'Success',
      `Item "${itemName}" has been added to your tracking list`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('Map')
        }
      ]
    );
  };
  
  const renderDeviceList = () => {
    if (foundDevices.length === 0) {
      return (
        <View style={styles.emptyDeviceList}>
          <Text style={styles.emptyText}>
            {isScanning ? 'Scanning for devices...' : 'No devices found'}
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.deviceList}>
        {foundDevices.map(device => (
          <TouchableOpacity 
            key={device.id}
            style={styles.deviceItem}
            onPress={() => selectDevice(device)}
          >
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceId}>{device.id}</Text>
            </View>
            <View style={styles.signalStrength}>
              <MaterialIcons 
                name="signal-cellular-alt" 
                size={18} 
                color={device.rssi > -70 ? '#4CAF50' : '#FFC107'} 
              />
              <Text style={styles.rssiText}>{device.rssi} dBm</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Item</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.formContainer}>
          {/* Item details section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Item Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item name"
                value={itemName}
                onChangeText={setItemName}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="E.g., Electronics, Personal, Vehicle"
                value={category}
                onChangeText={setCategory}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any additional details about this item"
                value={notes}
                onChangeText={setNotes}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          {/* Connect device section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Connect Tracking Device</Text>
            
            <View style={styles.deviceSection}>
              {deviceId ? (
                <View style={styles.connectedDevice}>
                  <View style={styles.connectedInfo}>
                    <MaterialIcons name="bluetooth-connected" size={24} color="#4CAF50" />
                    <View>
                      <Text style={styles.connectedText}>Device Connected</Text>
                      <Text style={styles.deviceId}>{deviceId}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => setDeviceId('')}
                  >
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.scanButton}
                    onPress={startScan}
                    disabled={isScanning}
                  >
                    <MaterialIcons name="bluetooth-searching" size={20} color="white" />
                    <Text style={styles.scanButtonText}>
                      {isScanning ? 'Scanning...' : 'Scan for Devices'}
                    </Text>
                  </TouchableOpacity>
                  
                  {renderDeviceList()}
                </>
              )}
            </View>
          </View>
          
          {/* Settings section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Tracking Settings</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Enable Geofencing</Text>
                <Text style={styles.settingDescription}>
                  Get alerts when this item leaves a defined area
                </Text>
              </View>
              <Switch
                value={enableGeofencing}
                onValueChange={setEnableGeofencing}
                trackColor={{ false: '#d1d1d1', true: '#a4cdff' }}
                thumbColor={enableGeofencing ? '#007bff' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Alert When Out of Range</Text>
                <Text style={styles.settingDescription}>
                  Notify when this item is too far from your phone
                </Text>
              </View>
              <Switch
                value={alertWhenOutOfRange}
                onValueChange={setAlertWhenOutOfRange}
                trackColor={{ false: '#d1d1d1', true: '#a4cdff' }}
                thumbColor={alertWhenOutOfRange ? '#007bff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveItem}
        >
          <Text style={styles.saveButtonText}>Save Item</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  formContainer: {
    marginBottom: 20,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#495057',
  },
  input: {
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  deviceSection: {
    marginTop: 10,
  },
  scanButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  emptyDeviceList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6c757d',
    fontSize: 16,
  },
  deviceList: {
    marginTop: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  deviceId: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  signalStrength: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rssiText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 4,
  },
  connectedDevice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e9f7ef',
    padding: 16,
    borderRadius: 8,
  },
  connectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginLeft: 10,
  },
  changeButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddItemScreen;
