import React from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Text,
} from "react-native";
import { PageHeader } from "../../../components";
import { COLORS, FONTS, images, SIZES } from "../../../constants";

export default function BookingDetails({ navigation, route }) {
  const dummyImage = images.userDummyImage;
  const { params } = route;
  const { data } = params;
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar backgroundColor={COLORS.dark} />
          <View style={{ paddingHorizontal: SIZES.base }}>
            <PageHeader
              title="Booking Details"
              navigation={navigation}
              backLink="Home"
            />
          </View>
          <Image source={data.created_by_id.image ? {uri: data?.created_by_id.image} : dummyImage} style={styles.image} />
          <Text style={styles.title}>{data.created_by_id.name}</Text>
          <Text style={[styles.label, { alignSelf: "center" }]}>Beginner</Text>
          <View style={{ paddingHorizontal: SIZES.basePadding }}>
            <Text style={styles.heading}>Session Details</Text>
            <View style={styles.col}>
              <Text style={styles.label}>Appointment Location</Text>
            </View>
            <Text style={styles.value}>{data.location}</Text>
            <View style={styles.col}>
              <Text style={styles.label}>Appointment Date </Text>
              <Text style={styles.value}>{data.appointment_date}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Appointment Time</Text>
              <Text style={styles.value}>{data.session_slot}</Text>
            </View>

            <Text style={styles.heading}>User Details</Text>
            <View style={styles.col}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{data.created_by_id.gender}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Height</Text>
              <Text style={styles.value}>{data.created_by_id.height}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>{data.created_by_id.weight}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>User's Activeness </Text>
              <Text style={styles.value}>{data.created_by_id.current_activity_lebel}</Text>
            </View>
            {/* <View style={styles.col}>
              <Text style={styles.label}>Goal</Text>
              <Text style={styles.value}>Beach Body</Text>
            </View> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    height: 90,
    width: 90,
    borderRadius: 50,
    resizeMode: "cover",
    alignSelf: "center",
    marginTop: 15,
  },
  title: {
    alignSelf: "center",
    ...FONTS.body2Bold,
    marginTop: 10,
  },
  heading: {
    ...FONTS.body2Bold,
    color: COLORS.dark,
    paddingTop: SIZES.basePadding * 1.5,
  },
  col: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SIZES.base,
  },
  label: {
    ...FONTS.body1Medium,
    color: COLORS.black60,
  },
  value: {
    color: COLORS.dark,
    ...FONTS.body2Medium,
  },
});
