import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Foundation, MaterialIcons } from "@expo/vector-icons";
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
  const [refreshing, setRefreshing] = useState(false);
  const [moviesByGenre, setMoviesByGenre] = useState<MoviesByGenre>({});
  const [selectedGenre, setSelectedGenre] = useState<string>("");


  const handleAdd = async (name: string, genre: string, status: string) => {
    setLoading(true);

    if (!name || !genre || !status) {
      alert("Name, Genre, and Status are all required.");
      setLoading(false);
      return;
    }

    try {
      const idToken = await getIdToken();
      console.log("Sending ID Token:", idToken);

      const response = await fetch(`${NGROK_URL}/add_movie`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken,
          name,
          genre,
          status,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Movie added successfully!");
      } else {
        console.log("Error response:", data);
        alert("Failed to add movie!, " + data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert(`An error occurred while adding the movie`);
    } finally {
      setLoading(false);
    }
  };

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
        },
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getMoviesByGenre();
  }, []);

  function GenereChosen(genre: string) {
    setSelectedGenre(genre);
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "Watching":
        return (
          <MaterialIcons
            name="play-circle-outline"
            size={hp(2.5)}
            color="#60a5fa"
          />
        );
      case "Planning":
        return <MaterialIcons name="schedule" size={hp(2.5)} color="#60a5fa" />;
      case "Completed":
        return (
          <MaterialIcons
            name="check-circle-outline"
            size={hp(2.5)}
            color="#34d399"
          />
        );
      default:
        return null;
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    getMoviesByGenre();
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <ScrollView
        className="flex bg-#F3F4F6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl">
          <Text className="text-left text-2xl font-bold text-white">
            YourGenre
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              height: hp(3.5),
              paddingHorizontal: 10,
            }}
            className="bg-indigo-400 rounded-xl justify-center items-center"
          >
            <Foundation name="refresh" size={20} color="#FAFAFA" />
          </TouchableOpacity>
          {loading ? (
            <View className="flex-row justify-center">
              <Loading size={hp(8)} />
            </View>
          ) : Object.keys(moviesByGenre).length === 0 ? (
            <Text className="text-white">No movies/series added yet.</Text>
          ) : (
            <>
              <View className="mt-3">
                <Text className="text-lg text-white">
                  Please Choose Movies Genres
                </Text>
                <View
                  style={{ height: hp(6) }}
                  className="flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl mt-2"
                >
                  <MaterialIcons name="style" size={hp(3)} color="gray" />
                  <Picker
                    selectedValue={selectedGenre}
                    onValueChange={(itemValue: string) =>
                      GenereChosen(itemValue)
                    }
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
                  <Text className="text-lg text-white">
                    Movies in {selectedGenre}
                  </Text>
                  {(moviesByGenre[selectedGenre] ?? []).length === 0 ? (
                    <Text className="text-white mt-2">
                      No movies in this genre.
                    </Text>
                  ) : (
                    <View className="mt-2 gap-2">
                      {(moviesByGenre[selectedGenre] ?? []).map((movie) => (
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

        <View
          className="mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl"
          style={{ overflow: "hidden" }} // clips rounded corners
        >
          <Text className="text-left text-2xl font-bold text-white mb-4">
            Trending movie now!!
          </Text>

          <View
            style={{
              flexDirection: "row", // Aligns the image and text horizontally
              alignItems: "center", // Centers the content vertically
              gap: 10, // Adds space between the image and the text
              // Adds equal padding to left and right
            }}
          >
            <View
              style={{
                width: 100, // Fixed width for the image
                aspectRatio: 9 / 13,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <Image
                source={require("../../assets/images/conan_28.jpg")}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }} // make the image take full container size
              />
            </View>

            <View>
              <Text className="text-white text-lg font-semibold">
                Meitantei Conan Movie 28: Sekigan no Flashback
              </Text>
              <Text className="text-white text-sm mt-1">
                Genre: <Text className="font-medium">Mystery</Text>
              </Text>
            </View>
          </View>

          {/* Button at the bottom right */}

          <TouchableOpacity
            onPress={() => {
              handleAdd(
                "Meitantei Conan Movie 28: Sekigan no Flashback",
                "Mystery",
                "Planning"
              );
            }}
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              height: hp(3.5),
              paddingHorizontal: 10,
            }}
            className="bg-indigo-400 rounded-xl justify-center items-center"
          >
            <Text className="text-white font-semibold">Add Now</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text className="text-center text-gray-500 text-sm mt-4 mb-4">
            © 2025 WatchWhat. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </CustomKeyboardView>
  );
}
