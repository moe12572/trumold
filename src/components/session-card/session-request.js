import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, FONTS, SIZES, BUTTON, images } from "../../constants";

export default function SessionRequest(props) {
  return (
    <>
      {props.data &&
        props.data.map((session, index) => {
          return (
          <View key={index}>
            {session.status === "Cancelled" || "Confirmed" &&
              <View style={[styles.cardWrap, { marginBottom: SIZES.basePadding }]}
              key={index}>
              <View style={styles.row}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={session?.created_by_id.image ? {uri: session.created_by_id.image} : images.dummyImage}
                    style={{
                      height: 50,
                      width: 50,
                      overflow: "hidden",
                      borderRadius: 100,
                      borderWidth: 0.1,
                      borderColor: COLORS.black100,
                    }}
                  />
                  <View style={{ marginLeft: SIZES.base }}>
                    <Text style={{ ...FONTS.body2Medium, color: COLORS.dark }}>
                      {session.trainingType}
                    </Text>
                    <Text
                      style={{ ...FONTS.smallMedium, color: COLORS.black60 }}
                    >
                      By {session.created_by_id.name}
                    </Text>
                  </View>
                </View>

                {session.status == "New Request" ? (
                  <Text style={{ ...FONTS.body2Medium, color: COLORS.primary }}>
                    $ {session?.coach?.hourly_rate}
                  </Text>
                ) : (
                  <Text
                    style={{
                      ...FONTS.body2Medium,
                      color:
                        session.status === "Cancelled"
                          ? COLORS.danger
                          : COLORS.primary,
                    }}
                  >
                    {session.status}
                  </Text>
                )}
              </View>
              <View style={[styles.row]}>
                <TouchableOpacity
                  style={{ ...BUTTON.secondary, width: SIZES.width / 2.3 }}
                  onPress={() =>
                    props.navigation.navigate("RequestDetails", {
                      data: session,
                    })
                  }
                >
                   <Text
                    style={{ ...FONTS.body1Medium, color: COLORS.black100 }}
                  >
                    View Request
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      borderColor: COLORS.primary,
                    },
                  ]}
                  onPress={() =>
                    props.navigation.navigate("BookingDetails", {
                      data: session,
                    })
                  }
                >
                  <Text style={{ ...FONTS.body1Medium, color: COLORS.primary }}>
                    Booking Details
                  </Text>
                </TouchableOpacity>
              </View>
              </View>
        }
            </View>
          );
        })}
    </>
  );
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
  col: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    ...FONTS.smallBold,
    color: COLORS.dark,
  },
  icons: {
    height: 24,
    width: 24,
    resizeMode: "contain",
    marginRight: SIZES.base / 2,
  },
  button: {
    paddingHorizontal: SIZES.basePadding,
    paddingVertical: SIZES.base - 2,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: SIZES.base,
  },
});
