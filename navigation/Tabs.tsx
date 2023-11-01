import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movie from "../screens/Movie";
import Tv from "../screens/Tv";
import Search from "../screens/Search";
import { useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeConsumer } from "styled-components/native";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const colorMode = useColorScheme();
  return (
    <ThemeConsumer>
      {(theme) => (
        <Tab.Navigator
          screenOptions={{
            // 헤더 오른쪽에 렌더할 element return, 개별 screen option으로도 활용 가능
            // headerRight: () => <Text>HI</Text>,
            headerTitleAlign: "center",
            headerTitleStyle: { color: theme.activeColor },
            headerStyle: { backgroundColor: theme.mainBgColor },
            headerTitleStyle: { color: theme.textColor },
            tabBarStyle: { backgroundColor: theme.mainBgColor },
            tabBarLabelStyle: { fontSize: 12, fontWeight: 500, marginTop: -5 },
            tabBarActiveTintColor: theme.activeColor,
            tabBarInactiveTintColor: theme.inactiveColor,
          }}
        >
          <Tab.Screen
            name="Movies"
            component={Movie}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "film" : "film-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="TV"
            component={Tv}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "tv" : "tv-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={Search}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "search" : "search-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </ThemeConsumer>
  );
};

export default Tabs;
