import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, FONTS, icons, SIZES } from "../../constants";

export default function PageHeader(props) {
  return (
    <>
      {props.type === 1 ? (
        <View style={styles.headerWrap}>
          <View>
            <Text style={{ color: COLORS.black40, ...FONTS.body1Medium }}>
              Welcome, {props.name}
            </Text>
            <Text style={{ color: COLORS.dark, ...FONTS.body1Bold }}>
              Stay Fit & Healthy
            </Text>
          </View>
          <TouchableOpacity style={{ position: "relative" }} onPress={()=> props.navigation?.navigate("Notification",{id:props.id})}>
            <Image source={icons.bellIcon} style={{ height: 32, width: 32 }} />
            <View style={styles.notificationBadge}></View>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {props.backLink && (
            <TouchableOpacity
              onPress={() => props.navigation?.goBack()}
              style={{
                height: 56,
                width: 56,
                zIndex: 10,
                justifyContent: "center",
              }}
            >
              <Image
                source={icons.backIcon}
                style={{ height: 32, width: 32, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          )}

          <Text
            style={{
              color: COLORS.dark,
              ...FONTS.body2Bold,
              textAlign: "center",
            }}
          >
            {props.title}
          </Text>
          {props.backLink && <View style={{ height: 56, width: 56 }}></View>}
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  headerWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 56,
    marginBottom: SIZES.basePadding,
  },
  notificationBadge: {
    height: 7,
    width: 7,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.base,
    position: "absolute",
    top: 10,
    right: 7,
  },
});
