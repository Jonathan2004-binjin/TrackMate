import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define interface for component props
interface MapScreenProps {
  navigation: any;
}

// Define interface for tracked items data structure
interface TrackedItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  batteryLevel: number;
  lastUpdated: Date;
  isActive: boolean;
}

// Main component definition with type annotations
const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  // State variables using React hooks
  const [location, setLocation] = useState<Location.LocationObject | null>(null); // Stores user's current location
  const [errorMsg, setErrorMsg] = useState<string | null>(null);                  // Stores error messages
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);           // Stores list of tracked items
  const [selectedItem, setSelectedItem] = useState<TrackedItem | null>(null);    // Stores currently selected item
  const [modalVisible, setModalVisible] = useState(false);                       // Controls modal visibility

  // useEffect hook to run code on component mount
  useEffect(() => {
    // Self-executing async function to handle location permissions and data fetching
    (async () => {
      // Request permission to access device location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the user's current position
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      // Create mock data for tracked items relative to user's position
      const mockItems = [
        {
          id: '1',
          name: 'Car Keys',
          latitude: location.coords.latitude + 0.002,
          longitude: location.coords.longitude + 0.002,
          batteryLevel: 85,
          lastUpdated: new Date(),
          isActive: true
        },
        {
          id: '2',
          name: 'Laptop',
          latitude: location.coords.latitude - 0.001,
          longitude: location.coords.longitude + 0.001,
          batteryLevel: 65,
          lastUpdated: new Date(),
          isActive: true
        },
        {
          id: '3',
          name: 'Wallet',
          latitude: location.coords.latitude + 0.0015,
          longitude: location.coords.longitude - 0.001,
          batteryLevel: 45,
          lastUpdated: new Date(),
          isActive: true
        }
      ];
      
      // Update state with mock items
      setTrackedItems(mockItems);
    })();
  }, []); // Empty dependency array means this effect runs once when component mounts

  // Function to handle when a tracked item marker is pressed
  const handleItemPress = (item: TrackedItem) => {
    setSelectedItem(item);  // Set the selected item
    setModalVisible(true);  // Show the modal
  };

  // Function to format the timestamp of last update
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to determine color based on battery level
  const getBatteryColor = (level: number) => {
    if (level > 70) return '#4CAF50';  // Green for high battery
    if (level > 30) return '#FFC107';  // Yellow for medium battery
    return '#F44336';                   // Red for low battery
  };

  // Component render method - returns JSX
  return (
    <SafeAreaView style={styles.container}>
      {/* Conditional rendering based on error state */}
      {errorMsg ? (
        // Show error message if there's an error
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        // Show the map if there's no error
        <View style={styles.container}>
          {/* Only render map if location is available */}
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,  // Controls zoom level (smaller = more zoomed in)
                longitudeDelta: 0.01,
              }}
              showsUserLocation  // Shows a blue dot for the user's location
              showsCompass       // Shows compass control
              showsScale         // Shows scale information
            >
              {/* Circle around user's location to indicate proximity */}
              <Circle
                center={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                radius={200}  // 200 meters radius
                fillColor="rgba(0, 122, 255, 0.1)"       // Light blue fill
                strokeColor="rgba(0, 122, 255, 0.3)"     // Slightly darker blue stroke
                strokeWidth={2}
              />
              
              {/* Map through tracked items array and create a marker for each */}
              {trackedItems.map(item => (
                <Marker
                  key={item.id}  // React requires a unique key for list items
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  title={item.name}
                  description={`Battery: ${item.batteryLevel}%`}
                  pinColor={item.batteryLevel < 20 ? 'red' : '#1E88E5'}  // Red for low battery, blue otherwise
                  onPress={() => handleItemPress(item)}  // Handle tap on marker
                />
              ))}
            </MapView>
          )}
          
          {/* Floating action buttons at the bottom of the screen */}
          <View style={styles.buttonsContainer}>
            {/* Button to add a new tracked item */}
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddItem')}  // Navigate to AddItem screen
            >
              <MaterialIcons name="add" size={24} color="white" />
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
            
            {/* Button to view list of tracked items */}
            <TouchableOpacity 
              style={styles.listButton}
              onPress={() => navigation.navigate('ItemsList')}  // Navigate to ItemsList screen
            >
              <MaterialIcons name="list" size={24} color="white" />
              <Text style={styles.buttonText}>My Items</Text>
            </TouchableOpacity>
          </View>
          
          {/* Modal popup for item details - shown when an item is selected */}
          <Modal
            animationType="slide"       // Slides up from bottom
            transparent={true}          // Background is semi-transparent
            visible={modalVisible}      // Controlled by state
            onRequestClose={() => setModalVisible(false)}  // Handle back button on Android
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Only render content if there's a selected item */}
                {selectedItem && (
                  <>
                    {/* Modal header with item name and close button */}
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <MaterialIcons name="close" size={24} color="#333" />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Item details section */}
                    <View style={styles.detailsContainer}>
                      {/* Battery level with icon */}
                      <View style={styles.detailRow}>
                        <MaterialIcons name="battery-std" size={24} color={getBatteryColor(selectedItem.batteryLevel)} />
                        <Text style={styles.detailText}>Battery: {selectedItem.batteryLevel}%</Text>
                      </View>
                      
                      {/* Last update time with icon */}
                      <View style={styles.detailRow}>
                        <MaterialIcons name="access-time" size={24} color="#555" />
                        <Text style={styles.detailText}>
                          Last Updated: {formatLastUpdated(selectedItem.lastUpdated)}
                        </Text>
                      </View>
                      
                      {/* Active status with colored indicator */}
                      <View style={styles.detailRow}>
                        <MaterialIcons 
                          name="circle" 
                          size={12} 
                          color={selectedItem.isActive ? "#4CAF50" : "#F44336"}  // Green if active, red if inactive
                        />
                        <Text style={styles.detailText}>
                          Status: {selectedItem.isActive ? "Active" : "Inactive"}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Action buttons section */}
                    <View style={styles.actionButtons}>
                      {/* Button to trigger alert sound on device */}
                      <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="notifications" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Alert</Text>
                      </TouchableOpacity>
                      
                      {/* Button to get directions to item */}
                      <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="directions" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Directions</Text>
                      </TouchableOpacity>
                      
                      {/* Button to mark item as lost */}
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: '#F44336' }]}  // Red background for warning action
                      >
                        <MaterialIcons name="location-off" size={20} color="white" />
                        <Text style={styles.actionButtonText}>Mark Lost</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
};

