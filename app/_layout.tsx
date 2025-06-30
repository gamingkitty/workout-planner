import { Slot } from "expo-router";
import React from "react";
import { AppProvider } from './AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Slot/>
    </AppProvider>
  );
}

