
import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const LoadingBasic = () => {
  return (
    <View className='flex-1 justify-center items-center'>
      <StatusBar style='light' />
      <Text>Cargando...</Text>
      <ActivityIndicator size='large' color='#0000ff' />
    </View>
  )
}

export default LoadingBasic