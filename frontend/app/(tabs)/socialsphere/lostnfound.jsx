import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Fonts
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Tinos_700Bold } from '@expo-google-fonts/tinos';

const initialData = [
  {
    id: '1',
    type: 'lost',
    image: 'https://picsum.photos/400?random=11',
    description: 'Lost blue wallet near cafeteria.',
    date: '2025-07-28',
    contact: '9876543210',
  },
  {
    id: '2',
    type: 'found',
    image: 'https://picsum.photos/400?random=12',
    description: 'Found umbrella in library.',
    date: '2025-07-30',
    contact: '9123456780',
  },
];

export default function LostFoundScreen() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Tinos_700Bold,
  });

  const [filter, setFilter] = useState('All');
  const [data, setData] = useState(initialData);
  const [desc, setDesc] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState('lost');
  const [pickedImage, setPickedImage] = useState(null);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['1%', '75%'], []);

  if (!fontsLoaded) return <AppLoading />;

  const openSheet = () => bottomSheetRef.current?.expand();
  const closeSheet = () => bottomSheetRef.current?.close();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPickedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSubmit = () => {
    if (!desc.trim() || !contact.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      type,
      image:
        pickedImage ||
        'https://picsum.photos/400?random=' + Math.floor(Math.random() * 1000),
      description: desc,
      date: new Date().toISOString().split('T')[0],
      contact,
    };

    setData([newItem, ...data]);
    setDesc('');
    setContact('');
    setType('lost');
    setPickedImage(null);
    closeSheet();
  };

  const filteredData =
    filter === 'All' ? data : data.filter((item) => item.type === filter.toLowerCase());

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View
          style={[
            styles.badge,
            item.type === 'lost' ? styles.lostBadge : styles.foundBadge,
          ]}
        >
          <Text style={styles.badgeText}>{item.type.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.overlay}>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.meta}>📅 {item.date}</Text>
        <Text style={styles.meta}>📞 {item.contact}</Text>
      </View>
    </View>
  );

  // Header with "Lost & Found" + Pills
  const ListHeader = () => (
    <View>
      <Text style={styles.heading}>Lost & Found</Text>
      <View style={styles.pillsContainer}>
        {['All', 'Lost', 'Found'].map((p) => (
          <Pressable
            key={p}
            onPress={() => setFilter(p)}
            style={[styles.pill, filter === p && styles.pillActive]}
          >
            <Text style={[styles.pillText, filter === p && styles.pillTextActive]}>
              {p}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* List */}
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Floating Add Button */}
          <Pressable style={styles.fab} onPress={openSheet}>
            <Ionicons name="add" size={28} color="#fff" />
          </Pressable>

          {/* Bottom Sheet */}
          <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
            <BottomSheetView style={styles.sheetContent}>
              <ScrollView>
                <Text style={styles.modalHeading}>Add Lost/Found Item</Text>

                {/* Image Picker */}
                <Pressable style={styles.imagePicker} onPress={pickImage}>
                  <Ionicons name="image-outline" size={22} color="#555" />
                  <Text style={styles.imagePickerText}>
                    {pickedImage ? 'Change Image' : 'Pick an Image (optional)'}
                  </Text>
                </Pressable>

                {pickedImage && (
                  <View style={{ marginBottom: 14 }}>
                    <Image source={{ uri: pickedImage }} style={styles.previewImage} />
                    <Pressable
                      onPress={() => setPickedImage(null)}
                      style={styles.removeImageButton}
                    >
                      <Text style={styles.removeImageText}>Remove Image</Text>
                    </Pressable>
                  </View>
                )}

                <TextInput
                  placeholder="Description"
                  value={desc}
                  onChangeText={setDesc}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Contact Number"
                  keyboardType="phone-pad"
                  value={contact}
                  onChangeText={setContact}
                  style={styles.input}
                />

                {/* Type selector */}
                <View style={styles.typeRow}>
                  {['lost', 'found'].map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setType(t)}
                      style={[styles.typeButton, type === t && styles.typeButtonActive]}
                    >
                      <Text
                        style={[styles.typeText, type === t && styles.typeTextActive]}
                      >
                        {t.toUpperCase()}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitText}>Submit</Text>
                </Pressable>
              </ScrollView>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { flex: 1, padding: 16 },

  heading: {
    fontSize: 36,
    fontFamily: 'Tinos_700Bold',
    marginBottom: 16,
    color: '#111',
  },

  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  pillActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  pillText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#333',
  },
  pillTextActive: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },

  card: {
    borderBottomWidth: 1,
    borderColor: '#555',
    marginBottom: 48,
    backgroundColor: '#fff',
  },
  image: { width: '100%', height: 250 },
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
  badgeText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 12 },

  overlay: { padding: 12 },
  desc: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginBottom: 6, color: '#111' },
  meta: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#444', marginBottom: 2 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    elevation: 6,
  },

  sheetContent: {
    flex: 1,
    padding: 20,
  },
  modalHeading: { fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#fff',
    fontFamily: 'Inter_400Regular',
  },
  imagePicker: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#555',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dotted',
    marginBottom: 16,
  },
  previewImage: { width: '100%', height: 250, borderRadius: 10 },
  removeImageButton: {
    marginTop: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e63946',
    borderRadius: 6,
    alignItems: 'center',
  },
  removeImageText: { color: '#e63946', fontFamily: 'Inter_600SemiBold' },

  typeRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  typeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  typeButtonActive: { backgroundColor: '#111', borderColor: '#111' },
  typeText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#333' },
  typeTextActive: { color: '#fff', fontFamily: 'Inter_600SemiBold' },

  submitButton: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },
});
