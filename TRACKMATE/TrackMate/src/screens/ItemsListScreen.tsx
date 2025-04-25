import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Switch,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ItemsListScreenProps {
  navigation: any;
}

interface TrackedItem {
  id: string;
  name: string;
  category: string;
  lastSeen: Date;
  batteryLevel: number;
  isActive: boolean;
}

const ItemsListScreen: React.FC<ItemsListScreenProps> = ({ navigation }) => {
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Mock data for tracked items
    const mockItems: TrackedItem[] = [
      {
        id: '1',
        name: 'Car Keys',
        category: 'Personal',
        lastSeen: new Date(),
        batteryLevel: 85,
        isActive: true
      },
      {
        id: '2',
        name: 'Laptop',
        category: 'Electronics',
        lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        batteryLevel: 65,
        isActive: true
      },
      {
        id: '3',
        name: 'Wallet',
        category: 'Personal',
        lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        batteryLevel: 45,
        isActive: true
      },
      {
        id: '4',
        name: 'Backpack',
        category: 'Personal',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        batteryLevel: 32,
        isActive: true
      },
      {
        id: '5',
        name: 'Bicycle',
        category: 'Vehicle',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        batteryLevel: 15,
        isActive: false
      }
    ];
    
    setItems(mockItems);
  }, []);
  
  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    } else if (diffMins < 60 * 24) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(diffMins / (60 * 24));
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };
  
  const getBatteryIcon = (level: number) => {
    if (level >= 75) return 'battery-full';
    if (level >= 50) return 'battery-std';
    if (level >= 25) return 'battery-50';
    return 'battery-alert';
  };
  
  const getBatteryColor = (level: number) => {
    if (level >= 50) return '#4CAF50';
    if (level >= 25) return '#FFC107';
    return '#F44336';
  };
  
  const toggleItemActive = (id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };
  
  const filteredItems = filterActive === null 
    ? items 
    : items.filter(item => item.isActive === filterActive);
  
  const renderItem = ({ item }: { item: TrackedItem }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
    >
      <View style={styles.itemInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialIcons name="access-time" size={16} color="#6c757d" />
            <Text style={styles.detailText}>
              {formatLastSeen(item.lastSeen)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons 
              name={getBatteryIcon(item.batteryLevel)} 
              size={16} 
              color={getBatteryColor(item.batteryLevel)} 
            />
            <Text style={styles.detailText}>
              {item.batteryLevel}%
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <Switch
          value={item.isActive}
          onValueChange={() => toggleItemActive(item.id)}
          trackColor={{ false: '#d1d1d1', true: '#a4cdff' }}
          thumbColor={item.isActive ? '#007bff' : '#f4f3f4'}
        />
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Items</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddItem')}
        >
          <MaterialIcons name="add" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filterActive === null && styles.filterButtonActive
          ]}
          onPress={() => setFilterActive(null)}
        >
          <Text style={[
            styles.filterText,
            filterActive === null && styles.filterTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filterActive === true && styles.filterButtonActive
          ]}
          onPress={() => setFilterActive(true)}
        >
          <Text style={[
            styles.filterText,
            filterActive === true && styles.filterTextActive
          ]}>
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filterActive === false && styles.filterButtonActive
          ]}
          onPress={() => setFilterActive(false)}
        >
          <Text style={[
            styles.filterText,
            filterActive === false && styles.filterTextActive
          ]}>
            Inactive
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={60} color="#dee2e6" />
          <Text style={styles.emptyText}>No items found</Text>
          <Text style={styles.emptySubtext}>
            {filterActive !== null ? 'Try changing your filter' : 'Add your first item to track'}
          </Text>
          
          {filterActive === null && (
            <TouchableOpacity 
              style={styles.emptyAddButton}
              onPress={() => navigation.navigate('AddItem')}
            >
              <Text style={styles.emptyAddButtonText}>Add Item</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  addButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f8f9fa',
  },
  filterButtonActive: {
    backgroundColor: '#e7f5ff',
  },
  filterText: {
    fontSize: 14,
    color: '#6c757d',
  },
  filterTextActive: {
    color: '#007bff',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginRight: 8,
  },
  categoryContainer: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#495057',
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#6c757d',
  },
  actionsContainer: {
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyAddButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  emptyAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ItemsListScreen; 