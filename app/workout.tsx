import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";

const circuits = [
  [
    ["Bench Press",
      ["40 lb barbell or two 20 lb dumbbells", "A flat bench"],
      "Lie flat on a bench, grip the barbell or dumbbells just outside shoulder width, lower the weight to your mid-chest under control, then press explosively back up until arms are nearly straight."
    ],
    ["Squat",
      ["45 lb barbell with rack"],
      "Stand with feet shoulder-width apart, toes slightly turned out, sit back into your hips as you bend your knees and lower until your thighs are at least parallel to the floor, then drive through your heels to stand tall."
    ],
    ["Lunge",
      ["Bodyweight"],
      "Stand tall, step one foot forward about two feet, lower your back knee toward the ground until both knees are at 90°, then press through the front heel to return and repeat on the other side."
    ]
  ],
  [
    ["Push Ups",
      ["Bodyweight", "Exercise mat"],
      "Place hands slightly wider than shoulder-width on the floor, keep your body in a straight line from head to heels, lower your chest toward the floor by bending elbows, then push back up to full arm extension."
    ],
    ["Bicep Curls",
      ["Two 15 lb dumbbells", "Optional: EZ curl bar"],
      "Stand with feet hip-width apart, hold dumbbells at your sides, curl the weights up by bending elbows while keeping upper arms stationary, then slowly lower back down."
    ],
    ["Monster Walks",
      ["Medium-resistance band"],
      "Place a resistance band around your ankles or just above your knees, squat slightly, step laterally against the band’s resistance without letting your feet touch, maintaining tension as you move side-to-side."
    ]
  ],
  [
    ["Sit Ups",
      ["Exercise mat"],
      "Lie on your back with knees bent and feet flat, cross arms over your chest or place hands behind your ears, engage your core to lift your torso until chest meets thighs, then lower under control."
    ],
    ["Russian Twists",
      ["10 lb medicine ball", "Exercise mat", "Optional: wall or bench for back support"],
      "Sit with knees bent and feet lifted or on the floor, lean back slightly, hold a weight or clasp hands, rotate your torso to touch the floor beside each hip in a twisting motion."
    ],
    ["Bicycles",
      ["Exercise mat"],
      "Lie on your back, hands behind your head, lift shoulders off the floor, bring one knee toward your chest while twisting the opposite elbow toward it, then switch sides in a smooth, pedaling motion."
    ]
  ]
];
const workoutTime = 60;
const breakTime = 30;
const circuitLoops = 2;

export default function Workout() {
  const [seconds, setSeconds] = useState(workoutTime);
  const [isStarted, setIsStarted] = useState(false);
  const [isWorkout, setIsWorkout] = useState(true);
  const [currentCircuit, setCurrentCircuit] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentCircuitLoop, setCurrentCircuitLoop] = useState(0);
  const router = useRouter();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStarted) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds - 1 <= 0) {
            if (isWorkout) {
              setCurrentExercise(prevExercise => {
                if (prevExercise + 1 >= circuits[currentCircuit].length) {
                  setCurrentCircuitLoop(prevCircuitLoop => {
                    if (prevCircuitLoop + 1 >= circuitLoops) {
                      setIsStarted(false); // Instead of just pausing here, it should go to a screen overviewing the circuit and equipment needed to set it up.
                      setCurrentCircuit(prev => {
                        return prev + 1 >= circuits.length ? 0 : prev + 1; // Currently just loops, should be made to go to a finish screen or something later
                      });
                      return 0;
                    }
                    return prevCircuitLoop + 1;
                  })
                  return 0;
                }
                return prevExercise + 1;
              })
            }
            setIsWorkout(prev => !prev);
            return isWorkout ? breakTime : workoutTime;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isStarted, isWorkout]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${minutes}:${secs.toString().padStart(2, '0')}`;

  return (
      <View style={styles.main}>
        <TouchableOpacity
            onPress={() => {
              Alert.alert(
                  "Are you sure?",
                  "Do you really want to exit your workout?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => router.push("/tabs/fitness"),
                    },
                  ],
                  { cancelable: true }
              );
            }}
            style={styles.homeButton}
        >
          <Image
              source={require('../assets/images/home-icon.png')}
              style={{width: 50, height: 50}}
          />
        </TouchableOpacity>

        <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <View style={{alignItems: "center"}}>
            <Text style={[styles.timerText, {color: isWorkout ? "darkred" : "lightgreen"}]}>{formattedTime}</Text>
            <TouchableOpacity onPress={() => {setIsStarted(!isStarted)}}>
              <Image
                  source={isStarted ? require('../assets/images/pause.png') : require('../assets/images/start.png')}
                  style={{width: 70, height: 70}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.exerciseInfo}>
            {!isWorkout && (
              <Text style={{fontSize: 32}}>Up Next:</Text>
            )}
            <Text style={styles.exerciseTitle}>{circuits[currentCircuit][currentExercise][0]}</Text>
            <Text style={{fontSize: 18, maxWidth: 350, marginBottom: 10}}>{circuits[currentCircuit][currentExercise][2]}</Text>
            <Text style={{fontSize: 24}}>Equipment:</Text>
            {circuits[currentCircuit][currentExercise][1].map((equipment, index) => (
                <Text style={{fontSize: 18, maxWidth: 350}} key={index}>- {equipment}</Text>
            ))}
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  timerText: {
    fontSize: 160,
  },
  exerciseInfo: {
    marginLeft: 60,
    height: "100%",
    justifyContent: "center",
  },
  exerciseTitle: {
    fontSize: 60,
    color: "black",
    maxWidth: 420,
  },
  homeButton: {
    position: "absolute",
    left: 10,
    top: 8,
  },
});