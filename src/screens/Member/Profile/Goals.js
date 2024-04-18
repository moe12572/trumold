import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import React from "react";
import { COLORS, SIZES, icons, FONTS } from "../../../constants";
import { PageHeader } from "../../../components";

export default function Goals({ navigation }) {
  const goalsData = [
    {
      title: "5 Strength Workouts",
      description: "5/5 workouts completed",
      icon: icons.strengthIconFilled,
      completed: "40%",
    },
    {
      title: "Abstatic",
      description: "Do your first ab workout",
      icon: icons.abstaticIcon,
      completed: "90%",
    },
    {
      title: "Power of One",
      description: "Do workouts for a total of 1 hour",
      icon: icons.powerIcon,
      completed: "50%",
    },
    {
      title: "Collect 5000pts",
      description: "3000/5000 points collected",
      icon: icons.pointsIcon,
      completed: "70%",
    },
    {
      title: "Strong as Steel",
      description: "Complete the Strength workout",
      icon: icons.strongIcon,
      completed: "20%",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ padding: SIZES.basePadding }}>
          <PageHeader
            title="Goals"
            navigation={navigation}
            backLink="Profile"
          />
          <View style={{ alignItems: "center", marginBottom: SIZES.base * 3 }}>
            <Image
              source={icons.trophyIcon}
              style={{ height: 65, width: 48 }}
            />
            <Text
              style={{
                ...FONTS.h2,
                textAlign: "center",
                marginTop: SIZES.basePadding,
              }}
            >
              Keep it up, Will!
            </Text>
            <Text
              style={{
                ...FONTS.body2,
                color: COLORS.black60,
                textAlign: "center",
              }}
            >
              3/15 goals achived
            </Text>
          </View>

          {goalsData.map((goalItem) => {
            return (
              <View
                key={goalItem.title}
                style={{
                  borderColor: COLORS.grey,
                  borderWidth: 1,
                  borderRadius: SIZES.base,
                  padding: SIZES.basePadding,
                  flexDirection: "row",
                  marginBottom: SIZES.basePadding,
                }}
              >
                <View
                  style={{
                    height: 42,
                    width: 42,
                    borderRadius: 42,
                    backgroundColor: COLORS.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: SIZES.basePadding,
                  }}
                >
                  <Image
                    source={goalItem.icon}
                    style={{ height: 42, width: 42 }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...FONTS.body2Medium }}>{goalItem.title}</Text>
                  <Text style={{ ...FONTS.body1 }}>{goalItem.description}</Text>
                  <View
                    style={{
                      height: 5,
                      backgroundColor: COLORS.grey,
                      borderRadius: SIZES.basePadding,
                      marginTop: SIZES.base,
                    }}
                  >
                    <View
                      style={{
                        height: 5,
                        backgroundColor: COLORS.primary,
                        borderRadius: SIZES.basePadding,
                        width: goalItem.completed,
                      }}
                    ></View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
