// Workout Player Screen
// Shows one exercise at a time with pacing options and rest times

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import * as Speech from 'expo-speech';
import { loadRoutines } from '../utils/storage';
import { exercises as masterExercises, getDifficultyColor } from '../data/exercises';
import { loadWorkoutHistory, saveWorkoutHistory } from '../utils/storage';
import { colors, spacing, borderRadius, typography, commonStyles } from '../constants/theme';

const enrichRoutine = (routine) => ({
  ...routine,
  exercises: (routine.exercises || []).map(enrichExercise),
});

export default function WorkoutPlayerScreen({ route, navigation }) {
  const { routineId, routineData } = route.params || {};
  const [routine, setRoutine] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [pacingMode, setPacingMode] = useState(null); // null, 'manual', 'slow', 'medium', 'fast'
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [showPacingModal, setShowPacingModal] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [workoutRating, setWorkoutRating] = useState(null);
  const [isCuePlaying, setIsCuePlaying] = useState(false);
  const [speechVoice, setSpeechVoice] = useState(null);
  const [currentCueRep, setCurrentCueRep] = useState(0);
  const [currentCuePhase, setCurrentCuePhase] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepTimer, setPrepTimer] = useState(0);
  const [hasCueScheduled, setHasCueScheduled] = useState(false);
  const [isHoldActive, setIsHoldActive] = useState(false);
  const [holdRemaining, setHoldRemaining] = useState(0);
  const cueCancelRef = useRef(false);
  const preparationActionRef = useRef(null);
  const cueTimeoutRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const holdTimeoutsRef = useRef([]);

  useEffect(() => {
    if (routineData) {
      setRoutine(enrichRoutine(routineData));
    } else {
      loadRoutine();
    }
  }, [routineId, routineData]);

  useEffect(() => {
    let interval = null;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTimer]);

  useEffect(() => {
    let isMounted = true;
    const loadVoice = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        if (!isMounted || !Array.isArray(voices)) return;
        const preferred = voices.find(
          v =>
            v?.language?.toLowerCase().startsWith('en') &&
            /female|woman|samantha|amy|joanna|linda|emma/i.test(`${v.name} ${v.identifier}`)
        );
        const fallback = voices.find(v => v?.language?.toLowerCase().startsWith('en'));
        const selected = preferred || fallback;
        if (selected) {
          setSpeechVoice(selected.identifier);
        }
      } catch (error) {
        // silently ignore voice loading errors
      }
    };
    loadVoice();
    return () => {
      isMounted = false;
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (isPreparing && prepTimer > 0) {
      interval = setInterval(() => {
        setPrepTimer(prev => {
          if (prev <= 1) {
            setIsPreparing(false);
            const action = preparationActionRef.current;
            preparationActionRef.current = null;
            if (action) action();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPreparing, prepTimer]);

  useEffect(() => {
    cueCancelRef.current = false;
    Speech.stop();
    if (cueTimeoutRef.current) {
      clearTimeout(cueTimeoutRef.current);
      cueTimeoutRef.current = null;
    }
    stopHoldTimer();
    setIsCuePlaying(false);
    setHasCueScheduled(false);
    setCurrentCueRep(0);
    setCurrentCuePhase('');
  }, [currentExerciseIndex, currentSet]);

  useEffect(() => {
    return () => {
      stopCues();
    };
  }, []);

  useEffect(() => {
    if (
      !showPacingModal &&
      pacingMode &&
      routine &&
      !isResting &&
      !isPreparing &&
      !isCuePlaying &&
      !isHoldActive &&
      !hasCueScheduled &&
      !workoutCompleted
    ) {
      startPreparation(() => playCuesForCurrentExercise());
    }
  }, [
    showPacingModal,
    pacingMode,
    routine,
    isResting,
    isPreparing,
    isCuePlaying,
    isHoldActive,
    hasCueScheduled,
    workoutCompleted,
    currentExerciseIndex,
    currentSet,
  ]);

  const enrichExercise = (exercise) => {
    const canonical = masterExercises.find(e => e.id === exercise.id);
    const merged = {
      ...canonical,
      ...exercise,
    };
    merged.cueProfile = exercise?.cueProfile || canonical?.cueProfile || 'rep_standard';
    merged.cueDurationSeconds =
      exercise?.cueDurationSeconds ||
      canonical?.cueDurationSeconds ||
      60;
    return merged;
  };

  const loadRoutine = async () => {
    if (!routineId) return;
    const routines = await loadRoutines();
    const foundRoutine = routines.find(r => r.id === routineId);
    if (!foundRoutine) {
      setRoutine(null);
      return;
    }
    setRoutine(enrichRoutine(foundRoutine));
  };

  const stopCues = () => {
    cueCancelRef.current = true;
    Speech.stop();
    if (cueTimeoutRef.current) {
      clearTimeout(cueTimeoutRef.current);
      cueTimeoutRef.current = null;
    }
    stopHoldTimer();
    setIsCuePlaying(false);
    setCurrentCuePhase('');
    setCurrentCueRep(0);
  };

  const startPreparation = (action) => {
    setCurrentCueRep(0);
    setCurrentCuePhase('READY');
    preparationActionRef.current = action;
    setPrepTimer(5);
    setIsPreparing(true);
    setHasCueScheduled(true);
  };

  const getRestTime = () => {
    if (pacingMode === 'manual') return 0;
    if (pacingMode === 'slow') return 60; // 60 seconds
    if (pacingMode === 'medium') return 30; // 30 seconds
    if (pacingMode === 'fast') return 15; // 15 seconds
    return 30; // default
  };

  const selectPacing = (mode) => {
    setPacingMode(mode);
    setShowPacingModal(false);
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

  const handleSetComplete = () => {
    setHasCueScheduled(false);
    stopCues();
    if (currentSet < totalSets) {
      // Move to next set
      setCurrentSet(currentSet + 1);
      const restTime = getRestTime();
      if (restTime > 0) {
        startRest(restTime);
      }
    } else {
      // Exercise complete, move to next exercise
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        const restTime = getRestTime();
        if (restTime > 0) {
          startRest(restTime * 1.5); // Longer rest between exercises
        }
      } else {
        // Workout complete!
        completeWorkout();
      }
    }
  };

  const startRest = (seconds) => {
    stopCues();
    setHasCueScheduled(false);
    setCurrentCueRep(0);
    setCurrentCuePhase('');
    setIsResting(true);
    setRestTimer(Math.round(seconds));
  };

  const skipRest = () => {
    stopCues();
    setIsResting(false);
    setRestTimer(0);
    setHasCueScheduled(false);
    setCurrentCueRep(0);
    setCurrentCuePhase('');
  };

  const addTenSeconds = () => {
    setRestTimer(prev => prev + 10);
  };

  const completeWorkout = () => {
    stopCues();
    setWorkoutCompleted(true);
    setShowRatingModal(true);
  };

  const saveWorkoutWithRating = async (rating) => {
    setWorkoutRating(rating);
    setShowRatingModal(false);
    
    // Save workout history with rating
    const history = await loadWorkoutHistory();
    const newEntry = {
      routineId: routine.id,
      routineName: routine.name,
      completedAt: new Date().toISOString(),
      felt: rating, // 'easy', 'ok', or 'hard'
    };
    await saveWorkoutHistory([...history, newEntry]);
  };

  const handleFinish = () => {
    navigation.goBack();
  };

  const numberToWord = (num) => {
    const words = [
      'Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
      'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty'
    ];
    if (num <= 20) return words[num];
    const tensWords = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty'];
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    if (num < 70 && ones === 0) return tensWords[tens];
    if (num < 70) return `${tensWords[tens]} ${words[ones]}`;
    return `${num}`;
  };

  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '0:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  const stopHoldTimer = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    holdTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    holdTimeoutsRef.current = [];
    setIsHoldActive(false);
    setHoldRemaining(0);
  };

  const scheduleHoldAnnouncements = (profile, duration) => {
    const timeouts = [];
    if (profile === 'hold_minutes') {
      const totalMinutes = Math.floor(duration / 60);
      for (let minute = 1; minute <= totalMinutes; minute += 1) {
        const timeout = setTimeout(() => {
          Speech.speak(`${minute} minute${minute > 1 ? 's' : ''}`, {
            language: 'en-US',
            voice: speechVoice || undefined,
            pitch: 1.05,
            rate: 0.95,
          });
        }, minute * 60 * 1000);
        timeouts.push(timeout);
      }
    } else {
      const halfway = Math.floor(duration / 2);
      if (halfway > 0) {
        timeouts.push(
          setTimeout(() => {
            Speech.speak('Halfway', {
              language: 'en-US',
              voice: speechVoice || undefined,
              pitch: 1.05,
              rate: 0.95,
            });
          }, halfway * 1000)
        );
      }
      if (duration > 10) {
        timeouts.push(
          setTimeout(() => {
            Speech.speak('10 seconds remaining', {
              language: 'en-US',
              voice: speechVoice || undefined,
              pitch: 1.05,
              rate: 0.95,
            });
          }, (duration - 10) * 1000)
        );
      }
    }
    holdTimeoutsRef.current = timeouts;
  };

  const startHoldTimer = (profile) => {
    if (!currentExercise) return;
    const duration = Number(currentExercise.cueDurationSeconds) || 60;
    stopHoldTimer();
    cueCancelRef.current = false;
    setIsHoldActive(true);
    setIsCuePlaying(true);
    setHoldRemaining(duration);
    setCurrentCueRep(duration);
    setCurrentCuePhase(profile === 'hold_minutes' ? 'MINUTES' : 'SECONDS LEFT');
    Speech.speak('Begin hold', {
      language: 'en-US',
      voice: speechVoice || undefined,
      pitch: 1.1,
      rate: 0.9,
    });
    scheduleHoldAnnouncements(profile, duration);
    holdIntervalRef.current = setInterval(() => {
      setHoldRemaining(prev => {
        if (prev <= 1) {
          clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
          holdTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
          holdTimeoutsRef.current = [];
          setIsHoldActive(false);
          setIsCuePlaying(false);
          setHasCueScheduled(false);
          setCurrentCuePhase('');
          setCurrentCueRep(0);
          setTimeout(() => handleSetComplete(), 300);
          return 0;
        }
        const next = prev - 1;
        setCurrentCueRep(next);
        return next;
      });
    }, 1000);
  };

  const buildRepSequence = (profile, totalReps) => {
    const sequence = [];
    const fastDelay = 200;
    const standardDelay = 400;
    const slowDelay = 600;

    for (let i = 1; i <= totalReps; i += 1) {
      if (profile === 'rep_slow') {
        sequence.push({ text: 'Down', type: 'phase', phase: 'DOWN', delayAfter: slowDelay, rate: 0.85 });
        sequence.push({ text: 'Hold', type: 'phase', phase: 'HOLD', delayAfter: slowDelay, rate: 0.85 });
        sequence.push({ text: 'Up', type: 'phase', phase: 'UP', delayAfter: slowDelay, rate: 0.85 });
        sequence.push({ text: numberToWord(i), type: 'rep', value: i, delayAfter: slowDelay, rate: 0.9 });
      } else if (profile === 'rep_fast') {
        sequence.push({ text: 'Up', type: 'phase', phase: 'UP', delayAfter: fastDelay, rate: 1.1 });
        sequence.push({ text: 'Down', type: 'phase', phase: 'DOWN', delayAfter: fastDelay, rate: 1.1 });
        sequence.push({ text: numberToWord(i), type: 'rep', value: i, delayAfter: fastDelay, rate: 1.15 });
      } else {
        sequence.push({ text: 'Up', type: 'phase', phase: 'UP', delayAfter: standardDelay, rate: 1.0 });
        sequence.push({ text: 'Down', type: 'phase', phase: 'DOWN', delayAfter: standardDelay, rate: 1.0 });
        sequence.push({ text: numberToWord(i), type: 'rep', value: i, delayAfter: standardDelay, rate: 0.95 });
      }
    }
    return sequence;
  };

  const speakSequence = (sequence, index = 0) => {
    if (cueCancelRef.current || index >= sequence.length) {
      cueCancelRef.current = false;
      setIsCuePlaying(false);
      setCurrentCuePhase('');
      if (cueTimeoutRef.current) {
        clearTimeout(cueTimeoutRef.current);
        cueTimeoutRef.current = null;
      }
      return;
    }

    const item = sequence[index];
    if (item.type === 'phase') {
      setCurrentCuePhase(item.phase);
    } else if (item.type === 'rep') {
      setCurrentCuePhase('COUNT');
      setCurrentCueRep(item.value);
    }

    Speech.speak(item.text, {
      language: 'en-US',
      voice: speechVoice || undefined,
      pitch: item.pitch ?? 1.1,
      rate: item.rate ?? 0.95,
      onDone: () => {
        const delay = item.delayAfter ?? 300;
        if (cueTimeoutRef.current) {
          clearTimeout(cueTimeoutRef.current);
        }
        cueTimeoutRef.current = setTimeout(() => {
          speakSequence(sequence, index + 1);
        }, delay);
      },
      onStopped: () => {
        cueCancelRef.current = false;
        if (cueTimeoutRef.current) {
          clearTimeout(cueTimeoutRef.current);
          cueTimeoutRef.current = null;
        }
        setIsCuePlaying(false);
        setCurrentCuePhase('');
      },
      onError: () => {
        cueCancelRef.current = false;
        if (cueTimeoutRef.current) {
          clearTimeout(cueTimeoutRef.current);
          cueTimeoutRef.current = null;
        }
        setIsCuePlaying(false);
        setCurrentCuePhase('');
      },
    });
  };

  const playCuesForCurrentExercise = () => {
    if (isCuePlaying || isResting || isPreparing || !currentExercise) return;
    const profile = currentExercise.cueProfile || 'rep_standard';

    if (profile.startsWith('hold')) {
      if (isHoldActive) return;
      startHoldTimer(profile);
      return;
    }

    const totalReps = Number(currentExercise.reps) || 0;
    if (!totalReps) return;
    const sequence = buildRepSequence(profile, totalReps);
    if (!sequence.length) return;
    cueCancelRef.current = false;
    setIsCuePlaying(true);
    setCurrentCueRep(0);
    speakSequence(sequence);
  };

  if (!routine) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>LOADING...</Text>
      </View>
    );
  }

  const currentExercise = routine.exercises[currentExerciseIndex];
  const totalSets = currentExercise?.sets || 0;
  const totalExercises = routine.exercises.length;
  const cueProfile = currentExercise?.cueProfile || 'rep_standard';
  const isHoldProfile = cueProfile.startsWith('hold');
  const repLabel = isHoldProfile ? 'TIME LEFT' : 'CURRENT REP';
  const repValueDisplay = isHoldProfile
    ? formatDuration(holdRemaining || currentCueRep)
    : currentCueRep;
  const repPhaseDisplay = isHoldProfile
    ? currentCuePhase || 'HOLD'
    : currentCuePhase || '---';
  const secondaryInfo = isHoldProfile
    ? `${formatDuration(Number(currentExercise?.cueDurationSeconds) || 60)} HOLD`
    : `${currentExercise?.reps || 0} REPS`;
  const cueButtonLabel = isHoldActive
    ? 'STOP HOLD'
    : isCuePlaying
    ? 'STOP AUDIO CUES'
    : isPreparing
    ? 'PREPARING...'
    : 'PLAY AUDIO CUES';

  if (isPreparing) {
    return (
      <View style={styles.container}>
        <View style={styles.prepContainer}>
          <Text style={styles.prepTitle}>GET READY</Text>
          <Text style={styles.prepTimer}>{prepTimer}</Text>
          <Text style={styles.prepSubtext}>{currentExercise?.name?.toUpperCase()}</Text>
        </View>
      </View>
    );
  }

  // Pacing Mode Selection Modal
  if (showPacingModal) {
    return (
      <View style={styles.container}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SELECT PACING</Text>
            <Text style={styles.modalSubtitle}>Choose your workout pace</Text>

            <TouchableOpacity
              style={styles.pacingOption}
              onPress={() => selectPacing('manual')}
            >
              <Text style={styles.pacingOptionTitle}>MANUAL</Text>
              <Text style={styles.pacingOptionDesc}>No automatic breaks • Go at your own pace</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pacingOption}
              onPress={() => selectPacing('slow')}
            >
              <Text style={styles.pacingOptionTitle}>AUTO SLOW</Text>
              <Text style={styles.pacingOptionDesc}>60s rest between sets • 90s between exercises</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pacingOption}
              onPress={() => selectPacing('medium')}
            >
              <Text style={styles.pacingOptionTitle}>AUTO MEDIUM</Text>
              <Text style={styles.pacingOptionDesc}>30s rest between sets • 45s between exercises</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pacingOption}
              onPress={() => selectPacing('fast')}
            >
              <Text style={styles.pacingOptionTitle}>AUTO FAST</Text>
              <Text style={styles.pacingOptionDesc}>15s rest between sets • 22s between exercises</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Workout Complete with Rating
  if (workoutCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>WORKOUT COMPLETE</Text>
          <Text style={styles.completedText}>
            {routine.name.toUpperCase()}
          </Text>
          <View style={styles.completedStats}>
            <Text style={styles.completedStatsText}>
              {totalExercises} EXERCISES • {routine.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)} SETS
            </Text>
          </View>
          
          {workoutRating && (
            <View style={styles.ratingResult}>
              <Text style={styles.ratingResultText}>
                YOU FELT: {workoutRating.toUpperCase()}
              </Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>FINISH</Text>
          </TouchableOpacity>
        </View>

        {/* Rating Modal */}
        <Modal
          visible={showRatingModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.ratingModalOverlay}>
            <View style={styles.ratingModalContent}>
              <Text style={styles.ratingModalTitle}>HOW DID IT FEEL?</Text>
              <Text style={styles.ratingModalSubtitle}>Rate your workout intensity</Text>

              <TouchableOpacity
                style={[styles.ratingButton, styles.ratingEasy]}
                onPress={() => saveWorkoutWithRating('easy')}
              >
                <Text style={styles.ratingButtonText}>EASY</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ratingButton, styles.ratingOk]}
                onPress={() => saveWorkoutWithRating('ok')}
              >
                <Text style={styles.ratingButtonText}>OK</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ratingButton, styles.ratingHard]}
                onPress={() => saveWorkoutWithRating('hard')}
              >
                <Text style={styles.ratingButtonText}>HARD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Rest Screen
  if (isResting) {
    return (
      <View style={styles.container}>
        <View style={styles.restContainer}>
          <Text style={styles.restTitle}>REST</Text>
          <Text style={styles.restTimer}>{restTimer}</Text>
          <Text style={styles.restSubtext}>SECONDS</Text>
          
          <View style={styles.restButtons}>
            <TouchableOpacity style={styles.addTimeButton} onPress={addTenSeconds}>
              <Text style={styles.addTimeButtonText}>+10 SEC</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.skipRestButton} onPress={skipRest}>
              <Text style={styles.skipRestButtonText}>SKIP REST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Main Workout Screen
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>
          {currentExerciseIndex + 1} / {totalExercises}
        </Text>
        <Text style={styles.pacingMode}>{pacingMode.toUpperCase()}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.exerciseContainer}>
        <View
          style={[
            styles.difficultyBadge,
            {
              backgroundColor: getDifficultyColor(currentExercise.difficulty),
            },
          ]}
        >
          <Text style={styles.difficultyText}>
            {getDifficultyLabel(currentExercise.difficulty)}
          </Text>
        </View>

        <Text style={styles.exerciseName}>{currentExercise.name.toUpperCase()}</Text>
        <Text style={styles.exerciseDescription}>
          {currentExercise.description}
        </Text>

        <View style={styles.setsContainer}>
          <Text style={styles.setsLabel}>SET</Text>
          <Text style={styles.setsText}>
            {currentSet} / {totalSets}
          </Text>
          <Text style={styles.repsText}>
            {secondaryInfo}
          </Text>
        </View>

        <View style={styles.repDisplay}>
          <Text style={styles.repLabel}>{repLabel}</Text>
          <Text style={styles.repValue}>{repValueDisplay}</Text>
          <Text style={styles.repPhase}>{repPhaseDisplay}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.cueButton,
            isCuePlaying ? styles.cueButtonActive : styles.cueButtonInactive,
            (isResting || isPreparing) && styles.cueButtonDisabled,
          ]}
          onPress={
            isCuePlaying || isHoldActive
              ? stopCues
              : () => startPreparation(() => playCuesForCurrentExercise())
          }
          disabled={isResting || isPreparing}
        >
          <Text style={styles.cueButtonText}>
            {cueButtonLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleSetComplete}
        >
          <Text style={styles.completeButtonText}>COMPLETE SET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            stopCues();
            setHasCueScheduled(false);
            if (currentExerciseIndex < totalExercises - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
              setCurrentSet(1);
            } else {
              completeWorkout();
            }
          }}
        >
          <Text style={styles.skipButtonText}>SKIP EXERCISE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xl * 3,
    letterSpacing: 2,
  },
  // Pacing Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: 2,
  },
  modalSubtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  pacingOption: {
    ...commonStyles.card,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  pacingOptionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  pacingOptionDesc: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.xl * 2,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  progress: {
    fontSize: typography.lg,
    color: colors.textPrimary,
    fontWeight: typography.extrabold,
    letterSpacing: 1,
    flex: 1,
  },
  pacingMode: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: typography.bold,
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: spacing.sm,
    flex: 1,
    alignItems: 'flex-end',
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  // Exercise Display
  exerciseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.none,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  difficultyText: {
    fontSize: typography.xs,
    fontWeight: typography.extrabold,
    color: colors.primaryInverse,
    letterSpacing: 1.5,
  },
  exerciseName: {
    fontSize: typography.xxl * 1.5,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: 2,
  },
  exerciseDescription: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    lineHeight: 24,
  },
  setsContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  repDisplay: {
    marginTop: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.none,
    minWidth: 220,
  },
  repLabel: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  repValue: {
    fontSize: 72,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    letterSpacing: 3,
    lineHeight: 80,
  },
  repPhase: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  setsLabel: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  setsText: {
    fontSize: 64,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 2,
  },
  repsText: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    fontWeight: typography.bold,
    letterSpacing: 1,
  },
  // Actions
  actionsContainer: {
    padding: spacing.md,
    gap: spacing.md,
  },
  cueButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.none,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cueButtonActive: {
    backgroundColor: colors.surface,
  },
  cueButtonInactive: {
    backgroundColor: 'transparent',
  },
  cueButtonDisabled: {
    opacity: 0.4,
  },
  cueButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  completeButton: {
    ...commonStyles.primaryButton,
    padding: spacing.lg,
  },
  completeButtonText: {
    ...commonStyles.primaryButtonText,
    fontSize: typography.lg,
  },
  skipButton: {
    ...commonStyles.secondaryButton,
    padding: spacing.md,
  },
  skipButtonText: {
    ...commonStyles.secondaryButtonText,
  },
  // Rest Screen
  restContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  restTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    letterSpacing: 3,
  },
  restTimer: {
    fontSize: 120,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 4,
  },
  restSubtext: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl * 2,
    fontWeight: typography.bold,
    letterSpacing: 2,
  },
  restButtons: {
    width: '100%',
    gap: spacing.md,
  },
  prepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  prepTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  prepTimer: {
    fontSize: 120,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    letterSpacing: 4,
    marginBottom: spacing.sm,
  },
  prepSubtext: {
    fontSize: typography.md,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  addTimeButton: {
    ...commonStyles.secondaryButton,
    paddingVertical: spacing.lg,
  },
  addTimeButtonText: {
    ...commonStyles.secondaryButtonText,
    fontSize: typography.lg,
  },
  skipRestButton: {
    ...commonStyles.primaryButton,
    paddingVertical: spacing.lg,
  },
  skipRestButtonText: {
    ...commonStyles.primaryButtonText,
    fontSize: typography.lg,
  },
  // Completion Screen
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  completedTitle: {
    fontSize: typography.xxl * 1.2,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
    letterSpacing: 2,
  },
  completedText: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontWeight: typography.bold,
    letterSpacing: 1,
  },
  completedStats: {
    padding: spacing.md,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  completedStatsText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.bold,
    letterSpacing: 1,
  },
  ratingResult: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingResultText: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: typography.bold,
    letterSpacing: 1,
  },
  finishButton: {
    ...commonStyles.primaryButton,
    paddingHorizontal: spacing.xl * 2,
    paddingVertical: spacing.lg,
  },
  finishButtonText: {
    ...commonStyles.primaryButtonText,
    fontSize: typography.lg,
  },
  // Rating Modal
  ratingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  ratingModalContent: {
    padding: spacing.lg,
  },
  ratingModalTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: 2,
  },
  ratingModalSubtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  ratingButton: {
    padding: spacing.lg,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  ratingEasy: {
    backgroundColor: '#90EE90',
  },
  ratingOk: {
    backgroundColor: '#FFE4B5',
  },
  ratingHard: {
    backgroundColor: '#FF6B6B',
  },
  ratingButtonText: {
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
    color: colors.primaryInverse,
    textAlign: 'center',
    letterSpacing: 2,
  },
});
