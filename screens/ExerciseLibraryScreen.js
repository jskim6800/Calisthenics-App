// Exercise Library Screen
// Shows all available exercises with color-coded difficulty levels

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exercises, getDifficultyColor, getCategoryIcon, getMuscleGroupColor, getMuscleGroupIcon } from '../data/exercises';
import { colors, spacing, borderRadius, typography, commonStyles } from '../constants/theme';

export default function ExerciseLibraryScreen({ navigation }) {
  // Group exercises by difficulty
  const beginnerExercises = exercises.filter(e => e.difficulty === 'beginner');
  const intermediateExercises = exercises.filter(e => e.difficulty === 'intermediate');
  const advancedExercises = exercises.filter(e => e.difficulty === 'advanced');

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

  const renderExercise = (exercise) => (
    <View
      key={exercise.id}
      style={styles.exerciseCard}
    >
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name.toUpperCase()}</Text>
      </View>
      
      <Text style={styles.exerciseDescription}>{exercise.description}</Text>
      
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
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EXERCISES</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getDifficultyColor('beginner') }]} />
              <Text style={styles.legendText}>EASY</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getDifficultyColor('intermediate') }]} />
              <Text style={styles.legendText}>INTERMEDIATE</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getDifficultyColor('advanced') }]} />
              <Text style={styles.legendText}>HARD</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>EASY</Text>
          {beginnerExercises.map(renderExercise)}

          <Text style={styles.sectionTitle}>INTERMEDIATE</Text>
          {intermediateExercises.map(renderExercise)}

          <Text style={styles.sectionTitle}>HARD</Text>
          {advancedExercises.map(renderExercise)}
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.none,
  },
  legendText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: typography.bold,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    letterSpacing: 1.5,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  exerciseCard: commonStyles.card,
  exerciseHeader: {
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: typography.lg,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
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
});
