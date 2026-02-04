import { registerRootComponent } from 'expo'; // Import registerRootComponent
import { View } from 'react-native'; // Add View import

// MUST be first import - polyfills for React Native
// import './shim'; // Commented out to test if conflicting with Firebase Auth

// App.js
// Main entry point cho FARE mobile app

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import screens
import AICheckScreen from './src/screens/ai/AICheckScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import CameraScreen from './src/screens/camera/CameraScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import WardrobeScreen from './src/screens/wardrobe/WardrobeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator (sau khi login)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: '#ffffff',
          borderRadius: 30,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Wardrobe') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (route.name === 'AICheck') {
            iconName = focused ? 'bag-handle' : 'bag-handle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          if (focused) {
            return (
              <View style={{
                width: 45, height: 45, borderRadius: 22.5,
                backgroundColor: 'black', justifyContent: 'center', alignItems: 'center',
                marginTop: -20,
                shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8
              }}>
                <Ionicons name={iconName} size={22} color="white" />
              </View>
            );
          }

          return <Ionicons name={iconName} size={22} color="#9CA3AF" />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="AICheck" component={AICheckScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navigation logic
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App; // Ensure standard export
registerRootComponent(App); // Explicitly register for Expo