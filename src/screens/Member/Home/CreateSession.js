import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  TextInput,
  Dimensions,
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
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createBookSession } from "../../../graphql/mutations";
import { getUserSelectedRole } from "../../../utils/services/StorageService";
import { NotificationMessageType, UserRole } from "../../../models";
import ScreenName from "../../../utils/ScreenName";
import { getUser } from "../../../graphql/queries";
import { sendPushNotification } from "../../../components/push-notification";
import Location from "../../../components/location";
import SelectDropdown from "react-native-select-dropdown";
const TrainingTypes = [
  {
    label: "Basic of Training",
    value: "Basic of Training",
  },
  {
    label: "Deep Crazy",
    value: "Deep Crazy",
  },
];
export default function CreateSession({ navigation, route }) {
  const { params } = route;
  const { coachDetail } = params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState("");
  const [timings, setTimings] = useState("");
  const [slots, setSlots] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [screen, setScreen] = useState(ScreenName.HOMECOACH);
  const [selectedTrainingType, setSelectedTrainingType] = useState(
    TrainingTypes[0]
  );
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [sessionDetails, setSessionDetails] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [openList, setOpenList] = useState(false);
  useEffect(() => {
    setSelectedDate(sessionDateFormat(new Date()));
    getRole();
  }, []);
  useEffect(() => {
    const screenChange = navigation.addListener("focus", async () => {
      getUserData(sessionDateFormat(new Date()));
    });
    return screenChange;
  }, []);

  const getRole = async () => {
    let role = await getUserSelectedRole();
    if (role == UserRole.MEMBER) {
      setScreen(ScreenName.MEMBERHOME);
    }
  };
  const checkAvailability = () => {
    setModalVisible(true);
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
    let id = coachDetail.id;
    try {
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
        user.BookSessions &&
        user.BookSessions.items
          .filter(
            (e) =>
              e.status === "Confirmed" &&
              e.coachID === id &&
              e.appointment_date === dateTime
          )
          .map(function ({
            appointment_date,
            // session_time,
            session_slot,
            session_incorporate_time,
          }) {
            return {
              appointment_date,
              // session_time,
              session_slot,
              session_incorporate_time,
            };
          });
      setSessionDetails(ConfirmedSession);
    } catch (error) {
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

  const selectedSlot = (selectedItem) => {
    const index = sessionDetails.findIndex(
      (e) => e.session_slot === selectedItem
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
  const handleBookSession = async () => {
    if (isLoader) {
      return;
    }
    setIsLoader(true);
    try {
      setIsLoader(true);
      const _userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      let userId = _userInfo.attributes.sub;
      let payload = {
        appointment_date: selectedDate,
        // session_time:timings,
        session_incorporate_time: timeSlots,
        session_slot: slots,
        coachID: coachDetail.id,
        createdByIDCoach: coachDetail.id,
        createdByID: userId,
        location: appointmentLocation,
        trainingType: selectedTrainingType.value,
        status: "New Request",
        paymentStatus: false,
      };
      setIsLoader(false);
      if (timeSlots === "") {
        Alert.alert("Please select session incorporate time");
      }
      // else if(timings === ""){
      //   Alert.alert("Please select time")
      // }
      else if (slots === "") {
        Alert.alert("Please select session slot");
      } else if (Object.keys(appointmentLocation).length === 0) {
        Alert.alert("Please enter location");
      } else {
        setIsLoader(true);
        navigation.navigate("PaymentScreen", {
          payload: payload,
          coach: coachDetail,
        });
        setModalVisible(false);
        setIsLoader(false);
      }
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
          keyboardShouldPersistTaps="always"
        >
          <StatusBar backgroundColor={COLORS.dark} />
          <View style={{ paddingHorizontal: SIZES.basePadding }}>
            {isLoader === true ? <Loader /> : null}
            <PageHeader
              title="Book a Session"
              navigation={navigation}
              backLink={screen}
            />
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
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* <Text style={styles.title}>Select Time</Text> */}
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => checkAvailability()}
                >
                  <Text
                    style={{
                      ...FONTS.smallMedium,
                      color: COLORS.primary,
                      marginBottom: 15,
                    }}
                  >
                    Check Coach Availability
                  </Text>
                  <Image
                    source={icons.infoIcon}
                    style={{
                      height: 16,
                      width: 16,
                      marginLeft: SIZES.base,
                      tintColor: COLORS.primary,
                    }}
                  />
                </TouchableOpacity>
              </View>
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
                      onPress={() => {
                        bookedSlotSession(slot);
                      }}
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
            </View>
            <Location
              onPress={(data, details = null) => {
                setAppointmentLocation(data.description);
              }}
              textInputProps={{
                onChangeText: (value) => {
                  setAppointmentLocation(value);
                },
                value: appointmentLocation,
              }}
              placeholder="Select appointment location"
            />
            <SelectDropdown
              data={TrainingTypes}
              onBlur={() => setOpenList(false)}
              onSelect={(selectedItem, index) => {
                setSelectedTrainingType(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                setOpenList(true);
                return item.label;
              }}
              defaultValue={selectedTrainingType}
              defaultButtonText="Select training type"
              buttonTextStyle={{
                ...FONTS.body1Bold,
                fontFamily: "Medium",
                textAlign: "left",
              }}
              buttonStyle={styles.dropdown2BtnStyle}
              rowTextStyle={{ ...FONTS.body2, color: COLORS.black60 }}
              selectedRowStyle={{ backgroundColor: COLORS.black20 }}
              renderDropdownIcon={() => {
                return (
                  <Image
                    source={openList ? icons.arrowUpIcon : icons.arrowDownIcon}
                    style={{ height: 12, width: 15 }}
                  />
                );
              }}
              dropdownIconPosition={"right"}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={{ ...BUTTON.primary }}
            onPress={handleBookSession}
          >
            <Text style={{ ...BUTTONTEXT.primary }}>
              Make Payment and Book Session
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* Coach Availability Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <SafeAreaView style={styles.modalView}>
            <View style={[styles.modalHeader, styles.modalSpacing]}>
              <Text style={{ ...FONTS.body2Medium }}>Coach Availability</Text>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Image
                  source={icons.closeIcon}
                  style={{ height: 24, width: 24 }}
                />
              </Pressable>
            </View>
            <View style={[styles.modalBody, styles.modalSpacing, { flex: 1 }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    ...FONTS.body1Medium,
                    paddingBottom: SIZES.base * 2,
                  }}
                >
                  The following slots is Coach Availability for the selected
                  date.
                </Text>
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
                  <View style={styles.row}>
                    {sessionData.timings.map((timing) => {
                      return (
                        <TouchableOpacity
                          onPress={() => setTimings(timing)}
                          style={[
                            styles.button,
                            {
                              backgroundColor:
                                timings === timing 
                                ? COLORS.primary 
                                : COLORS.white,
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
                  </View>
                </View> */}
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
                                  slots === slot
                                    ? COLORS.white
                                    : COLORS.black100,
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
              </ScrollView>
            </View>

            <View style={[styles.modalFooter, styles.modalSpacing]}>
              <Pressable
                style={{ ...BUTTON.primary }}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={{ ...BUTTONTEXT.primary }}>Book Session</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
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
  // Modal
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  modalView: {
    backgroundColor: "white",
    width: SIZES.width,
    flex: 1,
    justifyContent: "space-between",
  },
  modalSpacing: {
    paddingVertical: SIZES.basePadding * 1.3,
    paddingHorizontal: SIZES.basePadding,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,
  },
  modalFooter: {
    borderTopColor: COLORS.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInputView: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    height: 50,
    borderRadius: 10,
    paddingLeft: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationImage: {
    height: 25,
    width: 25,
    marginRight: 15,
    marginTop: 10,
  },
  buttonView: {
    position: "relative",
    bottom: 0,
    width: "100%",
    padding: SIZES.basePadding,
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdown2BtnStyle: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grey,
    width: Dimensions.get("window").width - 35,
    height: 54,
    left: 2,
    marginBottom: SIZES.basePadding,
    marginTop: SIZES.base,
  },
});
