import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import React from "react";
import { COLORS, FONTS, icons, images, SIZES } from "../../../constants";
import { Auth } from "aws-amplify";
import { AsyncStorage } from "@aws-amplify/core";
import { SectionHeader } from "../../../components";

export default function CoachVerification({ navigation }) {
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
            await Auth.signOut().catch((err) => {});
            await AsyncStorage.clear();
            navigation.replace("Onboarding");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          color: COLORS.black100,
          ...FONTS.body2Bold,
          textAlign: "center",
          marginTop: Platform.OS == "ios" ? SIZES.basePadding : 40,
        }}
      >
        Profile Verification
      </Text>
      <View style={{ justifyContent: "center", flex: 1 }}>
        <View>
          <Image
            source={images.verificationImage}
            style={{
              height: 200,
              width: 200,
              resizeMode: "cover",
              alignSelf: "center",
              borderWidth: 0.5,
              borderColor: COLORS.black20,
              borderRadius: 100,
            }}
          />
          <Text
            style={{
              ...FONTS.body2Bold,
              textAlign: "center",
              color: COLORS.black100,
              paddingHorizontal: SIZES.basePadding,
              marginTop: SIZES.basePadding,
            }}
          >
            Profile under review!
          </Text>
          <Text
            style={{
              ...FONTS.body1Medium,
              textAlign: "center",
              color: COLORS.black60,
              paddingHorizontal: SIZES.basePadding,
              marginTop: SIZES.basePadding,
            }}
          >
            Your profile is under verification process!.
          </Text>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 10 }}
            onPress={handleLogout}
          >
            <Image source={icons.logout} style={{ height: 32, width: 32 }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
