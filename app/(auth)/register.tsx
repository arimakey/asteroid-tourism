import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { wp, hp } from '@/src/helpers/common'
import {StatusBar} from 'expo-status-bar'
import { Octicons, SimpleLineIcons } from "@expo/vector-icons"
import { useRouter } from 'expo-router'
import CustomKeyBoardView from '@/src/components/CustomKeyBoardView'
import { useAuth } from '@/src/context/authContext'

const SignUp = () => {

  const {register} = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const emailRef = useRef<string>("")
  const passwordRef = useRef<string>("")
  const usernameRef = useRef<string>("")

  const handleRegister = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
      alert('Please fill all fields')
      return
    }
    let user = {
      email: emailRef.current,
      password: passwordRef.current,
      username: usernameRef.current,
    }
    setLoading(true)
    let response: any = await register(user)
    setLoading(false)
    console.log(response)
    if (!response.succes){
      // manegar los errores de register
      alert(response.error)
    } else {
      // redireccionar el usuario a la pagina de inicio
      router.navigate("/(tabs)/")
    }

  }

  return (
    <CustomKeyBoardView>
      <View className='gap-4 flex-1 p-6'
        style={{marginTop: hp(10)}}
      >
        <View
          className='flex-row'
        >
          <TextInput
            autoCapitalize='none'
            onChangeText={(text) => {
              usernameRef.current = text
            }}
            placeholder='Username' 
            className='text-neutral-600 flex-1'
            placeholderTextColor={'gray'}
          />
        </View>

        <View
          className='flex-row'
        >
          <TextInput
            autoCapitalize='none'
            onChangeText={(text) => {
              emailRef.current = text
            }}
            placeholder='Email Adress' 
            className='text-neutral-600 flex-1'
            placeholderTextColor={'gray'}
          />
        </View>

        <View
          className=' flex-row'
        >
          <TextInput
            autoCapitalize='none'
            onChangeText={(text) => {
              passwordRef.current = text
            }}
              secureTextEntry={true}
              placeholder='Password' 
              className='text-neutral-600 flex-1'
              placeholderTextColor={'gray'}
          />
        </View>

        <View className='gap-4' style={{marginTop: hp(2)}}>
          {
            loading ? (
              <View className='flex-row justify-center'>
                <Text style={{fontSize: hp(2.7)}} className='text-neutral-600 font-semibold tracking-wider'>Loading...</Text>
              </View>
            ): (
              <TouchableOpacity
                onPress={handleRegister}
                style={{height: hp(6)}}
                className='bg-neutral-700 rounded-md justify-center items-center'
              >
                <Text style={{fontSize: hp(2.7)}} className='text-white font-semibold tracking-wider'>Sign Up</Text>
              </TouchableOpacity>
            )
          }
        </View>
        <View 
          className='flex-row justify-between'
          style={{marginTop: hp(3)}}
        >
          <Text>Ya estas registrado?</Text>
          <TouchableOpacity
            onPress={() => router.navigate("/(auth)/login")}
            className='flex-row justify-center'
          >
            <Text style={{color: 'blue'}}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomKeyBoardView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    paddingTop: hp(8),
  },
  image: {
    height: hp(25)
  }
})

export default SignUp