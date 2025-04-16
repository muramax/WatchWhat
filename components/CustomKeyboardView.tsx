import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'

const ios = Platform.OS === 'ios'
const android = Platform.OS === 'android'
import { ReactNode } from 'react';

export default function CustomKeyboardView({children}: {children: ReactNode}) {
  return (
    <KeyboardAvoidingView behavior={ios ? 'padding' : 'height'} style={{flex:1}}>
        <ScrollView style={{flex:1}} bounces={false} showsVerticalScrollIndicator={false}>
            {
                children
            }
        </ScrollView>
    </KeyboardAvoidingView>
  )
}