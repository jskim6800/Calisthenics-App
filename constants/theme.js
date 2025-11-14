// App-wide theme configuration for consistent UI/UX

export const colors = {
  // Dark theme colors
  background: '#000000',           // Pure black background
  surface: '#1A1A1A',             // Dark surface for cards
  surfaceLight: '#2A2A2A',        // Lighter surface for hover/selected states
  
  // Text colors
  textPrimary: '#FFFFFF',         // White primary text
  textSecondary: '#B0B0B0',       // Gray secondary text
  textTertiary: '#808080',        // Darker gray for less important text
  
  // Accent colors
  primary: '#FFFFFF',             // White for primary actions
  primaryInverse: '#000000',      // Black for primary button text
  border: '#404040',              // Gray borders
  borderLight: '#2A2A2A',         // Subtle borders
  
  // Status colors (monochrome)
  success: '#FFFFFF',
  error: '#FFFFFF',
  warning: '#FFFFFF',
  
  // Difficulty colors (as specified in requirements)
  easy: '#90EE90',                // Light green
  intermediate: '#FFE4B5',         // Light yellow
  hard: '#FF6B6B',                // Red
  
  // Muscle group colors (grayscale variants)
  muscle1: '#D0D0D0',
  muscle2: '#B8B8B8',
  muscle3: '#A0A0A0',
  muscle4: '#888888',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
};

export const typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  
  // Font weights
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Common component styles
export const commonStyles = {
  // Header style for all screens
  header: {
    backgroundColor: colors.surface,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Card style
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.primaryInverse,
    fontSize: typography.md,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
};

// Helper function to get difficulty color
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'beginner':
      return colors.easy;
    case 'intermediate':
      return colors.intermediate;
    case 'advanced':
      return colors.hard;
    default:
      return colors.border;
  }
};

// Helper function to get muscle group color (cycling through grayscale)
export const getMuscleGroupColor = (index) => {
  const muscleColors = [
    colors.muscle1,
    colors.muscle2,
    colors.muscle3,
    colors.muscle4,
  ];
  return muscleColors[index % muscleColors.length];
};

