import { DrawerItem } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'
import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'

export const SignOutButton = ({ navigation }) => {
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <DrawerItem
      label="Sign Out"
      icon={({ color, size }) => (
        <Ionicons name="log-out-outline" size={size} color={color} />
      )}
      onPress={handleSignOut}
    />
  )
}
