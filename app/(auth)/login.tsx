import { View, Text, Alert, TextInput, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { wp, hp } from '@/src/helpers/common'
import { useAuth } from '@/src/context/authContext'
import { useRouter } from 'expo-router'

const login = () => {
    const route = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const {login} = useAuth()

    const emailRef = useRef<string>("")
    const passwordRef = useRef<string>("")

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
        alert('Please fill all fields')
        return
        }
        let user = {
            email: emailRef.current,
            password: passwordRef.current
        }
        setLoading(true)
        let response: any = await login(user)
        setLoading(false)

        if (!response.succes) {
            // manegar los errores de login
            alert(response.error)
        } else {
            // redireccionar el usuario a la pagina de inicio
            route.navigate("/(tabs)/")
        }

    }
    return (
    
        <View className='flex-1 p-6'
            style={{marginTop: hp(10)}}
        >
            <View className='gap-4'>
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
                        onPress={handleLogin}
                        style={{height: hp(6)}}
                        className='bg-neutral-700 rounded-md justify-center items-center'
                    >
                        <Text style={{fontSize: hp(2.7)}} className='text-white font-semibold tracking-wider'>Sign In</Text>
                    </TouchableOpacity>
                    )
                }
                </View>

                <View 
                className='flex-row justify-between'
                style={{marginTop: hp(3)}}
                >
                <Text>Quieres registrarte?</Text>
                <TouchableOpacity
                    onPress={() => route.navigate("/(auth)/register")}
                    className='flex-row justify-center'
                >
                    <Text style={{color: 'blue'}}>Registrate</Text>
                </TouchableOpacity>
                </View>
            </View>

        </View>
        
    )
}

export default login