import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS, SIZES, FONTS } from "../../../constants";
import { Loader, SessionCard } from "../../../components";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { listBookSessions, listRatings } from "../../../graphql/queries";
import EmptyState from "../../../components/empty-state";
const numericFullMonthName = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
export default function Session({ navigation }) {
  const [headerType, setHeaderType] = useState("upcoming");
  const [trainingSession, setTrainingSession] = useState([]);
  const [trainingPastSession, setTrainingPastSession] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [sessionRating, setSessionRating] = useState([]);

  useEffect(() => {
    const screenChange = navigation.addListener("focus", async () => {
      getUserData();
    });
    return screenChange;
  }, []);

  const getUserData = async () => {
    setIsLoader(true);
    try {
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      getTrainingSession(_userInfo.attributes.sub);
      getTrainingPastSession(_userInfo.attributes.sub);
      getSessionRating(_userInfo.attributes.sub);
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
      let _sortData = {};
      let _timesData = session.data.listBookSessions.items;
      if (_timesData && _timesData.length !== 0) {
        sortData = _timesData.sort(function (a, b) {
          var first = new Date(a.appointment_date);
          var second = new Date(b.appointment_date);
          return first - second;
        });
      }

      if (sortData && sortData.length !== 0) {
        let dateGroup = groupSorting(sortData, "appointment_date");
        if (Object.keys(dateGroup).length !== 0) {
          Object.keys(dateGroup).map((_latestDate) => {
            let _array = dateGroup[_latestDate];
            _sortData[_latestDate] = [];
            if (_array.length !== 0) {
              let _currentTimes = [];
              //pass time removed
              _array.map((e) => {
                let time = e.session_slot;
                time = time.replace("am", " am");
                time = time.replace("pm", " pm");
                e.session_slot = time;
                let appointment_date = e.appointment_date;
                var varDate = new Date(appointment_date);
                if (varDate >= today) {
                  _currentTimes.push(e);
                } else {
                  let isValidTime = modifyTime(time, strTime);
                  if (isValidTime === true) {
                    _currentTimes.push(e);
                  }
                }
              });
              setTimeout(() => {
                _currentTimes.sort(function (a, b) {
                  return new Date("2022/01/01 " + a.session_slot) - new Date("2022/01/01 " + b.session_slot);
                });
                _sortData[_latestDate] = _currentTimes;
              }, 300);
            }
          });
        }
      }
      let result = [];

      setTimeout(() => {
        if (Object.keys(_sortData).length !== 0) {
          Object.keys(_sortData).map((_latestDate) => {
            let _array = _sortData[_latestDate];
            if (_array.length !== 0) {
              _array.map((e1) => result.push(e1));
            }
          });
        }
        setTrainingSession(result);
        setIsLoader(false);
      }, 500);
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
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };

  const getTrainingPastSession = async (memberId) => {
    setIsLoader(true);
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
      let mySession = await API.graphql(
        graphqlOperation(listBookSessions, {
          filter: {
            appointment_date: {
              le: date,
            },
            createdByID: {
              eq: memberId,
            },
            status: {
              eq: "Confirmed",
            },
          },
        })
      );
      let sortData = [];
      let _sortData = {};
      let _timesData = mySession.data.listBookSessions.items;
      if (_timesData && _timesData.length !== 0) {
        sortData = _timesData.sort(function (a, b) {
          var first = new Date(a.appointment_date);
          var second = new Date(b.appointment_date);
          return second - first;
        });
      }
      if (sortData && sortData.length !== 0) {
        let dateGroup = groupSorting(sortData, "appointment_date");
        if (Object.keys(dateGroup).length !== 0) {
          Object.keys(dateGroup).map((_latestDate) => {
            let _array = dateGroup[_latestDate];
            _sortData[_latestDate] = [];
            if (_array.length !== 0) {
              let _currentTimes = [];
              //pass time removed
              _array.map((e) => {
                let time = e.session_slot;
                time = time.replace("am", " am");
                time = time.replace("pm", " pm");
                e.session_slot = time;
                let appointment_date = new Date(e.appointment_date);
                if (appointment_date.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
                  let isValidTime = modifyTime(time, strTime);
                  if (isValidTime === false) {
                    _currentTimes.push(e);
                  }
                } else {
                  _currentTimes.push(e);
                }
              });
              setTimeout(() => {
                _currentTimes.sort(function (a, b) {
                  return new Date("2022/01/01 " + b.session_slot) - new Date("2022/01/01 " + a.session_slot);
                });
                _sortData[_latestDate] = _currentTimes;
              }, 300);
            }
          });
        }
      }

      let result = [];
      setTimeout(() => {
        if (Object.keys(_sortData).length !== 0) {
          Object.keys(_sortData).map((_latestDate) => {
            let _array = _sortData[_latestDate];
            if (_array.length !== 0) {
              _array.map((e1) => result.push(e1));
            }
          });
        }
        setTrainingPastSession(result);
        setIsLoader(false);
      }, 500);
    } catch (error) {
      setIsLoader(false);
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

  const getSessionRating = async (userId) => {
    setIsLoader(true);
    try {
      let ratingSession = await API.graphql(
        graphqlOperation(listRatings, {
          filter: {
            ratingMemberId: {
              eq: userId,
            },
          },
        })
      );
      setSessionRating(ratingSession.data.listRatings.items);
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
                backgroundColor: headerType === "upcoming" ? "#fff" : COLORS.grey,
              },
            ]}
            onPress={() => setHeaderType("upcoming")}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: headerType === "upcoming" ? COLORS.primary : COLORS.black100,
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
                backgroundColor: headerType === "session" ? "#fff" : COLORS.grey,
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: headerType === "session" ? COLORS.primary : COLORS.black100,
                },
              ]}
            >
              Past Sessions
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: SIZES.basePadding * 1.5, paddingBottom: 110 }}>
          {headerType === "upcoming" ? (
            <>
              {trainingSession.length === 0 ? (
                <View
                  style={{
                    paddingHorizontal: SIZES.basePadding,
                    alignSelf: "center",
                  }}
                >
                  <EmptyState content="You don't have any Upcoming Sessions" />
                </View>
              ) : (
                <SessionCard data={trainingSession} navigation={navigation} cancelSession={cancelSession} headerType={headerType} />
              )}
            </>
          ) : (
            <>
              {trainingPastSession.length === 0 ? (
                <View
                  style={{
                    paddingHorizontal: SIZES.basePadding,
                    alignSelf: "center",
                  }}
                >
                  <EmptyState content="You don't have any Past Sessions" />
                </View>
              ) : (
                <SessionCard data={trainingPastSession} ratingData={sessionRating} navigation={navigation} cancelSession={cancelSession} headerType={headerType} />
              )}
            </>
          )}
        </View>
      </View>
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
