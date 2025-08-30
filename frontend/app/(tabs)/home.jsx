import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CurrentMessMeal from '../components/CuurentMessMeal'

const home = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <CurrentMessMeal/>
    </ScrollView>
  )
}

export default home

const styles = StyleSheet.create({})