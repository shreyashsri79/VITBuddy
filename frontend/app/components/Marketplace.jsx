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

const marketplaceData = [
  {
    id: '1',
    image: { uri: 'https://picsum.photos/400?random=101' },
    mrp: '₹500',
    description: 'Bluetooth Headphones - almost new.',
    contact: '+91 98765 43210',
  },
  {
    id: '2',
    image: { uri: 'https://picsum.photos/400?random=102' },
    mrp: '₹1200',
    description: 'Guitar - great condition, barely used.',
    contact: '+91 87654 32109',
  },
  {
    id: '3',
    image: { uri: 'https://picsum.photos/400?random=103' },
    mrp: '₹700',
    description: 'Nike Backpack - like new.',
    contact: '+91 99887 77665',
  },
];

export default function MarketplacePager() {
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
      const nextIndex = (currentIndex + 1) % marketplaceData.length;
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
    <Pressable onPress={() => router.push('/screens/marketplace')}>
      <View style={{ flex: 1, marginVertical: 24 }}>
        <Text style={styles.sectionTitle}>Marketplace</Text>

        <View style={styles.wrapper}>
          <FlatList
            ref={flatListRef}
            data={marketplaceData}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.overlay}>
                  <Text style={styles.mrp}>{item.mrp}</Text>
                  <Text style={styles.desc}>{item.description}</Text>
                  <Text style={styles.meta}>📞 {item.contact}</Text>
                </View>
              </View>
            )}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
          {/* Dots */}
          <View style={styles.dotsContainer}>
            {marketplaceData.map((_, index) => (
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#bbb',
    borderStyle: 'dashed',   // clean dashed line
    marginBottom: 16,
    marginHorizontal: 26,    // aligns with title
  },
  image: {
    width: '100%',
    height: 220,
  },
  overlay: {
    padding: 12,
  },
  mrp: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111',
  },
  desc: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
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
