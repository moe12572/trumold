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
} from "react-native";
import React, { useState, useEffect } from "react";
import { Auth, graphqlOperation, API, Storage } from "aws-amplify";
import { COLORS, SIZES, icons, images, FONTS } from "../../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loader } from "../../../components";
import { getUser } from "../../../graphql/queries";
import { getCurrentUserInfo } from "../../../utils/services/StorageService";
import { updateUser } from "../../../graphql/mutations";

export default function Profile({ navigation, route }) {
  const [isLoader, setIsLoader] = useState(false);
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
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
            await updateExpoPushToken();
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

  async function updateExpoPushToken() {
    let user = await getCurrentUserInfo();
    let payload = {
    id: user.id,
      expoToken:'',
    };
    try {
      await API.graphql(
        graphqlOperation(updateUser, { input: payload })
      );
      return;
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    getUserData();
    if (route.params !== undefined && route.params.stateUpdated === true) {
      delete route.params.stateUpdated;
    }
  }, [route?.params?.stateUpdated]);

  const getUserData = async (form) => {
    setIsLoader(true);
    try {
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      const _item = await API.graphql(
        graphqlOperation(getUser, {
          id: _userInfo.attributes.sub,
        })
      );
      setIsLoader(false);
      let item = _item.data.getUser;
      if (item !== null && Object.keys(item).length !== 0) {
        setUser(item);
        if (item.image && item.image !== null) {
          const imageKey = await Storage.get(item.image, { level: "public" });
          setProfileImage(imageKey);
        }
      }

    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        {isLoader ? <Loader /> : null}
        <View style={{ padding: SIZES.basePadding }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={
                profileImage ? { uri: profileImage } : images.userDummyImage
              }
              style={styles.profileImage}
            />
            <Text
              style={{
                textAlign: "center",
                ...FONTS.h2,
                marginTop: SIZES.base,
              }}
            >
              {user?.name}
            </Text>
            <Text
              style={{
                textAlign: "center",
                ...FONTS.body2,
                color: COLORS.black80,
              }}
            >
              Beginner
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: SIZES.basePadding * 2,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={icons.timeClockIcon}
                style={{ height: 40, width: 40, marginBottom: SIZES.base }}
              />
              <Text
                style={{
                  ...FONTS.body2Bold,
                  paddingBottom: SIZES.base / 2,
                  textAlign: "center",
                }}
              >
                10
              </Text>
              <Text
                style={{
                  ...FONTS.small,
                  color: COLORS.black40,
                  textAlign: "center",
                }}
              >
                Total Time (h)
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Image
                source={icons.goalIcon}
                style={{ height: 40, width: 40, marginBottom: SIZES.base }}
              />
              <Text
                style={{
                  ...FONTS.body2Bold,
                  paddingBottom: SIZES.base / 2,
                  textAlign: "center",
                }}
              >
                3/28
              </Text>
              <Text
                style={{
                  ...FONTS.small,
                  color: COLORS.black40,
                  textAlign: "center",
                }}
              >
                Goals Achieved
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Image
                source={icons.badgeIcon}
                style={{ height: 40, width: 40, marginBottom: SIZES.base }}
              />
              <Text
                style={{
                  ...FONTS.body2Bold,
                  paddingBottom: SIZES.base / 2,
                  textAlign: "center",
                }}
              >
                5/15
              </Text>
              <Text
                style={{
                  ...FONTS.small,
                  color: COLORS.black40,
                  textAlign: "center",
                }}
              >
                Badge Collected
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Goals")}
            style={{
              borderColor: COLORS.grey,
              borderWidth: 1,
              borderRadius: SIZES.base,
              padding: SIZES.basePadding,
              flexDirection: "row",
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
              <Text style={{ ...FONTS.body2Bold, color: COLORS.white }}>4</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ ...FONTS.body2Medium }}>
                Almost reach, keep it up!
              </Text>
              <Text style={{ ...FONTS.body1 }}>
                3000/4500 pts to reach level 5
              </Text>
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
                    width: "60%",
                  }}
                ></View>
              </View>
            </View>
          </TouchableOpacity>

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
