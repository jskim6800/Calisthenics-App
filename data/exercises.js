// This file contains all the exercises available in the app
// Each exercise has a name, difficulty level, description, and category
// Based on comprehensive calisthenics skills progression

export const exercises = [
  // BEGINNER EXERCISES (Foundational)
  {
    id: '1',
    name: 'Passive Hang',
    difficulty: 'beginner',
    category: 'pull',
    description: 'Improves grip strength and shoulder health. Prepares you for advanced movements.',
    muscleGroups: ['forearms', 'back', 'shoulders'],
    cueProfile: 'hold_minutes',
    cueDurationSeconds: 60,
  },
  {
    id: '2',
    name: 'Support Hold',
    difficulty: 'beginner',
    category: 'push',
    description: 'Fundamental hold that strengthens shoulders, arms, and chest.',
    muscleGroups: ['shoulders', 'triceps', 'chest'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 45,
  },
  {
    id: '3',
    name: 'Hollow Body Hold',
    difficulty: 'beginner',
    category: 'core',
    description: 'Essential core exercise for body tension and control.',
    muscleGroups: ['core', 'shoulders'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 45,
  },
  {
    id: '4',
    name: 'Squats',
    difficulty: 'beginner',
    category: 'legs',
    description: 'Best exercise for leg muscles, mobility, and explosive power.',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    cueProfile: 'rep_slow',
  },
  {
    id: '5',
    name: 'Push-ups',
    difficulty: 'beginner',
    category: 'push',
    description: 'Essential foundational exercise for chest, shoulders, and triceps.',
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
    cueProfile: 'rep_standard',
  },
  {
    id: '6',
    name: 'Row',
    difficulty: 'beginner',
    category: 'pull',
    description: 'Effective exercise for back, rear shoulders, and biceps.',
    muscleGroups: ['back', 'biceps', 'shoulders'],
    cueProfile: 'rep_standard',
  },

  // BASIC EXERCISES (Building Strength)
  {
    id: '7',
    name: 'Pull-ups',
    difficulty: 'intermediate',
    category: 'pull',
    description: 'One of the most important exercises in calisthenics for upper body strength.',
    muscleGroups: ['back', 'biceps', 'forearms'],
    cueProfile: 'rep_standard',
  },
  {
    id: '8',
    name: 'Crow Pose',
    difficulty: 'intermediate',
    category: 'skills',
    description: 'Challenging balance exercise that improves arm strength and body tension.',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 30,
  },
  {
    id: '9',
    name: 'Dips',
    difficulty: 'intermediate',
    category: 'push',
    description: 'One of the best exercises for chest, shoulders, and triceps.',
    muscleGroups: ['triceps', 'chest', 'shoulders'],
    cueProfile: 'rep_standard',
  },
  {
    id: '10',
    name: 'Toes To Bar',
    difficulty: 'intermediate',
    category: 'core',
    description: 'Engages abdominal muscles and prepares for Front Lever.',
    muscleGroups: ['core', 'back', 'forearms'],
    cueProfile: 'rep_standard',
  },
  {
    id: '11',
    name: 'Skin The Cat',
    difficulty: 'intermediate',
    category: 'skills',
    description: 'Improves shoulder mobility and strengthens your entire upper body.',
    muscleGroups: ['shoulders', 'back', 'core'],
    cueProfile: 'rep_slow',
  },
  {
    id: '12',
    name: 'Pistol Squats',
    difficulty: 'intermediate',
    category: 'legs',
    description: 'Single leg squat requiring balance and strength.',
    muscleGroups: ['quads', 'glutes', 'core'],
    cueProfile: 'rep_slow',
  },

  // INTERMEDIATE EXERCISES
  {
    id: '13',
    name: 'L-Sit',
    difficulty: 'intermediate',
    category: 'core',
    description: 'Advanced core hold requiring extreme strength and control.',
    muscleGroups: ['core', 'shoulders', 'triceps'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 30,
  },
  {
    id: '14',
    name: 'Handstand',
    difficulty: 'intermediate',
    category: 'skills',
    description: 'Perfect balance exercise that builds shoulder strength.',
    muscleGroups: ['shoulders', 'core', 'triceps'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 45,
  },
  {
    id: '15',
    name: 'Tuck Front Lever',
    difficulty: 'intermediate',
    category: 'pull',
    description: 'First progression towards the full front lever.',
    muscleGroups: ['back', 'core', 'biceps'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 30,
  },
  {
    id: '16',
    name: 'Archer Push-ups',
    difficulty: 'intermediate',
    category: 'push',
    description: 'Prepares you for one-arm push-ups with unilateral strength.',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    cueProfile: 'rep_slow',
  },
  {
    id: '17',
    name: 'Typewriter Pull-ups',
    difficulty: 'intermediate',
    category: 'pull',
    description: 'Advanced pull-up variation for increased back strength.',
    muscleGroups: ['back', 'biceps', 'forearms'],
    cueProfile: 'rep_standard',
  },
  {
    id: '18',
    name: 'Dragon Flag',
    difficulty: 'intermediate',
    category: 'core',
    description: 'Extreme core exercise made famous by Bruce Lee.',
    muscleGroups: ['core', 'back', 'shoulders'],
    cueProfile: 'rep_slow',
  },

  // ADVANCED EXERCISES
  {
    id: '19',
    name: 'Front Lever',
    difficulty: 'advanced',
    category: 'skills',
    description: 'Horizontal hold requiring extreme back and core strength.',
    muscleGroups: ['back', 'core', 'shoulders', 'biceps'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 30,
  },
  {
    id: '20',
    name: 'Back Lever',
    difficulty: 'advanced',
    category: 'skills',
    description: 'Demanding static hold that tests your shoulder strength.',
    muscleGroups: ['shoulders', 'chest', 'back', 'biceps'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 30,
  },
  {
    id: '21',
    name: 'Muscle-up',
    difficulty: 'advanced',
    category: 'skills',
    description: 'Advanced pull-up to dip movement requiring explosive power.',
    muscleGroups: ['back', 'chest', 'shoulders', 'triceps', 'core'],
    cueProfile: 'rep_standard',
  },
  {
    id: '22',
    name: 'Human Flag',
    difficulty: 'advanced',
    category: 'skills',
    description: 'Lateral hold requiring extreme oblique and shoulder strength.',
    muscleGroups: ['core', 'shoulders', 'back'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 30,
  },
  {
    id: '23',
    name: 'Handstand Push-ups',
    difficulty: 'advanced',
    category: 'push',
    description: 'Vertical push-ups in handstand position for shoulders.',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    cueProfile: 'rep_standard',
  },
  {
    id: '24',
    name: 'One-Arm Push-ups',
    difficulty: 'advanced',
    category: 'push',
    description: 'Single arm push-up requiring unilateral strength.',
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
    cueProfile: 'rep_slow',
  },
  {
    id: '25',
    name: 'Hefesto',
    difficulty: 'advanced',
    category: 'skills',
    description: 'Explosive pull from Back Lever to Support - extremely demanding.',
    muscleGroups: ['shoulders', 'chest', 'triceps', 'back'],
    cueProfile: 'rep_slow',
  },
  {
    id: '26',
    name: 'Planche Lean',
    difficulty: 'advanced',
    category: 'push',
    description: 'First step towards the full Planche.',
    muscleGroups: ['shoulders', 'chest', 'core'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 30,
  },

  // EXTREME EXERCISES (Elite Level)
  {
    id: '27',
    name: 'Planche',
    difficulty: 'advanced',
    category: 'skills',
    description: 'Ultimate pushing strength skill - horizontal hold on arms.',
    muscleGroups: ['shoulders', 'chest', 'core', 'triceps'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 30,
  },
  {
    id: '28',
    name: 'One Arm Chin-up',
    difficulty: 'advanced',
    category: 'pull',
    description: 'Ultimate strength test - pull up with only one arm.',
    muscleGroups: ['back', 'biceps', 'forearms'],
    cueProfile: 'rep_standard',
  },
  {
    id: '29',
    name: 'Side Split',
    difficulty: 'advanced',
    category: 'legs',
    description: 'Improves hip mobility and leg muscle control.',
    muscleGroups: ['legs', 'glutes'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 60,
  },
  {
    id: '30',
    name: 'V-Sit',
    difficulty: 'advanced',
    category: 'core',
    description: 'Advanced L-Sit progression requiring extreme core tension.',
    muscleGroups: ['core', 'shoulders', 'hamstrings'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 30,
  },
  {
    id: '31',
    name: 'Press Handstand',
    difficulty: 'advanced',
    category: 'skills',
    description: 'Combines strength, flexibility, and control into handstand.',
    muscleGroups: ['shoulders', 'core', 'back'],
    cueProfile: 'rep_slow',
  },
  {
    id: '32',
    name: 'Back Lever Pulls',
    difficulty: 'advanced',
    category: 'pull',
    description: 'Dynamic progression of static Back Lever.',
    muscleGroups: ['shoulders', 'back', 'biceps'],
    cueProfile: 'rep_standard',
  },
  {
    id: '33',
    name: 'Front Lever Pulls',
    difficulty: 'advanced',
    category: 'pull',
    description: 'Dynamic progression demonstrating complete Front Lever mastery.',
    muscleGroups: ['back', 'core', 'biceps'],
    cueProfile: 'rep_standard',
  },
  {
    id: '34',
    name: 'Burpees',
    difficulty: 'beginner',
    category: 'legs',
    description: 'Full body exercise combining strength and cardio.',
    muscleGroups: ['legs', 'chest', 'core', 'cardio'],
    cueProfile: 'rep_fast',
  },
  {
    id: '35',
    name: 'Jumping Jacks',
    difficulty: 'beginner',
    category: 'legs',
    description: 'Classic cardio exercise for warm-up and conditioning.',
    muscleGroups: ['legs', 'shoulders', 'cardio'],
    cueProfile: 'rep_fast',
  },
  {
    id: '36',
    name: 'Lunges',
    difficulty: 'beginner',
    category: 'legs',
    description: 'Alternating leg lunges for lower body strength.',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    cueProfile: 'rep_slow',
  },
  {
    id: '37',
    name: 'Plank',
    difficulty: 'beginner',
    category: 'core',
    description: 'Hold plank position for core stability and endurance.',
    muscleGroups: ['core', 'shoulders'],
    cueProfile: 'hold_time',
    cueDurationSeconds: 60,
  },
  {
    id: '38',
    name: 'Hanging Leg Raises',
    difficulty: 'intermediate',
    category: 'core',
    description: 'Raise legs while hanging for intense core workout.',
    muscleGroups: ['core', 'forearms', 'back'],
    cueProfile: 'rep_standard',
  },
  {
    id: '39',
    name: 'Australian Pull-ups',
    difficulty: 'beginner',
    category: 'pull',
    description: 'Horizontal pull-ups on low bar - perfect for beginners.',
    muscleGroups: ['back', 'biceps', 'shoulders'],
    cueProfile: 'rep_standard',
  },
  {
    id: '40',
    name: 'Diamond Push-ups',
    difficulty: 'intermediate',
    category: 'push',
    description: 'Push-ups with hands in diamond shape for triceps focus.',
    muscleGroups: ['triceps', 'chest', 'shoulders'],
    cueProfile: 'rep_standard',
  },
];

// Helper function to get difficulty color
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'beginner':
      return '#90EE90'; // Light green
    case 'intermediate':
      return '#FFE4B5'; // Light yellow  
    case 'advanced':
      return '#FF6B6B'; // Red
    default:
      return '#404040';
  }
};

// Helper function to get category icon name (calisthenics-focused)
export const getCategoryIcon = (category) => {
  switch (category) {
    case 'push':
      return 'arrow-up-circle-outline';
    case 'pull':
      return 'arrow-down-circle-outline';
    case 'core':
      return 'body-outline';
    case 'legs':
      return 'footsteps-outline';
    case 'skills':
      return 'trophy-outline';
    default:
      return 'help-circle-outline';
  }
};

// Muscle group colors (grayscale for dark theme)
export const getMuscleGroupColor = (muscleGroup, index = 0) => {
  const colors = ['#D0D0D0', '#B8B8B8', '#A0A0A0', '#888888'];
  // Use index to cycle through colors, or map specific muscles
  const muscleIndex = {
    chest: 0,
    back: 1,
    shoulders: 2,
    biceps: 3,
    triceps: 0,
    forearms: 1,
    core: 2,
    quads: 3,
    hamstrings: 0,
    glutes: 1,
    legs: 2,
    cardio: 3,
  };
  return colors[muscleIndex[muscleGroup] || (index % colors.length)];
};

// Muscle group icon mapping (black and white icons)
export const getMuscleGroupIcon = (muscleGroup) => {
  const icons = {
    chest: 'fitness-outline',
    back: 'body-outline',
    shoulders: 'accessibility-outline',
    biceps: 'barbell-outline',
    triceps: 'barbell-outline',
    forearms: 'hand-right-outline',
    core: 'grid-outline',
    quads: 'walk-outline',
    hamstrings: 'walk-outline',
    glutes: 'walk-outline',
    legs: 'footsteps-outline',
    cardio: 'heart-outline',
  };
  return icons[muscleGroup] || 'fitness-outline';
};

export const getMuscleGroupEmoji = (muscleGroup) => {
  // Return empty - we'll use icons instead
  return '';
};

