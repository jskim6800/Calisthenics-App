// Recommended routines for new users
// Each template references exercises by id so we can hydrate them dynamically

import { exercises } from './exercises';

const findExercise = (exerciseId) =>
  exercises.find((exercise) => exercise.id === exerciseId) || {};

const routineTemplates = [
  {
    id: 'rec_push_foundation',
    name: 'Push Foundation',
    description: 'Warm up your shoulders, then build push strength with classic calisthenics staples.',
    difficulty: 'beginner',
    focus: 'push',
    duration: '20-25 min',
    exercises: [
      { exerciseId: '2', sets: 2, cueDurationSeconds: 30 },
      { exerciseId: '5', sets: 3, reps: 12 },
      { exerciseId: '40', sets: 3, reps: 10 },
      { exerciseId: '9', sets: 3, reps: 8 },
      { exerciseId: '37', sets: 2, cueDurationSeconds: 45 },
    ],
  },
  {
    id: 'rec_pull_core',
    name: 'Pull + Core Flow',
    description: 'Grip work, pulling strength, and core control for a balanced upper-body session.',
    difficulty: 'intermediate',
    focus: 'pull/core',
    duration: '25-30 min',
    exercises: [
      { exerciseId: '1', sets: 2, cueDurationSeconds: 60 },
      { exerciseId: '6', sets: 3, reps: 12 },
      { exerciseId: '7', sets: 3, reps: 6 },
      { exerciseId: '38', sets: 3, reps: 10 },
      { exerciseId: '3', sets: 2, cueDurationSeconds: 40 },
    ],
  },
  {
    id: 'rec_full_body',
    name: 'Full Body Primer',
    description: 'Simple moves that cover legs, push, pull, and conditioning—perfect day one workout.',
    difficulty: 'beginner',
    focus: 'full body',
    duration: '18-22 min',
    exercises: [
      { exerciseId: '4', sets: 3, reps: 15 },
      { exerciseId: '36', sets: 3, reps: 12 },
      { exerciseId: '5', sets: 3, reps: 10 },
      { exerciseId: '39', sets: 3, reps: 12 },
      { exerciseId: '35', sets: 2, reps: 30 },
      { exerciseId: '37', sets: 1, cueDurationSeconds: 60 },
    ],
  },
  {
    id: 'rec_static_strength',
    name: 'Static Strength Builder',
    description: 'Develop time-under-tension with holds that reinforce body control and posture.',
    difficulty: 'intermediate',
    focus: 'skills',
    duration: '20 min',
    exercises: [
      { exerciseId: '2', sets: 2, cueDurationSeconds: 40 },
      { exerciseId: '3', sets: 2, cueDurationSeconds: 40 },
      { exerciseId: '13', sets: 3, cueDurationSeconds: 30 },
      { exerciseId: '26', sets: 3, cueDurationSeconds: 30 },
      { exerciseId: '19', sets: 2, cueDurationSeconds: 25 },
    ],
  },
];

const hydrateExercises = (exerciseRefs) =>
  exerciseRefs.map((item) => {
    const exercise = findExercise(item.exerciseId);
    return {
      ...exercise,
      sets: item.sets ?? exercise.sets ?? 3,
      reps: item.reps ?? exercise.reps ?? 10,
      cueProfile: item.cueProfile || exercise.cueProfile,
      cueDurationSeconds:
        item.cueDurationSeconds || exercise.cueDurationSeconds || 45,
    };
  });

export const getRecommendedRoutines = () =>
  routineTemplates.map((template) => ({
    ...template,
    isRecommended: true,
    exercises: hydrateExercises(template.exercises),
  }));

export const findRecommendedRoutine = (routineId) =>
  getRecommendedRoutines().find((routine) => routine.id === routineId);

