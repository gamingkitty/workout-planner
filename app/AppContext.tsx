import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext(null);

export const exerciseDescriptions = {
  "Bench Press":
    "Lie flat on a bench, grip the barbell or dumbbells just outside shoulder width, lower the weight to your mid-chest under control, then press explosively back up until arms are nearly straight.",
  "Squats":
    "Stand with feet shoulder-width apart, toes slightly turned out, sit back into your hips as you bend your knees and lower until your thighs are at least parallel to the floor, then drive through your heels to stand tall.",
  "Lunges":
    "Stand tall, step one foot forward about two feet, lower your back knee toward the ground until both knees form 90° angles, then press through the front heel to return and repeat on the other side.",
  "Push Ups":
    "Place hands slightly wider than shoulder-width on the floor, keep your body in a straight line from head to heels, lower your chest toward the floor by bending elbows, then push back up to full arm extension.",
  "Bicep Curls":
    "Stand with feet hip-width apart, hold dumbbells at your sides, curl the weights up by bending elbows while keeping upper arms stationary, then slowly lower back down.",
  "Monster Walks":
    "Place a resistance band around your ankles or just above your knees, squat slightly, step laterally against the band’s resistance without letting your feet touch, maintaining tension as you move side-to-side.",
  "Sit Ups":
    "Lie on your back with knees bent and feet flat, cross arms over your chest or place hands behind your ears, engage your core to lift your torso until chest meets thighs, then lower under control.",
  "Russian Twists":
    "Sit with knees bent and feet lifted or on the floor, lean back slightly, hold a weight or clasp hands, rotate your torso to touch the floor beside each hip in a twisting motion.",
  "Bicycles":
    "Lie on your back, hands behind your head, lift shoulders off the floor, bring one knee toward your chest while twisting the opposite elbow toward it, then switch sides in a smooth, pedaling motion.",
  "Deadlift":
    "Stand with feet hip-width under a barbell, hinge at hips and bend knees to grip the bar just outside your shins, drive through heels to lift the bar by extending hips and knees, then lower it under control.",
  "Overhead Press":
    "Stand with feet shoulder-width, hold a barbell or dumbbells at shoulder height, brace your core, then press the weight overhead until arms are fully extended before lowering back down.",
  "Pull Ups":
    "Grip a pull-up bar with palms facing away, hands slightly wider than shoulder-width, pull your body up until your chin clears the bar, then lower under control until arms are straight.",
  "Plank":
    "Start in a forearm plank position with elbows under shoulders and body in a straight line from head to heels, brace your core and hold without letting hips sag or pike.",
  "Tricep Dips":
    "Place hands behind you on a bench or parallel bars, legs extended or bent, lower your body by bending elbows until your upper arms are parallel to the floor, then press back up.",
  "Glute Bridge":
    "Lie on your back with knees bent and feet flat, drive through your heels to lift hips until your body forms a straight line from shoulders to knees, pause at the top, then lower.",
  "Mountain Climbers":
    "Start in a high plank, bring one knee toward your chest, then quickly switch legs in a running motion while keeping your core tight and hips low.",
  "Burpees":
    "From standing, drop into a squat, kick your feet back to a high plank, perform a push-up, jump your feet back to squat, then explosively jump into the air with arms overhead.",
  "Jumping Jacks":
    "Begin standing with feet together and hands at your sides, jump feet out wide while raising arms overhead, then jump back to start in one smooth motion."
};

export const exerciseEquipment = {
  "Bench Press": {
    required: ["Barbell", "Flat bench"],
    optional: ["Safety clips or collars"],
  },
  "Squats": {
    required: ["Barbell", "Squat rack"],
    optional: ["Safety bars or spotter"],
  },
  "Lunges": {
    required: [],
    optional: ["Exercise mat"],
  },
  "Push Ups": {
    required: [],
    optional: ["Exercise mat"],
  },
  "Bicep Curls": {
    required: ["Dumbbells"],
    optional: ["EZ curl bar"],
  },
  "Monster Walks": {
    required: ["Resistance band"],
    optional: [],
  },
  "Sit Ups": {
    required: [],
    optional: ["Exercise mat"],
  },
  "Russian Twists": {
    required: ["Exercise mat"],
    optional: ["Medicine ball", "Bench or wall for back support"],
  },
  "Bicycles": {
    required: [],
    optional: ["Exercise mat"],
  },

  "Deadlift": {
    required: ["Barbell"],
    optional: ["Lifting straps", "Weightlifting belt"],
  },
  "Overhead Press": {
    required: ["Barbell or dumbbells"],
    optional: [],
  },
  "Pull Ups": {
    required: ["Pull-up bar"],
    optional: ["Resistance band (for assistance)"],
  },
  "Plank": {
    required: [],
    optional: ["Exercise mat"],
  },
  "Tricep Dips": {
    required: ["Parallel bars or bench"],
    optional: [],
  },
  "Glute Bridge": {
    required: [],
    optional: ["Exercise mat"],
  },
  "Mountain Climbers": {
    required: [],
    optional: ["Exercise mat"],
  },
  "Burpees": {
    required: [],
    optional: ["Exercise mat"],
  },
  "Jumping Jacks": {
    required: [],
    optional: [],
  },
};

const testCircuit = [
    {
        workoutTime: 6,
        breakTime: 3,
        loops: 2,
        exercises: [["Push Ups", {}],
                    ["Bench Press", {weight: "40lbs"}],
                    ["Squats", {weight: "40lbs"}]]
    },
    {
        workoutTime: 5,
        breakTime: 4,
        loops: 3,
        exercises: [["Lunges", {}],
                    ["Bicep Curls", {weight: "20lbs"}],
                    ["Monster Walks", {}]]
    },
    {
        workoutTime: 6,
        breakTime: 3,
        loops: 1,
        exercises: [["Sit Ups", {}],
                    ["Russian Twists", {weight: "10lbs"}],
                    ["Bicycles", {}]]
    },
];

const testWorkouts = [
    {
        date: "2025-06-15",
        time: "16:30",
        name: "Weekly Workout",
        circuit: testCircuit,
    },
    {
        date: "2025-06-22",
        time: "16:30",
        name: "Weekly Workout",
        circuit: testCircuit,
    }
]

testWorkouts = testWorkouts.slice().sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });


export function AppProvider({ children }) {
  const [workouts, setWorkouts] = useState(testWorkouts);
  const [currentWorkout, setCurrentWorkout] = useState(0);

  return (
    <AppContext.Provider value={{ workouts, setWorkouts, currentWorkout, setCurrentWorkout}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
