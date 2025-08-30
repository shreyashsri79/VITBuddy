import { useUser } from '@clerk/clerk-expo'
import { Stack } from 'expo-router/stack'
import { Redirect } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as FileSystem from 'expo-file-system'

const userFile = FileSystem.documentDirectory + 'user.json'

export default function Page() {
  const { isLoaded, isSignedIn } = useUser()
  const [userData, setUserData] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(userFile)
        if (!fileInfo.exists) {
          setUserData({})
        } else {
          const data = await FileSystem.readAsStringAsync(userFile)
          setUserData(JSON.parse(data))
        }
      } catch (err) {
        console.error('Error loading user.json:', err)
        setUserData({})
      } finally {
        setLoadingUser(false)
      }
    }

    loadUserData()
  }, [])

  if (!isLoaded || loadingUser) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }

  if (isSignedIn) {
    if (!userData || Object.keys(userData).length === 0) {
      return <Redirect href='/(home)/onboarding' />
    }
    return <Redirect href='/(tabs)/home' />
  } else {
    return <Redirect href='/(auth)/sign-in' />
  }
}
