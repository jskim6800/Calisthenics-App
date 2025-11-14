// Routine List Screen
// Shows all saved routines that users can browse and start

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loadRoutines, saveRoutines } from '../utils/storage';
import { getDifficultyColor } from '../data/exercises';
import { colors, spacing, borderRadius, typography, commonStyles } from '../constants/theme';

export default function RoutineListScreen({ navigation }) {
  const [routines, setRoutines] = useState([]);

  // Load routines when screen opens
  useEffect(() => {
    loadRoutineList();
  }, []);

  // Reload when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadRoutineList();
    });
    return unsubscribe;
  }, [navigation]);

  const loadRoutineList = async () => {
    const loadedRoutines = await loadRoutines();
    setRoutines(loadedRoutines);
  };

  const deleteRoutine = async (routineId) => {
    Alert.alert(
      'Delete Routine',
      'Are you sure you want to delete this routine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedRoutines = routines.filter(r => r.id !== routineId);
            await saveRoutines(updatedRoutines);
            setRoutines(updatedRoutines);
          },
        },
      ]
    );
  };

  if (routines.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ROUTINES</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>NO ROUTINES YET</Text>
          <Text style={styles.emptySubtext}>
            Create your first routine to get started
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateRoutine')}
          >
            <Text style={styles.createButtonText}>CREATE ROUTINE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ROUTINES</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
        {routines.map(routine => (
          <TouchableOpacity
            key={routine.id}
            style={styles.routineCard}
            onPress={() =>
              navigation.navigate('RoutineDetail', { routineId: routine.id })
            }
          >
            <View style={styles.routineHeader}>
              <Text style={styles.routineName}>{routine.name.toUpperCase()}</Text>
              <TouchableOpacity
                onPress={() => deleteRoutine(routine.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.exerciseCount}>
              {routine.exercises.length} EXERCISE{routine.exercises.length !== 1 ? 'S' : ''}
            </Text>
            <View style={styles.difficultyContainer}>
              {routine.exercises.map((exercise, index) => (
                <View
                  key={index}
                  style={[
                    styles.difficultyDot,
                    {
                      backgroundColor: getDifficultyColor(exercise.difficulty),
                    },
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateRoutine')}
        >
          <Text style={styles.addButtonText}>+ CREATE NEW ROUTINE</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: commonStyles.header,
  backButton: {
    padding: spacing.sm,
    minWidth: 40,
  },
  headerTitle: {
    ...commonStyles.headerTitle,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    minWidth: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  emptySubtext: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  createButton: {
    ...commonStyles.primaryButton,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  createButtonText: {
    ...commonStyles.primaryButtonText,
  },
  routineCard: {
    ...commonStyles.card,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  routineName: {
    fontSize: typography.lg,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 1,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  exerciseCount: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: typography.semibold,
    letterSpacing: 0.5,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  difficultyDot: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.none,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    ...commonStyles.secondaryButton,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  addButtonText: {
    ...commonStyles.secondaryButtonText,
  },
});
