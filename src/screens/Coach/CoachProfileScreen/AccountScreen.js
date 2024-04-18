import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  AppState,
} from "react-native";
import React, { useRef } from "react";
import { Loader, SuccessComponent } from "../../../components";
import EmptyState from "../../../components/empty-state";
import { BUTTON, BUTTONTEXT, COLORS, icons, SIZES, FONTS } from "../../../constants";
import {
  getCurrentUserInfo,
  setCurrentUserInfo,
} from "../../../utils/services/StorageService";
import { useEffect } from "react";
import { useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { updateUser } from "../../../graphql/mutations";
import { getUser } from "../../../graphql/queries";
import { AWS_API_URL } from "../../../utils";
import { Image } from "react-native";

const AccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [accountID, setAccounID] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async(nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      appState.current = nextAppState;
      if(appState.current ==='active'){
        const user = await getCurrentUserInfo();
        if(!user.isPaymentVerified && user.accountId !==null){
          getStripeAccount(user);
        }
      }
      console.log('AppState', appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const getCurrentUser = async () => {
    setIsLoader(true);
    try {
      let userInfo = await getCurrentUserInfo();
      setEmail(userInfo.email);
      setUserId(userInfo.id);
      let response = await API.graphql(
        graphqlOperation(getUser, { id: userInfo.id })
      );
      setAccounID(response.data.getUser.accountId);
      setPaymentVerified(response.data.getUser.isPaymentVerified);
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      Alert.alert(error.message);
    }
  };


  const onCreateAccount = async () => {
    
    setIsLoader(true);
    if (accountID !== null) {
      setIsLoader(false);
      getAccountId(accountID);
    } else {
      let payload = {
        requestType: "createAccount",
        payload: {
          type: "express",
          email: email,
          country: "US",
        },
      };
      try {
        let response = await fetch(
         AWS_API_URL,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
        let result = await response.json();
        console.log(response,'000')
        getAccountId(result.id);
        updateAccountId(result.id);
        setIsLoader(false);
      } catch (error) {
        console.log(error,'------')
        Alert.alert(JSON.stringify(error))
        setIsLoader(false);
      }
    }
  };

  const getAccountId = async (id) => {
    let payload = {
      requestType: "createAccountLoginLink",
      accountId: id,
    };
    setIsLoader(true);
    try {
      let response = await fetch(
        AWS_API_URL,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      let result = await response.json();
      let link = result.url;
      Linking.openURL(link);
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      Alert.alert(JSON.stringify(error))
    }
  };

  const updateAccountId = async (id) => {
    let payload = {
      accountId: id,
      id: userId,
      isPaymentVerified: false,
    };
    try {
      let response = await API.graphql(
        graphqlOperation(updateUser, { input: payload })
      );
      setCurrentUserInfo(response.data.updateUser);
    } catch (error) {
    }
  };

  const getStripeAccount = async (user) => {
    setIsLoader(true);
    let payload = {
      requestType: "getAccount",
      accountId: user.accountId,
    };
    setAccounID(user.accountId);
    try {
      let response = await fetch(AWS_API_URL,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (
        result.charges_enabled === true &&
        result.details_submitted === true &&
        result.payouts_enabled === true
      ) {
        const payload = {
          id: user.id,
          isPaymentVerified: true,
        };
        setPaymentVerified(true);
        const response = await API.graphql(
          graphqlOperation(updateUser, { input: payload })
        );
        setCurrentUserInfo(response.data.updateUser);
      }
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Image
              source={icons.backIcon}
              style={{
                height: 30,
                width: 30,
                marginRight: "30%",
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              ...FONTS.body2Bold,
              color: COLORS.dark,
              textAlign: "center",
            }}
          >
            Accounts
          </Text>
        </View>
        {isLoader ? <Loader /> : null}
        {paymentVerified === true && accountID !== null ? (
          <View style={{marginTop: SIZES.basePadding * 5 }}>
          <SuccessComponent title="Payment account verified sucessfully!" 
          />
          </View>
        ) : (
          <>
            {accountID !== null ? (
              <View style={{ marginTop: SIZES.basePadding }}>
                <EmptyState content="Click on Open Link button for go to payment link" />
              </View>
            ) : (
              <View style={{ marginTop: SIZES.basePadding }}>
                <EmptyState content="You don't have any Account.Please create account." />
              </View>
            )}
          </>
        )}
      </ScrollView>
        {paymentVerified !== true ?
        <>
          {accountID !== null ? (
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={{ ...BUTTON.primary }}
                onPress={onCreateAccount}
              >
                <Text style={{ ...BUTTONTEXT.primary }}>Open Link</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={{ ...BUTTON.primary }}
                onPress={onCreateAccount}
              >
                <Text style={{ ...BUTTONTEXT.primary }}>Create Account</Text>
              </TouchableOpacity>
            </View>
          )}
          </>
          : null}
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: SIZES.basePadding,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
