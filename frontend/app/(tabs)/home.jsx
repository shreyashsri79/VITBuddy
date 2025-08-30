import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CurrentMessMeal from '../components/CuurentMessMeal'
import LatestAnnouncementComponent from '../components/LatestAnnouncementComponent'
import LostFoundPager from '../components/LostFoundPager'
import MarketplacePager from '../components/Marketplace'

const home = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <CurrentMessMeal/>
      <MarketplacePager/>
      <LostFoundPager/>
    </ScrollView>
  )
}

export default home

const styles = StyleSheet.create({})