// Imports
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
    image: 'https://picsum.photos/400?random=21',
    mrp: '₹500',
    description: 'Bluetooth Headphones - almost new.',
    contact: '9876543210',
  },
  {
    id: '2',
    image: 'https://picsum.photos/400?random=22',
    mrp: '₹1200',
    description: 'Guitar - great condition, barely used.',
    contact: '9123456780',
  },
];

export default function MarketplaceScreen() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Tinos_700Bold,
  });

  const [data, setData] = useState(initialData);
  const [desc, setDesc] = useState('');
  const [mrp, setMrp] = useState('');
  const [contact, setContact] = useState('');
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
    if (!desc.trim() || !contact.trim() || !mrp.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      image:
        pickedImage ||
        'https://picsum.photos/400?random=' + Math.floor(Math.random() * 1000),
      mrp,
      description: desc,
      contact,
    };

    setData([newItem, ...data]);
    setDesc('');
    setMrp('');
    setContact('');
    setPickedImage(null);
    closeSheet();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.mrp}>{item.mrp}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.contact}>📞 {item.contact}</Text>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* List with header */}
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <Text style={styles.marketplaceHeading}>Marketplace</Text>
            )}
          />

          {/* Floating Add Button */}
          <Pressable style={styles.fab} onPress={openSheet}>
            <Ionicons name="add" size={28} color="#fff" />
          </Pressable>

          {/* Bottom Sheet */}
          <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
            <BottomSheetView style={styles.sheetContent}>
              <ScrollView>
                <Text style={styles.modalHeading}>Add Item for Sale</Text>

                {/* Image Picker */}
                <Pressable style={styles.imagePicker} onPress={pickImage}>
                  <Ionicons name="image-outline" size={22} color="#555" />
                  <Text style={styles.imagePickerText}>
                    {pickedImage ? 'Change Image' : 'Pick an Image (optional)'}
                  </Text>
                </Pressable>

                {pickedImage && (
                  <View style={{ marginBottom: 14 }}>
                    <Image
                      source={{ uri: pickedImage }}
                      style={styles.previewImage}
                    />
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
                  placeholder="Price (MRP)"
                  value={mrp}
                  onChangeText={setMrp}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Contact Number"
                  keyboardType="phone-pad"
                  value={contact}
                  onChangeText={setContact}
                  style={styles.input}
                />

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

  marketplaceHeading: {
    fontSize: 36,
    fontFamily: 'Tinos_700Bold',
    color: '#111',
    marginBottom: 32,
  },

  card: {
    borderBottomWidth: 1,
    borderColor: '#555',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  image: { width: '100%', height: 220 },
  details: { padding: 12 },
  mrp: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#111',
    marginBottom: 6,
  },
  desc: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#333',
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#444',
  },

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

  sheetContent: { flex: 1, padding: 20 },
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

  submitButton: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },
});
