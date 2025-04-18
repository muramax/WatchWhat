import { View, Text } from "react-native";
import React from "react";
import HomeHeader from "../../components/HomeHeader";
import StatusHeader from "@/components/StatusHeader";
import GenreHeader from "@/components/GenreHeader";
import { Link, Tabs } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "AddWhat",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons name="add" size={hp(3.5)} color={color} />
          ),
          header: () => <HomeHeader />,
        }}
      />
      <Tabs.Screen
        name="whatstatus"
        options={{
          title: "WhatStatus",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Octicons name="checklist" size={hp(2.5)} color={color} />
          ),
          header: () => <StatusHeader />,
        }}
      />
      <Tabs.Screen
        name="yourgenre"
        options={{
          title: "YourGenre",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="style" size={hp(3)} color={color} />
          ),
          header: () => <GenreHeader />,
        }}
      />
    </Tabs>
  );
}
