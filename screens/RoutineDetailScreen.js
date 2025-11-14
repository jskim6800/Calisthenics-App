// Routine Detail Screen
// Shows details of a routine and lets users start the workout

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { loadRoutines, saveRoutines } from '../utils/storage';
import { exercises as masterExercises, getDifficultyColor } from '../data/exercises';
import { colors, spacing, borderRadius, typography, commonStyles } from '../constants/theme';

const enrichExercise = (exercise) => {
  const canonical = masterExercises.find((item) => item.id === exercise.id) || {};
  return {
    ...canonical,
    ...exercise,
    cueProfile: exercise.cueProfile || canonical.cueProfile,
    cueDurationSeconds:
      exercise.cueDurationSeconds || canonical.cueDurationSeconds || 45,
    sets: exercise.sets ?? canonical.sets ?? 3,
    reps: exercise.reps ?? canonical.reps ?? 10,
  };
};

const hydrateRoutine = (routine) => ({
  ...routine,
  exercises: (routine.exercises || []).map(enrichExercise),
});

const formatDuration = (seconds) => {
  if (!seconds) return '30s';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs === 0 ? `${mins} min` : `${mins} min ${secs}s`;
};

export default function RoutineDetailScreen({ route, navigation }) {
  const { routineId, routineData, isRecommended: initialRecommended } = route.params || {};
  const [routine, setRoutine] = useState(null);
  const [isRecommended, setIsRecommended] = useState(initialRecommended || false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (routineData) {
      setRoutine(hydrateRoutine(routineData));
      setIsRecommended(initialRecommended ?? routineData.isRecommended ?? false);
    } else {
      loadRoutine();
    }
  }, [routineId, routineData]);

  const loadRoutine = async () => {
    const routines = await loadRoutines();
    const foundRoutine = routines.find(r => r.id === routineId);
    if (foundRoutine) {
      setRoutine(hydrateRoutine(foundRoutine));
      setIsRecommended(foundRoutine.isRecommended || false);
    }
  };

  const handleFollowRoutine = async () => {
    if (!routine) return;
    setIsFollowing(true);
    const stored = await loadRoutines();
    const alreadyExists = stored.some(
      (item) => item.templateId === routine.id || item.id === routine.id
    );
    if (alreadyExists) {
      setIsRecommended(false);
      setIsFollowing(false);
      return;
    }
    const newRoutine = {
      ...routine,
      id: `${routine.id}_${Date.now()}`,
      templateId: routine.id,
      isRecommended: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...stored, newRoutine];
    await saveRoutines(updated);
    setIsRecommended(false);
    setIsFollowing(false);
    setRoutine(hydrateRoutine(newRoutine));
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

  if (!routine) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>LOADING...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ROUTINE</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.routineName}>{routine.name.toUpperCase()}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {routine.exercises.length} EXERCISE{routine.exercises.length !== 1 ? 'S' : ''}
            </Text>
            <Text style={styles.statsSeparator}>•</Text>
            <Text style={styles.statsText}>
              {routine.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)} SETS
            </Text>
          </View>

          <View style={styles.exercisesList}>
            {routine.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseNumber}>{index + 1}</Text>
                  <View style={styles.exerciseMainInfo}>
                    <Text style={styles.exerciseName}>{exercise.name.toUpperCase()}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.cueProfile?.startsWith('hold')
                        ? `${exercise.sets} SETS × ${formatDuration(
                            exercise.cueDurationSeconds || 45
                          )} HOLD`
                        : `${exercise.sets} SETS × ${exercise.reps} REPS`}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.difficultyBadge,
                      {
                        backgroundColor: getDifficultyColor(exercise.difficulty),
                      },
                    ]}
                  >
                    <Text style={styles.difficultyText}>
                      {getDifficultyLabel(exercise.difficulty)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {isRecommended && (
            <TouchableOpacity
              style={[styles.startButton, styles.followCta]}
              onPress={handleFollowRoutine}
              disabled={isFollowing}
            >
              <Text style={styles.startButtonText}>
                {isFollowing ? 'ADDING...' : 'ADD TO MY ROUTINES'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              navigation.navigate('WorkoutPlayer', {
                routineId: routine.id,
                routineData: routine,
              })
            }
          >
            <Text style={styles.startButtonText}>START WORKOUT</Text>
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
  header: {
    ...commonStyles.header,
  },
  headerTitle: {
    ...commonStyles.headerTitle,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingText: {
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xl * 3,
    letterSpacing: 2,
  },
  content: {
    padding: spacing.md,
  },
  routineName: {
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: 1.5,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statsText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    letterSpacing: 0.5,
  },
  statsSeparator: {
    fontSize: typography.sm,
    color: colors.textTertiary,
  },
  exercisesList: {
    marginBottom: spacing.lg,
  },
  exerciseItem: {
    ...commonStyles.card,
    marginBottom: spacing.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  exerciseNumber: {
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
    color: colors.textTertiary,
    width: 32,
    textAlign: 'center',
    letterSpacing: 1,
  },
  exerciseMainInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.md,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  exerciseDetails: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    letterSpacing: 0.5,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
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
  startButton: {
    ...commonStyles.primaryButton,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  followCta: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  startButtonText: {
    ...commonStyles.primaryButtonText,
    fontSize: typography.lg,
  },
});
