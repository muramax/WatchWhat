import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/authContext';


export default function StatusHeader() {
  const {logout, user} = useAuth();
  const handleLogout = async() => {
      await logout();
  }

  return (
    <View className="pt-7 px-5 pb-6 bg-indigo-500 rounded-b-3xl shadow">
      
      <View className="flex-row justify-between items-center">
        <Text className="font-bold text-3xl text-white">WhatStatus?</Text>
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
  )
}