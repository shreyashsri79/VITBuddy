import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LatestAnnouncementComponent from '../components/LatestAnnouncementComponent'
import { ScrollView } from 'react-native'

const socialsphere = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LatestAnnouncementComponent/>
    </ScrollView>
  )
}

export default socialsphere

const styles = StyleSheet.create({})