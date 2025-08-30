import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function Layout() {
  return (
    <TopTabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "marketplace") {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === "latestAnnouncements") {
            iconName = focused ? "megaphone" : "megaphone-outline";
          } else if (route.name === "lostnfound") {
            iconName = focused ? "help-buoy" : "help-buoy-outline";
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
			
			<TopTabs.Screen name="latestAnnouncements" />
      <TopTabs.Screen name="marketplace" />
			<TopTabs.Screen name="lostnfound" />
			
    </TopTabs>
  );
}
