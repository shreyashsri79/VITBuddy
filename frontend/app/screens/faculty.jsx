import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, { Layout, SlideInLeft } from 'react-native-reanimated'
import facultyData from '../../assets/jsons/faculty_details.json'

export default function FacultyScreen() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filteredData = facultyData.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index)
  }

  const renderStars = (rating) => {
    if (!rating) return <Text style={styles.subtext}>No Reviews</Text>
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={16} color="#000" />)
    }
    if (halfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#000" />)
    }
    while (stars.length < 5) {
      stars.push(
        <Ionicons key={`empty-${stars.length}`} name="star-outline" size={16} color="#000" />
      )
    }
    return <View style={{ flexDirection: 'row', marginTop: 6 }}>{stars}</View>
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => toggleExpand(index)}
      activeOpacity={0.9}
    >
      <View style={styles.headerRow}>
        {item.pfpString ? (
          <Image source={{ uri: item.pfpString }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle-outline" size={40} color="#000" />
        )}
        <Text style={styles.name}>{item.name}</Text>
      </View>

      {expanded === index && (
        <Animated.View
          entering={SlideInLeft.duration(250)} // slide left → right
          layout={Layout.springify().damping(20).stiffness(150)}
          style={styles.details}
        >
          <Text style={styles.subtext}>Cabin — {item.cabin || 'No Info'}</Text>
          <Text style={styles.subtext}>Contact — {item.mobile || 'No Contact'}</Text>
          {renderStars(item.rating ? parseFloat(item.rating) : null)}
        </Animated.View>
      )}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search Faculty..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No Faculty Found</Text>}
        showsVerticalScrollIndicator={false} // remove vertical scroll bar
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  search: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa'
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111'
  },
  details: {
    marginTop: 12
  },
  subtext: {
    fontSize: 14,
    color: '#444',
    marginTop: 4
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#aaa'
  }
})
