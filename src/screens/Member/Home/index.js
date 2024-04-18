import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import {
  PageHeader,
  SectionHeader,
  SessionCard,
  CoachCard,
  Loader,
} from "../../../components";
import { COLORS, FONTS, SIZES } from "../../../constants";
import { useEffect, useRef } from "react";
import { useState } from "react";
import {
  getUser,
  listBanners,
  listBookSessions,
  listCategories,
  listUsers,
} from "../../../graphql/queries";
import { UserRole } from "./../../../models";
import { getDataWithImage } from "../../../utils";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../../components/push-notification";
import { onUpdateBookSession } from "../../../graphql/subscriptions";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [isShowLoader, setShowIsLoader] = useState(true);

  const [categories, setCategories] = useState([]);
  const [topCoachs, setTopCoachs] = useState([]);
  const [trainingSession, setTrainingSession] = useState([]);
  const [userId, setUserId] = useState("");

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

  //check app state

  // const { InAppMessaging } = Notifications;
  const [bannerAds, setBannerAds] = useState([]);
  useEffect(() => {
    const screenChange = navigation.addListener("focus", async () => {
      getUserData();
      getTopCoachs();
      setShowIsLoader(true);
    });
    return screenChange;
  }, []);

  useEffect(() => {
    getCategoryData();
    getBannerDetail();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateBookSession)
    ).subscribe({
      next: (data) => {
        getUserData();
      },
    });
    return () => subscription.unsubscribe();
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
  const getUserData = async () => {
    try {
      setIsLoader(true);
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      setUserId(_userInfo.attributes.sub);
      const _item = await API.graphql(
        graphqlOperation(getUser, {
          id: _userInfo.attributes.sub,
        })
      );
      getTrainingSession(_userInfo.attributes.sub);
      let item = _item.data.getUser;
      if (item !== null && Object.keys(item).length !== 0) {
        setUser(item);
      }
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const getBannerDetail = async () => {
    try {
      setIsLoader(true);
      let banner = await API.graphql(graphqlOperation(listBanners));
      if (Object.keys(banner).length !== 0) {
        let items = banner.data.listBanners.items;
        items = await getDataWithImage(items);
        setBannerAds(items);
      }
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };
  const renderAds = () => {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {bannerAds.map((ad, index) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              style={[
                {
                  marginRight: SIZES.basePadding,
                },
                index === 0 && { marginLeft: SIZES.basePadding },
              ]}
            >
              <Image
                source={{ uri: ad.image }}
                style={{
                  height: 130,
                  width: 270,
                  resizeMode: "cover",
                }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };
  const redirectToCategory = (category) => {
    navigation.navigate("CategorySingle", {
      category,
    });
  };

  const getCategoryData = async () => {
    try {
      setIsLoader(true);
      let category = await API.graphql(graphqlOperation(listCategories));
      if (Object.keys(category).length !== 0) {
        let items = category.data.listCategories.items;
        items = await getDataWithImage(items);
        setCategories(items);
      }
      setIsLoader(false);
      setShowIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const renderCategories = () => {
    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {categories &&
          categories.map((category, index) => {
            return (
              <TouchableOpacity
                onPress={() => redirectToCategory(category)}
                activeOpacity={0.7}
                key={index}
                style={[
                  {
                    paddingTop: SIZES.basePadding,
                    marginRight: SIZES.basePadding * 1.5,
                    position: "relative",
                  },
                  index === 0 && { marginLeft: SIZES.basePadding },
                ]}
              >
                {category?.tag && (
                  <View
                    style={{
                      position: "absolute",
                      right: -10,
                      top: 0,
                      backgroundColor: COLORS.primary,
                      paddingHorizontal: SIZES.base * 1.5,
                      paddingVertical: SIZES.base * 0.8,
                      borderRadius: SIZES.basePadding,
                    }}
                  >
                    <Text style={{ color: COLORS.white }}>{category?.tag}</Text>
                  </View>
                )}
                <Image
                  source={{ uri: category?.image }}
                  style={{
                    height: 80,
                    width: 80,
                    resizeMode: "contain",
                    tintColor: COLORS.primary,
                  }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    ...FONTS.body1Medium,
                    marginTop: SIZES.base,
                  }}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    );
  };

  const getTopCoachs = async () => {
    try {
      setIsLoader(true);
      let coachs = await API.graphql(
        graphqlOperation(listUsers, {
          filter: {
            role: {
              eq: UserRole.COACH,
            },
            isPaymentVerified: {
              eq: true,
            },
            isVerified: {
              eq: true,
            },
          },
        })
      );
      if (Object.keys(coachs).length !== 0) {
        let items = coachs.data.listUsers.items;
        items = await getDataWithImage(items);
        setTopCoachs(items);
      }
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const getTrainingSession = async (memberId) => {
    let today = new Date();
    let mm = numericFullMonthName[today.getMonth()];
    let dd = today.getDate();
    let year = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    let date = `${year}-${mm}-${dd}`;
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours < 10 ? "0" + hours : hours; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    try {
      setIsLoader(true);
      let session = await API.graphql(
        graphqlOperation(listBookSessions, {
          filter: {
            appointment_date: {
              ge: date,
            },
            status: {
              eq: "Confirmed",
            },
            createdByID: {
              eq: memberId,
            },
          },
        })
      );
      let sortData = [];
      let _timesData = session.data.listBookSessions.items;
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
      setTrainingSession(sortData);
      setIsLoader(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.dark} />
        <View style={{ paddingHorizontal: SIZES.basePadding }}>
          {isLoader && isShowLoader ? <Loader /> : null}
          <PageHeader
            name={user?.name}
            type={1}
            navigation={navigation}
            id={userId}
          />
        </View>
        {/* Render ads */}
        {renderAds()}
        {/* renderCategories */}
        <View
          style={{
            paddingBottom: SIZES.basePadding * 2,
            paddingTop: SIZES.basePadding,
          }}
        >
          {renderCategories()}
        </View>
        {trainingSession.length != 0 && (
          <View style={{ paddingHorizontal: SIZES.basePadding }}>
            <SectionHeader
              title="Upcoming Session"
              navigation={navigation}
              moreLink="Session"
              trainingSession={trainingSession.length}
            />
            <SessionCard
              data={trainingSession.slice(0, 3)}
              navigation={navigation}
              cancelSession={cancelSession}
              headerType={"upcoming"}
            />
          </View>
        )}
        {topCoachs.length !== 0 ? (
          <View style={{ marginBottom: SIZES.basePadding * 2 }}>
            <View
              style={{
                paddingHorizontal: SIZES.basePadding,
                marginTop: SIZES.basePadding,
              }}
            >
              <SectionHeader
                title="Top Rated Coaches"
                navigation={navigation}
                moreLink="Coachs"
                topCoachs={topCoachs.length}
              />
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <CoachCard data={topCoachs.slice(0, 5)} navigation={navigation} />
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
