import { View, Text, Alert, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { wp, hp } from '@/src/helpers/common'
import { useAuth } from '@/src/context/authContext'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const login = () => {
    const route = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const {login} = useAuth()

    const emailRef = useRef<string>("")
    const passwordRef = useRef<string>("")
    const insets = useSafeAreaInsets();

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
    
        <View className='flex-1'
            style={{ paddingTop: insets.top }}
        >
            <Image source={{ uri:"https://i.ibb.co/7KJyRRW/pexels-saul-siguenza-355267816-18450877.jpg" }} 
            style={{width:'100%', height:'65%', alignSelf:'center'}} 
            resizeMode='cover'/>
            <View style={{
                    position: 'absolute',
                    top: '40%',
                    left: wp(0),
                    right: wp(0),
                    backgroundColor: 'white',
                    borderRadius: 15,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 8,
                    height:'100%'
                }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
                    Iniciar Sesión
                </Text>
                <Text className='pt-3'>Email</Text>
                <View
                className='flex-row items-center' 
                style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    borderColor: 'gray', 
                    borderWidth: 1, 
                    borderRadius: 8, 
                    backgroundColor: '#EDEDED',
                    marginVertical: 8 }}
                >
                <TextInput
                    autoCapitalize='none'
                    onChangeText={(text) => {
                    emailRef.current = text
                    }}
                    placeholder='Email Adress' 
                    className='text-neutral-600 flex-1 border-none'
                    placeholderTextColor={'gray'}
                    style={{
                        borderBottomWidth: 1, 
                        borderBottomColor: 'gray', 
                        padding: 10}}
                />
                <Icon name="email-outline" size={24} color="gray"
                    className='px-2'/>
                </View>
                <Text className='pt-3 gap-1'>Contraseña</Text>
                <View
                    className='flex-row items-center' 
                    style={{flexDirection: 'row', 
                        alignItems: 'center', 
                        borderColor: 'gray', 
                        borderWidth: 1, 
                        borderRadius: 8, 
                        backgroundColor: '#EDEDED',
                        marginVertical: 8}}
                    >
                    <TextInput
                        autoCapitalize='none'
                        onChangeText={(text) => {
                            passwordRef.current = text
                        }}
                        secureTextEntry={true}
                        placeholder='Password' 
                        className='text-neutral-600 flex-1 border-none'
                        placeholderTextColor={'gray'}
                        
                        style={{borderBottomWidth: 1, 
                            borderBottomColor: 'gray', 
                            padding: 10}}
                    />
                    <Icon name="lock-outline" size={24} color="gray" className='px-2'/>
                </View>

                <View className='flex-row' style={{marginTop: hp(2)}}>
                {
                    loading ? (
                    <View className='flex-row justify-center'>
                        <Text style={{fontSize: hp(2.7)}} className='text-neutral-600 font-semibold tracking-wider'>Loading...</Text>
                    </View>
                    ): (
                    <TouchableOpacity
                        onPress={handleLogin}
                        style={{height: hp(7), backgroundColor: '#C48437', borderRadius: 8, width:'100%'}}
                        className='bg-neutral-700 rounded-md justify-center items-center'
                    >
                        <Text style={{fontSize: hp(2.7)}} className='text-white font-semibold tracking-wider'>Iniciar Sesion</Text>
                    </TouchableOpacity>
                    )
                }
                </View>

                <View 
                className='flex-row justify-center items-center gap-1'
                style={{marginTop: hp(3)}}
                >
                <Text>Aún no tienes una cuenta?</Text>
                <TouchableOpacity
                    onPress={() => route.navigate("/(auth)/register")}
                    className='flex-row justify-center items-center'
                >
                    <Text style={{color: 'blue'}}>Registrate Ahora</Text>
                </TouchableOpacity>
                </View>
            </View>

        </View>
        
    )
}

export default login