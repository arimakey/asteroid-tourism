
import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, useRouter, useSegments } from "expo-router";
import "../global.css";
import { AuthContextProvider, useAuth } from '@/src/context/authContext';
import LoadingBasic from '@/src/components/LoadingBasic';

const MainLayout = () => {
  const {isAuthenticated} = useAuth()
  const segments = useSegments()
  const route = useRouter()

  useEffect(() => {

    // check if user is authenticated or not
    if (typeof isAuthenticated === 'undefined') return
    const inApp = segments[0]?.startsWith('(app)')
    if (isAuthenticated && !inApp) {
      route.navigate("/(tabs)/")
    } else if (isAuthenticated == false){
      route.navigate("/(auth)/login")
    }
  }, [isAuthenticated])

  if (typeof isAuthenticated === 'undefined') return <LoadingBasic />

  return <Slot />

}

const RootLayout = () => {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  )
}

export default RootLayout