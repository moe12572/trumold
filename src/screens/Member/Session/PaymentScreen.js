import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import { Loader, PageHeader } from "../../../components";
import { BUTTON, BUTTONTEXT, COLORS, SIZES } from "../../../constants";
import { useState } from "react";
import {
  StripeProvider,
  useConfirmPayment,
  CardForm,
} from "@stripe/stripe-react-native";
import { API, graphqlOperation } from "aws-amplify";
import { createBookSession, updateBookSession } from "../../../graphql/mutations";
import {
  AWS_API_URL,
  GRAY_MATTER_ACCOUNT_ID,
  STRIPE_PUBLIC_KEY,
  TRUMOLD_ACCOUNT_ID,
} from "../../../utils";
import { sendPushNotification } from "../../../components/push-notification";
import { NotificationMessageType } from "../../../models";
import { getCurrentUserInfo } from "../../../utils/services/StorageService";
const PaymentScreen = ({ navigation, route }) => {
  const { params } = route;
  const { payload, coach } = params;
  const [userId, setUserID] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [cardData, setCardData] = useState();
  const { loading, confirmPayment } = useConfirmPayment();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserIformation();
  }, []);

  const getUserIformation = async () => {
    let data = await getCurrentUserInfo();
    setUserID(data.id);
    setUserEmail(data.email);
  };
  const handlePayPress = async () => {
    if (!cardData) {
      Alert.alert('Card details','Please fill the card details')
      return;
    }
    const { complete } = cardData;
    if (!complete) {
      Alert.alert('Card details','Please fill the card details')
      return;
    }
    setIsLoading(true);
    try {
      let clientSecret = await fetchPaymentIntentClientSecret();
      if (clientSecret.id) {
        sendPushNotification({
          expoToken: coach.expoToken,
          title: "Payment message",
          message: `Payment done by`,
          url: "",
          to: coach.id,
          messageType: NotificationMessageType.PAYMENT,
        });
        updateUserInfo();
        await API.graphql(
            graphqlOperation(createBookSession, { input: payload })
          );
          sendPushNotification({
            expoToken: coach.expoToken,
            title: "New Session Request",
            message: payload.trainingType + " session created by",
            url: "",
            to: coach.id,
            messageType: NotificationMessageType.COMMON,
          });
        // Alert.alert("Your payment has been completed successfully ");
        navigation.navigate("ScheduleSucess");
      } else {
        Alert.alert("Payment failed");
      }
      const billingDetails = {
        email: userEmail,
      };
      /*
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        billingDetails,
      });
      console.log(paymentIntent,'paymentIntent');
      if (error) {
        Alert.alert(error.message);
      } else if (paymentIntent) {
        if (paymentIntent.status === "Succeeded") {
          sendPushNotification({
            expoToken: coach.expoToken,
            title: "Payment message",
            message: `Message by`,
            url: "",
            to: coach.id,
            messageType: NotificationMessageType.PAYMENT,
          });
          updateUserInfo();
          navigation.navigate("MemberHome");
        }
      }*/
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(error.message);
    }
  };

  const updateUserInfo = async () => {
    let payload = {
      id: userId,
      paymentStatus: true,
    };
    await API.graphql(graphqlOperation(updateBookSession, { input: payload }));
  };
  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await fetch(AWS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: "usd",
          requestType: "paymentIntent",
          amount: coach.hourly_rate,
          payload: {
            amount: coach.hourly_rate,
            coachAccountId: coach.accountId,
            grayMatterAccountId: GRAY_MATTER_ACCOUNT_ID,
            trumoldAccountId: TRUMOLD_ACCOUNT_ID,
            email: coach.email,
          },
        }),
      });
      const client_secret = await response.json();
      return client_secret;
    } catch (error) {}
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ padding: SIZES.basePadding }}>
          <PageHeader
            title="Payment Screen"
            navigation={navigation}
            backLink={true}
          />
          {isLoading ? <Loader /> : null}
          <View style={{ alignItems: "center", marginBottom: SIZES.base * 3 }}>
            <StripeProvider
              publishableKey={STRIPE_PUBLIC_KEY}
              merchantIdentifier="merchant.identifier" // required for Apple Pay
              urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            >
              <CardForm
                placeholder={{
                  number: "4242 4242 4242 4242",
                }}
                onFormComplete={(cardDetails) => {
                  setCardData(cardDetails);
                }}
                style={{
                  width: "100%",
                  height: Platform.OS === "android" ? 250 : 200,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
                cardStyle={{
                  backgroundColor: "#efefefef",
                  textAlign: "center",
                }}
              />
            </StripeProvider>
            <TouchableOpacity
              style={{ ...BUTTON.primary, top: Platform.OS === "ios" ? 0 : 15 }}
              onPress={handlePayPress}
            >
              <Text style={{ ...BUTTONTEXT.primary }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
