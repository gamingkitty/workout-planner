import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
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

export default function Index() {
  const today = new Date()
  const currMonth = today.getMonth()
  const monthName = monthIdx[currMonth]
  const currYear = today.getFullYear()

  const { month: prevMonth, year: prevYear } = getPrevMonth(currMonth, currYear)
  const { month: nextMonth, year: nextYear } = getNextMonth(currMonth, currYear)
  const [selectedDay, setSelectedDay] = useState(0)

  const prevMonthLen = getMonthLen(prevMonth, prevYear)
  const currMonthLen = getMonthLen(currMonth, currYear)
  const firstDayOfMonth = new Date(currYear, currMonth, 1)
  const firstDayOffset = firstDayOfMonth.getDay()

  const dayObjs = []

  const isSameDate = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

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

  const calendarHeight = 50 * dayObjs.length / 7

  return (
    <View style={styles.main}>
      <View style={{alignItems: "center", justifyContent: "center"}}>
        <Text style={styles.bigText}>{monthName}</Text>
        <View style={styles.weekDays}>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Sun.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Mon.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Tue.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Wed.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Thu.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Fri.</Text></View>
          <View style={styles.weekDayTextWrapper}><Text style={styles.weekDayText}>Sat.</Text></View>
        </View>
      </View>

      <View style={[styles.calendar, {height: calendarHeight}]}>
        {dayObjs.map((dayObj, index) => (
            <TouchableOpacity key={index} style={styles.calendarDay} onPress={() => {setSelectedDay(index)}}>
              {(
                <View style={[isSameDate(dayObj, today) ? styles.highlightDay : styles.nothing, selectedDay == index ? styles.selectedDay : styles.nothing]}>
                  <Text style={[styles.text, isSameDate(dayObj, today) ? {color: "white"} : styles.nothing]}>{dayObj.getDate()}</Text>
                </View>
              )}
            </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
      flex: 1,
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  calendarDay: {
    width: "14.2857%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDay: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nothing: {
  },
  highlightDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
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