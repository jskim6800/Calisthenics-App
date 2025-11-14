// Calendar Screen
// Shows a calendar where users can schedule routines

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { loadRoutines, loadScheduledWorkouts, saveScheduledWorkouts } from '../utils/storage';
import { colors, spacing, borderRadius, typography, commonStyles } from '../constants/theme';

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState({});
  const [routines, setRoutines] = useState([]);
  const [showRoutinePicker, setShowRoutinePicker] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Reload when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const loadedRoutines = await loadRoutines();
    const loadedScheduled = await loadScheduledWorkouts();
    setRoutines(loadedRoutines);
    setScheduledWorkouts(loadedScheduled);
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setShowRoutinePicker(true);
  };

  const scheduleRoutine = async (routineId) => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;

    const updatedScheduled = {
      ...scheduledWorkouts,
      [selectedDate]: {
        routineId: routine.id,
        routineName: routine.name,
      },
    };

    await saveScheduledWorkouts(updatedScheduled);
    setScheduledWorkouts(updatedScheduled);
    setShowRoutinePicker(false);
    Alert.alert('Success', `${routine.name} scheduled for ${selectedDate}`);
  };

  const removeScheduledWorkout = async () => {
    if (!scheduledWorkouts[selectedDate]) return;

    Alert.alert(
      'Remove Workout',
      'Remove scheduled workout for this date?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updated = { ...scheduledWorkouts };
            delete updated[selectedDate];
            await saveScheduledWorkouts(updated);
            setScheduledWorkouts(updated);
          },
        },
      ]
    );
  };

  // Prepare marked dates for calendar
  const markedDates = {};
  Object.keys(scheduledWorkouts).forEach(date => {
    markedDates[date] = {
      marked: true,
      dotColor: colors.textPrimary,
      selected: date === selectedDate,
      selectedColor: colors.textPrimary,
      selectedTextColor: colors.primaryInverse,
    };
  });
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = { 
      selected: true, 
      selectedColor: colors.textPrimary,
      selectedTextColor: colors.primaryInverse,
    };
  }

  const scheduledRoutine = scheduledWorkouts[selectedDate];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SCHEDULE</Text>
        <View style={styles.headerSpacer} />
      </View>
      <Calendar
        onDayPress={handleDateSelect}
        markedDates={markedDates}
        theme={{
          calendarBackground: colors.surface,
          textSectionTitleColor: colors.textSecondary,
          selectedDayBackgroundColor: colors.textPrimary,
          selectedDayTextColor: colors.primaryInverse,
          todayTextColor: colors.textPrimary,
          dayTextColor: colors.textPrimary,
          textDisabledColor: colors.textTertiary,
          dotColor: colors.textPrimary,
          selectedDotColor: colors.primaryInverse,
          arrowColor: colors.textPrimary,
          monthTextColor: colors.textPrimary,
          indicatorColor: colors.textPrimary,
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '600',
          textMonthFontWeight: '800',
          textDayHeaderFontWeight: '700',
          textDayFontSize: 15,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 13,
        }}
        style={styles.calendar}
      />

      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateLabel}>
          {selectedDate.toUpperCase()}
        </Text>
        {scheduledRoutine ? (
          <View style={styles.scheduledInfo}>
            <Text style={styles.scheduledRoutineName}>
              {scheduledRoutine.routineName.toUpperCase()}
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() =>
                navigation.navigate('WorkoutPlayer', {
                  routineId: scheduledRoutine.routineId,
                })
              }
            >
              <Text style={styles.startButtonText}>START WORKOUT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={removeScheduledWorkout}
            >
              <Text style={styles.removeButtonText}>REMOVE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noWorkoutText}>No workout scheduled</Text>
        )}
      </View>

      <Modal
        visible={showRoutinePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRoutinePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SELECT ROUTINE</Text>
            <ScrollView>
              {routines.length === 0 ? (
                <Text style={styles.noRoutinesText}>
                  No routines available. Create one first!
                </Text>
              ) : (
                routines.map(routine => (
                  <TouchableOpacity
                    key={routine.id}
                    style={styles.routineOption}
                    onPress={() => scheduleRoutine(routine.id)}
                  >
                    <Text style={styles.routineOptionText}>{routine.name.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRoutinePicker(false)}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  calendar: {
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  selectedDateContainer: {
    padding: spacing.md,
  },
  selectedDateLabel: {
    fontSize: typography.md,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  scheduledInfo: {
    ...commonStyles.card,
  },
  scheduledRoutineName: {
    fontSize: typography.lg,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  noWorkoutText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  startButton: {
    ...commonStyles.primaryButton,
    marginBottom: spacing.sm,
  },
  startButtonText: {
    ...commonStyles.primaryButtonText,
  },
  removeButton: {
    ...commonStyles.secondaryButton,
    borderColor: colors.textPrimary,
  },
  removeButtonText: {
    ...commonStyles.secondaryButtonText,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
    padding: spacing.md,
    maxHeight: '70%',
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },
  modalTitle: {
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  noRoutinesText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.md,
  },
  routineOption: {
    ...commonStyles.card,
    marginBottom: spacing.sm,
  },
  routineOptionText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: typography.bold,
    letterSpacing: 0.5,
  },
  cancelButton: {
    ...commonStyles.secondaryButton,
    marginTop: spacing.md,
  },
  cancelButtonText: {
    ...commonStyles.secondaryButtonText,
  },
});
