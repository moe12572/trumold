import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { COLORS, FONTS, SIZES, icons } from "../../constants";

export default function Header(props) {
  const headings = () => {
    return (
      <>
        {props.headingInverse ? (
          <>
            {props.subHeading && (
              <Text style={{ ...FONTS.body1, color: COLORS.black80 }}>
                {props.subHeading}
              </Text>
            )}
            {props.heading && (
              <Text style={{ ...FONTS.h2 }}>{props.heading}</Text>
            )}
          </>
        ) : (
          <>
            {props.heading && (
              <Text style={{ ...FONTS.h2 }}>{props.heading}</Text>
            )}
            {props.subHeading && (
              <Text style={{ ...FONTS.body1, color: COLORS.black80 }}>
                {props.subHeading}
              </Text>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.header}>
      {props.backButton && (
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={icons.leftArrow}
            style={{ height: 24, width: 24, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      )}

      {headings()}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: SIZES.base * 2,
    paddingBottom: SIZES.base * 3,
    backgroundColor: "#fff",
  },
  backButton: {
    height: 32,
    width: 32,
    justifyContent: "center",
    marginBottom: SIZES.base,
    marginLeft: -7
  },
});
