import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Input, PageHeader } from "../../../components";
import {
  COLORS,
  FONTS,
  SIZES,
  icons,
  BUTTON,
  BUTTONTEXT,
} from "../../../constants";
import ScreenName from "../../../utils/ScreenName";

export default function PaymentMethod({ navigation }) {
  const initialValues = {
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    CVCNumber: "",
  };
  const [cardForm, setCardForm] = useState(initialValues);
  const [cardFormError, setCardFormError] = useState(initialValues);
  const handleCardChange = (value, name) => {};

  const handleNext = () => {
    navigation.reset({
      index: 0,
      routes: [
        { name: ScreenName.SUCCESS,title:"Setting Updated Sucessfuly", params: { screen: ScreenName.COACHHOME } },
      ],
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ paddingHorizontal: SIZES.basePadding }}>
          <PageHeader
            title="Payments Method"
            navigation={navigation}
            backLink={true}
          />
          <View style={{ paddingHorizontal: SIZES.base, marginTop: 20 }}>
            <PageHeader title="Add your card" />
            <Text style={{ ...FONTS.body1Medium, paddingVertical: 10 }}>
              Enter your card details
            </Text>

            <View style={{ paddingBottom: SIZES.basePadding }}>
              <Input
                placeholder="Card number"
                keyboardType="number-pad"
                onChangeText={(value) => handleCardChange(value, "cardNumber")}
                onBlur={() => {}}
                autoCapitalize="none"
                maxLength={16}
                error={cardFormError.cardNumber}
              />
              <Input
                placeholder="Card holder name"
                onChangeText={(value) => handleCardChange(value, "cardNumber")}
                onBlur={() => {}}
                autoCapitalize="none"
                maxLength={16}
                error={cardFormError.cardNumber}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignContent: "center",
                }}
              >
                <View style={{ width: "35%" }}>
                  <Input
                    placeholder="Expiry month"
                    keyboardType="number-pad"
                    onChangeText={(value) =>
                      handleCardChange(value, "expiryMonth")
                    }
                    onBlur={() => {}}
                    autoCapitalize="none"
                    maxLength={2}
                    error={cardFormError.expiryMonth}
                  />
                </View>
                <View style={{ width: "33%" }}>
                  <Input
                    placeholder="Expiry year"
                    keyboardType="number-pad"
                    onChangeText={(value) =>
                      handleCardChange(value, "expiryYear")
                    }
                    onBlur={() => {}}
                    autoCapitalize="none"
                    maxLength={2}
                    error={cardFormError.expiryYear}
                  />
                </View>
                <View style={{ width: "25%" }}>
                  <Input
                    placeholder="cvc"
                    keyboardType="number-pad"
                    onChangeText={(value) =>
                      handleCardChange(value, "CVCNumber")
                    }
                    onBlur={() => {}}
                    autoCapitalize="none"
                    maxLength={3}
                    error={cardFormError.CVCNumber}
                  />
                </View>
              </View>
              <Input
                placeholder="Optional name"
                onChangeText={(value) => handleCardChange(value, "cardNumber")}
                onBlur={() => {}}
                autoCapitalize="none"
                maxLength={16}
                error={cardFormError.cardNumber}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.modalFooter]}>
        <Pressable
          style={{
            ...BUTTON.secondary,
            borderWidth: 1,
            borderColor: COLORS.grey,
            width: SIZES.width / 2.3,
          }}
          onPress={() => {}}
        >
          <Text style={{ ...BUTTONTEXT.primary, color: COLORS.dark }}>
            Cancel
          </Text>
        </Pressable>
        <Pressable
          style={{ ...BUTTON.primary, width: SIZES.width / 2.3 }}
          onPress={handleNext}
        >
          <Text style={{ ...BUTTONTEXT.primary }}>Save & Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  modalFooter: {
    borderTopColor: COLORS.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SIZES.basePadding * 1.3,
    paddingHorizontal: SIZES.basePadding,
  },
});
