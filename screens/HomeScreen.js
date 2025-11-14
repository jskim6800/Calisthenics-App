// Home screen - the first screen users see
// Shows quick actions and overview

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, borderRadius, typography, commonStyles } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CALISTHENICS</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>STRENGTH • CONTROL • DISCIPLINE</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Routines')}
            >
              <Text style={styles.buttonText}>BROWSE ROUTINES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('CreateRoutine')}
            >
              <Text style={styles.buttonText}>CREATE ROUTINE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Exercises')}
            >
              <Text style={styles.buttonText}>EXERCISE LIBRARY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Calendar')}
            >
              <Text style={styles.buttonText}>SCHEDULE WORKOUT</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
  },
  headerTitle: {
    ...commonStyles.headerTitle,
    fontSize: typography.xxl,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xl * 2,
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: typography.semibold,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  button: {
    ...commonStyles.primaryButton,
    padding: spacing.lg,
  },
  buttonText: {
    ...commonStyles.primaryButtonText,
    fontSize: typography.lg,
  },
});

