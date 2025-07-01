import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useAppContext } from '../AppContext';

function getFormattedDate(date: Date): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = date.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";

  const formatted = `${months[date.getMonth()]} ${day}${daySuffix}, ${days[date.getDay()]}`;
  return formatted;
}

function formatTime24to12(timeStr: string): string {
  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export default function Fitness() {
  const {workouts, setWorkouts, currentWorkout, setCurrentWorkout} = useAppContext();
  const router = useRouter();

  const toggleDropdown = (index: number) => {
    setDropdownStates(prev =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  const sortedWorkouts = workouts
  const [dropdownStates, setDropdownStates] = useState<boolean[]>(() => sortedWorkouts.map(() => false));

  return (
    <ScrollView style={styles.main}>
      <View style={{alignItems: "center",}}>
        <TouchableOpacity style={styles.createWorkoutButton}>
          <Text style={{fontSize: 32, color: "black"}}>Create Workout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.workoutsContainer}>
        <Text style={{fontSize: 32, marginBottom: 10}}>Upcoming Workouts</Text>
        {sortedWorkouts.map((workout, index) => (
          <View key={index} style={styles.workout}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 32 }}>{workout.name}</Text>
              <Text style={{ fontSize: 20 }}>{formatTime24to12(workout.time)}</Text>
            </View>
            <Text style={{ fontSize: 20 }}>{getFormattedDate(new Date(workout.date))}</Text>
            <TouchableOpacity onPress={() => toggleDropdown(index)} style={styles.header}>
              <Text style={{fontSize: 20}}>Exercises {dropdownStates[index] ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {dropdownStates[index] && (
              <View>
                {workout.circuit.map((circuit, index) => (
                  <View key={index}>
                    {circuit.exercises.map((exercise, index2) => (
                      <Text key={index2}>– {exercise[0]}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity style={{position: "absolute", bottom: 10, right: 10}} onPress={() => {
              Alert.alert(
                "Are you ready to start your workout?",
                "",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Yes",
                    onPress: () => {
                      setCurrentWorkout(index);
                      router.push("/workout");
                    },
                  },
                ],
                { cancelable: true }
              )
            }}>
              <Image
                source={require('../../assets/images/start-workout.png')}
                style={{width: 50, height: 50}}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 100,
  },
  createWorkoutButton: {
    width: 300,
    height: 60,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "green",
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  workoutsContainer: {
    alignItems: "center",
  },
  workout: {
    width: "100%",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
  },
});