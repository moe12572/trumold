import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  AppState,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Loader, SessionCard, SessionRequest } from "../../../components";
import { COLORS, FONTS, icons, SIZES } from "../../../constants";
import ScreenName from "../../../utils/ScreenName";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getUser, listBookSessions } from "../../../graphql/queries";
import EmptyState from "../../../components/empty-state";
import { AWS_API_URL, getDataWithImage } from "../../../utils";

import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../../components/push-notification";
import {
  onCreateBookSession,
  onUpdateBookSession,
} from "../../../graphql/subscriptions";
import { setCurrentUserInfo } from "../../../utils/services/StorageService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Home({ navigation }) {
  const [userName, setUserName] = useState("");
  const [upcomingSession, setUpcomingSession] = useState([]);
  const [sessionRequest, setSessionRequest] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [isShowLoader, setShowIsLoader] = useState(true);
  const [userId, setUserId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);
  //push notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  //end notification

  useEffect(() => {
    const screenChange = navigation.addListener("focus", async () => {
      getCurrentUser();
      setShowIsLoader(true);
    });
    return screenChange;
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateBookSession)
    ).subscribe({
      next: (data) => {
        getCurrentUser();
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const numericFullMonthName = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  let today = new Date();
  const getCurrentUser = async () => {
    setIsLoader(true);
    let mm = numericFullMonthName[today.getMonth()];
    let dd = today.getDate();
    let year = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    let date = `${year}-${mm}-${dd}`;
    const _userInfo = await Auth.currentAuthenticatedUser({
      bypassCache: true,
    });
    setUserId(_userInfo.attributes.sub);
    let existUser = await API.graphql(
      graphqlOperation(getUser, { id: _userInfo.attributes.sub })
    );
    getUpComingSessionRequest(_userInfo.attributes.sub, date);
    getSessionRequest(_userInfo.attributes.sub, date);
    let user = existUser.data.getUser;
    if(user.accountId !==null || (!user.isPaymentVerified)){
      getStripeAccount(user,_userInfo.attributes.sub);
    }else{
      handlePaymentStatus(
        user.isPaymentVerified ? user.isPaymentVerified : false
      );
    }
    setUserName(user.name);
  };

  const getStripeAccount = async (user, userId) => {
    let payload = {
      requestType: "getAccount",
      accountId: user.accountId,
    };
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
        if(user.isPaymentVerified){
          return
        }
        const payload = {
          id: userId,
          isPaymentVerified: true,
        };
        const response = await API.graphql(
          graphqlOperation(updateUser, { input: payload })
        );
        setCurrentUserInfo(response.data.updateUser);
      }else if(!user.isPaymentVerified){
        handlePaymentStatus(
          user.isPaymentVerified ? user.isPaymentVerified : false
        );
      }
    } catch (error) {
      setIsLoader(false);
    }
  };

  const handlePaymentStatus = (pStatus) => {
    if (pStatus == false) {
      Alert.alert(
        "Payment Account Setup",
        "Your profile is successfully created but you have to setup your Payment account so the members can see your profile and book sessions with you. Please go to Profile and click on settings icon then go to the Payment tab"
      );
    }
  };

  const getUpComingSessionRequest = async (coachId, date) => {
    let todayDate = new Date();
    let hours = todayDate.getHours();
    let minutes = todayDate.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours < 10 ? "0" + hours : hours; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    try {
      setIsLoader(true);
      let mySession = await API.graphql(
        graphqlOperation(listBookSessions, {
          filter: {
            coachID: {
              eq: coachId,
            },
            status: {
              eq: "Confirmed",
            },
            appointment_date: {
              ge: date,
            },
          },
        })
      );
      let sortData = [];
      let _timesData = mySession.data.listBookSessions.items;
      _timesData = await getDataWithImage(_timesData);
      if (_timesData && _timesData.length !== 0) {
        sortData = _timesData.sort(function (a, b) {
          var firstDate = new Date(a.appointment_date);
          var secondDate = new Date(b.appointment_date);

          if (firstDate.getTime() !== secondDate.getTime()) {
            return firstDate - secondDate;
          } else {
            var firstTime = convertTimeTo24HourFormat(a.session_slot);
            var secondTime = convertTimeTo24HourFormat(b.session_slot);
            return firstTime.localeCompare(secondTime);
          }
        });
      }

      function convertTimeTo24HourFormat(time) {
        var hours = parseInt(time.slice(0, 2));
        var minutes = parseInt(time.slice(3, 5));
        var period = time.slice(5).toLowerCase();

        if (period === "pm" && hours < 12) {
          hours += 12;
        } else if (period === "am" && hours === 12) {
          hours = 0;
        }

        return (
          hours.toString().padStart(2, "0") +
          ":" +
          minutes.toString().padStart(2, "0")
        );
      }
      setUpcomingSession(sortData);
      setIsLoader(false);
      setShowIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const getSessionRequest = async (coachId, date) => {
    try {
      let mySession = await API.graphql(
        graphqlOperation(listBookSessions, {
          filter: {
            coachID: {
              eq: coachId,
            },
            status: {
              eq: "New Request",
            },
            appointment_date: {
              ge: date,
            },
          },
        })
      );
      if (Object.keys(mySession).length !== 0) {
        let items = mySession.data.listBookSessions.items;
        items = await getDataWithImage(items);
        setSessionRequest(mySession.data.listBookSessions.items);
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const cancelSession = (session_id) => {
    let _upSession = [...upcomingSession];
    let index = _upSession.findIndex((e) => e.id === session_id);
    _upSession.splice(index, 1);
    setUpcomingSession(_upSession);
  };

  const header = () => {
    return (
      <View style={styles.headerWrap}>
        <View>
          <Text style={{ color: COLORS.black40, ...FONTS.body1Medium }}>
            Welcome, {userName}
          </Text>
          <Text style={{ color: COLORS.dark, ...FONTS.body1Bold }}>
            Stay Fit & Healthy
          </Text>
        </View>
        <View style={styles.headerWrap}>
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={() => navigation.navigate(ScreenName.MESSAGESCREEN)}
          >
            <Image
              source={icons.messageIcons}
              style={{ height: 32, width: 32 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={() => navigation.navigate("Notification", { id: userId })}
          >
            <Image source={icons.bellIcon} style={{ height: 32, width: 32 }} />
            <View style={styles.notificationBadge}></View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ paddingHorizontal: SIZES.basePadding }}>{header()}</View>
        {isShowLoader && isLoader ? <Loader /> : null}

        {upcomingSession.length === 0 && sessionRequest.length === 0 ? (
          <View
            style={{
              paddingHorizontal: SIZES.basePadding,
              alignSelf: "center",
            }}
          >
            <EmptyState content="You don't have any Upcoming Sessions" />
          </View>
        ) : (
          <>
            {upcomingSession.length !== 0 ? (
              <View style={{ paddingHorizontal: SIZES.basePadding }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: SIZES.basePadding,
                  }}
                >
                  <Text style={{ ...FONTS.body2Medium }}>Upcoming Session</Text>
                  {upcomingSession.length > 5 && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Session", { type: "upcoming" })
                      }
                    >
                      <Text style={{ ...FONTS.smallBold }}>View All</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <SessionCard
                  data={upcomingSession.slice(0, 5)}
                  navigation={navigation}
                  cancelSession={cancelSession}
                  headerType={"upcoming"}
                />
              </View>
            ) : null}

            {sessionRequest.length !== 0 && (
              <View style={{ paddingHorizontal: SIZES.basePadding }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: SIZES.basePadding,
                  }}
                >
                  <Text style={{ ...FONTS.body2Medium }}>Session Request</Text>
                  {sessionRequest.length > 3 && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Session", { type: "session" })
                      }
                    >
                      <Text style={{ ...FONTS.smallBold }}>View All</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <SessionRequest
                  data={sessionRequest.slice(0, 3)}
                  navigation={navigation}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 56,
    marginBottom: SIZES.basePadding,
  },
  notificationBadge: {
    height: 7,
    width: 7,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.base,
    position: "absolute",
    top: 10,
    right: 7,
  },
});