// StyleSheet for component styling - separates styles from component logic
const styles = StyleSheet.create({
  // Main container style
  container: {
    flex: 1,  // Take up all available space
    backgroundColor: '#f8f9fa',
  },
  // Map view style - full width and height
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  // Container for error message
  errorContainer: {
    flex: 1,
    justifyContent: 'center',  // Center content vertically
    alignItems: 'center',      // Center content horizontally
    padding: 20,
  },
  // Error message text style
  errorText: {
    fontSize: 16,
    color: '#dc3545',  // Red color for error
    textAlign: 'center',
  },
  // Container for floating action buttons
  buttonsContainer: {
    position: 'absolute',  // Position over the map
    bottom: 20,            // 20 pixels from bottom
    left: 0,
    right: 0,
    flexDirection: 'row',  // Arrange buttons horizontally
    justifyContent: 'space-around',  // Space buttons evenly
    paddingHorizontal: 20,
  },
  // Add item button style
  addButton: {
    backgroundColor: '#007bff',  // Blue background
    borderRadius: 50,            // Rounded corners
    padding: 15,
    flexDirection: 'row',        // Arrange icon and text horizontally
    alignItems: 'center',        // Center items vertically
    elevation: 4,                // Android shadow
    shadowColor: '#000',         // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  // List items button style
  listButton: {
    backgroundColor: '#6c757d',  // Gray background
    borderRadius: 50,            // Rounded corners
    padding: 15,
    flexDirection: 'row',        // Arrange icon and text horizontally
    alignItems: 'center',        // Center items vertically
    elevation: 4,                // Android shadow
    shadowColor: '#000',         // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  // Text style for buttons
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  // Modal container covering full screen with semi-transparent background
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',  // Align to bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent black
  },
  // Modal content area
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,    // Rounded top corners
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: '#000',        // Shadow for elevation effect
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Modal header containing title and close button
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Space between title and close button
    alignItems: 'center',
    marginBottom: 15,
  },
  // Modal title text style
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
  },
  // Container for item details in modal
  detailsContainer: {
    marginBottom: 20,
  },
  // Style for each detail row
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Text style for detail items
  detailText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 10,
  },
  // Container for action buttons in modal
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Space buttons evenly
  },
  // Individual action button style
  actionButton: {
    backgroundColor: '#007bff',  // Blue background
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    flex: 1,                     // Take equal width
    marginHorizontal: 5,
    flexDirection: 'row',        // Arrange icon and text horizontally
    justifyContent: 'center',    // Center content
  },
  // Text style for action buttons
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default MapScreen; 