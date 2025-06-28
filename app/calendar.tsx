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

  const prevMonthLen = getMonthLen(prevMonth, prevYear)
  const currMonthLen = getMonthLen(currMonth, currYear)
  const firstDayOfMonth = new Date(currYear, currMonth, 1)
  const firstDayOffset = firstDayOfMonth.getDay()

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


  return (
    <View>
      <View style={{alignItems: "center", justifyContent: "center"}}>
        <Text style={styles.bigText}>{monthName}</Text>
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
        {dayObjs.map((dayObj, index) => (
            <View key={index} style={styles.calendarDay}>
              {dayObj.getDate() === new Date().getDate() && dayObj.getMonth() === currMonth ? (
                  <View style={styles.highlightDay}>
                    <Text style={[styles.text, { color: 'white' }]}>{dayObj.getDate()}</Text>
                  </View>
              ) : (
                  <Text style={styles.text}>{dayObj.getDate()}</Text>
              )}
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