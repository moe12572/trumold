import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import {
  BUTTON,
  BUTTONTEXT,
  images,
  SIZES,
  FONTS,
  COLORS,
} from "../../constants";
import ScreenName from './../../utils/ScreenName'
import { setUserSelectedRole } from "../../utils/services/StorageService";
const Welcome = ({ navigation }) => {
  
  const nextStep=(roleType)=>{
    navigation.navigate(ScreenName.LOGIN);
    setUserSelectedRole(roleType.toUpperCase())
  }

  return (
    <View style={styles.container}>
      <View       
        style={{
          width: SIZES.width,
          height: SIZES.height,
        }}
      >
        <Image
          source={images.welcomeImage}
          style={{
            width: "100%",
            height: "65%",
            resizeMode: "cover",
          }}
        />
        <View style={styles.contentWrap}>
        <Image
          source={images.logo}
          style={{
            width: 129,
            height: 105,    
            alignSelf: "center",
            marginBottom: SIZES.base*3,                    
          }}
        />
          <Text
            style={{
              ...FONTS.h1,
              color: COLORS.white,
              textAlign: "center",
            }}
          >
            Welcome to Trumold
          </Text>
          <Text
            style={{
              ...FONTS.body2,
              color: COLORS.black60,
              marginTop: SIZES.base,
              marginBottom: SIZES.basePadding * 3,
              textAlign: "center",
            }}
          >Planning your workouts and let’s achive your goals. Find the coach just is right for you.
          </Text>
          <TouchableOpacity
            onPress={() => nextStep('Member')}
            style={{ ...BUTTON.primary }}            
          >
            <Text style={{ ...BUTTONTEXT.primary }}>Member</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>nextStep('Coach')}
            style={[{ ...BUTTON.secondary }, {marginTop: SIZES.basePadding}]}            
          >
            <Text style={{ ...BUTTONTEXT.primary }}>Coach</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1918",
  },
  fullHeight: {
    height: SIZES.height,
    justifyContent: "space-between",
    paddingBottom: SIZES.base * 3,
    position: "relative",
  },
  contentWrap: {
    alignSelf: "center",
    paddingHorizontal: SIZES.base * 3,
    position: "absolute",
    bottom: SIZES.base * 6,
    textAlign: "center"
  },
  font: {
    fontFamily: "Medium",
    fontSize: 24,
    color: "#fff",
  },
});

export default Welcome;
