import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FONTS, SIZES } from "../../constants";

export default function SectionHeader(props) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SIZES.basePadding,
      }}
    >
      <Text style={{ ...FONTS.body2Medium }}>{props.title}</Text>
      {props.moreLink && (
        <TouchableOpacity
          onPress={() => props.navigation.navigate(props.moreLink)}
        >
          {props.topCoachs > 5 && (
            <Text style={{ ...FONTS.smallBold }}>View All</Text>
          )}
          {props.trainingSession > 3 && (
            <Text style={{ ...FONTS.smallBold }}>View All</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
