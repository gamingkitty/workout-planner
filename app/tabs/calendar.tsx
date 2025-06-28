import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Calendar() {
  const month = "June"
  const prevMonthLength = 31
  const monthLength = 30
  const firstDayOffset = 6

  const dayNums = [];
  for (let i = 0; i < firstDayOffset; i++) {
    dayNums.push(prevMonthLength - firstDayOffset + i + 1);
  }

  for (let i = 0; i < monthLength; i++) {
      dayNums.push(i + 1);
  }

  let numNextMonth = 6 - (dayNums.length - 1) % 7
  for (let i = 0; i < numNextMonth; i++) {
      dayNums.push(i + 1)
  }

  return (
    <View>
      <View style={{alignItems: "center", justifyContent: "center"}}>
        <Text style={styles.bigText}>{month}</Text>
        <View style={styles.weekDays}>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Mon.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Tue.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Wed.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Thu.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Fri.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Sat.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Sun.</Text></View>
        </View>
      </View>

      <View style={styles.calendar}>
        {dayNums.map((dayNum, index) => (
            <View key={index} style={styles.calendarDay}>
              <Text style={styles.text}>{dayNum}</Text>
            </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: 300,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  calendarDay: {
    width: "14.2857%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderTopWidth: 1,
  },
  weekDayTextWrapper: {
    width: "14.2857%",
    alignItems: "center",
  },
  weekDayText: {
    fontSize: 18,
    color: "black",
  },
  bigText: {
    fontSize: 40,
    color: "black",
  },
  text: {
    fontSize: 24,
    color: "black",
  },
});