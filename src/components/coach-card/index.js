import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, FONTS, icons, images, SIZES } from "../../constants";

export default function CoachCard(props) {
  return (
    props.data &&
    props.data.map((coach, index) => {
      let rating = coach.totalRating;
      let review = coach.totalReview;
      let totalRating = (rating / review).toFixed(1);
      return (
        <TouchableOpacity
          onPress={() => props.navigation.navigate("CoachProfile", { coach })}
          activeOpacity={0.7}
          style={[
            styles.cardWrap,
            index === 0 && { marginLeft: SIZES.basePadding },
          ]}
          key={index}
        >
          <Image
            source={coach.image ? { uri: coach.image } : images.userDummyImage}
            style={styles.profileImage}
          />
          <Text
            style={{
              ...FONTS.body1Bold,
              color: COLORS.dark,
              paddingTop: SIZES.base * 1.5,
              paddingBottom: SIZES.base,
              textAlign: "center",
            }}
            numberOfLines={1}
          >
            {coach?.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={icons.starIcon}
              style={{ height: 12, width: 12, marginRight: SIZES.base }}
            />
            {coach?.totalRating && coach?.totalReview !== null ? (
              <Text style={{ ...FONTS.smallBold, color: COLORS.dark }}>
                {totalRating}
              </Text>
            ) : (
              <Text style={{ ...FONTS.smallBold, color: COLORS.dark }}>0</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    })
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    width: 140,
    borderRadius: SIZES.base,
    padding: SIZES.base * 1.5,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: SIZES.base,
    alignItems: "center",
    marginRight: SIZES.basePadding,
  },
  profileImage: {
    height: 60,
    width: 60,
    overflow: "hidden",
    borderRadius: 100,
  },
});
