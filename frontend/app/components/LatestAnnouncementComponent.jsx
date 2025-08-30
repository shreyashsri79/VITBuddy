import React, { useRef, useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import poster from '../../assets/images/sample_poster.png'; 
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


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.9;
const IDEAL_HEIGHT = CARD_WIDTH * (5 / 3);
const MAX_HEIGHT = screenHeight * 0.6;
const CARD_HEIGHT = Math.min(IDEAL_HEIGHT, MAX_HEIGHT);

const announcements = [
  {
    id: '1',
    image: poster,
    title: 'Hackathon 2025',
    description: 'Join us for an overnight coding event full of innovation!',
    by: 'CSI Club',
  },
  {
    id: '2',
    image: { uri: 'https://picsum.photos/500' },
    title: 'Robotics Workshop',
    description: 'Learn how to build autonomous bots using Arduino.',
    by: 'Robotics Club',
  },
  {
    id: '3',
    image: { uri: 'https://picsum.photos/400' },
    title: 'Open Mic Night',
    description: 'Show off your talent in music, poetry or stand-up!',
    by: 'Dramatics Club',
  },
];

export default function LatestAnnouncementComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % announcements.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 2000);


    return () => clearInterval(interval);
  }, [currentIndex]);

  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Neuton_700Bold,
  });

  if (!fontsLoaded) return null; // prevents fallback flicker
  return (
    <Pressable onPress={() => router.push('/screens/latestAnnouncements')}>
      <View style={{ flex: 1, marginVertical: 24 }}>
        <Text
          style={{
            ...styles.announcementTitle,
          }}
        >
          What&apos;s New
        </Text>
        <View style={[styles.wrapper, { height: CARD_HEIGHT }]}>
          <FlatList
            ref={flatListRef}
            data={announcements}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
              </View>
            )}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
          {/* Dots */}
          <View style={styles.dotsContainer}>
            {announcements.map((_, index) => (
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
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginHorizontal: 20
  },
  image: {
    width: '100%',
    height: '100%',
  },
  announcementTitle: {
    fontSize: 36,
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
    backgroundColor: '#4A3428',
  },
});
