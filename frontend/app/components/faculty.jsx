import React from 'react'
import { TouchableOpacity, StyleSheet, Dimensions, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

export default function FacultyTile() {
  const router = useRouter()

  return (
    <TouchableOpacity
      style={styles.tile}
      activeOpacity={0.8}
      onPress={() => router.push('/screens/faculty')}
    >
      <View style={styles.content}>
        <Ionicons name="people-outline" size={48} color="#fff" />
        <Text style={styles.labelText}>Faculty Info</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tile: {
    width: width * 0.40,
    height: width * 0.40,
    backgroundColor: '#000',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8
  }
})
