import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { Layout, FadeIn } from 'react-native-reanimated';
import facultyData from '../../../assets/jsons/faculty_details.json';

export default function FacultyScreen() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filteredData = facultyData.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const renderStars = (rating) => {
    if (!rating) return <Text style={styles.noReview}>No Reviews</Text>;
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={14} color="#FFB800" />);
    }
    if (halfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color="#FFB800" />);
    }
    while (stars.length < 5) {
      stars.push(
        <Ionicons key={`empty-${stars.length}`} name="star-outline" size={14} color="#FFB800" />
      );
    }
    return (
      <View style={styles.starsRow}>
        {stars}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.facultyCard}
      onPress={() => toggleExpand(index)}
      activeOpacity={0.8}
    >
      <View style={styles.headerRow}>
        {item.pfpString ? (
          <Image source={{ uri: item.pfpString }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={28} color="#999" />
          </View>
        )}
        <View style={styles.nameSection}>
          <Text style={styles.name}>{item.name}</Text>
          {renderStars(item.rating ? parseFloat(item.rating) : null)}
        </View>
        <Ionicons
          name={expanded === index ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </View>

      {expanded === index && (
        <Animated.View
          entering={FadeIn.duration(200)}
          layout={Layout.springify().damping(18).stiffness(140)}
          style={styles.detailsContainer}
        >
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={16} color="#444" />
              <Text style={styles.infoLabel}>Cabin</Text>
            </View>
            <Text style={styles.infoValue}>{item.cabin || 'Not Available'}</Text>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color="#444" />
              <Text style={styles.infoLabel}>Contact</Text>
            </View>
            <Text style={styles.infoValue}>{item.mobile || 'Not Available'}</Text>
          </View>
        </Animated.View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.search}
            placeholder="Search Faculty..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#ddd" />
              <Text style={styles.empty}>No Faculty Found</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f9f9f9' 
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  search: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
  },
  facultyCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    fontWeight: '600',
  },
  noReview: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  infoValue: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  empty: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});