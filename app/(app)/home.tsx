import { View, Text, Image, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, {useRef, useState} from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '@/components/Loading';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { Picker } from '@react-native-picker/picker';


export default function home() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const nameRef = useRef("");
  const genreRef = useRef("");
  const [selectedStatus, setSelectedStatus] = useState(undefined);

  const handleAdd = async () => {

  }

  return (
    <CustomKeyboardView>
      <StatusBar style="dark"/>
      <View className='pt-4 px-5 flex-1 gap-3'>
        <View>
          <Text className='text-left text-2xl font-bold'>Add</Text>
        </View>

        <View className='gap-5'>
          <View className='gap-3 px-4'>
            <View style={{height: hp(6)}} className="flex-row justify-between gap-2"> 
              
              <View className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"> 
                <MaterialIcons name="movie" size={hp(3)} color="gray" />
                <TextInput 
                  onChangeText={value => nameRef.current = value} 
                  style={{fontSize: hp(1.8)}} 
                  className='ml-2 flex-1 font-semibold text-neutral-700' 
                  placeholder='Movie/Series' 
                  placeholderTextColor={'gray'} 
                />
              </View>
              <View className="flex-1 flex-row items-center bg-neutral-200 px-3 py-2 rounded-2xl"> 
                <MaterialIcons name="style" size={hp(3)} color="gray" />
                <TextInput 
                  onChangeText={value => genreRef.current = value} 
                  style={{fontSize: hp(1.8)}} 
                  className='ml-2 flex-1 font-semibold text-neutral-700' 
                  placeholder='Genre (only 1)' 
                  placeholderTextColor={'gray'} 
                />
              </View>
            </View>

            <View style={{ height: hp(5) }} className="flex-row items-center justify-between gap-2 ">
              <Text className="font-semibold text-base text-neutral-700">
                Select Status:
              </Text>

              <View style={{height: hp(5)}} className="flex-row items-center bg-neutral-200 rounded-2xl px-3 py-1 flex-1 ml-2">
                <Octicons name="checklist" size={hp(3)} color="gray" />
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(itemValue) => setSelectedStatus(itemValue)}
                  style={{
                    flex: 1,
                    marginLeft: 10,
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
                loading?(
                  <View className='flex-row justify-center'>
                    <Loading size={hp(8)} />
                  </View>
                ):(
                  <TouchableOpacity onPress={handleAdd} style={{height :hp(3.5)}} className='bg-indigo-400 rounded-xl justify-center items-center'>
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
    </CustomKeyboardView>
  )
}