import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { useAuth } from "@/context/authContext";

export default function HomeHeader() {
  const { logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <View
      className=" pt-10 px-5 pb-6 rounded-b-3xl shadow"
      style={{ backgroundColor: "#314555" }}
    >
      <View className="flex-row justify-between items-center">
        <Image
          source={require("../assets/images/cover.png")}
          style={{ width: 65, height: 65 }}
          resizeMode="cover"
        />
        <Text className="font-bold text-2xl text-white text-right">
          {user?.username}
        </Text>
      </View>

      <View className="items-end">
        <Pressable onPress={handleLogout}>
          <Text className="text-white font-semibold">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
