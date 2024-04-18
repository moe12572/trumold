import { View, Text, Image } from "react-native";
import React from "react";
import { SIZES, COLORS, FONTS, icons, } from "../../constants";

export default function EmptyState(props) {
  const {content} = props;
  return (
    <View style={{ flex: 1, marginTop: SIZES.basePadding }}>
      <Image
        source={icons.emptyIcon}
        style={{
          height: 200,
          width: 200,
          resizeMode: "cover",
          alignSelf: "center",
          borderWidth:0.5,
          borderColor: COLORS.black20,
          borderRadius: 100
        }}
      />
      <Text
        style={{
          ...FONTS.body2Medium,
          textAlign: "center",
          color: COLORS.black100,
          paddingHorizontal: SIZES.basePadding,
          marginTop: SIZES.basePadding,
        }}
      >
       {content}
      </Text>
    </View>
  );
}
