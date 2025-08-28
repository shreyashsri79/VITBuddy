import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FacultyTile from '../components/faculty'

const academia = () => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      <FacultyTile />
    </View>

  )
}

export default academia

const styles = StyleSheet.create({})