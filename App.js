import { registerRootComponent } from 'expo'; // Import registerRootComponent

// MUST be first import - polyfills for React Native
// import './shim'; // Commented out to test if conflicting with Firebase Auth

// App.js
// Main entry point cho FARE mobile app

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, View } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

// Import screens

import AICheckScreen from './src/screens/ai/AICheckScreen';
import OutfitSuggestionsScreen from './src/screens/ai/OutfitSuggestionsScreen';
import TryOnScreen from './src/screens/ai/TryOnScreen';
import LandingScreen from './src/screens/auth/LandingScreen';
import LoginOptionsScreen from './src/screens/auth/LoginOptionsScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import FavoritesScreen from './src/screens/favorites/FavoritesScreen';
import TryOnHistoryScreen from './src/screens/favorites/TryOnHistoryScreen';
import BrandItemDetailScreen from './src/screens/home/BrandItemDetailScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import AddItemScreen from './src/screens/wardrobe/AddItemScreen';
import ItemDetailScreen from './src/screens/wardrobe/ItemDetailScreen';
import WardrobeScreen from './src/screens/wardrobe/WardrobeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator (sau khi login)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        animation: 'shift',
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -4,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 20,
          right: 20,
          elevation: 8,
          backgroundColor: '#F3F4F6',
          borderRadius: 32,
          height: 68,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.10,
          shadowRadius: 16,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused, color }) => {
          if (route.name === 'TryOn') {
            return (
              <View style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: focused ? '#111827' : '#1F2937',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 12,
              }}>
                <Ionicons name="grid" size={24} color="white" />
              </View>
            );
          }

          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Wardrobe: focused ? 'shirt' : 'shirt-outline',
            Camera: focused ? 'bag' : 'bag-outline',
            Profile: focused ? 'person' : 'person-outline',
          };

          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} options={{ title: 'Wardrobe' }} />
      <Tab.Screen
        name="TryOn"
        component={TryOnScreen}
        options={{
          title: 'Outfits',
          tabBarLabel: () => null, // hide label for center button
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
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
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="OutfitSuggestions" component={OutfitSuggestionsScreen} />
          <Stack.Screen name="AddItem" component={AddItemScreen} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
          <Stack.Screen name="AICheck" component={AICheckScreen} />
          <Stack.Screen name="BrandItemDetail" component={BrandItemDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TryOnHistory" component={TryOnHistoryScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="LoginOptions" component={LoginOptionsScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <StatusBar style="auto" />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App; // Ensure standard export
registerRootComponent(App); // Explicitly register for Expo