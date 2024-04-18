import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { FONTS, icons, images, SIZES } from "../../constants";

export default function CategoryCard(props) {
  return props.data.map((coach,index) => {
    let rating = coach.totalRating;
    let review = coach.totalReview;
    let totalRating = (rating/review).toFixed(1) 
    return (
      <TouchableOpacity key={index} style={styles.cardWrap}
       onPress={() => props.navigation.navigate("CoachProfile",{coach}) }>
        <Image
          source={coach?.image ? { uri: coach?.image } : images.userDummyImage}
          style={{
            height: 60,
            width: 60,
            resizeMode: "contain",
            borderRadius: 50,            
          }}
        />
        <View
          style={{
            marginLeft: SIZES.base * 3,            
            flex: 1,
            marginTop: 10,
          }}
        >
          <Text style={{ ...FONTS.body2Bold }}>{coach.name}</Text>
          <View style={{ flexDirection: "row", paddingVertical: SIZES.base }}>
            <View style={styles.col}>
              <Image source={icons.starIcon} style={styles.icon} />
              {coach.totalRating && coach.totalReview !== null ?
              <Text style={{ ...FONTS.smallMedium }}>{totalRating}</Text>
              :
              <Text style={{ ...FONTS.smallMedium }}>0</Text>
              }
              </View>
            <View style={styles.col}>
              <Image source={icons.locationPinIcon} style={styles.icon} />
              <Text style={{ ...FONTS.smallMedium }}>1km</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  });
}

const styles = StyleSheet.create({
  cardWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.base * 3,
  },
  col: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SIZES.basePadding,
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: "contain",
    marginRight: SIZES.base / 2 ,
  },
});
