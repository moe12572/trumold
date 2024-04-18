import { Text, Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, CoachSession,CoachHome, Members, Calendar, CoachProfileScreen } from "../screens";
import { COLORS, FONTS, icons, SIZES } from "../constants";
const Tab = createBottomTabNavigator();

export default function CoachTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeCoach"
      screenOptions={{
        tabBarStyle: {
          height: 80,
          paddingBottom: SIZES.basePadding * 1.5,
          paddingTop: SIZES.base,
        },
      }}
    >
      <Tab.Screen
        name="HomeCoach"
        component={CoachHome}
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
        component={CoachSession}
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
        name="Members"
        component={Members}
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
              Members
            </Text>
          ),
          tabBarIcon: (tabInfo) => (
            <Image
              source={icons.membersIcon}
              style={[
                { height: 22, width: 22 },
                tabInfo.focused && { tintColor: COLORS.primary },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
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
              Calendar
            </Text>
          ),
          tabBarIcon: (tabInfo) => (
            <Image
              source={icons.tabCalenderIcon}
              style={[
                { height: 22, width: 24 },
                tabInfo.focused && { tintColor: COLORS.primary },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CoachProfileScreen}
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
