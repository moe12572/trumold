import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import {
  SIZES,
  COLORS,
  icons,
  BUTTON,
  BUTTONTEXT,
} from "../../constants";

export default function Footer(props) {
  const goBack = () => {
    // props.navigation.navigate(props.backScreen);
    props.navigation.goBack();
  };
  const goNext = () => {
    if(!props.onPress){
      props.navigation.navigate(props.nextScreen);
    }else{
      props.onPress();
    }
  };
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.backBtn} onPress={goBack}>
        <Image source={icons.backArrow} style={{ height: 25, width: 25 }} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goNext}
        style={[{ ...BUTTON.primary }, styles.nextBtn]}
      >
        <Text style={{ ...BUTTONTEXT.primary }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.basePadding * 2,
  },
  backBtn: {
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 40,
  },
  nextBtn: {
    width: 154,
  },
});
