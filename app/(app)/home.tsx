import { View, Text, Image, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, {useRef, useState} from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import Loading from '@/components/Loading';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/context/authContext';


export default function home() {
  const { getIdToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const nameRef = useRef("");
  const [selectedGenre, setSelectedGenre] = useState("Action");
  const [selectedStatus, setSelectedStatus] = useState("watching");

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Drama", "Fantasy", "Horror", 
    "Mystery", "Romance", "Sci-Fi", "Thriller", "Crime", "Documentary", "Historical", 
    "Musical", "Family", "Biography", "War", "Western", "Superhero", "Sports", 
    "Reality", "Game Show", "True Crime", "Psychological", "Zombie/Apocalypse"
  ];

  const handleAdd = async () => {
    setLoading(true);
  
    const name = nameRef.current;
    const genre = selectedGenre;
    const status = selectedStatus;
    const NGROK_URL = 'https://6b81-2001-fb1-22-b3a1-ad09-4a6-569a-c36.ngrok-free.app'; // Replace everytime when run backend

    try {
      const idToken = await getIdToken();

      const response = await fetch(`${NGROK_URL}/add_movie`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
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
        alert('Movie added successfully!');
      } else {
        console.log('Error response:', data);
        alert('Failed to add movie!');
      }
  
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`An error occurred while adding the movie`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomKeyboardView >
      <StatusBar style="dark"/>
      <View className='mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl'>
        <View>
          <Text className='text-left text-2xl font-bold text-white'>Add</Text>
        </View>

        <View className='gap-5'>
          <View className='gap-3 px-4'>
            <View style={{ height: hp(6) }} className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"> 
              <MaterialIcons name="movie" size={hp(3)} color="gray" />
              <TextInput 
                onChangeText={value => nameRef.current = value} 
                style={{fontSize: hp(1.8)}} 
                className='ml-4 flex-1 font-semibold text-neutral-700' 
                placeholder='Movie/Series' 
                placeholderTextColor={'gray'} 
              />
            </View>
            <View style={{ height: hp(6) }} className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"> 
              <MaterialIcons name="style" size={hp(3)} color="gray" />
              <Picker
                selectedValue={selectedGenre}
                onValueChange={(itemValue) => setSelectedGenre(itemValue)}
                style={{
                  flex: 1,
                  marginLeft: 3,
                  fontSize: hp(1.8),
                  color: '#404040',
                }}
                dropdownIconColor="gray"
              >
                {genres.map((genre) => (
                  <Picker.Item key={genre} label={genre} value={genre} />
                ))}
              </Picker>
            </View>
            

            <View style={{ height: hp(5) }} className="flex-row items-center justify-between gap-2 ">
              <Text className="font-bold text-lg text-white">
                Select Status:
              </Text>

              <View style={{height: hp(5)}} className="flex-row items-center bg-neutral-200 rounded-2xl px-3 py-1 flex-1 ml-2">
                <Octicons name="checklist" size={hp(3)} color="gray" />
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                  style={{
                    flex: 1,
                    marginLeft: 3,
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#404040',
                  }}
                  dropdownIconColor="gray"
                >
                  <Picker.Item label="Watching" value="Watching" />
                  <Picker.Item label="Planning" value="Planning" />
                  <Picker.Item label="Completed" value="Completed" />
                </Picker>
              </View>
            </View>

            <View>
              {
                loading ? (
                  <View className='flex-row justify-center'>
                    <Loading size={hp(8)} />
                  </View>
                ) : (
                  <TouchableOpacity onPress={handleAdd} style={{height: hp(4)}} className='bg-indigo-400 rounded-xl justify-center items-center'>
                    <Text style={{fontSize: hp(2)}} className='text-white font-semibold tracking-wider'>
                      Add!
                    </Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
        </View>
      </View>

      <View className='mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl'>
        <View>
          <Text className='text-left text-2xl font-bold text-white'>Update</Text>
        </View>
      </View>

      <View className='mt-4 mx-4 pt-4 pb-6 px-5 gap-3 bg-slate-700 rounded-2xl'>
        <View>
          <Text className='text-left text-2xl font-bold text-white'>Delete</Text>
        </View>
      </View>
    </CustomKeyboardView>
  )
}