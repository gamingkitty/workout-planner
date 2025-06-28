import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Diet() {
  return (
    <View style={{alignItems: "center"}}><Text style={styles.bigText}>Diet Tab</Text></View>
  );
}

const styles = StyleSheet.create({
  bigText: {
    fontSize: 40,
    color: "black",
  },
  text: {
    fontSize: 24,
    color: "black",
  },
});