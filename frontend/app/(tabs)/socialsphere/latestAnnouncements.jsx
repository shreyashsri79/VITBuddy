import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { useFonts, Tinos_700Bold } from '@expo-google-fonts/tinos';
import AppLoading from 'expo-app-loading';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const CARD_HEIGHT = CARD_WIDTH * (4 / 3);

// Dummy filters
const filters = ['All', 'Tech', 'Cultural', 'Sports', 'Workshops'];

const announcements = [
  {
    id: '1',
    title: 'Hackathon 2025',
    category: 'Tech',
    image: require('../../../assets/images/sample_poster.png'),
  },
  {
    id: '2',
    title: 'Robotics Workshop',
    category: 'Workshops',
    image: { uri: 'https://picsum.photos/500' },
  },
  {
    id: '3',
    title: 'Open Mic Night',
    category: 'Cultural',
    image: { uri: 'https://picsum.photos/400' },
  },
  {
    id: '4',
    title: 'Cricket Tournament',
    category: 'Sports',
    image: { uri: 'https://picsum.photos/401' },
  },
];

export default function LatestAnnouncementsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Load Google font Tinos Bold 700
  const [fontsLoaded] = useFonts({
    Tinos_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const filteredData =
    selectedFilter === 'All'
      ? announcements
      : announcements.filter((a) => a.category === selectedFilter);

  const renderCard = ({ item }) => (
    <Link
      href={{
        pathname: '/screens/announcement/[id]',
        params: { id: item.id },
      }}
      asChild
    >
      <Pressable style={styles.cardWrapper}>
        <View style={styles.card}>
          <Image source={item.image} style={styles.image} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
      </Pressable>
    </Link>
  );

  // Header component for FlatList
  const ListHeader = () => (
    <View>
      <Text style={styles.whatsNewText}>Upcoming Events </Text>

      {/* Pills Row */}
      <View style={styles.pillsContainer}>
        {filters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.pill,
              selectedFilter === filter && styles.pillActive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                selectedFilter === filter && styles.pillTextActive,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.divider} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        ListHeaderComponent={ListHeader}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },

  whatsNewText: {
    fontFamily: 'Tinos_700Bold', // Bold 700 weight
    fontSize: 36,
    marginBottom: 16,
    color: '#111',
  },

  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pillActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  pillTextActive: {
    color: '#fff',
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dotted',
    marginBottom: 16,
  },

  cardWrapper: {
    marginBottom: 52,
    paddingBottom: 12,
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: CARD_WIDTH,
    borderBottomWidth: 1,
    borderColor: '#555',
  },
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  textBlock: {
    marginTop: 14,
    marginLeft: 6,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#111',
  },
  cardCategory: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
