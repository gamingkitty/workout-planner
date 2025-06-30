import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";

const sexChoices = ["Male", "Female", "Other"];
const goalChoices = ["Lose Weight", "Build Muscle", "Improve Endurance", "Increase Flexibility", "Maintain Current Fitness", "Train for a Sport/Event"]
const fitnessLevelChoices = ["Beginner", "Intermediate", "Advanced"]
const workoutBeforeChoices = ["Never", "Occasionally", "Regularly"]
const dayChoices = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const equipmentChoices = ["Bench", "Barbell", "Dumbbells", "Bands", "Weighted Ball", "Balance Ball"]

export default function Fitness() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [selectedSex, setSelectedSex] = useState(null);
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null);
  const [selectedWorkoutBefore, setSelectedWorkoutBefore] = useState(null);

  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const addChoice = (index: number, list: any[], setList: { (value: React.SetStateAction<never[]>): void; (value: React.SetStateAction<never[]>): void; (value: React.SetStateAction<never[]>): void; (arg0: any[]): void; }) => {
    if (list.includes(index)) {
      setList(list.filter(i => i !== index));
    } else {
      setList([...list, index]);
    }
  };

  return (
    <ScrollView style={styles.main}>
      <View style={styles.bannerWrapper}>
        <Text style={[styles.text, {textAlign: "center"}]}>Help Us Create The Perfect Workout Plan For You</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionText}>Basic Information</Text>
        <View style={styles.question}>
          <Text style={styles.questionText}>What is your height and weight?</Text>
          <TextInput style={styles.choice} keyboardType="numeric" value={height} onChangeText={setHeight} placeholder="Enter your height (cm)"/>
          <TextInput style={styles.choice} keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="Enter your weight (kg)"/>
        </View>
        <View style={styles.question}>
          <Text style={styles.questionText}>What is your biological sex?</Text>
          {sexChoices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.choice,
                selectedSex === index && styles.choiceSelected,
              ]}
              onPress={() => setSelectedSex(index)}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
       </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Fitness Goals</Text>
        <View style={styles.question}>
          <Text style={styles.questionText}>What is your primary fitness goal? (Select one or more)</Text>
          {goalChoices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.choice,
                selectedGoals.includes(index) && styles.choiceSelected,
              ]}
              onPress={() => addChoice(index, selectedGoals, setSelectedGoals)}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Experience Level</Text>
        <View style={styles.question}>
          <Text style={styles.questionText}>How would you rate your current fitness level?</Text>
          {fitnessLevelChoices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.choice,
                selectedFitnessLevel === index && styles.choiceSelected,
              ]}
              onPress={() => setSelectedFitnessLevel(index)}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.question}>
          <Text style={styles.questionText}>Have you followed a workout routine before?</Text>
          {workoutBeforeChoices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.choice,
                selectedWorkoutBefore === index && styles.choiceSelected,
              ]}
              onPress={() => setSelectedWorkoutBefore(index)}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Availability</Text>
        <View style={styles.question}>
          <Text style={styles.questionText}>What weekdays are you available to workout?</Text>
          {dayChoices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.choice,
                selectedDays.includes(index) && styles.choiceSelected,
              ]}
              onPress={() => addChoice(index, selectedDays, setSelectedDays)}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Equipment</Text>
        <View style={styles.question}>
          <Text style={styles.questionText}>What equipment do you have access to?</Text>
          {equipmentChoices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.choice,
                selectedEquipment.includes(index) && styles.choiceSelected,
              ]}
              onPress={() => addChoice(index, selectedEquipment, setSelectedEquipment)}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 30,
    marginBottom: 40,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
  },
  question: {
    paddingVertical: 10,
  },
  questionText: {
    fontSize: 20,
  },
  bannerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  bigText: {
    fontSize: 40,
    color: "black",
  },
  text: {
    fontSize: 32,
    color: "black",
  },
  section: {
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 24,
    fontWeight: "bold"
  },
  choice: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  choiceSelected: {
    backgroundColor: "#a0d2eb",
    borderColor: "#3399ff",
  },
});