import React, { useState, useRef, useEffect } from "react";
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
import { useAppContext, exerciseEquipment } from '../AppContext';

function getFormattedDate(date: Date): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = date.getUTCDate();
  const daySuffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";

  const formatted = `${months[date.getUTCMonth()]} ${day}${daySuffix}, ${days[date.getUTCDay()]}`;
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
  const {workouts, setWorkouts, currentWorkout, setCurrentWorkout, quizInfo, setQuizInfo} = useAppContext();
  const router = useRouter();
  const [focus, setFocus] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setDropdownStates(prev => {
      if (workouts.length > prev.length) {
        return [...prev, ...Array(workouts.length - prev.length).fill(false)];
      }
      return prev;
    });
  }, [workouts]);

  const toggleDropdown = (index: number) => {
    setDropdownStates(prev =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  async function generateWorkoutPlan(
    focus: string
  ): Promise<Circuit[]> {
    const apiKey = "apikey";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
              You are a fitness assistant who is designed to create personalized workout plans for the user based on their data.
              Your workout plan will consist of circuits of different exercises to create the best workout experience for the user.
              You must respond with only the list containing the circuits for the user. Here is a sample response:
              [
                {
                  "workoutTime": 60,
                  "breakTime": 30,
                  "loops": 2,
                  "exercises": [
                    ["Push Ups", {}],
                    ["Bench Press", {"weight": "40lbs"}],
                    ["Squats",     {"weight": "40lbs"}]
                  ]
                },
                {
                  "workoutTime": 60,
                  "breakTime": 30,
                  "loops": 2,
                  "exercises": [
                    ["Lunges", {}],
                    ["Bicep Curls", {"weight": "20lbs"}],
                    ["Monster Walks", {}]
                  ]
                },
                {
                  "workoutTime": 60,
                  "breakTime": 30,
                  "loops": 2,
                  "exercises": [
                    ["Sit Ups", {}],
                    ["Russian Twists", {"weight": "10lbs"}],
                    ["Bicycles", {}]
                  ]
                }
              ];

          You may only use exercises from the given list, and make sure the user has the required equipment:
          ` +
          exerciseEquipment
           + `
          Remember to only send the json with the personalized workout plan for the user.
          `.trim()},
          { role: "user", content: `Focus: ${focus}\nUser info:\n${quizInfo}\n\nRespond now with JSON only.`},
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // 1) Log it so you can inspect any stray text
    console.log("🏋️‍♀️ Raw AI response:", raw);

    // 2) Extract the JSON array
    const match = raw.match(/^\s*(\[\s*{[\s\S]*}\s*\])\s*$/m);
    const jsonText = match?.[1];
    if (!jsonText) {
      console.error("Failed to extract JSON:", raw);
      throw new Error("Invalid JSON from workout-plan API");
    }

    // 3) Parse it
    try {
      const plan = JSON.parse(jsonText) as Circuit[];
      return plan;
    } catch (err) {
      console.error("JSON.parse error:", err, jsonText);
      throw new Error("Invalid JSON structure from workout-plan API");
    }
  }

  const [creatingWorkout, setCreatingWorkout] = useState(false);

  const sortedWorkouts = workouts
  const [dropdownStates, setDropdownStates] = useState<boolean[]>(() => sortedWorkouts.map(() => false));

  return (
    <ScrollView style={styles.main}>
      {creatingWorkout && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18 }}>Is there anything specific you want to focus on for this workout?</Text>
          <TextInput
            placeholder="e.g. Arms, Cardio, etc."
            value={focus}
            onChangeText={setFocus}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              borderRadius: 8,
              marginTop: 5,
              marginBottom: 10,
            }}
          />

          <Text style={{ fontSize: 18 }}>What time do you want the workout to be?</Text>
          <TextInput
            placeholder="e.g. 16:30"
            value={time}
            onChangeText={setTime}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              borderRadius: 8,
              marginTop: 5,
              marginBottom: 10,
            }}
          />

          <Text style={{ fontSize: 18 }}>What day do you want the workout to be?</Text>
          <TextInput
            placeholder="e.g. 2025-07-01"
            value={date}
            onChangeText={setDate}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              borderRadius: 8,
              marginTop: 5,
              marginBottom: 10,
            }}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "green",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={async () => {
              if (!focus || !time || !date) {
                Alert.alert("Please fill out all fields");
                return;
              }

              try {
                // 1) Ask the AI for a typed Circuit[] plan
                const plan = await generateWorkoutPlan(focus);

                // 2) Optional: show a quick confirmation
                Alert.alert("Workout Plan Generated!", "Your custom circuit is ready.");

                // 3) Build & save the workout
                const newWorkout = {
                  name: focus,
                  time,
                  date,
                  circuit: plan,          // <-- use the returned array here
                };
                setWorkouts(prev => [...prev, newWorkout]);

                // 4) Close the creation UI
                setCreatingWorkout(false);
              } catch (err) {
                console.error(err);
                Alert.alert(
                  "Error",
                  "Something went wrong while generating your workout plan."
                );
              }
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Generate</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{justifyContent: "space-between", flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 20}}>
        <Text style={{fontSize: 30, marginBottom: 10}}>Upcoming Workouts</Text>
        <TouchableOpacity style={styles.createWorkoutButton} onPress={() => setCreatingWorkout(!creatingWorkout)}>
          <Text style={{fontSize: 40, lineHeight: 40, color: "white"}}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.workoutsContainer}>
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
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "green",
    backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
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