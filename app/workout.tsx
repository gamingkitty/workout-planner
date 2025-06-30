import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { Alert } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import { exerciseDescriptions, exerciseEquipment, useAppContext } from './AppContext';
import { Audio } from 'expo-av';
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

// const circuits = [
//   [
//     ["Bench Press",
//       ["40 lb barbell or two 20 lb dumbbells", "A flat bench"],
//       "Lie flat on a bench, grip the barbell or dumbbells just outside shoulder width, lower the weight to your mid-chest under control, then press explosively back up until arms are nearly straight."
//     ],
//     ["Squat",
//       ["45 lb barbell with rack"],
//       "Stand with feet shoulder-width apart, toes slightly turned out, sit back into your hips as you bend your knees and lower until your thighs are at least parallel to the floor, then drive through your heels to stand tall."
//     ],
//     ["Lunge",
//       ["Bodyweight"],
//       "Stand tall, step one foot forward about two feet, lower your back knee toward the ground until both knees are at 90°, then press through the front heel to return and repeat on the other side."
//     ]
//   ],
//   [
//     ["Push Ups",
//       ["Bodyweight", "Exercise mat"],
//       "Place hands slightly wider than shoulder-width on the floor, keep your body in a straight line from head to heels, lower your chest toward the floor by bending elbows, then push back up to full arm extension."
//     ],
//     ["Bicep Curls",
//       ["Two 15 lb dumbbells", "Optional: EZ curl bar"],
//       "Stand with feet hip-width apart, hold dumbbells at your sides, curl the weights up by bending elbows while keeping upper arms stationary, then slowly lower back down."
//     ],
//     ["Monster Walks",
//       ["Medium-resistance band"],
//       "Place a resistance band around your ankles or just above your knees, squat slightly, step laterally against the band’s resistance without letting your feet touch, maintaining tension as you move side-to-side."
//     ]
//   ],
//   [
//     ["Sit Ups",
//       ["Exercise mat"],
//       "Lie on your back with knees bent and feet flat, cross arms over your chest or place hands behind your ears, engage your core to lift your torso until chest meets thighs, then lower under control."
//     ],
//     ["Russian Twists",
//       ["10 lb medicine ball", "Exercise mat", "Optional: wall or bench for back support"],
//       "Sit with knees bent and feet lifted or on the floor, lean back slightly, hold a weight or clasp hands, rotate your torso to touch the floor beside each hip in a twisting motion."
//     ],
//     ["Bicycles",
//       ["Exercise mat"],
//       "Lie on your back, hands behind your head, lift shoulders off the floor, bring one knee toward your chest while twisting the opposite elbow toward it, then switch sides in a smooth, pedaling motion."
//     ]
//   ]
// ];
// const workoutTime = 60;
// const breakTime = 30;
// const circuitLoops = 2;

const initialReadyTime = 10;

const currentWorkout = 1;

export default function Workout() {
  const [seconds, setSeconds] = useState(initialReadyTime);
  const [isStarted, setIsStarted] = useState(false);
  const [isWorkout, setIsWorkout] = useState(false);
  const [currentCircuit, setCurrentCircuit] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentCircuitLoop, setCurrentCircuitLoop] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const router = useRouter();
  const slideY = useRef(new Animated.Value(0)).current;

  const {workouts, setWorkouts} = useAppContext();
  const circuits = workouts[currentWorkout].circuit;

  async function playSound(asset, volume) {
    const { sound } = await Audio.Sound.createAsync(asset);
    await sound.setVolumeAsync(volume);
    setSound(sound);
    await sound.playAsync();
  }

  const switchExercise = () => {
    const height = Dimensions.get('window').height;
    Animated.timing(slideY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentExercise(ex => {
        const next = ex + 1;
        if (next >= circuits[currentCircuit].exercises.length) {
          setCurrentCircuitLoop(loop => {
            const nextLoop = loop + 1;
            if (nextLoop >= circuits[currentCircuit].loops) {
              setIsStarted(false); // Add circuit screen later
              setCurrentCircuit(c => (c + 1 >= circuits.length ? 0 : c + 1));
              return 0;
            }
            return nextLoop;
          });
          return 0;
        }
        return next;
      });

      slideY.setValue(-height);

      Animated.timing(slideY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsWorkout(false);
        setSeconds(circuits[currentCircuit].breakTime);
      });
    });
  };

  useFocusEffect(
    useCallback(() => {
      // When screen gains focus
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

      return () => {
        // When screen loses focus
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }, [])
  );

  useEffect(() => {
    let interval;
    if (isStarted) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev - 1 <= 0) {
            if (isWorkout) {
              playSound(require("../assets/audio/complete.mp3"), 1.0)
              switchExercise();
            } else {
              setIsWorkout(true);
              playSound(require("../assets/audio/start.mp3"), 0.6)
              return circuits[currentCircuit].workoutTime;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isWorkout, currentCircuit]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
              { text: "Cancel", style: "cancel" },
              { text: "Yes", onPress: () => router.push("/tabs/fitness") },
            ],
            { cancelable: true }
          );
        }}
        style={styles.homeButton}
      >
        <Image source={require('../assets/images/home-icon.png')} style={{ width: 50, height: 50 }} />
      </TouchableOpacity>

      <View style={styles.workoutInfo}>
        <View style={styles.timer}>
          <Text style={[styles.timerText, { color: isWorkout ? "darkred" : "lightgreen" }]}>
            {formattedTime}
          </Text>
          <TouchableOpacity onPress={() => setIsStarted(!isStarted)}>
            <Image
              source={isStarted ? require('../assets/images/pause.png') : require('../assets/images/start.png')}
              style={{ width: 70, height: 70 }}
            />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.exerciseInfo, { transform: [{ translateY: slideY }] }]}>
          <Text style={styles.exerciseTitle}>
            {circuits[currentCircuit].exercises[currentExercise][0]}
          </Text>
          <Text style={{ fontSize: 18, maxWidth: 380, marginBottom: 10 }}>
            {exerciseDescriptions[circuits[currentCircuit].exercises[currentExercise][0]]}
          </Text>
          <Text style={{ fontSize: 24 }}>Equipment:</Text>
          {exerciseEquipment[circuits[currentCircuit].exercises[currentExercise][0]].required.map((equipment, i) => (
            <Text key={i} style={{ fontSize: 18, maxWidth: 380}}>
              - {equipment}
            </Text>
          ))}
          {exerciseEquipment[circuits[currentCircuit].exercises[currentExercise][0]].optional.map((equipment, i) => (
            <Text key={i} style={{ fontSize: 18, maxWidth: 380}}>
              - {equipment} (optional)
            </Text>
          ))}
          {Object.entries(circuits[currentCircuit].exercises[currentExercise][1]).map(([detailName, detail], i) => (
            <Text key={i} style={{ fontSize: 18, maxWidth: 380}}>
              Recommended {detailName}: {detail}
            </Text>
          ))}
        </Animated.View>
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
    marginLeft: 30,
    justifyContent: "center",
  },
  exerciseTitle: {
    fontSize: 55,
    color: "black",
    width: 380,
  },
  homeButton: {
    position: "absolute",
    left: 10,
    top: 8,
  },
  workoutInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    alignItems: "center",
    backgroundColor: "white",
    elevation: 5,
    padding: 20,
    borderRadius: 16,
  },
});
