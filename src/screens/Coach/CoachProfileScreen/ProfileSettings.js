import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { COLORS, SIZES, icons, FONTS } from "../../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loader, PageHeader } from "../../../components";
import { getCurrentUserInfo } from "../../../utils/services/StorageService";
import { updateExpoPushToken } from "../../../components/push-notification";

export default function ProfileSettings({ navigation, route }) {
  const [isLoader, setIsLoader] = useState(false);
  const [PushIsEnabled, setPushIsEnabled] = useState(false);
  const togglePush = () => setPushIsEnabled((previousState) => !previousState);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure that you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return null;
          },
        },
        {
          text: "Confirm",
          onPress: async () => {
            await updateToken();
            setIsLoader(true);
            await Auth.signOut().catch((err) => {
              setIsLoader(false);
            });
            await AsyncStorage.clear();
            setIsLoader(false);
            navigation.replace("Onboarding");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const updateToken=async()=>{
    let user = await getCurrentUserInfo();
    let payload = {
      id: user.id,
      expoToken:'',
    };
    await updateExpoPushToken(payload);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        {isLoader ? <Loader /> : null}
        <View style={{ padding: SIZES.basePadding }}>
          <PageHeader
            title="Settings"
            navigation={navigation}
            backLink={true}
          />
          <Text style={styles.title}>General</Text>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.label}>Edit Profile</Text>
            <Image source={icons.rightArrow} style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("EditAccountInfo")}
          >
            <Text style={styles.label}>Edit Account Info</Text>
            <Image source={icons.rightArrow} style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("AccountScreen")}
          >
            <Text style={styles.label}>Payment</Text>
            <Image source={icons.rightArrow} style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Text style={styles.label}>Change Password</Text>
            <Image source={icons.rightArrow} style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("NotificationSettings")}
          >
            <Text style={styles.label}>Notification</Text>
            <Image source={icons.rightArrow} style={styles.arrow} />
          </TouchableOpacity>

          {/* <Text style={styles.title}>Availability</Text> */}

          {/* <TouchableOpacity style={styles.row}>
            <Text style={styles.label}>Set Availability </Text>
            <Image source={icons.rightArrow} style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.label}>Away Mode</Text>
            <Switch
              style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }], marginRight: -10 }}
              trackColor={{ false: COLORS.grey, true: COLORS.primary }}
              thumbColor={PushIsEnabled ? "#fff" : "#fff"}
              ios_backgroundColor={COLORS.grey}
              onValueChange={togglePush}
              value={PushIsEnabled}
            />
          </TouchableOpacity> */}

          <Text style={styles.title}>About</Text>

          <TouchableOpacity style={styles.row}>
            <Text style={styles.label}>Help and Support</Text>
            <Image source={icons.rightArrow} style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.label}>About Us</Text>
            <Image source={icons.rightArrow} style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.label}>Privacy Policy</Text>
            <Image source={icons.rightArrow} style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <Text style={styles.label}>Log Out</Text>
            <Image
              source={icons.logoutIcon}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
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
  title: {
    ...FONTS.body2,
    marginTop: SIZES.base * 3,
    color: COLORS.black40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.basePadding,
  },
  label: {
    ...FONTS.body2Medium,
  },
  arrow: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  profileImage: {
    height: 88,
    width: 88,
    // resizeMode: "contain",
    overflow: "hidden",
    borderRadius: 100,
  },
});
