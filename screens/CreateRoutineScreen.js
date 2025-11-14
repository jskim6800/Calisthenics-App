// Create Routine Screen
// Lets users pick exercises to create a custom routine

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exercises, getDifficultyColor, getCategoryIcon, getMuscleGroupColor, getMuscleGroupIcon } from '../data/exercises';
import { saveRoutines, loadRoutines } from '../utils/storage';
import { colors, spacing, borderRadius, typography, commonStyles } from '../constants/theme';

export default function CreateRoutineScreen({ navigation }) {
  const [routineName, setRoutineName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);

  // Toggle exercise selection
  const toggleExercise = (exerciseId) => {
    if (selectedExercises.includes(exerciseId)) {
      // Remove if already selected
      setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
    } else {
      // Add if not selected
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'EASY';
      case 'intermediate':
        return 'INTERMEDIATE';
      case 'advanced':
        return 'HARD';
      default:
        return difficulty.toUpperCase();
    }
  };

  // Save the routine
  const saveRoutine = async () => {
    if (!routineName.trim()) {
      Alert.alert('Error', 'Please enter a routine name');
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('Error', 'Please select at least one exercise');
      return;
    }

    try {
      // Load existing routines
      const existingRoutines = await loadRoutines();
      
      // Create new routine
      const newRoutine = {
        id: Date.now().toString(),
        name: routineName.trim(),
        exercises: selectedExercises.map(id => {
          const exercise = exercises.find(e => e.id === id);
          return {
            ...exercise,
            sets: 3, // Default to 3 sets
            reps: 10, // Default to 10 reps
          };
        }),
        createdAt: new Date().toISOString(),
      };

      // Save updated routines
      await saveRoutines([...existingRoutines, newRoutine]);

      Alert.alert('Success', 'Routine created!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save routine');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CREATE ROUTINE</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.label}>ROUTINE NAME:</Text>
          <TextInput
            style={styles.input}
            value={routineName}
            onChangeText={setRoutineName}
            placeholder="e.g., MORNING WORKOUT"
            placeholderTextColor={colors.textTertiary}
          />

          <Text style={styles.label}>SELECT EXERCISES:</Text>
          <Text style={styles.hint}>
            Tap exercises to add them to your routine
          </Text>

        {exercises.map(exercise => {
          const isSelected = selectedExercises.includes(exercise.id);
          return (
            <TouchableOpacity
              key={exercise.id}
              style={[
                styles.exerciseCard,
                isSelected && styles.exerciseCardSelected,
              ]}
              onPress={() => toggleExercise(exercise.id)}
            >
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name.toUpperCase()}</Text>
                {isSelected && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color={colors.textPrimary} 
                  />
                )}
              </View>
              
              <Text style={styles.exerciseDescription}>
                {exercise.description}
              </Text>
              
              <Text style={styles.muscleGroupLabel}>TARGETS:</Text>
              <View style={styles.muscleGroupContainer}>
                {exercise.muscleGroups && exercise.muscleGroups.map((muscle, index) => (
                  <View 
                    key={index}
                    style={[
                      styles.muscleGroupBadge,
                      { backgroundColor: getMuscleGroupColor(muscle, index) }
                    ]}
                  >
                    <Ionicons 
                      name={getMuscleGroupIcon(muscle)} 
                      size={14} 
                      color={colors.primaryInverse}
                      style={styles.muscleGroupIconStyle}
                    />
                    <Text style={styles.muscleGroupText}>
                      {muscle.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.metaRow}>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(exercise.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>
                    {getDifficultyLabel(exercise.difficulty)}
                  </Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {exercise.category.toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.saveButton} onPress={saveRoutine}>
          <Text style={styles.saveButtonText}>SAVE ROUTINE</Text>
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
  label: {
    fontSize: typography.md,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  hint: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    fontSize: typography.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    color: colors.textPrimary,
    fontWeight: typography.semibold,
  },
  exerciseCard: {
    ...commonStyles.card,
    borderWidth: 2,
    borderColor: colors.border,
  },
  exerciseCardSelected: {
    borderColor: colors.textPrimary,
    backgroundColor: colors.surfaceLight,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: typography.md,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 1,
  },
  exerciseDescription: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  muscleGroupLabel: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
  muscleGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  muscleGroupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.none,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  muscleGroupIconStyle: {
    marginRight: 2,
  },
  muscleGroupText: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
    color: colors.primaryInverse,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.none,
    borderWidth: 1,
    borderColor: colors.border,
  },
  difficultyText: {
    fontSize: typography.xs,
    fontWeight: typography.extrabold,
    color: colors.primaryInverse,
    letterSpacing: 1,
  },
  categoryBadge: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.none,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: typography.xs,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  saveButton: {
    ...commonStyles.primaryButton,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  saveButtonText: {
    ...commonStyles.primaryButtonText,
    fontSize: typography.lg,
  },
});
