import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { COLORS, FONTS, SIZES, images, icons } from "../../constants";
import moment from "moment";
export default function Reviews(props) {
  return props.data && props.data.map((user, index) => {
    const timeago = moment(user.createdAt).fromNow();
    return (
      <View style={[styles.cardWrap, { marginBottom: SIZES.basePadding }]} key= {index}>
        <View style={styles.row}>
          <View style={{ flexDirection: "row", paddingBottom: 10 }}>
            <Image
              source={user?.member?.image ? {uri: user.member.image} : images.dummyImage}
              style={{
                height: 50,
                width: 50,
                overflow: "hidden",
                borderRadius: 100,
              }}
            />
            <View style={{ marginLeft: SIZES.base }}>
              <Text style={{ ...FONTS.body2Medium, color: COLORS.dark }}>
               {user?.member?.name}
              </Text>
              <Text style={{ ...FONTS.smallMedium, color: COLORS.black60 }}>
               {timeago}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: -32, alignItems: "center"}}>
            <Image source={icons.starIcon} style={{ width: 15, height: 15 }} />
            {user.rating !== null ?
            <Text
              style={{
                ...FONTS.body1Medium,
                color: COLORS.black100,
                paddingHorizontal: 10,
              }}
            >
             {user.rating}
            </Text>
            :
            <Text
              style={{
                ...FONTS.body2Medium,
                color: COLORS.black100,
                paddingHorizontal: 10,
              }}
            >
             0
            </Text>
            }
          </View>
        </View>
        <Text style={{ ...FONTS.body1Medium, color: COLORS.black100 }}>
          {user.description}
        </Text>
      </View>
  );
  })
}

const styles = StyleSheet.create({
  cardWrap: {
    borderColor: COLORS.grey,
    borderWidth: 1,
    padding: SIZES.basePadding,
    borderRadius: SIZES.base,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  icons: {
    height: 24,
    width: 24,
    resizeMode: "contain",
    marginRight: SIZES.base / 2,
  },
});
