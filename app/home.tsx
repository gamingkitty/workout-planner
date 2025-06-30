import React from "react";
import {View, Text, Pressable, StyleSheet, TouchableOpacity, Image, Dimensions} from "react-native";
import { router } from "expo-router";

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function HomePage() {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/homebackground.png')} style={{ width: screenWidth, height: screenHeight, position: "absolute"}} />
            <Text style={styles.title}>Welcome to Your Personal Fitness Planner!</Text>
            <Text style={styles.subtitle}>Track your workouts, diet, progress, and so much more!</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/tabs/fitness")}>
                <Text style={styles.buttonText}>Let&#39;s go!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
        color: "white",
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 32,
        textAlign: "center",
        color: "white",
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        elevation: 2,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
