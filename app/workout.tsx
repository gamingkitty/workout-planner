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

const circuits = [["Bench Press 45lb", "Squat 45lb", "Lunge 20lb"], [], []]
const workoutTime = 60;
const breakTime = 30;

export default function Workout() {
  const [seconds, setSeconds] = useState(workoutTime);
  const [isStarted, setIsStarted] = useState(false);
  const [isWorkout, setIsWorkout] = useState(true);
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
        >
          <Image
              source={require('../assets/images/home-icon.png')}
              style={{width: 55, height: 55}}
          />
        </TouchableOpacity>

        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text style={[styles.timerText, {color: isWorkout ? "darkred" : "lightgreen"}]}>{formattedTime}</Text>
          <TouchableOpacity onPress={() => {setIsStarted(!isStarted)}}>
            <Image
                source={isStarted ? require('../assets/images/pause.png') : require('../assets/images/start.png')}
                style={{width: 55, height: 55}}
            />
          </TouchableOpacity>
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
    fontSize: 90,
  },
  text: {
    fontSize: 24,
    color: "black",
  },
});