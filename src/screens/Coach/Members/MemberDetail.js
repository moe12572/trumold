import React from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { PageHeader } from "../../../components";
import { COLORS, FONTS, icons, images, SIZES } from "../../../constants";

export default function MemberDetail(props) {
  const {navigation,route} = props;
  const dummyImage = images.userDummyImage;
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
              title="Linear Details"
              navigation={navigation}
              backLink="Members"
            />
        <TouchableOpacity style= {{alignSelf: "flex-end", marginTop: -40, marginRight: 10}}
        onPress={() => navigation.navigate("MessageScreen",{member_id:route.params?.member?.created_by_id?.id})}>
        <Image 
        source= {icons.messageIcons}
        style= {{ height: 30, width: 30}}/> 
        </TouchableOpacity>
          </View>
          <Image source={dummyImage} style={styles.image} />
          <Text style={styles.title}>Sevchenko</Text>
          <Text
            style={{
              ...FONTS.body1Medium,
              alignSelf: "center",
              color: COLORS.black60,
            }}
          >
            Beginner
          </Text>
          <Text
            style={{
              paddingHorizontal: SIZES.basePadding,
              marginTop: 15,
              ...FONTS.body1Bold,
            }}
          >
            Session Details
          </Text>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Appointment Location</Text>
            <Text style={styles.textSession2}>Gym</Text>
          </View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Appointment Date</Text>
            <Text style={styles.textSession2}>28/05/2016</Text>
          </View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Appointment Time</Text>
            <Text style={styles.textSession2}>08:00 AM</Text>
          </View>
          <Text
            style={{
              paddingHorizontal: SIZES.basePadding,
              marginTop: 20,
              ...FONTS.body1Bold,
            }}
          >
            User Details
          </Text>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Gender</Text>
            <Text style={styles.textSession2}>Male</Text>
          </View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Height</Text>
            <Text style={styles.textSession2}>5.5'</Text>
          </View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Weight</Text>
            <Text style={styles.textSession2}>60 Kg</Text>
          </View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>User's Activeness</Text>
            <Text style={styles.textSession2}>Moderate</Text>
          </View>
          <View style={styles.sessionContainer}>
            <Text style={styles.textSession}>Goal</Text>
            <Text style={styles.textSession2}>Beach Body</Text>
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
    marginTop: 15
  },
  title: {
    alignSelf: "center",
    ...FONTS.body2Bold,
    marginTop: 10,
  },
  sessionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.basePadding,
  },
  textSession: {
    ...FONTS.body1Medium,
    alignSelf: "center",
    color: COLORS.black60,
    marginTop: 20,
  },
  textSession2: {
    ...FONTS.body1Medium,
    alignSelf: "center",
    marginTop: 20,
  },
});
