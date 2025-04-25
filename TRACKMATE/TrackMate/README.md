# TrackMate - Item Tracking App

A React Native application for tracking personal items with location monitoring and maps integration.

## Screenshots

Here are screenshots of the main screens:

- **Map Screen**: View all your tracked items on a map
- **Details Screen**: View detailed information about a specific item
- **Item List Screen**: Browse all your tracked items
- **Settings Screen**: Configure app settings and permissions

## Getting Started

### Prerequisites

- Node.js (v12 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trackmate.git
cd trackmate
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
expo start
# or
npm start
```

4. Preview on your device:
   - Install the Expo Go app on your iOS or Android device
   - Scan the QR code shown in the terminal with the Expo Go app
   - Or run on a simulator/emulator with `a` (Android) or `i` (iOS)

## Preview on the Web

To view the app in a web browser:

1. Install the necessary web support packages:
```bash
expo install @expo/webpack-config
```

2. Start the development server with web support:
```bash
expo start --web
```

3. Your default browser will open with the app running

## Features

- **Real-time tracking**: Monitor the location of your items in real-time
- **Interactive maps**: View all your items on an interactive map
- **Item details**: See detailed information about each tracked item
- **Battery monitoring**: Check the battery level of tracking devices
- **Location history**: View the movement history of your items
- **Notifications**: Get alerts when items go out of range or have low battery
- **Dark mode support**: Switch between light and dark themes

## Project Structure

```
trackmate/
├── assets/             # Static assets like images and fonts
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── auth/       # Authentication related components
│   │   ├── map/        # Map and location related components
│   │   ├── tracking/   # Tracking device components
│   │   ├── alerts/     # Notification and alert components
│   │   └── settings/   # Settings and preferences components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API and business logic
│   └── utils/          # Utility functions and helpers
├── App.tsx             # Main app component
└── index.js            # Entry point
```

## Hardware Integration

TrackMate is designed to be compatible with GPS tracking devices that support Bluetooth Low Energy (BLE) connections. The app can scan for, connect to, and receive data from these devices.

Recommended compatible hardware:
- GPS trackers with BLE support
- BLE beacons
- Custom Arduino/ESP32 based trackers

## Machine Learning Integration

The app includes a simple machine learning model to recognize patterns in user behavior related to item usage and predict potential loss scenarios. This feature will alert users proactively when an item is at risk of being lost.

## Contributing

If you'd like to contribute to TrackMate, please fork the repository and use a feature branch. Pull requests are welcome.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries or support, please contact [your-email@example.com](mailto:your-email@example.com).

## How to Use the App

1. **Add Items**: Tap the "+" button on the map screen to add a new item
2. **View Item Details**: Tap any item marker on the map to see details
3. **Track Location**: View real-time location and history of your items
4. **Configure Settings**: Adjust app preferences in the settings screen
5. **Get Notifications**: Receive alerts when items go out of range

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **TypeScript**: Type-safe JavaScript
- **Expo**: Development platform for React Native
- **React Navigation**: Navigation library
- **React Native Maps**: Maps integration
- **Expo Location**: Location services
- **React Native Vector Icons**: Icon library

## Troubleshooting

- **Location not working?** Check if location permissions are granted in your device settings
- **Map not showing?** Ensure you have an active internet connection
- **Items not appearing?** Try refreshing the app or checking if mock data is enabled in settings 