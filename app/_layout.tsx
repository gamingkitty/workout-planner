import { Stack } from "expo-router";
import React from "react";
import { AppProvider } from './AppContext';
import {View} from "react-native";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}/>
    </AppProvider>
  );
}

