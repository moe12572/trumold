import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SwipeRow } from "react-native-swipe-list-view";
import {
  COLORS,
  FONTS,
  SIZES,
  icons,
  BUTTON,
  BUTTONTEXT,
} from "../../constants";
import { Input } from "../../components";
import { updateBookSession } from "../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";

export default function NewSessionRequest(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmSessionModal, setConfirmSessionModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [sessionId, setSessionId] = useState([]);
  const [trainingType, setTrainingType] = useState("");
  const [coachName, setCoachName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [sessionSlot, setSessionSlot] = useState("");
  const [location, setLocation] = useState("");
  const [rate, setRate] = useState("");
  const [version, setVersion] = useState("");
  const [sessionIncorporateTime, setSessionIncorporateTime] = useState("");
  const [sessionTime, setSessionTime] = useState("");

  const cancelSession = (items) => {
    setTrainingType(items.trainingType);
    setCoachName(items.coach.name);
    setAppointmentDate(items.appointment_date);
    setSessionSlot(items.session_slot);
    setLocation(items.location);
    setSessionId(items.id);
    setRate(items.coach.hourly_rate);
    setTrainingType(items.trainingType);
    setCoachName(items.coach.name);
    setAppointmentDate(items.appointment_date);
    setSessionSlot(items.session_slot);
    setLocation(items.location);
    setSessionId(items.id);
    setRate(items.coach.hourly_rate);
    setModalVisible(true);
    setSessionIncorporateTime(items.session_incorporate_time);
    setSessionTime(items.session_time);
    setVersion(items._version);
  };

  const cancelBookSession = async () => {
    try {
      let payload = {
        id: sessionId,
        status: "Cancelled",
        _version: version,
        reason: selected,
      };
      if (selected === null) {
        Alert.alert("Please select cancelling reason");
      } else {
        let response = await API.graphql(
          graphqlOperation(updateBookSession, { input: payload })
        );
        setModalVisible(!modalVisible);
        setSelected(null);
        props.cancelSession(sessionId);
      }
    } catch (error) {
      if (error.errors) {
        Alert.alert(error.errors[0].message);
      }
    }
  };

  const confirmSession = async () => {
    try {
      let payload = {
        id: sessionId,
        status: "Confirmed",
        _version: version,
      };
      let response = await API.graphql(
        graphqlOperation(updateBookSession, { input: payload })
      );
      setConfirmSessionModal(!confirmSessionModal);
      props.navigation.navigate("ScheduleSucess");
    } catch (error) {
      if (error.errors) {
        Alert.alert(error.errors[0].message);
      }
    }
  };

  const confirmSessionRequest = (items) => {
    setTrainingType(items.trainingType);
    setCoachName(items.coach.name);
    setAppointmentDate(items.appointment_date);
    setSessionSlot(items.session_slot);
    setLocation(items.location);
    setSessionId(items.id);
    setRate(items.coach.hourly_rate);
    setConfirmSessionModal(true);
    setSessionIncorporateTime(items.session_incorporate_time);
    setSessionTime(items.session_time);
    setVersion(items._version);
  };
  const selectReason = (reason) => {
    setSelected(reason.text);
  };
  const reasons = [
    {
      text: "Dummy Reason",
    },
    {
      text: "Dummy Reason 2",
    },
    {
      text: "Dummy Reason 3",
    },
    {
      text: "Others",
    },
  ];

  return (
    <>
      {props.data &&
        props.data.map((session, index) => {
          return (
            <View key={index}>
              {session.status === "Cancelled" ||
                ("Confirmed" && (
                  <SwipeRow
                    disableRightSwipe
                    rightOpenValue={-180}
                    style={{
                      backgroundColor: "#f6f6f6",
                      marginBottom: SIZES.basePadding,
                      borderRadius: SIZES.base,
                    }}
                    key={index}
                  >
                    <View
                      style={{
                        justifyContent: "flex-end",
                        height: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => cancelSession(session)}
                        style={{
                          height: "100%",
                          justifyContent: "center",
                          width: 80,
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={icons.cancelIcon}
                          style={{
                            height: 40,
                            width: 40,
                            tintColor: COLORS.primary,
                          }}
                        />
                        <Text
                          style={{
                            ...FONTS.smallBold,
                            marginTop: SIZES.base,
                            color: COLORS.primary,
                            marginBottom: SIZES.base,
                          }}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          props.navigation.navigate("BookingDetails", {
                            data: session,
                          })
                        }
                        style={{
                          height: "100%",
                          justifyContent: "center",
                          width: 80,
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={icons.previewIcon}
                          style={{ height: 40, width: 40 }}
                        />
                        <Text
                          style={{
                            ...FONTS.smallBold,
                            marginTop: SIZES.base,
                            color: COLORS.green,
                            marginBottom: SIZES.base,
                          }}
                        >
                          Preview
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <>
                      <View style={styles.cardWrap} key={session.id}>
                        {/* card header */}
                        <View
                          style={[
                            styles.row,
                            { marginBottom: SIZES.basePadding },
                          ]}
                        >
                          <Text
                            style={{ ...FONTS.body2Medium, color: COLORS.dark }}
                          >
                            {session.trainingType}
                          </Text>
                          {session.status == "New Request" ? (
                            <Text
                              style={{
                                ...FONTS.body2Medium,
                                color: COLORS.primary,
                              }}
                            >
                              $ {session?.coach?.hourly_rate}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                ...FONTS.body2Medium,
                                color:
                                  session.status === "Cancelled"
                                    ? COLORS.danger
                                    : COLORS.primary,
                              }}
                            >
                              {session.status}
                            </Text>
                          )}
                        </View>

                        {/* card footer */}
                        <View style={styles.row}>
                          <View style={styles.col}>
                            <Image
                              source={icons.clockIcon}
                              style={styles.icons}
                            />
                            <Text style={styles.text}>
                              {session.session_slot}
                            </Text>
                          </View>
                          <View style={styles.col}>
                            <Image
                              source={icons.calendarIcon}
                              style={styles.icons}
                            />
                            <Text style={styles.text}>
                              {session.appointment_date}
                            </Text>
                          </View>
                          <View style={styles.col}>
                            <Image
                              source={icons.locationIcon}
                              style={styles.icons}
                            />
                            <Text
                              style={[styles.text, { width: 60 }]}
                              ellipsizeMode="tail"
                              numberOfLines={2}
                            >
                              {session.location}
                            </Text>
                          </View>
                        </View>
                        {session.status !== "Cancelled" && (
                          <View style={{ marginTop: 20 }}>
                            <TouchableOpacity
                              style={styles.confirmSession}
                              onPress={() => confirmSessionRequest(session)}
                            >
                              <Text
                                style={{
                                  alignSelf: "center",
                                  color: COLORS.primary,
                                  marginTop: 10,
                                  ...FONTS.body2Bold,
                                }}
                              >
                                Confirm Session Request
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </>
                  </SwipeRow>
                ))}
            </View>
          );
        })}
      {/* Confirm Session Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmSessionModal}
        onRequestClose={() => {
          setConfirmSessionModal(!confirmSessionModal);
        }}
      >
        <View style={styles.centeredView}>
          <SafeAreaView style={styles.modalView}>
            <View>
              <View style={[styles.modalHeader, styles.modalSpacing]}>
                <Text style={{ ...FONTS.body2Medium }}>
                  Confirm Appointment
                </Text>
                <Pressable
                  onPress={() => setConfirmSessionModal(!confirmSessionModal)}
                >
                  <Image
                    source={icons.closeIcon}
                    style={{ height: 24, width: 24 }}
                  />
                </Pressable>
              </View>
              <View style={[styles.modalSpacing]}>
                <Text style={{ ...FONTS.body1Bold }}>
                  Confirm or Reschedule the Session
                </Text>
                <Text
                  style={{
                    ...FONTS.body1Medium,
                    color: COLORS.black80,
                    marginTop: 5,
                  }}
                >
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                  amet sint.
                </Text>
              </View>
            </View>

            <View style={[styles.modalFooter, styles.modalSpacing]}>
              <Pressable
                style={{
                  ...BUTTON.secondary,
                  borderWidth: 1,
                  borderColor: COLORS.grey,
                  width: SIZES.width / 2.3,
                }}
                onPress={() => {
                  setConfirmSessionModal(!confirmSessionModal);
                  props.navigation.navigate("RescheduleSession", {
                    id: sessionId,
                    trainingType: trainingType,
                    coachName: coachName,
                    appointmentDate: appointmentDate,
                    sessionSlot: sessionSlot,
                    location: location,
                    hourlyRate: rate,
                    sessionIncorporateTime: sessionIncorporateTime,
                    sessionTime: sessionTime,
                    version: version,
                  });
                }}
              >
                <Text style={{ ...BUTTONTEXT.primary, color: COLORS.dark }}>
                  Re-schedule
                </Text>
              </Pressable>
              <Pressable
                style={{ ...BUTTON.primary, width: SIZES.width / 2.3 }}
                onPress={() => {
                  confirmSession();
                }}
              >
                <Text style={{ ...BUTTONTEXT.primary }}>Confirm</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Cancel Session Modal */}
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
            <View>
              <View style={[styles.modalHeader, styles.modalSpacing]}>
                <Text style={{ ...FONTS.body2Medium }}>
                  Reason For Canceling?
                </Text>
                <Pressable
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setSelected(null);
                  }}
                >
                  <Image
                    source={icons.closeIcon}
                    style={{ height: 24, width: 24 }}
                  />
                </Pressable>
              </View>
              <View style={[styles.modalBody, styles.modalSpacing]}>
                <Text
                  style={{ ...FONTS.body1Medium, paddingBottom: SIZES.base }}
                >
                  Tell us why you need to cancel your session.
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {reasons.map((reason) => {
                    return (
                      <Pressable
                        key={reason.text}
                        onPress={() => selectReason(reason)}
                        style={[
                          styles.button,
                          reason.text === selected && {
                            borderColor: COLORS.primary,
                          },
                        ]}
                      >
                        <Text style={{ ...FONTS.body1Medium }}>
                          {reason.text}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={{ marginTop: SIZES.basePadding * 1.5 }}>
                  <Text
                    style={{ ...FONTS.body1Medium, paddingBottom: SIZES.base }}
                  >
                    Tell us why You’re Canceling (Optional)
                  </Text>
                  <Input multiline={true} placeholder="Tell us Something..." />
                </View>
              </View>
            </View>
            <View style={[styles.modalFooter, styles.modalSpacing]}>
              <Pressable
                style={{
                  ...BUTTON.secondary,
                  borderWidth: 1,
                  borderColor: COLORS.grey,
                  width: SIZES.width / 2.3,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  props.navigation.navigate("RescheduleSession", {
                    id: sessionId,
                    trainingType: trainingType,
                    coachName: coachName,
                    appointmentDate: appointmentDate,
                    sessionSlot: sessionSlot,
                    location: location,
                    hourlyRate: rate,
                    sessionIncorporateTime: sessionIncorporateTime,
                    sessionTime: sessionTime,
                    version: version,
                  });
                }}
              >
                <Text style={{ ...BUTTONTEXT.primary, color: COLORS.dark }}>
                  Re-schedule
                </Text>
              </Pressable>
              <Pressable
                style={{ ...BUTTON.primary, width: SIZES.width / 2.3 }}
                onPress={() => {
                  cancelBookSession();
                }}
              >
                <Text style={{ ...BUTTONTEXT.primary }}>Confirm</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  cardWrap: {
    borderColor: COLORS.grey,
    borderWidth: 1,
    padding: SIZES.basePadding,
    borderRadius: SIZES.base,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  row: {
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
  confirmSession: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
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
  button: {
    paddingHorizontal: SIZES.basePadding * 1.5,
    paddingVertical: SIZES.base * 1.5,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: SIZES.base,
    marginBottom: SIZES.base,
    marginRight: SIZES.base,
  },
  modalFooter: {
    borderTopColor: COLORS.grey,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
