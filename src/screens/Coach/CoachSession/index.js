import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS, SIZES, FONTS } from "../../../constants";
import { Loader, SessionCard, SessionRequest } from "../../../components";
import { getUser, listBookSessions } from "../../../graphql/queries";
import { API, Auth, graphqlOperation } from "aws-amplify";
import EmptyState from "../../../components/empty-state";
import { getDataWithImage } from "../../../utils";

export default function CoachSession(props) {
  const { navigation, route } = props;
  const { params } = route;

  const [headerType, setHeaderType] = useState("upcoming");
  const [upcomingSession, setUpcomingSession] = useState([]);
  const [sessionRequest, setSessionRequest] = useState([]);
  const [userName, setUserName] = useState("");
  const [totalSessionCount, setTotalSessionCount] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  useEffect(() => {
    getCurrentUser();
    const getUpcomingSession = navigation.addListener("focus", async () => {
      let session = await getUpComingSessionRequest();
      let _user = await getCurrentUser();
      setUserName(_user?.name);
      setTotalSessionCount(session ? session : 0);
    });
    return getUpcomingSession;
  }, []);

  if (params?.type) {
    const { type } = params;
    useEffect(() => {
      const screenChange = navigation.addListener("focus", async () => {
        if (type === "session") {
          setHeaderType("session");
        } else if (type === "upcoming") {
          setHeaderType("upcoming");
        }
      });
      return screenChange;
    });
  }
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
    getUpComingSessionRequest(_userInfo.attributes.sub, date);
    getSessionRequest(_userInfo.attributes.sub, date);
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
      let _sortData = {};
      let _timesData = mySession.data.listBookSessions.items;
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
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const groupSorting = (array, key) => {
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
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
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const modifyTime = (start_time, end_time) => {
    start_time = start_time.split(" ");
    var time = start_time[0].split(":");
    var stime = time[0];
    if (start_time[1] == "pm" && stime < 12) stime = parseInt(stime) + 12;
    start_time = stime + ":" + time[1] + ":00";
    end_time = end_time.split(" ");
    var time1 = end_time[0].split(":");
    var etime = time1[0];
    if (end_time[1] == "pm" && etime < 12) etime = parseInt(etime) + 12;
    end_time = etime + ":" + time1[1] + ":00";
    if (start_time != "" && end_time != "") {
      if (end_time < start_time) {
        return true;
      }
    }
    return false;
  };

  const cancelSession = (session_id) => {
    let _upSession = [...upcomingSession];
    let index = _upSession.findIndex((e) => e.id === session_id);
    _upSession.splice(index, 1);
    setUpcomingSession(_upSession);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView style={styles.container}> */}
      <StatusBar backgroundColor={COLORS.dark} />
      <View style={{ padding: SIZES.basePadding }}>
        {isLoader === true ? <Loader /> : null}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: SIZES.base,
            backgroundColor: COLORS.grey,
            borderRadius: SIZES.base,
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  headerType === "upcoming" ? "#fff" : COLORS.grey,
              },
            ]}
            onPress={() => setHeaderType("upcoming")}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    headerType === "upcoming"
                      ? COLORS.primary
                      : COLORS.black100,
                },
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setHeaderType("session")}
            style={[
              styles.button,
              {
                backgroundColor:
                  headerType === "session" ? "#fff" : COLORS.grey,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    headerType === "session" ? COLORS.primary : COLORS.black100,
                },
              ]}
            >
              New Request
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ marginTop: SIZES.basePadding * 1.5, paddingBottom: 110 }}
        >
          {headerType === "upcoming" ? (
            <>
              {!isLoader && upcomingSession.length === 0 ? (
                <View
                  style={{
                    paddingHorizontal: SIZES.basePadding,
                    alignSelf: "center",
                  }}
                >
                  <EmptyState content="You don't have any Upcoming Sessions" />
                </View>
              ) : (
                <SessionCard
                  headerType={"upcoming"}
                  data={upcomingSession}
                  navigation={navigation}
                  cancelSession={cancelSession}
                />
              )}
            </>
          ) : (
            <>
              {sessionRequest.length === 0 ? (
                <View
                  style={{
                    paddingHorizontal: SIZES.basePadding,
                    alignSelf: "center",
                  }}
                >
                  <EmptyState content="You don't have any New Session Request" />
                </View>
              ) : (
                <SessionRequest data={sessionRequest} navigation={navigation} />
              )}
            </>
          )}
        </View>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    paddingHorizontal: SIZES.base / 2,
    width: "50%",
    paddingVertical: SIZES.base * 1.2,
    borderRadius: SIZES.base,
  },
  buttonText: {
    textAlign: "center",
    ...FONTS.body2Medium,
  },
});
