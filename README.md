# Calisthenics Workout App

A simple React Native + Expo app for tracking calisthenics workouts. Works on mobile (iOS/Android) and web.

## Features

- 📚 **Exercise Library**: Browse exercises with color-coded difficulty levels
  - Beginner = Light Green
  - Intermediate = Light Yellow  
  - Advanced = Red

- 🏋️ **Create Routines**: Build custom workout routines by selecting exercises

- 📋 **Browse Routines**: View and manage all your saved routines

- ▶️ **Workout Player**: Follow routines with:
  - One exercise at a time display
  - Manual or automatic pacing
  - Rest timers between sets and exercises

- 📅 **Calendar**: Schedule routines on specific dates

- ✅ **Workout Tracking**: Automatically tracks completed workouts

## How to Set Up

### Step 1: Install Dependencies

Open a terminal in this folder and run:

```bash
npm install
```

This will install all the required packages (React Native, Expo, navigation, etc.).

### Step 2: Start the App

Run one of these commands:

```bash
# Start Expo (shows QR code for mobile)
npm start

# Or start for specific platform:
npm run web      # For web browser
npm run ios      # For iOS simulator (Mac only)
npm run android  # For Android emulator
```

### Step 3: Test on Your Device

1. Install the **Expo Go** app on your phone (iOS App Store or Google Play)
2. Scan the QR code that appears when you run `npm start`
3. The app will load on your phone!

## Project Structure

Here's where everything is located:

```
Calisthenics/
├── App.js                    # Main app file (navigation setup)
├── package.json              # Dependencies and scripts
├── app.json                  # Expo configuration
├── data/
│   └── exercises.js          # Exercise library data
├── utils/
│   └── storage.js            # Functions to save/load data
└── screens/
    ├── HomeScreen.js         # Home screen with quick actions
    ├── ExerciseLibraryScreen.js  # Browse all exercises
    ├── CreateRoutineScreen.js    # Create custom routines
    ├── RoutineListScreen.js      # List all saved routines
    ├── RoutineDetailScreen.js    # View routine details
    ├── WorkoutPlayerScreen.js    # Workout player with pacing
    └── CalendarScreen.js         # Calendar for scheduling
```

## How It Works

### Data Storage
- All data (routines, workout history, scheduled workouts) is saved locally on your device using AsyncStorage
- No internet connection needed!
- Data persists between app sessions

### Navigation
- Bottom tabs for main sections (Home, Routines, Calendar, Exercises)
- Stack navigation for detail screens and workout player

### Workout Player
- Shows one exercise at a time
- Toggle between Manual and Auto pacing modes
- Automatic rest timers (30 seconds between sets, 60 seconds between exercises)
- Can skip exercises or rest periods

## Customization

### Adding More Exercises
Edit `data/exercises.js` and add new exercise objects:

```javascript
{
  id: '16',
  name: 'Your Exercise Name',
  difficulty: 'beginner', // or 'intermediate' or 'advanced'
  description: 'Exercise description',
}
```

### Changing Colors
Edit the `getDifficultyColor` function in `data/exercises.js` to change difficulty colors.

## Troubleshooting

**App won't start?**
- Make sure you ran `npm install` first
- Check that Node.js is installed (version 14 or higher)

**Can't see the app on phone?**
- Make sure your phone and computer are on the same WiFi network
- Try restarting Expo (`npm start`)

**Errors in the app?**
- Check the terminal for error messages
- Make sure all dependencies are installed

## Next Steps

Once you have the app running, you can:
1. Browse the exercise library
2. Create your first routine
3. Start a workout
4. Schedule workouts on the calendar

Enjoy your workouts! 💪

