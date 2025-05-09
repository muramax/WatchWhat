import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Feather, MaterialIcons, Octicons } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/authContext";
import { NGROK_URL } from "../ngrok_url";


export default function whatstatus() {
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);

  interface Movie {
    name: string;
    genre: string;
  }

  const [watching, setWatching] = useState<Movie[]>([]);
  const [planning, setPlanning] = useState<Movie[]>([]);
  const [completed, setCompleted] = useState<Movie[]>([]);

  const getByStatus = async () => {
    setLoading(true);

    try {
      const idToken = await getIdToken();
      console.log("Fetching movies grouped by status with ID Token:", idToken);

      const response = await fetch(
        `${NGROK_URL}/get_movies_series_by_status?id_token=${idToken}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Movies grouped by status:", data);
        console.log(data.Watching);
        console.log(data.Completed);
        console.log(data.Planning);
        // Update each status-specific state
        setWatching(data.Watching || []);
        setCompleted(data.Completed || []);
        setPlanning(data.Planning || []);
      } else {
        console.error("Error response:", data);
        alert("Failed to fetch movies: " + data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while fetching movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getByStatus();
  }, []);

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View className="mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl">
        <Text>WhatStatus</Text>
        <Text className="text-lg text-white mt-3"> Watching</Text>
        <View>
          {watching.length === 0 ? (
            <Text className="text-white">
              No movies/series to watch right now.
            </Text>
          ) : (
            watching.map((item, index) => (
              <Text key={index} className="text-white">
                {item.name} ({item.genre})
              </Text>
            ))
          )}
        </View>

        <Text className="text-lg text-white mt-3"> Plan to Watch</Text>
        <View>
          {planning.length === 0 ? (
            <Text className="text-white">
              No movies/series planned to watch yet.
            </Text>
          ) : (
            planning.map((item, index) => (
              <Text key={index} className="text-white">
                {item.name} ({item.genre})
              </Text>
            ))
          )}
        </View>

        <Text className="text-lg text-white mt-3"> Completed</Text>
        <View>
          {completed.length === 0 ? (
            <Text className="text-white">No completed movies/series.</Text>
          ) : (
            completed.map((item, index) => (
              <Text key={index} className="text-white">
                {item.name} ({item.genre})
              </Text>
            ))
          )}
        </View>
      </View>
    </CustomKeyboardView>
  );
}
