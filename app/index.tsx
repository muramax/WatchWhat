import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";

export default function StartPage() {
  return (
    <View className="flex-1 justify-center items-center bg-violet-900">
      <Octicons name="eye" size={100} color="white" />
      <Text className="text-2xl font-bold text-white">WatchWhat</Text>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}
