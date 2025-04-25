import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LineChart } from 'react-native-chart-kit';

// Define props interface for the component
interface DetailsScreenProps {
  route: {
    params: {
      itemId: string;
    }
  };
  navigation: any;
}

// Define interface for tracked item data structure
interface TrackedItem {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  lastSeen: string;
  batteryLevel: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'active' | 'inactive' | 'lost';
  history: {
    date: string;
    latitude: number;
    longitude: number;
  }[];
}

// Main component definition
const DetailsScreen: React.FC<DetailsScreenProps> = ({ route, navigation }) => {
  // Extract itemId from navigation route params
  const { itemId } = route.params;
  
  // State variables using React hooks
  const [item, setItem] = useState<TrackedItem | null>(null);     // Stores the item details
  const [loading, setLoading] = useState(true);                   // Tracks loading state
  const [activeTab, setActiveTab] = useState('location');         // Tracks which tab is active

  // Fetch item data when component mounts
  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock data for the item
      const mockItem: TrackedItem = {
        id: itemId,
        name: 'Laptop Backpack',
        type: 'Bag',
        imageUrl: 'https://via.placeholder.com/150',
        lastSeen: '2 minutes ago',
        batteryLevel: 75,
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: '123 Market St, San Francisco, CA 94105'
        },
        status: 'active',
        history: [
          { date: '2023-05-01', latitude: 37.7749, longitude: -122.4194 },
          { date: '2023-05-02', latitude: 37.7755, longitude: -122.4130 },
          { date: '2023-05-03', latitude: 37.7850, longitude: -122.4100 },
          { date: '2023-05-04', latitude: 37.7900, longitude: -122.4090 },
          { date: '2023-05-05', latitude: 37.7890, longitude: -122.4150 },
          { date: '2023-05-06', latitude: 37.7820, longitude: -122.4180 },
          { date: '2023-05-07', latitude: 37.7749, longitude: -122.4194 }
        ]
      };
      
      // Update state with mock data and set loading to false
      setItem(mockItem);
      setLoading(false);
    }, 1000); // Simulate 1 second loading time
  }, [itemId]); // Only re-run if itemId changes

  // Function to handle ringing the device
  const handleRingDevice = () => {
    Alert.alert(
      'Ring Device',
      'Are you sure you want to make your device ring?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Ring',
          onPress: () => {
            Alert.alert('Success', 'Your device is ringing now');
          }
        }
      ]
    );
  };

  // Function to handle marking the item as lost
  const handleMarkAsLost = () => {
    Alert.alert(
      'Mark as Lost',
      'Are you sure you want to mark this item as lost?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Mark as Lost',
          style: 'destructive',
          onPress: () => {
            if (item) {
              // Update the item's status in state
              setItem({
                ...item,
                status: 'lost'
              });
              Alert.alert('Item Marked as Lost', 'You will be notified if someone finds it');
            }
          }
        }
      ]
    );
  };

  // Function to render the Location tab content
  const renderLocationTab = () => {
    if (!item) return null;
    
    return (
      <View style={styles.tabContent}>
        {/* Map container showing the item's location */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              title={item.name}
            >
              <View style={styles.customMarker}>
                <MaterialIcons name="location-on" size={30} color="#007bff" />
              </View>
            </Marker>
          </MapView>
        </View>
        
        {/* Display the item's address */}
        <View style={styles.addressContainer}>
          <MaterialIcons name="place" size={24} color="#6c757d" />
          <Text style={styles.addressText}>{item.location.address}</Text>
        </View>
        
        {/* Display when the item was last seen */}
        <View style={styles.lastSeenContainer}>
          <Text style={styles.lastSeenTitle}>Last seen</Text>
          <Text style={styles.lastSeenTime}>{item.lastSeen}</Text>
        </View>
        
        {/* Button to get directions to the item */}
        <TouchableOpacity 
          style={styles.directionButton}
          onPress={() => {
            Alert.alert('Navigate', 'Opening directions in Maps app');
          }}
        >
          <MaterialIcons name="directions" size={20} color="white" />
          <Text style={styles.directionButtonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Function to render the History tab content
  const renderHistoryTab = () => {
    if (!item) return null;
    
    // Data configuration for the line chart
    const data = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: item.history.map((h, index) => index + 1),
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ["Location History"]
    };
    
    // Configuration for how the chart looks
    const chartConfig = {
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#ffffff",
      color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
      strokeWidth: 2,
      decimalPlaces: 0,
      style: {
        borderRadius: 16
      }
    };
    
    return (
      <View style={styles.tabContent}>
        {/* Section title */}
        <Text style={styles.historyTitle}>Movement History</Text>
        
        {/* Line chart showing movement pattern */}
        <LineChart
          data={data}
          width={Dimensions.get("window").width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
        
        {/* List of previous locations */}
        <Text style={styles.historySubtitle}>Previous Locations</Text>
        <ScrollView style={styles.historyList}>
          {item.history.map((historyItem, index) => (
            <View key={index} style={styles.historyItem}>
              {/* Dot indicator for history item */}
              <View style={styles.historyDot}>
                <View style={styles.innerDot} />
              </View>
              
              {/* History item details */}
              <View style={styles.historyItemContent}>
                <Text style={styles.historyDate}>{historyItem.date}</Text>
                <Text style={styles.historyLocation}>
                  Lat: {historyItem.latitude.toFixed(4)}, Lng: {historyItem.longitude.toFixed(4)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Function to render the Info tab content
  const renderInfoTab = () => {
    if (!item) return null;
    
    return (
      <View style={styles.tabContent}>
        {/* Device information section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>Device Information</Text>
          
          {/* Device type row */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device Type</Text>
            <Text style={styles.infoValue}>{item.type}</Text>
          </View>
          
          {/* Device status row with colored indicator */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: item.status === 'active' ? '#28a745' : item.status === 'inactive' ? '#ffc107' : '#dc3545' }
                ]} 
              />
              <Text 
                style={[
                  styles.statusText,
                  { color: item.status === 'active' ? '#28a745' : item.status === 'inactive' ? '#ffc107' : '#dc3545' }
                ]}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
          
          {/* Battery level row with visual indicator */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Battery</Text>
            <View style={styles.batteryContainer}>
              <View style={styles.batteryOutline}>
                <View 
                  style={[
                    styles.batteryLevel, 
                    { 
                      width: `${item.batteryLevel}%`,
                      backgroundColor: item.batteryLevel > 20 ? '#28a745' : '#dc3545'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.batteryText}>{item.batteryLevel}%</Text>
            </View>
          </View>
        </View>
        
        {/* Device actions section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>Device Actions</Text>
          
          {/* Button to ring the device */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRingDevice}
          >
            <MaterialIcons name="notifications-active" size={20} color="#007bff" />
            <Text style={styles.actionButtonText}>Ring Device</Text>
          </TouchableOpacity>
          
          {/* Button to mark the item as lost */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#f8d7da' }]}
            onPress={handleMarkAsLost}
          >
            <MaterialIcons name="report-problem" size={20} color="#dc3545" />
            <Text style={[styles.actionButtonText, { color: '#dc3545' }]}>Mark as Lost</Text>
          </TouchableOpacity>
          
          {/* Button to navigate to device settings */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              navigation.navigate('Settings');
            }}
          >
            <MaterialIcons name="settings" size={20} color="#007bff" />
            <Text style={styles.actionButtonText}>Device Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  // Show error message if item is not found
  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={60} color="#dc3545" />
        <Text style={styles.errorText}>Item not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main component render
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button, title, and menu */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backIconContainer}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.name}</Text>
        <TouchableOpacity style={styles.moreIconContainer}>
          <MaterialIcons name="more-vert" size={24} color="#212529" />
        </TouchableOpacity>
      </View>
      
      {/* Image of the tracked item */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.itemImage}
          resizeMode="contain"
        />
      </View>
      
      {/* Tab navigation */}
      <View style={styles.tabsContainer}>
        {/* Location tab button */}
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'location' && styles.activeTab]}
          onPress={() => setActiveTab('location')}
        >
          <MaterialIcons 
            name="place" 
            size={24} 
            color={activeTab === 'location' ? '#007bff' : '#6c757d'} 
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'location' && styles.activeTabText
            ]}
          >
            Location
          </Text>
        </TouchableOpacity>
        
        {/* History tab button */}
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <MaterialIcons 
            name="history" 
            size={24} 
            color={activeTab === 'history' ? '#007bff' : '#6c757d'} 
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
        
        {/* Info tab button */}
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <MaterialIcons 
            name="info" 
            size={24} 
            color={activeTab === 'info' ? '#007bff' : '#6c757d'} 
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'info' && styles.activeTabText
            ]}
          >
            Info
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content area - renders different content based on active tab */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === 'location' && renderLocationTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'info' && renderInfoTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

// StyleSheet for component styling
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Loading indicator container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  // Loading text style
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
  // Error container for not found or error states
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  // Error message text style
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginTop: 16,
    marginBottom: 24,
  },
  // Back button style in error view
  backButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  // Back button text style
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  // Header container style
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  // Back icon container style
  backIconContainer: {
    padding: 4,
  },
  // Header title text style
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  // More options icon container style
  moreIconContainer: {
    padding: 4,
  },
  // Image container style
  imageContainer: {
    height: 140,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  // Item image style
  itemImage: {
    width: '100%',
    height: '100%',
  },
  // Tabs container style
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  // Individual tab style
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  // Active tab style (adds bottom border)
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  // Tab text style
  tabText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 4,
  },
  // Active tab text style
  activeTabText: {
    color: '#007bff',
    fontWeight: '500',
  },
  // Content container style
  contentContainer: {
    flex: 1,
  },
  // Tab content style
  tabContent: {
    padding: 16,
  },
  // Map container style
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  // Map style
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  // Custom marker style
  customMarker: {
    alignItems: 'center',
  },
  // Address container style
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  // Address text style
  addressText: {
    fontSize: 14,
    color: '#343a40',
    marginLeft: 8,
    flex: 1,
  },
  // Last seen container style
  lastSeenContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  // Last seen title style
  lastSeenTitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  // Last seen time style
  lastSeenTime: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  // Direction button style
  directionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
  },
  // Direction button text style
  directionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  // History title style
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 16,
  },
  // Chart style
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  // History subtitle style
  historySubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginTop: 16,
    marginBottom: 8,
  },
  // History list container style
  historyList: {
    maxHeight: 300,
  },
  // History item style
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  // History dot style (outer circle)
  historyDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  // History dot inner circle style
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  // History item content container style
  historyItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  // History date text style
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343a40',
    marginBottom: 2,
  },
  // History location text style
  historyLocation: {
    fontSize: 12,
    color: '#6c757d',
  },
  // Info section container style
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  // Info section title style
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 16,
  },
  // Info row style
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  // Info label style
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  // Info value style
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343a40',
  },
  // Status container style
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Status dot style
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  // Status text style
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Battery container style
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Battery outline style
  batteryOutline: {
    width: 50,
    height: 14,
    borderWidth: 1,
    borderColor: '#adb5bd',
    borderRadius: 3,
  },
  // Battery level indicator style
  batteryLevel: {
    height: '100%',
    borderRadius: 2,
  },
  // Battery text style
  batteryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343a40',
    marginLeft: 6,
  },
  // Action button style
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  // Action button text style
  actionButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default DetailsScreen; 