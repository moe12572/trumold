import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  BUTTON,
  BUTTONTEXT,
  COLORS,
  FONTS,
  icons,
  SIZES,
} from "../../../constants";
import { PageHeader, CustomCalendar, Loader } from "../../../components";
import { sessionDateFormat } from "../../../utils";
import {
  getCurrentUserInfo,
  getUserSelectedRole,
} from "../../../utils/services/StorageService";
import ScreenName from "../../../utils/ScreenName";
import { NotificationMessageType, UserRole } from "../../../models";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { updateBookSession } from "../../../graphql/mutations";
import { getUser } from "../../../graphql/queries";
import Location from "../../../components/location";
import { sendPushNotification } from "../../../components/push-notification";
export default function RescheduleSession({ navigation, route }) {
  const { params } = route;
  const {
    id,
    trainingType,
    coachName,
    appointmentDate,
    sessionSlot,
    location,
    hourlyRate,
    userName,
    version,
    sessionTime,
    sessionIncorporateTime,
    coachId,
    userInfo,
  } = params;
  const [selectedDate, setSelectedDate] = useState("");
  const [timings, setTimings] = useState("");
  const [timeSlots, setTimeSlots] = useState("");
  const [slots, setSlots] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [screen, setScreen] = useState(ScreenName.HOMECOACH);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isLoader, setIsLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [roleType, setRoleType] = useState(UserRole.COACH);
  const [sessionDetails, setSessionDetails] = useState([]);
  useEffect(() => {
    setSelectedDate(sessionDateFormat(new Date()));
    setSlots(sessionSlot);
    setAppointmentLocation(location);
    setSelectedDate(appointmentDate);
    setTimeSlots(sessionIncorporateTime);
    setTimings(sessionTime);
    getRole();
  }, []);
  useEffect(() => {
    getUserData(appointmentDate);
    setSlots(params.sessionSlot.replace(" ", ""));
  }, []);
  const getRole = async () => {
    let role = await getUserSelectedRole();
    if (role == UserRole.MEMBER) {
      setScreen(ScreenName.MEMBERHOME);
    }
    setRoleType(role);
  };
  const sessionData = {
    timeSlots: ["30min", "45min", "1hour"],
    timings: ["Morning", "Afternoon", "Evening"],
    slots: [
      "10:00am",
      "10:30am",
      "10:45am",
      "11:00am",
      "11:30am",
      "11:45am",
      "12:00pm",
      "12:30pm",
      "12:45pm",
      "01:00pm",
      "01:30pm",
      "01:45pm",
      "02:00pm",
      "02:30pm",
      "02:45pm",
      "03:00pm",
      "03:30pm",
      "03:45pm",
      "04:00pm",
      "04:30pm",
      "04:45pm",
      "05:00pm",
      "05:30pm",
      "05:45pm",
    ],
  };

  const onPressArrowRight = (addMonth) => {
    setSelectedMonth(selectedMonth + 1);
    setIsDisabled(false);
    addMonth();
  };

  const onPressArrowLeft = (subtractMonth) => {
    subtractMonth();
    setSelectedMonth(selectedMonth - 1);
    let month = new Date().getMonth();
    if (selectedMonth - 1 === month) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };
  const getUserData = async (dateTime = selectedDate) => {
    setIsLoader(true);
    let coachid = coachId;
    let sessionId = id;
    try {
      setIsLoader(false);
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      let userId = _userInfo.attributes.sub;
      let session = await API.graphql(
        graphqlOperation(getUser, { id: userId })
      );
      let user = session.data.getUser;
      let ConfirmedSession =
        user &&
        user.BookSessionsCoach &&
        user.BookSessionsCoach.items.filter(
          (e) =>
            e.status === "Confirmed" &&
            e.coachID === coachid &&
            e.appointment_date === dateTime &&
            e.id !== sessionId
        );
      let data = ConfirmedSession.map(function ({
        appointment_date,
        // session_time,
        session_slot,
        session_incorporate_time,
        id,
      }) {
        return {
          appointment_date,
          // session_time,
          session_slot,
          session_incorporate_time,
          id,
        };
      });
      setSessionDetails(data);
    } catch (error) {
      setIsLoader(false);
      if (error.message) {
        Alert.alert(error.message);
      }
    }
  };

  const disableTimeSlots = (slot_time) => {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours < 10 ? "0" + hours : hours; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    let time = slot_time;
    time = time.replace("am", " am");
    time = time.replace("pm", " pm");
    let isValidTime = modifyTime(time, strTime);
    if (isValidTime === true) {
      return false;
    }
    return true;
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

  const bookedSlotSession = (item) => {
    var todaysDate = new Date();
    var inputDate = new Date(selectedDate);
    let isValidTime = disableTimeSlots(item);
    const index = sessionDetails.findIndex((e) => e.session_slot === item);
    if (index !== -1) {
      Alert.alert("Already booked please choose another slot");
    } else {
      if (
        isValidTime === false &&
        inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)
      ) {
        setSlots(item);
      } else {
        if (
          inputDate.setHours(0, 0, 0, 0) !== todaysDate.setHours(0, 0, 0, 0)
        ) {
          setSlots(item);
        } else {
          Alert.alert(
            "Session time expire please choose another slot or another date "
          );
        }
      }
    }
  };

  const selectedSlot = (selectedItem) => {
    const index = sessionDetails.findIndex(
      (e) =>
        e.session_slot === selectedItem &&
        e.session_slot !== params.sessionSlot.replace(" ", "")
    );
    if (index !== -1) {
      return true;
    }
    return false;
  };

  const selectSessionDate = (selectedItem = selectedDate) => {
    const index = sessionDetails.findIndex(
      (e) => e.appointment_date === selectedItem
    );
    if (index !== -1) {
      return true;
    }
    return false;
  };

  const handleBookSession = async () => {
    setIsLoader(true);
    let _user = await getCurrentUserInfo();
    try {
      let payload = {
        appointment_date: selectedDate,
        session_incorporate_time: timeSlots,
        session_time: timings,
        session_slot: slots,
        location: appointmentLocation,
        id: id,
        _version: version,
      };
      setIsLoader(false);
      if (_user.role === UserRole.COACH) {
        sendPushNotification({
          expoToken: userInfo.created_by_id.expoToken,
          title: "Reschedule Session Request",
          message: "Session rescheduled by",
          url: "",
          to: userInfo.created_by_id.id,
          messageType: NotificationMessageType.COMMON,
        });
      } else {
        if (_user.role === UserRole.MEMBER) {
          sendPushNotification({
            expoToken: userInfo.coach.expoToken,
            title: "Reschedule Session Request",
            message: "Session rescheduled by",
            url: "",
            to: userInfo.coach.id,
            messageType: NotificationMessageType.COMMON,
          });
        }
      }
      await API.graphql(
        graphqlOperation(updateBookSession, { input: payload })
      );
      navigation.navigate("RescheduleSucess");
      setModalVisible(false);
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      if (error.errors) {
        Alert.alert(error.errors[0].message);
      }
    }
  };

  const selectDateTime = (event) => {
    getUserData(event.dateString);
    setSelectedDate(event.dateString);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
        >
          <StatusBar backgroundColor={COLORS.dark} />
          <View style={{ paddingHorizontal: SIZES.basePadding }}>
            {isLoader ? <Loader /> : null}
            <PageHeader
              title="Reschedule"
              navigation={navigation}
              backLink={screen}
            />
            <View style={styles.cardWrap}>
              {/* card header */}
              <View style={styles.rows}>
                <Text style={{ ...FONTS.body2Medium, color: COLORS.dark }}>
                  {trainingType}
                </Text>
                <Text style={{ ...FONTS.body2Medium, color: COLORS.primary }}>
                  $ {hourlyRate}
                </Text>
              </View>

              {/* card body */}
              <View
                style={{
                  marginTop: SIZES.base * 0.8,
                }}
              >
                <Text style={{ ...FONTS.smallMedium, color: COLORS.black60 }}>
                  By {roleType != UserRole.COACH ? coachName : userName}
                </Text>
              </View>

              {/* card footer */}
              <View style={[styles.rows, { marginTop: SIZES.basePadding }]}>
                <View style={styles.col}>
                  <Image source={icons.clockIcon} style={styles.icons} />
                  <Text style={styles.text}>{sessionSlot}</Text>
                </View>
                <View style={styles.col}>
                  <Image source={icons.calendarIcon} style={styles.icons} />
                  <Text style={styles.text}>{appointmentDate}</Text>
                </View>
                <View style={styles.col}>
                  <Image source={icons.locationIcon} style={styles.icons} />
                  <Text style={[styles.text,{ width: 60}]} ellipsizeMode='tail' numberOfLines={1}>{location}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.title}>
              Select New Appointment Date and Time
            </Text>
            <CustomCalendar
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: COLORS.primary,
                },
              }}
              onDayPress={selectDateTime}
              minDate={new Date().toString()}
              disableArrowLeft={isDisabled}
              onPressArrowRight={onPressArrowRight}
              onPressArrowLeft={onPressArrowLeft}
            />
            <View style={styles.separator}></View>
            <View>
              <View>
                <Text style={styles.title}>Incorporate Session Time</Text>
                <View style={styles.row}>
                  {sessionData.timeSlots.map((timeSlot) => {
                    return (
                      <TouchableOpacity
                        onPress={() => setTimeSlots(timeSlot)}
                        style={[
                          styles.button,
                          {
                            backgroundColor:
                              timeSlots === timeSlot
                                ? COLORS.primary
                                : COLORS.white,
                          },
                        ]}
                        activeOpacity={0.7}
                        key={timeSlot}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            {
                              color:
                                timeSlots === timeSlot
                                  ? COLORS.white
                                  : COLORS.black100,
                            },
                          ]}
                        >
                          {timeSlot}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              {/* <View>
                <Text style={styles.title}>Select Time</Text>
              </View> */}
              {/* <View style={styles.row}>
                {sessionData.timings.map((timing) => {
                  return (
                    <TouchableOpacity
                      onPress={() => setTimings(timing)}
                      style={[
                        styles.button,
                        {
                          backgroundColor:
                            timings === timing ? COLORS.primary : COLORS.white,
                        },
                      ]}
                      activeOpacity={0.7}
                      key={timing}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          {
                            color:
                              timings === timing
                                ? COLORS.white
                                : COLORS.black100,
                          },
                        ]}
                      >
                        {timing}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View> */}
            </View>
            <View>
              <Text style={styles.title}>Select Slot</Text>
              <View style={styles.row}>
                {sessionData.slots.map((slot) => {
                  return (
                    <TouchableOpacity
                      onPress={() => bookedSlotSession(slot)}
                      style={[
                        styles.button,
                        {
                          backgroundColor:
                            slots === slot ||
                            (selectedSlot(slot) &&
                              selectSessionDate(selectedDate))
                              ? COLORS.primary
                              : COLORS.white,
                        },
                      ]}
                      activeOpacity={0.7}
                      key={slot}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          {
                            color:
                              slots === slot ? COLORS.white : COLORS.black100,
                          },
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View>
              <Text style={[styles.title, { marginBottom: 15 }]}>
                Appointment Location
              </Text>
              <Location
                onPress={(data, details = null) => {
                  setAppointmentLocation(data.description);
                }}
                placeholder="Select appointment location"
                textInputProps={{
                  onChangeText: (value) => {
                    setAppointmentLocation(value);
                  },
                  value: appointmentLocation,
                }}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={{ ...BUTTON.primary }}
            onPress={() => handleBookSession()}
          >
            <Text style={{ ...BUTTONTEXT.primary }}>Confirm Appointment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.grey,
    marginTop: SIZES.basePadding,
    marginBottom: SIZES.basePadding * 1.5,
  },
  title: {
    ...FONTS.body1Medium,
    marginTop: SIZES.basePadding,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: SIZES.basePadding,
  },
  button: {
    width: SIZES.width / 3.7,
    borderWidth: 1,
    borderColor: COLORS.grey,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZES.base,
    marginVertical: SIZES.base / 1.5,
    marginRight: SIZES.base,
  },
  buttonText: {
    ...FONTS.smallMedium,
  },
  buttonView: {
    position: "relative",
    bottom: 0,
    width: "100%",
    padding: SIZES.basePadding,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.black40,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    height: 50,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
  },
  locationImage: {
    height: 25,
    width: 25,
    marginTop: -48,
    marginLeft: "87%",
  },
  cardWrap: {
    borderColor: COLORS.grey,
    borderWidth: 1,
    padding: SIZES.basePadding,
    borderRadius: SIZES.base,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  rows: {
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
});
