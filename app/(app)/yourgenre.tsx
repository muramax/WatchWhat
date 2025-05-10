import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/authContext";
import { NGROK_URL } from "../ngrok_url";


interface Movie {
  name: string;
  status: string;
}

interface MoviesByGenre {
  [genre: string]: Movie[];
}

export default function Genres() {
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const [moviesByGenre, setMoviesByGenre] = useState<MoviesByGenre>({});
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const getMoviesByGenre = async () => {
    setLoading(true);

    try {
      const idToken = await getIdToken();
      console.log("Fetching movies grouped by genre with ID Token:", idToken);

      const response = await fetch(
        `${NGROK_URL}/get_movies_series_by_genres?id_token=${idToken}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Movies grouped by genre:", data);
        setMoviesByGenre(data);
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
    getMoviesByGenre();
  }, []);


  function GenereChosen(genre: string){
    setSelectedGenre(genre);
  };

  
  function getStatusIcon(status: string) {
    switch (status) {
      case "Watching":
        return <MaterialIcons name="play-circle-outline" size={hp(2.5)} color="#60a5fa" />;
      case "Planning":
        return <MaterialIcons name="schedule" size={hp(2.5)} color="#60a5fa" />;
      case "Completed":
        return <MaterialIcons name="check-circle-outline" size={hp(2.5)} color="#34d399" />;
      default:
        return null;
    }
  }
  

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View className="mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl">
        <Text className="text-left text-2xl font-bold text-white">Genres</Text>
        {loading ? (
          <View className="flex-row justify-center">
            <Loading size={hp(8)} />
          </View>
        ) : Object.keys(moviesByGenre).length === 0 ? (
          <Text className="text-white">No movies/series added yet.</Text>
        ) : (
          <>

            <View className="mt-3">
              <Text className="text-lg text-white">Please Choose Movies Genres</Text>
              <View
                style={{ height: hp(6) }}
                className="flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl mt-2"
              >
                <MaterialIcons name="style" size={hp(3)} color="gray" />
                <Picker
                  selectedValue={selectedGenre}
                  onValueChange={(itemValue: string) => GenereChosen(itemValue)}
                  style={{
                    flex: 1,
                    marginLeft: 3,
                    fontSize: hp(1.8),
                    color: "#404040",
                  }}
                  dropdownIconColor="gray"
                >
                  <Picker.Item label="Select a Genre" value="" color="gray" />
                  {Object.keys(moviesByGenre).map((genre) => (
                    <Picker.Item key={genre} label={genre} value={genre} />
                  ))}
                </Picker>
              </View>
            </View>

           
            {selectedGenre && (
              <View className="mt-3">
                <Text className="text-lg text-white">Movies in {selectedGenre}</Text>
                {moviesByGenre[selectedGenre].length === 0 ? (
                  <Text className="text-white mt-2">No movies in this genre.</Text>
                ) : (
                  <View className="mt-2 gap-2">
                    {moviesByGenre[selectedGenre].map((movie) => (
                      <View
                        key={movie.name}
                        className="flex-row items-center bg-neutral-800 px-4 py-3 rounded-xl shadow-sm"
                        style={{ elevation: 2 }}
                      >
                        {getStatusIcon(movie.status)}
                        <View className="ml-3 flex-1">
                          <Text className="text-white text-base font-semibold">
                            {movie.name}
                          </Text>
                          <Text className="text-gray-400 text-sm">
                            Status: {movie.status}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </CustomKeyboardView>
  );
}