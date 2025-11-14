// This file handles saving and loading data from device storage
// We use AsyncStorage which works like a simple key-value store

import AsyncStorage from '@react-native-async-storage/async-storage';

// Save routines to storage
export const saveRoutines = async (routines) => {
  try {
    const jsonValue = JSON.stringify(routines);
    await AsyncStorage.setItem('routines', jsonValue);
  } catch (error) {
    console.error('Error saving routines:', error);
  }
};

// Load routines from storage
export const loadRoutines = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('routines');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading routines:', error);
    return [];
  }
};

// Save workout history (which workouts were completed)
export const saveWorkoutHistory = async (history) => {
  try {
    const jsonValue = JSON.stringify(history);
    await AsyncStorage.setItem('workoutHistory', jsonValue);
  } catch (error) {
    console.error('Error saving workout history:', error);
  }
};

// Load workout history
export const loadWorkoutHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('workoutHistory');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading workout history:', error);
    return [];
  }
};

// Save scheduled workouts (calendar)
export const saveScheduledWorkouts = async (scheduled) => {
  try {
    const jsonValue = JSON.stringify(scheduled);
    await AsyncStorage.setItem('scheduledWorkouts', jsonValue);
  } catch (error) {
    console.error('Error saving scheduled workouts:', error);
  }
};

// Load scheduled workouts
export const loadScheduledWorkouts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('scheduledWorkouts');
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (error) {
    console.error('Error loading scheduled workouts:', error);
    return {};
  }
};

