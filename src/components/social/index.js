import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React from "react";
import { icons, SIZES, FONTS, COLORS } from "../../constants";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";

export default function SocialAccounts(props) {
  const googleSignIn = async () => {
    try {
      await Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Google,
      });
    } catch (error) {
      Alert.alert(error);
    }
  };

  const facebookSignIn = async () => {
    try {
      await Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Facebook,
      });
    } catch (error) {
      Alert.alert(error);
    }
  };
  return (
    <View style={styles.box}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: SIZES.basePadding,
        }}
      >
        <View style={styles.line}></View>
        <Text style={styles.title}>{props.title}</Text>
        <View style={styles.line}></View>
      </View>

      <View style={styles.iconsWrap}>
        <TouchableOpacity
          style={styles.iconButon}
          onPress={() => googleSignIn()}
        >
          <Image
            source={icons.googleIcon}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButon}
          onPress={() => facebookSignIn()}
        >
          <Image
            source={icons.facebookIcon}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButon}>
          <Image
            source={icons.appleIcon}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.iconButon}>
          <Image
            source={icons.twitterIcon}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButon}>
          <Image
            source={icons.linkedInIcon}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButon}>
          <Image
            source={icons.snapchatIcon}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButon}>
          <Image
            source={icons.tumblerIcon}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButon}>
          <Image
            source={icons.instagramIcon}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginVertical: SIZES.basePadding * 2,
  },
  line: {
    height: 1,
    backgroundColor: COLORS.black20,
    flex: 1,
  },
  title: {
    ...FONTS.body1,
    color: COLORS.black60,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.basePadding,
  },
  iconsWrap: {
    alignContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: SIZES.basePadding * 1.5,
  },
  iconButon: {
    height: 56,
    width: 67,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: SIZES.base * 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: SIZES.base,
    marginTop: SIZES.basePadding,
  },
});
