import { Text, Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Session, Message, Profile } from "../screens";
import { COLORS, FONTS, icons, SIZES } from "../constants";
const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          height: 80,
          paddingBottom: SIZES.basePadding * 1.5,
          paddingTop: SIZES.base,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                { ...FONTS.body1Medium },
                { color: focused ? COLORS.primary : COLORS.dark },
              ]}
            >
              Home
            </Text>
          ),
          tabBarIcon: (tabInfo) => (
            <Image
              source={icons.homeIcon}
              style={[
                { height: 24, width: 24 },
                tabInfo.focused && { tintColor: COLORS.primary },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Session"
        component={Session}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                { ...FONTS.body1Medium },
                { color: focused ? COLORS.primary : COLORS.dark },
              ]}
            >
              Session
            </Text>
          ),
          tabBarIcon: (tabInfo) => (
            <Image
              source={icons.sessionIcon}
              style={[
                { height: 24, width: 24 },
                tabInfo.focused && { tintColor: COLORS.primary },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                { ...FONTS.body1Medium },
                { color: focused ? COLORS.primary : COLORS.dark },
              ]}
            >
              Message
            </Text>
          ),
          tabBarIcon: (tabInfo) => (
            <Image
              source={icons.messageIcon}
              style={[
                { height: 24, width: 24 },
                tabInfo.focused && { tintColor: COLORS.primary },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                { ...FONTS.body1Medium },
                { color: focused ? COLORS.primary : COLORS.dark },
              ]}
            >
              Profile
            </Text>
          ),
          tabBarIcon: (tabInfo) => (
            <Image
              source={icons.profileIcon}
              style={[
                { height: 24, width: 24 },
                tabInfo.focused && { tintColor: COLORS.primary },
              ]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
