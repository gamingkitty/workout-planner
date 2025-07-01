import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

const sexChoices = ["Male", "Female", "Other"];
const goalChoices = [
  "Lose Weight",
  "Build Muscle",
  "Improve Endurance",
  "Increase Flexibility",
  "Maintain Current Fitness",
  "Train for a Sport/Event",
];
const fitnessLevelChoices = ["Beginner", "Intermediate", "Advanced"];
const dayChoices = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const equipmentChoices = [
  "Bench",
  "Barbell",
  "Dumbbells",
  "Kettlebell",
  "Resistance Bands",
  "Weighted Ball",
  "Medicine Ball",
  "TRX",
  "Pull-up Bar",
  "Smith Machine",
  "Cable Machine",
  "Treadmill",
  "Stationary Bike",
  "Elliptical",
  "Rowing Machine",
  "Stair Climber",
  "Foam Roller",
  "Jump Rope",
  "Yoga Blocks",
  "Yoga Mat",
  "Balance Ball",
  "Plyo Box",
  "None",
];

// Temporary store for workouts (can be moved to context later)
const storedWorkouts = [];

export default function Fitness() {
  const router = useRouter();
  const [unit, setUnit] = useState("metric");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [age, setAge] = useState("");
  const [otherSexText, setOtherSexText] = useState("");
  const [selectedSex, setSelectedSex] = useState(null);
  const [injuries, setInjuries] = useState("");
  const [goalsNote, setGoalsNote] = useState("");
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null);
  const [fitnessLevelNote, setFitnessLevelNote] = useState("");
  const [pastRoutineDesc, setPastRoutineDesc] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const addChoice = (index, list, setList) => {
    if (list.includes(index)) {
      setList(list.filter((i) => i !== index));
    } else {
      setList([...list, index]);
    }
  };

  const isFormValid = () => {
    if (
        unit === "metric"
            ? !heightCm || !weightKg
            : !heightFt || !heightIn || !weightLbs
    )
      return false;
    if (!age || selectedSex === null || (selectedSex === 2 && !otherSexText))
      return false;
    if (selectedGoals.length === 0 || selectedFitnessLevel === null)
      return false;
    if (selectedDays.length === 0 || selectedEquipment.length === 0)
      return false;
    return true;
  };

  const submitWorkoutPlan = () => {
    if (!isFormValid()) {
      Alert.alert("Missing Information", "Please fill out all required fields.");
      return;
    }

    const date = new Date();
    const measurements =
        unit === "metric"
            ? { height: `${heightCm} cm`, weight: `${weightKg} kg` }
            : {
              height: `${heightFt} ft ${heightIn} in`,
              weight: `${weightLbs} lbs`,
            };
    const workout = {
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().split(" ")[0],
      name: "Generated Workout",
      measurements,
      circuit: [
        {
          workoutTime: 5,
          breakTime: 2,
          loops: 2,
          exercises: [["Push Ups", {}], ["Squats", {}], ["Sit Ups", {}]],
        },
      ],
    };
    storedWorkouts.push(workout);
    setConfirmationVisible(true);
    setTimeout(() => {
      setConfirmationVisible(false);
      router.push("/tabs/fitness");
    }, 1500);
  };

  return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.main}>
          <Text style={styles.title}>Create Your Workout Plan</Text>

          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={styles.question}>
              Measurements
              <Text style={{color: "red"}}>*</Text>
            </Text>
            <View style={styles.row}>
              <TouchableOpacity
                  style={[styles.unitButton, unit === "metric" && styles.unitSelected]}
                  onPress={() => setUnit("metric")}
              >
                <Text>Metric</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.unitButton, unit === "imperial" && styles.unitSelected]}
                  onPress={() => setUnit("imperial")}
              >
                <Text>Imperial</Text>
              </TouchableOpacity>
            </View>

            {unit === "metric" ? (
                <>
                  <TextInput
                      style={styles.input}
                      placeholder="Height (cm)"
                      keyboardType="numeric"
                      value={heightCm}
                      onChangeText={setHeightCm}
                  />
                  <TextInput
                      style={styles.input}
                      placeholder="Weight (kg)"
                      keyboardType="numeric"
                      value={weightKg}
                      onChangeText={setWeightKg}
                  />
                </>
            ) : (
                <>
                  <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Height (ft)"
                        keyboardType="numeric"
                        value={heightFt}
                        onChangeText={setHeightFt}
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Height (in)"
                        keyboardType="numeric"
                        value={heightIn}
                        onChangeText={setHeightIn}
                    />
                  </View>
                  <TextInput
                      style={styles.input}
                      placeholder="Weight (lbs)"
                      keyboardType="numeric"
                      value={weightLbs}
                      onChangeText={setWeightLbs}
                  />
                </>
            )}

            <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />

            <Text style={styles.question}>
              Biological Sex
              <Text style={{color: "red"}}>*</Text>
            </Text>
            {sexChoices.map((choice, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.choice, selectedSex === index && styles.selected]}
                    onPress={() => setSelectedSex(index)}
                >
                  <Text>{choice}</Text>
                </TouchableOpacity>
            ))}
            {selectedSex === 2 && (
                <TextInput
                    style={styles.input}
                    placeholder="Please specify"
                    value={otherSexText}
                    onChangeText={setOtherSexText}
                />
            )}

            <Text style={styles.question}>Past Injuries (Optional)</Text>
            <TextInput
                style={styles.input}
                placeholder="Any past injuries or conditions?"
                value={injuries}
                onChangeText={setInjuries}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>
              Fitness Goals
              <Text style={{color: "red"}}>*</Text>
            </Text>
            {goalChoices.map((choice, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.choice, selectedGoals.includes(index) && styles.selected]}
                    onPress={() => addChoice(index, selectedGoals, setSelectedGoals)}
                >
                  <Text>{choice}</Text>
                </TouchableOpacity>
            ))}
            <TextInput
                style={styles.input}
                placeholder="Explain more (optional)"
                value={goalsNote}
                onChangeText={setGoalsNote}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>
              Experience Level
              <Text style={{color: "red"}}>*</Text>
            </Text>
            {fitnessLevelChoices.map((choice, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.choice, selectedFitnessLevel === index && styles.selected]}
                    onPress={() => setSelectedFitnessLevel(index)}
                >
                  <Text>{choice}</Text>
                </TouchableOpacity>
            ))}
            <TextInput
                style={styles.input}
                placeholder="Explain more (optional)"
                value={fitnessLevelNote}
                onChangeText={setFitnessLevelNote}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>Have you followed any workout plans before? Describe it:</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. I used to do full-body workouts 3x a week"
                value={pastRoutineDesc}
                onChangeText={setPastRoutineDesc}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>
              Available Days
              <Text style={{color: "red"}}>*</Text>
            </Text>
            {dayChoices.map((choice, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.choice, selectedDays.includes(index) && styles.selected]}
                    onPress={() => addChoice(index, selectedDays, setSelectedDays)}
                >
                  <Text>{choice}</Text>
                </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>
              Available Equipment
              <Text style={{color: "red"}}>*</Text>
            </Text>
            {equipmentChoices.map((choice, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.choice, selectedEquipment.includes(index) && styles.selected]}
                    onPress={() => addChoice(index, selectedEquipment, setSelectedEquipment)}
                >
                  <Text>{choice}</Text>
                </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={submitWorkoutPlan}>
            <Text style={styles.submitText}>Submit Plan</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal transparent visible={confirmationVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>✅ Created new workout from given information!</Text>
            </View>
          </View>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 40 },
  section: { marginBottom: 24 },
  question: { fontSize: 18, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  required: { fontSize: 18, fontWeight: "600", marginBottom: 8, marginTop: 16, color: "red" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
  },
  row: { flexDirection: "row", gap: 12, marginBottom: 8 },
  halfInput: { flex: 1 },
  unitButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  unitSelected: { backgroundColor: "#def" },
  choice: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
  },
  selected: {
    backgroundColor: "#cdf",
    borderColor: "#66f",
  },
  submitButton: {
    backgroundColor: "#337ab7",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    elevation: 4,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
});
