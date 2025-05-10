import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Feather, MaterialIcons, Octicons } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import { useAuth } from "@/context/authContext";
import { Picker } from "@react-native-picker/picker";
import { NGROK_URL } from "../ngrok_url";

export default function WhatStatus() {
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<{
    name: string;
    genre: string;
    status: string;
  } | null>(null);
  const [updatedGenre, setUpdatedGenre] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [moviesSeries, setMoviesSeries] = useState<string[]>([]);
  const [watching, setWatching] = useState<Movie[]>([]);
  const [planning, setPlanning] = useState<Movie[]>([]);
  const [completed, setCompleted] = useState<Movie[]>([]);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null); // Track which movie is pending deletion

  interface Movie {
    name: string;
    genre: string;
    status: string;
  }

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
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Movies grouped by status:", data);
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
      setRefreshing(false);
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
          id_token: idToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Movies:", data);
        setMoviesSeries(data.movies_series || []);
      } else {
        console.log("Error response:", data);
        alert("Failed to fetch movies: " + data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while fetching movies");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedMovie) return;

    setLoading(true);

    const nameu = selectedMovie.name;
    const genreu = updatedGenre || selectedMovie.genre;
    const statusu = updatedStatus || selectedMovie.status;

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
          id_token: idToken,
          nameu,
          genreu,
          statusu,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Movie updated successfully!");
        getAllMoviesSeries();
        getByStatus();
        setModalVisible(false);
        setUpdatedGenre("");
        setUpdatedStatus("");
        setSelectedMovie(null);
      } else {
        console.log("Error response:", data);
        alert("Failed to update movie: " + data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while updating the movie");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string) => {
    setLoading(true);

    const named = name;

    if (!named || named.trim() === "") {
      alert("Movie/Series name cannot be empty!");
      setLoading(false);
      return;
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
          id_token: idToken,
          named,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Movie deleted successfully!");
        getAllMoviesSeries();
        getByStatus();
      } else {
        console.log("Error response:", data);
        alert("Failed to delete movie: " + data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred while deleting the movie");
    } finally {
      setLoading(false);
      setPendingDelete(null); // Reset pending delete state
    }
  };

  const initiateDelete = (name: string) => {
    setPendingDelete(name); // Set the movie name as pending deletion
  };

  const cancelDelete = () => {
    setPendingDelete(null); // Reset the pending delete state
  };

  const openUpdateModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setUpdatedGenre(movie.genre);
    setUpdatedStatus(movie.status);
    setModalVisible(true);
  };

  useEffect(() => {
    getAllMoviesSeries();
    getByStatus();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getAllMoviesSeries();
    getByStatus();
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.header}>WhatStatus</Text>

          {/* Watching Section */}
          <Text style={styles.sectionHeader}>Watching</Text>
          <View style={styles.section}>
            {loading ? (
              <Loading size={100} />
            ) : watching.length === 0 ? (
              <Text style={styles.placeholderText}>
                No movies/series to watch right now.
              </Text>
            ) : (
              watching.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Feather name="play-circle" size={20} color="#60A5FA" />
                  <Text style={styles.itemText}>
                    {item.name}{" "}
                    <Text style={styles.genreText}>({item.genre})</Text>
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => openUpdateModal(item)}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="edit" size={20} color="#60A5FA" />
                    </TouchableOpacity>
                    {pendingDelete === item.name ? (
                      <View style={styles.confirmationContainer}>
                        <TouchableOpacity
                          onPress={() => handleDelete(item.name)}
                          style={[styles.actionButton, styles.confirmButton]}
                        >
                          <Text style={styles.confirmButtonText}>
                            Confirm
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={cancelDelete}
                          style={[styles.actionButton, styles.cancelButton]}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => initiateDelete(item.name)}
                        style={styles.actionButton}
                      >
                        <MaterialIcons name="delete" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Plan to Watch Section */}
          <Text style={styles.sectionHeader}>Plan to Watch</Text>
          <View style={styles.section}>
            {loading ? (
              <Loading size={100} />
            ) : planning.length === 0 ? (
              <Text style={styles.placeholderText}>
                No movies/series planned to watch yet.
              </Text>
            ) : (
              planning.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Feather name="clock" size={20} color="#60A5FA" />
                  <Text style={styles.itemText}>
                    {item.name}{" "}
                    <Text style={styles.genreText}>({item.genre})</Text>
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => openUpdateModal(item)}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="edit" size={20} color="#60A5FA" />
                    </TouchableOpacity>
                    {pendingDelete === item.name ? (
                      <View style={styles.confirmationContainer}>
                        <TouchableOpacity
                          onPress={() => handleDelete(item.name)}
                          style={[styles.actionButton, styles.confirmButton]}
                        >
                          <Text style={styles.confirmButtonText}>
                            Confirm
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={cancelDelete}
                          style={[styles.actionButton, styles.cancelButton]}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => initiateDelete(item.name)}
                        style={styles.actionButton}
                      >
                        <MaterialIcons name="delete" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Completed Section */}
          <Text style={styles.sectionHeader}>Completed</Text>
          <View style={styles.section}>
            {loading ? (
              <Loading size={100} />
            ) : completed.length === 0 ? (
              <Text style={styles.placeholderText}>
                No completed movies/series.
              </Text>
            ) : (
              completed.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Feather name="check-circle" size={20} color="#34D399" />
                  <Text style={styles.itemText}>
                    {item.name}{" "}
                    <Text style={styles.genreText}>({item.genre})</Text>
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => openUpdateModal(item)}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="edit" size={20} color="#60A5FA" />
                    </TouchableOpacity>
                    {pendingDelete === item.name ? (
                      <View style={styles.confirmationContainer}>
                        <TouchableOpacity
                          onPress={() => handleDelete(item.name)}
                          style={[styles.actionButton, styles.confirmButton]}
                        >
                          <Text style={styles.confirmButtonText}>
                            Confirm
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={cancelDelete}
                          style={[styles.actionButton, styles.cancelButton]}
                        >
                          <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => initiateDelete(item.name)}
                        style={styles.actionButton}
                      >
                        <MaterialIcons name="delete" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Update Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>
              Update {selectedMovie?.name}
            </Text>

            <View style={styles.inputContainer}>
              <MaterialIcons name="style" size={24} color="gray" />
              <Picker
                selectedValue={updatedGenre}
                onValueChange={(itemValue) => setUpdatedGenre(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Genre" value="" color="gray" />
                {genres.map((genre) => (
                  <Picker.Item key={genre} label={genre} value={genre} />
                ))}
              </Picker>
            </View>

            <View style={styles.inputContainer}>
              <Octicons name="checklist" size={24} color="gray" />
              <Picker
                selectedValue={updatedStatus}
                onValueChange={(itemValue) => setUpdatedStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Status" value="" color="gray" />
                <Picker.Item label="Watching" value="Watching" />
                <Picker.Item label="Planning" value="Planning" />
                <Picker.Item label="Completed" value="Completed" />
              </Picker>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: "#EF4444" }]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdate}
                style={[styles.modalButton, { backgroundColor: "#60A5FA" }]}
                disabled={loading}
              >
                {loading ? (
                  <Loading size={24} />
                ) : (
                  <Text style={styles.modalButtonText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </CustomKeyboardView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F3F4F6", // bg-gray-100
  },
  container: {
    marginTop: 24, // mt-6
    marginHorizontal: 16, // mx-4
    paddingTop: 24, // pt-6
    paddingBottom: 32, // pb-8
    paddingHorizontal: 24, // px-6
    backgroundColor: "#1E293B", // bg-slate-800
    borderRadius: 16, // rounded-2xl
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // shadow-lg
  },
  header: {
    fontSize: 24, // text-2xl
    fontWeight: "bold", // font-bold
    color: "#FFFFFF", // text-white
    marginBottom: 16, // mb-4
  },
  sectionHeader: {
    fontSize: 20, // text-xl
    fontWeight: "600", // font-semibold
    color: "#FFFFFF", // text-white
    marginTop: 16, // mt-4
    marginBottom: 8, // mb-2
  },
  section: {
    backgroundColor: "#334155", // bg-slate-700
    padding: 16, // p-4
    borderRadius: 8, // rounded-lg
  },
  placeholderText: {
    color: "#D1D5DB", // text-gray-300
    fontStyle: "italic", // italic
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemText: {
    color: "#FFFFFF",
    marginLeft: 8,
    flex: 1,
  },
  genreText: {
    color: "#9CA3AF",
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: 8,
  },
  actionButton: {
    marginLeft: 8,
    padding: 4,
  },
  confirmationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#EF4444",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#6B7280",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#404040",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});