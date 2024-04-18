import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SuccessComponent } from "../../../components";
import { BUTTON, COLORS, FONTS, SIZES } from "../../../constants";

export default function Successfull({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.dark} />
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1, paddingHorizontal: SIZES.base }}>
        <SuccessComponent
          title="Verification of the account is underway."
          content="Please wait 3-5 business days while the administrator reviews your account."
          button={true}
          //   buttonLink="MemberHome"
          navigation={navigation}
        />
        <TouchableOpacity
        style={{ ...BUTTON.primary, }}
        onPress={() => navigation.navigate("Info")}
      >
        <Text style={{ color: "white", ...FONTS.body2Medium }}>Continue</Text>
      </TouchableOpacity>
      
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
