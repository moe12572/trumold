import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  BUTTON,
  BUTTONTEXT,
  COLORS,
  FONTS,
  icons,
  images,
  SIZES,
} from "../../../constants";
import { Loader, PageHeader } from "../../../components";
import { getUserSelectedRole } from "../../../utils/services/StorageService";
import { UserRole } from "../../../models";
import ScreenName from "../../../utils/ScreenName";
import { Storage } from "aws-amplify";

export default function SessionDetails({ navigation, route }) {
  const { params } = route;
  const { data } = params;
  const [screen, setScreen] = useState(ScreenName.HOMECOACH);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let rating = data.coach.totalRating;
  let review = data.coach.totalReview;
  let totalRating = (rating / review).toFixed(1);

  useEffect(() => {
    getRole();
    getUserImage();
  }, []);

  useEffect(() => {
    const screenChange = navigation.addListener("focus", async () => {
      getRole();
    });
    return screenChange;
  }, []);

  const getUserImage = async () => {
    if (data?.coach.image && data?.coach.image !== null) {
      const imageKey = await Storage.get(data?.coach.image, {
        level: "public",
      });
      setImage(imageKey);
    }
  };
  const getRole = async () => {
    setIsLoading(true);
    try {
      let role = await getUserSelectedRole();
      setIsLoading(false);
      if (role == UserRole.MEMBER) {
        setScreen(ScreenName.MEMBERHOME);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ paddingHorizontal: SIZES.basePadding }}>
          <PageHeader
            title="Booking Details"
            navigation={navigation}
            backLink={screen}
          />
          {isLoading ? <Loader /> : null}
          {/* Page Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: SIZES.basePadding,
            }}
          >
            <Image
              source={image ? { uri: image } : images.userDummyImage}
              style={{
                height: 54,
                width: 54,
                borderRadius: 54,
                resizeMode: "cover",
              }}
            />
            <View style={{ paddingLeft: SIZES.basePadding }}>
              <Text style={{ ...FONTS.body2Medium, paddingBottom: SIZES.base }}>
                {data?.coach?.name}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingRight: SIZES.basePadding,
                  }}
                >
                  <Image source={icons.starIcon} style={styles.icon} />
                  {data.coach.totalRating && data.coach.totalReview !== null ? (
                    <Text style={{ ...FONTS.smallBold }}>{totalRating}</Text>
                  ) : (
                    <Text style={{ ...FONTS.smallBold }}>0</Text>
                  )}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={icons.locationPinIcon} style={styles.icon} />
                  <Text style={{ ...FONTS.smallBold }}>1 km</Text>
                </View>
              </View>
            </View>
          </View>

          {/* card footer */}
          <View style={styles.row}>
            <View style={styles.colView}>
              <Image source={icons.clockIcon} style={styles.icons} />
              <Text style={styles.text}>{data.session_slot}</Text>
            </View>
            <View style={styles.colView}>
              <Image source={icons.calendarIcon} style={styles.icons} />
              <Text style={styles.text}>{data.appointment_date}</Text>
            </View>
            <View style={styles.colView}>
              <Image source={icons.locationIcon} style={styles.icons} />
              <Text
                style={[styles.text, { width: 60 }]}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {data.location}
              </Text>
            </View>
          </View>

          {/* page body */}
          <View>
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
            {data.paymentStatus === true ? (
              <View style={styles.col}>
                <Text style={styles.label}>Payment status</Text>
                <Text style={styles.value}>Completed</Text>
              </View>
            ) : null}
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
              <Text style={styles.value}>
                {data.created_by_id.current_activity_lebel}
              </Text>
            </View>
            {/* <View style={styles.col}>
              <Text style={styles.label}>Goal</Text>
              <Text style={styles.value}>Beach Body</Text>
            </View> */}
            <View style={styles.col}></View>
          </View>
        </View>
      </ScrollView>
      {/* {data.paymentStatus !== true ? (
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={{ ...BUTTON.primary }}
            onPress={() => navigation.navigate("PaymentScreen", { data: data })}
          >
            <Text style={{ ...BUTTONTEXT.primary }}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      ) : null}  */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: "contain",
    marginRight: SIZES.base / 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  colView: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    ...FONTS.smallBold,
    color: COLORS.dark,
  },
  icons: {
    height: 24,
    width: 24,
    resizeMode: "contain",
    marginRight: SIZES.base / 2,
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
  rowLable: {
    color: COLORS.black40,
    ...FONTS.body1Medium,
  },
  rowValue: {
    ...FONTS.body1Medium,
  },
  buttonView: {
    position: "relative",
    bottom: 0,
    width: "100%",
    padding: SIZES.basePadding,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
