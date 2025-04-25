import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NotificationsScreenProps {
  navigation: any;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'warning' | 'info' | 'success' | 'error';
  itemId?: string;
  itemName?: string;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadNotifications();
  }, []);
  
  const loadNotifications = () => {
    // Mock data for notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Item Out of Range',
        message: 'Your "Wallet" is out of range. Last seen 15 minutes ago.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        read: false,
        type: 'warning',
        itemId: '3',
        itemName: 'Wallet'
      },
      {
        id: '2',
        title: 'Low Battery Alert',
        message: 'Your "Bicycle" tracker is running low on battery (15%).',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        read: false,
        type: 'error',
        itemId: '5',
        itemName: 'Bicycle'
      },
      {
        id: '3',
        title: 'Geofence Alert',
        message: 'Your "Laptop" has left the designated area.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        type: 'warning',
        itemId: '2',
        itemName: 'Laptop'
      },
      {
        id: '4',
        title: 'Item Found',
        message: 'Your "Car Keys" are back in range.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        type: 'success',
        itemId: '1',
        itemName: 'Car Keys'
      },
      {
        id: '5',
        title: 'New Feature Available',
        message: 'Multi-user sharing is now available. Share your items with family members.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        read: true,
        type: 'info'
      }
    ];
    
    setNotifications(mockNotifications);
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      loadNotifications();
      setRefreshing(false);
    }, 1500);
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const formatTimestamp = (date: Date) => {
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
  
  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'check-circle';
      case 'info':
      default:
        return 'info';
    }
  };
  
  const getColorForType = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return '#FFC107';
      case 'error':
        return '#F44336';
      case 'success':
        return '#4CAF50';
      case 'info':
      default:
        return '#2196F3';
    }
  };
  
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        item.read ? styles.notificationRead : styles.notificationUnread
      ]}
      onPress={() => {
        markAsRead(item.id);
        if (item.itemId) {
          navigation.navigate('ItemDetail', { itemId: item.itemId });
        }
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: getColorForType(item.type) }]}>
        <MaterialIcons name={getIconForType(item.type)} size={24} color="white" />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        
        <Text style={styles.message}>{item.message}</Text>
        
        <View style={styles.footer}>
          <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
          
          {item.itemId && (
            <TouchableOpacity 
              style={styles.viewButton}
              onPress={() => {
                markAsRead(item.id);
                navigation.navigate('Map');
              }}
            >
              <Text style={styles.viewButtonText}>View on Map</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="notifications-none" size={60} color="#dee2e6" />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>You're all caught up!</Text>
    </View>
  );
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
            tintColor={'#007bff'}
          />
        }
      />
      
      {notifications.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => setNotifications(notifs => notifs.map(n => ({ ...n, read: true })))}
        >
          <Text style={styles.clearButtonText}>Mark All as Read</Text>
        </TouchableOpacity>
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
  badge: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  notificationUnread: {
    backgroundColor: '#ffffff',
  },
  notificationRead: {
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007bff',
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
  },
  viewButton: {
    backgroundColor: '#e7f5ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewButtonText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    marginTop: 12,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 4,
  },
  clearButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
});

export default NotificationsScreen; 