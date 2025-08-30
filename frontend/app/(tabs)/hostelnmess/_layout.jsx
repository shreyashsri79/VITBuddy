import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
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
          if (route.name === "mess") {
            // plate/food context → restaurant
            iconName = focused ? "restaurant" : "restaurant-outline";
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <TopTabs.Screen name="mess" />
    </TopTabs>
  );
}
