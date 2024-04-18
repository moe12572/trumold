import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { PageHeader } from "../../../components";
import {
  COLORS,
  FONTS,
  SIZES,
  icons,
  BUTTON,
  BUTTONTEXT,
} from "../../../constants";
import ScreenName from "../../../utils/ScreenName";

export default function Payments({ navigation }) {
  const transactionData = [
    {
      icon: icons.creditIcon,
      title: "Congratulations!",
      time: "10:00 AM",
      description: "You have Credited $40 in your account",
      type: "Credit",
    },
    {
      icon: icons.debitIcon,
      title: "Debited !!",
      time: "10:00 AM",
      description: "You have Debited $40 from your acco..",
      type: "Debit",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ paddingHorizontal: SIZES.base }}>
          <PageHeader
            title="Payments"
            navigation={navigation}
            backLink={true}
          />
          <View style={styles.view}>
            <View style={styles.card}>
              <Text
                style={[
                  styles.textSession,
                  { ...FONTS.body1Bold, fontSize: 20 },
                ]}
              >
                $ 12432.02
              </Text>
              <Text style={[styles.textSession, { fontSize: 16 }]}>
                Total Earnings
              </Text>
            </View>
            <View style={[styles.card, { marginTop: 25 }]}>
              <Text
                style={[
                  styles.textSession,
                  { ...FONTS.body1Bold, fontSize: 16 },
                ]}
              >
                $ 3434.0
              </Text>

              <Text
                style={[
                  styles.textSession,
                  { ...FONTS.body1Bold, fontSize: 16 },
                ]}
              >
                $ 2433.02
              </Text>
            </View>
            <View style={styles.card}>
              <Text
                style={[
                  styles.textSession,
                  { ...FONTS.body1Medium, fontSize: 12 },
                ]}
              >
                Year to Date
              </Text>
              <Text
                style={[
                  styles.textSession,
                  { ...FONTS.body1Medium, fontSize: 12 },
                ]}
              >
                Month to Date
              </Text>
            </View>
            <View style={[styles.card, { marginTop: 10 }]}>
              <Text
                style={[
                  styles.textSession,
                  { ...FONTS.body1Bold, fontSize: 16 },
                ]}
              >
                $ 243
              </Text>

              <Text
                style={[
                  styles.textSession,
                  { ...FONTS.body1Bold, fontSize: 16 },
                ]}
              >
                $ 24
              </Text>
            </View>
            <View style={styles.card}>
              <Text
                style={[
                  styles.textSession,
                  { ...FONTS.body1Medium, fontSize: 12 },
                ]}
              >
                Week to Date
              </Text>
              <Text
                style={[
                  styles.textSession,
                  { ...FONTS.body1Medium, fontSize: 12 },
                ]}
              >
                Today
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: SIZES.base, marginTop: 20 }}>
            <PageHeader title="Recent Transaction" />
            {transactionData.map((item, index) => {
              return (
                <View
                  style={{ flexDirection: "row", marginTop: 20 }}
                  key={index}
                >
                  <Image source={item.icon} style={{ width: 50, height: 50 }} />
                  <View style={{ paddingLeft: 20, width: SIZES.width / 1.3 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={[
                          styles.textSession,
                          { ...FONTS.body1Bold, fontSize: 16 },
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={[styles.textSession, { fontSize: 14 }]}>
                        {item.time}
                      </Text>
                    </View>
                    <Text style={[{ ...FONTS.body1Medium, paddingTop: 10 }]}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonView}>
        <TouchableOpacity style={{ ...BUTTON.primary }} onPress={() => {navigation.navigate(ScreenName.PAYMENT_METHOD)}}>
          <Text style={{ ...BUTTONTEXT.primary }}>Add Card</Text>
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
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  view: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    marginHorizontal: SIZES.base,
    borderRadius: 10,
    padding: 20,
  },
  textSession: {
    ...FONTS.smallMedium,
    alignSelf: "center",
    marginTop: 5,
  },
  buttonView: {
    position: "relative",
    bottom: 0,
    width: "100%",
    padding: SIZES.basePadding,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.black40,
    borderTopWidth: 1,
  },
});
