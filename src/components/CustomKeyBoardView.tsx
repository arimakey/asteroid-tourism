
import React, { Component } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'


const ios = Platform.OS === 'ios'


const CustomKeyBoardView = ({children}: {children: React.ReactNode}) => {
  return (
    <KeyboardAvoidingView
        behavior={ios ? 'padding' : 'height'}
        style={{flex: 1}}
    >
        <ScrollView
            style={{flex: 1}}
            bounces={false}
            showsVerticalScrollIndicator={false}
        >  
            {children}
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CustomKeyBoardView
