import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useFonts, Neuton_700Bold } from '@expo-google-fonts/neuton';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;


const lostFoundData = [
  {
    id: '1',
    type: 'lost',
    image: { uri: 'https://picsum.photos/500' },
    description: 'Black Wallet lost near library',
    date: '2025-08-25',
    contact: '+91 98765 43210',
  },
  {
    id: '2',
    type: 'found',
    image: { uri: 'https://picsum.photos/600' },
    description: 'Keys found at cafeteria',
    date: '2025-08-26',
    contact: '+91 87654 32109',
  },
];

export default function LostFoundPager() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % lostFoundData.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const [fontsLoaded] = useFonts({
    Neuton_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Pressable onPress={() => router.push('/screens/lostnfound')}>
      <View style={{ flex: 1, marginVertical: 24 }}>
        <Text style={styles.sectionTitle}>Lost &amp; Found</Text>
        <View style={[styles.wrapper]}>
          <FlatList
            ref={flatListRef}
            data={lostFoundData}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <View
                  style={[
                    styles.badge,
                    item.type === 'lost' ? styles.lostBadge : styles.foundBadge,
                  ]}
                >
                  <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
                </View>
                <View style={styles.overlay}>
                  <Text style={styles.desc}>{item.description}</Text>
                  <Text style={styles.meta}>📅 {item.date}</Text>
                  <Text style={styles.meta}>📞 {item.contact}</Text>
                </View>
              </View>
            )}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
          {/* Dots */}
          <View style={styles.dotsContainer}>
            {lostFoundData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex ? styles.activeDot : {},
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#555',
  },
  image: {
    width: '100%',
    height: 250,
  },
  overlay: {
    padding: 12,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  lostBadge: { backgroundColor: '#e63946' },
  foundBadge: { backgroundColor: '#2a9d8f' },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  desc: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111',
  },
  meta: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 28,
    marginBottom: 20,
    paddingHorizontal: 26,
    fontFamily: 'Neuton_700Bold',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 6,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: '#ccc',
    marginBottom: 15,
  },
  activeDot: {
    backgroundColor: '#111',
  },
});
