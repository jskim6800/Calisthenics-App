// This is the main entry point of the app
// It sets up navigation between different screens

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ExerciseLibraryScreen from './screens/ExerciseLibraryScreen';
import CreateRoutineScreen from './screens/CreateRoutineScreen';
import RoutineListScreen from './screens/RoutineListScreen';
import RoutineDetailScreen from './screens/RoutineDetailScreen';
import WorkoutPlayerScreen from './screens/WorkoutPlayerScreen';
import CalendarScreen from './screens/CalendarScreen';

// Create navigation stacks
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main tabs navigation (bottom tabs)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#808080',
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopWidth: 2,
          borderTopColor: '#404040',
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 11,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Routines" 
        component={RoutineListScreen}
        options={{ 
          title: 'Routines',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{ 
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Exercises" 
        component={ExerciseLibraryScreen}
        options={{ 
          title: 'Exercises',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main app component
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CreateRoutine" 
          component={CreateRoutineScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="RoutineDetail" 
          component={RoutineDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="WorkoutPlayer" 
          component={WorkoutPlayerScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

