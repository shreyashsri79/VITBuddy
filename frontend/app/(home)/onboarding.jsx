import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import * as FileSystem from 'expo-file-system'
import { useRouter } from 'expo-router'   // 👈 for redirecting

export default function Onboarding() {
  const [form, setForm] = useState({
    email: '',
    name: '',
    hostel: '',
    mess: '',
    gender: ''
  })

  const router = useRouter()

  // Dropdown states
  const [hostelOpen, setHostelOpen] = useState(false)
  const [messOpen, setMessOpen] = useState(false)
  const [genderOpen, setGenderOpen] = useState(false)

  // Dropdown options
  const hostelOptions = [
    { label: 'Boys Hostel 1', value: 'BH1' },
    { label: 'Boys Hostel 2', value: 'BH2' },
    { label: 'Boys Hostel 3', value: 'BH3' },
    { label: 'Boys Hostel 4', value: 'BH4' },
    { label: 'Boys Hostel 5', value: 'BH5' },
    { label: 'Boys Hostel 6', value: 'BH6' },
    { label: 'Boys Hostel 7', value: 'BH7' },
    { label: 'Boys Hostel 8', value: 'BH8' },
    { label: 'Dining Hall 1', value: 'DH1' },
    { label: 'Dining Hall 2', value: 'DH2' },
    { label: 'Special Block', value: 'SB' },
    { label: 'Girls Hostel 1', value: 'GH1' },
    { label: 'Girls Hostel 2', value: 'GH2' }
  ]

  const messOptions = [
    { label: 'Mayuri Boys', value: 'mayuri_boys' },
    { label: 'JMB Boys', value: 'jmb_boys' },
    { label: 'CRCL Boys', value: 'crcl_boys' },
    { label: 'Safal Boys', value: 'safal_boys' },
    { label: 'AB Girls', value: 'ab_girls' },
    { label: 'Mayuri Girls', value: 'mayuri_girls' }
  ]

  const genderOptions = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' }
  ]

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'user.json'

      // Save user data
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(form, null, 2))

      Alert.alert('Saved!', 'Your info has been stored locally.')
      
      // Redirect to home (change route if needed)
      router.replace('/')
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Fill Your Info</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        {/* Hostel Dropdown */}
        <DropDownPicker
          open={hostelOpen}
          value={form.hostel}
          items={hostelOptions}
          setOpen={setHostelOpen}
          setValue={(callback) => handleChange('hostel', callback(form.hostel))}
          placeholder="Select Hostel"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={3000}
          zIndexInverse={1000}
          listMode="SCROLLVIEW"
        />

        {/* Mess Dropdown */}
        <DropDownPicker
          open={messOpen}
          value={form.mess}
          items={messOptions}
          setOpen={setMessOpen}
          setValue={(callback) => handleChange('mess', callback(form.mess))}
          placeholder="Select Mess"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={2000}
          zIndexInverse={2000}
          listMode="SCROLLVIEW"
        />

        {/* Gender Dropdown */}
        <DropDownPicker
          open={genderOpen}
          value={form.gender}
          items={genderOptions}
          setOpen={setGenderOpen}
          setValue={(callback) => handleChange('gender', callback(form.gender))}
          placeholder="Select Gender"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
          zIndexInverse={3000}
          listMode="SCROLLVIEW"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa'
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa'
  },
  dropdownContainer: {
    borderColor: '#ddd',
    borderRadius: 10
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})
