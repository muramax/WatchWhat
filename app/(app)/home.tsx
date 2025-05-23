import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Feather, Foundation, MaterialIcons, Octicons } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/authContext";
import { FlatList } from "react-native-gesture-handler";
import { NGROK_URL } from "../ngrok_url"; // adjust the path if needed

export default function home() {
  const { getIdToken } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatedMoviesSeries, setUpdatedMoviesSeries] = useState("");
  const [updatedGenre, setUpdatedGenre] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [deletedMoviesSeries, setDeletedMoviesSeries] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [moviesSeries, setMoviesSeries] = useState([]);
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Anime",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Crime",
    "Documentary",
    "Historical",
    "Musical",
    "Family",
    "Biography",
    "War",
    "Western",
    "Superhero",
    "Sports",
    "Reality",
    "Game Show",
    "True Crime",
    "Psychological",
    "Zombie/Apocalypse",
  ];
  const { width, height } = useWindowDimensions();
  const SM_SCREEN = 576;
  const MD_SCREEN = 768;
  const numColumns = width < SM_SCREEN ? 1 : 2;

  const handleAdd = async () => {
    setLoading(true);

    const name = selectedName;
    const genre = selectedGenre;
    const status = selectedStatus;

    if (!name || name.trim() === "") {
      alert("Movie/Series name cannot be empty!");
      setLoading(false);
      return; // Early return to stop the function execution
    }

    if (!genre || genre.trim() === "") {
      alert("Genre cannot be empty!");
      setLoading(false);
      return; // Early return to stop the function execution
    }

    if (!status || status.trim() === "") {
      alert("Status name cannot be empty!");
      setLoading(false);
      return; // Early return to stop the function execution
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
        setSelectedName(""); // Clear the input field after successful addition
        setSelectedGenre(""); // Reset the selected genre
        setSelectedStatus(""); // Reset the selected status
        getAllMoviesSeries();
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

  const getAllMoviesSeries = async () => {
    setLoading(true);

    try {
      const idToken = await getIdToken();

      const response = await fetch(`${NGROK_URL}/get_all_movies_series`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken, // Make sure idToken is valid here
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Movies:", data);
        setMoviesSeries(data.movies_series);
      } else {
        console.log("Error response:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    const nameu = updatedMoviesSeries;
    const genreu = updatedGenre;
    const statusu = updatedStatus;

    if (!nameu || nameu.trim() === "") {
      alert("Movie/Series name cannot be empty!");
      setLoading(false);
      return; // Early return to stop the function execution
    }

    if (
      (!genreu || genreu.trim() === "") &&
      (!statusu || statusu.trim() === "")
    ) {
      alert("Please provide at least a genre or a status to update.");
      setLoading(false);
      return;
    }

    try {
      const idToken = await getIdToken();

      const response = await fetch(`${NGROK_URL}/update_movies_series`, {
        method: "PUT",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken, // Make sure idToken is valid here
          nameu,
          genreu,
          statusu,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Movie updated successfully!");
        getAllMoviesSeries();
        setUpdatedMoviesSeries(""); // Clear the input field after successful addition
        setUpdatedGenre(""); // Reset the selected genre
      } else {
        console.log("Error response:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    const named = deletedMoviesSeries;

    if (!named || named.trim() === "") {
      alert("Movie/Series name cannot be empty!");
      setLoading(false);
      return; // Early return to stop the function execution
    }

    try {
      const idToken = await getIdToken();

      const response = await fetch(`${NGROK_URL}/delete_movies_series`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken, // Make sure idToken is valid here
          named,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Movie Deleted successfully!");
        getAllMoviesSeries();
        setDeletedMoviesSeries(""); // Clear the input field after successful addition
      } else {
        console.log("Error response:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);

    const confirm = confirmation;

    if (!confirm || confirm.trim() === "") {
      alert("Please confirm to delete all movies/series!");
      setLoading(false);
      return;
    }

    try {
      const idToken = await getIdToken();

      const response = await fetch(`${NGROK_URL}/delete_all_movies_series`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken, // Make sure idToken is valid here
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Movie Deleted ALL successfully!");
        getAllMoviesSeries();
        setConfirmation(""); // Clear the input field after successful addition
      } else {
        console.log("Error response:", data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMoviesSeries();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getAllMoviesSeries();
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
      <View className="mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl ">
        <View>
          <Text className="text-left text-2xl font-bold text-white">Add</Text>
          <TouchableOpacity
            onPress={onRefresh}
            style={{
              position: "absolute",
              top: 1,
              right: 5,
              height: hp(3.5),
              paddingHorizontal: 10,
            }}
            className="bg-indigo-400 rounded-xl justify-center items-center"
          >
            <Foundation name="refresh" size={20} color="#FAFAFA" />
          </TouchableOpacity>
        </View>

        <View className="gap-5">
          <View className="gap-3 px-4">
            <View
              style={{ height: hp(6) }}
              className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"
            >
              <MaterialIcons name="movie" size={hp(3)} color="gray" />
              <TextInput
                value={selectedName}
                onChangeText={(value) => setSelectedName(value)}
                style={{ fontSize: hp(1.8) }}
                className="ml-4 flex-1 font-semibold text-black"
                placeholder="Add Movie/Series"
                placeholderTextColor={"gray"}
              />
            </View>
            <View
              style={{ height: hp(6) }}
              className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"
            >
              <MaterialIcons name="style" size={hp(3)} color="gray" />
              <Picker
                selectedValue={selectedGenre}
                onValueChange={(itemValue) => setSelectedGenre(itemValue)}
                style={{
                  flex: 1,
                  marginLeft: 3,
                  fontSize: hp(1.8),
                  color: "#404040",
                }}
                dropdownIconColor="gray"
              >
                <Picker.Item label="Select Genre" value="" color="gray" />
                {genres.map((genre) => (
                  <Picker.Item key={genre} label={genre} value={genre} />
                ))}
              </Picker>
            </View>

            <View
              style={{ height: hp(6) }}
              className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"
            >
              <Octicons name="checklist" size={hp(3)} color="gray" />
              <Picker
                selectedValue={selectedStatus}
                onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                style={{
                  flex: 1,
                  marginLeft: 3,
                  fontSize: hp(1.8),
                  color: "#404040",
                }}
                dropdownIconColor="gray"
              >
                <Picker.Item label="Select Status" value="" color="gray" />
                <Picker.Item label="Watching" value="Watching" />
                <Picker.Item label="Planning" value="Planning" />
                <Picker.Item label="Completed" value="Completed" />
              </Picker>
            </View>

            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(8)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleAdd}
                  style={{ height: hp(4) }}
                  className="bg-indigo-400 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2) }}
                    className="text-white font-semibold tracking-wider"
                  >
                    Add!
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className="mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl ">
        <View>
          <Text className="text-left text-2xl font-bold text-white">
            Update
          </Text>
        </View>

        <View className="gap-5">
          <View className="gap-3 px-4">
            <View
              style={{ height: hp(6) }}
              className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"
            >
              <MaterialIcons name="movie" size={hp(3)} color="gray" />
              <Picker
                selectedValue={updatedMoviesSeries}
                onValueChange={(itemValue) => setUpdatedMoviesSeries(itemValue)}
                style={{
                  flex: 1,
                  marginLeft: 3,
                  fontSize: hp(1.8),
                  color: "#404040",
                }}
                dropdownIconColor="gray"
              >
                <Picker.Item
                  label="Select Movie/Series"
                  value=""
                  color="gray"
                />
                {moviesSeries.map((ms) => (
                  <Picker.Item key={ms} label={ms} value={ms} />
                ))}
              </Picker>
            </View>
            <View
              style={{ height: hp(6) }}
              className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"
            >
              <MaterialIcons name="style" size={hp(3)} color="gray" />
              <Picker
                selectedValue={updatedGenre}
                onValueChange={(itemValue) => setUpdatedGenre(itemValue)}
                style={{
                  flex: 1,
                  marginLeft: 3,
                  fontSize: hp(1.8),
                  color: "#404040",
                }}
                dropdownIconColor="gray"
              >
                <Picker.Item label="Select Genre" value="" color="gray" />
                {genres.map((genre) => (
                  <Picker.Item key={genre} label={genre} value={genre} />
                ))}
              </Picker>
            </View>

            <View
              style={{ height: hp(6) }}
              className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"
            >
              <Octicons name="checklist" size={hp(3)} color="gray" />
              <Picker
                selectedValue={updatedStatus}
                onValueChange={(itemValue) => setUpdatedStatus(itemValue)}
                style={{
                  flex: 1,
                  marginLeft: 3,
                  fontSize: hp(1.8),
                  color: "#404040",
                }}
                dropdownIconColor="gray"
              >
                <Picker.Item label="Select Status" value="" color="gray" />
                <Picker.Item label="Watching" value="Watching" />
                <Picker.Item label="Planning" value="Planning" />
                <Picker.Item label="Completed" value="Completed" />
              </Picker>
            </View>

            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(8)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleUpdate}
                  style={{ height: hp(4) }}
                  className="bg-indigo-400 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2) }}
                    className="text-white font-semibold tracking-wider"
                  >
                    Update!
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className="mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl ">
        <View>
          <Text className="text-left text-2xl font-bold text-white">
            Delete
          </Text>
        </View>

        <View className="gap-5">
          <View className="gap-3 px-4">
            <View
              style={{ height: hp(6) }}
              className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"
            >
              <MaterialIcons name="movie" size={hp(3)} color="gray" />
              <Picker
                selectedValue={deletedMoviesSeries}
                onValueChange={(itemValue) => setDeletedMoviesSeries(itemValue)}
                style={{
                  flex: 1,
                  marginLeft: 3,
                  fontSize: hp(1.8),
                  color: "#404040",
                }}
                dropdownIconColor="gray"
              >
                <Picker.Item
                  label="Select Movie/Series"
                  value=""
                  color="gray"
                />
                {moviesSeries.map((ms) => (
                  <Picker.Item key={ms} label={ms} value={ms} />
                ))}
              </Picker>
            </View>

            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(8)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleDelete}
                  style={{ height: hp(4) }}
                  className="bg-indigo-400 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2) }}
                    className="text-white font-semibold tracking-wider"
                  >
                    Delete!
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className="mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-red-900 rounded-2xl ">
        <View>
          <Text className="text-left text-2xl font-bold text-white">
            Delete ALL!!!
          </Text>
        </View>

        <View className="gap-5">
          <View className="gap-3 px-4">
            <View
              style={{ height: hp(6) }}
              className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"
            >
              <Feather name="check-circle" size={hp(3)} color="gray" />
              <Picker
                selectedValue={confirmation}
                onValueChange={(itemValue) => setConfirmation(itemValue)}
                style={{
                  flex: 1,
                  marginLeft: 3,
                  fontSize: hp(1.8),
                  color: "#404040",
                }}
                dropdownIconColor="gray"
              >
                <Picker.Item label="Confirm?" value="" color="gray" />
                <Picker.Item key={"YES"} label={"YES"} value={"YES"} />
              </Picker>
            </View>

            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(8)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleDeleteAll}
                  style={{ height: hp(4) }}
                  className="bg-indigo-400 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2) }}
                    className="text-white font-semibold tracking-wider"
                  >
                    Delete ALL!!!
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
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
