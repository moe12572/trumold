import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  BUTTON,
  BUTTONTEXT,
  COLORS,
  FONTS,
  SIZES,
  icons,
} from "../../constants";
import LottieView from "lottie-react-native";

export default function SuccessComponent(props) {
  return (
    <View style={{padding: 10}}>
      <View style={{ height: 200, }}>
        <LottieView source={icons.successIcon} autoPlay loop={true} />
      </View>
      <Text style={{ ...FONTS.h1, textAlign: "center" }}>{props.title}</Text>
      <Text
        style={{
          ...FONTS.body2,
          color: COLORS.black60,
          textAlign: "center",
          marginBottom: SIZES.basePadding * 3,
          marginTop: SIZES.base,
          marginLeft: SIZES.base
        }}
      >
        {props.content}
      </Text>
      {props.buttonLink && (
        <TouchableOpacity
          style={{ ...BUTTON.primary, marginTop: SIZES.basePadding, }}
          onPress={() => props.navigation.navigate(props.buttonLink)}
        >
          <Text style={{ ...BUTTONTEXT.primary }}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
