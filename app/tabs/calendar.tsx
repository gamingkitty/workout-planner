import React, { useState, useRef } from "react";
import { useAppContext } from '../AppContext';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image, Modal, FlatList, Button,
} from "react-native";

const monthIdx = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const monthLen = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function getMonthLen(month: number, year: number) {
  if (month === 1) {
    let leap = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0) ? 1 : 0
    return monthLen[month] + leap
  }
  return monthLen[month]
}

function getPrevMonth(month: number, year: number) {
  if (month === 0) return { month: 11, year: year - 1 };
  return { month: month - 1, year };
}

function getNextMonth(month: number, year: number) {
  if (month === 11) return { month: 0, year: year + 1 };
  return { month: month + 1, year };
}

// const WORKOUTS: {[date: string]: string[]} = {
//   "2025-06-15": ["Chest & Triceps", "Pushups & Bench Press"],
//   "2025-06-22": ["Cardio", "5k Run"],
//   "2025-06-28": ["Leg day", "Box Jumps & Weighted Squats"]
// }

export default function Index() {
  const today = new Date()
  const currMonth = today.getMonth()
  const monthName = monthIdx[currMonth]
  const currYear = today.getFullYear()

  const { month: prevMonth, year: prevYear } = getPrevMonth(currMonth, currYear)
  const { month: nextMonth, year: nextYear } = getNextMonth(currMonth, currYear)

  const prevMonthLen = getMonthLen(prevMonth, prevYear)
  const currMonthLen = getMonthLen(currMonth, currYear)
  const firstDayOfMonth = new Date(currYear, currMonth, 1)
  const firstDayOffset = firstDayOfMonth.getDay()

  const {workouts, setWorkouts} = useAppContext();
  const WORKOUTS = {}

  workouts.forEach((workout) => {
    if (!WORKOUTS[workout.date]) {
      WORKOUTS[workout.date] = [];
    }
    WORKOUTS[workout.date].push(workout.name);
  });

  const dayObjs = []

  for (let i = 0; i < firstDayOffset; i++) {
    dayObjs.push(new Date(prevYear, prevMonth, prevMonthLen - firstDayOffset + i + 1))
  }

  for (let i = 1; i <= currMonthLen; i++) {
    dayObjs.push(new Date(currYear, currMonth, i))
  }

  const remainingDays = 6 - (dayObjs.length - 1) % 7
  for (let i = 1; i <= remainingDays; i++) {
    dayObjs.push(new Date(nextYear, nextMonth, i))
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onDayPress = (day: Date) => {
    setSelectedDate(day);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDate(null);
  };

  // helper to format YYYY‑MM‑DD
  const fmt = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;

  const workoutsOnDate = selectedDate ? WORKOUTS[fmt(selectedDate)] || [] : []

  return (
      <View style={{flex: 1}}>
        <View style={{alignItems: "center", marginVertical: 16}}>
          <Text style={styles.bigText}>{monthName} {currYear}</Text>
          <View style={styles.weekDays}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <View key={day} style={styles.weekDayTextWrapper}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
            ))}
          </View>
        </View>

        <View style={styles.calendar}>
          {dayObjs.map((dayObj, index) => {
            const key = fmt(dayObj)
            const isToday = dayObj.getDate() === today.getDate() &&dayObj.getMonth() === currMonth && dayObj.getFullYear() === currYear
            const hasEvents = WORKOUTS[key]
            const lift = hasEvents ? 10 : 0
            return (
                <TouchableOpacity key={index} style={styles.calendarDay} onPress={() => onDayPress(dayObj)}>
                  <View style={styles.dateContainer}>
                    {isToday ? (
                        <View style={styles.highlightDay}>
                          <Text style={[styles.text, {color: 'white'}]}>{dayObj.getDate()}</Text>
                        </View>
                    ) : (
                        <View style={styles.normalDay}>
                          <Text style={styles.text}>{dayObj.getDate()}</Text>
                        </View>
                    )}
                    {hasEvents && <View style={styles.dotIndicator}/>}
                  </View>
                </TouchableOpacity>
            )
          })}
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedDate ? fmt(selectedDate) : ""}
              </Text>

              {workoutsOnDate.length > 0 ? (
                  <FlatList
                      data={workoutsOnDate}
                      keyExtractor={(item, index) => `${index}-${item}`}
                      renderItem={({item}) => (
                          <Text style={styles.workoutText}>–{item}</Text>
                      )}
                  />
              ) : (
                  <Text style={styles.workoutText}>No Workouts Scheduled Today!</Text>
              )}

              <Button title="Close" onPress={closeModal}/>
            </View>
          </View>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  calendarDay: {
    width: `${100/7}%`,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    alignItems: "center",
    height: 43,
    justifyContent: "space-between"
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "blue",
  },
  highlightDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekDays: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  weekDayTextWrapper: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4
  },
  weekDayText: {
    fontSize: 18,
    color: "black",
  },
  bigText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
  },
  text: {
    fontSize: 24,
    color: "black",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%"
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center"
  },
  workoutText: {
    fontSize: 16,
    marginVertical: 4
  }
});